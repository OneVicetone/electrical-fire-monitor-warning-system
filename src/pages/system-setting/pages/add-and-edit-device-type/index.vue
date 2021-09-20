<template>
	<ChildLayout :siderList="siderList">
		<div class="add-and-edit-device-type-container">
			<Breadcrumb :historyList="historyList" />

			<div class="content">
				<NavTitles title="设备协议" />
				<div class="form-container"></div>
			</div>
		</div>
	</ChildLayout>
</template>

<script>
import Breadcrumb from "components/Breadcrumb.vue"
import NavTitles from "components/NavTitles.vue"
import ChildLayout from "components/ChildLayout.vue"

import apis from "apis"
const { getDeviceTypeDetail, addDeviceType, updateDeviceTypeById } = apis
export default {
	name: "AddAndEditDeviceType",
	components: { Breadcrumb, NavTitles, ChildLayout },
	props: {
		id: {
			type: String,
			default: "",
		},
	},
	data() {
		return {
			historyList: ["首页", "系统设置", "设备类型管理", `${this.isAdd ? "新增" : "编辑"}设备类型`],
			formData: {
				deviceTypeName: "",
				deviceTypeName: "",
			},
			siderList: [
				{
					path: "device-type-manage",
					name: "DeviceTypeManage",
					meta: { title: "设备类型管理" },
				},
				{
					path: "system-log",
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
	methods: {
		getDeviceTypeById() {
			return getDeviceTypeDetail(id).then(({ data }) => {
				this.formData = {
					...data,
				}
			})
		},
	},
}
</script>

<style lang="less" scoped>
</style>