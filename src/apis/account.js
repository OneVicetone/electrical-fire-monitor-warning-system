const setupAccoutApis = http => ({
	login: form => http.formPost("/api-user/auth/login", form),

	loginout: token => http.post("/api-user/auth/loginOff", { token }),

	getLoginCode: () => http.get("/api-user/auth/loginCode", {}),

	changePassword: ({ userId, password, newPassword }) =>
		http.put("/api-user/auth/updatePassword", { userId, password, newPassword }),

	getUserMenuList: () => http.get("/api-user/menu/web/list", {}),

	getUploadUrl: () => http.get("/api-user/common/ossSign"),
})

export default setupAccoutApis
