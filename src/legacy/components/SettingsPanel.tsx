import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { applyThemeClass, useSettings } from "../../store/settings";
import { CloseIcon, MoonIcon, SunIcon } from "./Icons";

interface Props {
	open: boolean
	onClose: () => void
}

export function SettingsPanel({ open, onClose }: Props) {
	const { t } = useTranslation();
	const theme = useSettings(s => s.theme);
	const lang = useSettings(s => s.lang);
	const setTheme = useSettings(s => s.setTheme);
	const setLang = useSettings(s => s.setLang);

	useEffect(() => {
		applyThemeClass(theme);
	}, [theme]);

	useEffect(() => {
		void import("../../i18n").then((m) => {
			m.default.changeLanguage(lang);
		});
	}, [lang]);

	if (!open)
		return null;

	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
			<div
				className="absolute inset-0 bg-black/40 backdrop-blur-sm"
				onClick={onClose}
				aria-hidden
			/>
			<div className="relative z-10 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-zinc-900 sm:max-h-[85vh] sm:rounded-3xl">
				<div className="flex items-center justify-between px-5 pt-5">
					<h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
						{t("settings")}
					</h2>
					<button
						type="button"
						onClick={onClose}
						aria-label={t("close")}
						className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
					>
						<CloseIcon size={20} />
					</button>
				</div>

				<div className="space-y-6 overflow-y-auto px-5 py-5 text-sm">
					<section>
						<h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
							{t("appearance")}
						</h3>
						<div className="grid grid-cols-2 gap-2">
							{(["light", "dark"] as const).map((m) => {
								const active = theme === m;
								return (
									<button
										key={m}
										type="button"
										onClick={() => setTheme(m)}
										className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 font-medium transition ${
											active
												? "border-[#DC7970] bg-[#DC7970]/10 text-[#DC7970] dark:bg-[#DC7970]/10 dark:text-[#DC7970]"
												: "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-300"
										}`}
									>
										{m === "light" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
										{t(m)}
									</button>
								);
							})}
						</div>
					</section>

					<section>
						<h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
							{t("stationNames")}
						</h3>
						<div className="grid grid-cols-2 gap-2">
							{(["en", "jp"] as const).map((l) => {
								const active = lang === l;
								return (
									<button
										key={l}
										type="button"
										onClick={() => setLang(l)}
										className={`rounded-2xl border px-4 py-3 font-medium transition ${
											active
												? "border-[#DC7970] bg-[#DC7970]/10 text-[#DC7970] dark:bg-[#DC7970]/10 dark:text-[#DC7970]"
												: "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-300"
										}`}
									>
										{t(l === "en" ? "langEn" : "langJp")}
									</button>
								);
							})}
						</div>
					</section>

					<section>
						<h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
							{t("offlinePlayback")}
						</h3>
						<p className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
							{t("offlineDescription")}
						</p>
					</section>
				</div>
			</div>
		</div>
	);
}
