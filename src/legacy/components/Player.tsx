import { useTranslation } from "react-i18next";
import { stations } from "../../data/stations";
import { usePlayer } from "../../store/player";
import { useSettings } from "../../store/settings";
import { Controls } from "./Controls";
import { DirectionToggle } from "./DirectionToggle";
import { ScrubBar } from "./ScrubBar";

export function Player() {
	const { t } = useTranslation();
	const index = usePlayer(s => s.index);
	const direction = usePlayer(s => s.direction);
	const lang = useSettings(s => s.lang);
	const station = stations[index];

	return (
		<div className="flex flex-col items-center px-5 pt-8 pb-6 sm:pt-14">
			<span className="inline-flex flex-col items-center justify-center rounded-xl border-4 border-[#7BAB4F] bg-transparent px-2 py-1 leading-none tabular-nums text-[#2A2A2A] dark:text-[#888888]">
				<span className="font-bold tracking-wide">JY</span>
				<span className="text-3xl leading-none font-bold tabular-nums">
					{station.jy}
				</span>
			</span>
			<h1 className="mt-2 text-center text-5xl font-semibold tracking-tight text-[#2A2A2A] dark:text-[#888888] sm:text-6xl">
				{lang === "jp" ? station.kanji : station.name}
			</h1>
			{lang === "jp" && (
				<p className="mt-2 text-base text-[#888888]">{station.name}</p>
			)}
			{lang !== "jp" && (
				<p className="mt-2 text-base text-[#888888]">{station.kanji}</p>
			)}

			<p className="mt-3 text-xs uppercase tracking-wide text-[#AAAAAA] dark:text-[#666666]">
				{t(direction === "outer" ? "outerLoop" : "innerLoop")}
			</p>

			<div className="mt-6 w-full max-w-md">
				<ScrubBar direction={direction} />
			</div>

			<div className="mt-2 w-full max-w-md">
				<Controls />
			</div>

			<div className="mt-4">
				<DirectionToggle />
			</div>
		</div>
	);
}
