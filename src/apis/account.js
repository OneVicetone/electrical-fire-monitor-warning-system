const setupAccoutApis = (http, BASE_URL) => ({
	login: form => http.formPost(`${BASE_URL}/auth/login`, form),

	loginout: token => http.post(`${BASE_URL}/auth/loginOff`, { token }),

	getLoginCode: () => http.get(`${BASE_URL}/auth/loginCode`, {}),

	changePassword: ({ userId, password, newPassword }) =>
		http.put(`${BASE_URL}/auth/updatePassword`, { userId, password, newPassword }),

	getUserMenuList: () => http.get(`${BASE_URL}/menu/web/list`, {}),
})

export default setupAccoutApis
