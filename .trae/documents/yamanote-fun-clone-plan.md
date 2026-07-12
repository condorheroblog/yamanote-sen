# 计划：用 React + Tailwind 一比一复刻 yamanote.fun

## 目标
在当前 `yamanote-sen` 项目（已配置 Vite + React 19 + Tailwind v4）上实现 https://www.yamanote.fun/ 的核心交互。

## 目标站点功能分析
yamanote.fun 是一个 PWA，提供山手线 30 个车站的"虚拟乘车"音景体验：

### 核心功能
1. **车站循环播放**：30 个车站的站名/编号/JY 代码显示
2. **方向切换**：Outer Loop（外回/顺时针）/ Inner Loop（内回/逆时针）
3. **播放控制**：播放/暂停、上一站/下一站
4. **站点时间轴**：显示当前站播放进度（0:00 - Melody / 1:01）
5. **站点选择列表**：可点击跳转到任一站
6. **可分享 URL**：`/jy01-tokyo-outer` 形式
7. **设置面板**：
   - Station names（English / Japanese）
   - Dark/Light 模式
   - Offline playback（提示）
8. **About 信息**：melody 表格，标记共享旋律（绿色）

### 内容数据（从页面抓取）
- 30 个车站，含 JY 编号、英文名、日文名
- 每个车站的 Outer/Inner 旋律名称
- 共享旋律使用统一旋律（多站相同）→ 在表格中标记绿色

### 注意：音频资源
原站点的音频在 Cloudflare R2 上托管，无源码开源。**一比一"复刻"音频不可行**，将在 UI 中以可视化进度条占位，并标注"音频源（受版权与托管限制，无法在本仓库内提供）"。

---

## 当前项目状态

### 已就绪
- Vite 8 + React 19 + TypeScript
- Tailwind v4（通过 `@tailwindcss/vite`）
- i18next（已安装）— 适合做 EN/JP 切换
- GitHub Pages 部署工作流（`.github/workflows/deploy.yml`）
- `index.html` 已含 `#root` 和 `#6366f1` theme-color
- `vite.config.ts` 中已配置 React + Tailwind + 别名 shim（无需新增）

### 缺失
- `src/` 目录为空 — 需要从零搭建源码结构

---

## 实施步骤

### 1. 项目脚手架（最小化）
- 新建 `src/main.tsx`：React 19 root 挂载
- 新建 `src/App.tsx`：路由 + 全局布局
- 新建 `src/index.css`：Tailwind v4 入口（`@import "tailwindcss";`） + 全局变量（颜色/字体）
- 删除 vite.config 中无用的 `node-util` shim（与本任务无关，但保留注释无影响）

### 2. 数据层：`src/data/stations.ts`
定义 30 站静态数据：
```ts
export type Direction = "outer" | "inner";
export interface Station {
	code: string // 'JY01'
	slug: string // 'jy01-tokyo'
	nameEn: string // 'Tōkyō'
	nameJp: string // '東京'
	outerMelody: string
	innerMelody: string
}
```
写入全部 30 站数据（从页面抓取）。

### 3. 路由层：`src/routes/`
- 简单自实现路由：监听 `popstate` 和 `location.pathname`
- 路径格式：`/jy01-tokyo-outer` → 加载对应站 + 方向
- 默认路由 `/` → `/jy01-tokyo-outer`

### 4. 状态管理：`src/store/player.tsx`
使用 React Context + `useReducer`：
- `direction: 'outer' | 'inner'`
- `currentStationIndex: number`（0-29）
- `isPlaying: boolean`
- `elapsed: number`（秒，受 setInterval 驱动）
- `loopDuration: number`（约 60-90 秒/站，因速度 2x）
- 操作：`next()`, `prev()`, `togglePlay()`, `setStation(i)`, `toggleDirection()`

### 5. 设置：`src/store/settings.tsx`
- `theme: 'light' | 'dark'`（写入 `localStorage`，初始值匹配系统 `prefers-color-scheme`）
- `lang: 'en' | 'jp'`（与 i18next 配合）

### 6. i18n：`src/i18n.ts`
- 初始化 i18next（项目已安装），注入站点文案
- 语言键：`en` / `jp`

### 7. UI 组件
- `src/components/Player.tsx`：主播放界面
  - 大号车站名（如 "Tōkyō"）
  - JY 代码徽章
  - 进度条 + 当前段标签（"Melody 0:42"）
- `src/components/StationList.tsx`：可滚动 30 站列表，当前站高亮
- `src/components/Controls.tsx`：上一站/播放暂停/下一站按钮 + Outer/Inner 切换
- `src/components/About.tsx`：可折叠信息（项目说明 + melody 表格）
  - 表格两列：Outer / Inner
  - 共享旋律（≥2 站相同）→ 文字使用 `text-emerald-600`
- `src/components/SettingsPanel.tsx`：右下角齿轮打开的抽屉
  - Appearance：Light/Dark
  - Station names：EN/JP
  - Offline playback：占位提示（无音频，无法实现）
- `src/components/MiniPlayer.tsx`：页面顶部持续显示的小信息条（当前站名 + 方向）

### 8. 视觉风格
参考原站的"elegant, minimal" 风格：
- 字体：系统字体（Tailwind 默认 sans）
- 主色调：背景 `bg-zinc-50` (light) / `bg-zinc-950` (dark)
- 强调色：`#6366f1`（已在 `index.html` theme-color 中设定）
- 文字：`text-zinc-900` / `text-zinc-100`
- 圆角：卡片 `rounded-2xl`，按钮 `rounded-full`
- 间距：大量 `py-* px-*` 留白

### 9. 响应式 & 可访问性
- 移动端优先（手机 PWA 是主要场景）
- 按钮带 `aria-label`
- 暗色模式通过 `dark:` 前缀切换

### 10. 部署
现有 GitHub Actions 工作流无需改动，`pnpm run build` 输出 `dist/`。

---

## 文件清单（新增）

```
src/
├── main.tsx
├── App.tsx
├── index.css
├── i18n.ts
├── data/
│   └── stations.ts
├── store/
│   ├── player.tsx
│   └── settings.tsx
├── components/
│   ├── Player.tsx
│   ├── StationList.tsx
│   ├── Controls.tsx
│   ├── About.tsx
│   ├── SettingsPanel.tsx
│   └── MiniPlayer.tsx
└── shims/
    └── node-util.ts   ← 占位（vite.config 引用了，可保留或移除 vite.config 中的 alias）
```
---

## 验证步骤
1. `pnpm install` 安装依赖
2. `pnpm run dev` 启动开发服务器，访问 http://localhost:5173
3. 验证：
   - 默认进入 `/jy01-tokyo-outer`
   - 点击 Outer/Inner 切换：URL 与车站显示切换
   - 点击播放/暂停、上一站/下一站：车站索引改变，进度条递增
   - 点击 StationList 中的某站：跳转到该站
   - 设置面板中切换 Light/Dark：颜色主题切换并持久化
   - 切换 EN/JP：车站名显示切换
   - 访问 `/jy13-ikebukuro-inner` 直接进入目标站
   - 移动端宽度下布局正确
4. `pnpm run build` 成功无错误
5. `pnpm run lint` 与 `pnpm run typecheck` 通过

---

## 假设与决策
- **音频复刻**：UI/交互/视觉一比一，音频资源通过自动脚本程序下载下来，放到项目中。
- **使用 Zustand 状态管理库**：简单易用，与 React 集成好。
- **使用 React Router**：3 个路由，每个站 + 方向。
- **复用已安装的 i18next**：与原站的多语言体验一致。
- **不做 PWA 离线**：无音频，离线价值低。
