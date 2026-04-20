import { resolve } from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	base: "./",
	build: {
		outDir: "dist",
		emptyOutDir: true,
		sourcemap: true,
	},
	server: {
		port: 5173,
		strictPort: true,
	},
});
