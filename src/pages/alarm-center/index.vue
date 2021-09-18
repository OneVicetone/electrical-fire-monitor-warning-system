<template>
	<div class="alarm-center-container">
		<div class="alarm-count">
			<img src="assets/icons/alarm-count.png" alt="alarm-coun" />
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
				<a-select v-model="searchForm.unit" :options="unitOptions" placeholder="请选择单位" size="small" />
			</a-form-model-item>
			<a-form-model-item>
				<a-input v-model="searchForm.deviceName" placeholder="请输入设备编码/名称" size="small" />
			</a-form-model-item>
			<a-form-model-item>
				<a-select
					v-model="searchForm.alarmType"
					:options="alarmTypeOptions"
					placeholder="请选择报警类型"
					size="small"
				/>
			</a-form-model-item>
			<a-form-model-item>
				<a-select
					v-model="searchForm.alarmLevel"
					:options="alarmLevelOptions"
					placeholder="请选择报警级别"
					size="small"
				/>
			</a-form-model-item>
			<a-form-model-item>
				<a-select
					v-model="searchForm.deviceTypeId"
					:options="deviceIdOptions"
					placeholder="请选择设备编号"
					size="small"
				/>
			</a-form-model-item>
			<a-form-model-item>
				<a-select
					v-model="searchForm.status"
					:options="handleStatusOptions"
					placeholder="请选择报警处理状态"
					size="small"
				/>
			</a-form-model-item>
			<a-form-model-item>
				<!-- <a-range-picker v-model="searchForm.alarmTime" size="small" format="YYYY-MM-DD" /> -->
			</a-form-model-item>
			<a-form-model-item>
				<a-button type="primary" size="small" @click="showAlert = true">搜索</a-button>
			</a-form-model-item>
			<a-form-model-item>
				<a-button type="primary" size="small"><a-icon type="plus" />导出</a-button>
			</a-form-model-item>
		</a-form-model>

		<a-table :columns="columns" :data-source="tableData" :pagination="false">
			<div slot="idx" slot-scope="text, record, index">
				{{ index + 1 }}
			</div>

			<div slot="alarmTypeName" slot-scope="text, record"></div>
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
				<a
					v-if="record.status === 1"
					@click="
						showAlert = true
						toProcess(record)
					"
					>处理</a
				>
				<a
					v-else
					@click="
						showAlert = true
						toExamine(record)
					"
					>查看</a
				>
			</div>
		</a-table>

		<Pagination
			:paginationData="paginationData"
			:changePageHandle="changePageHandle"
			:changePageSizeHandle="changePageSizeHandle"
		/>
		<Deal-with-dialog v-model="showAlert"></Deal-with-dialog>
	</div>
</template>

<script>
import moment from "moment"
import Pagination from "components/Pagination.vue"
import NumCount from "components/NumCount.vue"
import DealWithDialog from "./components/DealWithDialog.vue"
import optionsData from "utils/optionsData"

import apis from "apis"
import { commonMinix } from "minixs"

const { getAlarmCount, getAlarmList, getSelectOptions, getAlarmDetail, processAlarm } = apis
const { alarmTypeOptions, alarmLevelOptions, deviceIdOptions, handleStatusOptions } = optionsData

export default {
	name: "AlarmCenter",
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
				alarmType: 0,
				alarmLevel: 0,
				deviceTypeId: 0,
				status: 0,
				alarmTime: [moment(), moment()],
			},
			unitOptions: [],
			alarmTypeOptions,
			alarmLevelOptions,
			deviceIdOptions,
			handleStatusOptions,
			columns: [
				{ title: "序号", scopedSlots: { customRender: "idx" } },
				{ title: "设备ID", dataIndex: "deviceSn" },
				{ title: "所属单位", dataIndex: "groupName" },
				{ title: "设备名称", dataIndex: "deviceAlias" },
				{ title: "设备类型", dataIndex: "deviceTypeName" },
				{ title: "设备型号", dataIndex: "deviceTypeModel" },
				{ title: "报警级别", dataIndex: "alarmLevel", scopedSlots: { customRender: "alarmLevel" } },
				{ title: "报警类型", dataIndex: "alarmTypeName", scopedSlots: { customRender: "alarmTypeName" } },
				{ title: "报警详情", dataIndex: "alarmValue" },
				{ title: "报警时间", dataIndex: "alarmTime", scopedSlots: { customRender: "alarmTime" } },
				{ title: "报警恢复时间", dataIndex: "recoverTime", scopedSlots: { customRender: "recoverTime" } },
				{ title: "报警位置", dataIndex: "address" },
				{ title: "处理状态", dataIndex: "status", scopedSlots: { customRender: "status" } },
				{ title: "处理人", dataIndex: "processUserName" },
				{ title: "操作", dataIndex: "", scopedSlots: { customRender: "operate" } },
			],
			tableData: [],
			paginationData: {
				total: 0,
				current: 1,
				size: 10,
			},
		}
	},
	mounted() {
		const optionsTypes = ["alarmType", "deviceType", "alarmType"]
		Promise.allSettled([
			getAlarmCount().then(res => {
				const { data } = res
				this.alarmCountData.forEach(i => (i.num = data[i.key]))
			}),
			this.getTableData(),
			// ...optionsTypes.map(i => getSelectOptions(i).then(ren => {
			// 	const
			// }))
		])
	},
	methods: {
		getTableData(current = 1, size = 10) {
			const params = {
				current,
				size,
				...this.searchForm,
			}
			return getAlarmList(params).then(res => {
				const {
					data: { records, total, current, size },
				} = res
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
		toProcess(record) {
			console.log(record)
		},
		toExamine(record) {
			console.log(record)
		},
	},
	watch: {
		searchForm: {
			handler(val) {
				console.log(val)
			},
			deep: true,
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