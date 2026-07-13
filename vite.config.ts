import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { codeInspectorPlugin } from "code-inspector-plugin";
import { defineConfig } from "vite";
import openGraph from "vite-plugin-open-graph";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	base: "/yamanote-sen/",

	plugins: [
		react(),
		tailwindcss(),
		codeInspectorPlugin({
			bundler: "vite",
			// hideConsole: true,
		}),
		openGraph({
			basic: {
				title: "Yamanote Sen",
				type: "website",
				url: "https://condorheroblog.github.io/yamanote-sen/",
				siteName: "Yamanote Sen",
				description:
					"A virtual ride on Tokyo's Yamanote Line — listen to every station's melody, chime, announcement and ambient sound as you loop the line at 2× speed.",
				image: "https://condorheroblog.github.io/yamanote-sen/og-image.jpg",
				locale: "en_US",
			},
			twitter: {
				card: "summary_large_image",
				title: "Yamanote Sen",
				description:
					"A virtual ride on Tokyo's Yamanote Line — listen to every station's melody, chime, announcement and ambient sound as you loop the line at 2× speed.",
				image: "https://condorheroblog.github.io/yamanote-sen/og-image.jpg",
				imageAlt: "Yamanote Sen — Tokyo's Yamanote Line virtual ride",
			},
		}),
		VitePWA({
			base: "/yamanote-sen/",
			registerType: "autoUpdate",
			injectRegister: "auto",
			includeAssets: ["favicon.svg", "icons/*"],
			manifest: {
				name: "Yamanote Sen",
				short_name: "Yamanote",
				description: "A virtual ride on Tokyo's Yamanote Line",
				theme_color: "#6366f1",
				background_color: "#09090b",
				display: "standalone",
				start_url: "/yamanote-sen/",
				scope: "/yamanote-sen/",
				icons: [
					{ src: "icons/pwa-192x192.png", sizes: "192x192", type: "image/png" },
					{ src: "icons/pwa-512x512.png", sizes: "512x512", type: "image/png" },
					{
						src: "icons/pwa-512x512-maskable.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
			workbox: {
				navigateFallback: "/yamanote-sen/index.html",
				// 只预缓存应用 shell;音频不进 precache,避免 install 时阻塞
				globPatterns: ["**/*.{js,css,html,svg,png,ico,webp,woff2}"],
				// 应用 shell 通常 < 5MB;音频走 runtimeCaching
				maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
				runtimeCaching: [
					{
						urlPattern: ({ url }) =>
							url.pathname.startsWith("/yamanote-sen/audio/"),
						handler: "CacheFirst",
						options: {
							cacheName: "yamanote-audio",
							expiration: {
								maxEntries: 120,
								maxAgeSeconds: 60 * 60 * 24 * 365, // 1 年
							},
							cacheableResponse: { statuses: [0, 200] },
							// HTML5 <audio> 默认发 Range 请求,必须开启
							rangeRequests: true,
						},
					},
				],
			},
			devOptions: { enabled: false },
		}),
	],
	server: {
		port: 5173,
		host: true,
	},
});
