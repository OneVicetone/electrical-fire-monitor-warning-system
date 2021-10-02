const setupAlarmApis = (http, BASE_URL) => ({
	getAlarmCount: () => http.get(`${BASE_URL}/api-alarm/alarm/statistics`, {}),
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
		http.get(`${BASE_URL}/api-alarm/alarm/pageList`, {
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
	getAlarmDetail: id => http.get(`${BASE_URL}/api-alarm/alarm/detail/${id}`),
	processAlarm: ({ alarmId, confirmFlag, processType, sitePhotos, remark = '' }) =>
		http.post(`${BASE_URL}/api-alarm/alarm/process`, { alarmId, confirmFlag, processType, sitePhotos, remark }),
	realTimeData: ({ deviceId }) => http.get(`${BASE_URL}/api-device/deviceMgr/realTimeData`,{ deviceId }),
})

export default setupAlarmApis
