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
					>
						<img v-if="formData.productImgPath" :src="formData.productImgPath" />
						<div v-else>
							
							<a-icon :type="uploading ? 'loading' : 'plus'" />
							<div class="ant-upload-text">上传图片</div>
						</div>
					</a-upload>
					<a-form-model :model="formData">
						<a-form-model-item label="设备型号" required>
							<a-input v-model="formData.model" :maxLength="20" placeholder="请输入设备型号" />
						</a-form-model-item>
						<a-form-model-item label="设备类型" required>
							<a-select v-model="formData.deviceTypeId" :options="deviceTypeOptions" />
						</a-form-model-item>

						<a-form-model-item label="设备协议" required>
							<a-select v-model="formData.protocol" :options="protocolTypeOptions" />
						</a-form-model-item>
						<a-form-model-item label="联网方式" required>
							<a-select v-model="formData.network" :options="networkTypeOptions" />
						</a-form-model-item>
						<a-form-model-item label="供应商">
							<a-input v-model="formData.supplier" placeholder="请输入设备供应商简称" />
						</a-form-model-item>
						<a-form-model-item label="是否需要网关" required>
							<a-select v-model="formData.gateway" :options="needGatewayOptions" />
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
import { message as msg } from "ant-design-vue"

import Breadcrumb from "components/Breadcrumb.vue"
import NavTitles from "components/NavTitles.vue"
import ChildLayout from "layouts/ChildLayout.vue"

import apis from "apis"
import allOptionsData from "utils/optionsData"
import { uploadFileMixin, tableListMixin } from "mixins"

const { getDeviceTypeDetail, addDeviceType, updateDeviceTypeById } = apis
const { networkTypeOptions, needGatewayOptions } = allOptionsData

export default {
	name: "AddAndEditDeviceType",
	mixins: [uploadFileMixin, tableListMixin],
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
			formData: {
				model: "",
				deviceTypeId: "",
				network: "",
				protocol: "",
				productImgPath: "",
				supplier: "",
				gateway: "",
			},
			deviceTypeOptions: [],
			protocolTypeOptions: [],
			networkTypeOptions,
			needGatewayOptions,
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
		historyList() {
			return ["首页", "系统设置", "设备类型管理", `${this.isAdd ? "新增" : "编辑"}设备类型`]
		},
	},
	mounted() {
		const { isAdd, getDeviceTypeById, getUploadUrl, getOptionsListPromiseArr } = this
		console.log(isAdd)
		const optionsTypes = ["deviceType", "protocolType"]
		const promiseArr = [getUploadUrl(), ...getOptionsListPromiseArr(optionsTypes)]
		!isAdd && promiseArr.push(getDeviceTypeById())
		Promise.allSettled(promiseArr)
	},
	methods: {
		getDeviceTypeById() {
			return getDeviceTypeDetail(this.id).then(({ data }) => {
				this.formData = {
					...data,
					deviceTypeId: data.type,
					protocol: data.protocolType,
				}
			})
		},
		enter() {
			const { isAdd, id, formData } = this
			const params = {
				...formData,
				...(!isAdd && { id }),
			}
			const func = () => {
				msg.success(`${this.isAdd ? "添加" : "修改"}成功`)
				this.cancel()
			}
			isAdd ? addDeviceType(params).then(func) : updateDeviceTypeById(params).then(func)
		},
		cancel() {
			this.$router.go(-1)
		},
		handleUploadFile(arg) {
			arg.file instanceof File &&
				this.toUploadFile(arg.file).then(imgUrl => {
					this.uploading = false
					this.formData.productImgPath = imgUrl
				})
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
				img {
					width: 100%;
					height: 12.5rem;
				}
			}
		}
	}
}
</style>