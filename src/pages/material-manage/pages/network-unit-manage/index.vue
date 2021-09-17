<template>
	<div class="network-unit-manage-container">
		<div class="organization">
			<OrganizationList />
		</div>
		<div class="network-unit-manage-content">
			<a-form-model class="table-search-form" layout="inline" :model="searchForm">
				<a-form-model-item>
					<a-input v-model="searchForm.roleName" placeholder="请输入角色名称" size="small" />
				</a-form-model-item>
				<a-form-model-item>
					<a-button type="primary" size="small">搜索</a-button>
				</a-form-model-item>
				<a-form-model-item>
					<a-button type="primary" size="small" @click="add"><a-icon type="plus" />新增角色</a-button>
				</a-form-model-item>
			</a-form-model>

			<a-table :columns="columns" :data-source="tableData">
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
		</div>
	</div>
</template>

<script>
import OrganizationList from "components/OrganizationList.vue"
import Pagination from "components/Pagination.vue"

import apis from 'apis'

const { getUserMenuList } = apis

export default {
	name: "NetworkUnitManage",
	components: { OrganizationList, Pagination },
	data() {
		return {
			searchForm: {},
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
@import url("styles/common");

.network-unit-manage-container {
	.pages-container-has-child-layout();
	// overflow: hidden;
	.organization {
		width: 21.67rem;
		height: 100vh;
		padding: 0 1.5rem;
		border-right: 1px solid #3f4a77;
		position: relative;
		top: calc(0px - 4rem - 43px);
	}
}
</style>