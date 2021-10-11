<template>
	<div class="network-unit-manage-container">
		<div class="organization">
			<OrganizationList :treeData="treeData" @handleSelectFunc="handleSelectTreeNode" />
		</div>
		<div class="network-unit-manage-content">
			<a-form-model class="table-search-form" layout="inline" :model="searchForm">
				<a-form-model-item>
					<a-input v-model="searchForm.name" placeholder="请输入机构名称" size="small" />
				</a-form-model-item>
				<a-form-model-item>
					<a-input v-model="searchForm.principalUserName" placeholder="请输入安全负责人名称" size="small" />
				</a-form-model-item>
				<a-form-model-item>
					<a-button type="primary" size="small" @click="search">搜索</a-button>
				</a-form-model-item>
				<a-form-model-item>
					<a-button type="primary" size="small" @click="add"><a-icon type="plus" />新增单位</a-button>
				</a-form-model-item>
			</a-form-model>

			<a-table :columns="columns" :data-source="tableData" :pagination="false">
				<div slot="idx" slot-scope="text, record, index">
					{{ getListIdx(paginationData, index) }}
				</div>
				<div slot="enable" slot-scope="text">
					{{ text.enable | filterAccountEnableStatus }}
				</div>
				<div slot="createTime" slot-scope="text">
					{{ text.createTime | filterTimeToYYYYMMDD }}
				</div>
				<div slot="updateTime" slot-scope="text">
					{{ text.updateTime | filterTimeToYYYYMMDD }}
				</div>
				<div slot="operate" slot-scope="text">
					<a @click="resetPassword(text.id, text.name)">重置密码</a>
					<a-divider type="vertical" />
					<a @click="editCell(text)">编辑</a>
					<a-divider type="vertical" />
					<a @click="changeAccountStatus(text.enable, text.id)">{{ text.enable ? "禁用" : "启用" }}</a>
				</div>
			</a-table>

			<Pagination
				:paginationData="paginationData"
				:changePageHandle="changePageHandle"
				:changePageSizeHandle="changePageSizeHandle"
			/>
		</div>
		<new-add-unit
			v-model="isShowDialog"
			:headerName="eventSource"
			:editForm="editForm"
			:groupOptions="treeData"
			@refresh-table="getTableData"
		></new-add-unit>
	</div>
</template>

<script>
import md5 from "md5"

import newAddUnit from "./AddUnit.vue"
import OrganizationList from "components/OrganizationList.vue"
import Pagination from "components/Pagination.vue"

import { commonMixin, tableListMixin } from "mixins"
import apis from "apis"

const { getUnitList, createUnit, disableByUserId, enableByUserId, getUnitDetailById, getGroupTree, changePassword } =
	apis

export default {
	name: "NetworkUnitManage",
	mixins: [commonMixin, tableListMixin],
	components: { newAddUnit, OrganizationList, Pagination },
	data() {
		return {
			parentId: null,
			searchForm: {
				name: "",
				principalUserName: "",
			},
			columns: [
				{ title: "序号", scopedSlots: { customRender: "idx" } },
				{ title: "联网单位", dataIndex: "name" },
				{ title: "安全负责人", dataIndex: "principalUserName" },
				{ title: "安全负责人电话", dataIndex: "mobile" },
				{ title: "账户状态", scopedSlots: { customRender: "enable" } },
				{ title: "创建时间", scopedSlots: { customRender: "createTime" } },
				{ title: "修改时间", scopedSlots: { customRender: "updateTime" } },
				{ title: "修改时间", dataIndex: "", key: "", scopedSlots: { customRender: "operate" } },
			],
			tableData: [],
			paginationData: {
				total: 0,
				current: 1,
				size: 10,
			},
			treeData: [],
			isShowDialog: false,
			editForm: {},
			eventSource: "",
		}
	},
	mounted() {
		const { getGroupTreeData, getTableData } = this
		Promise.allSettled([getGroupTreeData(), getTableData()])
	},
	methods: {
		getTableData(current = 1, size = 10) {
			const params = {
				current,
				size,
				...(this.parentId && { parentId: this.parentId }),
				...this.searchForm,
				// TODO: 上级单位id
			}
			getUnitList(params).then(({ data: { records, total, current, size } }) => {
				this.tableData = records
				this.paginationData = {
					...this.paginationData,
					total,
					current,
					size,
				}
			})
		},
		getGroupTreeData() {
			getGroupTree().then(({ data }) => {
				this.treeData = data
			})
		},
		add() {
			this.eventSource = "新增单位"
			this.editForm = {};
			this.isShowDialog = true
		},
		delete(id) {},
		editCell(text) {
			console.log(text)
			this.eventSource = "编辑单位"
			this.editForm = { ...text }
			this.isShowDialog = true
		},
		search() {
			const {
				paginationData: { current, size },
			} = this
			this.getTableData(current, size)
		},
		changePageHandle(page, pageSize) {
			this.getTableData(page, pageSize)
		},
		changePageSizeHandle(current, size) {
			this.getTableData(current, size)
		},
		resetPassword(userId, name) {
			const initialPassword = "Bykj8080"
			this.$confirm({
				content: `确定要重置用户账号:[${name}]密码吗？
							重制后初始密码为: ${initialPassword}`,
				onOk() {
					const params = {
						userId,
						password: "",
						newPassword: md5(initialPassword),
					}
					return new Promise(resolve => resolve(changePassword(params)))
				},
			})
		},
		changeAccountStatus(status, id) {
			const {
				paginationData: { current, size },
			} = this
			const func = () => {
				new Promise(resolve => resolve(this.getTableData(current, size)))
			}
			this.$confirm({
				content: `确认${status ? "禁用" : "启用"}此用户?`,
				onOk() {
					if (status) {
						return disableByUserId(id).then(func)
					} else {
						return enableByUserId(id).then(func)
					}
				},
			})
		},
		handleSelectTreeNode(key) {
			this.parentId = key
			this.search()
		},
	},
}
</script>

<style lang="less" scoped>
@import url("styles/common");

.network-unit-manage-container {
	.pages-container-has-child-layout();
	display: flex;
	padding: 0;
	margin: -48px 0 0;
	// overflow: hidden;
	.organization {
		width: 21.67rem;
		padding: 0 1.5rem;
		flex: 0 0 auto;
		border-right: 1px solid #3f4a77;
		overflow: hidden;
		text-overflow: ellipsis;
		// position: relative;
		// top: calc(20px);
	}
	.network-unit-manage-content {
		width: 100%;
		padding: 2rem 1.58rem 0;
	}
}
</style>