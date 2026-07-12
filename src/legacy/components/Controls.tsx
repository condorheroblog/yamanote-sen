import { useAudioEngine } from "../../lib/audio";
import { usePlayer } from "../../store/player";
import { NextIcon, PauseIcon, PlayIcon, PrevIcon } from "./Icons";

export function Controls() {
	const isPlaying = usePlayer(s => s.isPlaying);
	const next = usePlayer(s => s.next);
	const prev = usePlayer(s => s.prev);
	const { isReady, toggle } = useAudioEngine();

	return (
		<div className="flex items-center justify-center gap-4 py-3">
			<button
				type="button"
				onClick={prev}
				aria-label="Previous station"
				className="rounded-full p-3 text-[#2A2A2A] hover:bg-[#DC7970]/10 dark:text-zinc-300 dark:hover:bg-[#DC7970]/10 transition"
			>
				<PrevIcon size={28} />
			</button>
			<button
				type="button"
				onClick={toggle}
				aria-label={isPlaying ? "Pause" : "Play"}
				disabled={!isReady}
				className="rounded-full bg-[#DC7970] p-5 text-white shadow-lg shadow-[#DC7970]/30 hover:bg-[#C75D54] disabled:opacity-50 disabled:cursor-not-allowed transition"
			>
				{isPlaying ? <PauseIcon size={32} /> : <PlayIcon size={32} />}
			</button>
			<button
				type="button"
				onClick={next}
				aria-label="Next station"
				className="rounded-full p-3 text-[#2A2A2A] hover:bg-[#DC7970]/10 dark:text-zinc-300 dark:hover:bg-[#DC7970]/10 transition"
			>
				<NextIcon size={28} />
			</button>
		</div>
	);
}
