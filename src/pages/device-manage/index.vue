<template>
	<div class="device-manage-container">
		<div class="organization">
			<OrganizationList />
		</div>
		<div class="device-manage">
			<a-radio-group v-model="deviceStatusRadio">
				<a-radio-button v-for="radio of deviceStatusOptions" :key="radio.value" :value="radio.value">
					{{ radio.label }}
				</a-radio-button>
			</a-radio-group>
			<a-form-model class="table-search-form" layout="inline" :model="searchForm">
				<a-form-model-item>
					<a-input v-model="searchForm.sn" placeholder="请输入设备编码/名称" size="small" />
				</a-form-model-item>
				<a-form-model-item>
					<a-select
						v-model="searchForm.deviceTypeId"
						:options="deviceTypeOptions"
						placeholder="请选择设备类型"
						size="small"
					/>
				</a-form-model-item>
				<a-form-model-item>
					<a-select
						v-model="searchForm.deviceModelId"
						:options="deviceIdOptions"
						placeholder="请选择设备编号"
						size="small"
					/>
				</a-form-model-item>
				<a-form-model-item>
					<a-input v-model="searchForm.iccid" placeholder="请输入ICCID号" size="small" />
				</a-form-model-item>
				<a-form-model-item>
					<a-button type="primary" size="small" @click="search">搜索</a-button>
				</a-form-model-item>
				<a-form-model-item>
					<a-button type="primary" size="small" @click="reset">重置</a-button>
				</a-form-model-item>
				<div class="other-btns">
					<a-popover trigger="click" placement="bottomRight">
						<a-list slot="content" size="small" :data-source="batchOperationOptions">
							<a-list-item slot="renderItem" slot-scope="item" @click="item.operate.call($router)">
								{{ item.name }}
							</a-list-item>
						</a-list>
						<a-button type="primary" size="small">批量操作<a-icon type="down" /></a-button>
					</a-popover>
					<a-button type="primary" size="small" @click="exportDeviceList">导出</a-button>
				</div>
			</a-form-model>
			<div class="device-list">
				<DeviceCard v-for="device of deviceListData" :key="device.id" :deviceInfoObj="device" @changeDeviceWorkStatus="changeDeviceWorkStatus" />
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
import { cloneDeep } from "lodash"

import OrganizationList from "components/OrganizationList.vue"
import DeviceCard from "./components/DeviceCard.vue"
import Pagination from "components/Pagination.vue"

import optionsData from "utils/optionsData"
import { SHIP, TRANSFER, IMPORT } from "utils/baseData"
import { commonMixin } from "mixins"
import apis from "apis"

const { getDeviceList, createDevice, changeDeviceInfo, exportDeviceList } = apis

const { deviceTypeOptions, deviceIdOptions } = optionsData

const searchFromInitial = {
	sn: "",
	deviceTypeId: 0,
	deviceModelId: 0,
	iccid: "",
}
const deviceStatusRadioInitial = "0"

export default {
	name: "DeviceManage",
	mixins: [commonMixin],
	components: { OrganizationList, DeviceCard, Pagination },
	data() {
		return {
			deviceStatusOptions: [
				{ label: "全部设备", value: "0" },
				{ label: "在线", value: "1" },
				{ label: "离线", value: "2" },
				{ label: "报警", value: "3" },
				{ label: "故障", value: "4" },
			],
			deviceStatusRadio: deviceStatusRadioInitial,
			searchForm: cloneDeep(searchFromInitial),
			deviceTypeOptions,
			deviceIdOptions,
			paginationData: {
				total: 0,
				current: 1,
				size: 8,
			},
			batchOperationOptions: [
				{
					name: "批量转组",
					operate() {
						this.push(`/device-manage/batch-operation/${TRANSFER}`)
					},
				},
				{
					name: "批量导入",
					operate() {
						this.push(`/device-manage/batch-operation/${IMPORT}`)
					},
				},
				{
					name: "批量发货",
					operate() {
						this.push(`/device-manage/batch-operation/${SHIP}`)
					},
				},
			],
			deviceListData: [],
		}
	},
	mounted() {
		const {
			getDeviceListData,
			paginationData: { current, size },
		} = this
		getDeviceListData(current, size)
	},
	methods: {
		getDeviceListData(current = 1, size = 10) {
			const params = {
				current,
				size,
				...this.searchForm,
				...(this.deviceStatusRadio !== "0" && { status: this.deviceStatusRadio }),
			}
			getDeviceList(params).then(({ data: { records, total, current, size } }) => {
				this.deviceListData = records
				this.paginationData = {
					...this.paginationData,
					total,
					current,
					size,
				}
			})
		},
		search() {
			const {
				paginationData: { current, size },
			} = this
			this.getTableData(current, size)
		},
		reset() {
			this.searchForm = cloneDeep(searchFromInitial)
			this.deviceStatusRadio = deviceStatusRadioInitial
			this.search()
		},
		changePageHandle(page, pageSize) {
			this.getDeviceListData(page, pageSize)
		},
		changePageSizeHandle(current, size) {
			this.getDeviceListData(current, size)
		},
		exportDeviceList() {
			exportDeviceList()
		},
		changeDeviceWorkStatus() {
			
		}
	},
	watch: {
		deviceStatusRadio() {
			this.search()
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
		flex: 0 0 auto;
		padding: 0 1.5rem;
		border-right: 1px solid #3f4a77;
	}
	.device-manage {
		padding: 4.08rem 1.75rem 1rem;
		overflow-x: auto;

		.table-search-form {
			margin: 1.25rem 0 0;
			position: relative;
			.other-btns {
				height: 40px;
				display: flex;
				align-items: center;
				position: absolute;
				right: 0;
				top: 0;
				> button {
					margin: 0 1.17rem 0 0;
				}
			}
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