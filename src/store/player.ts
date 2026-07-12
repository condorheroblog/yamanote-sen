import type { Direction } from "../data/stations";
import { create } from "zustand";
import { stations } from "../data/stations";

export interface PlayerState {
	index: number // 0-29
	direction: Direction
	isPlaying: boolean
	setIndex: (i: number) => void
	setDirection: (d: Direction) => void
	toggleDirection: () => void
	setPlaying: (p: boolean) => void
	togglePlaying: () => void
	next: () => void
	prev: () => void
}

function normalizeIndex(i: number): number {
	const n = stations.length;
	return ((i % n) + n) % n;
}

export const usePlayer = create<PlayerState>((set, get) => ({
	index: 0,
	direction: "outer",
	isPlaying: false,
	setIndex: i => set({ index: normalizeIndex(i) }),
	setDirection: d => set({ direction: d }),
	toggleDirection: () => set({ direction: get().direction === "outer" ? "inner" : "outer" }),
	setPlaying: p => set({ isPlaying: p }),
	togglePlaying: () => set({ isPlaying: !get().isPlaying }),
	next: () => set({ index: normalizeIndex(get().index + 1) }),
	prev: () => set({ index: normalizeIndex(get().index - 1) }),
}));

// Convenience selectors
export function currentStation(): (typeof stations)[number] {
	return stations[usePlayer.getState().index];
}
