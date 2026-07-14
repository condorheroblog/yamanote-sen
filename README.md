
# Yamanote-Sen

<p align="center">
  <img src="https://condorheroblog.github.io/yamanote-sen/favicon.svg" alt="Yamanote-Sen logo" width="96" />
</p>

> An ambient audio player for Tokyo's Yamanote Line — stream the station melodies, door chimes, announcements and train sounds of all 30 stations and loop the line at 2× speed.

**Live demo:** https://condorheroblog.github.io/yamanote-sen/

A React + Vite single-page app and installable PWA. Audio is sourced from [yamanote.fun](https://www.yamanote.fun/) — the loop direction, station list, melody names and per-station section timing (Melody → Door Chime → Ambience → Announcement) are mirrored from that site's dataset.

---

## Features

- **30 stations** — every stop on the Yamanote Line (JY01 Tōkyō → JY30 Ikebukuro and back), with both directions available.
- **Two loop directions** — Outer Loop (clockwise / 外回り) and Inner Loop (anticlockwise / 内回り). Each direction has its own distinct set of melodies.
- **Two layouts**
  - **New (v2)** at `/` — a chamfered loop diagram with stations on its perimeter and the player anchored in the middle. Auto-adapts between a floating overlay on desktop and a stacked layout on phones.
  - **Legacy (v1)** at `/legacy` — a header + station list + player layout with full-text search. A floating chip in the lower-right corner swaps between the two.
- **Inline player** — play / pause, previous / next station, scrub through each station's segmented timeline.
- **Segmented progress bar** — the track is divided into *Melody / Door Chime / Ambience / Announcement* segments; the active section is filled, the current label is shown, and clicking anywhere seeks.
- **Bilingual** — toggle between English and Japanese station names (EN / 日). Persisted in `localStorage`.
- **Light & dark themes** — follows your system preference on first visit; manual override is persisted afterwards.
- **Shareable URLs** — the current station and direction are reflected in the query string (`?station=01&dir=outer`), so you can deep-link straight to a specific stop. History is updated with `replaceState` so tapping through stations doesn't pollute the back stack.
- **Installable PWA** — a service worker pre-caches the app shell and uses a `CacheFirst` runtime rule for `/audio/`, so already-played stations work offline. An in-app install prompt + first-visit hint surface the option.
- **Audio formats** — automatically picks `.opus` when supported, falls back to `.m4a` elsewhere.
- **Responsive** — designed mobile-first; the diagram, player and PWA hint rearrange on narrow viewports.

---

## Tech stack

- **React 19** + **TypeScript**
- **Vite 8** for dev server and build
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Zustand** for state management (`player` and `settings` stores)
- **React Router** for `/` and `/legacy` routes
- **i18next** + **react-i18next** for EN / JP localization
- **vite-plugin-pwa** + **workbox** for offline support and the install prompt
- **vite-plugin-open-graph** for social-card metadata
- **ESLint** (Antfu config) + **lint-staged** + **simple-git-hooks** + **commitlint**

---

## Getting started

### Prerequisites

- **Node.js** ≥ 20 (LTS recommended)
- **pnpm** (preferred — the lockfile and CI both use it)

### Install & run

```bash
pnpm install
pnpm dev
```

Then open http://localhost:5173.

### Other scripts

```bash
pnpm build         # production build → dist/
pnpm preview       # preview the production build locally
pnpm lint          # run ESLint
pnpm lint:fix      # ESLint with --fix
pnpm typecheck     # tsc --noEmit
```

---

## Project layout

```
src/
├── main.tsx                 # React root
├── App.tsx                  # Theme listener + router ("/" → NewApp, "/legacy" → LegacyApp)
├── i18n.ts                  # i18next EN/JP resources
├── index.css                # Tailwind v4 entry, theme tokens, PWA + hint animations
├── components/
│   └── InstallApp.tsx       # PWA install button + first-visit hint
├── data/
│   └── stations.ts          # 30-station dataset (JY code, names, audio paths, melody, sections)
├── lib/
│   ├── audio.ts             # useAudioEngine: shared <audio> + format detection + SW cache warm-up
│   └── SegmentedProgress.tsx# Per-section progress bar with click-to-seek
├── store/
│   ├── player.ts            # Zustand: index / direction / isPlaying
│   └── settings.ts          # Zustand + persist: theme / lang
├── v2/                      # New layout — chamfered loop diagram
│   ├── NewApp.tsx
│   ├── LoopDiagram.tsx
│   ├── InlinePlayer.tsx
│   ├── geometry.ts
│   ├── icons.tsx
│   ├── loopConfig.ts
│   └── useOrientation.ts
└── legacy/                  # Original layout — header + list + player
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

Each station entry in [src/data/stations.ts](src/data/stations.ts) records its JY code, English and Japanese names, audio paths for inner / outer directions, the melody name and a list of labelled **sections** (e.g. *Melody → Door Chime → Ambience → Announcement*) used to drive the progress bar. Audio files are served locally from `public/audio/`.

---

## Layouts

| Route      | Layout             | Description                                                            |
| ---------- | ------------------ | ---------------------------------------------------------------------- |
| `/`        | **New (v2)**       | Chamfered loop diagram with stations on its perimeter and player in the middle. The default landing page. |
| `/legacy`  | **Legacy (v1)**    | Header + station list + controls + player, with full-text search over JY numbers and station names. |

A floating chip in the lower-right corner (alongside the PWA install button) lets you swap between the two layouts.

---

## URL format

The current station and direction are encoded as query parameters so links are shareable:

```
/?station=13&dir=inner   # JY13 Ikebukuro, inner loop
```

History is updated with `replaceState`, so tapping through stations doesn't pollute the back stack.

---

## PWA & offline playback

`vite-plugin-pwa` registers a service worker that:

- **Precaches the app shell** — JS, CSS, HTML, SVG, PNG, ICO, WebP, WOFF2 under 5 MB.
- **Runtime-caches audio** — a `CacheFirst` rule keyed on `/audio/` stores every station file on first play (1 year TTL, up to 120 entries) and serves the HTML5 `<audio>` `Range` requests browsers issue by default.

The first time a station is played, `lib/audio.ts` also `fetch`es the source in the background so the service worker can populate the runtime cache even if the `<audio>` element was loaded from `disk cache`. Already-played stations then work fully offline. The `InstallApp` component surfaces an install button and a one-time left-edge hint that you can dismiss permanently via `localStorage`.

---

## Deployment

Deployment is fully automated via GitHub Actions:

- `.github/workflows/deploy.yml` — on every push to `main`, it installs dependencies, runs `pnpm run build`, and publishes `dist/` to the `gh-pages` branch using `JamesIves/github-pages-deploy-action`.

The production `base` path is configured to `/yamanote-sen/` (see [vite.config.ts](vite.config.ts)).

---

## Attribution

- **Audio** — the station melodies, door chimes, ambience and announcements served by this app are sourced from [yamanote.fun](https://www.yamanote.fun/). All rights in the audio remain with the original authors; this project simply streams their dataset for personal listening.
- **This project** is a non-commercial fan client. The UI, code, diagrams and PWA glue are original work; please respect the upstream dataset's terms of use.

## License

[MIT](https://github.com/condorheroblog/yamanote-sen/blob/main/LICENSE) License © 2026-Present [Condor Hero](https://github.com/condorheroblog)
