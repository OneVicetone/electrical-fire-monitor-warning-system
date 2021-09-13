import http from 'utils/http'
const BASE_URL = '/api-user'

import setupAccoutApis from "./account";

export default {
    ...setupAccoutApis(http, BASE_URL)
}