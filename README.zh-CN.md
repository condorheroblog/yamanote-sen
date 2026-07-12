# Yamanote-Sen（山手线）

> 虚拟乘坐东京山手线 —— 聆听每一站的站名旋律、关门提示音、报站广播与行驶音，以 2 倍速环绕整个环状线路。

**在线演示：** https://condorheroblog.github.io/yamanote-sen/

这是一个使用 React + Vite 制作的爱好者项目，复刻了 [yamanote.fun](https://www.yamanote.fun/) 的核心体验 —— 它把山手线全部 30 个车站的站名旋律、关门提示、报站广播与背景音串联在一起，构成一次约 30 分钟的虚拟环线之旅。

---

## 功能特性

- **30 个车站** —— 山手线全程（JY01 東京 → JY30 池袋 再回到 JY01），支持两个方向播放。
- **两种环线方向** —— 外回り（顺时针）与 内回り（逆时针）。两个方向各自拥有不同的站名旋律。
- **内嵌播放器** —— 播放 / 暂停、上一站 / 下一站，可在每个车站的 旋律 → 关门提示 → 背景音 → 报站广播 时间轴上拖动。
- **切角环线示意图（v2 版）** —— 山手线环路的风格化示意图，车站排布在环线周边，播放器居中悬浮。
- **旧版界面** —— 原始的「顶部 + 站点列表 + 播放器」布局仍可在 `/legacy` 路径访问。
- **双语支持** —— 一键在英文与日文站名之间切换（英 / 日）。
- **亮色 / 暗色主题** —— 首次访问跟随系统设置，后续选择会被持久化保存。
- **可分享的 URL** —— 当前站点和方向会写入查询字符串（`?station=01&dir=outer`），可直接深链到某一站。
- **自适应音频格式** —— 浏览器支持时优先使用 `.opus`，否则回退到 `.m4a`。
- **响应式布局** —— 移动优先；在窄屏下示意图与播放器会自动重排。

---

## 技术栈

- **React 19** + **TypeScript**
- **Vite 8** —— 开发服务器与构建工具
- **Tailwind CSS v4**（通过 `@tailwindcss/vite` 集成）
- **Zustand** —— 状态管理（`player` 与 `settings` 两个 store）
- **React Router** —— 处理 `/` 与 `/legacy` 两条路由
- **i18next** + **react-i18next** —— 英 / 日双语
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
├── main.tsx              # React 挂载入口
├── App.tsx               # 路由: "/" → NewApp，"/legacy" → LegacyApp
├── i18n.ts               # i18next 英 / 日文案
├── index.css             # Tailwind v4 入口与全局样式
├── data/
│   └── stations.ts       # 30 站数据集（JY 编号、站名、音频路径、旋律、分段）
├── lib/
│   └── audio.ts          # useAudioEngine：共享 <audio> 元素与格式检测
├── store/
│   ├── player.ts         # Zustand：index / direction / isPlaying
│   └── settings.ts       # Zustand + persist：theme / lang
├── v2/                   # 新版 —— 切角环线示意图
│   ├── NewApp.tsx
│   ├── LoopDiagram.tsx
│   ├── InlinePlayer.tsx
│   ├── geometry.ts
│   ├── icons.tsx
│   ├── loopConfig.ts
│   └── useOrientation.ts
└── legacy/               # 旧版 —— 顶部 + 列表 + 播放器
    ├── LegacyApp.tsx
    └── components/
        ├── Player.tsx
        ├── Controls.tsx
        ├── StationList.tsx
        ├── ScrubBar.tsx
        ├── SettingsPanel.tsx
        ├── AboutPanel.tsx
        └── …
```

每条车站记录（`src/data/stations.ts`）包含 JY 编号、英文与日文站名、内 / 外回方向的音频路径、旋律名称以及一组带标签的 **分段**（如 *旋律 → 关门提示 → 背景音 → 报站广播*），驱动进度条显示。

---

## 两种布局

| 路由        | 布局                  | 说明                                                            |
| ---------- | -------------------- | --------------------------------------------------------------- |
| `/`        | **新版（v2）**        | 切角环线示意图，车站环绕在周边，播放器居中。是默认入口。            |
| `/legacy`  | **旧版（v1）**        | 顶部 + 站点列表 + 控件 + 播放器的原始布局，忠实于原站。            |

页面右下角的浮动胶囊按钮可在两种布局之间切换。

---

## URL 格式

当前站点与方向被编码进查询参数，方便分享链接：

```
/?station=13&dir=inner   # JY13 池袋，内回方向
```

URL 通过 `replaceState` 更新，连续点击不会污染浏览历史。

---

## 部署

部署完全由 GitHub Actions 自动化完成：

- `.github/workflows/deploy.yml` —— 每次推送至 `main` 分支时，自动安装依赖、运行 `pnpm run build`，并通过 `JamesIves/github-pages-deploy-action` 将 `dist/` 发布到 `gh-pages` 分支。

生产环境下的 `base` 路径已配置为 `/yamanote-sen/`（见 `vite.config.ts`）。

---

## 版权声明

- **音频与数据** —— 来源于 [yamanote.fun](https://www.yamanote.fun/)，一个山手线车站音频的开源数据集。相关版权归原作者所有。
- **本项目** 为非商业性质的爱好者复刻，仅供学习与个人使用。

---

## 许可证

本项目仅供个人与教育用途。请尊重 [yamanote.fun](https://www.yamanote.fun/) 原版音频资源的版权。