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

	getDeviceList: ({ current, size, groupId, deviceTypeId, deviceModelId, sn, status, iccid }) =>
		http.get("/api-device/deviceMgr/pageList", {
			current,
			size,
			groupId,
			deviceTypeId,
			deviceModelId,
			sn,
			status,
			iccid,
		}),

	exportDeviceList: ({ groupId, deviceTypeId, deviceModelId, sn, status, iccid }) =>
		http.get("/api-device/deviceMgr/export", { groupId, deviceTypeId, deviceModelId, sn, status, iccid }),

	getDevicesTypeList: ({ current, size, model }) =>
		http.get("/api-device/deviceType/pageList", { current, size, model }),

	addDeviceType: ({ supplier, model, protocol, network, productImgPath, deviceTypeId }) =>
		http.get("/api-device/deviceType/add", { supplier, model, protocol, network, productImgPath, deviceTypeId }),

	updateDeviceTypeById: ({ id, supplier, model, protocol, network, productImgPath, deviceTypeId }) =>
		http.get("/api-device/deviceType/add", { id, supplier, model, protocol, network, productImgPath, deviceTypeId }),

	deleteDeviceType: id => http.get("/api-device/deviceType/remove", { id }),

	getDeviceTypeDetail: id => http.get("/api-device/deviceType/detail", { id }),
	
	getDeviceInfoDetail: id => http.get(`/api-device/deviceInfo/detail/${id}`),

	deviceCmd: ({
		deviceId,
		cmdType,
		content: {
			iz = '',
			temp = '',
			rv = '',
			rc = '',
			ccr = '',
			realFreq = '',
			beatsFreq = ''
		}
	}) =>
		http.post("/api-device/deviceCmd/send", 
		{
			deviceId,
			cmdType,
			content: {
				iz,
				temp,
				rv,
				rc,
				ccr,
				realFreq,
				beatsFreq
			}
		}
	),
	commandPageList: ({ current, size, deviceId }) =>
		http.get("/api-device/deviceCmd/pageList", { current, size, deviceId }),
})

export default setupDeviceApis
