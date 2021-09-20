<template>
	<ChildLayout :siderList="downLoadSiderList">
		<div>
			<a-form-model class="table-search-form" layout="inline" :model="searchForm">
				<a-form-model-item>
					<a-input v-model="searchForm.model" placeholder="请输入文件名称" size="small" />
				</a-form-model-item>
				<a-form-model-item>
					<a-button type="primary" size="small">搜索</a-button>
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
					<a>下载</a>
				</div>
			</a-table>

			<Pagination
				:paginationData="paginationData"
				:changePageHandle="changePageHandle"
				:changePageSizeHandle="changePageSizeHandle"
			/>
		</div>
	</ChildLayout>
</template>

<script>
import { message as msg } from "ant-design-vue"

import Pagination from "components/Pagination.vue"
import ChildLayout from "layouts/ChildLayout.vue"

import apis from "apis"
import { commonMixin } from "mixins"

// const { getDevicesTypeList, addDeviceType, updateDeviceTypeById, deleteDeviceType } = apis

export default {
	name: "DownloadCenter",
	mixins: [commonMixin],
	components: { Pagination, ChildLayout },
	data() {
		return {
			searchForm: {
				model: "",
			},
			downLoadSiderList: [this.$route],
			columns: [
				{ title: "序号", scopedSlots: { customRender: "idx" } },
				{ title: "下载日期", scopedSlots: { customRender: "productImgPath" } },
				{ title: "文件名称", dataIndex: "model" },
				{ title: "文件大小", dataIndex: "deviceType" },
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
		// this.getTableData()
	},
	methods: {
		getTableData(current = 1, size = 10) {
			const params = {
				current,
				size,
				model: this.model,
			}
			// getDevicesTypeList(params).then(({ data: { records, total, current, size } }) => {
			// 	this.tableData = records
			// 	this.paginationData = {
			// 		...this.paginationData,
			// 		total,
			// 		current,
			// 		size,
			// 	}
			// })
		},
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