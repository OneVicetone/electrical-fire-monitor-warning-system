import axios from "axios"
import { message } from "ant-design-vue"

import { TOKEN } from "utils/storageConstant"
import { isPC, showTokenInvalidationModal } from "utils/commonFunctions"

const getRequestHeader = (type = "json") => {
	const headersObj = {
		json: "application/json",
		form: "application/x-www-form-urlencoded",
	}
	return {
		"Content-Type": headersObj[type],
		Authorization: localStorage.getItem(TOKEN) || "",
	}
}

const successCode = 1

const axiosInstance = axios.create({
	timeout: 10000,
	headers: getRequestHeader(),
})
const requestInterceptFunc = req => req

const requsetErrFunc = err => {
	message.error(err.toString())
	throw err
}

const responseInterceptFunc = res => {
	const {
		data,
		status,
		statusText,
		config: { url },
		headers: { authorization },
	} = res
	if (res.headers["content-type"] === "application/xml") {
		return data
	}
	if (status > 200) {
		message.error(statusText)
		throw new Error(data.message)
	}
	if (data.code - 20000 > 0) {
		if (isPC()) {
			showTokenInvalidationModal()
		} else {
			window.href = "/phone-login"
		}
		throw new ReferenceError("token error")

	}
	if (data.code !== successCode) {
		message.error({ content: data.message, duration: 1 })
		throw new Error(data.message)
	}
	if (url.includes("/login")) {
		localStorage.setItem(TOKEN, authorization)
	}
	return data
}

const responseErrFunc = err => {
	message.error(err.toString())
	throw err
}

axiosInstance.interceptors.request.use(requestInterceptFunc, requsetErrFunc)
axiosInstance.interceptors.response.use(responseInterceptFunc, responseErrFunc)

class Http {
	static get(url, params) {
		return axiosInstance({
			url,
			method: "get",
			params,
			headers: getRequestHeader(),
		})
	}

	static put(url, data) {
		return axiosInstance({
			url,
			method: "put",
			data,
			headers: getRequestHeader(),
		})
	}

	static delete(url, data) {
		return axiosInstance({
			url,
			method: "delete",
			data,
			headers: getRequestHeader(),
		})
	}

	static post(url, data) {
		return axiosInstance({
			url,
			method: "post",
			data,
			headers: getRequestHeader(),
		})
	}

	static formPost(url, data) {
		return axiosInstance({
			url,
			method: "post",
			data,
			headers: getRequestHeader("form"),
		})
	}

	static formPut(url, data) {
		return axiosInstance({
			url,
			method: "put",
			data,
			headers: getRequestHeader("form"),
		})
	}
}

export default Http
