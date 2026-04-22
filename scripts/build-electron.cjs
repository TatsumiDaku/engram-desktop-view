// Build script for electron main and preload
const esbuild = require("esbuild");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");

const externalPlugins = [];

const buildOptions = {
	bundle: true,
	sourcemap: true,
	target: "node18",
	platform: "node",
	external: ["electron", "electron-log", "electron-updater"],
	plugins: externalPlugins,
};

async function build() {
	// Build main process (ESM for Node)
	await esbuild.build({
		...buildOptions,
		entryPoints: [path.join(rootDir, "electron/main.ts")],
		outfile: path.join(rootDir, "dist-electron/main.js"),
		format: "esm",
	});

	// Build preload (must be CommonJS for Electron)
	await esbuild.build({
		...buildOptions,
		entryPoints: [path.join(rootDir, "electron/preload.ts")],
		outfile: path.join(rootDir, "dist-electron/preload.cjs"),
		format: "cjs",
	});

	console.log("Electron build complete");
}

build().catch((err) => {
	console.error(err);
	process.exit(1);
});
