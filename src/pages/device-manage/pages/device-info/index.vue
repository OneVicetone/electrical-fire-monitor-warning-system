<template>
	<div class="device-info-container">
		<Breadcrumb :historyList="historyList" />
		<div class="device-data">
			<div class="device-info-left">
				<div class="device">
					<div class="info">
						<div class="device-img"></div>
						<div class="info-text">
							<p class="device-type">{{ deviceInfoObj.alias | filterNull }}</p>
							<p class="device-id">
								<span>{{ deviceInfoObj.sn | filterNull }}</span>
								<i :class="`dot-${deviceInfoObj.showStatus}`">{{ deviceInfoObj.showStatus | filterDeviceStatus }}</i>
							</p>
							<p class="device-address">
								<img src="@/assets/icons/company.png" alt="" />
								<span>{{ deviceInfoObj.groupName | filterNull }}</span>
								<span>{{ deviceInfoObj.installPosition | filterNull }}</span>
							</p>
						</div>
					</div>
					<div class="operate">
						<div @click="sendCommand">
							<img src="@/assets/icons/send-command.png" alt="" />
							<span>发送指令</span>
						</div>
						<div @click="previewSetupPhoto">
							<img src="@/assets/icons/setup-photo.png" alt="" />
							<span>安装照片</span>
						</div>
					</div>
				</div>
				<div class="device-status">
					<ContentTitle title="设备实时状态" />
					<SimpleTable :columns="simpleTableColumns" :tableData="simpleTableData" />
				</div>
				<div class="device-detailed-info">
					<ContentTitle title="设备详细信息" />
					<LabelAndValue
						:labels="deviceDetailedLabel"
						:values="deviceInfoObj"
						:picList="installImg"
						@on-get-pic="getDeviceInfoDetail"
						@delete-img-source="delImgSource"
						@add-img-source="addImgSource"
					/>
				</div>
			</div>
			<div class="device-info-right">
				<div class="history-data-count">
					<img src="@/assets/icons/alarm-count.png" alt="alarm-coun" />
					<NumCount
						v-for="item of historyCountData"
						:key="item.title"
						:title="item.title"
						:num="item.num"
						:icon="item.icon"
						:afterHasDivider="item.afterHasDivider"
					/>
				</div>
				<div class="history-data-chart">
					<ContentTitle :title="historyChartTitle" @changeTitleContent="changeTitleContent" />
					<div class="filter-chart">
						<a-form-model layout="inline" :model="filterForm">
							<a-form-model-item>
								<a-radio-group v-model="filterForm.chartRadioValue">
									<a-radio-button v-for="radio of chartRadioOptions" :key="radio.value" :value="radio.value">
										{{ radio.label }}
									</a-radio-button>
								</a-radio-group>
							</a-form-model-item>
							<a-form-model-item>
								<a-range-picker format="YYYY-MM-DD" @change="getTimePickerDate" />
							</a-form-model-item>
							<a-form-model-item>
								<a-button type="primary" size="small" @click="getChartData">查询</a-button>
							</a-form-model-item>
							<a-form-model-item>
								<a-button type="primary" ghost size="small">导出</a-button>
							</a-form-model-item>
						</a-form-model>
					</div>
					<LineChart :xAxisData="chartXAxisData" :seriesData="nowChartData" showXAxisLabel showXAxisLine />
				</div>
				<div class="history-alarm-log">
					<ContentTitle title="历史报警记录" />
					<a-table :columns="columns" :data-source="tableData" :pagination="false">
						<div slot="idx" slot-scope="text, record, index">
							{{ getListIdx(paginationData, index) }}
						</div>

						<div slot="alarmTypeName" slot-scope="text, record"></div>
						<div slot="alarmTime" slot-scope="text">
							{{ text.alarmTime | filterTimeToYYYYMMDDHHmmss }}
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
				</div>
			</div>
		</div>
		<DeviceDetaiCommandl
			v-model="dialog"
			:defaultValue="deviceDetaiCommandlValue"
			@on-res="allRequest"
		></DeviceDetaiCommandl>
		<DealWithDialog
			v-model="alarmAlert"
			:able="isAble"
			:opinions="remarks"
			:alarmData="alarmHandleData"
			:handAlarmList="handAlarm"
			@on-sure="dialogSure"
			@refresh-alarm-list="allRequest"
		>
		</DealWithDialog>
		<AccordPic v-model="picLog" :havePic="installImg" @on-delete-img="delImgSource" @add-pic="addImgSource">
			<div class="positions">安装位置：{{ deviceInfoObj.installPosition }}</div>
		</AccordPic>
	</div>
</template>

<script>
import moment from "moment"
import { cloneDeep } from "lodash"

import Breadcrumb from "components/Breadcrumb.vue"
import NumCount from "components/NumCount.vue"
import ContentTitle from "components/ContentTitle.vue"
import LabelAndValue from "components/LabelAndValue.vue"
import Pagination from "components/Pagination.vue"
import SimpleTable from "components/SimpleTable.vue"
import LineChart from "components/LineChart.vue"
import DeviceDetaiCommandl from "components/businessComp/DeviceDetaiCommandl.vue"
import DealWithDialog from "components/businessComp/DealWithDialog.vue"
import AccordPic from "components/businessComp/AccordPic.vue"

import apis from "apis"
import { commonMixin, tableListMixin } from "mixins"
import { nameForKey } from "utils/baseData"

const {
	getDeviceInfoDetail,
	getDeviceDetailCount,
	getDeviceDetailHistortAlarmList,
	getDeviceDetailHistoryChartData,
	realTimeData,
	getAlarmDetail,
	processAlarm,
	deletePositionImg,
	addPositionImg,
	getDeviceConfig,
} = apis

export default {
	name: "DeviceInfo",
	mixins: [commonMixin, tableListMixin],
	components: {
		Breadcrumb,
		NumCount,
		ContentTitle,
		LabelAndValue,
		Pagination,
		SimpleTable,
		DeviceDetaiCommandl,
		LineChart,
		DealWithDialog,
		AccordPic,
	},
	props: {
		id: String,
	},
	data() {
		return {
			historyList: ["首页", "设备监控", "设备详情"],
			historyCountData: [
				{ title: "本设备报警次数", num: "-", key: "alarmTotal" },
				{ title: "本设备报警处理次数", num: "-", key: "resolvedNum" },
				{ title: "本设备故障次数", num: "-", key: "faultNum" },
				{ title: "本设备入网天数(天)", num: "-", key: "netDayDiff", afterHasDivider: false },
			],
			filterForm: {
				chartRadioValue: "electricity",
				startDate: moment().subtract(3, "days"),
				endDate: moment(),
			},
			historyChartTitle: [
				{ name: "历史数据走势图", key: "historyData" },
				{ name: "历史用电统计", key: "electricity" },
			],
			chartRadioOptions: [
				{ label: "电流", value: "electricity" },
				{ label: "温度", value: "temp" },
				{ label: "电压", value: "voltage" },
				{ label: "功率", value: "power" },
				{ label: "电能", value: "electricEnergy" },
			],
			columns: [
				{ title: "序号", scopedSlots: { customRender: "idx" } },
				{ title: "报警类型", scopedSlots: { customRender: "alarmTypeName" } },
				{ title: "报警级别", scopedSlots: { customRender: "alarmLevel" } },
				{ title: "报警详情", dataIndex: "alarmValue" },
				{ title: "报警时间", scopedSlots: { customRender: "alarmTime" } },
				{ title: "报警恢复时间", scopedSlots: { customRender: "recoverTime" } },
				{ title: "报警位置", dataIndex: "address" },
				{ title: "处理状态", scopedSlots: { customRender: "status" } },
				{ title: "处理人", dataIndex: "processUserName" },
				{ title: "操作", key: "", scopedSlots: { customRender: "operate" } },
			],
			tableData: [],
			paginationData: {
				total: 0,
				current: 1,
				size: 10,
			},
			dialog: false,
			chartData: {},
			deviceInfoObj: {},
			deviceDetailedLabel: [
				{ label: "安装位置", key: "installPosition" },
				{ label: "SIM 卡号", key: "simPhoneNumber" },
				{ label: "ICCID 号", key: "iccid" },
				{ label: "版本号", key: "version" },
				{ label: "服务到期", key: "" },
				{ label: "报警类型", key: "alarmName" },
				{ label: "信号时间", key: "reportTime" },
				{ label: "信号强度", key: "reportTime" },
				{ label: "上报地址", key: "" },
				{ label: "安全负责人", key: "safetyDirector" },
				{ label: "联系方式", key: "safetyDirectorMobile" },
			],
			simpleTableColumns: [
				{ title: "名称", key: "name" },
				{ title: "1/A", key: "1a" },
				{ title: "2/B", key: "2b" },
				{ title: "3/C", key: "3c" },
				{ title: "4/N", key: "4n" },
			],
			simpleTableData: [
				{ name: "漏电(mA)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
				{ name: "温度(℃)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
				{ name: "电压(V)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
				{ name: "电流(A)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
				{ name: "功率(W)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
				{ name: "电量(度)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
			],
			alarmAlert: false,
			isAble: false,
			alarmHandleData: {},
			handAlarm: {},
			picLog: false,
			deviceDetaiCommandlValue: {},
		}
	},
	computed: {
		nowChartData() {
			const {
				chartData,
				filterForm: { chartRadioValue },
			} = this
			return chartData[chartRadioValue] ? Object.values(chartData[chartRadioValue]).map(i => i) : []
		},
		chartXAxisData() {
			const { startDate, endDate } = this.filterForm
			const xAxisLength = 7
			const startTime = startDate.startOf("day")
			const endTime = endDate.endOf("day")
			const startTimestamp = startTime.valueOf()
			const xAxis = [startTime.format("MM-DD HH:mm")]
			const timestampDiff = endTime.valueOf() - startTimestamp
			const interval = timestampDiff / (xAxisLength - 2)
			for (let i = 1; i < xAxisLength - 1; i++) {
				xAxis.push(moment(startTimestamp + interval * i).format("MM-DD HH:mm"))
			}
			xAxis.push(endTime.format("MM-DD HH:mm"))
			return xAxis
		},
		installImg() {
			console.log(this.deviceInfoObj)
			const keys = Object.keys(this.deviceInfoObj)
			return (
				(keys.length && this.deviceInfoObj.installPositionImg && this.deviceInfoObj.installPositionImg.split(",")) || []
			)
		},
		remarks() {
			const str = this.alarmHandleData.processBOList && this.alarmHandleData.processBOList[0]
			return str && str.remark
		},
	},
	mounted() {
		this.allRequest()
	},
	methods: {
		allRequest() {
			const { getDeviceInfoDetail, getDeviceCount, getTableData, getChartData, getDeviceStatusTableData } = this
			Promise.allSettled([
				getDeviceInfoDetail(),
				getDeviceCount(),
				getTableData(),
				getChartData(),
				getDeviceStatusTableData(),
			])
		},
		async sendCommand() {
			const res = await getDeviceConfig(this.id)
			console.log(res)
			this.deviceDetaiCommandlValue = res.data || {}
			this.dialog = true
		},
		getDeviceInfoDetail() {
			return getDeviceInfoDetail(this.id).then(({ data }) => {
				this.deviceInfoObj = {
					...data,
					...data.deviceStatusBO,
					...data.deviceConfigEntity,
					reportTime: data.deviceStatusBO ? moment(data.deviceStatusBO).format("YYYY-MM-DD HH:mm") : "",
				}
			})
		},
		getDeviceCount() {
			return getDeviceDetailCount(this.id).then(({ data }) => {
				const historyCountDataClone = cloneDeep(this.historyCountData)
				historyCountDataClone.forEach(i => {
					i.num = data[i.key] || "-"
				})
				this.historyCountData = historyCountDataClone
			})
		},
		previewSetupPhoto() {
			this.picLog = true
		},
		getTableData(current = 1, size = 10) {
			const params = {
				current,
				size,
				deviceId: this.id,
			}
			return getDeviceDetailHistortAlarmList(params).then(({ data: { records, total, current, size } }) => {
				this.tableData = records
				this.paginationData = {
					...this.paginationData,
					total,
					current,
					size,
				}
			})
		},
		getChartData(type = "historyData") {
			const {
				id,
				filterForm: { startDate, endDate },
			} = this
			const params = {
				deviceId: id,
				startDate: startDate.format("YYYY-MM-DD"),
				endDate: endDate.format("YYYY-MM-DD"),
			}
			return getDeviceDetailHistoryChartData(params).then(({ data }) => {
				this.chartData = data
			})
		},
		async toOperat(data, type) {
			const { deviceId, id, alarmTime, createTime } = data
			this.isAble = type === "process"
			const { data: alarmDetail } = await getAlarmDetail(id)
			this.alarmHandleData = alarmDetail
			const { data: tableList } = await realTimeData({ deviceId })
			this.handAlarm = tableList || {}
			this.alarmAlert = true
		},
		async dialogSure(params) {
			const result = await processAlarm(params)
			this.allRequest()
			this.showAlert = false
		},
		changePageHandle(page, pageSize) {
			this.getTableData(page, pageSize)
		},
		changePageSizeHandle(current, size) {
			this.getTableData(current, size)
		},
		getDeviceStatusTableData() {
			return realTimeData({ deviceId: this.id }).then(({ data }) => {
				const simpleTableDataResult = this.simpleTableData.map(i => {
					Object.keys(i).forEach((j, idx) => {
						const num = idx - 1
						if (num >= 0) {
							const key = Object.keys(nameForKey)[Object.values(nameForKey).findIndex(k => i.name.includes(k))]
							if (data[num]) i[j] = data[num][key]
						}
					})
					return i
				})
				this.simpleTableData = simpleTableDataResult
			})
		},
		getTimePickerDate(dates) {
			const [startDate, endDate] = dates
			this.filterForm.startDate = startDate
			this.filterForm.endDate = endDate
		},
		delImgSource(url) {
			const params = {
				deviceId: +this.id,
				url,
			}
			deletePositionImg(params).then(res => {
				this.getDeviceInfoDetail()
			})
		},
		addImgSource(url) {
			const params = {
				deviceId: +this.id,
				url,
			}
			addPositionImg(params).then(res => {
				this.getDeviceInfoDetail()
			})
		},
		changeTitleContent(key) {
			this.getChartData(key)
		},
	},
}
</script>

<style lang="less" scoped>
@import url("styles/common.less");

.device-info-container {
	.pages-container-no-child-layout();
	padding-left: 1.5rem;
	padding-right: 1.5rem;
	.device-data {
		display: flex;
		height: calc(100vh - 43px - 2.25rem - 4.42rem - 0.92rem - 0.92rem);
		overflow: auto;
		.device-info-left > div,
		.device-info-right > div {
			background-color: #131a2d;
			margin-bottom: 1.25rem;
			> header {
				margin-bottom: 2rem;
			}
		}
		.device-info-left {
			width: 31.67rem;
			.device {
				.info {
					padding: 1.42rem 0 2rem 1.33rem;
					width: 100%;
					display: flex;
					align-items: center;
					.device-img {
						width: 6.5rem;
						height: 6.5rem;
						border-radius: 50%;
						background-color: #122849;
					}
					.info-text {
						color: #dcdcdc;
						padding: 0 0 0 1.33rem;
						line-height: 10px;
						> p {
							font-size: 1.17rem;
						}
						.device-id i {
							.dot-before {
								content: "";
								display: inline-block;
								width: 0.67rem;
								height: 0.67rem;
								border-radius: 50%;
								position: relative;
								left: -0.2rem;
							}
							width: 4.42rem;
							height: 1.75rem;
							display: inline-block;
							margin: 0 0 0 0.5rem;
							border: 1px solid #3f4a77;
							border-radius: 12px;
							text-align: center;
							line-height: 1.65rem;
							font-size: 1rem;
							font-style: normal;
							&.dot-1::before {
								.dot-before();
								background-color: #35d4ac;
							}
							&.dot-2::before {
								.dot-before();
								background-color: #81899c;
							}
							&.dot-3::before {
								.dot-before();
								background-color: #fcbe0b;
							}
							&.dot-4::before {
								.dot-before();
								background-color: #fb5e4f;
							}
						}
						.device-address {
							display: flex;
							align-items: center;
							font-size: 1rem;
							> img {
								width: 1.25rem;
								height: 1.25rem;
								margin: 0 0.5rem 0 0;
							}
							> span:last-child {
								margin: 0 0 0 1rem;
							}
						}
					}
				}
				.operate {
					width: 100%;
					display: flex;
					align-items: center;
					background-color: #172037;
					> div {
						display: flex;
						flex-direction: column;
						align-items: center;
						padding: 1.17rem 1.33rem;
						font-size: 1rem;
						color: #dcdcdc;
						border-radius: 8px;
						cursor: pointer;
						transition: all 0.5s;
						> img {
							width: 1.33rem;
							height: 1.33rem;
						}
						> span {
							margin: 0.83rem 0 0;
						}
						&:hover {
							background-color: #122849;
						}
					}
				}
			}
			.device-status,
			.device-detailed-info {
				padding-top: 1.42rem;
				padding-right: 1.42rem;
				padding-left: 1.67rem;
			}
			.device-status {
				height: 24rem;
			}
			.device-detailed-info {
				height: 30.5rem;
			}
		}
		.device-info-right {
			width: 100%;
			margin-left: 1.42rem;
			> div {
				padding: 1.42rem 1.67rem 2rem;
			}
			.history-data-count {
				display: flex;
				align-items: center;
				padding: 2.17rem 0 2.83rem 2.67rem;
				padding-top: 2.17rem;
				padding-bottom: 2.83rem;
				padding-left: 2.67rem;
				> img {
					width: 3.67rem;
					height: 3.67rem;
				}
			}
			.history-data-chart {
				.filter-chart {
					margin: 2.5rem;
				}
				#chart_container {
					width: 100%;
					height: 20rem;
				}
			}
			.history-alarm-log {
				padding-bottom: 4rem;
				.ant-table {
					margin: 2rem 0 0;
				}
			}
		}
	}
}
</style>