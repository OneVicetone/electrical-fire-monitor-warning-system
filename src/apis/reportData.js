const setupReportApis = http => ({
	reportData: ({ deviceId, startDate, endDate }) => http.get("/api-device/reportData/getByDateForModule", { deviceId, startDate, endDate }),
})

export default setupReportApis