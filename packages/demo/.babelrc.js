module.exports = {
	"extends": "@ngineer/config-babel/ts-styled-components",
	"plugins": [
		[
			"transform-assets-import-to-string",
			{
				"baseDir": "/assets",
			}
		]
	]
};
