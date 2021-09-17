const setupCommonApis = http => ({
	getSelectOptions: type => http.get(`/api-common/common/parameter/${type}/list`),

})

export default setupCommonApis