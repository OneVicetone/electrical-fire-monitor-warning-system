<template>
	<header>
		<div>{{ title }}</div>
	</header>
</template>

<script>
export default {
	name: "ContentTitle",
	props: {
		title: {
			type: String,
		},
	},
}
</script>

<style lang="less" scoped>
.bevel-pseudo-element {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	border-style: solid;
	border-color: transparent;
}
header {
	height: 1.83rem;
	margin: 0 0 0 1.68rem;
	// background: linear-gradient(90deg, #0096ff 0%, rgba(0, 150, 255, 0) 100%);
	background: url("assets/images/content-title-bg.png") no-repeat;
	position: relative;
	&::after {
		.bevel-pseudo-element();
		left: -5px;
		border-width: 20px 6px;
		// border-top-color: #090d18;
	}
	// opacity: 0.6;
	> div {
		padding: 0 0 0 10px;
		font-size: 1.33rem;
		font-weight: bold;
		position: relative;
		&::before {
			content: "";
			display: block;
			width: 1.48rem;
			height: 1.42rem;
			position: absolute;
			left: -1.68rem;
			top: 50%;
			transform: translateY(-50%);
			background: url("assets/icons/company.png") no-repeat;
			background-size: 100%;
		}
	}
}
</style>