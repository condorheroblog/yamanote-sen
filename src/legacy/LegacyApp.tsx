// Legacy (v1) layout for the Yamanote-Sen player.
// This module is mounted under the `/legacy` route and is fully self-contained:
// it owns its own header, station list and panels, and only re-uses the shared
// data/store/i18n layers so the two versions stay in sync.
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { stations } from "../data/stations";
import { useAudioEngine } from "../lib/audio";
import { usePlayer } from "../store/player";
import { useSettings } from "../store/settings";
import { AboutPanel } from "./components/AboutPanel";
import { GearIcon, InfoIcon } from "./components/Icons";
import { Player } from "./components/Player";
import { SettingsPanel } from "./components/SettingsPanel";
import { StationList } from "./components/StationList";
import { asciify } from "./slug";
import "../i18n";

function StationPage() {
	const { jy } = useParams();
	const directionParam = new URLSearchParams(window.location.search).get("dir");
	const setIndex = usePlayer(s => s.setIndex);
	const setDirection = usePlayer(s => s.setDirection);
	const lang = useSettings(s => s.lang);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredStations = searchQuery.trim()
		? stations.filter((s) => {
			const q = searchQuery.toLowerCase();
			const jyNum = String(s.jy).toLowerCase();
			const nameEn = s.name.toLowerCase();
			const nameJp = s.kanji;
			return jyNum.includes(q) || nameEn.includes(q) || nameJp.includes(q);
		})
		: null;

	useEffect(() => {
		if (!jy)
			return;
		const idx = stations.findIndex(s => asciify(s.name) === jy);
		if (idx >= 0)
			setIndex(idx);
		if (directionParam === "outer" || directionParam === "inner") {
			setDirection(directionParam);
		}
	}, [jy, directionParam, setIndex, setDirection]);

	return (
		<div className="pb-20">
			<Player />
			<input
				type="search"
				value={searchQuery}
				onChange={e => setSearchQuery(e.target.value)}
				placeholder={lang === "jp" ? "駅名・JY番号で検索..." : "Search stations or JY number..."}
				className="mb-2 w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm placeholder:text-zinc-400 focus:border-[#DC7970] focus:outline-none focus:ring-1 focus:ring-[#DC7970] dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500"
			/>
			<StationList filteredStations={filteredStations} />
		</div>
	);
}

function Shell() {
	const navigate = useNavigate();
	const index = usePlayer(s => s.index);
	const direction = usePlayer(s => s.direction);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [aboutOpen, setAboutOpen] = useState(false);
	useAudioEngine();

	// Keep the URL in sync with the current station/direction so it stays shareable.
	useEffect(() => {
		const slug = asciify(stations[index].name);
		const target = `/legacy/${slug}?dir=${direction}`;
		if (window.location.pathname + window.location.search !== target) {
			navigate(target, { replace: true });
		}
	}, [index, direction, navigate]);

	return (
		<div className="mx-auto flex min-h-full max-w-3xl flex-col">
			<header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-200/60 bg-white/70 px-5 py-3 backdrop-blur dark:border-white/10 dark:bg-white/5">
				<div className="flex items-center gap-1">
					<span className="text-xl font-bold tracking-tight text-[#DC7970]">山手線</span>
					<span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Yamanote-Sen</span>
				</div>
				<div className="flex items-center gap-1">
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

			<Routes>
				<Route index element={<Navigate to={`/legacy/${asciify(stations[0].name)}?dir=outer`} replace />} />
				<Route path=":jy" element={<StationPage />} />
			</Routes>

			<SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
			<AboutPanel open={aboutOpen} onClose={() => setAboutOpen(false)} />
		</div>
	);
}

export default function LegacyApp() {
	return <Shell />;
}
