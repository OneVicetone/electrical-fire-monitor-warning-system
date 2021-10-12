<template>
	<div class="label-and-value-container">
		<div class="label-list" :style="`color: ${labelColor};`">
			<p v-for="item of labels" :key="item.label">
				{{ item.label }}
			</p>
		</div>
		<div class="value-list" :style="`color: ${valueColor};`">
			<p v-for="item of labels" :key="item.label">
				{{ item.key && values[item.key] ? values[item.key] : "-" }}
				<a-button v-if="item.key === 'installPosition'" ghost size="small" @click="$emit('on-view-pic')">查看</a-button>
			</p>
		</div>
	</div>
</template>

<script>

export default {
	name: "LabelAndValue",
	props: {
		labels: {
			type: Array,
			required: true,
		},
		values: {
			type: Object,
		},
		labelColor: {
			type: String,
			default: "#81899c",
		},
		valueColor: {
			type: String,
			default: "#dcdcdc",
		},
	},
}
</script>

<style lang="less" scoped>
.label-and-value-container {
	display: flex;
	font-size: 1.2rem;
	padding: 0 1.83rem 2.25rem;
	> div {
		line-height: 12px;
	}
	.label-list {
		padding: 0 1rem 0 0;
	}
	.value-list {
		> p {
			position: relative;
			button {
				position: absolute;
				right: -8rem;
				top: -0.5rem;
			}
		}
	}
}
</style>