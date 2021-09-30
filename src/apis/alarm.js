const setupAlarmApis = http => ({
	getAlarmCount: () => http.get("/api-alarm/alarm/statistics", {}),
	getAlarmList: ({
		current,
		size,
		module,
		deviceSnName,
		alarmType,
		alarmLevel,
		deviceTypeId,
		status,
		startDate,
		endDate,
	}) =>
		http.get("/api-alarm/alarm/pageList", {
			current,
			size,
			module,
			deviceSnName,
			alarmType,
			alarmLevel,
			deviceTypeId,
			status,
			startDate,
			endDate,
		}),
	getAlarmDetail: id => http.get(`/api-alarm/alarm/detail/${id}`),
	processAlarm: ({ alarmId, confirmFlag, processType, sitePhotos, remark = '' }) =>
		http.post("/api-alarm/alarm/process", { alarmId, confirmFlag, processType, sitePhotos, remark }),
	realTimeData: ({ deviceId }) => http.get("/api-device/deviceMgr/realTimeData",{ deviceId }),
})

export default setupAlarmApis
