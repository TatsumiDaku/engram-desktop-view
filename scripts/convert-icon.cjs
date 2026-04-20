// Convert PNG to ICO for Windows
const sharp = require("sharp");
const toIco = require("to-ico");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const pngPath = path.join(rootDir, "images/engram-logo.png");
const buildDir = path.join(rootDir, "build");
const icoPath = path.join(buildDir, "icon.ico");
const pngOutputPath = path.join(buildDir, "icon.png");

// Ensure build directory exists
if (!fs.existsSync(buildDir)) {
	fs.mkdirSync(buildDir, { recursive: true });
}

async function convert() {
	try {
		// First resize the image to multiple sizes needed for ICO
		const sizes = [16, 32, 48, 64, 128, 256];
		const pngBuffers = [];

		for (const size of sizes) {
			const pngBuffer = await sharp(pngPath)
				.resize(size, size)
				.png()
				.toBuffer();
			pngBuffers.push(pngBuffer);
		}

		// Also copy original PNG to build folder
		const originalPng = await sharp(pngPath).png().toBuffer();
		fs.writeFileSync(pngOutputPath, originalPng);

		// Convert to ICO
		const icoBuffer = await toIco(pngBuffers);
		fs.writeFileSync(icoPath, icoBuffer);

		console.log("Icons created successfully!");
		console.log("  - ICO:", icoPath);
		console.log("  - PNG:", pngOutputPath);
	} catch (err) {
		console.error("Error:", err);
		process.exit(1);
	}
}

convert();
