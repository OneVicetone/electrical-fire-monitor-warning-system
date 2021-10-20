<template>
	<div class="group-detail-container">
		<Breadcrumb :historyList="historyList" />
		<section>
			<div class="left-content">
				<div class="fraction">
					<ContentTitle :title="`电气消防安全${titleDateStr}评估分`" />
					<div class="fraction-text">
						<p>{{ groupDetailObj.score }}</p>
						<p>{{ groupDetailObj.scoreLevel }}</p>
					</div>
				</div>
				<div class="group-info">
					<ContentTitle title="单位信息" />
					<div class="group-info-table">
						<div class="table-item" v-for="item of groupInfoList" :key="item.label">
							<div class="label">{{ item.label }}</div>
							<div class="value">
								{{ getGroupDetailInfo(item.key, item.value) }}
							</div>
						</div>
					</div>
				</div>
				<div class="system-design-drawings">
					<ContentTitle title="电气火灾系统设计图纸" />
					<img class="enlarge-icon" src="@/assets/icons/enlarge-img-icon.png" alt="enlarge-icon" @click="enlargeImg" />
					<img class="drawings-img" :src="designPicPath" alt="drawings-img" />
				</div>
			</div>

			<div class="center-content">
				<div
					class="group-count"
					:style="`background: url(${groupDetailObj.effectPicPath || '@/assets/images/grouo-detail-bg.png'}) no-repeat`"
				>
					<div class="group-title">{{ groupDetailObj.name }}</div>
					<div class="group-detail-count-list">
						<div :class="item.key" v-for="item of groupDetailCount" :key="item.name" @click="jumpToPage(item.key)">
							<p>{{ item.num }}</p>
							<p>{{ item.name }}</p>
						</div>
					</div>
				</div>
				<div class="history-chart">
					<ContentTitle :title="historyChartTitle" @changeTitleContent="changeTitleContent" />
					<LineChart :seriesData="chartData" showXAxisLabel />
				</div>
			</div>

			<div class="right-content">
				<div class="device-service-time-count">
					<ContentTitle title="设备服务期统计" />
					<div id="device_service_time_count_chart"></div>
				</div>
				<div class="alarm-type-count">
					<ContentTitle title="报警类型统计" />
					<BarChart :dataObj="alarmTypeCountData" />
				</div>
				<div class="service-type-count">
					<ContentTitle title="服务类型统计" />
					<img src="@/assets/images/group-detail-mock.png" />
				</div>
			</div>
		</section>
		<DefaultUpload v-model="seePicLog"
			title="电气火灾系统设计图纸"
			:url="designPicPath"
			@upload-done="doneUpload"></DefaultUpload>
	</div>
</template>

<script>
import { cloneDeep } from "lodash"
import * as echarts from "echarts"
import moment from "moment"

import Breadcrumb from "components/Breadcrumb.vue"
import ContentTitle from "components/ContentTitle.vue"
import LineChart from "components/LineChart.vue"
import BarChart from "components/BarChart.vue"
import DefaultUpload from "components/DefaultUpload.vue"

import apis from "apis"
import { commonMixin, tableListMixin } from "mixins"

const {
	getUnitDetailById,
	getGroupDetailDeviceTypeCount,
	getGroupDetailDeviceStatusCount,
	getGroupDetailAlarmTypeCount,
	getGroupDetailHistoryElectricityList,
	getGroupDetailHistoryAlarmList,
	getGroupDetailDeviceList,
	groupDetailUpdateImg,
	groupDetailDevicePeriod,
} = apis

export default {
	name: "GroupDetail",
	mixins: [commonMixin, tableListMixin],
	components: { Breadcrumb, ContentTitle, LineChart, BarChart, DefaultUpload },
	props: {
		id: String,
	},
	data() {
		return {
			historyList: ["首页", "设备监控", "单位详情"],
			historyChartTitle: [
				{ name: "历史用电统计", key: "electricity" },
				{ name: "历史报警统计", key: "alarm" },
				{ name: "设备列表", key: "device" },
			],
			groupInfoList: [
				{ label: "单位类型", value: "-", key: "typeCode" },
				{ label: "占地面积", value: "-", key: "floorSpace" },
				{ label: "公司人数", value: "-", key: "employeeNum" },
				{ label: "安全负责人", value: "-", key: "principalUserName" },
				{ label: "联系方式", value: "-", key: "mobile" },
				{ label: "公司地址", value: "-", key: "address" },
			],
			groupDetailObj: {},
			designPicPath: "",
			chartRadioValue: "",
			chartData: [],
			devicePeriodData: {
				totalNum: 0,
				normalNum: 0,
				expiredNum: 0,
				dueNum: 0,
			},
			alarmTypeCountData: {},
			groupDetailCount: [
				{ name: "正常设备", num: 0, key: "normalNum" },
				{ name: "报警设备", num: 0, key: "alarmNum" },
				{ name: "故障设备", num: 0, key: "faultNum" },
				{ name: "离线设备", num: 0, key: "offLineNum" },
			],
			seePicLog: false,
			titleDateStr: moment().format("YYYY年MM月"),
			groupTypeOptions: [],
		}
	},
	mounted() {
		const optionsTypes = ["groupType"]
		const {
			getGroupDetailData,
			getDevicePeriodData,
			getAlarmTypeCountData,
			getChartData,
			getGroupDeviceCountData,
			getOptionsListPromiseArr,
		} = this
		Promise.allSettled([
			getGroupDetailData(),
			getDevicePeriodData(),
			getAlarmTypeCountData(),
			getChartData(),
			getGroupDeviceCountData(),
			...getOptionsListPromiseArr(optionsTypes),
		])
		// this.setChart()
	},
	methods: {
		getGroupDetailData() {
			return getUnitDetailById(this.id).then(({ data }) => {
				const groupInfoListCopy = cloneDeep(this.groupInfoList)
				groupInfoListCopy.forEach(i => {
					i.value = data[i.key] || "-"
				})
				this.groupInfoList = groupInfoListCopy
				this.designPicPath = data.designPicPath
				this.groupDetailObj = data
			})
		},
		getChartData(type = "electricity") {
			const params = {
				current: 1,
				size: 100,
				groupId: this.id,
			}
			const func = ({ data: { records } }) => {
				this.chartData = records
			}
			if (type === "electricity") {
				return getGroupDetailHistoryElectricityList(params).then(func)
			}
			if (type === "alarm") {
				return getGroupDetailHistoryAlarmList(params).then(func)
			}
			if (type === "device") {
				return getGroupDetailDeviceList(params).then(func)
			}
		},
		getDevicePeriodData() {
			return groupDetailDevicePeriod(this.id).then(({ data }) => {
				const formatTooltipText = ({ name, value, percent }) => {
					// return `<span>${name}:${value} / <span style="color: #5D42F3">${percent}%</span></span>`
					return 'hha'
				}
				const nameMap = {
					totalNum: { label: "总数量", color: "#fff" },
					normalNum: { label: "正常", color: "#1F74E2" },
					expiredNum: { label: "已到期", color: "#32BCD2" },
					dueNum: { label: "即将到期", color: "#5D42F3" },
				}
				const seriesData = Object.keys(data)
					.map(i => {
						if (i === "totalNum") return false
						return {
							value: data[i],
							name: nameMap[i].label,
							itemStyle: {
								color: nameMap[i].color,
							},
							tooltip: {
								formatter: `{b}: {c} / {d} hhhh`
								// formatter: formatTooltipText,
							},
						}
					})
					.filter(Boolean)
				const option = {
					tooltip: {
						trigger: "item",
						position: [20, 20],
					},
					legend: {
						right: 40,
						textStyle: {
							color: "#fff",
							fontSize: 12,
						},
						icon: "circle",
						itemWidth: 4,
						orient: "vertical",
					},
					grid: {
						top: 70,
						left: 0,
						right: 0,
					},
					series: [
						{
							type: "pie",
							radius: ["80%", "100%"],
							left: -120,
							label: {
								show: false,
								position: "center",
							},
							emphasis: {
								label: {
									show: true,
									fontSize: 12,
								},
							},
							labelLine: {
								show: false,
							},
							data: seriesData,
						},
					],
				}
				const chart = echarts.init(document.querySelector("#device_service_time_count_chart"))
				chart.setOption(option)
			})
		},
		getAlarmTypeCountData() {
			return getGroupDetailAlarmTypeCount(this.id).then(({ data }) => {
				this.alarmTypeCountData = data
			})
		},
		getGroupDeviceCountData() {
			return getGroupDetailDeviceStatusCount(this.id).then(({ data }) => {
				const groupDetailCountCopy = cloneDeep(this.groupDetailCount)
				groupDetailCountCopy.forEach(i => {
					i.num = data[i.key] || 0
				})
				this.groupDetailCount = groupDetailCountCopy
			})
		},
		enlargeImg() {
			this.seePicLog = true
		},
		changeTitleContent(key) {
			this.getChartData(key)
		},
		jumpToPage(type) {
			type === "normalNum" && this.toPath("/device-manage/?deviceStatusRadio=1")
			type === "alarmNum" && this.toPath("/device-manage/?deviceStatusRadio=3")
			type === "faultNum" && this.toPath("/device-manage/?deviceStatusRadio=4")
			type === "offLineNum" && this.toPath("/device-manage/?deviceStatusRadio=2")
		},
		getGroupDetailInfo(key, value) {
			if (key === "floorSpace") {
				return value !== "-" ? `${value}㎡` : "-"
			}
			if (key === "typeCode") {
				const obj = this.groupTypeOptions.find(({ value: optionVal }) => optionVal === value)
				if (obj && obj.label) return obj.label
			}
			return value
		},
		doneUpload(url) {
			const dataForm = new FormData();
			dataForm.append("groupId", this.id)
			dataForm.append("imgPath", url)
			dataForm.append("type", 2)
			groupDetailUpdateImg(dataForm).then(res => {
				this.getGroupDetailData();
			})
		}
	},
}
</script>

<style lang="less" scoped>
@import url("styles/common.less");

@chunk-bg-color: #131a2d;
@content-default-padding: 1.67rem 0 0 1.17rem;

.group-detail-container {
	.pages-container-no-child-layout();
	padding-left: 1.5rem;
	padding-right: 1.5rem;
	padding-bottom: 43px;
	> section {
		height: 100%;
		display: flex;
		overflow-y: auto;
		.left-content,
		.right-content {
			flex: 0 0 auto;
			width: 31.67rem;
		}
		> div:not(.center-content) {
			> div {
				background-color: #131a2d;
				&:not(div:first-child) {
					margin-top: 1.25rem;
				}
			}
		}
		.left-content {
			.fraction {
				height: 16.67rem;
				padding: @content-default-padding;
				background-color: @chunk-bg-color;
				.fraction-text {
					width: 12.5rem;
					height: 9.75rem;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
					margin: 1.83rem 0 0 8.17rem;
					background: url("~assets/images/marker-info-fraction.png") no-repeat;
					background-size: 100%;
					color: #0096ff;
					> p {
						margin: 0;
					}
					> p:first-child {
						margin-top: -2rem;
						font-size: 2.44rem;
					}
					> p:last-child {
						font-size: 1.41rem;
					}
				}
			}
			.group-info {
				height: 27.71rem;
				padding: 1.42rem 1.25rem 2.17rem 1.67rem;
				background-color: @chunk-bg-color;
				@border: 1px solid #1f2944;
				.group-info-table {
					margin-top: 1.58rem;
					.table-item {
						height: 3rem;
						display: flex;
						border: @border;
						border-top: 0px;
						> div {
							display: flex;
							align-items: center;
							color: #aaddff;
							font-size: 1rem;
						}
						.label {
							width: 9.17rem;
							background-color: #131f37;
							justify-content: center;
							border-right: @border;
						}
						.value {
							width: 21.25rem;
							padding: 0 0 0 1.83rem;
							justify-content: flex-start;
							background-color: transparent;
						}
					}
					.table-item:first-child {
						border-top: 1px;
					}
				}
			}
			.system-design-drawings {
				height: 25.83rem;
				padding: 1.42rem 2.5rem 1.25rem 1.67rem;
				position: relative;
				.enlarge-icon {
					height: 1.58rem;
					width: 1.58rem;
					position: absolute;
					top: 1.42rem;
					right: 1.83rem;
					cursor: pointer;
				}
				.drawings-img {
					width: 100%;
					height: 17rem;
					margin-top: 1.5rem;
				}
			}
		}
		.center-content {
			width: 100%;
			// height: 25.83rem;
			margin: 0 1.25rem;
			> div {
				padding: 1.42rem 1.67rem;
				background-color: #131a2d;
			}
			.common-before-after {
				content: "";
				display: block;
				position: absolute;
				width: 3.33rem;
				height: 3.33rem;
				background: url("~assets/icons/group-detail-arrow-icon.png") no-repeat;
				background-position: 100%;
				background-size: 100%;
				top: -4px;
			}
			.group-count {
				height: 45.33rem;
				display: flex;
				flex-direction: column;
				align-items: center;
				position: relative;
				// background: url("~assets/images/login-bg.png") no-repeat;
				background-size: 100%;
				background-position: 100%;
				.group-title {
					font-size: 1.83rem;
					position: relative;
					&::before {
						.common-before-after();
						left: -4rem;
					}
					&::after {
						.common-before-after();
						transform: rotate(180deg);
						right: -4rem;
					}
				}
				.group-detail-count-list {
					display: flex;
					justify-content: center;
					align-items: center;
					position: absolute;
					bottom: 2.5rem;
					> div {
						width: 9.83rem;
						height: 6.33rem;
						margin: 0 0.625rem;
						display: flex;
						flex-direction: column;
						align-items: center;
						background-size: 100% !important;
						background-position: 100% !important;
						cursor: pointer;
						> p {
							margin: 0;
							position: absolute;
							&:first-child {
								top: 0.8rem;
								font-size: 2.14rem;
							}
							&:last-child {
								font-size: 1.03rem;
								bottom: 0;
							}
						}
					}
					.normalNum {
						background: url("~assets/images/group-detail-count-bg-blue.png") no-repeat;
						> p:first-child {
							color: #0096ff;
						}
					}
					.alarmNum {
						background: url("~assets/images/group-detail-count-bg-red.png") no-repeat;
						> p:first-child {
							color: #ff2525;
						}
					}
					.offLineNum {
						background: url("~assets/images/group-detail-count-bg-gray.png") no-repeat;
						> p:first-child {
							color: #5a93d6;
						}
					}
					.faultNum {
						background: url("~assets/images/group-detail-count-bg-yellow.png") no-repeat;
						> p:first-child {
							color: #ffa900;
						}
					}
				}
			}
			.history-chart {
				height: 25.83rem;
				margin-top: 1.25rem;
			}
			// align-self: flex-end;
		}
		.right-content {
			.device-service-time-count {
				height: 16.75rem;
				padding: @content-default-padding;
				#device_service_time_count_chart {
					height: 10rem;
					margin-top: 2rem;
				}
			}
			.alarm-type-count {
				height: 27.33rem;
				padding: @content-default-padding;
			}
			.service-type-count {
				height: 25.83rem;
				padding: @content-default-padding;
				> img {
					width: 28.5rem;
					height: 20rem;
					margin-top: 2rem;
				}
			}
		}
	}
}
</style>