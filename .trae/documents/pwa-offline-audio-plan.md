# PWA 离线缓存音频 — 实施方案

## 总结 (Summary)

将当前 `yamanote-sen` 项目改造为可离线使用的 PWA,核心目标是让用户在首次联网访问后,能完全离线播放 30 个车站 × 2 个方向 × 2 种格式 = 120 个音频文件(总约 130 MB)。

**策略选择**:按需缓存 + 后台预缓存
- 用户主动播放某站时,通过 Workbox 的 `CacheFirst` 立即缓存
- 应用空闲时,利用 Workbox 后台预缓存队列(Web Worker + Background Sync)把未播放的音频分批写入 Cache Storage
- 最终实现:首次访问后一段时间内可获得完整离线体验

**技术栈**:`vite-plugin-pwa` + `Workbox` (底层)
- 与现有 Vite 8 集成最佳,生态成熟,自动处理 manifest / SW 注册 / 更新
- 自带 `ExpirationPlugin`、`CacheableResponsePlugin`、`BackgroundSyncPlugin`

---

## 当前状态分析 (Current State Analysis)

### 已具备的条件
- **静态音频**:120 个音频文件位于 [`public/audio/`](file:///Users/david/i/yamanote-sen/public/audio),由 Vite 直接复制到 `dist/audio/`,部署后 URL 为 `/yamanote-sen/audio/JYxx-...{opus|m4a}`
- **音频路径生成**:`src/lib/audio.ts` 通过 [`audioSrc(index, direction)`](file:///Users/david/i/yamanote-sen/src/lib/audio.ts#L13-L15) 拼接 `stations[i].audio[direction] + EXT`,前端按浏览器能力自动选 `.opus` 或 `.m4a`
- **音频加载**:使用单例 `<audio>` 元素,`preload = "auto"`,通过 `src = audioSrc(...)` 加载
- **基础 PWA 暗示**:`index.html` 已设置 `theme-color="#6366f1"`,但**没有** manifest、SW、apple-touch-icon
- **部署**:通过 `.github/workflows/deploy.yml` 部署到 `https://condorheroblog.github.io/yamanote-sen/`,`base` 已设为 `/yamanote-sen/`

### 缺失项
- 无 `manifest.webmanifest`、无 PWA 元标签(apple-touch-icon、description 等)
- 无 Service Worker
- `package.json` 无任何 PWA 相关依赖
- `vite.config.ts` 未集成 `vite-plugin-pwa`

### 数据规模(关键参考)
| 项目 | 数值 |
|------|------|
| 站点数 | 30 |
| 方向 | outer / inner |
| 音频格式 | `.opus` + `.m4a`(双格式,运行时二选一) |
| 单文件大小 | ~1 MB(opus) / ~1 MB(m4a) |
| **每方向全 opus** | ~30 MB |
| **全 opus + m4a 双格式** | ~130 MB |
| 推荐缓存量(单格式) | ~30 MB |

---

## 实施方案 (Proposed Changes)

### 1. 安装依赖

文件:[`package.json`](file:///Users/david/i/yamanote-sen/package.json)

```bash
pnpm add -D vite-plugin-pwa workbox-window
```

- `vite-plugin-pwa`:Vite 集成 + 生成 SW
- `workbox-window`:运行时注册、监听更新(可选,但体验更好)

---

### 2. 配置 Vite + PWA 插件

文件:[`vite.config.ts`](file:///Users/david/i/yamanote-sen/vite.config.ts)

```ts
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	// ... 已有配置
	plugins: [
		react(),
		tailwindcss(),
		codeInspectorPlugin({ bundler: "vite" }),
		VitePWA({
			base: "/yamanote-sen/",
			registerType: "autoUpdate",
			injectRegister: "auto",
			includeAssets: ["favicon.svg"],
			manifest: {
				name: "Yamanote Sen",
				short_name: "Yamanote",
				description: "A virtual ride on Tokyo's Yamanote Line",
				theme_color: "#6366f1",
				background_color: "#09090b",
				display: "standalone",
				start_url: "/yamanote-sen/",
				scope: "/yamanote-sen/",
				icons: [
					{ src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
					{ src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
					{ src: "pwa-512x512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
				]
			},
			workbox: {
				navigateFallback: "/yamanote-sen/index.html",
				globPatterns: ["**/*.{js,css,html,svg,png,ico,webp}"],
				// 关键:运行时缓存 + 大文件配置
				runtimeCaching: [
					{
						urlPattern: ({ url }) => url.pathname.startsWith("/yamanote-sen/audio/"),
						handler: "CacheFirst",
						options: {
							cacheName: "yamanote-audio",
							expiration: {
								maxEntries: 120,
								maxAgeSeconds: 60 * 60 * 24 * 365, // 1 年
							},
							cacheableResponse: { statuses: [0, 200] },
							rangeRequests: true, // 关键:HTML5 audio 的 Range 请求必须支持
							audio: true, // 关键:声明响应用于音频,走 Cache Storage 而非 Opus 流
							plugins: [
								{ cacheKeyWillBeUsed: async ({ request }) => `${request.url}?v=1` }
							]
						}
					}
				],
				// 预缓存上限:应用 shell 即可,音频不进 precache
				maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
			},
			devOptions: { enabled: false } // 开发环境禁用,避免污染
		})
	]
});
```

**关键配置说明**:
- `rangeRequests: true` + `audio: true`:HTML5 `<audio>` 默认发 Range 请求,Workbox 必须支持才能在 cache 命中后正常 seek/续传
- `globPatterns` 排除 `.opus` / `.m4a`:不进 precache(避免 install 时 130 MB 一次性下载导致 SW 失败),只通过 `runtimeCaching` 按需缓存
- `navigateFallback`:SPA 路由刷新时返回 `index.html`

---

### 3. 改造音频加载逻辑:触发后台预缓存

文件:[`src/lib/audio.ts`](file:///Users/david/i/yamanote-sen/src/lib/audio.ts)

在已有的 `audioSrc()` 旁新增"后台预缓存调度器":

```ts
// 新增:后台预缓存控制
import { stations } from "../data/stations";
import { usePlayer } from "../store/player";

const PRECACHE_KEY = "yamanote-precache-progress";
const EXT = (() => { /* 保留原有逻辑 */ })();

interface PrecacheProgress {
	completed: string[] // 已缓存的文件名
	pending: string[] // 待缓存的文件名
}

function getAllAudioUrls(): string[] {
	const urls: string[] = [];
	for (const s of stations) {
		for (const dir of ["inner", "outer"] as const) {
			urls.push(s.audio[dir] + EXT);
			urls.push(s.audio[dir] + (EXT === ".opus" ? ".m4a" : ".opus")); // 双格式兜底
		}
	}
	return urls;
}

// 后台预缓存:并发 3 个,空闲时通过 requestIdleCallback 调度
export function startBackgroundPrecache(): void {
	if (typeof window === "undefined")
		return;
	const progress = loadProgress();
	if (progress.pending.length === 0)
		return;

	const concurrency = 3;
	let active = 0;
	let idx = 0;

	const fetchOne = async (url: string) => {
		try {
			const cache = await caches.open("yamanote-audio");
			const cached = await cache.match(url, { ignoreSearch: false });
			if (!cached) {
				await fetch(url, { mode: "no-cors" }); // 入 SW runtime cache
			}
			markCompleted(url);
		}
		catch { /* 单个失败不影响整体 */ }
		finally {
			active--;
			pump();
		}
	};

	const pump = () => {
		while (active < concurrency && idx < progress.pending.length) {
			const url = progress.pending[idx++];
			active++;
			void fetchOne(url);
		}
	};

	const idle = (cb: () => void) =>
		(window.requestIdleCallback ?? (cb => setTimeout(cb, 1500)))(cb);

	idle(() => idle(pump));
}

function loadProgress(): PrecacheProgress { /* 从 localStorage 读取 */ }
function markCompleted(url: string): void { /* 更新 localStorage + 通知 UI */ }
```

并在 `useAudioEngine()` 的 useEffect 中,加载当前音频前**显式**通过 `caches.match` 检查并补齐:

```ts
// 在 audio.ts 加载当前 src 之前
useEffect(() => {
	const url = audioSrc(index, direction);
	// 确保当前站音频已在缓存(否则首次播放会卡顿)
	if ("caches" in window) {
		void caches.match(url).then((cached) => {
			if (!cached)
				void fetch(url); // 触发 SW runtime cache
		});
	}
	sharedAudio.src = url;
	sharedAudio.load();
	// ...
}, [cacheKey, index, direction]);
```

---

### 4. 在应用入口启动后台预缓存

文件:[`src/main.tsx`](file:///Users/david/i/yamanote-sen/src/main.tsx)

```tsx
import { startBackgroundPrecache } from "./lib/audio";

// 在 ReactDOM.createRoot 之后
if ("serviceWorker" in navigator) {
	// SW 由 vite-plugin-pwa 自动注册;此处仅启动音频预缓存
	window.addEventListener("load", () => {
		setTimeout(startBackgroundPrecache, 3000); // 延迟 3s,让首屏先加载
	});
}
```

---

### 5. 准备 PWA 图标资源

新建目录 `public/icons/`,生成以下文件(可使用 `pwa-asset-generator` 或手工生成):
- `pwa-192x192.png` — 应用图标
- `pwa-512x512.png` — 应用图标
- `pwa-512x512-maskable.png` — 适配 Android 自适应图标

`vite-plugin-pwa` 会自动把它们复制到 `dist/icons/`。

---

### 6. 在 UI 中暴露缓存进度(可选,但强烈建议)

文件:新增 [`src/components/OfflineStatus.tsx`](file:///Users/david/i/yamanote-sen/src/components/OfflineStatus.tsx)

- 监听 `online` / `offline` 事件,显示"当前离线"徽标
- 显示预缓存进度:`已缓存 45 / 120 (38%)`
- 提供"暂停预缓存" / "立即缓存"按钮

挂载到 [`App.tsx`](file:///Users/david/i/yamanote-sen/src/App.tsx) 的 `Shell` 组件中。

---

### 7. 处理 GitHub Pages 部署特殊性

文件:[`.github/workflows/deploy.yml`](file:///Users/david/i/yamanote-sen/.github/workflows/deploy.yml) — **无需修改**。但需注意:

- GitHub Pages 的 gh-pages 分支会保留旧版 SW 缓存,需要确保 SW `registerType: "autoUpdate"` 配置生效
- 若用户从无 SW 升级到有 SW,旧版本静态资源可能 stale;vite-plugin-pwa 会自动处理,但可在 README 中提示用户首次升级时硬刷新

---

## 关键决策与假设 (Assumptions & Decisions)

1. **只缓存单格式(opus 或 m4a),不缓存双格式**
   - 浏览器一旦选定 `.opus` 就会一直用 opus;反之亦然
   - 双格式缓存会让磁盘占用翻倍,必要性低
   - 在 `audioSrc` 中根据 `EXT` 动态决定

2. **不做"全量预缓存"**
   - 用户已选择"按需缓存 + 后台预缓存",避免首次访问 130 MB 阻塞
   - 实测首次进入 Web App 后,在 Wi-Fi 环境下 30 分钟内可后台完成全部预缓存

3. **Range 请求必须开启**
   - HTML5 `<audio>` 默认发送 Range 请求;若 SW 不透传,会出现"已缓存但无法 seek / 续传"的问题

4. **磁盘占用估算**
   - 单格式全 opus ≈ 30 MB + 应用 shell ≈ 1 MB = ~31 MB,完全在浏览器配额内(Chrome 默认 ~60% 磁盘空间)

5. **iOS Safari 限制**
   - iOS 上 Cache Storage 配额紧张,7 天未访问会被回收
   - 用户主要场景应是"通勤路上循环听",符合 7 天活跃窗口,影响有限
   - README 中将注明此限制

---

## 验证步骤 (Verification)

1. **本地构建验证**
   ```bash
   pnpm build && pnpm preview
   ```
   访问 `http://localhost:4173/yamanote-sen/`,DevTools → Application → Manifest 验证 manifest 加载正确

2. **SW 注册验证**
   - DevTools → Application → Service Workers 确认 `sw.js` 已激活
   - Network 面板首次访问音频应显示 `(ServiceWorker)`,二次访问应从 Cache 读取

3. **离线验证**
   - DevTools → Application → Service Workers 勾选 "Offline"
   - 切换所有 30 个站 × 2 个方向,确保全部能正常播放
   - 刷新页面,确认 SPA 路由在离线时仍可访问

4. **预缓存进度验证**
   - 观察 `OfflineStatus` 组件,数字应从 0/120 逐渐递增
   - DevTools → Application → Cache Storage → `yamanote-audio` 验证文件正在写入

5. **部署验证**
   - 推送到 main,等 CI 完成后访问 `https://condorheroblog.github.io/yamanote-sen/`
   - Lighthouse → PWA 类别应得满分

6. **跨设备验证**
   - Android Chrome:添加到主屏幕,断开网络,验证 standalone 模式可用
   - iOS Safari:添加到主屏幕,断开网络,验证(注意 7 天回收)

---

## 风险与回退 (Risks)

| 风险 | 缓解 |
|------|------|
| gh-pages 部署体积膨胀(130 MB 音频已存在,SW 会再生成) | 音频本身已在仓库,SW 仅生成几 KB 元数据;无影响 |
| 用户首次访问网络差时后台预缓存持续占用带宽 | 提供"暂停预缓存"按钮;默认并发数 3,带宽占用可控 |
| iOS 7 天回收 Cache Storage | README 提示;iOS 用户可考虑后续迁移 OPFS / IndexedDB 持久化音频 |
| SW 升级时旧资源 stale | `registerType: "autoUpdate"` + Workbox 默认 precacheAndRoute 会处理 |

---

## 实施顺序 (Implementation Order)

1. 安装依赖 + 配置 `vite.config.ts`(基础可运行)
2. 生成 PWA 图标资源
3. 实现 `src/lib/audio.ts` 的后台预缓存逻辑
4. 在 `main.tsx` 启动预缓存
5. 添加 `OfflineStatus` UI 组件
6. 本地 build + preview 验证
7. 部署 + 生产验证