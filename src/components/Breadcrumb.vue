<template>
	<div class="breadcrumb-container">
		<a-breadcrumb>
			<a-breadcrumb-item v-for="item of historyList" :key="item">{{ item }}</a-breadcrumb-item>
		</a-breadcrumb>
		<a-button type="primary" ghost size="small" @click="goBack"> <a-icon type="left" />返回上一级 </a-button>
	</div>
</template>

<script>
import { commonMixin } from "mixins"

export default {
	name: "Breadcrumb",
	mixins: [commonMixin],
	props: {
		historyList: {
			type: Array,
			required: true,
		},
	},
}
</script>

<style lang="less" scoped>
.breadcrumb-container {
    max-height: 4.42rem;
    padding: 0 0 0 0.92rem;
    margin: 2.25rem 0;
	display: flex;
	align-items: center;
	> button.ant-btn {
		margin: 0 0 0 8px;
	}
}
</style>