<template>
	<div>
		<a-form-model class="table-search-form" layout="inline" :model="searchForm">
			<a-form-model-item>
				<a-input v-model="searchForm.roleName" placeholder="请输入角色名称" />
			</a-form-model-item>
			<a-form-model-item>
				<a-button type="primary">搜索</a-button>
			</a-form-model-item>
			<a-form-model-item>
				<a-button type="primary" @click="add"><a-icon type="plus" />新增角色</a-button>
			</a-form-model-item>
		</a-form-model>

		<a-table :columns="columns" :data-source="tableData" :pagination="false">
			<div slot="operate">
				<a>编辑</a>
				<a-divider type="vertical" />
				<a>删除</a>
			</div>
		</a-table>
		
		<Pagination :paginationData="paginationData" :changePageHandle="changePageHandle" :changePageSizeHandle="changePageSizeHandle" />

		<Dialog v-model="isShowDialog" :title="`${isEdit ? '编辑' : '新增'}角色`">
			<div class="form-container">
				<a-form-model :model="addAndEditForm" layout="horizontal" :labelCol="formLabelCol" :wrapperCol="formWrapperCol">
					<a-form-model-item label="角色名称" prop="roleName">
						<a-input v-model="addAndEditForm.roleName" placeholder="请输入角色名称" />
					</a-form-model-item>
					<a-form-model-item label="角色描述" prop="roleDescribe">
						<a-input v-model="addAndEditForm.roleDescribe" placeholder="请输入角色名称" />
					</a-form-model-item>
					<a-form-model-item label="角色分类" prop="roleClass">
						<a-select v-model="addAndEditForm.roleClass" placeholder="请输入角色名称" />
					</a-form-model-item>
					<a-form-model-item label="角色权限" prop="roleClass">
						<a-radio-group v-model="purviewType">
							<a-radio-button v-for="option of purviewOptions" :value="option.value" :key="option.value">
								{{ option.text }}
							</a-radio-button>
						</a-radio-group>
						<div class="tree-checkout-container">
							<a-tree checkable :tree-data="menuTreeData"> </a-tree>
						</div>
					</a-form-model-item>
				</a-form-model>
			</div>
			<div class="footer-btn-group">
				<a-button type="primary">确定</a-button>
				<a-button ghost>取消</a-button>
			</div>
		</Dialog>
	</div>
</template>

<script>
import Dialog from "components/Dialog.vue"
import Pagination from "components/Pagination.vue"

import apis from 'apis'

export default {
	name: "RoleManage",
	components: { Dialog, Pagination },
	data() {
		return {
			isShowDialog: false,
			isEdit: false,
			formLabelCol: { span: 3 },
			formWrapperCol: { span: 12 },
			searchForm: {
				roleName: "",
			},
			addAndEditForm: {
				roleName: "",
				roleDescribe: "",
				roleClass: "",
			},
			purviewType: "web",
			purviewOptions: [
				{ value: "web", text: "WEB端" },
				{ value: "app", text: "APP端" },
			],
			roleClassOptions: [],
			columns: [
				{ title: "序号", dataIndex: "", key: "" },
				{ title: "角色名称", dataIndex: "", key: "" },
				{ title: "角色分类", dataIndex: "", key: "" },
				{ title: "角色描述", dataIndex: "", key: "" },
				{ title: "创建人", dataIndex: "", key: "" },
				{ title: "创建时间", dataIndex: "", key: "" },
				{ title: "修改时间", dataIndex: "", key: "", scopedSlots: { customRender: "operate" } },
			],
			tableData: [],
			paginationData: {
				total: 0,
				current: 1,
				size: 10,
			},
			menuTreeData: [],
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
.footer-btn-group {
	width: 100%;
	display: flex;
	justify-content: center;
	> button {
		margin: 0 0.625rem;
	}
}
.form-container {
	padding: 2.75rem 6.58rem;
	.tree-checkout-container {
		height: 27.25rem;
		margin: 1rem 0 0;
		border: 1px solid #3F4A77;
		overflow: auto;
	}
}
</style>