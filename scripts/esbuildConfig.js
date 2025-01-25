const esbuildConfig = {
	entryPoints: ["src/index.js"],
	bundle: true,
	platform: "node",
	target: ["node20"],
	outfile: "dist/index.cjs",
	define: {
		'import.meta.dirname': '__dirname'
	},
}

export default esbuildConfig;
