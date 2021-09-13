<template>
	<div class="organization-list-container">
        <div>组织架构列表</div>
		<a-input-search placeholder="请输入分组关键字搜索" @change="search" size="small" />
		<a-tree :tree-data="treeData" @select="handleSelectFunc"></a-tree>
	</div>
</template>

<script>
export default {
	name: "OrganizationList",
	props: {
		treeData: {
			type: Array,
			default: [{ key: 1, title: "黑龙江农业银行", children: [{ key: 11, title: "黑龙江农业银行光明支行" }] }],
		},
        handleSelectFunc: {
            type: Function,
            default: key => console.log(key)
        }
	},
	methods: {
		search({ target: { value } }) {},
	},
}
</script>

<style lang="less" scoped>
.organization-list-container {
    width: 100%;
    height: 100%;
}
</style>