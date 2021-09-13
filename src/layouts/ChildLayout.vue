<template>
	<div class="child-layout">
		<a-layout>
			<a-layout-sider>
				<a-menu class="menu-container" theme="dark" mode="inline" :default-selected-keys="nowSelectMenu">
					<a-menu-item v-for="item of siderList" :key="item.name" @click="toPath(item.path)">
						<a-icon :type="item.icon" />
						<span class="nav-text">{{ item.meta.title }}</span>
					</a-menu-item>
				</a-menu>
			</a-layout-sider>
			<a-layout class="layout-content-container">
				<a-layout-content>
					<slot></slot>
				</a-layout-content>
			</a-layout>
		</a-layout>
	</div>
</template>

<script>
export default {
	name: "ChildLayout",
	props: {
		siderList: {
			type: Array,
			dafault: [],
		},
	},
	computed: {
		nowSelectMenu() {
			const {
				$route: { path },
				siderList,
			} = this
			const { name } = siderList.find(i => path.includes(i.path))
			return [name]
		},
	},
	methods: {
		toPath(path) {
			this.$router.push(path)
		}
	}
}
</script>

<style lang="less" scoped>
@import url("styles/variables.less");

.child-layout {
	// min-height: 100vh;
	.ant-layout.ant-layout-has-sider {
		height: @layout-height;
	}
	padding: @banner-no-include-logo-height 0 0;
	background-color: #12172a;
	.layout-content-container {
		height: auto;
		background-color: #12172a;
		padding: 4rem 2.58rem;
	}
	.ant-layout-content {
		height: auto;
		// height: 100%;
		
	}
}
</style>