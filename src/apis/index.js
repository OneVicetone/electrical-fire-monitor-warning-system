import http from 'utils/http'
const BASE_URL = '/api'

import setupAccoutApis from "./account";
import setupAlarmApis from './alarm';

export default {
    ...setupAccoutApis(http),
    ...setupAlarmApis(http),
}