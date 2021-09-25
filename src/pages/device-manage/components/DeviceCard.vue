<template>
	<div class="device-card">
		<header>
			<div class="device-name">
				<img src="assets/icons/device-icon.png" alt="设备图标" />
				<span class="device-name">{{ deviceInfoObj.deviceName }}</span>
			</div>
			<a-popover trigger="click" placement="bottomRight">
				<a-list slot="content" size="small" :data-source="dropdownOptions">
					<a-list-item slot="renderItem" slot-scope="item" @click="item.operate.call(this)">
						{{ item.name }}
					</a-list-item>
				</a-list>
				<a-icon type="ellipsis" />
			</a-popover>
		</header>
		<section>
			<div class="device-info">
				<div class="img" alt="设备图片" />
				<div class="info">
					<p>设备ID：{{ deviceInfoObj.deviceId }}</p>
					<p>设备类型：{{ deviceInfoObj.deviceType }}</p>
					<p>信号时间：{{ deviceInfoObj.signalTime }}</p>
					<p>设备状态：{{ deviceInfoObj.deviceStatus }}</p>
					<p>到期时间：{{ deviceInfoObj.maturityTime }}</p>
				</div>
			</div>
			<SimpleTable :columns="columns" />
		</section>
	</div>
</template>

<script>
import SimpleTable from "components/SimpleTable.vue"

import { commonMixin } from "mixins"

export default {
	name: "DeviceCard",
	mixins: [commonMixin],
	components: { SimpleTable },
	props: {
		deviceInfoObj: {
			type: Object,
			default: () => ({
				deviceName: "",
				deviceId: "",
				deviceType: "",
				signalTime: "",
				deviceStatus: "",
				maturityTime: "",
			}),
		},
	},
	data() {
		return {
			dropdownOptions: [
				{
					name: "详情",
					operate: () => {
						this.toPath(`/device-manage/device-info/${this.deviceInfoObj.id || 2}`)
					},
				},
				{
					name: "编辑",
					operate: () => {
						console.log("详情", this)
					},
				},
				{ name: "转移", operate: () => {} },
				{ name: "删除", operate: () => {} },
				{ name: "更换", operate: () => {} },
			],
			columns: [
				{ title: "名称", dataIndex: "", key: "", align: "center" },
				{ title: "1/A", dataIndex: "", key: "" },
				{ title: "2/B", dataIndex: "", key: "" },
				{ title: "3/C", dataIndex: "", key: "" },
				{ title: "4/N", dataIndex: "", key: "" },
			],
		}
	},
}
</script>

<style lang="less">
.device-card {
	width: 30rem;
	height: 28.33rem;
	background-color: #131a2d;
	border: 1px solid #00a0e9;
	box-shadow: 0px 3px 16px 0px rgba(0, 150, 255, 0.25);
	border-radius: 4px;
	padding: 0.92rem 1.25rem;
	> header {
		display: flex;
		justify-content: space-between;
		.device-name {
			color: #fff;
			> img {
				width: 2rem;
				height: 2rem;
				background-color: #0096ff;
			}
			> span {
				font-size: 1.17rem;
				color: #0096ff;
			}
		}
		> i[aria-label] {
			color: #fff;
			cursor: pointer;
		}
	}
	> section {
		.device-info {
			padding: 1.75rem 0 1.42rem 0;
			display: flex;
			align-items: center;
			.img {
				width: 6.5rem;
				height: 6.5rem;
				background: url("assets/images/device-default.png") no-repeat;
				background-color: #122849;
				background-size: 70%;
				background-position: 50% 50%;
				border-radius: 50%;
			}
			.info {
				margin: 0 0 0 1.17rem;
				color: #dcdcdc;
				font-size: 0.8rem;
				line-height: 6px;
			}
			.ant-table-wrapper .ant-table {
				max-height: 14rem;
				overflow: hidden;
				border: 1px solid;
				border-radius: 4px;
				.ant-table-thead tr th {
					padding: 0;
				}
			}
		}
	}
}
</style>