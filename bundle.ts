import packageJson from "./package.json";

await Bun.build({
	entrypoints: ["./lib/all.ts"],
	outdir: "./bundle",
	banner: `// ac-library-js - v${packageJson.version}`,
	target: "node",
	minify: {
		whitespace: true,
		syntax: true,
	},
});
