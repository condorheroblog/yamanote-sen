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
	const lastKey = useRef<string | null>(null);

	useEffect(() => {
		if (!sharedAudio)
			return;
		if (lastKey.current === cacheKey)
			return;
		lastKey.current = cacheKey;
		setIsReady(false);
		setHasError(false);
		setCurrentTime(0);
		setDuration(0);
		sharedAudio.pause();
		sharedAudio.src = audioSrc(index, direction);
		sharedAudio.load();
	}, [cacheKey, index, direction]);

	useEffect(() => {
		if (!sharedAudio)
			return;
		const onTime = () => setCurrentTime(sharedAudio.currentTime);
		const onMeta = () =>
			setDuration(Number.isFinite(sharedAudio.duration) ? sharedAudio.duration : 0);
		const onCanPlay = () => setIsReady(true);
		const onEnd = () => usePlayer.getState().next();
		const onError = () => setHasError(true);

		sharedAudio.addEventListener("timeupdate", onTime);
		sharedAudio.addEventListener("loadedmetadata", onMeta);
		sharedAudio.addEventListener("durationchange", onMeta);
		sharedAudio.addEventListener("canplay", onCanPlay);
		sharedAudio.addEventListener("ended", onEnd);
		sharedAudio.addEventListener("error", onError);
		return () => {
			sharedAudio.removeEventListener("timeupdate", onTime);
			sharedAudio.removeEventListener("loadedmetadata", onMeta);
			sharedAudio.removeEventListener("durationchange", onMeta);
			sharedAudio.removeEventListener("canplay", onCanPlay);
			sharedAudio.removeEventListener("ended", onEnd);
			sharedAudio.removeEventListener("error", onError);
		};
	}, []);

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
