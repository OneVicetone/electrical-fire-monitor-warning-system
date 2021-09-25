<template>
	<ChildLayout :siderList="siderList">
		<div class="add-and-edit-device-type-container">
			<Breadcrumb :historyList="historyList" />

			<div class="content">
				<NavTitles title="设备协议" />
				<div class="form-container">
					<a-upload
						list-type="picture-card"
						class="file-uploader"
						:show-upload-list="false"
						:customRequest="handleUploadFile"
						@change="handleChange"
					>
						<img v-if="formData.productImgPath" :src="formData.productImgPath" />
						<div v-else>
							<a-icon :type="uploading ? 'loading' : 'plus'" />
							<div class="ant-upload-text">Upload</div>
						</div>
					</a-upload>
					<a-form-model :model="formData">
						<a-form-model-item label="设备型号" required>
							<a-input v-model="formData.model" placeholder="请输入设备型号" />
						</a-form-model-item>
						<a-form-model-item label="设备类型" required>
							<a-select v-model="formData.deviceTypeId" />
						</a-form-model-item>
						<a-form-model-item label="设备协议" required>
							<a-select v-model="formData.protocol" />
						</a-form-model-item>
						<a-form-model-item label="联网方式" required>
							<a-select v-model="formData.network" />
						</a-form-model-item>
						<a-form-model-item label="供应商">
							<a-input v-model="formData.supplier" placeholder="请输入设备供应商简称" />
						</a-form-model-item>
						<a-form-model-item>
							<div class="btn-group">
								<a-button type="primary" @click="enter">确定</a-button>
								<a-button ghost @click="cancel">取消</a-button>
							</div>
						</a-form-model-item>
					</a-form-model>
				</div>
			</div>
		</div>
	</ChildLayout>
</template>

<script>
import Breadcrumb from "components/Breadcrumb.vue"
import NavTitles from "components/NavTitles.vue"
import ChildLayout from "layouts/ChildLayout.vue"

import { uploadFileMixin } from "mixins"
import apis from "apis"

const { getDeviceTypeDetail, addDeviceType, updateDeviceTypeById } = apis

export default {
	name: "AddAndEditDeviceType",
	mixins: [uploadFileMixin],
	components: { Breadcrumb, NavTitles, ChildLayout },
	props: {
		id: {
			type: String,
			default: "",
		},
	},
	data() {
		return {
			uploading: false,
			historyList: ["首页", "系统设置", "设备类型管理", `${this.isAdd ? "新增" : "编辑"}设备类型`],
			formData: {
				model: "",
				deviceTypeId: "",
				network: "",
				protocol: "",
				productImgPath: "",
				supplier: "",
			},
			siderList: [
				{
					path: "/system-setting/device-type-manage",
					name: "DeviceTypeManage",
					meta: { title: "设备类型管理" },
				},
				{
					path: "/system-setting/system-log",
					name: "SystemLog",
					meta: { title: "系统日志" },
				},
			],
		}
	},
	computed: {
		isAdd() {
			return this.id === "add"
		},
	},
	mounted() {
		const { isAdd, getDeviceTypeById, getUploadUrl } = this
		const promiseArr = [getUploadUrl()]
		!isAdd && promiseArr.push(getDeviceTypeById())
		Promise.allSettled(promiseArr)
	},
	methods: {
		getDeviceTypeById() {
			return getDeviceTypeDetail(this.id).then(({ data }) => {
				this.formData = {
					...data,
				}
			})
		},
		enter() {
			const { isAdd, id } = this
			const params = {
				...formData,
				...(!this.isAdd && { id }),
			}
			isAdd ? addDeviceType(params) : updateDeviceTypeById(params)
		},
		cancel() {
			this.$router.go(-1)
		},
		handleChange({ file: { status, originFileObj } }) {
			if (status === "uploading") return (this.uploading = true)
			if (status === "done") {
				getBase64(originFileObj, imgUrl => {
					this.formData.productImgPath = imgUrl
					this.uploading = false
				})
			}
		},
		handleUploadFile(arg) {
			arg.file instanceof File && this.uploadFile(arg.file)
		},
	},
}
</script>

<style lang="less">
.add-and-edit-device-type-container {
	.content {
        padding: 0 0 0 3rem;
		.form-container {
            display: flex;
            justify-content: centr;
			.file-uploader {
				width: 12.5rem;
				height: 12.5rem;
                margin: 0 4.58rem 0 1.58rem;
			}
		}
	}
}
</style>