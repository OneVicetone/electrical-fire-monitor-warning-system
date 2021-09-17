const setupDeviceApis = http => ({
	createDevice: ({
		sn,
		deviceTypeId,
		installPosition,
		address,
		addressLat,
		addressLon,
		alias,
		iccid,
		groupId,
		safetyDirector,
		safetyDirectorMobile,
	}) =>
		http.get("/api-device/device/add", {
			sn,
			deviceTypeId,
			installPosition,
			address,
			addressLat,
			addressLon,
			alias,
			iccid,
			groupId,
			safetyDirector,
			safetyDirectorMobile,
		}),
	changeDeviceInfo: ({
		sn,
		deviceTypeId,
		installPosition,
		address,
		addressLat,
		addressLon,
		alias,
		iccid,
		groupId,
		safetyDirector,
		safetyDirectorMobile,
	}) =>
		http.get("/api-device/device/modify", {
			sn,
			deviceTypeId,
			installPosition,
			address,
			addressLat,
			addressLon,
			alias,
			iccid,
			groupId,
			safetyDirector,
			safetyDirectorMobile,
		}),
	getDevicesTypeList: ({ current, size, model }) => http.get("/api-device/deviceType/pageList", { current, size, model }),
	addDeviceType: ({ supplier, model, protocol, network, productImgPath, deviceTypeId }) =>
		http.get("/api-device/deviceType/add", { supplier, model, protocol, network, productImgPath, deviceTypeId }),
	updateDeviceTypeById: ({ id, supplier, model, protocol, network, productImgPath, deviceTypeId }) =>
		http.get("/api-device/deviceType/add", { id, supplier, model, protocol, network, productImgPath, deviceTypeId }),
	deleteDeviceType: id => http.get("/api-device/deviceType/remove", { id }),
})

export default setupDeviceApis
