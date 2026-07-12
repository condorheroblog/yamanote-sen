// Track the current viewport orientation for the v2 layout.
//
// Returns `"landscape"` on desktop and on phones held in landscape, and
// `"portrait"` on phones held in portrait. The breakpoint is intentionally
// `matchMedia` based so it stays in sync with the CSS layer (Tailwind's
// `sm:` ≈ 640px) and re-evaluates whenever the device's reported width
// crosses that line — including when the user rotates the phone.

import type { LoopOrientation } from "./loopConfig";
import { useEffect, useState } from "react";

const PORTRAIT_QUERY = "(max-width: 639px) and (orientation: portrait)";

function detect(): LoopOrientation {
	if (typeof window === "undefined")
		// No `window` (SSR / test env): assume portrait — it's the safer
		// default for a touch-first mobile UI and prevents the desktop
		// floating-player layout from being used during pre-hydration.
		return "portrait";
	// `innerWidth` is more reliable than `matchMedia` in some mobile
	// browsers (e.g. iOS Safari) which sometimes report the wrong match
	// state for `(orientation: portrait)` while the address bar is
	// settling. Treat anything narrower than Tailwind's `sm:` breakpoint
	// (640px) as portrait.
	if (window.innerWidth < 640)
		return "portrait";
	return window.matchMedia(PORTRAIT_QUERY).matches ? "portrait" : "landscape";
}

export function useOrientation(): LoopOrientation {
	// Initial state is read once via the lazy initializer; the effect below
	// keeps it in sync when the media query, orientation or window size
	// change — including when the user rotates the device.
	const [orientation, setOrientation] = useState<LoopOrientation>(detect);

	useEffect(() => {
		if (typeof window === "undefined" || !window.matchMedia)
			return;
		const mql = window.matchMedia(PORTRAIT_QUERY);
		const update = () => setOrientation(mql.matches ? "portrait" : "landscape");
		// `addEventListener` is the modern API; `addListener` is the legacy
		// fallback for older Safari builds. Calling both is safe — the spec
		// guarantees only one will fire.
		if (mql.addEventListener) {
			mql.addEventListener("change", update);
		}
		else {
			mql.addListener(update);
		}
		// Also re-evaluate on `orientationchange` / `resize` because some
		// mobile browsers don't update the media query synchronously when
		// rotating.
		window.addEventListener("orientationchange", update);
		window.addEventListener("resize", update);
		return () => {
			if (mql.removeEventListener) {
				mql.removeEventListener("change", update);
			}
			else {
				mql.removeListener(update);
			}
			window.removeEventListener("orientationchange", update);
			window.removeEventListener("resize", update);
		};
	}, []);

	return orientation;
}
