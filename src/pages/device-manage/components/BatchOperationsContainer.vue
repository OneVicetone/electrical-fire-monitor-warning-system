<template>
	<div class="batch-operations-container">
		<Breadcrumb :historyList="historyList" />
		<div class="batch-content">
			<NavTitles :title="`批量${batchKeytoName[]}`" />
		</div>
	</div>
</template>

<script>
import Breadcrumb from "components/Breadcrumb.vue"
import NavTitles from "components/NavTitles.vue"


export default {
	name: "BatchOperationsContainer",
	components: { Breadcrumb, NavTitles },
	data() {
		return {
			batchKeytoName,
			historyList: ["首页", "设备管理", "批量导入"],
		}
	},
}
</script>

<style lang="less" scoped>
@import url("styles/common.less");

.batch-operations-container {
	.pages-container-no-child-layout();
	padding-left: 20rem;
	padding-right: 20rem;
	.batch-content {
		width: 100%;
		height: 70rem;
		background-color: #131a2d;
	}
}
</style>