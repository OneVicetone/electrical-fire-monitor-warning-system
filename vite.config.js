import { defineConfig } from "vite"
import path from "path"
import { createVuePlugin } from "vite-plugin-vue2"

// const alias = require(path.resolve(__dirname, "vite-config/alias.js"))
const theme = require(path.resolve(__dirname, "vite-config/theme.js"))
const proxy = require(path.resolve(__dirname, "vite-config/proxy.js"))

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

console.log(pagesPath)


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

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		createVuePlugin({
			jsx: true,
		}),
	],
	resolve: {
		alias,
	},
	server: {
		proxy,
	},
	css: {
		preprocessorOptions: {
			less: {
				loader: "less-loader",
				javascriptEnabled: true,
				modifyVars: theme,
			},
		},
	},
	hmr: { overlay: false },
})
