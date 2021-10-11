const path = require("path")
const compressionPlugin = require("compression-webpack-plugin")

const theme = require(path.resolve(__dirname, "config/theme.js"))

const srcPath = path.resolve(__dirname, "src")
const layoutsPath = path.resolve(__dirname, "src/layouts")
const utilsPath = path.resolve(__dirname, "src/utils")
const stylesPath = path.resolve(__dirname, "src/styles")
const componentsPath = path.resolve(__dirname, "src/components")
const pagesPath = path.resolve(__dirname, "src/pages")
const minixsPath = path.resolve(__dirname, "src/mixins")
const apisPath = path.resolve(__dirname, "src/apis")
const assetsPath = path.resolve(__dirname, "src/assets")
const storePath = path.resolve(__dirname, "src/store")

const alias = {
	"@": srcPath,
	layouts: layoutsPath,
	utils: utilsPath,
	styles: stylesPath,
	components: componentsPath,
	pages: pagesPath,
	mixins: minixsPath,
	apis: apisPath,
	assets: assetsPath,
	store: storePath,
}

module.exports = {
	productionSourceMap: false,
	configureWebpack: {
		resolve: {
			alias,
		},
		plugins: [
			new compressionPlugin({
				// filename: "[path].gz[query]",
				algorithm: "gzip",
				test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
				threshold: 2048,
				minRatio: 0.8,
				deleteOriginalAssets: true
			}),
		],
	},
	css: {
		loaderOptions: {
			less: {
				lessOptions: {
					modifyVars: theme,
					javascriptEnabled: true,
				},
			},
		},
	},
}
