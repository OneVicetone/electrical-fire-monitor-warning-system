<template>
	<div class="alarm-center-container">
		<div class="alarm-count"></div>
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

		<Dialog v-model="isShowHandle" title="报警处理">
			<div class="alarm-handle-container"></div>
		</Dialog>
	</div>
</template>

<script>
import Dialog from "components/Dialog.vue"

export default {
	name: "AlarmCenter",
	components: { Dialog },
	data() {
		return {
			isShowHandle: false,
			searchForm: {
				unit: '',
                deviceName: '',
                alarmType: '',
                alarmLevel: '',
                deviceId: '',
                handleStatus: '',
                alarmTime: ''
			},
			unitOptions: [],
			alarmTypeOptions: [
				{ label: "漏电报警", value: "1" },
				{ label: "过流报警", value: "2" },
				{ label: "过压报警", value: "3" },
				{ label: "欠压报警", value: "4" },
				{ label: "断电报警", value: "4" },
				{ label: "过温报警", value: "5" },
				{ label: "离线报警", value: "6" },
				{ label: "缺相报警", value: "7" },
			],
			alarmLevelOptions: [
				{ label: "高危", value: "1" },
				{ label: "预警", value: "2" },
				{ label: "正常", value: "3" },
			],
			deviceIdOptions: [
				{ label: "BY-001", value: "1" },
				{ label: "BY-002", value: "2" },
				{ label: "BY-003", value: "3" },
			],
			handleStatusOptions: [
				{ label: "待处理", value: "1" },
				{ label: "已处理", value: "2" },
				{ label: "已恢复", value: "3" },
			],
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
		}
	},
}
</script>

<style lang='less' scoped>
@import url("styles/common.less");

.alarm-center-container {
    .pages-container-no-child-layout();
    padding-right: 1.83rem;
    padding-left: 1.83rem;
}
</style>