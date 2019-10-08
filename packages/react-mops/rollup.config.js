const path = require("path");
const url = require("rollup-plugin-url");
const {createBanner, getPlugins} = require("@ngineer/config-rollup/typescript");
const postcss = require("rollup-plugin-postcss");

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
				postcss({
					extract: true,
					modules: {
						generateScopedName:
							process.env.NODE_ENV === "production" ? "[hash:base64:5]" : "[local]"
					}
				}),
				...getPlugins(tsconfig)
			]
		}
	];
};
