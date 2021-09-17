const setupMonitorApis = http => ({
	monitorCount: () => http.get("/api-device/monitor/statistics", {}),
	monitorAllDeviceStatus: () => http.get("/api-device/monitor/statisticsDeviceStatus", {}),
	monitorAllAlarmType: () => http.get("/api-device/monitor/alarmTypeByUser", {}),
	getMonitorDataList: ({ type, groupId }) => http.get("/api-device/monitor/monitorList", { type, groupId }),
	getMonitorDataDetail: ({ type, id }) => http.get(`/api-device/monitor/monitorDetail/${id}`, { type }),
})

export default setupMonitorApis
