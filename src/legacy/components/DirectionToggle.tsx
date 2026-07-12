import type { Direction } from "../../data/stations";
import { useTranslation } from "react-i18next";
import { usePlayer } from "../../store/player";

export function DirectionToggle() {
	const { t } = useTranslation();
	const direction = usePlayer(s => s.direction);
	const setDirection = usePlayer(s => s.setDirection);

	return (
		<div className="inline-flex rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-1 text-sm font-medium">
			{(["outer", "inner"] as Direction[]).map((d) => {
				const active = direction === d;
				return (
					<button
						key={d}
						type="button"
						onClick={() => setDirection(d)}
						className={`rounded-full px-4 py-1.5 transition ${
							active
								? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow border border-[#DC7970]"
								: "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
						}`}
					>
						{t(d === "outer" ? "outerLoop" : "innerLoop")}
					</button>
				);
			})}
		</div>
	);
}
