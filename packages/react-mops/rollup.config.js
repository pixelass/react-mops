const path = require("path");
import url from "rollup-plugin-url"
import {createBanner, getPlugins} from "@ngineer/config-rollup/typescript";


module.exports = () => {
	const cwd = process.cwd();
	const pkg = require(path.resolve(cwd, "package.json"));
	const tsconfig = path.resolve(cwd, "tsconfig.json");
	return [
		{
			input: "src/index.ts",
			external: [
				...Object.keys(pkg.dependencies || {}),
				...Object.keys(pkg.peerDependencies || {})
			],
			output: [
				{
					banner: createBanner(pkg),
					file: `dist/${pkg.main}`,
					format: "cjs"
				},
				{
					banner: createBanner(pkg),
					file: pkg.module,
					format: "esm"
				}
			],
			plugins: [
				url(),
				...getPlugins(tsconfig)
			]
		}
	];
};
