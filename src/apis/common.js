const setupCommonApis = http => ({
	getSelectOptions: type => http.get(`/api-common/common/parameter/${type}/list`),
	getMapKey: () => http.get("/api-common/common/baiduAck"),
})

export default setupCommonApis