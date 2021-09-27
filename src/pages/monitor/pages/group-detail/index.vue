<template>
	<div class="group-detail-cintainer">
		<Breadcrumb :historyList="historyList" />
		<section>
			<div class="left-content">
				<div class="fraction">
					<ContentTitle title="电气消防安全21年8月评估分" />
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
							<div class="value">{{ item.value }}</div>
						</div>
					</div>
				</div>
				<div class="system-design-drawings">
					<ContentTitle title="电气火灾系统设计图纸" />
					<img class="enlarge-icon" src="assets/icons/enlarge-img-icon.png" alt="enlarge-icon" @click="enlargeImg" />
					<img class="drawings-img" :src="designPicPath" alt="drawings-img" />
				</div>
			</div>

			<div class="center-content">
				<div class="history-chart">
					<ContentTitle :title="historyChartTitle" @changeTitleContent="changeTitleContent" />
					<LineChart :xAxisData="chartData.xAxisData" :seriesData="chartData.seriesData" />
				</div>
			</div>

			<div class="right-content">
				<div class="device-service-time-count">
					<ContentTitle title="设备服务期统计" />
					<div id="device_service_time_count_chart"></div>
				</div>
				<div class="alarm-type-count">
					<ContentTitle title="报警类型统计" />
					<div id="alarm_type_count_chart"></div>
				</div>
				<div class="service-type-count">
					<ContentTitle title="服务类型统计" />
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import { cloneDeep } from "lodash"
// import * as echarts from "echarts"

import Breadcrumb from "components/Breadcrumb.vue"
import ContentTitle from "components/ContentTitle.vue"
import LineChart from "components/LineChart.vue"

import apis from "apis"
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
	components: { Breadcrumb, ContentTitle, LineChart },
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
			chartData: {
				xAxisData: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				seriesData: [10, 52, 200, 334, 390, 330, 220],
			},
			devicePeriodData: {
				totalNum: 0,
				normalNum: 0,
				expiredNum: 0,
				dueNum: 0,
			},
		}
	},
	mounted() {
		const { getGroupDetailData } = this
		Promise.allSettled([getGroupDetailData()])
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
			if (type === "electricity") {
				return getGroupDetailHistoryElectricityList().then()
			}
			if (type === "alarm") {
				return getGroupDetailHistoryAlarmList().then()
			}
			if (type === "device") {
				return getGroupDetailDeviceList().then()
			}
		},
		getDevicePeriodData() {
			return groupDetailDevicePeriod(this.id).then(({ data }) => (this.devicePeriodData = data))
		},
		enlargeImg() {},
		changeTitleContent(key) {
			this.getChartData(key)
		},
	},
}
</script>

<style lang="less" scoped>
@import url("styles/common.less");

@chunk-bg-color: #131a2d;
@content-default-padding: 1.67rem 0 0 1.17rem;

.group-detail-cintainer {
	.pages-container-no-child-layout();
	padding-left: 1.5rem;
	padding-right: 1.5rem;
	> section {
		// max-height: 100%;
		display: flex;
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
					background: url("assets/images/marker-info-fraction.png") no-repeat;
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
			}
		}
		.center-content {
			width: 100%;
			height: 25.83rem;
			margin: 0 1.25rem;
			padding: 1.42rem 0 0 1.67rem;
			background-color: #131a2d;
			align-self: flex-end;
		}
		.right-content {
			.device-service-time-count {
				height: 16.75rem;
				padding: @content-default-padding;
			}
			.alarm-type-count {
				height: 27.33rem;
				padding: @content-default-padding;
			}
			.service-type-count {
				height: 25.83rem;
				padding: @content-default-padding;
			}
		}
	}
}
</style>