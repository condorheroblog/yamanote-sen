// Background precache of all station audio for offline playback.
// Uses the active Service Worker / Cache Storage (cache name: yamanote-audio).
// Strategy: idle-scheduled, low concurrency, persistent progress in localStorage.

import { stations } from "../data/stations";

const STORAGE_KEY = "yamanote-precache-progress-v1";
const CACHE_NAME = "yamanote-audio";
const CONCURRENCY = 3;

interface Progress {
	completed: string[]
	pending: string[]
	total: number
}

export type { Progress };

export type ProgressListener = (p: Progress) => void;

function getActiveExt(): string {
	if (typeof document === "undefined")
		return ".m4a";
	const a = document.createElement("audio");
	return a.canPlayType("audio/ogg; codecs=\"opus\"") ? ".opus" : ".m4a";
}

function getAllAudioUrls(): string[] {
	const ext = getActiveExt();
	const urls: string[] = [];
	for (const s of stations) {
		urls.push(`${s.audio.inner}${ext}`);
		urls.push(`${s.audio.outer}${ext}`);
	}
	return urls;
}

function loadProgress(): Progress {
	const all = getAllAudioUrls();
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw) as Progress;
			if (parsed.total === all.length)
				return parsed;
		}
	}
	catch { /* ignore */ }
	return { completed: [], pending: [...all], total: all.length };
}

function saveProgress(p: Progress): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
	}
	catch { /* ignore quota errors */ }
}

function notify(p: Progress, listener?: ProgressListener): void {
	listener?.(p);
	window.dispatchEvent(new CustomEvent<Progress>("yamanote-precache-progress", { detail: p }));
}

async function isCached(url: string): Promise<boolean> {
	if (!("caches" in globalThis))
		return false;
	try {
		const cache = await caches.open(CACHE_NAME);
		const hit = await cache.match(url);
		return Boolean(hit);
	}
	catch {
		return false;
	}
}

async function fetchOne(url: string): Promise<void> {
	if (await isCached(url))
		return;
	// Trigger SW runtime cache; SW's CacheFirst will populate cacheName=yamanote-audio
	await fetch(url, { cache: "reload" });
}

export function subscribePrecacheProgress(listener: ProgressListener): () => void {
	const onUpdate = (e: Event) => listener((e as CustomEvent<Progress>).detail);
	window.addEventListener("yamanote-precache-progress", onUpdate);
	return () => window.removeEventListener("yamanote-precache-progress", onUpdate);
}

export function getProgressSnapshot(): Progress {
	return loadProgress();
}

export async function resetPrecache(): Promise<void> {
	localStorage.removeItem(STORAGE_KEY);
	if ("caches" in globalThis) {
		try {
			await caches.delete(CACHE_NAME);
		}
		catch { /* ignore */ }
	}
	const fresh = { completed: [], pending: getAllAudioUrls(), total: getAllAudioUrls().length };
	saveProgress(fresh);
	notify(fresh);
}

function idle(cb: () => void): void {
	if (typeof window === "undefined")
		return;
	const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
	if (ric)
		ric(cb);
	else
		setTimeout(cb, 1500);
}

let pumpHandle: number | null = null;
let running = false;

export function startBackgroundPrecache(): void {
	if (typeof window === "undefined")
		return;
	if (!("serviceWorker" in navigator))
		return;
	if (running)
		return;
	running = true;

	const progress = loadProgress();
	if (progress.pending.length === 0) {
		notify(progress);
		return;
	}

	notify(progress);

	const pump = async () => {
		pumpHandle = null;
		if (!navigator.onLine) {
			idle(() => {
				pumpHandle = window.setTimeout(pump, 5000);
			});
			return;
		}
		const batch = progress.pending.splice(0, CONCURRENCY);
		if (batch.length === 0) {
			notify(progress);
			running = false;
			return;
		}
		await Promise.allSettled(batch.map(async (url) => {
			try {
				await fetchOne(url);
				if (!progress.completed.includes(url))
					progress.completed.push(url);
			}
			catch { /* keep in pending for next round */ }
			finally {
				// remove from pending regardless (retry handled by reset)
				const idx = progress.pending.indexOf(url);
				if (idx >= 0)
					progress.pending.splice(idx, 1);
			}
		}));
		saveProgress(progress);
		notify(progress);

		if (progress.pending.length > 0) {
			idle(() => {
				pumpHandle = window.setTimeout(pump, 500);
			});
		}
		else {
			running = false;
		}
	};

	idle(pump);
}

export function pauseBackgroundPrecache(): void {
	if (pumpHandle !== null) {
		clearTimeout(pumpHandle);
		pumpHandle = null;
	}
	running = false;
}
