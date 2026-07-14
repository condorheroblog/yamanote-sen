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

export function GitHubIcon(p: IconProps): JSX.Element {
	return (
		<Svg {...p}>
			<path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9v2.81c0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" fill="currentColor" stroke="none" />
		</Svg>
	);
}
