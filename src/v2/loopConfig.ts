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
		// Portrait (mobile): a chamfered rectangle that's tall enough to feel
		// like a "loop" but short enough that, when `width: 100%`, it fits
		// between the header (~60px), the mobile player row (~140px) and the
		// bottom of the viewport on a typical phone (~700px left). The
		// aspect ratio here (~0.75) intentionally trades off the very
		// narrow look of the previous 240×640 layout so station labels
		// have room to breathe without overflowing the viewport.
		return buildLoopGeometry({
			width: 360,
			height: 480,
			smallBevel: 28,
			largeBevelTopLeft: 96,
			largeBevelBottomRight: 110,
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
