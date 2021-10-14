module.exports = {
	"/api": {
		target: "http://www.bbfxc.com/api/", // 正式
		// target: "http://gs.hitotem.com",
		// target: "http://gs.hitotem.com:22980", // 测试
		changeOrigin: true,
		rewrite: path => path.replace(/^\/api/, ""),
		pathRewrite: {
			"^/api/": "",
		},
	},
}
