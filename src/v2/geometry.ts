// Geometry helpers for the v2 loop diagram.
//
// The shape is a chamfered rectangle drawn in a unit square (0..1 in both axes)
// so we can scale it to any container. Going counter-clockwise from the middle
// of the right edge, the polygon has 7 vertices:
//
//   P1 (top of right edge, before small bevel)
//   P2 (top edge, right end, after small bevel)
//   P3 (top edge, left end, before large top-left bevel)
//   P4 (top of left edge, after large top-left bevel)
//   P5 (bottom-left, right angle — no bevel)
//   P6 (bottom edge, right end, before large bottom-right bevel)
//   P7 (bottom of right edge, after large bottom-right bevel)
//
// Three of the four corners are chamfered:
//   - top-right: small bevel
//   - top-left:  large bevel
//   - bottom-right: large bevel
//   - bottom-left: right angle (no bevel)
//
// We distribute 30 stations evenly along the perimeter, starting at station #1
// on the right edge and walking counter-clockwise.

export type SideId = "right" | "topRightBevel" | "top" | "topLeftBevel" | "left" | "bottom" | "bottomRightBevel";

export interface Vertex {
	x: number
	y: number
}

export interface SideSegment {
	id: SideId
	from: Vertex
	to: Vertex
	length: number
	/** Whether the station label should be rendered horizontally. */
	horizontal: boolean
	/** Where to anchor the label relative to the station circle. */
	labelAnchor: "right" | "left" | "above" | "below"
}

export interface LoopGeometry {
	width: number
	height: number
	segments: SideSegment[]
	perimeter: number
	/** Polygon vertex list (counter-clockwise) — handy for the SVG outline. */
	polygon: Vertex[]
}

export interface StationPlacement {
	index: number
	x: number
	y: number
	side: SideId
	sideOffset: number // 0..1 along the side, useful for debugging
	horizontal: boolean
	labelAnchor: "right" | "left" | "above" | "below"
}

interface Params {
	width: number
	height: number
	smallBevel: number
	largeBevelTopLeft: number
	largeBevelBottomRight: number
}

/**
 * Build the chamfered-rectangle geometry. Coordinates are in user units; the
 * caller is responsible for scaling via viewBox / width / height on the SVG.
 */
export function buildLoopGeometry(params: Params): LoopGeometry {
	const { width: W, height: H, smallBevel: s, largeBevelTopLeft: L1, largeBevelBottomRight: L2 } = params;

	// Vertices going counter-clockwise from top of right edge.
	const P1: Vertex = { x: W, y: s };
	const P2: Vertex = { x: W - s, y: 0 };
	const P3: Vertex = { x: L1, y: 0 };
	const P4: Vertex = { x: 0, y: L1 };
	const P5: Vertex = { x: 0, y: H };
	const P6: Vertex = { x: W - L2, y: H };
	const P7: Vertex = { x: W, y: H - L2 };

	const seg = (
		id: SideId,
		from: Vertex,
		to: Vertex,
		horizontal: boolean,
		labelAnchor: SideSegment["labelAnchor"],
	): SideSegment => ({
		id,
		from,
		to,
		length: Math.hypot(to.x - from.x, to.y - from.y),
		horizontal,
		labelAnchor,
	});

	const segments: SideSegment[] = [
		seg("right", P7, P1, true, "right"),
		seg("topRightBevel", P1, P2, true, "right"),
		seg("top", P2, P3, false, "above"),
		seg("topLeftBevel", P3, P4, false, "above"),
		seg("left", P4, P5, true, "left"),
		seg("bottom", P5, P6, false, "below"),
		seg("bottomRightBevel", P6, P7, false, "below"),
	];

	const perimeter = segments.reduce((acc, s) => acc + s.length, 0);

	return {
		width: W,
		height: H,
		segments,
		perimeter,
		polygon: [P1, P2, P3, P4, P5, P6, P7],
	};
}

function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

function pointOnSegment(segment: SideSegment, t: number): Vertex {
	const { from, to } = segment;
	return {
		x: lerp(from.x, to.x, t),
		y: lerp(from.y, to.y, t),
	};
}

/**
 * Lay out N stations evenly along the perimeter.
 *
 *   - `startAt` lets the caller rotate the starting point along the perimeter.
 *   - `clockwise` controls the walk direction. Default traversal is
 *     counter-clockwise; pass `true` to walk the loop clockwise.
 *
 * Both Yamanote loops anchor at Ōsaki (JY24), which sits at the midpoint of
 * the bottom edge of this geometry. The label anchor on each segment is
 * fixed (it tells the renderer where the label pill goes relative to the
 * polygon edge, e.g. "below" for the bottom segment) and does not change
 * with the walk direction.
 */
export function placeStations(
	geometry: LoopGeometry,
	count: number,
	startAt = 0,
	clockwise = false,
): StationPlacement[] {
	const { segments, perimeter } = geometry;
	const placements: StationPlacement[] = [];
	const slot = perimeter / count;
	for (let i = 0; i < count; i++) {
		// Distance from the chosen start, walking counter-clockwise by default;
		// for a clockwise traversal we step *backwards* along the perimeter.
		const target = clockwise
			? ((startAt - i * slot) % perimeter + perimeter) % perimeter
			: (startAt + i * slot) % perimeter;
		let acc = 0;
		for (const seg of segments) {
			if (acc + seg.length >= target || seg === segments[segments.length - 1]) {
				const t = Math.max(0, Math.min(1, (target - acc) / seg.length));
				const p = pointOnSegment(seg, t);
				placements.push({
					index: i,
					x: p.x,
					y: p.y,
					side: seg.id,
					sideOffset: t,
					horizontal: seg.horizontal,
					labelAnchor: seg.labelAnchor,
				});
				break;
			}
			acc += seg.length;
		}
	}
	return placements;
}

/**
 * Path string for the chamfered polygon outline, suitable for <path d="...">.
 */
export function polygonPath(geometry: LoopGeometry): string {
	const last = geometry.polygon[geometry.polygon.length - 1];
	const head = `M${last.x.toFixed(3)},${last.y.toFixed(3)}`;
	const tail = geometry.polygon
		.map(p => `L${p.x.toFixed(3)},${p.y.toFixed(3)}`)
		.join(" ");
	return `${head} ${tail} Z`;
}
