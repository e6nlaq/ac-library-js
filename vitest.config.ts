import { defineConfig } from "vitest/config";
import * as path from "node:path";

export default defineConfig({
	test: {
		include: ["./test/**/*.test.{js,ts}"],
		globals: true,
		alias: {
			"@": path.resolve(__dirname, "./lib"),
		},
		benchmark: {
			include: ["./test/**/*.bench.{js,ts}"],
		},
	},
});
