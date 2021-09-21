import moment from "moment"

import apis from "apis"
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
		uploadFile(file) {
			const { endpoint, accessId, bucket, policy, signature, expire } = this.uploadFileInfo
			this.getBase64(file, url => {
				const params = {
					url: endpoint,
					data: {
						policy: url,
						key: "/",
						OSSAccessKeyId: accessId,
						signature: signature,
					},
				}
				return uploadFile(params)
			})
		},
		getBase64(file, callback) {
			const reader = new FileReader()
			reader.addEventListener("load", () => callback(reader.result))
			reader.readAsDataURL(file)
		},
	},
}
