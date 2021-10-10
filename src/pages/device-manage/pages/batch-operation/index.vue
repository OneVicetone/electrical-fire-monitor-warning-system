<template>
	<div class="batch-operations-container">
		<Breadcrumb :historyList="historyList" />
		<div class="batch-content">
			<NavTitles :title="operationName" />
			<div class="content">
				<a-form-model layout="inline">
					<a-form-model-item label="1、下载模板，填写信息：">
						<a-button type="link" icon="download" @click="downloadTemplate">下载模板</a-button>
					</a-form-model-item>
					<a-form-model-item label="2、上传填写后的数据文件：">
						<a-upload :fileList="fileList" :remove="handleRemove" :before-upload="beforeUpload">
							<a-button ghost icon="upload">上传文件</a-button>
						</a-upload>
					</a-form-model-item>
					<a-form-model-item label="3、请选择数据范围：">
						<a-select v-if="operation_type === IMPORT" v-model="deviceId" :options="deviceIdOptions" />
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

				<!-- <a-form-model v-else-if="operation_type === TRANSFER"></a-form-model>
				<a-form-model v-else-if="operation_type === IMPORT"></a-form-model> -->

				<div class="btn-group">
					<a-button type="primary" @click="enter" :loading="uploading">确定</a-button>
					<a-button ghost @click="cancel" :disabled="uploading">取消</a-button>
				</div>

				<div class="progress" v-show="uploading">
					<a-progress :percent="percent" status="active" />
				</div>

				<div class="explanation">
					<p>
						<span>*</span>
						导入说明:
					</p>
					<p>1、表头首行为字段名，不能删除、修改</p>
					<p>2、文件后缀名必须为：xls 或xlsx （即Excel格式）</p>
					<p>3、一次最多提交 1万条</p>
					<p>4、表头字段标为“*”号的为必填字段，请务比填写</p>
					<p>5、设备ID不允许重复，一旦重复，则本行数据不允许导入</p>
				</div>
			</div>
		</div>
		<a-modal v-model="isShowUploadedResult" title="导入结果" :footer="null">
			<div class="import-result-container">
				<h3>共导入数据{{ importResult.total }}条</h3>
				<div class="info">
					<span>成功：{{ importResult.success }}条</span>
					<span>失败：{{ importResult.fail }}条</span>
				</div>
				<div class="btn-group">
					<a-button @click="changeImportResultShow">关闭</a-button>
					<a-button type="primary" @click="downloadErrorXlsx">下载失败表格</a-button>
				</div>
			</div>
		</a-modal>
	</div>
</template>

<script>
import { v4 as uuidv4 } from "uuid"
import { message as msg } from "ant-design-vue"

import Breadcrumb from "components/Breadcrumb.vue"
import NavTitles from "components/NavTitles.vue"

import apis from "apis"
import { tableListMixin } from "mixins"
import { batchKeytoName, SHIP, TRANSFER, IMPORT, templateTypeMap } from "utils/baseData"

const {
	getCommonTemplateByType,
	getGroupTree,
	// 根据名称统一从 apis 里取
	// batchDeliverGoods,
	// batchChangeGroup,
	// batchImport,
	getBatchOperationProgress,
} = apis

let timer = null

export default {
	name: "BatchOperation",
	mixins: [tableListMixin],
	components: { Breadcrumb, NavTitles },
	props: {
		operation_type: String,
	},
	data() {
		return {
			batchKeytoName,
			SHIP,
			TRANSFER,
			IMPORT,
			percent: 0,
			uploading: false,
			deviceIdOptions: [],
			deviceId: "",
			fileList: [],
			groupOptions: [],
			groupId: [],
			uuid: uuidv4(),
			isShowUploadedResult: false,
			importResult: {
				total: 0,
				success: 0,
				fail: 0,
				errorFilePath: "",
			},
		}
	},
	computed: {
		operationName() {
			return `批量${batchKeytoName[this.operation_type]}`
		},
		historyList() {
			return ["首页", "设备管理", this.operationName]
		},
	},
	mounted() {
		const { getDeviceId, operation_type } = this
		Promise.allSettled([
			getGroupTree().then(({ data }) => (this.groupOptions = data)),
			...(operation_type === IMPORT && [getDeviceId()]),
		])
	},
	methods: {
		downloadTemplate() {
			getCommonTemplateByType(templateTypeMap[this.operation_type])
		},
		enter() {
			this.changeUploading()
			const { groupId, fileList, operation_type, deviceId, uuid, getProcess } = this
			if (groupId.length === 0) return msg.error("请选择设备分组")
			if (fileList.length === 0) return msg.error("请上传数据文件")
			if (!deviceId && operation_type === IMPORT) return msg.error("请选择设备型号")

			const form = new FormData()
			form.append("groupId", groupId)
			form.append("file", fileList[0])
			form.append("scheduleKey", uuid)
			operation_type === IMPORT && form.append("deviceModelId", deviceId)

			return apis[templateTypeMap[this.operation_type]](form).then(({ data }) => {
				this.importResult = data
				getProcess()
			})
		},
		cancel() {
			this.$router.go(-1)
		},
		handleRemove() {
			this.fileList = []
		},
		beforeUpload(file) {
			this.fileList = [file]
			return false
		},
		getProcess() {
			timer = setInterval(() => {
				getBatchOperationProgress(this.uuid).then(({ data }) => {
					this.percent = Number(data.split("%").shift())
					if (this.percent === 100) {
						clearInterval(timer)
						this.changeUploading()
						this.changeImportResultShow()
					}
				})
			}, 1000)
		},
		changeUploading() {
			this.uploading = !this.uploading
		},
		changeImportResultShow() {
			this.isShowUploadedResult = !this.isShowUploadedResult
		},
		downloadErrorXlsx() {
			if (this.importResult.errorFilePath) {
				window.location.href = this.importResult.errorFilePath
			} else {
				msg.error("没有失败数据")
			}
		},
	},
}
</script>

<style lang="less" scoped>
@import url("styles/common.less");

.batch-operations-container {
	.pages-container-no-child-layout();
	padding-left: 20rem;
	padding-right: 20rem;
	.batch-content {
		width: 100%;
		height: 70rem;
		background-color: #131a2d;
		/deep/ .little-nav__title {
			padding: 2.42rem 3.58rem 3.33rem;
			margin: 0;
		}
		/deep/ .ant-form-inline .ant-form-item {
			width: 100%;
			margin-top: 2rem;
			.ant-form-item-label {
				width: 15rem;
				text-align: start;
			}
		}
		/deep/ .ant-upload {
			border-color: red;
		}
		/deep/ .ant-input.ant-cascader-input::placeholder {
			font-size: 1rem;
			color: #81899c;
		}
		.content {
			padding: 0 9.17rem;
		}
		.progress {
			// margin-top: 10rem;
		}
		.explanation {
			margin-top: 4.33rem;
			color: @main-font-color;
			line-height: 6px;
			> p {
				font-size: 1rem;
			}
			> p:first-child {
				font-size: 1.17rem;
				> span {
					color: red;
				}
			}
		}
	}
}
.import-result-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	.info {
		color: #81899c;
		> span {
			padding: 0 0.5rem;
		}
		> span:last-child {
			color: red;
		}
	}
	.btn-group {
		padding: 0;
		margin-top: 2rem;
		> button:first-child {
			color: #81899c;
		}
	}
}
</style>