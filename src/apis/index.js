import http from "utils/http"

import setupAccoutApis from "./account"
import setupAlarmApis from "./alarm"
import setupDeviceApis from "./device"
import setupMonitorApis from "./monitor"
import setupCommonApis from "./common"
import setupUnitApis from "./unit"
import setupReportApis from "./reportData"

// const BASE_URL = process?.env?.VUE_APP_URL ? process.env.VUE_APP_URL : "/"
// console.log("process --> ", process)
// console.log("process.env --> ", process.env)
// console.log("BASE_URL --> ", BASE_URL)
// const BASE_URL = process ? "http://api.bbfxc.com/api" : "/"

// development
// const BASE_URL = "/api"
// production
const BASE_URL = "http://www.bbfxc.com/api"

export default {
	...setupAccoutApis(http, BASE_URL),
	...setupAlarmApis(http, BASE_URL),
	...setupDeviceApis(http, BASE_URL),
	...setupMonitorApis(http, BASE_URL),
	...setupCommonApis(http, BASE_URL),
	...setupUnitApis(http, BASE_URL),
	...setupReportApis(http, BASE_URL),
}
