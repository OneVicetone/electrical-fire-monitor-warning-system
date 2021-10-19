<template>
	<div class="alarm-center-container">
		<div class="alarm-count">
			<img src="@/assets/icons/alarm-count.png" alt="alarm-coun" />
			<NumCount
				v-for="item of alarmCountData"
				:key="item.title"
				:title="item.title"
				:num="item.num"
				:icon="item.icon"
				:itemKey="item.key"
				:afterHasDivider="item.afterHasDivider"
				@itemClick="searchByType(item.key)"
			/>
		</div>
		<a-form-model class="table-search-form" layout="inline" :model="searchForm">
			<a-form-model-item>
				<a-cascader
					:options="unitTree"
					change-on-select
					v-model="searchForm.unit"
					:fieldNames="{ label: 'title', value: 'key', children: 'children' }"
					placeholder="请选择单位"
				/>
			</a-form-model-item>
			<a-form-model-item>
				<a-input v-model="searchForm.deviceSnName" placeholder="请输入设备编码/名称" />
			</a-form-model-item>
			<a-form-model-item>
				<a-select v-model="searchForm.alarmType" :options="alarmTypeOptions" />
			</a-form-model-item>
			<a-form-model-item>
				<a-select v-model="searchForm.alarmLevel" :options="alarmLevelOptions" />
			</a-form-model-item>
			<a-form-model-item>
				<a-select v-model="searchForm.deviceTypeId" :options="deviceIdOptions" />
			</a-form-model-item>
			<a-form-model-item>
				<a-select v-model="searchForm.status" :options="handleStatusOptions" />
			</a-form-model-item>
			<a-form-model-item>
				<a-range-picker
					:defaultValue="[searchForm.startDate, searchForm.endDate]"
					format="YYYY-MM-DD"
					@change="getTimePickerDate"
					style="width: 25rem"
				/>
			</a-form-model-item>
			<a-form-model-item>
				<a-button type="primary" @click="search">搜索</a-button>
			</a-form-model-item>
			<a-form-model-item>
				<a-button type="primary" @click="exportData">导出</a-button>
			</a-form-model-item>
		</a-form-model>

		<a-table :columns="columns" :data-source="tableData" :pagination="false">
			<div slot="idx" slot-scope="text, record, index">
				{{ getListIdx(paginationData, index) }}
			</div>

			<div slot="alarmValue" slot-scope="text">
				{{ text.alarmValue ? text.alarmValue + text.unit : "-" }}
			</div>
			<div slot="alarmTime" slot-scope="text">
				{{ text.alarmTime | filterTimeToYYYYMMDD }}
			</div>
			<div slot="recoverTime" slot-scope="text">
				{{ text.recoverTime | filterTimeToYYYYMMDD }}
			</div>
			<div slot="alarmLevel" slot-scope="text">
				{{ text.alarmLevel | filterAlarmLevel }}
			</div>
			<div slot="alarmTypeName" slot-scope="text" :style="{ color: computeColor(text.alarmLevel) }">
				{{ text.alarmTypeName }}
			</div>
			<div slot="status" slot-scope="text">
				{{ text.status | filterAlarmStatus }}
			</div>

			<div slot="operate" slot-scope="text, record">
				<a v-if="record.status === 1" @click="toOperat(record, 'process')">处理</a>
				<a v-else @click="toOperat(record, 'examine')">查看</a>
			</div>
		</a-table>

		<Pagination
			:paginationData="paginationData"
			:changePageHandle="changePageHandle"
			:changePageSizeHandle="changePageSizeHandle"
		/>
		<DealWithDialog
			v-model="showAlert"
			:able="isAble"
			:opinions="remarks"
			:alarmData="alarmHandleData"
			:handAlarmList="handAlarm"
			@on-sure="dialogSure"
			@refresh-alarm-list="search"
		>
		</DealWithDialog>
	</div>
</template>

<script>
import { cloneDeep } from "lodash"
import { message as msg } from "ant-design-vue"

import Pagination from "components/Pagination.vue"
import NumCount from "components/NumCount.vue"
import DealWithDialog from "components/businessComp/DealWithDialog.vue"

import apis from "apis"
import allOptionsData from "utils/optionsData"
import { commonMixin, tableListMixin } from "mixins"

import dangerIcon from "@/assets/icons/danger-icon.png"
import warnIcon from "@/assets/icons/warn-icon.png"

const { getGroupTree, getAlarmCount, getAlarmList, getAlarmDetail, processAlarm, realTimeData, exportAlarmListData } =
	apis
const { alarmLevelOptions, handleStatusOptions } = allOptionsData
const searchFromInitial = {
	unit: [],
	deviceSnName: "",
	alarmType: "",
	alarmLevel: "",
	deviceTypeId: "",
	status: "",
	startDate: "",
	endDate: "",
	module: "",
}

export default {
	name: "AlarmCenter",
	mixins: [commonMixin, tableListMixin],
	components: { Pagination, NumCount, DealWithDialog },
	data() {
		return {
			unitTree: [],
			alarmCountData: [
				{ title: "全部预警", num: "-", key: "total" },
				{ title: "高危", num: "-", icon: dangerIcon, key: "highRiskNum" },
				{ title: "预警", num: "-", icon: warnIcon, key: "warningNum" },
				{ title: "设备故障", num: "-", key: "faultNum" },
				{ title: "未处理", num: "-", key: "unTreatedNum" },
				{ title: "今日新增", num: "-", key: "todayAddNum" },
				{ title: "累计处理", num: "-", afterHasDivider: false, key: "addUpNum" },
			],
			showAlert: false,
			searchForm: cloneDeep(searchFromInitial),
			alarmTypeOptions: [],
			alarmLevelOptions,
			deviceIdOptions: [],
			handleStatusOptions,
			columns: [
				{ title: "序号", scopedSlots: { customRender: "idx" } },
				{ title: "设备ID", dataIndex: "deviceSn" },
				{ title: "所属单位", dataIndex: "groupName" },
				{ title: "设备名称", dataIndex: "deviceAlias" },
				{ title: "设备类型", dataIndex: "deviceTypeName" },
				{ title: "设备型号", dataIndex: "deviceTypeModel" },
				{ title: "报警级别", scopedSlots: { customRender: "alarmLevel" } },
				{ title: "报警类型", scopedSlots: { customRender: "alarmTypeName" } },
				{ title: "报警详情", scopedSlots: { customRender: "alarmValue" } },
				{ title: "报警时间", scopedSlots: { customRender: "alarmTime" } },
				{ title: "报警恢复时间", scopedSlots: { customRender: "recoverTime" } },
				{ title: "报警位置", dataIndex: "address" },
				{ title: "处理状态", scopedSlots: { customRender: "status" } },
				{ title: "处理人", dataIndex: "processUserName" },
				{ title: "操作", dataIndex: "", scopedSlots: { customRender: "operate" } },
			],
			tableData: [],
			paginationData: {
				total: 0,
				current: 1,
				size: 10,
			},
			isAble: false,
			alarmHandleData: {},
			handAlarm: {},
		}
	},
	computed: {
		remarks() {
			const {
				alarmTypeOptions,
				searchForm: { alarmType },
			} = this
			const findRes = alarmTypeOptions.find(({ value }) => value === alarmType)
			return findRes?.remark
		},
	},
	mounted() {
		this.setSearchFormByQuery()
		const optionsTypes = ["alarmType"]
		const { getOptionsListPromiseArr, getTableData, getDeviceId, searchUnitTree } = this
		Promise.allSettled([
			getAlarmCount().then(({ data }) => {
				this.alarmCountData.forEach(i => (i.num = data[i.key]))
			}),
			getTableData(),
			getDeviceId(),
			searchUnitTree(),
			...getOptionsListPromiseArr(optionsTypes),
		])
	},
	methods: {
		searchUnitTree() {
			getGroupTree().then(({ data }) => {
				this.unitTree = data
			})
		},
		getTableData(current = 1, size = 10) {
			const params = {
				current,
				size,
				...this.searchForm,
				groupId: this.searchForm.unit[this.searchForm.unit.length - 1],
			}
			return getAlarmList(params).then(({ data: { records, total, current, size } }) => {
				this.tableData = records
				this.paginationData = {
					...this.paginationData,
					total,
					current,
					size,
				}
			})
		},
		changePageHandle(page, pageSize) {
			this.getTableData(page, pageSize)
		},
		changePageSizeHandle(current, size) {
			this.getTableData(current, size)
		},
		async toOperat(item, type) {
			const { deviceId, id, alarmTime, createTime } = item
			this.isAble = type === "process"
			const { data: alarmDetail } = await getAlarmDetail(id)
			this.alarmHandleData = alarmDetail
			const { data: { channelDataMap: tableList } } = await realTimeData({ deviceId })
			this.handAlarm = tableList || {}
			this.showAlert = true
		},
		async dialogSure(params) {
			const result = await processAlarm(params)
			this.getTableData()
			this.showAlert = false
		},
		getTimePickerDate(_, dateStr) {
			const [startDate, endDate] = dateStr
			this.searchForm.startDate = startDate
			this.searchForm.endDate = endDate
		},
		exportData() {
			const params = {
				...this.searchForm,
				...this.paginationData,
			}
			exportAlarmListData(params).then(() => msg.success("正在导出...可在右上角-个人中心-下载中心页面查看"))
		},
		searchByType(type) {
			this.searchForm = cloneDeep(searchFromInitial)
			if (type === "highRiskNum") {
				this.searchForm.status = 1
				this.searchForm.alarmLevel = 2
				this.searchForm.module = 2
			} else if (type === "warningNum") {
				this.searchForm.status = 1
				this.searchForm.alarmLevel = 1
				this.searchForm.module = 1
			} else if (type === "faultNum") {
				this.searchForm.status = 1
				this.searchForm.alarmType = 8
				this.searchForm.module = 3
			} else if (type === "unTreatedNum") {
				this.searchForm.status = 1
				this.searchForm.module = 4
			} else if (type === "todayAddNum") {
				this.searchForm.module = 5
			} else if (type === "addUpNum") {
				this.searchForm.status = 3
				this.searchForm.module = 6
			}
			type && this.search()
		},
		computeColor(value) {
			const color = { 1: "#FCBE0B", 2: "#FB5E4F" }
			return color[value] || "#dcdcdc"
		},
	},
}
</script>

<style lang='less' scoped>
@import url("styles/common.less");

.alarm-center-container {
	.pages-container-no-child-layout();
	padding-right: 1.83rem;
	padding-left: 1.83rem;
	overflow-y: auto;
	.alarm-count {
		display: flex;
		align-items: center;
		border: 1px solid #3f4a77;
		border-radius: 4px;
		padding: 1rem 1.83rem;
		margin: 3.67rem 0 0;
		> img {
			width: 3.67rem;
			height: 3.67rem;
		}
	}
}
</style>