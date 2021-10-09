const setupAccoutApis = (http, BASE_URL) => ({
	login: form => http.formPost(`${BASE_URL}/api-user/auth/login`, form),

	loginout: () => http.formPost(`${BASE_URL}/api-user/auth/loginOff`),

	getLoginCode: () => http.get(`${BASE_URL}/api-user/auth/loginCode`, {}),

	changePassword: form =>
		http.formPut(`${BASE_URL}/api-user/auth/updatePassword`, form),

	getUserMenuList: () => http.get(`${BASE_URL}/api-user/menu/web/list`, {}),

	getUploadUrl: () => http.get(`${BASE_URL}/api-user/common/ossSign`),

	getUserNotifyNum: () => http.get(`${BASE_URL}/api-alarm/statistics/countTotal`),
})

export default setupAccoutApis
