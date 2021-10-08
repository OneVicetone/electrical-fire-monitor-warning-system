<template>
	<ChildLayout :siderList="downLoadSiderList">
		<div>
			<a-form-model class="table-search-form" layout="inline" :model="searchForm">
				<a-form-model-item>
					<a-input v-model="searchForm.downName" placeholder="请输入文件名称" size="small" />
				</a-form-model-item>
				<a-form-model-item>
					<a-button type="primary" size="small" @click="search">搜索</a-button>
				</a-form-model-item>
			</a-form-model>

			<a-table :columns="columns" :data-source="tableData" :pagination="false">
				<div slot="idx" slot-scope="text, record, index">
					{{ getListIdx(paginationData, index) }}
				</div>
				<div slot="downloadTime" slot-scope="text">
					{{ text.createTime | filterTimeToYYYYMMDD }}
				</div>
				<div slot="fileSize" slot-scope="text">
					{{ text.fileSize ? `${text.fileSize}KB` : "-" }}
				</div>
				<div slot="operate" slot-scope="text, record, index">
					<a @click="downloadFile(text.downUrl, index)">{{ text.hasDownload ? "重新下载" : "下载" }}</a>
				</div>
			</a-table>

			<Pagination
				:paginationData="paginationData"
				:changePageHandle="changePageHandle"
				:changePageSizeHandle="changePageSizeHandle"
			>
				<div class="table-footer">
					<img src="@/assets/icons/prompt-icon.png" />
					<span>该下载数据文件只保存近30天记录</span>
				</div>
			</Pagination>
		</div>
	</ChildLayout>
</template>

<script>
import { message as msg } from "ant-design-vue"
import { cloneDeep } from "lodash"

import Pagination from "components/Pagination.vue"
import ChildLayout from "layouts/ChildLayout.vue"

import apis from "apis"
import http from "utils/http"
import { commonMixin, tableListMixin } from "mixins"

const { getDownloadList, getDownloadCountById } = apis

export default {
	name: "DownloadCenter",
	mixins: [commonMixin, tableListMixin],
	components: { Pagination, ChildLayout },
	data() {
		return {
			searchForm: {
				downName: "",
			},
			downLoadSiderList: [this.$route],
			columns: [
				{ title: "序号", scopedSlots: { customRender: "idx" } },
				{ title: "下载日期", scopedSlots: { customRender: "downloadTime" } },
				{ title: "文件名称", dataIndex: "downName" },
				{ title: "文件大小", scopedSlots: { customRender: "fileSize" } },
				{ title: "操作", scopedSlots: { customRender: "operate" }, width: 100 },
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
				...this.searchForm,
			}
			return getDownloadList(params).then(({ data: { records, total, current, size } }) => {
				this.tableData = records
				this.paginationData = {
					...this.paginationData,
					total,
					current,
					size,
				}
			})
		},
		changePageHandle(page, pageSize) {
			this.getTableData(page, pageSize)
		},
		changePageSizeHandle(current, size) {
			this.getTableData(current, size)
		},
		downloadFile(url, index) {
			window.location = url
			const cpoyTableData = cloneDeep(this.tableData)
			cpoyTableData[index].hasDownload = true
			this.tableData = cpoyTableData
			// http.get(url).then(res => console.log(res))
		},
	},
}
</script>

<style lang="less" scoped>
.tabel-img {
	width: 5rem;
	height: 5rem;
}
.table-footer {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding-left: 1.25rem;
	color: #3f4a77;
	font-size: 1.17rem;
	> img {
		width: 1.17rem;
		height: 1.17rem;
	}
	> span {
		margin-left: 0.92rem;
	}
}
</style>