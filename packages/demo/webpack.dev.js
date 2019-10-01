const config = require("@ngineer/config-webpack/development");
const merge = require("webpack-merge");

module.exports = (env, argv) =>
	merge(config(env, argv), {
		module: {
			rules: [
				{
					test: /\.(png|jpe?g)$/i,
					use: [
						{
							loader: "file-loader"
						}
					]
				}
				]
		},
		resolve: {
			extensions: [".ts", ".tsx", ".mjs", ".js", ".jsx"]
		}
	});
