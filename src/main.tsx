import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { startBackgroundPrecache } from "./lib/precache";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);

// PWA:在页面 load 后 3 秒启动后台音频预缓存,留出首屏资源带宽
if (typeof window !== "undefined") {
	window.addEventListener("load", () => {
		setTimeout(startBackgroundPrecache, 3000);
	});
}
