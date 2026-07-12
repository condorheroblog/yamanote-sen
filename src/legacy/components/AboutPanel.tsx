import { useTranslation } from "react-i18next";
import { AboutContent } from "./AboutContent";
import { CloseIcon } from "./Icons";

interface Props {
	open: boolean
	onClose: () => void
}

export function AboutPanel({ open, onClose }: Props) {
	const { t } = useTranslation();

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
						{t("about")}
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

				<div className="overflow-y-auto px-5 py-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
					<AboutContent />
				</div>
			</div>
		</div>
	);
}
