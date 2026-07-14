// New (v2) layout: chamfered loop diagram with stations on its perimeter and
// the player anchored in the middle. Owns the audio engine so playback works
// without the legacy shell.

import type { JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AboutPanel } from "../legacy/components/AboutPanel";
import { SettingsPanel } from "../legacy/components/SettingsPanel";
import { useAudioEngine } from "../lib/audio";
import { usePlayer } from "../store/player";
import { GearIcon, GitHubIcon, InfoIcon } from "./icons";
import { InlinePlayer } from "./InlinePlayer";
import { buildDefaultGeometry } from "./loopConfig";
import { LoopDiagram } from "./LoopDiagram";
import { useOrientation } from "./useOrientation";
import "../i18n";

export default function NewApp(): JSX.Element {
	const orientation = useOrientation();
	// Rebuild the geometry whenever the viewport crosses the portrait /
	// landscape breakpoint so the diagram snaps to the new aspect ratio.
	const geometry = useMemo(
		() => buildDefaultGeometry(orientation),
		[orientation],
	);
	const index = usePlayer(s => s.index);
	const direction = usePlayer(s => s.direction);
	const setIndex = usePlayer(s => s.setIndex);
	const setDirection = usePlayer(s => s.setDirection);
	useAudioEngine();

	const [settingsOpen, setSettingsOpen] = useState(false);
	const [aboutOpen, setAboutOpen] = useState(false);

	// Hydrate the store from the URL on first mount so a shared link deep-links.
	// `replaceState` keeps the back/forward history clean when the user later
	// taps stations or flips direction.
	const hydratedRef = useRef(false);
	useEffect(() => {
		if (hydratedRef.current)
			return;
		hydratedRef.current = true;
		const url = new URL(window.location.href);
		const stationParam = url.searchParams.get("station");
		const dirParam = url.searchParams.get("dir");
		if (stationParam !== null) {
			const parsed = Number.parseInt(stationParam, 10);
			if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 30) {
				setIndex(parsed - 1);
			}
		}
		if (dirParam === "outer" || dirParam === "inner") {
			setDirection(dirParam);
		}
	}, [setIndex, setDirection]);

	// Keep the URL in sync with the current station/direction so it stays shareable.
	// We expose state as query params (`?station=<jy>&dir=<outer|inner>`) and update
	// them with `replaceState` so back/forward history isn't polluted on every tap.
	useEffect(() => {
		if (!hydratedRef.current)
			return;
		const url = new URL(window.location.href);
		url.searchParams.set("station", String(index + 1).padStart(2, "0"));
		url.searchParams.set("dir", direction);
		const next = `${url.pathname}${url.search}`;
		if (`${window.location.pathname}${window.location.search}` !== next) {
			window.history.replaceState(null, "", next);
		}
	}, [index, direction]);

	return (
		<div className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-3 py-4 sm:px-6 sm:py-8">
			<header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-200/60 bg-white/70 px-5 py-3 backdrop-blur dark:border-white/10 dark:bg-white/5">
				<div className="flex items-center gap-1">
					<span className="text-xl font-bold tracking-tight text-[#DC7970]">山手線</span>
					<span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Yamanote-Sen</span>
				</div>
				<div className="flex items-center gap-1">
					<a
						href="https://github.com/condorheroblog/yamanote-sen/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="GitHub repository"
						className="rounded-full p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
					>
						<GitHubIcon size={20} />
					</a>
					<button
						type="button"
						onClick={() => setSettingsOpen(true)}
						aria-label="Settings"
						className="rounded-full p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
					>
						<GearIcon size={20} />
					</button>
					<button
						type="button"
						onClick={() => setAboutOpen(true)}
						aria-label="About"
						className="rounded-full p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
					>
						<InfoIcon size={20} />
					</button>
				</div>
			</header>

			{/* Layout strategy:
					- On wide viewports (≥640px) the loop is wide and the player
					  floats centered over its interior, like the original design.
					- On narrow viewports (<640px) the loop is sized against the
					  viewport height directly (see LoopDiagram's portrait
					  containerStyle), so it fits in the available area without
					  overflowing. The player now sits between the header and
					  the diagram (rather than overlapping the loop, which is
					  too cramped on a phone screen). It's a compact horizontal
					  row so it doesn't push the loop out of the viewport.
					All of this is CSS-driven (Tailwind's `sm:` breakpoint) so it
					works even if the orientation hook returns a stale value during
					hydration on slow mobile browsers. */}
			<div
				className={
					orientation === "portrait"
						? "flex flex-1 flex-col items-center gap-2 py-3 sm:relative sm:flex-row sm:items-center sm:justify-center sm:gap-0 sm:py-0"
						: "relative flex flex-1 items-center justify-center"
				}
			>
				{/* Mobile-only player row — sits between the header and the
						diagram so the loop doesn't have to share screen real
						estate with the floating overlay. `sm:hidden` keeps it
						hidden on desktop. */}
				<div className="w-full shrink-0 px-2 sm:hidden">
					<InlinePlayer />
				</div>
				<LoopDiagram geometry={geometry} activeIndex={index} orientation={orientation} />
				{/* Floating overlay — desktop only. On mobile the player is
						already shown in the row above. */}
				<div className="pointer-events-none absolute inset-0 hidden items-center justify-center p-3 sm:flex sm:p-8">
					<div className="pointer-events-auto">
						<InlinePlayer />
					</div>
				</div>
			</div>

			<SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
			<AboutPanel open={aboutOpen} onClose={() => setAboutOpen(false)} />
		</div>
	);
}
