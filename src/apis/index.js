console.log(process)

import http from 'utils/http'

import setupAccoutApis from "./account";
import setupAlarmApis from './alarm';
import setupDeviceApis from './device'
import setupMonitorApis from './monitor'
import setupCommonApis from './common'
import setupUnitApis from './unit'
import setupReportApis from './reportData'

export default {
    ...setupAccoutApis(http),
    ...setupAlarmApis(http),
    ...setupDeviceApis(http),
    ...setupMonitorApis(http),
    ...setupCommonApis(http),
    ...setupUnitApis(http),
    ...setupReportApis(http)
}