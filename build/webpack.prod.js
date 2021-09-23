const { merge } = require("webpack-merge")
const base = require("./webpack.config")
const path = require("path")

module.exports = merge(base, {
	mode: "production",
	entry: path.resolve(__dirname, "../src/main.js"),
})
