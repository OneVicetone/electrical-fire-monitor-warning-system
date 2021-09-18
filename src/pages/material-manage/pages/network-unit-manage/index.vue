<template>
	<div class="network-unit-manage-container">
		<div class="organization">
			<OrganizationList />
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
					<a-button type="primary" size="small">搜索</a-button>
				</a-form-model-item>
				<a-form-model-item>
					<a-button type="primary" size="small" @click="add"><a-icon type="plus" />新增单位</a-button>
				</a-form-model-item>
			</a-form-model>

			<a-table :columns="columns" :data-source="tableData">
				<div slot="idx" slot-scope="text, record, index">
					{{ index + 1 }}
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
					<a>重制密码</a>
					<a-divider type="vertical" />
					<a>编辑</a>
					<a-divider type="vertical" />
					<a @click="changeAccountStatus(!text.enable, text.id)">{{text.enable ? "禁用" : "启用"}}</a>
				</div>
			</a-table>

			<Pagination
				:paginationData="paginationData"
				:changePageHandle="changePageHandle"
				:changePageSizeHandle="changePageSizeHandle"
			/>
		</div>
		<new-add-unit v-model="isShowDialog"></new-add-unit>
	</div>
</template>

<script>
import moment from 'moment'

import newAddUnit from "./AddUnit.vue"
import OrganizationList from "components/OrganizationList.vue"
import Pagination from "components/Pagination.vue"

import { commonMinix } from 'minixs'
import apis from "apis"

const { getUnitList, createUnit, disableByUserId, enableByUserId, getUnitDetailById, getUnitTree } = apis

export default {
	name: "NetworkUnitManage",
	mixins: [commonMinix],
	components: { newAddUnit, OrganizationList, Pagination },
	data() {
		return {
			parentId: "",
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
			isShowDialog: false
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
				...this.searchForm,
				// TODO: 上级单位id
			}
			getUnitList(params).then(res => {
				const {
					data: { records, total, current, size },
				} = res.data
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
		delete(id) {},
		edit(id) {},
		changePageHandle(page, pageSize) {
			this.getTableData(page, pageSize)
		},
		changePageSizeHandle(current, size) {
			this.getTableData(current, size)
		},
		changeAccountStatus(status, id) {
			const func = res => {
				this.getTableData(this.paginationData)
			}
			if (status) {
				enableByUserId(id).then(func)
			} else {
				disableByUserId(id).then(func)
			}
		}
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