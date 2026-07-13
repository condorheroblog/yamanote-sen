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
	// `next` / `prev` follow the *current* loop direction so the player walks
	// the Yamanote line the way the trains actually do:
	//   - outer (clockwise):          JY01 → JY02 → ... → JY30 → JY01
	//   - inner (counter-clockwise):  JY01 → JY30 → JY29 → ... → JY02 → JY01
	// Previously both directions just stepped `+1`, which made the inner
	// loop play stations in the wrong (clockwise) order.
	next: () => {
		const { direction, index } = get();
		const step = direction === "outer" ? 1 : -1;
		set({ index: normalizeIndex(index + step) });
	},
	prev: () => {
		const { direction, index } = get();
		const step = direction === "outer" ? -1 : 1;
		set({ index: normalizeIndex(index + step) });
	},
}));

// Convenience selectors
export function currentStation(): (typeof stations)[number] {
	return stations[usePlayer.getState().index];
}
