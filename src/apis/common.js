const setupCommonApis = (http, BASE_URL) => ({
	getSelectOptions: type => http.get(`${BASE_URL}/api-common/common/parameter/${type}/list`),

	getMapKey: module => http.get(`${BASE_URL}/api-common/common/baiduAk`, { module }),

	getDownloadList: ({ current, size, downName }) =>
		http.get(`${BASE_URL}/api-common/download/pageList`, { current, size, downName }),
		
	getDownloadCountById: id => http.get(`${BASE_URL}/api-common/download/downloadCount`, { id }),

	uploadFile: ({ url, data }) => http.formPost(url, data),
})

export default setupCommonApis
