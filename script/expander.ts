#!/usr/bin/env node
import { statSync } from "node:fs";
import { exit } from "node:process";
import { Command } from "@commander-js/extra-typings";
import * as esbuild from "esbuild";
import packageJson from "../package.json";

function checkFile(filePath: string) {
	let isExist = false;
	try {
		isExist = statSync(filePath).isFile();
	} catch (err) {
		isExist = false;
	}
	return isExist;
}

const program = new Command()
	.name("expander")
	.version(packageJson.version)
	.argument("<path>")
	.option("-m, --minify", "Minify Config", false)
	.option("-o, --out <name>", "Out file's name", "combined.js")
	.action((path, opt) => {
		if (!checkFile(path)) {
			console.error("Error: The argument isn't a file path.");
			exit(1);
		}

		esbuild.buildSync({
			entryPoints: [path],
			bundle: true,
			outfile: opt.out,
			platform: "node",
			minify: opt.minify,
		});

		console.log(`Created: ${opt.out}`);
	});

program.parse();
