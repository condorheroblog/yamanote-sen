import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { stations } from "../../data/stations";

export function AboutContent() {
	const { t } = useTranslation();
	const [showAll, setShowAll] = useState(false);

	const sharedOuter = useMemo(() => {
		const map = new Map<string, number>();
		for (const s of stations) {
			map.set(s.melody.outer, (map.get(s.melody.outer) ?? 0) + 1);
		}
		return new Set([...map.entries()].filter(([, n]) => n > 1).map(([k]) => k));
	}, []);
	const sharedInner = useMemo(() => {
		const map = new Map<string, number>();
		for (const s of stations) {
			map.set(s.melody.inner, (map.get(s.melody.inner) ?? 0) + 1);
		}
		return new Set([...map.entries()].filter(([, n]) => n > 1).map(([k]) => k));
	}, []);

	return (
		<div className="space-y-4">
			<p>{t("aboutP1")}</p>
			<p>{t("aboutP2")}</p>
			<p>{t("aboutP3")}</p>
			<p className="text-zinc-500 dark:text-zinc-400">{t("aboutNote")}</p>

			<div>
				<h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
					{t("theMelodies")}
				</h3>
				<div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
					<table className="w-full text-left text-sm">
						<thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400">
							<tr>
								<th className="px-3 py-2 font-medium">{t("station")}</th>
								<th className="px-3 py-2 font-medium">{t("outerLoop")}</th>
								<th className="px-3 py-2 font-medium">{t("innerLoop")}</th>
							</tr>
						</thead>
						<tbody>
							{stations.slice(0, showAll ? stations.length : 6).map(s => (
								<tr key={s.jy} className="border-t border-zinc-100 dark:border-zinc-800">
									<td className="px-3 py-2">
										<span className="block font-medium text-zinc-900 dark:text-zinc-50">{s.name}</span>
										<span className="block text-xs text-zinc-500 dark:text-zinc-400">{s.kanji}</span>
									</td>
									<td className={`px-3 py-2 ${sharedOuter.has(s.melody.outer) ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
										{s.melody.outer}
									</td>
									<td className={`px-3 py-2 ${sharedInner.has(s.melody.inner) ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
										{s.melody.inner}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<button
					type="button"
					onClick={() => setShowAll(v => !v)}
					className="mt-3 text-sm font-medium text-[#DC7970] hover:text-[#C06A60] dark:text-[#DC7970] dark:hover:text-[#E08A7F]"
				>
					{showAll ? t("hideAll") : t("showAll")}
				</button>
			</div>

			<p className="pt-2 text-xs text-zinc-500 dark:text-zinc-500">{t("by")}</p>
		</div>
	);
}
