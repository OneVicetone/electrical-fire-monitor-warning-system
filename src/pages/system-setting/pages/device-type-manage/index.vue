<template>
	<div>
		<a-form-model class="table-search-form" layout="inline" :model="searchForm">
			<a-form-model-item>
				<a-input v-model="searchForm.roleName" placeholder="请输入设备型号" size="small" />
			</a-form-model-item>
			<a-form-model-item>
				<a-button type="primary" size="small">搜索</a-button>
			</a-form-model-item>
			<a-form-model-item>
				<a-button type="primary" size="small" @click="add"><a-icon type="plus" />新增型号</a-button>
			</a-form-model-item>
		</a-form-model>

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

		<Dialog v-model="isShowDialog" :title="`${isEdit ? '编辑' : '新增'}设备
        `" />
	</div>
</template>

<script>
import Dialog from "components/Dialog.vue"
import Pagination from "components/Pagination.vue"

export default {
	name: "DeviceTypeManage",
    components: { Dialog, Pagination },
	data() {
		return {
			isShowDialog: false,
			isEdit: false,
			searchForm: {
				roleName: "",
			},
			columns: [
				{ title: "序号", dataIndex: "", key: "" },
				{ title: "产品图片", dataIndex: "", key: "" },
				{ title: "设备型号", dataIndex: "", key: "" },
				{ title: "设备类型", dataIndex: "", key: "" },
				{ title: "设备协议", dataIndex: "", key: "" },
				{ title: "供应商", dataIndex: "", key: "" },
				{ title: "创建时间", dataIndex: "", key: "" },
				{ title: "修改时间", dataIndex: "", key: "" },
				{ title: "修改时间", dataIndex: "", key: "", scopedSlots: { customRender: "operate" } },
			],
			tableData: [],
			paginationData: {
				count: 0,
				current: 1,
				pageSize: 10,
			},
		}
	},
	methods: {
		getTableData(current = 1, size = 10) {},
		add() {
			this.isShowDialog = true
		},
		delete(id) {},
		edit(id) {},
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
</style>