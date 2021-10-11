<template>
	<div class="num-count-container" @click="itemClick">
		<div class="num-count-content">
			<span>{{ title }}</span>
			<div>
				<img v-if="icon" :src="icon" alt="icon" />
				<span :style="`color: ${numColor};`">{{ num }}</span>
			</div>
		</div>
		<a-divider v-if="afterHasDivider" type="vertical" />
	</div>
</template>

<script>
export default {
	name: "NumCount",
	props: {
		title: String,
		num: [String, Number],
		icon: String,
		numColor: String,
		afterHasDivider: {
			type: Boolean,
			default: true,
		},
		itemKey: String,
	},
	methods: {
		itemClick() {
			this.$emit("itemClick", this.itemKey)
		},
	},
}
</script>

<style lang="less" scoped>
.num-count-container {
	display: flex;
	align-items: center;
	cursor: pointer;
	.num-count-content {
		padding: 0 3rem 0 2rem;
		display: flex;
		flex-direction: column;
		color: #81899c;
		font-size: 1.17rem;
		> div {
			display: flex;
			align-items: center;
			color: #dcdcdc;
			font-size: 2.17rem;
			> img {
				width: 0.92rem;
				height: 1.67rem;
				margin: 0 0.5rem 0 0;
			}
		}
	}
	.ant-divider.ant-divider-vertical {
		height: 1.75rem;
		background-color: #3f4a77;
	}
}
</style>