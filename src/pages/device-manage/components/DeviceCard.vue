<template>
	<div class="device-card">
		<header>
			<div class="device-name">
				<img src="@/assets/icons/device-icon.png" alt="设备图标" />
				<span class="device-name">{{ deviceInfoObj.alias }}</span>
			</div>
			<div>
				<a-switch
					class="device-open-switch"
					v-if="deviceInfoObj.workStatus !== 0"
					:defaultChecked="deviceInfoObj.workStatus === 1"
					checked-children="开"
					un-checked-children="关"
					@change="changeDeviceWorkStatus"
				/>
				<a-popover trigger="click" placement="bottomRight">
					<a-list slot="content" size="small" :data-source="dropdownOptions">
						<a-list-item slot="renderItem" slot-scope="item" @click="item.operate.call(this)">
							{{ item.name }}
						</a-list-item>
					</a-list>
					<a-icon type="ellipsis" />
				</a-popover>
			</div>
		</header>
		<section>
			<div class="device-info">
				<div class="img" alt="设备图片" />
				<div class="info">
					<p>设备ID：{{ deviceInfoObj.sn }}</p>
					<p>设备类型：{{ deviceInfoObj.deviceTypeName }}</p>
					<p>信号时间：{{ deviceInfoObj.reportTime | filterTimeToYYYYMMDDHHmmss }}</p>
					<p>
						设备状态：{{ deviceInfoObj.online }} {{ deviceInfoObj.alarm ? "," : ""
						}}<span class="alarm-text" v-if="deviceInfoObj.alarm">报警</span>
					</p>
					<p>到期时间：{{ deviceInfoObj.endDate | filterTimeToYYYYMMDD }}</p>
				</div>
			</div>
			<div>
				<SimpleTable :columns="columns" :tableData="tableData" />
			</div>
		</section>
		<AddEditDevice
			v-model="isShowDialog"
			:treeData="treeData"
			eventType="编辑设备"
			:formCell="formCell"
			@on-fresh-data="$emit('re-request-list')"
		></AddEditDevice>

		<a-modal v-model="isShowTransferModal" title="更换设备" :footer="null">
			<div class="device-transfer">
				<p>原所属分组:</p>
				<a-input placeholder="请输入新设备号" />
				<div class="btn-group">
					<a-button @click="changeDevice">确定</a-button>
					<a-button type="primary" @click="changeShowChangeDeviceModal">取消</a-button>
				</div>
			</div>
		</a-modal>

	</div>
</template>

<script>
import SimpleTable from "components/SimpleTable.vue"
import AddEditDevice from "components/businessComp/AddEditDevice.vue"

import apis from "apis"
import { commonMixin } from "mixins"
import { nameForKey } from "utils/baseData"

const { getDeviceInfoDetail } = apis

export default {
	name: "DeviceCard",
	mixins: [commonMixin],
	components: { SimpleTable, AddEditDevice },
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
		treeData: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			dropdownOptions: [
				{
					name: "详情",
					operate: () => {
						this.toPath(`/device-manage/device-info/${this.deviceInfoObj.id}`)
					},
				},
				{
					name: "编辑",
					operate: () => {
						console.log("详情", this)
						getDeviceInfoDetail(this.deviceInfoObj.id).then(res => {
							console.log("编辑", res)
							this.formCell = res.data || {}
							this.isShowDialog = true
						})
					},
				},
				{ name: "转移", operate: () => {} },
				// { name: "删除", operate: () => {} },
				// { name: "更换", operate: () => {} },
			],
			columns: [
				{ title: "名称", key: "name" },
				{ title: "1/A", key: "1a" },
				{ title: "2/B", key: "2b" },
				{ title: "3/C", key: "3c" },
				{ title: "4/N", key: "4n" },
			],
			defaultTableData: [
				{ name: "漏电(mA)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
				{ name: "温度(℃)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
				{ name: "电压(V)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
				{ name: "电流(A)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
				{ name: "功率(W)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
				{ name: "电量(度)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
			],
			isShowDialog: false,
			formCell: {},
			isShowTransferModal: false
		}
	},
	computed: {
		tableData() {
			return this.defaultTableData.map(i => {
				Object.keys(i).forEach((j, idx) => {
					const num = idx - 1
					if (num >= 0) {
						const key = Object.keys(nameForKey)[Object.values(nameForKey).findIndex(k => i.name.includes(k))]
						if (this.deviceInfoObj.channelDataMap && this.deviceInfoObj.channelDataMap[num])
							i[j] = this.deviceInfoObj.channelDataMap[num][key]
					}
				})
				return i
			})
		},
	},
	methods: {
		changeDeviceWorkStatus() {
			this.$emit("changeDeviceWorkStatus")
		},
	},
}
</script>

<style lang="less">
.device-card {
	width: 30rem;
	height: 29rem;
	background-color: #131a2d;
	border: 1px solid transparent;
	border-radius: 4px;
	padding: 0.92rem 1.25rem;
	transition: all 0.5s;
	&:hover {
		border-color: #00a0e9;
		box-shadow: 0px 3px 16px 0px rgba(0, 150, 255, 0.25);
	}
	> header {
		display: flex;
		justify-content: space-between;
		.device-name {
			padding: 0 0 0 1rem;
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
		i[aria-label] {
			color: #fff;
			cursor: pointer;
		}
		.device-open-switch {
			margin: 0 1rem 0 0;
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
				background: url("~assets/images/device-default.png") no-repeat;
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
				.alarm-text {
					color: #cf4f47;
					padding: 0 0 0 0.5rem;
				}
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
		> div:last-child {
			width: 100%;
			display: flex;
			justify-content: center;
		}
	}
}
</style>