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
					:checked="deviceWorkStatus"
					:loading="switchLoading"
					checked-children="开"
					un-checked-children="关"
					@change="changeShowChangeWorkStatusModal"
				/>
				<a-popover v-model="isShowPopover" placement="bottomRight">
					<a-list slot="content" size="small" :data-source="dropdownOptions">
						<a-list-item
							slot="renderItem"
							slot-scope="item"
							@click="
								() => {
									isShowPopover = false
									item.operate.call(this)
								}
							"
						>
							{{ item.name }}
						</a-list-item>
					</a-list>
					<a-icon type="ellipsis" @click="isShowPopover = true" />
				</a-popover>
			</div>
		</header>
		<section>
			<div class="device-info">
				<div class="img"
					:style="{background: `url(${deviceInfoObj.deviceModelImgPath}) no-repeat`}"
					alt="设备图片" />
				<div class="info">
					<p>设备ID：{{ deviceInfoObj.sn }}</p>
					<p>设备类型：{{ deviceInfoObj.deviceTypeName }}</p>
					<p>信号时间：{{ deviceInfoObj.reportTime | filterTimeToYYYYMMDDHHmmss }}</p>
					<p>
						设备状态：{{ deviceInfoObj.online }} {{ deviceInfoObj.alarm ? "," : ""
						}}<span class="alarm-text" v-if="deviceInfoObj.alarm">{{
							deviceInfoObj.alarm.alarmType | filterAlarmType
						}}</span>
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

		<Dialog v-model="isShowTransferModal" title="设备转移" :width="40">
			<div class="device-transfer-container">
				<p>原所属分组: {{ deviceInfoObj.groupName }}</p>
				<a-form-model layout="inline">
					<a-form-model-item label="目标分组" required>
						<a-cascader
							:options="groupOptions"
							change-on-select
							v-model="groupId"
							:fieldNames="{ label: 'title', value: 'key', children: 'children' }"
							placeholder="请选择设备分组"
							:allowClear="false"
						/>
					</a-form-model-item>
				</a-form-model>
				<div class="btn-group btn-group-for-modal">
					<a-button @click="transferDevice">确定</a-button>
					<a-button type="primary" @click="changeShowTransferModal">取消</a-button>
				</div>
			</div>
		</Dialog>

		<Dialog v-model="isShowChangeWorkStatusModal" title="输入登录密码确认" :width="40">
			<div class="change-work-status-container">
				<a-input v-model="enterPassword" type="password" placeholder="请输入登录密码确认" />
				<div class="btn-group btn-group-for-modal">
					<a-button @click="changeWorkStatus">确定</a-button>
					<a-button type="primary" @click="changeShowChangeWorkStatusModal">取消</a-button>
				</div>
			</div>
		</Dialog>
	</div>
</template>

<script>
import md5 from "md5"
import { message as msg } from "ant-design-vue"

import Dialog from "components/Dialog.vue"
import SimpleTable from "components/SimpleTable.vue"
import AddEditDevice from "components/businessComp/AddEditDevice.vue"

import apis from "apis"
import { commonMixin } from "mixins"
import { nameForKey } from "utils/baseData"

const { getDeviceInfoDetail, changeWorkStatus, getCmdSendStatus, getGroupTree, deviceChangeGroup } = apis
let timer = null

export default {
	name: "DeviceCard",
	mixins: [commonMixin],
	components: { SimpleTable, AddEditDevice, Dialog },
	props: {
		deviceInfoObj: {
			type: Object,
		},
		treeData: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			isShowPopover: false,
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
						getDeviceInfoDetail(this.deviceInfoObj.id).then(res => {
							this.formCell = res.data || {}
							this.isShowDialog = true
						})
					},
				},
				{
					name: "转移",
					operate: () => {
						getGroupTree().then(({ data }) => {
							this.groupOptions = data
							this.changeShowTransferModal()
						})
					},
				},
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
			isShowTransferModal: false,
			isShowChangeWorkStatusModal: false,
			enterPassword: "",
			switchLoading: false,
			groupId: [],
			groupOptions: [],
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
		deviceWorkStatus() {
			return this.deviceInfoObj.workStatus === 1
		},
	},
	methods: {
		// changeDeviceWorkStatus() {
		// 	this.$emit("changeDeviceWorkStatus")
		// },
		changeShowChangeWorkStatusModal() {
			if (this.deviceInfoObj.online === "离线") return msg.error("设备当前你不在线，无法远程发送开合闸指令")
			this.enterPassword = ""
			this.switchLoading = !this.switchLoading
			this.isShowChangeWorkStatusModal = !this.isShowChangeWorkStatusModal
		},
		changeWorkStatus() {
			const { id: deviceId, workStatus } = this.deviceInfoObj
			if (!this.enterPassword) return msg.error("请输入当前登录密码")
			const form = new FormData()
			form.append("deviceId", deviceId)
			form.append("workStatus", workStatus === 1 ? 2 : 1)
			form.append("password", md5(this.enterPassword))
			changeWorkStatus(form)
				.then(({ data }) => this.getCmdProcess(data))
				.catch(err => {
					console.log(err)
					this.changeShowChangeWorkStatusModal()
				})
		},
		getCmdProcess(cmdId) {
			timer = setInterval(() => {
				getCmdSendStatus(cmdId).then(({ data }) => {
					if (data !== 1) {
						this.changeShowChangeWorkStatusModal()
						clearInterval(timer)
						data === 2 && msg.success("发送成功")
						data === 3 && msg.success("发送失败")
						data === 4 && msg.success("取消发送")
					}
				})
			}, 1000)
		},
		changeShowTransferModal() {
			this.isShowTransferModal = !this.isShowTransferModal
			this.groupId = []
		},
		transferDevice() {
			const {
				deviceInfoObj: { id: deviceId },
				groupId,
			} = this
			if (groupId.length === 0) return msg.error("未选择目标分组")
			// const params = {
			// 	deviceId,
			// 	groupId: groupId.pop(),
			// }
			const form = new FormData()
			form.append("deviceId", deviceId)
			form.append("groupId", groupId.pop())
			deviceChangeGroup(form).then(() => {
				msg.success("转移成功")
				this.changeShowTransferModal()
			})
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
				// background: url("~assets/images/device-default.png") no-repeat;
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
.change-work-status-container,
.device-transfer-container {
	padding: 4rem 0 0;
	.btn-group {
		> button:first-child {
			color: #81899c;
		}
	}
}
.device-transfer-container {
	padding: 4rem 2rem 0;
}
</style>