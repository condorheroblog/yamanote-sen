import type { Direction } from "../../data/stations";
import { stations } from "../../data/stations";
import { useAudioEngine } from "../../lib/audio";
import { SegmentedProgress } from "../../lib/SegmentedProgress";
import { usePlayer } from "../../store/player";

function fmt(t: number): string {
	if (!Number.isFinite(t))
		return "0:00";
	const s = Math.max(0, Math.floor(t));
	const m = Math.floor(s / 60);
	return `${m}:${String(s % 60).padStart(2, "0")}`;
}

export function ScrubBar({ direction }: { direction: Direction }) {
	const index = usePlayer(s => s.index);
	const sections = stations[index].sections[direction];
	const { currentTime, duration, seekFraction } = useAudioEngine();

	const totalEnd = sections[sections.length - 1]?.end ?? 0;
	const dur = duration || totalEnd;

	return (
		<div className="w-full select-none">
			<SegmentedProgress
				sections={sections}
				duration={dur}
				currentTime={currentTime}
				onSeekFraction={(f) => {
					if (!duration)
						return;
					seekFraction((f * dur) / duration);
				}}
				labelPosition="above"
			/>
			<div className="mt-1 flex items-center justify-between text-xs font-medium text-[#B87F76] dark:text-[#B87F76] tabular-nums">
				<span>{fmt(currentTime)}</span>
				<span>{fmt(dur)}</span>
			</div>
		</div>
	);
}
