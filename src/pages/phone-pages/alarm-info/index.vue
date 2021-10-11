<template>
	<div class="alarm-info-container">
		<Header name="报警详情" />
		<section>
			<Title title="报警设备信息" />
			<div class="alarm-info content">
				<div class="device-id">
					<p class="label">设备号</p>
					<p>{{ alarmDetial.deviceSn }}</p>
				</div>
				<div class="info-text">
					<div>
						<span class="label">报警时间：</span>
						<span class="value">{{ alarmDetial.alarmTime | filterTimeToYYYYMMDDHHmmss }}</span>
					</div>
					<div>
						<span class="label">报警恢复：</span>
						<span class="value">-</span>
					</div>
					<div>
						<span class="label">报警设备：</span>
						<span class="value">{{ alarmDetial.deviceTypeName }}</span>
					</div>
					<div>
						<span class="label">报警类型：</span>
						<span class="value">{{ alarmDetial.alarmTypeName }}</span>
					</div>
					<div>
						<span class="label">报警详情：</span>
						<span class="value">{{ alarmDetial.alarmValue ? alarmDetial.alarmValue + alarmDetial.unit : "-" }}</span>
					</div>
					<div>
						<span class="label">报警单位：</span>
						<span class="value">{{ alarmDetial.groupName }}</span>
					</div>
					<div>
						<span class="label">安装位置：</span>
						<span class="value">{{ alarmDetial.deviceTypeName }}</span>
					</div>
					<div>
						<span class="label">安全负责人：</span>
						<span class="value">{{ alarmDetial.deviceTypeName }}</span>
					</div>
					<div>
						<span class="label">报警地址：</span>
						<span class="value">{{ alarmDetial.address }}</span>
					</div>
				</div>
			</div>
			<Title title="报警处理意见" />
			<div class="alarm-process-opinions content value">
				电线头接触不良或电路过载可能会引起电路温度过高。建议查看电线接头处是否接触不良。若同时发生过载报警，则可能是电路超负载引起的电
			</div>
			<Title title="报警处理" />
			<div class="alarm-process content">
				<div>
					<p class="label">警情确定</p>
					<Radio v-model="alarmProcessForm.confirmFlag" :options="alarmEnterOptions" />
				</div>
				<div>
					<p class="label">处理方式</p>
					<Radio v-model="alarmProcessForm.processType" :options="processTypeOptions" />
				</div>
				<div>
					<p class="label">现场照片</p>
					<a-upload
						list-type="picture-card"
						class="file-uploader"
						:file-list="alarmProcessForm.imgList"
						:customRequest="handleUploadFile"
					>
						<div v-if="alarmProcessForm.imgList.length <= 6">
							<a-icon type="plus" />
						</div>
					</a-upload>
				</div>
				<div>
					<p class="label">处理备注</p>
					<a-textarea v-model="alarmProcessForm.remark" placeholder="请输入处理备注" allow-clear />
				</div>
			</div>
			<div class="enter-btn">
				<a-button type="primary" @click="toProcess">确定</a-button>
			</div>
		</section>
	</div>
</template>

<script>
import { message as msg } from "ant-design-vue"

import Header from "../components/Header.vue"
import Title from "../components/Title.vue"
import Radio from "../components/Radio.vue"

import apis from "apis"
import { initHtmlBasePx } from "utils/initial"
import { commonMixin, uploadFileMixin, phonePageMixin } from "mixins"

const { getAlarmDetail, processAlarm } = apis

export default {
	name: "AlarmInfo",
	mixins: [commonMixin, uploadFileMixin, phonePageMixin],
	components: { Header, Title, Radio },
	props: {
		id: String,
	},
	data() {
		return {
			uploading: false,
			alarmProcessForm: {
				confirmFlag: 1,
				processType: 1,
				imgList: [],
				remark: "",
			},
			alarmEnterOptions: [
				{ label: "真实报警", value: 1 },
				{ label: "误报", value: 2 },
				{ label: "测试", value: 3 },
			],
			processTypeOptions: [
				{ label: "已通知用户", value: 1 },
				{ label: "已核查", value: 2 },
				{ label: "下发整改通知", value: 3 },
			],
			alarmDetial: {},
		}
	},
	beforeCreate() {
		initHtmlBasePx(62.5)
	},
	mounted() {
		const { getAlarmDetailData, getUploadUrl } = this
		Promise.allSettled([getAlarmDetailData(), getUploadUrl()])
	},
	methods: {
		getAlarmDetailData() {
			return getAlarmDetail(this.id).then(({ data }) => {
				this.alarmDetial = data
				// this.alarmProcessForm = { confirmFlag, processType, remark } = data
			})
		},
		toProcess() {
			const params = {
				alarmId: Number(this.id),
				...this.alarmProcessForm,
				sitePhotos: this.alarmProcessForm.imgList.map(({ url }) => url).join(","),
			}
			processAlarm(params).then(() => {
				msg.success("处理报警成功")
				this.$router.go(-1)
			})
		},
		handleUploadFile(arg) {
			arg.file instanceof File &&
				this.toUploadFile(arg.file).then(imgUrl => {
					this.uploading = false
					this.alarmProcessForm.imgList.push({
						url: imgUrl,
						uid: imgUrl,
						status: "done",
					})
				})
		},
	},
}
</script>

<style lang="less">
@import url("styles/phone-pages-common.less");

.alarm-info-container {
	> section {
		.section();
		.label {
			color: #8994a7;
			font-size: 2.17rem;
		}
		.value {
			color: #445a79;
			font-size: 2.17rem;
		}
		.content {
			background-color: #fff;
		}
		.alarm-info {
			padding: 0 1.92rem;
			.device-id {
				padding: 2.17rem 0 1.75rem;
				border-bottom: 1px solid #e5e5e5;
				> p {
					margin: 0;
					padding: 0 1.25rem;
				}
				> p:last-child {
					margin-top: 1.83rem;
					font-size: 3.67rem;
					color: #445a79;
				}
			}
			.info-text {
				padding: 2.25rem 1.25rem 1rem;
				> div {
					display: flex;
					justify-content: space-between;
					margin-bottom: 1.75rem;
				}
			}
		}
		.alarm-process-opinions {
			padding: 4.425rem 3.75rem 4.92rem;
		}
		.alarm-process {
			padding: 0 2.5rem 2.42rem;
			> div {
				padding: 3.5rem 0 0;
			}
			.ant-input {
				background-color: #f6f7fb;
				border-radius: 0;
				border: none;
			}
			.file-uploader {
				width: 100%;
				height: 100%;
				display: flex;
				.ant-upload {
					width: 12.5rem;
					height: 12.5rem;
					border-color: #0096ff;
				}
				.ant-upload-list {
					flex: 1;
				}
				.ant-upload-list-picture-card-container,
				.ant-upload-list-item {
					width: 12.5rem;
					height: 12.5rem;
					padding: 0;
					border: none;
				}
				i[aria-label] {
					color: #0096ff;
				}
			}
		}
		.enter-btn {
			width: 100%;
			padding: 2.25rem 3.75rem;
			> button {
				width: 100%;
				height: 8.33rem;
			}
		}
	}
}
</style>