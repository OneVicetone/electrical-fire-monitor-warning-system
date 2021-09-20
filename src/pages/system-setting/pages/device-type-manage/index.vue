<template>
	<div>
		<a-form-model class="table-search-form" layout="inline" :model="searchForm">
			<a-form-model-item>
				<a-input v-model="searchForm.model" placeholder="请输入设备型号" size="small" />
			</a-form-model-item>
			<a-form-model-item>
				<a-button type="primary" size="small">搜索</a-button>
			</a-form-model-item>
			<a-form-model-item>
				<a-button type="primary" size="small" @click="add"><a-icon type="plus" />新增型号</a-button>
			</a-form-model-item>
		</a-form-model>

		<a-table :columns="columns" :data-source="tableData" :pagination="false">
			<div slot="idx" slot-scope="text, record, index">
				{{ index + 1 }}
			</div>
			<div slot="productImgPath" slot-scope="text">
				<img class="tabel-img" :src="text.productImgPath" />
			</div>
			<div slot="createTime" slot-scope="text">
				{{ text.createTime | filterTimeToYYYYMMDD }}
			</div>
			<div slot="updateTime" slot-scope="text">
				{{ text.updateTime | filterTimeToYYYYMMDD }}
			</div>
			<div slot="operate" slot-scope="text">
				<a @click="edit(text)">编辑</a>
				<a-divider type="vertical" />
				<a-popconfirm title="确定要删除吗？" ok-text="确定" cancel-text="取消" @confirm="deleteById(text)">
					<a>删除</a>
				</a-popconfirm>
			</div>
		</a-table>

		<Pagination
			:paginationData="paginationData"
			:changePageHandle="changePageHandle"
			:changePageSizeHandle="changePageSizeHandle"
		/>

		<Dialog
			v-model="isShowDialog"
			:title="`${isEdit ? '编辑' : '新增'}设备
        `"
		/>
	</div>
</template>

<script>
import { message as msg } from "ant-design-vue"

import Dialog from "components/Dialog.vue"
import Pagination from "components/Pagination.vue"

import apis from "apis"
import { commonMixin } from "mixins"

const { getDevicesTypeList, addDeviceType, updateDeviceTypeById, deleteDeviceType } = apis

export default {
	name: "DeviceTypeManage",
	mixins: [commonMixin],
	components: { Dialog, Pagination },
	data() {
		return {
			isShowDialog: false,
			isEdit: false,
			searchForm: {
				model: "",
			},
			columns: [
				{ title: "序号", scopedSlots: { customRender: "idx" } },
				{ title: "产品图片", scopedSlots: { customRender: "productImgPath" } },
				{ title: "设备型号", dataIndex: "model" },
				{ title: "设备类型", dataIndex: "deviceType" },
				{ title: "设备协议", dataIndex: "protocolType" },
				{ title: "供应商", dataIndex: "supplier" },
				{ title: "创建时间", scopedSlots: { customRender: "createTime" } },
				{ title: "修改时间", scopedSlots: { customRender: "updateTime" } },
				{ title: "操作", dataIndex: "", scopedSlots: { customRender: "operate" } },
			],

			tableData: [],
			paginationData: {
				total: 0,
				current: 1,
				size: 10,
			},
		}
	},
	mounted() {
		this.getTableData()
	},
	methods: {
		getTableData(current = 1, size = 10) {
			const params = {
				current,
				size,
				model: this.model,
			}
			getDevicesTypeList(params).then(({ data: { records, total, current, size } }) => {
				this.tableData = records
				this.paginationData = {
					...this.paginationData,
					total,
					current,
					size,
				}
			})
		},
		add() {
			this.isShowDialog = true
		},
		deleteById({ id }) {
			// console.log(data)
			deleteDeviceType(id).then(() => {
				msg.success("删除成功")
				const { current, size } = this.paginationData
				this.getTableData(current, size)
			})
		},
		edit(data) {},
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
.tabel-img {
	width: 5rem;
	height: 5rem;
}
</style>