<template>
	<div class="pagination-container">
		<a-pagination
			show-size-changer
			v-model="paginationData.current"
			:pageSize="paginationData.pageSize"
			:total="paginationData.count"
			@showSizeChange="changePageSizeHandle"
			@change="changePageHandle"
			showQuickJumper
		/>
	</div>
</template>

<script>
export default {
	name: "Pagination",
	props: {
		paginationData: {
			type: Object,
			required: true,
			default: {
				count: 100,
				current: 1,
				pageSize: 10,
			},
		},
		changePageSizeHandle: {
			type: Function,
		},
		changePageHandle: {
			type: Function,
		},
	},
}
</script>

<style lang="less" scoped>
.pagination-container {
	width: 100%;
	position: relative;
	margin: 1rem 0 0;
	.ant-pagination {
		position: absolute;
		top: 0;
		right: 0;
	}
}
</style>