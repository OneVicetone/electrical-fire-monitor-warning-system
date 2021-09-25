const path = require("path")

const { VueLoaderPlugin } = require("vue-loader")
const ProgressBarPlugin = require("progress-bar-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")

const { alias } = require("./config")
const theme = require("../vite-config/theme")

module.exports = {
	output: {
		filename: "js/[name][hash].bundle.js",
		path: path.resolve(process.cwd(), "./dist"),
		clean: true,
		publicPath: "/",
	},
	resolve: {
		alias,
		// extensions: [".js", ".vue", ".json"],
		// modules: ["node_modules"],
		// plugins: [],
	},
	optimization: {
		moduleIds: "deterministic",
		runtimeChunk: "single",
		splitChunks: {
			chunks: "all",
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendors",
					chunks: "all",
				},
			},
		},
		minimizer: ["...", new CssMinimizerPlugin()],
	},
	externals: {
		vue: "Vue",
		vuex: "Vuex",
		echarts: "echarts",
		"vue-router": "VueRouter",
		"ant-design-vue": "ant-design-vue",
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
			},
			{
				test: /\.(js|jsx)$/,
				loader: "babel-loader",
			},
			{
				test: /\.less$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"postcss-loader",
					{
						loader: "less-loader",
						options: {
							lessOptions: {
								javascriptEnabled: true,
								modifyVars: theme,
							},
						},
					},
				],
			},
			{
				test: /\.(jpe?g|png|svg|gif)/i,
				type: "asset",
				generator: {
					filename: "assets/[hash][ext][query]", // 局部指定输出位置
				},
				parser: {
					dataUrlCondition: {
						maxSize: 8 * 1024, // 限制于 8kb
					},
				},
			},
			// {
			// 	test: /.(png|jpg|jpeg|svg|gif)$/i,
			// 	type: "asset",
			// },
		],
	},
	plugins: [
		new ProgressBarPlugin(),
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "/index.html",
		}),
		new MiniCssExtractPlugin({
			filename: "css/[name].[hash].css",
		}),
	],
}
