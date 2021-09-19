const setupCommonApis = http => ({
	getSelectOptions: type => http.get(`/api-common/common/parameter/${type}/list`),
	getMapKey: module => http.get("/api-common/common/baiduAck", { module }),
})

export default setupCommonApis
