import type { Direction, Section } from "../../data/stations";
import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { stations } from "../../data/stations";
import { useAudioEngine } from "../../lib/audio";
import { usePlayer } from "../../store/player";

function fmt(t: number): string {
	if (!Number.isFinite(t))
		return "0:00";
	const s = Math.max(0, Math.floor(t));
	const m = Math.floor(s / 60);
	return `${m}:${String(s % 60).padStart(2, "0")}`;
}

function currentSectionLabel(sections: Section[], t: number): string {
	for (const sec of sections) {
		if (t <= sec.end)
			return sec.label;
	}
	return sections[sections.length - 1]?.label ?? "";
}

export function ScrubBar({ direction }: { direction: Direction }) {
	const { t } = useTranslation();
	const index = usePlayer(s => s.index);
	const sections = stations[index].sections[direction];
	const { currentTime, duration, seekFraction } = useAudioEngine();

	const totalEnd = sections[sections.length - 1]?.end ?? 0;
	const fallbackDuration = useRef(Math.max(totalEnd, 0));
	const dur = duration || fallbackDuration.current;

	const progress = useMemo(() => {
		if (!dur)
			return 0;
		return Math.max(0, Math.min(1, currentTime / dur));
	}, [currentTime, dur]);

	const label = currentSectionLabel(sections, currentTime);

	return (
		<div className="w-full select-none">
			<div className="flex items-center justify-between mb-1.5 text-xs font-medium text-[#B87F76] dark:text-[#B87F76] tabular-nums">
				<span>{fmt(currentTime)}</span>
				<span>{label || "\u00A0"}</span>
				<span>{fmt(dur)}</span>
			</div>
			<div
				role="slider"
				aria-label={t("pause")}
				tabIndex={0}
				onClick={(e) => {
					const rect = e.currentTarget.getBoundingClientRect();
					seekFraction((e.clientX - rect.left) / rect.width);
				}}
				className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800 cursor-pointer"
			>
				<div
					className="h-full rounded-full bg-[#DC7970] dark:bg-[#DC7970] transition-[width] duration-150"
					style={{ width: `${progress * 100}%` }}
				/>
				{sections.map((sec, i) => {
					const start = i === 0 ? 0 : sections[i - 1].end;
					const left = (start / dur) * 100;
					const width = ((sec.end - start) / dur) * 100;
					const active = currentTime >= start && currentTime < sec.end;
					return (
						<div
							key={`${sec.label}-${i}`}
							className={`absolute top-0 h-full border-r border-white/40 dark:border-zinc-950/40 transition-colors ${
								active ? "bg-[#DC7970]/40" : "bg-transparent"
							}`}
							style={{ left: `${left}%`, width: `${width}%` }}
							title={sec.label}
						/>
					);
				})}
			</div>
		</div>
	);
}
