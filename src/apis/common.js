const setupCommonApis = http => ({
	getSelectOptions: type => http.get(`/api-common/common/parameter/${type}/list`),

	getMapKey: module => http.get("/api-common/common/baiduAk", { module }),

	getDownloadList: ({ current, size, downName }) =>
		http.get("/api-common/download/pageList", { current, size, downName }),
		
	getDownloadCountById: id => http.get("/api-common/download/downloadCount", { id }),

	uploadFile: ({ url, data }) => http.formPost(url, data),
})

export default setupCommonApis
