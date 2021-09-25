<template>
	<div class="alarm-list-container">
		<header>
			<a-icon type="left" @click="$router.go(-1)" />
			<h1>报警列表</h1>
			<a-icon type="filter" />
		</header>
		<section>
			<AlarmCard />
			<AlarmCard />
			<AlarmCard />
			<AlarmCard />
			<AlarmCard />
			<AlarmCard />
			<AlarmCard />
			<AlarmCard />
			<AlarmCard />
		</section>
	</div>
</template>

<script>
import { initHtmlBasePx } from "utils/initial"

import AlarmCard from "./components/AlarmCard.vue"

export default {
	name: "AlarmList",
	components: { AlarmCard },
	beforeCreate() {
		initHtmlBasePx(62.5)
	},
}
</script>

<style lang="less" scoped>
.alarm-list-container {
	> header {
		height: 7rem;
		padding: 0 3.25rem 0 2.08rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		top: 0;
		> h1 {
			font-size: 2.83rem;
			margin: 0;
		}
		> i[aria-label] {
			font-size: 3rem;
			color: #008da0;
		}
	}
	> section {
		height: calc(100vh - 7rem);
		padding: 1.75rem 1.17rem 0;
		background-color: #008da0;
		overflow-y: auto;
	}
}
</style>