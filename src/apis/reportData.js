const setupReportApis = (http, BASE_URL) => ({
	reportData: ({ deviceId, startDate, endDate }) => http.get(`${BASE_URL}/api-device/reportData/getByDateForModule`, { deviceId, startDate, endDate }),
})

export default setupReportApis