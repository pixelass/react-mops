module.exports = {
	plugins: {
		"postcss-url": {
			url: "inline"
		},
		cssnano: process.env.NODE_ENV === "production" ? {} : null
	}
};
