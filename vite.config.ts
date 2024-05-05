import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	base: "/time-calculation",
	build: {
		chunkSizeWarningLimit: 1024,
	},
	plugins: [react()],
	resolve: {
		alias: {
			src: "/src",
			components: "/src/components",
			views: "/src/views",
			services: "/src/services",
			assets: "/src/assets",
			types: "/src/types",
			utils: "/src/utils",
		},
	},
	define: {
		__APP_VERSION__: JSON.stringify("v1.0.0"),
		__APP_NAME__: JSON.stringify("WorkSync"),
	},
});
