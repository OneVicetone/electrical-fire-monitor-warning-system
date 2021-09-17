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
	processAlarm: ({ alarmId, confirmFlag, processType, remark }) =>
		http.post("/api-alarm/alarm/process", { alarmId, confirmFlag, processType, remark }),
})

export default setupAlarmApis
