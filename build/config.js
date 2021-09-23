const path = require('path');

const srcPath = path.resolve(__dirname, "../src")
const layoutsPath = path.resolve(__dirname, "../src/layouts")
const utilsPath = path.resolve(__dirname, "../src/utils")
const stylesPath = path.resolve(__dirname, "../src/styles")
const componentsPath = path.resolve(__dirname, "../src/components")
const pagesPath = path.resolve(__dirname, "../src/pages")
const minixsPath = path.resolve(__dirname, "../src/mixins")
const apisPath = path.resolve(__dirname, "../src/apis")
const assetsPath = path.resolve(__dirname, "../src/assets")
const storePath = path.resolve(__dirname, "../src/store")

const alias = {
    "@": srcPath,
	"layouts": layoutsPath,
	"utils": utilsPath,
	"styles": stylesPath,
	"components": componentsPath,
	"pages": pagesPath,
	"mixins": minixsPath,
	"apis": apisPath,
	"assets": assetsPath,
    "store": storePath
}

module.exports = {
    alias,
}