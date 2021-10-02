<template>
	<div class="alarm-card-container" @click="toPath(`/phone-alarm-info/${alarmInfo.id}`)">
		<div class="alarm-icon error" v-if="alarmInfo.alarmLevel === 2">
			<img src="@/assets/icons/danger-icon.png" />
			<p>高危</p>
		</div>
		<div class="alarm-icon warn" v-else>
			<img src="@/assets/icons/warn-icon.png" />
			<p>预警</p>
		</div>
		<div class="alarm-info">
			<div class="alarm-title">
				<h3>{{ alarmInfo.alarmTypeName }}</h3>
				<div class="alarm-status no-process" v-if="true">未处理</div>
				<div class="alarm-status has-process" v-else>已处理</div>
			</div>

			<LabelAndValue :labels="alarmDetailedLabel" :values="alarmInfo" labelColor="#8994a7" valueColor="#8994a7" />
		</div>
	</div>
</template>

<script>
import LabelAndValue from "components/LabelAndValue.vue"

import { commonMixin } from "mixins"

export default {
	name: "AlarmCard",
	mixins: [commonMixin],
	components: { LabelAndValue },
	props: {
		id: String,
		alarmInfo: Object,
	},
	data() {
		return {
			alarmDetailedLabel: [
				{ label: "报警详情", key: "alarmValue" },
				{ label: "报警设备", key: "deviceTypeName" },
				{ label: "报警时间", key: "createTime" },
				{ label: "报警位置", key: "address" },
			],
		}
	},
}
</script>

<style lang="less" scoped>
.alarm-card-container {
	// width: 59.17rem;
	height: 21.67rem;
	display: flex;
	padding: 1.92rem 2.25rem 4.42rem 2.17rem;
	margin-bottom: 1.75rem;
	background-color: #fff;
	box-shadow: 0px 7px 7px 1px rgba(211, 212, 220, 0.08);
	border-radius: 15px;
	.alarm-icon {
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		> img {
			width: 2.25rem;
			height: 4.08rem;
		}
		&.error {
			color: #fb5e4f;
		}
		&.warn {
			color: #fcbe0b;
		}
	}
	.alarm-info {
		width: 100%;
		margin-left: 2.92rem;
		.alarm-title {
			display: flex;
			justify-content: space-between;
			> h3 {
				font-size: 2.5rem;
				font-weight: bold;
				color: #445a79;
			}
			> div {
				width: 8.33rem;
				height: 3.33rem;
				display: flex;
				justify-content: center;
				align-items: center;
				border: 1px solid;
				border-radius: 2px;
				font-size: 1.83rem;
			}
			.no-process {
				color: #3dc63d;
				border-color: #3dc63d;
			}
			.has-process {
				color: #8994a7;
				border-color: #8994a7;
			}
		}
		.label-and-value-container {
			padding: 0;
		}
	}
}
</style>