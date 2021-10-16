<template>
	<div class="simple-table">
		<div class="table-header">
			<div :class="`${column.wider ? 'wdier' : ''}`" v-for="column of columns" :key="column.key">
				{{ column.title }}
			</div>
		</div>
		<div class="table-data">
			<div class="table-body" v-for="item of tableData" :key="item.name">
				<div
					:class="`${column.wider ? 'wdier ' : ''}${valueIsStrOrNum(item[column.key]) ? 'alarm' : ''}`"
					v-for="column of columns"
					:key="column.key"
				>
					<a-popover v-if="valueIsStrOrNum(item[column.key])" placement="bottomLeft">
						<template slot="content">
							<p class="popover-info">
								报警时间: {{ item[column.key].alarmDate ? moment(item[column.key].alarmDate) : "-" }}
							</p>
							<p class="popover-info">{{item.name.split('(').shift()}}报警: {{ item[column.key].alarmValue || "-" }}</p>
						</template>
						<span class="popover-label">{{ item[column.key].alarmValue || "-" }}</span>
					</a-popover>
					<span v-else>{{ item[column.key] || "-" }}</span>
					<!-- {{ valueIsStrOrNum(item[column.key]) ? item[column.key].alarmValue : item[column.key] || "-" }} -->
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import moment from "moment"

export default {
	name: "SimpleTable",
	props: {
		columns: {
			type: Array,
			required: true,
		},
		tableData: Array,
	},
	mounted() {
		console.log(this.tableData)
	},
	methods: {
		moment,
		valueIsStrOrNum(val) {
			return val && typeof val !== "string" && typeof val !== "number"
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
			text-align: center;
			line-height: 2rem;
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
		.alarm {
			background-color: #fb5e4f;
			color: #fff;
			cursor: pointer;
			.popover-label {
				display: block;
				width: 100%;
				height: 100%;
			}
		}
	}
	.table-header > div {
		background-color: #0f1426;
	}
	.table-body > div {
		overflow: hidden;
		text-overflow: ellipsis;
		background-color: #131a2d;
	}
}
p.popover-info {
	margin: 0;
	color: #dcdcdc;
	font-size: 1rem;
}
</style>