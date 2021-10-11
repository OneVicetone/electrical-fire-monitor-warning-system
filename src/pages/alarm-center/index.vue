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
				:afterHasDivider="item.afterHasDivider"
			/>
		</div>
		<a-form-model class="table-search-form" layout="inline" :model="searchForm">
			<a-form-model-item>
				<a-select v-model="searchForm.unit" :options="groupTypeOptions" placeholder="请选择单位" size="small" />
			</a-form-model-item>
			<a-form-model-item>
				<a-input v-model="searchForm.deviceName" placeholder="请输入设备编码/名称" size="small" />
			</a-form-model-item>
			<a-form-model-item>
				<a-select
					v-model="searchForm.alarmType"
					:options="alarmTypeOptions"
					size="small"
				/>
			</a-form-model-item>
			<a-form-model-item>
				<a-select
					v-model="searchForm.alarmLevel"
					:options="alarmLevelOptions"
					size="small"
				/>
			</a-form-model-item>
			<a-form-model-item>
				<a-select
					v-model="searchForm.deviceTypeId"
					:options="deviceIdOptions"
					size="small"
				/>
			</a-form-model-item>
			<a-form-model-item>
				<a-select
					v-model="searchForm.status"
					:options="handleStatusOptions"
					size="small"
				/>
			</a-form-model-item>
			<a-form-model-item>
				<a-range-picker size="small" format="YYYY-MM-DD" @change="getTimePickerDate" />
			</a-form-model-item>
			<a-form-model-item>
				<a-button type="primary" size="small" @click="search">搜索</a-button>
			</a-form-model-item>
			<a-form-model-item>
				<a-button type="primary" size="small">导出</a-button>
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
import Pagination from "components/Pagination.vue"
import NumCount from "components/NumCount.vue"
import DealWithDialog from "components/businessComp/DealWithDialog.vue"


import apis from "apis"
import allOptionsData from "utils/optionsData"
import { commonMixin, tableListMixin } from "mixins"

const { getAlarmCount, getAlarmList, getAlarmDetail, processAlarm, realTimeData } = apis
const { alarmLevelOptions, handleStatusOptions } = allOptionsData

export default {
	name: "AlarmCenter",
	mixins: [commonMixin, tableListMixin],
	components: { Pagination, NumCount, DealWithDialog },
	data() {
		return {
			alarmCountData: [
				{ title: "全部预警", num: "-", key: "total" },
				{ title: "高危", num: "-", icon: "/src/assets/icons/danger-icon.png", key: "highRiskNum" },
				{ title: "预警", num: "-", icon: "/src/assets/icons/warn-icon.png", key: "warningNum" },
				{ title: "设备故障", num: "-", key: "faultNum" },
				{ title: "未处理", num: "-", key: "unTreatedNum" },
				{ title: "今日新增", num: "-", key: "todayAddNum" },
				{ title: "累计处理", num: "-", afterHasDivider: false, key: "addUpNum" },
			],
			showAlert: false,
			searchForm: {
				unit: "",
				deviceSnName: "",
				alarmType: "",
				alarmLevel: "",
				deviceTypeId: "",
				status: "",
				startDate: "",
				endDate: "",
			},
			groupTypeOptions: [],
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
				{ title: "报警类型", dataIndex: "alarmTypeName" },
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
		const optionsTypes = ["alarmType", "groupType"]
		const { getOptionsListPromiseArr, getTableData, getDeviceId } = this
		Promise.allSettled([
			getAlarmCount().then(({ data }) => {
				this.alarmCountData.forEach(i => (i.num = data[i.key]))
			}),
			getTableData(),
			getDeviceId(),
			...getOptionsListPromiseArr(optionsTypes),
		])
	},
	methods: {
		getTableData(current = 1, size = 10) {
			const params = {
				current,
				size,
				...this.searchForm,
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
			const { data: tableList } = await realTimeData({ deviceId })
			this.handAlarm = tableList || {}
			this.showAlert = true
		},
		async dialogSure(params) {
			const result = await processAlarm(params)
			console.log("确定", result)
			this.getTableData()
			this.showAlert = false
		},
		getTimePickerDate(_, dateStr) {
			const [startDate, endDate] = dateStr
			this.searchForm.startDate = startDate
			this.searchForm.endDate = endDate
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