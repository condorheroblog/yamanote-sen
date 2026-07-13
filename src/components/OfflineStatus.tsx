// Floating chip that shows offline state + audio precache progress.
// Subscribes to the precache event bus and the browser online/offline events.
//
// The whole component is hidden when the app is already running in PWA
// standalone mode (detected via the `display-mode: standalone` media query
// in `index.css`), since prompting the user to install an already-installed
// PWA is meaningless.

import type { JSX } from "react";
import type { Progress } from "../lib/precache";
import { useEffect, useState } from "react";
import {
	getProgressSnapshot,
	pauseBackgroundPrecache,
	resetPrecache,
	startBackgroundPrecache,
	subscribePrecacheProgress,
} from "../lib/precache";

// Minimal shape of the deferred install prompt exposed by some browsers.
interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>
	userChoice: Promise<{ outcome: "accepted" | "dismissed", platform: string }>
}

function pct(p: Progress): number {
	if (p.total === 0)
		return 100;
	return Math.round((p.completed.length / p.total) * 100);
}

function InstallToast({ message, onDone }: { message: string, onDone: () => void }): JSX.Element {
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

export function OfflineStatus(): JSX.Element | null {
	const [online, setOnline] = useState<boolean>(
		typeof navigator === "undefined" ? true : navigator.onLine,
	);
	const [progress, setProgress] = useState<Progress>(() => getProgressSnapshot());
	const [collapsed, setCollapsed] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);
	const [installDialogOpen, setInstallDialogOpen] = useState<boolean>(false);
	const [toast, setToast] = useState<string | null>(null);
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

	useEffect(() => {
		const onOnline = () => setOnline(true);
		const onOffline = () => setOnline(false);
		const onBeforeInstall = (e: Event) => {
			// Stash the prompt so we can trigger it from a user gesture later.
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);
		};
		const onAppInstalled = () => {
			setDeferredPrompt(null);
			setInstallDialogOpen(false);
		};
		window.addEventListener("online", onOnline);
		window.addEventListener("offline", onOffline);
		window.addEventListener("beforeinstallprompt", onBeforeInstall);
		window.addEventListener("appinstalled", onAppInstalled);
		// Precache mutates its internal `Progress` object in place and notifies
		// the same reference, so wrapping it in a new object here is required
		// for React's `useState` bailout check (Object.is) to actually re-render.
		const onPrecacheUpdate = (p: Progress) => setProgress({ ...p });
		const unsub = subscribePrecacheProgress(onPrecacheUpdate);
		return () => {
			window.removeEventListener("online", onOnline);
			window.removeEventListener("offline", onOffline);
			window.removeEventListener("beforeinstallprompt", onBeforeInstall);
			window.removeEventListener("appinstalled", onAppInstalled);
			unsub();
		};
	}, []);

	useEffect(() => {
		if (progress.pending.length === 0 && !collapsed)
			setCollapsed(true);
	}, [progress.pending.length, collapsed]);

	const cached = progress.completed.length;
	const total = progress.total;
	const ratio = pct(progress);

	async function handleConfirmInstall(): Promise<void> {
		setInstallDialogOpen(false);
		if (deferredPrompt) {
			try {
				await deferredPrompt.prompt();
				const choice = await deferredPrompt.userChoice;
				if (choice.outcome === "accepted") {
					setToast("正在准备安装…");
				}
				else {
					setToast("已取消安装");
				}
				setDeferredPrompt(null);
			}
			catch {
				setToast("请使用浏览器菜单中的“添加到主屏幕”完成安装。");
			}
		}
		else {
			setToast("请使用浏览器菜单中的“添加到主屏幕”完成安装。");
		}
	}

	// 完全离线可用 → 折叠为可点击的"安装"图标
	if (collapsed && total > 0 && cached >= total) {
		return (
			<div className="pwa-hide-when-installed">
				<button
					type="button"
					title="可安装离线使用"
					aria-label="可安装离线使用"
					onClick={() => setInstallDialogOpen(true)}
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
				{installDialogOpen
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
										onClick={() => setInstallDialogOpen(false)}
										className="text-zinc-500 transition hover:text-zinc-700 dark:hover:text-zinc-300"
										aria-label="关闭"
									>
										✕
									</button>
								</div>
								<p className="mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
									所有音频资源（共
									{" "}
									{total}
									{" "}
									个）已下载完成，当前版本已支持离线安装使用。安装后无需联网即可播放全部音频。
								</p>
								<ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-zinc-600 dark:text-zinc-300">
									<li>使用浏览器菜单中的“添加到主屏幕”即可完成安装</li>
									<li>安装后可从桌面图标离线启动并播放音频</li>
									<li>如不再需要，可在浏览器应用管理中随时卸载</li>
								</ul>
								<div className="mt-5 flex justify-end gap-2">
									<button
										type="button"
										onClick={() => setInstallDialogOpen(false)}
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
					? <InstallToast message={toast} onDone={() => setToast(null)} />
					: null}
			</div>
		);
	}

	return (
		<div className="pwa-hide-when-installed">
			<button
				type="button"
				onClick={() => setOpen(v => !v)}
				aria-expanded={open}
				className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-md ring-1 ring-zinc-900/5 backdrop-blur transition active:scale-[0.97] hover:bg-white dark:bg-zinc-900/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:bg-zinc-900"
			>
				<span
					className={`inline-block h-2 w-2 rounded-full ${online ? "bg-emerald-500" : "bg-amber-500"}`}
				/>
				<span>
					{online ? "在线" : "离线"}
					{cached > 0 && ` · 已缓存 ${cached}/${total}`}
				</span>
			</button>
			{/* Render the expanded panel as a fixed-positioned overlay anchored to
				the same bottom-right corner as the chip, so opening it does not
				resize the flex container that holds the New/Legacy toggle. */}
			{open
				? (
					<div className="fixed bottom-16 right-4 z-[55] w-72 rounded-2xl bg-white/95 p-3 shadow-lg ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-900/95 dark:ring-white/10">
						<div className="flex items-center justify-between text-xs">
							<span className="font-medium text-zinc-700 dark:text-zinc-200">
								离线音频缓存
							</span>
							<button
								type="button"
								onClick={() => setOpen(false)}
								className="rounded p-1 text-zinc-500 transition active:scale-90 hover:text-zinc-700 dark:hover:text-zinc-300"
								aria-label="关闭"
							>
								✕
							</button>
						</div>
						<div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
							<div
								className="h-full bg-emerald-500 transition-all duration-300"
								style={{ width: `${ratio}%` }}
							/>
						</div>
						<div className="mt-1.5 flex justify-between text-[10px] text-zinc-500 dark:text-zinc-400">
							<span>
								{cached}
								{" "}
								/
								{total}
								{" "}
								(
								{ratio}
								%)
							</span>
							<span>{online ? "在线" : "离线"}</span>
						</div>
						<div className="mt-3 flex gap-2">
							{progress.pending.length > 0
								? (
									<button
										type="button"
										onClick={startBackgroundPrecache}
										className="flex-1 rounded-lg bg-emerald-500 px-2 py-1 text-xs font-medium text-white transition active:scale-[0.97] active:bg-emerald-600 hover:bg-emerald-600"
									>
										继续下载
									</button>
								)
								: (
									<button
										type="button"
										onClick={startBackgroundPrecache}
										className="flex-1 rounded-lg bg-zinc-700 px-2 py-1 text-xs font-medium text-white transition active:scale-[0.97] active:bg-zinc-800 hover:bg-zinc-600 dark:bg-zinc-600 dark:hover:bg-zinc-500"
									>
										重新下载
									</button>
								)}
							<button
								type="button"
								onClick={pauseBackgroundPrecache}
								className="rounded-lg bg-zinc-200 px-2 py-1 text-xs font-medium text-zinc-700 transition active:scale-[0.97] active:bg-zinc-400/60 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
							>
								暂停
							</button>
							<button
								type="button"
								onClick={() => {
									void resetPrecache();
									startBackgroundPrecache();
								}}
								className="rounded-lg bg-rose-500/90 px-2 py-1 text-xs font-medium text-white transition active:scale-[0.97] active:bg-rose-600 hover:bg-rose-500"
							>
								重置
							</button>
						</div>
					</div>
				)
				: null}
		</div>
	);
}
