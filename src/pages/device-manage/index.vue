<template>
	<div class="device-manage-container">
		<div class="organization">
			<OrganizationList />
		</div>
		<div class="device-manage">
			<a-radio-group :value="deviceStatusRadio">
				<a-radio-button v-for="radio of deviceStatusOptions" :key="radio.value" :value="radio.value">
					{{ radio.label }}
				</a-radio-button>
			</a-radio-group>
			<a-form-model class="table-search-form" layout="inline" :model="searchForm">
				<a-form-model-item>
					<a-input v-model="searchForm.deviceName" placeholder="请输入角色名称" size="small" />
				</a-form-model-item>
				<a-form-model-item>
					<a-select
						v-model="searchForm.deviceType"
						:options="deviceTypeOptions"
						placeholder="请选择设备类型"
						size="small"
					/>
				</a-form-model-item>
				<a-form-model-item>
					<a-select
						v-model="searchForm.deviceId"
						:options="deviceIdOptions"
						placeholder="请选择设备编号"
						size="small"
					/>
				</a-form-model-item>
				<a-form-model-item>
					<a-input v-model="searchForm.iccid" placeholder="请输入ICCID号" size="small" />
				</a-form-model-item>
				<a-form-model-item>
					<a-button type="primary" size="small">搜索</a-button>
				</a-form-model-item>
				<a-form-model-item>
					<a-button type="primary" size="small">重置</a-button>
				</a-form-model-item>
			</a-form-model>
			<div class="device-list">
				<DeviceCard />
				<DeviceCard />
				<DeviceCard />
				<DeviceCard />
				<DeviceCard />
				<DeviceCard />
				<DeviceCard />
				<DeviceCard />
			</div>
			<Pagination
				:paginationData="paginationData"
				:changePageHandle="changePageHandle"
				:changePageSizeHandle="changePageSizeHandle"
			/>
		</div>
	</div>
</template>

<script>
import OrganizationList from "components/OrganizationList.vue"
import DeviceCard from "./components/DeviceCard.vue"
import Pagination from "components/Pagination.vue"

import optionsData from "utils/optionsData"

import apis from 'apis'

const { createDevice, changeDeviceInfo } = apis

const { deviceTypeOptions, deviceIdOptions } = optionsData

export default {
	name: "DeviceManage",
	components: { OrganizationList, DeviceCard, Pagination },
	data() {
		return {
			deviceStatusRadio: "1",
			searchForm: {
				deviceName: "",
				deviceType: "0",
				deviceId: "0",
				iccid: "",
			},
			deviceTypeOptions,
			deviceIdOptions,
			paginationData: {
				total: 100,
				current: 1,
				size: 10,
			},
		}
	},
	computed: {
		deviceStatusOptions() {
			return [
				{ label: "全部设备", value: "1" },
				{ label: "在线", value: "2" },
				{ label: "离线", value: "3" },
				{ label: "报警", value: "4" },
				{ label: "故障", value: "5" },
			]
		},
	},
	methods: {
		getDeviceListData(current = 1, size = 10) {},
		changePageHandle(page, pageSize) {
			this.getDeviceListData(page, pageSize)
		},
		changePageSizeHandle(current, size) {
			this.getDeviceListData(current, size)
		},
	},
}
</script>

<style lang="less" scoped>
@import url("styles/common");
.device-manage-container {
	.pages-container-no-child-layout();
	display: flex;
	max-height: 100vh;
	.organization {
		width: 21.67rem;
		height: 100%;
		padding: 0 1.5rem;
		border-right: 1px solid #3f4a77;
	}
	.device-manage {
		padding: 4.08rem 1.75rem 1rem;
		overflow-x: auto;

		.table-search-form {
			margin: 1.25rem 0 0;
		}
		.device-list {
			display: flex;
			flex-wrap: wrap;
			.device-card {
				margin: 1.5rem;
			}
		}
	}
}
</style>