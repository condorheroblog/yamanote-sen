import type { Direction } from "../data/stations";
import { useEffect, useRef, useState } from "react";
import { stations } from "../data/stations";
import { usePlayer } from "../store/player";

const EXT = (() => {
	if (typeof document === "undefined")
		return ".m4a";
	const a = document.createElement("audio");
	return a.canPlayType("audio/ogg; codecs=\"opus\"") ? ".opus" : ".m4a";
})();

function audioSrc(index: number, direction: Direction): string {
	return stations[index].audio[direction] + EXT;
}

interface AudioApi {
	currentTime: number
	duration: number
	isReady: boolean
	hasError: boolean
	seekFraction: (frac: number) => void
	toggle: () => void
}

const sharedAudio = (() => {
	if (typeof window === "undefined")
		return null;
	const el = new Audio();
	el.preload = "auto";
	return el;
})();

// `sharedAudio` is a module-level singleton, so the listeners we attach to it
// (especially the `ended` handler that calls `usePlayer.getState().next()`)
// must be installed exactly once. Without this guard, every component that
// calls `useAudioEngine` would attach its own `ended` listener and a single
// `audio.ended` event would advance the station index once per consumer —
// e.g. `NewApp` + `InlinePlayer` would skip two stations on auto-advance.
//
// Each consumer registers its own setters through `registerEngineSetters`,
// and the (single) installed listeners fan out to all registered setters.
// The listeners themselves are only added once for the lifetime of the page.
interface EngineSetters {
	setCurrentTime: (t: number) => void
	setDuration: (d: number) => void
	setIsReady: (r: boolean) => void
	setHasError: (e: boolean) => void
}

const engineSettersList = new Set<EngineSetters>();
let engineListenersInstalled = false;

function installEngineListenersOnce(): void {
	if (!sharedAudio || engineListenersInstalled)
		return;
	sharedAudio.addEventListener("timeupdate", () => {
		for (const s of engineSettersList)
			s.setCurrentTime(sharedAudio.currentTime);
	});
	sharedAudio.addEventListener("loadedmetadata", () => {
		const d = Number.isFinite(sharedAudio.duration) ? sharedAudio.duration : 0;
		for (const s of engineSettersList)
			s.setDuration(d);
	});
	sharedAudio.addEventListener("durationchange", () => {
		const d = Number.isFinite(sharedAudio.duration) ? sharedAudio.duration : 0;
		for (const s of engineSettersList)
			s.setDuration(d);
	});
	sharedAudio.addEventListener("canplay", () => {
		for (const s of engineSettersList)
			s.setIsReady(true);
	});
	// The `ended` handler advances to the next station. This is the handler
	// that was being attached multiple times (once per `useAudioEngine`
	// consumer) before the singleton guard was added — which is what caused
	// auto-advance to skip several stations instead of going to the next one.
	sharedAudio.addEventListener("ended", () => {
		usePlayer.getState().next();
	});
	sharedAudio.addEventListener("error", () => {
		for (const s of engineSettersList)
			s.setHasError(true);
	});
	engineListenersInstalled = true;
}

export function useAudioEngine(): AudioApi {
	const index = usePlayer(s => s.index);
	const direction = usePlayer(s => s.direction);
	const isPlaying = usePlayer(s => s.isPlaying);
	const setPlaying = usePlayer(s => s.setPlaying);

	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [isReady, setIsReady] = useState(false);
	const [hasError, setHasError] = useState(false);

	const cacheKey = `${index}:${direction}`;
	const lastKeyRef = useRef<string | null>(null);

	// Install the singleton `sharedAudio` listeners on first mount and
	// register this consumer's setters so playback events drive our React
	// state. The listeners themselves are only added once for the lifetime
	// of the page — see the comment on `installEngineListenersOnce` above.
	useEffect(() => {
		installEngineListenersOnce();
		const setters: EngineSetters = {
			setCurrentTime,
			setDuration,
			setIsReady,
			setHasError,
		};
		engineSettersList.add(setters);
		return () => {
			engineSettersList.delete(setters);
		};
	}, []);

	useEffect(() => {
		if (!sharedAudio)
			return;
		if (lastKeyRef.current === cacheKey)
			return;
		lastKeyRef.current = cacheKey;
		setIsReady(false);
		setHasError(false);
		setCurrentTime(0);
		setDuration(0);
		sharedAudio.pause();
		const src = audioSrc(index, direction);
		// 触发 SW runtime cache(若未缓存);保证下次离线可用
		if ("caches" in globalThis) {
			void caches.match(src).then((hit) => {
				if (!hit)
					void fetch(src);
			});
		}
		sharedAudio.src = src;
		sharedAudio.load();
	}, [cacheKey, index, direction]);

	useEffect(() => {
		if (!sharedAudio)
			return;
		if (!isReady)
			return;
		if (isPlaying) {
			void sharedAudio.play().catch(() => setPlaying(false));
		}
		else {
			sharedAudio.pause();
		}
	}, [isPlaying, isReady, setPlaying]);

	function seekFraction(frac: number): void {
		if (!sharedAudio)
			return;
		if (!duration)
			return;
		sharedAudio.currentTime = Math.max(0, Math.min(1, frac)) * duration;
		setCurrentTime(sharedAudio.currentTime);
	}

	function toggle(): void {
		if (!isReady)
			return;
		usePlayer.getState().togglePlaying();
	}

	return { currentTime, duration, isReady, hasError, seekFraction, toggle };
}
