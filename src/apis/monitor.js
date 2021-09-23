const setupMonitorApis = http => ({
	monitorCount: () => http.get("/api-device/monitor/statistics", {}),
	monitorAllDeviceStatus: () => http.get("/api-device/monitor/statisticsDeviceStatus", {}),
	monitorAllAlarmType: () => http.get("/api-device/monitor/alarmTypeByUser", {}),
	getMonitorDataList: ({ type, groupId }) => http.get("/api-device/monitor/monitorList", { type, groupId }),
	getMonitorDataDetail: ({ type, id }) => http.get(`/api-device/monitor/monitorDetail/${id}`, { type }),
	getGroupDetailDeviceTypeCount: groupId => http.get("/api-device/monitor/group/statisticsDeviceType", { groupId }),
	getGroupDetailDeviceStatusCount: groupId => http.get("/api-device/monitor/group/statisticsDeviceStatus", { groupId }),
	getGroupDetailAlarmTypeCount: groupId => http.get("/api-alarm/statistics/monitor/alarmTypeByGroup", { groupId }),
	getGroupDetailHistoryElectricityList: ({ current, size, groupId, statisticYear }) =>
		http.get("/api-device/electricEnergy/group/pageList", { current, size, groupId, statisticYear }),
	getGroupDetailHistoryAlarmList: ({ current, size, groupId }) =>
		http.get("/api-device/electricEnergy/group/pageList", { current, size, groupId }),
	getGroupDetailDeviceList: ({ current, size, groupId }) =>
		http.get("/api-device/history/pageList", { current, size, groupId }),
	groupDetailUpdateImg: ({ current, imgPath, type }) =>
		http.put("/api-device/history/pageList", { current, imgPath, type }),
})

export default setupMonitorApis
