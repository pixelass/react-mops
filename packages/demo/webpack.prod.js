const config = require("@ngineer/config-webpack/production");
const {serverRenderer} = require("./lib/server/renderer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const merge = require("webpack-merge");
const {routes} = require("./lib/routes");

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
		},
		plugins: routes.map(
			({location: url}) =>
				new HtmlWebpackPlugin({
					filename: path.join(url, "index.html").replace(/^\//, ""),
					templateContent: serverRenderer({url})
				})
		)
	});
