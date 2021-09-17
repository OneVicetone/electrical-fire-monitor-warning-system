import http from 'utils/http'
const BASE_URL = '/api'

import setupAccoutApis from "./account";
import setupAlarmApis from './alarm';
import setupDeviceApis from './device'
import setupMonitorApis from './monitor'

export default {
    ...setupAccoutApis(http),
    ...setupAlarmApis(http),
    ...setupDeviceApis(http),
    ...setupMonitorApis(http)
}