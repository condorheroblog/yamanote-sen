import type { JSX } from "react";

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

export function PlayIcon(p: IconProps) {
	return <Svg {...p}><path d="M7 5l12 7-12 7V5z" fill="currentColor" stroke="none" /></Svg>;
}

export function PauseIcon(p: IconProps) {
	return (
		<Svg {...p}>
			<rect x="6" y="5" width="4" height="14" fill="currentColor" stroke="none" rx="1" />
			<rect x="14" y="5" width="4" height="14" fill="currentColor" stroke="none" rx="1" />
		</Svg>
	);
}

export function PrevIcon(p: IconProps) {
	return (
		<Svg {...p}>
			<path d="M19 5L9 12l10 7V5z" fill="currentColor" stroke="none" />
			<line x1="5" y1="5" x2="5" y2="19" />
		</Svg>
	);
}

export function NextIcon(p: IconProps) {
	return (
		<Svg {...p}>
			<path d="M5 5l10 7-10 7V5z" fill="currentColor" stroke="none" />
			<line x1="19" y1="5" x2="19" y2="19" />
		</Svg>
	);
}

export function GearIcon(p: IconProps) {
	return (
		<Svg {...p}>
			<circle cx="12" cy="12" r="3" />
			<path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
		</Svg>
	);
}

export function InfoIcon(p: IconProps) {
	return (
		<Svg {...p}>
			<circle cx="12" cy="12" r="9" />
			<line x1="12" y1="11" x2="12" y2="17" />
			<circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
		</Svg>
	);
}

export function CloseIcon(p: IconProps) {
	return (
		<Svg {...p}>
			<line x1="18" y1="6" x2="6" y2="18" />
			<line x1="6" y1="6" x2="18" y2="18" />
		</Svg>
	);
}

export function ChevronDownIcon(p: IconProps) {
	return (
		<Svg {...p}>
			<polyline points="6 9 12 15 18 9" />
		</Svg>
	);
}

export function SunIcon(p: IconProps) {
	return (
		<Svg {...p}>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
		</Svg>
	);
}

export function MoonIcon(p: IconProps) {
	return (
		<Svg {...p}>
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
		</Svg>
	);
}
