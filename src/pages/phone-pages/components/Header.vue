<template>
	<header>
		<a-icon class="back-icon" type="left" @click="$router.go(-1)" />
		<h1>{{ name }}</h1>
		<slot name="headerRightContent" />
		<div class="none-right-content" v-if="!$slots.headerRightContent"></div>
	</header>
</template>

<script>
export default {
	name: "Header",
	props: {
		name: String,
	},
}
</script>

<style lang="less" scoped>
header {
	height: 7rem;
	padding: 0 3.25rem 0 2.08rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	top: 0;
	.back-icon {
		font-size: 3.33rem;
		color: #000;
	}
	> h1 {
		font-size: 2.83rem;
		margin: 0;
	}
	.none-right-content {
		width: 3rem;
		height: 3rem;
	}
}
</style>