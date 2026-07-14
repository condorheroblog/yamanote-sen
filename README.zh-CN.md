# Yamanote-Sen（山手线）

<p align="center">
  <img src="https://condorheroblog.github.io/yamanote-sen/favicon.svg" alt="Yamanote-Sen logo" width="96" />
</p>

> 东京山手线环境音播放器 —— 在线聆听 30 个车站的站名旋律、关门提示音、报站广播与行驶音，以 2 倍速环绕整个环状线路。

**在线演示：** https://condorheroblog.github.io/yamanote-sen/

这是一个使用 React + Vite 构建的单页应用，并可作为 PWA 安装到桌面。音频来源于 [yamanote.fun](https://www.yamanote.fun/) —— 环线方向、车站列表、旋律名称以及各站的分段时间轴（旋律 → 关门提示 → 背景音 → 报站广播）均与该网站的数据集保持一致。

---

## 功能特性

- **30 个车站** —— 山手线全程（JY01 東京 → JY30 池袋 再回到 JY01），支持两个方向播放。
- **两种环线方向** —— 外回り（顺时针）与 内回り（逆时针），两个方向各自拥有不同的站名旋律。
- **两种布局**
  - **新版（v2）**位于 `/` —— 切角环线示意图，车站环绕在周边，播放器居中悬浮。桌面端播放器悬浮于环线中央，手机端自动改为上下分栏。
  - **旧版（v1）**位于 `/legacy` —— 「顶部 + 站点列表 + 播放器」的传统布局，并支持按 JY 编号或站名进行全文搜索。页面右下角的浮动胶囊可在两种布局之间切换。
- **内嵌播放器** —— 播放 / 暂停、上一站 / 下一站，可在分段时间轴上拖动跳转。
- **分段进度条** —— 轨道按「旋律 / 关门提示 / 背景音 / 报站广播」分段着色，当前段落用主题色填充、显示标签，点击任意位置即可跳转。
- **双语支持** —— 一键在英文与日文站名之间切换（英 / 日），选择会写入 `localStorage`。
- **亮色 / 暗色主题** —— 首次访问跟随系统设置，手动选择后会持久化保存。
- **可分享的 URL** —— 当前站点和方向会写入查询字符串（`?station=01&dir=outer`），可直接深链到某一站。URL 通过 `replaceState` 更新，不会污染浏览历史。
- **PWA 离线播放** —— Service Worker 预缓存应用 shell，并对 `/audio/` 启用 `CacheFirst` 运行时缓存：已听过的车站可以完全离线播放。界面提供安装按钮与首次访问提示。
- **自适应音频格式** —— 浏览器支持时优先使用 `.opus`，否则回退到 `.m4a`。
- **响应式布局** —— 移动优先；在窄屏下示意图、播放器与 PWA 提示会自动重排。

---

## 技术栈

- **React 19** + **TypeScript**
- **Vite 8** —— 开发服务器与构建工具
- **Tailwind CSS v4**（通过 `@tailwindcss/vite` 集成）
- **Zustand** —— 状态管理（`player` 与 `settings` 两个 store）
- **React Router** —— 处理 `/` 与 `/legacy` 两条路由
- **i18next** + **react-i18next** —— 英 / 日双语
- **vite-plugin-pwa** + **workbox** —— 离线支持与安装提示
- **vite-plugin-open-graph** —— 社交卡片元数据
- **ESLint**（Antfu 配置）+ **lint-staged** + **simple-git-hooks** + **commitlint**

---

## 快速开始

### 环境要求

- **Node.js** ≥ 20（推荐 LTS 版本）
- **pnpm**（首选 —— 锁文件与 CI 均使用它）

### 安装与运行

```bash
pnpm install
pnpm dev
```

随后访问 http://localhost:5173 。

### 其他脚本

```bash
pnpm build         # 生产构建 → dist/
pnpm preview       # 本地预览生产构建
pnpm lint          # 运行 ESLint
pnpm lint:fix      # ESLint --fix
pnpm typecheck     # tsc --noEmit
```

---

## 项目结构

```
src/
├── main.tsx                 # React 挂载入口
├── App.tsx                  # 主题监听 + 路由（"/" → NewApp，"/legacy" → LegacyApp）
├── i18n.ts                  # i18next 英 / 日文案
├── index.css                # Tailwind v4 入口、主题色与 PWA / 提示动画
├── components/
│   └── InstallApp.tsx       # PWA 安装按钮 + 首次访问提示
├── data/
│   └── stations.ts          # 30 站数据集（JY 编号、站名、音频路径、旋律、分段）
├── lib/
│   ├── audio.ts             # useAudioEngine：共享 <audio> + 格式检测 + SW 缓存预热
│   └── SegmentedProgress.tsx# 分段进度条，支持点击跳转
├── store/
│   ├── player.ts            # Zustand：index / direction / isPlaying
│   └── settings.ts          # Zustand + persist：theme / lang
├── v2/                      # 新版 —— 切角环线示意图
│   ├── NewApp.tsx
│   ├── LoopDiagram.tsx
│   ├── InlinePlayer.tsx
│   ├── geometry.ts
│   ├── icons.tsx
│   ├── loopConfig.ts
│   └── useOrientation.ts
└── legacy/                  # 旧版 —— 顶部 + 列表 + 播放器
    ├── LegacyApp.tsx
    ├── slug.ts
    └── components/
        ├── Player.tsx
        ├── Controls.tsx
        ├── DirectionToggle.tsx
        ├── StationList.tsx
        ├── ScrubBar.tsx
        ├── SettingsPanel.tsx
        ├── AboutPanel.tsx
        ├── AboutContent.tsx
        ├── About.tsx
        └── Icons.tsx
```

每条车站记录（[src/data/stations.ts](src/data/stations.ts)）包含 JY 编号、英文与日文站名、内 / 外回方向的音频路径、旋律名称以及一组带标签的 **分段**（如 *旋律 → 关门提示 → 背景音 → 报站广播*），用于驱动进度条。音频文件位于本地 `public/audio/` 目录。

---

## 两种布局

| 路由        | 布局                  | 说明                                                            |
| ---------- | -------------------- | --------------------------------------------------------------- |
| `/`        | **新版（v2）**        | 切角环线示意图，车站环绕在周边，播放器居中。是默认入口。            |
| `/legacy`  | **旧版（v1）**        | 顶部 + 站点列表 + 控件 + 播放器的原始布局，并支持按 JY 编号或站名进行全文搜索。 |

页面右下角的浮动胶囊（与 PWA 安装按钮并列）可在两种布局之间切换。

---

## URL 格式

当前站点与方向被编码进查询参数，方便分享链接：

```
/?station=13&dir=inner   # JY13 池袋，内回方向
```

URL 通过 `replaceState` 更新，连续点击不会污染浏览历史。

---

## PWA 与离线播放

`vite-plugin-pwa` 注册的 Service Worker 会：

- **预缓存应用 shell** —— JS / CSS / HTML / SVG / PNG / ICO / WebP / WOFF2，单文件 ≤ 5 MB。
- **运行时缓存音频** —— 对 `/audio/` 启用 `CacheFirst` 规则，TTL 为 1 年，最多缓存 120 条；首次播放某站时会写入缓存，并对浏览器默认发出的 HTML5 `Range` 请求做透明支持。

`lib/audio.ts` 在每次切站时还会主动 `fetch` 一次音频源，确保即使 `<audio>` 直接命中磁盘缓存，Service Worker 的运行时缓存也能被填充。已听过的车站即可完全离线播放。`InstallApp` 组件提供安装按钮和一次性左侧提示横幅，关闭后会通过 `localStorage` 永久记忆。

---

## 部署

部署完全由 GitHub Actions 自动化完成：

- `.github/workflows/deploy.yml` —— 每次推送至 `main` 分支时，自动安装依赖、运行 `pnpm run build`，并通过 `JamesIves/github-pages-deploy-action` 将 `dist/` 发布到 `gh-pages` 分支。

生产环境下的 `base` 路径已配置为 `/yamanote-sen/`（见 [vite.config.ts](vite.config.ts)）。

---

## 版权声明

- **音频** —— 本站播放的站名旋律、关门提示、背景音与报站广播均来自 [yamanote.fun](https://www.yamanote.fun/)。音频相关权利归原作者所有；本站仅流式传输该数据集供个人聆听。
- **本站代码** —— 界面、组件、示意图与 PWA 集成均为本站原创；请同时遵守上游数据集的使用条款。

## 许可证

[MIT](https://github.com/condorheroblog/yamanote-sen/blob/main/LICENSE) License © 2026-Present [Condor Hero](https://github.com/condorheroblog)
