import type { JSX } from "react";
import type { Section } from "../data/stations";
import { useState } from "react";

interface Props {
	sections: Section[]
	duration: number
	currentTime: number
	onSeekFraction: (frac: number) => void
	/** Where the floating single-label tooltip is anchored. */
	labelPosition?: "above" | "below"
	trackClassName?: string
}

/**
 * Segmented audio progress bar.
 *
 * The track is divided into one clickable button per entry in `sections`.
 * Clicking anywhere inside a segment invokes `onSeekFraction` with the
 * click x-position relative to the full track.
 *
 * The currently-playing segment is filled with the theme green
 * (`#7BAB4F`); inactive segments are neutral grey. The active label is
 * always shown (in the label color `#B87F76`); hovering a different
 * segment swaps the visible label to that segment instead, so only one
 * label is on screen at a time.
 */
export function SegmentedProgress({
	sections,
	duration,
	currentTime,
	onSeekFraction,
	labelPosition = "below",
	trackClassName = "",
}: Props): JSX.Element {
	const [hoverIdx, setHoverIdx] = useState<number | null>(null);

	const dur = duration > 0 ? duration : sections[sections.length - 1]?.end ?? 0;

	const activeIdx = sections.findIndex((sec, i) => {
		const start = i === 0 ? 0 : sections[i - 1].end;
		return currentTime >= start && currentTime < sec.end;
	});
	const visibleIdx = hoverIdx ?? activeIdx;

	const trackLabel = visibleIdx >= 0 && visibleIdx < sections.length
		? sections[visibleIdx]
		: null;
	const labelCenter = trackLabel
		? (() => {
			const start = visibleIdx === 0 ? 0 : sections[visibleIdx - 1].end;
			return dur > 0 ? ((start + trackLabel.end) / 2 / dur) * 100 : 0;
		})()
		: 0;
	const labelIsActive = visibleIdx === activeIdx;

	return (
		<div
			className="relative w-full"
			onMouseLeave={() => setHoverIdx(null)}
		>
			{/* Optional label above the track */}
			{labelPosition === "above" && trackLabel && (
				<div
					className={`pointer-events-none absolute bottom-full mb-1.5 -translate-x-1/2 whitespace-nowrap text-xs font-medium tabular-nums transition-colors ${
						labelIsActive ? "text-[#7BAB4F]" : "text-[#B87F76]"
					}`}
					style={{ left: `${labelCenter}%` }}
				>
					{trackLabel.label}
				</div>
			)}

			<div
				className={`relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 sm:h-2 md:h-2.5 dark:bg-zinc-800 ${trackClassName}`}
			>
				{sections.map((sec, i) => {
					const start = i === 0 ? 0 : sections[i - 1].end;
					const left = dur > 0 ? (start / dur) * 100 : 0;
					const width = dur > 0 ? ((sec.end - start) / dur) * 100 : 0;
					const isActive = i === activeIdx;
					const isHover = i === hoverIdx;
					return (
						<button
							key={`${sec.label}-${i}`}
							type="button"
							aria-label={`${sec.label} (${sec.end - start}s)`}
							onMouseEnter={() => setHoverIdx(i)}
							onFocus={() => setHoverIdx(i)}
							onBlur={() => setHoverIdx(null)}
							onClick={(e) => {
								const rect = e.currentTarget.parentElement?.getBoundingClientRect();
								if (!rect)
									return;
								onSeekFraction((e.clientX - rect.left) / rect.width);
							}}
							className={`absolute inset-y-0 cursor-pointer border-r border-white/40 transition-colors dark:border-zinc-950/40 ${
								isActive
									? "bg-[#7BAB4F]"
									: isHover
										? "bg-zinc-300 dark:bg-zinc-700"
										: "bg-zinc-200 dark:bg-zinc-800"
							}`}
							style={{ left: `${left}%`, width: `${width}%` }}
						/>
					);
				})}

				{/* Played overlay so the playhead is visible on top of the
						green active segment. */}
				<div
					className="pointer-events-none absolute inset-y-0 left-0 bg-[#DC7970]/30 transition-[width] duration-150"
					style={{
						width: `${dur > 0 ? Math.min(100, (currentTime / dur) * 100) : 0}%`,
					}}
				/>
			</div>

			{/* Optional label below the track */}
			{labelPosition === "below" && trackLabel && (
				<div
					className={`pointer-events-none absolute left-0 right-0 top-full mt-1.5 h-4 text-xs font-medium tabular-nums transition-colors ${
						labelIsActive ? "text-[#7BAB4F]" : "text-[#B87F76]"
					}`}
				>
					<span
						className="absolute -translate-x-1/2 whitespace-nowrap"
						style={{ left: `${labelCenter}%` }}
					>
						{trackLabel.label}
					</span>
				</div>
			)}
		</div>
	);
}
