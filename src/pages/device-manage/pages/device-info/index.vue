<template>
	<div class="device-info-container">
		<Breadcrumb :historyList="historyList" />
		<div class="device-data">
			<div class="device-info-left">
				<div class="device">
					<div class="info">
						<div class="device-img"></div>
						<div class="info-text">
							<p class="device-type">电气火灾控测器</p>
							<p class="device-id">
								<span>DQ84564511</span>
								<i>在线</i>
							</p>
							<p class="device-address">
								<img src="assets/icons/company.png" alt="" />
								<span>黑龙江农业银行</span>
								<span>一楼配电箱</span>
							</p>
						</div>
					</div>
					<div class="operate">
						<div @click="sendCommand">
							<img src="assets/icons/send-command.png" alt="" />
							<span>发送指令</span>
						</div>
						<div @click="previewSetupPhoto">
							<img src="assets/icons/setup-photo.png" alt="" />
							<span>安装照片</span>
						</div>
					</div>
				</div>
				<div class="device-status">
					<ContentTitle title="设备实时状态" />
					<SimpleTable />
				</div>
				<div class="device-detailed-info">
					<ContentTitle title="设备详细信息" />
					<LabelAndValue />
				</div>
			</div>
			<div class="device-info-right">
				<div class="history-data-count">
					<img src="assets/icons/alarm-count.png" alt="alarm-coun" />
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
					<ContentTitle title="历史数据走势图" />
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
								<a-range-picker v-model="filterForm.chartTime" />
							</a-form-model-item>
							<a-form-model-item>
								<a-button type="primary" size="small">查询</a-button>
							</a-form-model-item>
							<a-form-model-item>
								<a-button type="primary" ghost size="small">导出</a-button>
							</a-form-model-item>
						</a-form-model>
					</div>
					<div id="chart_container"></div>
				</div>
				<div class="history-alarm-log">
					<ContentTitle title="历史报警记录" />
					<a-table :columns="columns" :data-source="tabelData">
						<div slot="operate">
							<a>编辑</a>
							<a-divider type="vertical" />
							<a>删除</a>
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
	</div>
</template>

<script>
import moment from "moment"
import * as echarts from "echarts"

import Breadcrumb from "components/Breadcrumb.vue"
import NumCount from "components/NumCount.vue"
import ContentTitle from "components/ContentTitle.vue"
import LabelAndValue from "components/LabelAndValue.vue"
import Pagination from "components/Pagination.vue"
import SimpleTable from "components/SimpleTable.vue"

export default {
	name: "DeviceInfo",
	components: { Breadcrumb, NumCount, ContentTitle, LabelAndValue, Pagination, SimpleTable },
	data() {
		return {
			historyList: ["首页", "设备监控", "设备详情"],
			historyCountData: [
				{ title: "本设备报警次数", num: "10" },
				{ title: "本设备报警处理次数", num: "96" },
				{ title: "本设备故障次数", num: "84" },
				{ title: "本设备入网天数(天)", num: "365", afterHasDivider: false },
			],
			filterForm: {
				chartRadioValue: "1",
				chartTime: moment(),
			},
			chartRadioOptions: [
				{ label: "电流", value: "1" },
				{ label: "温度", value: "2" },
				{ label: "电压", value: "3" },
				{ label: "功率", value: "4" },
				{ label: "电能", value: "5" },
			],
			columns: [
				{ title: "序号", dataIndex: "", key: "" },
				{ title: "报警类型", dataIndex: "", key: "" },
				{ title: "报警级别", dataIndex: "", key: "" },
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
	mounted() {
		console.log(this)
		const historyChart = echarts.init(document.querySelector("#chart_container"))
		historyChart.setOption({
			xAxis: {
				type: "category",
				data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			},
			yAxis: {
				type: "value",
			},
			series: [
				{
					data: [150, 230, 224, 218, 135, 147, 260],
					type: "line",
				},
			],
		})
	},
	methods: {
		sendCommand() {},
		previewSetupPhoto() {},
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
							&::before {
								content: "";
								display: inline-block;
								width: 0.67rem;
								height: 0.67rem;
								border-radius: 50%;
								background-color: #35d4ac;
								position: relative;
								left: -0.2rem;
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
				.ant-table {
					margin: 2rem 0 0;
				}
			}
		}
	}
}
</style>