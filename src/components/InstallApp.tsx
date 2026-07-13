// Install UI for the PWA. The actual audio caching is handled on-demand by
// `lib/audio.ts` (every newly-played station is fetched once and the SW's
// runtime CacheFirst rule populates `yamanote-audio` on first request), so
// this module only deals with the *install* affordance:
//
//   - <InstallButton/>   a compact chip rendered in the bottom-right cluster
//                         that opens a confirm dialog and triggers the
//                         deferred `beforeinstallprompt`.
//   - <InstallHint/>     a one-time, left-edge, gently-shaking chip shown
//                         on the user's first visit to nudge them toward
//                         the install button.
//
// Both elements are hidden automatically when the app is already running
// in PWA standalone mode (see `.pwa-hide-when-installed` in index.css).

import type { JSX } from "react";
import { useEffect, useState } from "react";

// Minimal shape of the deferred install prompt exposed by some browsers.
interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>
	userChoice: Promise<{ outcome: "accepted" | "dismissed", platform: string }>
}

function useBeforeInstallPrompt(): {
	prompt: BeforeInstallPromptEvent | null
	installed: boolean
} {
	const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
	const [installed, setInstalled] = useState<boolean>(false);

	useEffect(() => {
		const onBeforeInstall = (e: Event) => {
			// Stash the prompt so we can trigger it from a user gesture later.
			e.preventDefault();
			setPrompt(e as BeforeInstallPromptEvent);
		};
		const onAppInstalled = () => {
			setPrompt(null);
			setInstalled(true);
		};
		window.addEventListener("beforeinstallprompt", onBeforeInstall);
		window.addEventListener("appinstalled", onAppInstalled);
		return () => {
			window.removeEventListener("beforeinstallprompt", onBeforeInstall);
			window.removeEventListener("appinstalled", onAppInstalled);
		};
	}, []);

	return { prompt, installed };
}

function Toast({ message, onDone }: { message: string, onDone: () => void }): JSX.Element {
	useEffect(() => {
		const id = window.setTimeout(onDone, 2400);
		return () => window.clearTimeout(id);
	}, [onDone]);
	return (
		<div
			role="status"
			aria-live="polite"
			className="fixed bottom-20 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-zinc-900/90 px-4 py-2 text-xs font-medium text-white shadow-lg backdrop-blur dark:bg-zinc-100/95 dark:text-zinc-900"
		>
			{message}
		</div>
	);
}

export function InstallButton(): JSX.Element | null {
	const { prompt: deferredPrompt, installed } = useBeforeInstallPrompt();
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [toast, setToast] = useState<string | null>(null);

	// Nothing to show if the app is already installed or there's no install
	// prompt available (e.g. iOS Safari, which doesn't fire beforeinstallprompt).
	if (installed)
		return null;

	async function handleConfirmInstall(): Promise<void> {
		setDialogOpen(false);
		if (deferredPrompt) {
			try {
				await deferredPrompt.prompt();
				const choice = await deferredPrompt.userChoice;
				if (choice.outcome === "accepted")
					setToast("正在准备安装…");
				else
					setToast("已取消安装");
			}
			catch {
				setToast("请使用浏览器菜单中的“添加到主屏幕”完成安装。");
			}
		}
		else {
			setToast("请使用浏览器菜单中的“添加到主屏幕”完成安装。");
		}
	}

	return (
		<div className="pwa-hide-when-installed">
			<button
				type="button"
				title="可安装离线使用"
				aria-label="可安装离线使用"
				onClick={() => setDialogOpen(true)}
				className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/90 text-white shadow-md backdrop-blur transition hover:bg-emerald-500 active:scale-95"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="h-4 w-4"
				>
					<path d="M12 3v12" />
					<path d="m7 10 5 5 5-5" />
					<path d="M5 21h14" />
				</svg>
			</button>
			{dialogOpen
				? (
					<div
						className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"
						role="dialog"
						aria-modal="true"
						aria-labelledby="install-dialog-title"
					>
						<div className="w-[min(28rem,calc(100vw-2rem))] rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-white/10">
							<div className="flex items-start justify-between gap-3">
								<h2
									id="install-dialog-title"
									className="text-sm font-semibold text-zinc-800 dark:text-zinc-100"
								>
									安装离线功能
								</h2>
								<button
									type="button"
									onClick={() => setDialogOpen(false)}
									className="text-zinc-500 transition hover:text-zinc-700 dark:hover:text-zinc-300"
									aria-label="关闭"
								>
									✕
								</button>
							</div>
							<p className="mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
								安装后可从桌面图标离线启动并播放已听过的音频，
								无需联网即可继续体验山手线之旅。
							</p>
							<ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-zinc-600 dark:text-zinc-300">
								<li>使用浏览器菜单中的“添加到主屏幕”即可完成安装</li>
								<li>听过的音频会被自动缓存,无需手动下载</li>
								<li>如不再需要，可在浏览器应用管理中随时卸载</li>
							</ul>
							<div className="mt-5 flex justify-end gap-2">
								<button
									type="button"
									onClick={() => setDialogOpen(false)}
									className="rounded-lg bg-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition active:scale-[0.97] hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
								>
									取消
								</button>
								<button
									type="button"
									onClick={() => {
										void handleConfirmInstall();
									}}
									className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white transition active:scale-[0.97] hover:bg-emerald-600"
								>
									确定安装
								</button>
							</div>
						</div>
					</div>
				)
				: null}
			{toast
				? <Toast message={toast} onDone={() => setToast(null)} />
				: null}
		</div>
	);
}

// Persist the dismissal in localStorage so the hint doesn't return on
// subsequent visits within the same browser.
const HINT_DISMISSED_KEY = "yamanote-sen.install-hint-dismissed";

export function InstallHint(): JSX.Element | null {
	const [visible, setVisible] = useState<boolean>(false);

	useEffect(() => {
		try {
			if (window.localStorage.getItem(HINT_DISMISSED_KEY) === "1")
				return;
		}
		catch { /* ignore */ }
		// Defer slightly so the page settles before the animation starts.
		const id = window.setTimeout(setVisible, 800, true);
		return () => window.clearTimeout(id);
	}, []);

	function dismiss(): void {
		setVisible(false);
		try {
			window.localStorage.setItem(HINT_DISMISSED_KEY, "1");
		}
		catch { /* ignore */ }
	}

	if (!visible)
		return null;

	return (
		<div
			className="pwa-hide-when-installed"
			style={{
				position: "fixed",
				left: "0.75rem",
				top: "50%",
				transform: "translateY(-50%)",
				zIndex: 40,
			}}
		>
			<div className="install-hint-shake flex items-center gap-2 rounded-full bg-white/95 py-1.5 pl-2 pr-3 text-xs font-medium text-zinc-700 shadow-lg ring-1 ring-zinc-900/5 backdrop-blur hover:[animation-play-state:paused] dark:bg-zinc-900/95 dark:text-zinc-200 dark:ring-white/10">
				<button
					type="button"
					onClick={dismiss}
					aria-label="安装离线使用"
					title="可安装离线使用"
					className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/90 text-white shadow-sm transition hover:bg-emerald-500 active:scale-95"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-3.5 w-3.5"
					>
						<path d="M12 17v.01" />
						<path d="M12 14a2 2 0 0 0 .91-3.83 2 2 0 1 0-2.82 2.82" />
						<path d="M12 22a10 10 0 1 1 10-10c0 1.38-.28 2.69-.78 3.88" />
						<path d="M22 22l-3-3" />
					</svg>
				</button>
				<span className="whitespace-nowrap pr-1">可安装离线使用</span>
				<button
					type="button"
					onClick={dismiss}
					aria-label="关闭提示"
					className="rounded-full p-0.5 text-zinc-400 transition hover:text-zinc-600 dark:hover:text-zinc-300"
				>
					✕
				</button>
			</div>
		</div>
	);
}

// Top-level entry point: renders both the left-edge first-visit hint and
// the bottom-right install button. The two pieces are independent — the
// hint lives on the left edge and the button lives in the bottom-right
// cluster — so they don't share state.
export function InstallApp(): JSX.Element {
	return (
		<>
			<InstallHint />
			<InstallButton />
		</>
	);
}
