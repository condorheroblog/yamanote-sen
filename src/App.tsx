// Root application: owns the theme listener and the top-level router.
// Two layouts are served:
//   - `/`           → v2 chamfered loop diagram (default, new)
//   - `/legacy`     → original (v1) header + list + player layout
// A small floating chip in the header lets the user swap between the two.
import { useEffect } from "react";
import { Link, Navigate, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { InstallApp } from "./components/InstallApp";
import LegacyApp from "./legacy/LegacyApp";
import { applyThemeClass, useSettings } from "./store/settings";
import NewApp from "./v2/NewApp";

function VersionSwitcher() {
	const location = useLocation();
	const onLegacy = location.pathname.startsWith("/legacy");
	const linkBase = "rounded-full px-3 py-1 transition";
	const activeClass = "bg-[#DC7970] text-white shadow-sm";
	const inactiveClass = "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800";
	return (
		<div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
			<InstallApp />
			<div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white/90 p-1 text-xs font-medium shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
				<Link
					to="/"
					className={`${linkBase} ${onLegacy ? inactiveClass : activeClass}`}
				>
					New
				</Link>
				<Link
					to="/legacy"
					className={`${linkBase} ${onLegacy ? activeClass : inactiveClass}`}
				>
					Legacy
				</Link>
			</div>
		</div>
	);
}

function Shell() {
	return (
		<>
			<Routes>
				<Route path="/" element={<NewApp />} />
				<Route path="/legacy/*" element={<LegacyApp />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
			<VersionSwitcher />
		</>
	);
}

export default function App() {
	const theme = useSettings(s => s.theme);

	useEffect(() => {
		applyThemeClass(theme);
	}, [theme]);

	return (
		<Router basename={import.meta.env.BASE_URL}>
			<Shell />
		</Router>
	);
}
