const setupUnitApis = http => ({
	getUnitList: ({ current, size, name, principalUserName, parentId }) =>
		http.get("/api-user/group/pageList", { current, size, name, principalUserName, parentId }),
	createUnit: ({
		name,
		parentId,
		typeCode,
		address,
		addressLat,
		addressLon,
		employeeNum,
		floorSpace,
		principalUserName,
		loginName,
		mobile,
		effectPicPath,
		designPicPath,
	}) =>
		http.post("/api-user/group/insert", {
			name,
			parentId,
			typeCode,
			address,
			addressLat,
			addressLon,
			employeeNum,
			floorSpace,
			principalUserName,
			loginName,
			mobile,
			effectPicPath,
			designPicPath,
		}),
	disableByUserId: userId => http.get("/api-user/auth/disable", { userId }),
	enableByUserId: userId => http.get("/api-user/auth/disable", { userId }),
	getUnitDetailById: id => http.get(`/api-user/group/detail/${id}`, {}),
    getUnitTree: () => http.get('/api-user/group/tree', {})
})

export default setupUnitApis
