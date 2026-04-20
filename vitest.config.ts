import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		include: ["tests/**/*.test.{ts,tsx}"],
		coverage: {
			provider: "v8",
			include: ["src/**/*.{ts,tsx}"],
			exclude: [
				"src/**/*.d.ts",
				"src/main.tsx",
				"src/i18n/**",
				"**/node_modules/**",
			],
			reporter: ["text", "html", "lcov"],
			reportOnFailure: true,
		},
		setupFiles: ["./tests/setup.ts"],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@atoms": path.resolve(__dirname, "./src/components/atoms"),
			"@molecules": path.resolve(__dirname, "./src/components/molecules"),
			"@organisms": path.resolve(__dirname, "./src/components/organisms"),
			"@hooks": path.resolve(__dirname, "./src/hooks"),
			"@services": path.resolve(__dirname, "./src/services"),
			"@pages": path.resolve(__dirname, "./src/pages"),
			"@config": path.resolve(__dirname, "./src/config"),
			"@stores": path.resolve(__dirname, "./src/stores"),
			"@constants": path.resolve(__dirname, "./src/utils/constants"),
			"@helpers": path.resolve(__dirname, "./src/utils/helpers"),
			"@styles": path.resolve(__dirname, "./src/styles"),
		},
	},
});
