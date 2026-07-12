import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AboutContent } from "./AboutContent";
import { ChevronDownIcon } from "./Icons";

export function About() {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	return (
		<section className="border-t border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-950/40">
			<button
				type="button"
				onClick={() => setOpen(o => !o)}
				aria-expanded={open}
				className="flex w-full items-center justify-between px-4 py-4 text-left"
			>
				<span className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
					{t("about")}
				</span>
				<ChevronDownIcon
					size={18}
					className={`text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
				/>
			</button>
			{open && (
				<div className="px-4 pb-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
					<AboutContent />
				</div>
			)}
		</section>
	);
}
