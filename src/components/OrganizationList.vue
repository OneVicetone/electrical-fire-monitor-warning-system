<template>
	<div class="organization-list-container">
		<ContentTitle class="organization-title" title="组织架构列表" />
		<a-input-search placeholder="请输入分组关键字搜索" @change="search" size="small" />
		<a-tree
			:tree-data="treeData"
			@select="handleSelectFunc"
			:defaultExpandedKeys="expandedKeys"
			:key="treeElementKey"
		></a-tree>
	</div>
</template>

<script>
import ContentTitle from "./ContentTitle.vue"

export default {
	name: "OrganizationList",
	components: { ContentTitle },
	props: {
		treeData: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			treeElementKey: "beforeUpdate",
		}
	},
	computed: {
		expandedKeys() {
			return this.treeData.map(i => i.key)
		},
	},
	watch: {
		expandedKeys(val) {
			if (val.length > 0) this.treeElementKey = "updating"
		}
	},
	methods: {
		search({ target: { value } }) {},
		handleSelectFunc([nowSelctItemKey]) {
			const findNowSelectItemParentKey = (arr, key) => {
				for (let i = 0; i < arr.length; i++) {
					const { key: nowKey, children, parentId } = arr[i]
					const getObj = nowKey === key ? arr[i] : null
					if (!getObj && Array.isArray(children) && children.length > 0) {
						return findNowSelectItemParentKey(children, key)
					}
					if (getObj) {
						return parentId
					}
				}
			}
			const parentKey = findNowSelectItemParentKey(this.treeData, nowSelctItemKey)
			console.log("key --> ", nowSelctItemKey)
			console.log("parentKey --> ", parentKey)
			this.$emit("handleSelectFunc", parentKey)
		},
	},
}
</script>

<style lang="less" scoped>
.organization-list-container {
	width: 100%;
	height: 100%;
	// padding: 2.17rem 0 0;
	.organization-title {
		margin-top: 1.92rem;
		margin-bottom: 1.08rem;
	}
}
</style>