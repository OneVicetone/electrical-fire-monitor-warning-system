<template>
	<div class="title-container">
		<span>{{ title }}</span>
	</div>
</template>

<script>
export default {
	name: "Title",
	props: {
		title: String,
	},
}
</script>

<style lang="less" scoped>
.title-container {
	width: 100%;
	height: 7.67rem;
	padding: 0 0 0 3.42rem;
	display: flex;
	align-items: center;
	background-color: transparent;
	> span {
		color: #445a79;
		font-size: 2.33rem;
		font-weight: 500;
		position: relative;
		&::before {
			content: "";
			display: inline-block;
			position: absolute;
			width: 0.58rem;
			height: 2.67rem;
			background-color: #0096ff;
			border-radius: 4px;
			top: 0.4rem;
			left: -1.5rem;
		}
	}
}
</style>