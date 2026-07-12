import { useEffect, useRef } from "react";
import { stations } from "../../data/stations";
import { usePlayer } from "../../store/player";
import { useSettings } from "../../store/settings";

interface Props {
	onPick?: () => void
	filteredStations?: typeof stations | null
}

export function StationList({ onPick, filteredStations }: Props) {
	const index = usePlayer(s => s.index);
	const direction = usePlayer(s => s.direction);
	const setIndex = usePlayer(s => s.setIndex);
	const lang = useSettings(s => s.lang);
	const activeRef = useRef<HTMLLIElement | null>(null);

	const displayStations = filteredStations ?? stations;

	useEffect(() => {
		activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
	}, [index]);

	return (
		<ol className="flex flex-col">
			{displayStations.length === 0
				? (
					<li className="px-4 py-8 text-center text-sm text-zinc-500">
						{lang === "jp" ? "駅が見つかりません" : "No stations found"}
					</li>
				)
				: (
					displayStations.map((s) => {
						const globalIdx = stations.findIndex(st => st.jy === s.jy);
						const active = globalIdx === index;
						return (
							<li
								key={s.jy}
								ref={active ? activeRef : null}
								className="border-b border-zinc-100 dark:border-zinc-900 last:border-b-0"
							>
								<button
									type="button"
									onClick={() => {
										setIndex(globalIdx);
										onPick?.();
									}}
									className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition ${
										active
											? "bg-[#DC7970]/10"
											: "hover:bg-[#DC7970]/5"
									}`}
								>
									<span className={`tabular-nums text-xs font-mono ${
										active ? "text-[#DC7970] dark:text-[#DC7970]" : "text-zinc-500 dark:text-zinc-400"
									}`}
									>
										JY
										{s.jy}
									</span>
									<span className={`flex-1 text-base ${
										active ? "font-semibold text-zinc-900 dark:text-zinc-50" : "text-zinc-700 dark:text-zinc-300"
									}`}
									>
										{lang === "jp" ? s.kanji : s.name}
									</span>
									<span className={`text-xs ${
										active ? "text-[#DC7970]" : "text-zinc-400 dark:text-zinc-500"
									}`}
									>
										{direction === "outer" ? "→" : "←"}
									</span>
								</button>
							</li>
						);
					})
				)}
		</ol>
	);
}
