// Centralised default geometry used by the v2 loop diagram.
// Kept in its own module so the component file remains HMR-friendly.
//
// The chamfered-rectangle is defined in a single `buildLoopGeometry` helper so
// both landscape (PC) and portrait (mobile) variants share the same algorithm.
// Each variant only differs in the `width` / `height` / bevel magnitudes — the
// station-placement algorithm in `geometry.ts` is orientation-agnostic and
// distributes 30 stations evenly along the perimeter regardless of aspect.

import type { LoopGeometry } from "./geometry";
import { buildLoopGeometry } from "./geometry";

export type LoopOrientation = "landscape" | "portrait";

/**
 * Build the default geometry for the requested orientation.
 *
 * The landscape variant mirrors the original PC layout: a wide chamfered
 * rectangle (≈2.3:1) with three beveled corners and 30 stations.
 *
 * The portrait variant keeps the same chamfered shape and station count but
 * rotates it 90° (so it becomes tall, ≈1:2.3) and uses the same physical
 * bevel lengths. That way the on-screen stroke widths, station circles and
 * label pills stay visually identical — only the aspect ratio changes.
 */
export function buildDefaultGeometry(orientation: LoopOrientation): LoopGeometry {
	if (orientation === "portrait") {
		// 360 × 800 user units ≈ 1:2.22 aspect ratio, comfortable for
		// phones in portrait orientation. We swap the dimensions of the
		// landscape layout so the existing geometry helpers (which place
		// bevels in the top-left, top-right and bottom-right corners of the
		// rectangle) produce a tall shape with the same proportions of
		// chamfered corner.
		return buildLoopGeometry({
			width: 360,
			height: 800,
			smallBevel: 40,
			largeBevelTopLeft: 130,
			largeBevelBottomRight: 150,
		});
	}

	return buildLoopGeometry({
		width: 800,
		height: 350,
		smallBevel: 40,
		largeBevelTopLeft: 130,
		largeBevelBottomRight: 150,
	});
}
