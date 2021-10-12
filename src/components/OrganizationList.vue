<template>
	<div class="organization-list-container">
		<ContentTitle class="organization-title" title="组织架构列表" />
		<a-input-search placeholder="请输入分组关键字搜索" @change="search" />
		<a-tree
			:tree-data="computeTreeData"
			:expandedKeys.sync="nowExpandedKeys"
			:key="treeElementKey"
			:autoExpandParent="autoExpandParent"
			showIcon
			@select="handleSelectFunc"
			@expand="onExpand"
		>
			<template slot="title" slot-scope="{ title }">
				<span v-if="title.indexOf(searchValue) > -1">
					{{ title.substr(0, title.indexOf(searchValue)) }}
					<span style="color: #f50">{{ searchValue }}</span>
					{{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
				</span>
				<span v-else>{{ title }}</span>
			</template>
			<template v-if="showRightMenu" #title="{ key: treeKey, title }">
				<a-dropdown :trigger="['contextmenu']">
					<span>{{ title }}</span>
					<template #overlay>
						<a-menu @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)">
							<a-menu-item key="Add">添加子级别</a-menu-item>
							<a-menu-item key="Edit">编辑分组</a-menu-item>
							<a-menu-item key="Delete">删除分组</a-menu-item>
						</a-menu>
					</template>
				</a-dropdown>
			</template>
			<a-icon slot="fileIcon" type="folder" />
		</a-tree>
	</div>
</template>

<script>
import { cloneDeep } from "lodash"

import ContentTitle from "./ContentTitle.vue"

const getParentKey = (key, tree) => {
	let parentKey
	for (let i = 0; i < tree.length; i++) {
		const node = tree[i]
		if (node.children) {
			if (node.children.some(item => item.key === key)) {
				parentKey = node.key
			} else if (getParentKey(key, node.children)) {
				parentKey = getParentKey(key, node.children)
			}
		}
	}
	return parentKey
}

export default {
	name: "OrganizationList",
	components: { ContentTitle },
	props: {
		treeData: {
			type: Array,
			required: true,
		},
		showRightMenu: Boolean,
	},
	data() {
		return {
			treeElementKey: "beforeUpdate",
			expandedKeys: [],
			autoExpandParent: true,
			searchValue: "",
			dataList: [],
			removedefaultExpand: false
		}
	},
	computed: {
		nowExpandedKeys() {
			const { searchValue, expandedKeys, defaultExpandedKeys, removedefaultExpand } = this
			return searchValue || removedefaultExpand ? expandedKeys : defaultExpandedKeys
		},
		defaultExpandedKeys() {
			return this.treeData.map(i => i.key)
		},
		computeTreeData() {
			const setIconSlot = data => {
				for (let i = 0; i < data.length; i++) {
					const item = data[i]
					item.slots = { icon: "fileIcon" }
					if (item.children && Array.isArray(item.children) && item.children.length > 0) {
						setIconSlot(item.children)
					}
				}
			}
			const treeDataCopy = cloneDeep(this.treeData)
			setIconSlot(treeDataCopy)
			return treeDataCopy
		},
	},
	watch: {
		expandedKeys(val) {
			if (val.length > 0) this.treeElementKey = "updating"
		},
		treeData(val) {
			if (val.length > 0) {
				this.generateList(val)
			}
		},
	},
	methods: {
		onExpand(expandedKeys) {
			this.expandedKeys = expandedKeys
			this.autoExpandParent = false
			this.removedefaultExpand = true
		},
		search({ target: { value } }) {
			const expandedKeys = this.dataList
				.map(item => {
					if (String(item.title).indexOf(value) > -1) {
						return getParentKey(item.key, this.treeData)
					}
					return null
				})
				.filter((item, i, self) => item && self.indexOf(item) === i)
			Object.assign(this, {
				expandedKeys,
				searchValue: value,
				autoExpandParent: true,
			})
		},
		generateList(data) {
			for (let i = 0; i < data.length; i++) {
				const node = data[i]
				const { key, title } = node
				this.dataList.push({ key, title })
				if (node.children) {
					this.generateList(node.children)
				}
			}
		},
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
			// console.log("key --> ", nowSelctItemKey)
			// console.log("parentKey --> ", parentKey)
			this.$emit("handleSelectFunc", parentKey)
		},
		onContextMenuClick(treeKey, menuKey) {
			this.$emit(`treeNode${menuKey}`, treeKey)
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