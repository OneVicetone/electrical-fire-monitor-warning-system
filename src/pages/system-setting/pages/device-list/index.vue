<template>
	<div class="device-list-container">
		<div class="organization">
			<OrganizationList :treeData="treeData" @handleSelectFunc="handleSelectTreeNode" />
		</div>
		<div class="device-list-content">
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
						placeholder="请选择设备型号"
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
					<a-button type="primary" size="small" @click="add"><a-icon type="plus" />新增设备</a-button>
					<a-popover trigger="click" placement="bottomRight">
						<a-list slot="content" size="small" :data-source="batchOperationOptions">
							<a-list-item slot="renderItem" slot-scope="item" @click="item.operate.call($router)">
								{{ item.name }}
							</a-list-item>
						</a-list>
						<a-button type="primary" size="small">批量操作<a-icon type="down" /></a-button>
					</a-popover>
					<a-button type="primary" size="small" @click="exportData">导出</a-button>
				</div>
			</a-form-model>

			<a-table :columns="columns" :data-source="tableData" :pagination="false">
				<div slot="idx" slot-scope="text, record, index">
					{{ getListIdx(paginationData, index) }}
				</div>

				<div slot="deliverGoodsTime" slot-scope="text">
					{{ text.deliverGoodsTime | filterTimeToYYYYMMDDHHmmss }}
				</div>
				<div slot="beginDate" slot-scope="text">
					{{ text.beginDate | filterTimeToYYYYMMDD }}
				</div>
				<div slot="endDate" slot-scope="text">
					{{ text.endDate | filterTimeToYYYYMMDD }}
				</div>
				<div slot="updateTime" slot-scope="text">
					{{ text.updateTime | filterTimeToYYYYMMDDHHmmss }}
				</div>
				<div slot="operate" slot-scope="text">
					<a @click="editCell(text)">编辑</a>
					<a-divider type="vertical" />
					<a>监控</a>
					<a-divider type="vertical" />
					<a>更换</a>
				</div>
			</a-table>

			<Pagination
				:paginationData="paginationData"
				:changePageHandle="changePageHandle"
				:changePageSizeHandle="changePageSizeHandle"
			/>
		</div>
		<NewAddUnits
			v-model="isShowDialog"
			:treeData="treeData"
			:eventType="eventType"
			:formCell="formCell"
			@on-fresh-data="getTableData"
		></NewAddUnits>
	</div>
</template>

<script>
import { cloneDeep } from "lodash"

import OrganizationList from "components/OrganizationList.vue"
import Pagination from "components/Pagination.vue"
import NewAddUnits from "./NewAddUnits.vue"

import apis from "apis"
import { commonMixin, tableListMixin } from "mixins"

const { getDeviceListForSystemSettiing, getGroupTree, exportDeviceList } = apis
const searchFromInitial = {
	deviceTypeId: "",
	deviceModelId: "",
	sn: "",
	principalUserName: "",
}

export default {
	name: "DeviceList",
	mixins: [commonMixin, tableListMixin],
	components: { OrganizationList, Pagination, NewAddUnits },
	data() {
		return {
			parentId: null,
			searchForm: cloneDeep(searchFromInitial),
			deviceTypeOptions: [],
			batchOperationOptions: [],
			deviceIdOptions: [],
			columns: [
				{ title: "序号", scopedSlots: { customRender: "idx" } },
				{ title: "设备ID", dataIndex: "sn" },
				{ title: "所属单位", dataIndex: "groupName" },
				{ title: "设备类型", dataIndex: "deviceTypeModel" },
				{ title: "设备型号", dataIndex: "id" },
				{ title: "ICCID", dataIndex: "iccid" },
				{ title: "设备状态", dataIndex: "showStatus" },
				{ title: "安装位置", dataIndex: "installPosition" },
				{ title: "发货时间", scopedSlots: { customRender: "deliverGoodsTime" } },
				{ title: "服务期起", scopedSlots: { customRender: "beginDate" } },
				{ title: "服务期止", scopedSlots: { customRender: "endDate" } },
				{ title: "修改时间", scopedSlots: { customRender: "updateTime" } },
				{ title: "修改时间", dataIndex: "", key: "", scopedSlots: { customRender: "operate" } },
			],
			tableData: [],
			paginationData: {
				total: 0,
				current: 1,
				size: 10,
			},
			treeData: [],
			isShowDialog: false,
			formCell: {},
			// buttonType: '',
			eventType: "",
		}
	},
	watch: {
		"searchForm.deviceTypeId": {
			deep: true,
			handler(val) {
				this.getDeviceId(val)
			},
		},
	},
	mounted() {
		const optionsTypes = ["deviceType"]
		const { getGroupTreeData, getTableData, getOptionsListPromiseArr, getDeviceId } = this
		Promise.allSettled([getGroupTreeData(), getTableData(), ...getOptionsListPromiseArr(optionsTypes), getDeviceId()])
	},
	methods: {
		getTableData(current = 1, size = 10) {
			const params = {
				current,
				size,
				...(this.parentId && { parentId: this.parentId }),
				...this.searchForm,
			}
			getDeviceListForSystemSettiing(params).then(({ data: { records, total, current, size } }) => {
				this.tableData = records
				this.paginationData = {
					...this.paginationData,
					total,
					current,
					size,
				}
			})
		},
		getGroupTreeData() {
			getGroupTree().then(({ data }) => {
				this.treeData = data
			})
		},
		add() {
			this.eventType = "新增设备"
			this.isShowDialog = true
		},
		delete(id) {},
		editCell(text) {
			console.log(text)
			this.eventType = "编辑设备"
			this.formCell = text
			this.isShowDialog = true
		},
		search() {
			const {
				paginationData: { current, size },
			} = this
			this.getTableData(current, size)
		},
		exportDeviceList() {},
		changePageHandle(page, pageSize) {
			this.getTableData(page, pageSize)
		},
		changePageSizeHandle(current, size) {
			this.getTableData(current, size)
		},
		handleSelectTreeNode(key) {
			this.parentId = key
			this.search()
		},
		exportData() {
			const params = {
				...this.searchForm,
				...(this.deviceStatusRadio !== "0" && { status: this.deviceStatusRadio }),
			}
			exportDeviceList(params).then(() => msg.success("正在导出...可在右上角-个人中心-下载中心页面查看"))
		},
		reset() {
			this.searchForm = cloneDeep(searchFromInitial)
			this.search()
		},
		
	},
}
</script>

<style lang="less" scoped>
@import url("styles/common");

.device-list-container {
	.pages-container-has-child-layout();
	display: flex;
	padding: 0;
	margin: -30px 0 0;
	// overflow: hidden;
	.organization {
		width: 21.67rem;
		padding: 0 1.5rem;
		flex: 0 0 auto;
		border-right: 1px solid #3f4a77;
		overflow: hidden;
		text-overflow: ellipsis;
		// position: relative;
		// top: calc(20px);
	}
	.device-list-content {
		width: 100%;
		padding: 2rem 1.58rem 0;
		.table-search-form {
			position: relative;
		}
	}
}
</style>