import axios from "axios"
import { message } from "ant-design-vue"

import { TOKEN } from "utils/storageConstant"

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
	time: 3000,
	headers: getRequestHeader(),
})
const requestInterceptFunc = req => {
	return req
}

const requsetErrFunc = err => {
	message.error(err.toString())
	throw err
}

const responseInterceptFunc = res => {
	console.log("res in responseInterceptFunc --- ", res)
	const { data, status, statusText } = res
	if (status > 200) {
	  message.error(statusText);
	  throw new Error(data.message);
	}
	if (data.code !== successCode) {
		message.error(data.message)
	}
	if (data.code === -100) {
		// TODO: token 失效跳转
		sessionStorage.clear()
		window.location.reload()
		throw new ReferenceError("token error")
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
	static get(url, data) {
		return axiosInstance({
			url,
			method: "get",
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
}

export default Http
