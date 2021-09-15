<template>
	<div class="alarm-center-container">
		<div class="alarm-count">
			<img src="assets/icons/alarm-count.png" alt="alarm-coun">
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
				<a-select v-model="searchForm.deviceId" :options="deviceIdOptions" placeholder="请选择设备编号" size="small" />
			</a-form-model-item>
			<a-form-model-item>
				<a-select
					v-model="searchForm.handleStatus"
					:options="handleStatusOptions"
					placeholder="请选择报警处理状态"
					size="small"
				/>
			</a-form-model-item>
			<a-form-model-item>
				<a-date-picker v-model="searchForm.alarmTime" placeholder="请选择报警时间" size="small" />
			</a-form-model-item>
			<a-form-model-item>
				<a-button type="primary" size="small">搜索</a-button>
			</a-form-model-item>
			<a-form-model-item>
				<a-button type="primary" size="small" @click="add"><a-icon type="plus" />导出</a-button>
			</a-form-model-item>
		</a-form-model>

		<a-table :columns="columns" :data-source="tabelData">
			<div slot="operate">
				<a>查看</a>
			</div>
		</a-table>

		<Pagination
			:paginationData="paginationData"
			:changePageHandle="changePageHandle"
			:changePageSizeHandle="changePageSizeHandle"
		/>

		<Dialog v-model="isShowHandle" title="报警处理">
			<div class="alarm-handle-container"></div>
		</Dialog>
	</div>
</template>

<script>
import Dialog from "components/Dialog.vue"
import Pagination from "components/Pagination.vue"
import NumCount from "components/NumCount.vue"
import optionsData from "utils/optionsData"

const { alarmTypeOptions, alarmLevelOptions, deviceIdOptions, handleStatusOptions } = optionsData

export default {
	name: "AlarmCenter",
	components: { Dialog, Pagination, NumCount },
	data() {
		return {
			alarmCountData: [
				{ title: "全部预警", num: "1013" },
				{ title: "高危", num: "96", icon: "/src/assets/icons/danger-icon.png" },
				{ title: "预警", num: "84", icon: "/src/assets/icons/warn-icon.png" },
				{ title: "设备故障", num: "365" },
				{ title: "未处理", num: "515" },
				{ title: "今日新增", num: "5" },
				{ title: "累计处理", num: "148", afterHasDivider: false },
			],
			isShowHandle: false,
			searchForm: {
				unit: "",
				deviceName: "",
				alarmType: "0",
				alarmLevel: "0",
				deviceId: "0",
				handleStatus: "0",
				alarmTime: "",
			},
			unitOptions: [],
			alarmTypeOptions,
			alarmLevelOptions,
			deviceIdOptions,
			handleStatusOptions,
			columns: [
				{ title: "序号", dataIndex: "", key: "" },
				{ title: "设备ID", dataIndex: "", key: "" },
				{ title: "所属单位", dataIndex: "", key: "" },
				{ title: "设备名称", dataIndex: "", key: "" },
				{ title: "设备类型", dataIndex: "", key: "" },
				{ title: "设备型号", dataIndex: "", key: "" },
				{ title: "报警级别", dataIndex: "", key: "" },
				{ title: "报警类型", dataIndex: "", key: "" },
				{ title: "报警详情", dataIndex: "", key: "" },
				{ title: "报警时间", dataIndex: "", key: "" },
				{ title: "报警恢复时间", dataIndex: "", key: "" },
				{ title: "报警位置", dataIndex: "", key: "" },
				{ title: "处理状态", dataIndex: "", key: "" },
				{ title: "处理人", dataIndex: "", key: "" },
				{ title: "操作", dataIndex: "", key: "", scopedSlots: { customRender: "operate" } },
			],
			tableData: [],
			paginationData: {
				count: 0,
				current: 1,
				pageSize: 10,
			},
		}
	},
	methods: {
		getTableData(current = 1, size = 10) {},
		changePageHandle(page, pageSize) {
			this.getTableData(page, pageSize)
		},
		changePageSizeHandle(current, size) {
			this.getTableData(current, size)
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