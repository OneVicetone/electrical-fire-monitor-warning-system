<template>
	<div class="simple-table">
		<div class="table-header">
			<div :class="`${column.wider ? 'wdier' : ''}`" v-for="column of columns" :key="column.key">
				{{ column.title }}
			</div>
		</div>
		<div class="table-data">
			<div class="table-body" v-for="item of tableData" :key="item.name">
				<div :class="`${column.wider ? 'wdier' : ''}`" v-for="column of columns" :key="column.key">
					{{ item[column.key] || "-" }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "SimpleTable",
	props: {
		columns: {
			type: Array,
			required: true,
		},
		tableData: {
			type: Array,
		},
	},
}
</script>

<style lang="less" scoped>
.simple-table {
	.table-header,
	.table-body {
		display: flex;
		> div {
			width: 5.08rem;
			height: 2rem;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 1px solid #1f2944;
			border-collapse: collapse;
			font-size: 1rem;
			color: #aaddff;
		}
		> div:first-child {
			width: 8rem;
		}
		.wdier {
			width: 6.75rem;
		}
	}
	.tabel-header > div {
		background-color: #0f1426;
	}
}
</style>