# Yamanote-Sen

> A virtual ride on Tokyo's Yamanote Line — listen to every station's melody, chime, announcement and ambient sound as you loop the line at 2× speed.

**Live demo:** https://condorheroblog.github.io/yamanote-sen/

A React + Vite fan project that recreates the experience of [yamanote.fun](https://www.yamanote.fun/) — a beloved web app that stitches together the station melodies, door chimes, announcements and ambient train sounds of all 30 stations on the Yamanote Line into a single 30-minute virtual loop.

---

## Features

- **30 stations** — every stop on the Yamanote Line (JY01 Tōkyō → JY30 Ikebukuro and back), with both directions available.
- **Two loop directions** — Outer Loop (clockwise / 外回り) and Inner Loop (anticlockwise / 内回り). Each direction has its own distinct set of melodies.
- **Inline player** — play / pause, previous / next station, scrub through each station's melody → door chime → ambience → announcement timeline.
- **Chamfered loop diagram** (v2 layout) — a stylized schematic of the Yamanote loop with stations placed around the perimeter and the player anchored in the middle.
- **Legacy layout** — the original header + station list + player UI is still served at `/legacy`.
- **Bilingual** — toggle between English and Japanese station names (EN / 日).
- **Light & dark themes** — follows your system preference on first visit; persisted afterwards.
- **Shareable URLs** — the current station and direction are reflected in the query string (`?station=01&dir=outer`), so you can deep-link straight to a specific stop.
- **Audio formats** — automatically picks `.opus` when supported, falls back to `.m4a` elsewhere.
- **Responsive** — designed mobile-first; the diagram and player rearrange on narrow viewports.

---

## Tech stack

- **React 19** + **TypeScript**
- **Vite 8** for dev server and build
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Zustand** for state management (`player` and `settings` stores)
- **React Router** for `/` and `/legacy` routes
- **i18next** + **react-i18next** for EN / JP localization
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
├── main.tsx              # React root
├── App.tsx               # Router: "/" → NewApp, "/legacy" → LegacyApp
├── i18n.ts               # i18next EN/JP resources
├── index.css             # Tailwind v4 entry + global styles
├── data/
│   └── stations.ts       # 30-station dataset (JY code, names, audio paths, melody, sections)
├── lib/
│   └── audio.ts          # useAudioEngine: shared <audio> + format detection
├── store/
│   ├── player.ts         # Zustand: index / direction / isPlaying
│   └── settings.ts       # Zustand + persist: theme / lang
├── v2/                   # New layout — chamfered loop diagram
│   ├── NewApp.tsx
│   ├── LoopDiagram.tsx
│   ├── InlinePlayer.tsx
│   ├── geometry.ts
│   ├── icons.tsx
│   ├── loopConfig.ts
│   └── useOrientation.ts
└── legacy/               # Original layout — header + list + player
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

Each station entry (`src/data/stations.ts`) records its JY code, English and Japanese names, audio paths for inner / outer directions, the melody name and a list of labelled **sections** (e.g. *Melody → Door Chime → Ambience → Announcement*) used to drive the progress bar.

---

## Layouts

| Route      | Layout             | Description                                                            |
| ---------- | ------------------ | ---------------------------------------------------------------------- |
| `/`        | **New (v2)**       | Chamfered loop diagram with stations on its perimeter and player in the middle. The default landing page. |
| `/legacy`  | **Legacy (v1)**    | Header + station list + controls + player, faithful to the original.    |

A floating chip in the lower-right corner lets you swap between the two layouts.

---

## URL format

The current station and direction are encoded as query parameters so links are shareable:

```
/?station=13&dir=inner   # JY13 Ikebukuro, inner loop
```

History is updated with `replaceState`, so tapping through stations doesn't pollute the back stack.

---

## Deployment

Deployment is fully automated via GitHub Actions:

- `.github/workflows/deploy.yml` — on every push to `main`, it installs dependencies, runs `pnpm run build`, and publishes `dist/` to the `gh-pages` branch using `JamesIves/github-pages-deploy-action`.

The production `base` path is configured to `/yamanote-sen/` (see `vite.config.ts`).

---

## Attribution

- **Audio & data** — sourced from [yamanote.fun](https://www.yamanote.fun/), an open dataset of Yamanote Line station sounds. All rights belong to the original authors.
- **This project** is a non-commercial fan recreation for educational and personal use.

---

## License

This project is released for personal and educational use. Please respect the copyright of the original audio assets at [yamanote.fun](https://www.yamanote.fun/).
