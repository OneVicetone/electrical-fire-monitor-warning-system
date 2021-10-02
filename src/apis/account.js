const setupAccoutApis = (http, BASE_URL) => ({
	login: form => http.formPost(`${BASE_URL}/api-user/auth/login`, form),

	loginout: token => http.post(`${BASE_URL}/api-user/auth/loginOff`, { token }),

	getLoginCode: () => http.get(`${BASE_URL}/api-user/auth/loginCode`, {}),

	changePassword: ({ userId, password, newPassword }) =>
		http.put(`${BASE_URL}/api-user/auth/updatePassword`, { userId, password, newPassword }),

	getUserMenuList: () => http.get(`${BASE_URL}/api-user/menu/web/list`, {}),

	getUploadUrl: () => http.get(`${BASE_URL}/api-user/common/ossSign`),

	getUserNotifyNum: () => http.get(`${BASE_URL}/api-alarm/statistics/countTotal`),
})

export default setupAccoutApis
