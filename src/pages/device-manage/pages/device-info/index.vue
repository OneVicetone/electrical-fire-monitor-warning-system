<template>
	<div class="device-info-container">
		<Breadcrumb :historyList="historyList" />
		<div class="device-data">
			<div class="device-info-left">
				<div class="device"></div>
				<div class="device-status"></div>
				<div class="device-detailed-info"></div>
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
				<div class="history-data-chart"></div>
				<div class="history-alarm-log"></div>
			</div>
		</div>
	</div>
</template>

<script>
import Breadcrumb from "components/Breadcrumb.vue"
import NumCount from "components/NumCount.vue"

export default {
	name: "DeviceInfo",
	components: { Breadcrumb, NumCount },
	data() {
		return {
			historyList: ["首页", "设备监控", "设备详情"],
			historyCountData: [
				{ title: "本设备报警次数", num: "10" },
				{ title: "本设备报警处理次数", num: "96" },
				{ title: "本设备故障次数", num: "84" },
				{ title: "本设备入网天数(天)", num: "365", afterHasDivider: false },
			],
		}
	},
	mounted() {
		console.log(this)
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
		.device-info-left > div, .device-info-right > div {
			background-color: #131a2d;
			margin-bottom: 1.25rem;
		}
		.device-info-left {
			width: 31.67rem;
			.device {
				height: 15.5rem;
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
			}
			.history-alarm-log {
			}
		}
	}
}
</style>