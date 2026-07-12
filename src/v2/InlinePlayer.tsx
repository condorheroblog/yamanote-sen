// Compact player widget that sits above the chamfered loop on mobile and
// floats over its center on desktop. On phones (<sm) it renders as a
// single dense row (badge + station names + transport) so it doesn't
// crowd the diagram. Progress + direction toggle are hidden on phones and
// exposed on the larger breakpoint where there's room.

import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { stations } from "../data/stations";
import { useAudioEngine } from "../lib/audio";
import { usePlayer } from "../store/player";
import { useSettings } from "../store/settings";
import { NextIcon, PauseIcon, PlayIcon, PrevIcon } from "./icons";

function fmt(t: number): string {
	if (!Number.isFinite(t))
		return "0:00";
	const s = Math.max(0, Math.floor(t));
	const m = Math.floor(s / 60);
	return `${m}:${String(s % 60).padStart(2, "0")}`;
}

export function InlinePlayer(): JSX.Element {
	const { t } = useTranslation();
	const index = usePlayer(s => s.index);
	const direction = usePlayer(s => s.direction);
	const setDirection = usePlayer(s => s.setDirection);
	const isPlaying = usePlayer(s => s.isPlaying);
	const next = usePlayer(s => s.next);
	const prev = usePlayer(s => s.prev);
	const { currentTime, duration, isReady, toggle } = useAudioEngine();
	const lang = useSettings(s => s.lang);
	const station = stations[index];

	const sections = station.sections[direction];
	const totalEnd = sections[sections.length - 1]?.end ?? 0;
	const dur = duration || totalEnd;
	const progress = dur > 0 ? Math.max(0, Math.min(1, currentTime / dur)) : 0;

	const labelText = lang === "jp" ? station.kanji : station.name;
	const subLabel = lang === "jp" ? station.name : station.kanji;

	return (
		<div className="flex flex-row items-center justify-between gap-2 rounded-2xl bg-white/80 px-3 py-2 shadow-md ring-1 ring-zinc-900/5 backdrop-blur sm:flex-col sm:items-stretch sm:gap-4 sm:rounded-3xl sm:px-6 sm:py-5 sm:shadow-lg md:gap-5 md:px-8 md:py-6 md:shadow-xl dark:bg-white/5 dark:ring-white/10">
			{/* Station identity + transport. Single dense row on phones so
					the player takes as little vertical space as possible; on
					`sm`+ the controls move to their own row below. */}
			<div className="flex-1 flex flex-row items-center justify-between gap-2 sm:flex-col sm:items-center sm:justify-center sm:gap-4">
				<div className="flex items-center gap-2 sm:gap-3 md:gap-4">
					<span className="inline-flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg border-2 border-[#7BAB4F] font-mono font-bold leading-none text-[#7BAB4F] sm:h-12 sm:w-12 sm:rounded-xl md:h-14 md:w-14">
						<span className="text-[8px] tracking-wider sm:text-[10px]">JY</span>
						<span className="text-sm tabular-nums sm:text-lg md:text-xl">
							{station.jy}
						</span>
					</span>
					<div className="min-w-0 text-left">
						<div className="truncate text-sm font-semibold tracking-tight text-zinc-900 sm:text-lg md:text-xl dark:text-zinc-50">
							{labelText}
						</div>
						<div className="hidden truncate text-xs text-zinc-500 sm:block md:text-sm dark:text-zinc-400">
							{subLabel}
						</div>
					</div>
				</div>

				<div className="flex items-center gap-1 sm:gap-3 md:gap-4">
					<button
						type="button"
						onClick={prev}
						aria-label={t("previous")}
						className="rounded-full p-1.5 text-zinc-700 hover:bg-[#DC7970]/10 sm:p-2.5 md:p-3 dark:text-zinc-200 dark:hover:bg-[#DC7970]/20"
					>
						<PrevIcon size={18} className="md:hidden" />
						<PrevIcon size={20} className="hidden md:block" />
					</button>
					<button
						type="button"
						onClick={toggle}
						aria-label={isPlaying ? t("pause") : t("play")}
						disabled={!isReady}
						className="rounded-full bg-[#DC7970] p-2.5 text-white shadow-lg shadow-[#DC7970]/30 transition hover:bg-[#C75D54] disabled:opacity-50 sm:p-3.5 md:p-4"
					>
						{isPlaying
							? (
								<>
									<PauseIcon size={20} className="md:hidden" />
									<PauseIcon size={26} className="hidden md:block" />
								</>
							)
							: (
								<>
									<PlayIcon size={20} className="md:hidden" />
									<PlayIcon size={26} className="hidden md:block" />
								</>
							)}
					</button>
					<button
						type="button"
						onClick={next}
						aria-label={t("next")}
						className="rounded-full p-1.5 text-zinc-700 hover:bg-[#DC7970]/10 sm:p-2.5 md:p-3 dark:text-zinc-200 dark:hover:bg-[#DC7970]/20"
					>
						<NextIcon size={18} className="md:hidden" />
						<NextIcon size={20} className="hidden md:block" />
					</button>
				</div>
			</div>

			{/* Progress bar + direction toggle only render from `sm` and up —
					on phones the screen is too cramped to fit them and the
					diagram takes priority. */}
			<div className="hidden w-full items-center gap-2 text-xs tabular-nums text-zinc-500 sm:flex sm:text-sm md:text-base dark:text-zinc-400">
				<span className="w-10 shrink-0 text-right sm:w-10 md:w-11">{fmt(currentTime)}</span>
				<div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200 sm:h-2 md:h-2.5 dark:bg-zinc-800">
					<div
						className="absolute inset-y-0 left-0 rounded-full bg-[#DC7970] transition-[width] duration-150"
						style={{ width: `${progress * 100}%` }}
					/>
				</div>
				<span className="w-10 shrink-0 sm:w-10 md:w-11">{fmt(dur)}</span>
			</div>

			<div className="hidden justify-center sm:flex">
				<div className="inline-flex rounded-full border border-zinc-200 bg-zinc-100 p-0.5 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-900">
					{(["outer", "inner"] as const).map((d) => {
						const active = direction === d;
						return (
							<button
								key={d}
								type="button"
								onClick={() => setDirection(d)}
								className={`rounded-full px-4 py-1 transition ${
									active
										? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
										: "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
								}`}
							>
								{t(d === "outer" ? "outerLoop" : "innerLoop")}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
