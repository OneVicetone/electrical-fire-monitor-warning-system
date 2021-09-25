<template>
	<div class="pagination-container">
		<a-pagination
			:size="size"
			v-model="paginationData.current"
			:pageSize="paginationData.size"
			:total="paginationData.total"
			:show-total="(total, range) => `共${total}条 ${range[1]}页`"
			:show-size-changer="showSizeChanger"
			@showSizeChange="changePageSizeHandle"
			@change="changePageHandle"
			:showQuickJumper="showQuickJumper"
			:simple="simple"
		/>
		<slot />
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
				total: 200,
				current: 50,
				size: 10,
			},
		},
		size: {
			type: String,
		},
		showQuickJumper: {
			type: Boolean,
			default: true
		},
		showSizeChanger: {
			type: Boolean,
			default: true
		},
		simple: {
			type: Boolean,
			default: false
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
	margin: 2.75rem 0 0;
	.ant-pagination {
		position: absolute;
		top: 0;
		right: 0;
	}
	/deep/ .ant-pagination-total-text {
		font-size: 1rem;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #81899C;
	}
	/deep/ .ant-pagination-item-active {
		width: 2.5rem;
		height: 2.5rem;
		min-width: none;
		background: rgba(21, 35, 72, 0);
		line-height: 2.5rem;
		a {
			padding: 0;
		}
	}
}
</style>