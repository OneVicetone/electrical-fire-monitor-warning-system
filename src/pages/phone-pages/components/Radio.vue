<template>
	<div class="radio-container">
		<div
			:class="checked === item.value ? 'active' : ''"
			v-for="item of options"
			:key="item.value"
			@click="$emit('change', item.value)"
		>
			{{ item.label }}
		</div>
	</div>
</template>

<script>
export default {
	name: "Radio",
	model: {
		prop: "checked",
		event: "change",
	},
	props: {
		checked: {
			type: [String, Number],
			required: true,
		},
		options: {
			type: Array,
			required: true,
		},
	},
}
</script>

<style lang="less" scoped>
.radio-container {
	width: 100%;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	background-color: transparent;
	.activeAndHover {
		border-color: #0096ff;
		background-color: rgba(0, 150, 255, 0.2);
	}
	> div {
		width: 16.75rem;
		height: 5.08rem;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 1rem 1.125rem;
		background-color: #f5f5f5;
		border: 1px solid;
		border-color: transparent;
		border-radius: 4px;
		color: #445a79;
		font-size: 2rem;
		transition: all 0.5s;
		&.active {
			.activeAndHover();
		}
		&:hover {
			.activeAndHover();
		}
	}
}
</style>