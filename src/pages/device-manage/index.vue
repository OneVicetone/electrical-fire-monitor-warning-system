<template>
	<div class="device-manage-container">
		<div class="organization">
			<OrganizationList :treeData="treeData" @handleSelectFunc="handleSelectTreeNode" showDeviceNum />
		</div>
		<div class="device-manage">
			<a-radio-group v-model="deviceStatusRadio">
				<a-radio-button v-for="radio of deviceStatusOptions" :key="radio.value" :value="radio.value">
					{{ radio.label }}
				</a-radio-button>
			</a-radio-group>
			<a-form-model class="table-search-form" layout="inline" :model="searchForm">
				<a-form-model-item>
					<a-input v-model="searchForm.sn" placeholder="请输入设备编码/名称" />
				</a-form-model-item>
				<a-form-model-item>
					<a-select v-model="searchForm.deviceTypeId" :options="deviceTypeOptions" placeholder="请选择设备类型" />
				</a-form-model-item>
				<a-form-model-item>
					<a-select v-model="searchForm.deviceModelId" :options="deviceIdOptions" placeholder="请选择设备型号" />
				</a-form-model-item>
				<a-form-model-item>
					<a-input v-model="searchForm.iccid" placeholder="请输入ICCID号" />
				</a-form-model-item>
				<a-form-model-item>
					<a-button type="primary" @click="search">搜索</a-button>
				</a-form-model-item>
				<a-form-model-item>
					<a-button type="primary" @click="reset">重置</a-button>
				</a-form-model-item>
				<div class="other-btns">
					<a-popover trigger="click" placement="bottomRight">
						<a-list slot="content" :data-source="batchOperationOptions">
							<a-list-item slot="renderItem" slot-scope="item" @click="item.operate.call($router)">
								{{ item.name }}
							</a-list-item>
						</a-list>
						<a-button type="primary">批量操作<a-icon type="down" /></a-button>
					</a-popover>
					<a-button type="primary" @click="exportData">导出</a-button>
				</div>
			</a-form-model>
			<div class="device-list">
				<DeviceCard
					v-for="device of deviceListData"
					:key="device.id"
					:deviceInfoObj="device"
					:treeData="treeData"
					@re-request-list="requestAll"
				/>
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
import { message as msg } from "ant-design-vue"

import OrganizationList from "components/OrganizationList.vue"
import DeviceCard from "./components/DeviceCard.vue"
import Pagination from "components/Pagination.vue"

import { TRANSFER, SHIP, IMPORT } from "utils/baseData"
import { commonMixin, tableListMixin } from "mixins"
import apis from "apis"

const { getDeviceList, exportDeviceList, getGroupTree, deviceCondition } = apis

const searchFromInitial = {
	sn: "",
	deviceTypeId: "",
	deviceModelId: "",
	iccid: "",
}
const deviceStatusRadioInitial = "0"

export default {
	name: "DeviceManage",
	mixins: [commonMixin, tableListMixin],
	components: { OrganizationList, DeviceCard, Pagination },
	data() {
		return {
			deviceStatusOptions: [
				{ label: "全部设备", value: "0", Eg: "total" },
				{ label: "在线", value: "1", Eg: "online" },
				{ label: "离线", value: "2", Eg: "offline" },
				{ label: "报警", value: "3", Eg: "alarm" },
				{ label: "故障", value: "4", Eg: "fault" },
			],
			deviceStatusRadio: deviceStatusRadioInitial,
			searchForm: cloneDeep(searchFromInitial),
			deviceTypeOptions: [],
			deviceIdOptions: [],
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
				// {
				// 	name: "批量导入",
				// 	operate() {
				// 		this.push(`/device-manage/batch-operation/${IMPORT}`)
				// 	},
				// },
				// {
				// 	name: "批量发货",
				// 	operate() {
				// 		this.push(`/device-manage/batch-operation/${SHIP}`)
				// 	},
				// },
			],
			deviceListData: [],
			treeData: [],
			groupId: "",
		}
	},
	watch: {
		deviceStatusRadio() {
			this.search()
		},
		"searchForm.deviceTypeId": {
			deep: true,
			handler(val) {
				this.getDeviceId(val)
			},
		},
	},
	mounted() {
		this.requestAll()
	},
	methods: {
		requestAll() {
			const optionsTypes = ["deviceType"]
			const {
				getDeviceListData,
				getGroupTreeData,
				getOptionsListPromiseArr,
				getDeviceId,
				getDeviceCondition,
				paginationData: { current, size },
			} = this
			Promise.allSettled([
				getDeviceListData(current, size),
				getGroupTreeData(),
				getDeviceId(),
				getDeviceCondition(),
				...getOptionsListPromiseArr(optionsTypes),
			])
		},
		getDeviceCondition() {
			deviceCondition().then(({ data }) => {
				this.deviceStatusOptions.map(item => {
					item.label = `${item.label}(${data[item.Eg]})`
					return item
				})
			})
		},
		getDeviceListData(current = 1, size = 10) {
			const params = {
				current,
				size,
				...this.searchForm,
				...(this.groupId && { groupId: this.groupId }),
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
			this.getDeviceListData(current, size)
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
		exportData() {
			const params = {
				...this.searchForm,
				...(this.deviceStatusRadio !== "0" && { status: this.deviceStatusRadio }),
			}
			exportDeviceList(params).then(() => msg.success("正在导出...可在右上角-个人中心-下载中心页面查看"))
		},
		changeDeviceWorkStatus() {},
		getGroupTreeData() {
			getGroupTree(true).then(({ data }) => {
				this.treeData = data
			})
		},
		handleSelectTreeNode(key) {
			this.groupId = key
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
		overflow: auto;
		// border-right: 1px solid #3f4a77;
	}
	.device-manage {
		width: 100%;
		padding: 5rem 1.75rem 1rem;
		overflow-x: auto;
		border-left: 1px solid #3f4a77;
		.table-search-form {
			margin: 1.25rem 0 0;
			position: relative;
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