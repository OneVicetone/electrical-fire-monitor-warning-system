const setupMonitorApis = (http, BASE_URL) => ({
	monitorCount: () => http.get(`${BASE_URL}/api-device/monitor/statistics`, {}),

	monitorAllDeviceStatus: () => http.get(`${BASE_URL}/api-device/monitor/statisticsDeviceStatus`, {}),

	monitorAllAlarmType: () => http.get(`${BASE_URL}/api-alarm/statistics/monitor/alarmTypeByUser`, {}),

	getMonitorDataList: ({ type, groupId }) => http.get(`${BASE_URL}/api-device/monitor/monitorList`, { type, groupId }),

	getMonitorDataDetail: ({ type, id }) => http.get(`${BASE_URL}/api-device/monitor/monitorDetail/${id}`, { type }),

	getGroupDetailDeviceTypeCount: groupId => http.get(`${BASE_URL}/api-device/monitor/group/statisticsDeviceType`, { groupId }),

	getGroupDetailDeviceStatusCount: groupId => http.get(`${BASE_URL}/api-device/monitor/group/statisticsDeviceStatus`, { groupId }),

	getGroupDetailAlarmTypeCount: groupId => http.get(`${BASE_URL}/api-alarm/statistics/monitor/alarmTypeByGroup`, { groupId }),

	getGroupDetailHistoryElectricityList: ({ current, size, groupId, statisticYear }) =>
		http.get(`${BASE_URL}/api-device/electricEnergy/group/pageList`, { current, size, groupId, statisticYear }),

	getGroupDetailHistoryAlarmList: ({ current, size, groupId }) =>
		http.get(`${BASE_URL}/api-alarm/statistics/monitor/alarmTypeByGroup`, { current, size, groupId }),

	getGroupDetailDeviceList: ({ current, size, groupId }) =>
		http.get(`${BASE_URL}/api-device/history/pageList`, { current, size, groupId }),

	groupDetailUpdateImg: form =>
		http.formPut(`${BASE_URL}/api-user/group/updateImg`, form),

	groupDetailDevicePeriod: groupId => http.get(`${BASE_URL}/api-device/monitor/group/statisticsDevicePeriod`, { groupId }),
})

export default setupMonitorApis
