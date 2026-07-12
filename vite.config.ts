import process from "node:process";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { codeInspectorPlugin } from "code-inspector-plugin";
import { defineConfig } from "vite";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
	base: isDev ? "/" : "/yamanote-sen/",

	plugins: [
		react(),
		tailwindcss(),
		codeInspectorPlugin({
			bundler: "vite",
			// hideConsole: true,
		}),
	],
	server: {
		port: 5173,
		host: true,
	},
});
