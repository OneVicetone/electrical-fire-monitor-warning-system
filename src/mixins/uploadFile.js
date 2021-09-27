import moment from "moment"

import apis from "apis"
import { xmlObj2json } from "utils/commonFunctions"

const { getUploadUrl, uploadFile } = apis

export const uploadFileMixin = {
	data() {
		return {
			uploadFileInfo: {},
		}
	},
	methods: {
		getUploadUrl() {
			// endpoint 上传地址
			// accessId 权限id
			// bucket 存储空间
			// policy 策略
			// signature 签名
			// expire 过期时间戳 默认3分钟之后时间
			return getUploadUrl().then(({ data }) => (this.uploadFileInfo = data))
		},
		toUploadFile(file) {
			const { endpoint, accessId, policy, signature, pathPrefix, expire } = this.uploadFileInfo
			const func = () => {
				const imageNewName = new Date().getTime() + file.name.substr(file.name.lastIndexOf("."))
				const formData = new FormData()
				formData.append("OSSAccessKeyId", accessId)
				formData.append("policy", policy)
				formData.append("Signature", signature)
				formData.append("key", pathPrefix + "/" + imageNewName)
				formData.append("success_action_status", 201)
				formData.append("file", file)
				const params = {
					url: endpoint,
					data: formData,
				}
				return uploadFile(params)
					.then(xml => xmlObj2json(xml))
					.then(json => json.PostResponse.Location)
			}
			const expirationTime = Number(`${expire}000`)
			if (expirationTime < moment().valueOf()) {
				this.getUploadUrl().then(() => func())
			} else {
				return func()
			}
		},
		// getBase64(file, callback) {
		// 	const reader = new FileReader()
		// 	reader.addEventListener("load", () => callback(reader.result))
		// 	reader.readAsDataURL(file)
		// },
	},
}
