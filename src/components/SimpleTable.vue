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
            // required: true,
			default: () => [
				{ title: "名称", key: "name", wider: true },
				{ title: "1/A", key: "1a" },
				{ title: "2/B", key: "2b" },
				{ title: "3/C", key: "3c" },
				{ title: "4/N", key: "4n" },
			],
		},
		tableData: {
			type: Array,
			default: () => [
				{ name: "漏电(mA)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
				{ name: "温度(c)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
				{ name: "电压(V)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
				{ name: "电流(A)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
				{ name: "功率(W)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
				{ name: "电量(度)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
			],
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
		.wdier {
			width: 6.75rem;
		}
	}
	.tabel-header > div {
		background-color: #0f1426;
	}
}
</style>