// Minimal icon set for the v2 inline player. Gear/Info live in the shared
// legacy icon set so both apps render the same chrome.

import type { JSX } from "react";

export { GearIcon, InfoIcon } from "../legacy/components/Icons";

interface IconProps {
	size?: number
	className?: string
}

function Svg({
	children,
	size = 24,
	className,
	...rest
}: IconProps & { children: JSX.Element | JSX.Element[] } & JSX.IntrinsicElements["svg"]) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.8}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			{...rest}
		>
			{children}
		</svg>
	);
}

export function PlayIcon(p: IconProps): JSX.Element {
	return (
		<Svg {...p}>
			<path d="M7 5l12 7-12 7V5z" fill="currentColor" stroke="none" />
		</Svg>
	);
}

export function PauseIcon(p: IconProps): JSX.Element {
	return (
		<Svg {...p}>
			<rect x="6" y="5" width="4" height="14" fill="currentColor" stroke="none" rx="1" />
			<rect x="14" y="5" width="4" height="14" fill="currentColor" stroke="none" rx="1" />
		</Svg>
	);
}

export function PrevIcon(p: IconProps): JSX.Element {
	return (
		<Svg {...p}>
			<path d="M19 5L9 12l10 7V5z" fill="currentColor" stroke="none" />
			<line x1="5" y1="5" x2="5" y2="19" />
		</Svg>
	);
}

export function NextIcon(p: IconProps): JSX.Element {
	return (
		<Svg {...p}>
			<path d="M5 5l10 7-10 7V5z" fill="currentColor" stroke="none" />
			<line x1="19" y1="5" x2="19" y2="19" />
		</Svg>
	);
}
