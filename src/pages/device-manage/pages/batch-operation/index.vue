<template>
	<div class="batch-operations-container">
		<Breadcrumb :historyList="historyList" />
		<div class="batch-content">
			<NavTitles :title="operationName" />
			<div class="content">
				<a-form-model>
					<a-form-model-item label="1、下载模板，填写信息：">
						<a-button type="link" icon="download" @click="downloadTemplate">下载模板</a-button>
					</a-form-model-item>
					<a-form-model-item label="2、上传填写后的数据文件：">
						<a-upload>
							<a-button ghost icon="upload">上传文件</a-button>
						</a-upload>
					</a-form-model-item>
					<a-form-model-item v-if="operation_type === IMPORT" label="3、请选择数据范围：">
						<a-select />
						<a-select />
						<a-select />
					</a-form-model-item>
				</a-form-model>

				<!-- <a-form-model v-else-if="operation_type === TRANSFER"></a-form-model>
				<a-form-model v-else-if="operation_type === IMPORT"></a-form-model> -->

				<div class="btn-group">
					<a-button type="primary" @click="enter">确定</a-button>
					<a-button ghost @click="cancel">取消</a-button>
				</div>

				<div class="progress">
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
	</div>
</template>

<script>
import Breadcrumb from "components/Breadcrumb.vue"
import NavTitles from "components/NavTitles.vue"

import apis from "apis"

const { getCommonTemplateByType } = apis
import { batchKeytoName, SHIP, TRANSFER, IMPORT, templateTypeMap } from "utils/baseData"

export default {
	name: "BatchOperation",
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
			percent: 30,
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
	methods: {
		downloadTemplate() {
			getCommonTemplateByType(templateTypeMap[this.operation_type]).then(({ data }) => {
				console.log(data)
			})
		},
		enter() {
			switch (operation_type) {
				case SHIP:
					return
				case TRANSFER:
					return
				case IMPORT:
					return
			}
		},
		cancel() {
			this.$router.go(-1)
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
		.content {
			padding: 0 0 0 9.17rem;
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
</style>