// Visual representation of the chamfered rectangle and its 30 stations.
//
// The shape is drawn as an SVG so it scales cleanly across breakpoints; station
// labels are HTML overlays so the text rendering matches the rest of the app.
// We compute everything once per render via the geometry helpers and then map
// stations into the SVG coordinate space.

import type { CSSProperties, JSX } from "react";
import type { Station } from "../data/stations";
import type { LoopGeometry, SideSegment, StationPlacement } from "./geometry";
import type { LoopOrientation } from "./loopConfig";
import { Fragment, useMemo, useRef } from "react";
import { stations as stationList } from "../data/stations";
import { usePlayer } from "../store/player";
import { placeStations, polygonPath } from "./geometry";

interface Props {
	geometry: LoopGeometry
	activeIndex: number
	/** Current viewport orientation — used for outer container sizing hints. */
	orientation: LoopOrientation
}

const STATION_RADIUS = 12;

/**
 * Anchor length (along the perimeter) for Ōsaki (JY24) — counted from the top
 * of the right edge going counter-clockwise. Ōsaki sits at the midpoint of
 * the bottom edge in this geometry, which is the natural starting point for
 * both the inner (counter-clockwise) and outer (clockwise) loops.
 */
function osakiStartAt(geometry: LoopGeometry): number {
	const bottom = geometry.segments.find(s => s.id === "bottom");
	if (!bottom)
		return 0;
	// Distance accumulated up to (and including) the right edge / top edges /
	// left edge, then half the bottom length.
	const acc = geometry.segments
		.filter(s => s.id !== "bottom" && s.id !== "bottomRightBevel")
		.reduce((sum, s) => sum + s.length, 0);
	return acc + bottom.length / 2;
}

interface LabelLayout {
	/** Side of the pill that the JY+number badge occupies. */
	badgeSide: "left" | "right" | "top" | "bottom"
	/** Horizontal text alignment inside the pill (used for right/left edges). */
	textAlign: "left" | "right" | "center"
	/** True for the top/bottom polygon edges, where kanji/name stack vertically. */
	verticalText: boolean
	/**
	 * Cross-axis alignment of the vertical text columns. For the top edge the
	 * columns sit at the *bottom* of the row (`items-end`), since the badge
	 * below them is what hugs the circle. For the bottom edge the opposite.
	 */
	crossAlign: "start" | "end" | "center"
}

/**
 * Decide how the label card is laid out based on the station's label anchor.
 *
 * Rules (matches the requested behaviour):
 *  - The JY+number badge is always the part of the label closest to the
 *    circle. The badge is a vertical stack of "JY" on top and the number on
 *    the bottom (mirrors the legacy `Player.tsx` badge style) and reads
 *    upright.
 *  - On the right edge the kanji/English are left-aligned; on the left
 *    edge they are right-aligned; the badge sits on the inside (the side
 *    nearest the circle).
 *  - On the top/bottom edges the kanji and English name are each stacked
 *    vertically in their own column: the kanji column is on the right side
 *    of the pill, the English column on the left side. Each character sits
 *    on its side (writing direction is horizontal — you tilt your head to
 *    read them, like the old JR station boards). The badge stays upright
 *    and remains adjacent to the circle. The columns sit at the *bottom*
 *    of the row on the top edge (so the badge below them hugs the circle)
 *    and at the *top* of the row on the bottom edge.
 */
function layoutForAnchor(anchor: SideSegment["labelAnchor"]): LabelLayout {
	switch (anchor) {
		case "right":
			// Pill sits to the right of the circle, text reads left-to-right.
			return { badgeSide: "left", textAlign: "left", verticalText: false, crossAlign: "center" };
		case "left":
			// Pill sits to the left of the circle, text reads right-to-left
			// from the badge outward.
			return { badgeSide: "right", textAlign: "right", verticalText: false, crossAlign: "center" };
		case "above":
			// Pill sits above the circle; badge goes on the bottom (closest),
			// text columns align to the bottom of the row (next to the badge).
			return { badgeSide: "bottom", textAlign: "center", verticalText: true, crossAlign: "end" };
		case "below":
			// Pill sits below the circle; badge on top, text columns hug
			// the top so they sit right next to the badge.
			return { badgeSide: "top", textAlign: "center", verticalText: true, crossAlign: "start" };
	}
}

function StationLabel({
	station,
	placement,
}: {
	station: Station
	placement: StationPlacement
}): JSX.Element {
	const layout = layoutForAnchor(placement.labelAnchor);

	const isRow = !layout.verticalText;
	const gap = isRow ? "gap-1.5" : "gap-1";

	// JY + number badge, styled like the legacy `Player.tsx` badge: "JY" on
	// top, station number on the bottom. Both pieces read upright, regardless
	// of which edge the pill sits on.
	const badge = (
		<span
			className="inline-flex shrink-0 flex-col items-center justify-center rounded-md border border-[#7BAB4F] bg-white/95 px-1 py-0.5 leading-none tabular-nums text-stone-900 dark:border-zinc-200 dark:bg-zinc-900/95 dark:text-zinc-50"
			style={{ borderWidth: "2px" }}
		>
			<span className="font-mono text-[8px] font-bold tracking-wider leading-none">JY</span>
			<span className="font-mono text-[12px] font-bold leading-none tabular-nums">
				{station.jy}
			</span>
		</span>
	);

	let text: JSX.Element;
	if (layout.verticalText) {
		// Stack kanji on the right, English on the left. Each glyph sits on
		// its side with `text-orientation: sideways`, so the writing runs
		// horizontally when you tilt your head — similar to legacy JR
		// station boards.
		//
		// `crossAlign` controls where the columns sit on the cross axis:
		//   - top edge (`above`):  items-end → columns hug the badge below.
		//   - bottom edge (`below`): items-start → columns hug the badge above.
		const crossClasses
			= layout.crossAlign === "end"
				? "items-end"
				: layout.crossAlign === "start"
					? "items-start"
					: "items-center";
		text = (
			<span className={`flex flex-row-reverse gap-1 ${crossClasses}`}>
				<span
					className="block font-semibold text-[12px] leading-[1.05] text-zinc-700 dark:text-zinc-200"
					style={{
						writingMode: "vertical-rl",
						textOrientation: "upright",
					}}
				>
					{station.kanji}
				</span>
				<span
					className="block text-[10px] leading-[1.05] text-zinc-500 dark:text-zinc-400"
					style={{
						writingMode: "vertical-rl",
						textOrientation: "sideways",
					}}
				>
					{station.name}
				</span>
			</span>
		);
	}
	else {
		const align = layout.textAlign === "right" ? "text-right items-end" : "text-left items-start";
		text = (
			<span className={`flex flex-col gap-0.5 text-[10px] leading-tight text-zinc-700 dark:text-zinc-200 ${align}`}>
				<span className="block whitespace-nowrap font-semibold">
					{station.kanji}
				</span>
				<span className="block whitespace-nowrap text-[9px] text-zinc-500 dark:text-zinc-400">
					{station.name}
				</span>
			</span>
		);
	}

	const ordered = (() => {
		switch (layout.badgeSide) {
			case "left":
				return [<Fragment key="badge">{badge}</Fragment>, <Fragment key="text">{text}</Fragment>];
			case "right":
				return [<Fragment key="text">{text}</Fragment>, <Fragment key="badge">{badge}</Fragment>];
			case "top":
				// Circle sits above the pill, so the badge (closer to the
				// circle) goes on top of the column.
				return [<Fragment key="badge">{badge}</Fragment>, <Fragment key="text">{text}</Fragment>];
			case "bottom":
				// Circle sits below the pill, so the badge goes on the bottom.
				return [<Fragment key="text">{text}</Fragment>, <Fragment key="badge">{badge}</Fragment>];
		}
	})();

	const containerAlign = layout.verticalText ? "items-stretch" : "items-center";

	return (
		<div
			aria-label={`Select JY${station.jy} ${station.name}`}
			className={`flex ${gap} rounded-md px-1.5 py-1 shadow-sm backdrop-blur transition dark:bg-zinc-900/90 dark:hover:bg-zinc-800 ${containerAlign}`}
			style={{
				width: "max-content",
				flexDirection: isRow ? "row" : "column",
			}}
		>
			{ordered}
		</div>
	);
}

function StationNode({
	station,
	placement,
	isActive,
	isPlaying,
	onSelect,
}: {
	station: Station
	placement: StationPlacement
	isActive: boolean
	isPlaying: boolean
	onSelect: () => void
}): JSX.Element {
	// Position the label card relative to the station circle based on the
	// side it sits on. The wrapper sits just outside the circle; the pill
	// inside is rotated for the top/bottom edges so it reads along the side.
	const wrapperStyle: CSSProperties = {};
	if (placement.labelAnchor === "right") {
		wrapperStyle.left = "calc(100% + 8px)";
		wrapperStyle.top = "50%";
		wrapperStyle.transform = "translateY(-50%)";
	}
	else if (placement.labelAnchor === "left") {
		wrapperStyle.right = "calc(100% + 8px)";
		wrapperStyle.top = "50%";
		wrapperStyle.transform = "translateY(-50%)";
	}
	else if (placement.labelAnchor === "above") {
		wrapperStyle.left = "50%";
		wrapperStyle.bottom = "calc(100% + 8px)";
		wrapperStyle.transform = "translateX(-50%)";
	}
	else {
		wrapperStyle.left = "50%";
		wrapperStyle.top = "calc(100% + 8px)";
		wrapperStyle.transform = "translateX(-50%)";
	}

	return (
		<button
			type="button"
			onClick={onSelect}
			aria-label={`JY${station.jy} ${station.name}`}
			className={`group cursor-pointer absolute z-10 flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#DC7970]/40 ${isActive ? "scale-110" : "hover:scale-105"}`}
			style={{
				width: STATION_RADIUS * 2,
				height: STATION_RADIUS * 2,
				left: `calc(${placement.x}% - ${STATION_RADIUS}px)`,
				top: `calc(${placement.y}% - ${STATION_RADIUS}px)`,
			}}
		>
			{isActive && isPlaying && (
				<span
					className="pointer-events-none absolute -inset-2 animate-ping rounded-full border-2 border-[#DC7970]/60"
					aria-hidden
				/>
			)}
			<span
				className="absolute flex items-center"
				style={wrapperStyle}
			>
				<StationLabel station={station} placement={placement} />
			</span>
		</button>
	);
}

function buildEdgePaths(geometry: LoopGeometry) {
	// Polygon vertices in counter-clockwise order:
	//   [P1(topR), P2(topRight-bevel-end), P3(topLeft-bevel-start),
	//    P4(topLeft-bevel-end), P5(bottom-left), P6(bottomRight-bevel-start),
	//    P7(bottomRight-bevel-end)]
	//
	// Bevel edges: P1→P2 (small top-right), P3→P4 (large top-left), P6→P7 (large bottom-right)
	// Straight edges: P2→P3 (top), P4→P5 (left), P5→P6 (bottom)
	const polygon = geometry.polygon;
	const bevelD = edgesFromIndices(polygon, [
		[0, 1],
		[2, 3],
		[5, 6],
	]);
	const straightD = edgesFromIndices(polygon, [
		[1, 2],
		[3, 4],
		[4, 5],
	]);
	return { bevelD, straightD };
}

function edgesFromIndices(
	polygon: { x: number, y: number }[],
	pairs: Array<[number, number]>,
): string {
	const parts: string[] = [];
	for (const [a, b] of pairs) {
		parts.push(`M${polygon[a].x.toFixed(3)},${polygon[a].y.toFixed(3)} L${polygon[b].x.toFixed(3)},${polygon[b].y.toFixed(3)}`);
	}
	return parts.join(" ");
}

export function LoopDiagram({ geometry, activeIndex, orientation }: Props): JSX.Element {
	// const { t } = useTranslation();
	const direction = usePlayer(s => s.direction);
	const setIndex = usePlayer(s => s.setIndex);
	const isPlaying = usePlayer(s => s.isPlaying);
	const containerRef = useRef<HTMLDivElement | null>(null);

	const startAt = useMemo(() => osakiStartAt(geometry), [geometry]);
	const clockwise = direction === "outer";

	const placements = useMemo(
		() => placeStations(geometry, stationList.length, startAt, clockwise),
		[geometry, startAt, clockwise],
	);

	const outline = polygonPath(geometry);
	const aspectRatio = geometry.width / geometry.height;
	const { bevelD, straightD } = useMemo(() => buildEdgePaths(geometry), [geometry]);

	// Container sizing strategy depends on orientation:
	//   - landscape (PC / phone in landscape): lead with width, let the
	//     aspect ratio derive the height, and clamp it to the parent's
	//     height so the diagram never overflows vertically.
	//   - portrait (phone in portrait): the loop is tall and narrow, so
	//     we size it against the viewport directly. `100dvh` accounts for
	//     the mobile browser's dynamic UI (address bar etc.). The
	//     `min(...)` clamp keeps the loop within both the available
	//     width and the height budget (header ≈ 60px, player row ≈
	//     240px). Using `dvh` here is what makes the diagram actually
	//     fit on a phone — earlier flex-based sizing grew past the
	//     viewport because the parent's `min-h-full` expanded to fit
	//     the loop's preferred size.
	const containerStyle: CSSProperties = orientation === "portrait"
		? {
			aspectRatio,
			width: "min(100%, calc((100dvh - 320px) * 0.45))",
			maxWidth: "100%",
		}
		: { aspectRatio, width: "100%", maxHeight: "100%" };

	return (
		<div
			ref={containerRef}
			className="relative m-auto flex-shrink-0"
			style={containerStyle}
			data-direction={direction}
		>
			<svg
				viewBox={`0 0 ${geometry.width} ${geometry.height}`}
				preserveAspectRatio="xMidYMid meet"
				className="absolute inset-0 h-full w-full overflow-visible"
				aria-hidden
			>
				<defs>
					<linearGradient id="loop-fill" x1="0" x2="0" y1="0" y2="1">
						<stop offset="0%" stopColor="rgba(123,171,79,0.08)" />
						<stop offset="100%" stopColor="rgb(220,121,112,0.05)" />
					</linearGradient>
				</defs>
				<path
					d={outline}
					fill="url(#loop-fill)"
					stroke="#7BAB4F"
					strokeWidth={20}
					strokeLinejoin="round"
					strokeLinecap="round"
				/>
				{/* Render the straight edges and the bevel edges as two separate
					 paths. Using `vectorEffect="non-scaling-stroke"` on both keeps
					 their on-screen stroke width consistent regardless of the
					 SVG's current scale, so the diagonal bevels no longer look
					 thicker than the horizontal/vertical edges next to them. */}
				<path
					d={straightD}
					fill="none"
					stroke="#7BAB4F"
					strokeWidth={20}
					strokeLinecap="round"
					vectorEffect="non-scaling-stroke"
				/>
				<path
					d={bevelD}
					fill="none"
					stroke="#7BAB4F"
					strokeWidth={20}
					strokeLinecap="round"
					strokeLinejoin="round"
					vectorEffect="non-scaling-stroke"
				/>
				{/* Inner faint outline for a clean chamfered silhouette */}
				<path
					d={outline}
					fill="none"
					stroke="rgba(123,171,79,0.35)"
					strokeWidth={2}
					strokeDasharray="4 6"
					vectorEffect="non-scaling-stroke"
				/>
				{/* Station circles — white fill, dark stroke, no number */}
				{placements.map((p, i) => (
					<circle
						key={stationList[i].jy}
						cx={p.x}
						cy={p.y}
						r={STATION_RADIUS}
						fill="#FFFFFF"
						stroke="#1F2937"
						strokeWidth={2}
						vectorEffect="non-scaling-stroke"
					/>
				))}
				{/* Active station indicator ring */}
				{placements[activeIndex] && (
					<g>
						<circle
							cx={placements[activeIndex].x}
							cy={placements[activeIndex].y}
							r={STATION_RADIUS + 10}
							fill="none"
							stroke="#DC7970"
							strokeWidth={3}
							opacity={0.7}
							vectorEffect="non-scaling-stroke"
						>
							<animate
								attributeName="r"
								values={`${STATION_RADIUS + 2};${STATION_RADIUS + 6};${STATION_RADIUS + 2}`}
								dur="2s"
								repeatCount="indefinite"
							/>
							<animate
								attributeName="opacity"
								values="0.8;0.2;0.8"
								dur="2s"
								repeatCount="indefinite"
							/>
						</circle>
					</g>
				)}
			</svg>

			{/* Stations are HTML so labels stay readable across viewports */}
			<div className="absolute inset-0">
				{placements.map((p, i) => {
					const station = stationList[i];
					return (
						<div
							key={station.jy}
							className="absolute"
							style={{
								left: `${(p.x / geometry.width) * 100}%`,
								top: `${(p.y / geometry.height) * 100}%`,
								transform: "translate(-50%, -50%)",
							}}
						>
							<StationNode
								station={station}
								placement={p}
								isActive={i === activeIndex}
								isPlaying={isPlaying && i === activeIndex}
								onSelect={() => setIndex(i)}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}
