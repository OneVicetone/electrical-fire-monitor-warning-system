<template>
	<div class="label-and-value-container">
		<div class="label-list">
			<p v-for="item of labels" :key="item.label">
				{{ item.label }}
			</p>
		</div>
		<div class="value-list">
			<p v-for="item of labels" :key="item.label">
				{{ item.key && values[item.key] ? values[item.key] : "-" }}
				<a-button v-if="item.key === 'installPosition'" ghost size="small">查看</a-button>
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
	},
}
</script>

<style lang="less" scoped>
.label-and-value-container {
	display: flex;
	font-size: 1rem;
	padding: 0 1.83rem 2.25rem;
	> div {
		line-height: 12px;
	}
	.label-list {
		color: #81899c;
		padding: 0 1rem 0 0;
	}
	.value-list {
		color: #dcdcdc;
        > p {
            position: relative;
            button {
                position: absolute;
                right: 0;
            }
        }
	}
}
</style>