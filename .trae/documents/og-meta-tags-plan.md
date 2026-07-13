# Open Graph Meta Tags 实施计划

## Summary

通过成熟的 Vite 插件 `vite-plugin-open-graph` (v2.0.6) 自动在构建时向 `index.html` 的 `<head>` 注入 OG / Twitter / Facebook 元数据。覆盖 **Twitter / X / Facebook / LinkedIn / iMessage / Slack / Discord** 等所有使用 Open Graph / Twitter Card 协议的分享平台。零运行时开销,所有标签在 SSR-less SPA 的初始 HTML 响应中就存在,爬虫(不执行 JS)也能读到。

**资产复用:** 使用 `public/og-image.jpg` 作为唯一分享图(1200×630 推荐规格),由 Vite 静态复制到 `dist/og-image.jpg`,通过 `base: "/yamanote-sen/"` 自动产出绝对 URL `https://condorheroblog.github.io/yamanote-sen/og-image.jpg`。

---

## Current State Analysis

| 维度 | 现状 |
|---|---|
| `index.html` | 仅 5 个基础 meta (`charset` / `viewport` / `theme-color` / `apple-touch-icon` / `title`),**无任何 OG / Twitter 标签** |
| `vite.config.ts` | Vite 8.1.4, `base: "/yamanote-sen/"`, 已用 `react` / `tailwindcss` / `codeInspectorPlugin` / `VitePWA` |
| `public/og-image.jpg` | ✅ 已存在,用户刚添加 |
| 公开 URL | `https://condorheroblog.github.io/yamanote-sen/`(README 确认) |
| 部署 | GitHub Actions → `gh-pages` 静态站点 |
| 平台兼容性 | SPA 无 SSR,所有元数据 **必须** 在 build-time 注入到静态 HTML,不能用 `react-helmet-async` 等客户端方案 |

**关键约束:** 不能手写元标签到 `index.html`(可维护性差,平台支持不完整)。必须用 Vite 插件在构建期注入。

---

## Proposed Changes

### 1. 安装依赖

在 `package.json` 的 `devDependencies` 中添加:

```json
"vite-plugin-open-graph": "^2.0.6"
```

执行 `pnpm install` 同步 `pnpm-lock.yaml`。

**为什么选这个插件:**
- 周下载量 ~5.6k,MIT 协议,持续维护
- 一次性覆盖 OG / Twitter Card / Facebook / (LinkedIn / iMessage / Slack / Discord 走 OG 协议,自动受益)
- 完整的 TypeScript 类型 (`Options` 接口)
- 不引入运行时依赖,纯构建期 transform

### 2. 修改 `vite.config.ts`

在 `plugins` 数组中加入 `vite-plugin-open-graph`,配置如下:

```ts
import openGraph from "vite-plugin-open-graph";
// ... 保留现有 imports

plugins: [
  react(),
  tailwindcss(),
  codeInspectorPlugin({ bundler: "vite" }),
  VitePWA({ /* 保持现状 */ }),

  // 必须在 react() 之后,确保 transformIndexHtml 在 HTML 生成阶段执行
  openGraph({
    basic: {
      title: "Yamanote Sen",
      type: "website",
      url: "https://condorheroblog.github.io/yamanote-sen/",
      siteName: "Yamanote Sen",
      description:
        "A virtual ride on Tokyo's Yamanote Line — listen to every station's melody, chime, announcement and ambient sound as you loop the line at 2× speed.",
      image: "https://condorheroblog.github.io/yamanote-sen/og-image.jpg",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: "Yamanote Sen",
      description:
        "A virtual ride on Tokyo's Yamanote Line — listen to every station's melody, chime, announcement and ambient sound as you loop the line at 2× speed.",
      image: "https://condorheroblog.github.io/yamanote-sen/og-image.jpg",
      imageAlt: "Yamanote Sen — Tokyo's Yamanote Line virtual ride",
    },
  }),
],
```

**配置要点:**
- `image` 字段使用**绝对 URL**(Twitter / Facebook 爬虫严格要求绝对 URL,相对路径会失效)
- `url` 使用 GitHub Pages 的最终线上地址
- `type: "website"` 适合 SPA 落地页(SPA 没有 article/product 语义)
- `twitter.card: "summary_large_image"` 触发 Twitter 大图卡片
- `imageAlt` 提升无障碍体验
- `facebook.appId` 暂不填(项目非 Facebook App,无 appId 需求)
- `basic.audio` / `basic.video` / `twitter.player` 不填(本项目无富媒体)

### 3. 不需要修改的文件

- `index.html` — 插件通过 `transformIndexHtml` 钩子自动注入,无需手动添加 `<meta>` 标签
- `src/**` — 纯构建期注入,无运行时改动
- `vite.config.ts` 的 `base` 字段 — 保持 `/yamanote-sen/`,插件读取 `image` 的绝对 URL 即可

---

## Plugin 自动注入的标签预览

构建后 `dist/index.html` 的 `<head>` 会被插入(示例,实际由插件生成):

```html
<meta property="og:title" content="Yamanote Sen" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://condorheroblog.github.io/yamanote-sen/" />
<meta property="og:site_name" content="Yamanote Sen" />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://condorheroblog.github.io/yamanote-sen/og-image.jpg" />
<meta property="og:locale" content="en_US" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Yamanote Sen" />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="https://condorheroblog.github.io/yamanote-sen/og-image.jpg" />
<meta name="twitter:image:alt" content="..." />
```

**平台覆盖:**
- ✅ Twitter / X — `twitter:card`
- ✅ Facebook — `og:*`
- ✅ LinkedIn — `og:*` (LinkedIn 爬虫读取 OG)
- ✅ iMessage / Slack / Discord — 全部读 `og:*`,部分同时读 `twitter:*`
- ✅ Telegram / WhatsApp — 读 `og:*`

---

## Assumptions & Decisions

1. **OG 图片用绝对 URL,而非相对路径或 import** — Twitter / Facebook 爬虫不跟随相对路径解析,必须用 `https://condorheroblog.github.io/yamanote-sen/og-image.jpg`。`og-image.jpg` 随 `vite build` 复制到 `dist/`,GitHub Pages 部署后可正常访问。
2. **不在 `index.html` 留占位** — 插件完全管理 OG/Twitter 标签,避免重复和冲突。
3. **不引入 i18n 动态 title** — 用户选择写死英文(title/description 与 README tagline 一致,符合 i18n 项目的英文 fallback 文案)。
4. **不写 `og:locale:alternate`** — 用户未要求双语 locale,保持简洁。
5. **不写 `robots` / `canonical`** — 超出本次任务范围,后续可单独加 SEO 优化。
6. **插件放置位置** — `react()` 之后,确保 transform 顺序;VitePWA 之前/之后皆可,无依赖冲突。
7. **不修改 `index.html` 的 `<title>`** — 浏览器 tab 显示用,OG 也用同一文案,无需单独处理。

---

## Verification

1. **构建检查:**
   ```bash
   pnpm install
   pnpm run build
   ```
   预期:`dist/index.html` 中出现 `<meta property="og:*">` 和 `<meta name="twitter:*">` 标签。

2. **本地预览:**
   ```bash
   pnpm run preview
   ```
   用 `curl http://localhost:4173/ | grep -E "og:|twitter:"` 验证标签存在。

3. **生产预览(模拟 GitHub Pages 路径):**
   - 部署到 `gh-pages` 分支后,访问 `https://condorheroblog.github.io/yamanote-sen/`
   - 查看页面源码确认标签被注入
   - 用平台 debugger 验证:
     - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
     - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
     - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
     - [OpenGraph.xyz](https://www.opengraph.xyz/)

4. **OG 图片可访问性:**
   - `curl -I https://condorheroblog.github.io/yamanote-sen/og-image.jpg` 确认 200 + 正确的 `image/jpeg` Content-Type
   - 推荐尺寸 1200×630,文件 < 8MB (推荐 < 1MB)

5. **类型检查与 lint:**
   ```bash
   pnpm run typecheck
   pnpm run lint
   ```
