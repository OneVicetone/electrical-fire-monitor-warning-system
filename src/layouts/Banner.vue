<template>
	<div class="banner-container">
		<div class="left-contant">
			<div
				v-for="item in leftContentData"
				:class="`content-item ${nowPath === item.path ? 'active' : ''}`"
				:key="item.name"
				@click="toPath(item.path)"
			>
				{{ item.meta.title }}
			</div>
		</div>
		<div class="project-logo">
			<img src="@/assets/images/logo.png" alt="电放心" />
			<span class="logo-title">电放心 ･ </span>
			<span class="system-name">电气火灾预警监控平台</span>
		</div>
		<div class="right-contant">
			<div
				v-for="item in rightContentData"
				:class="`content-item ${nowPath.includes(item.path) ? 'active' : ''}`"
				:key="item.name"
				@click="toPath(item.path)"
			>
				{{ item.meta.title }}
			</div>
		</div>
		<BannerAccount />
	</div>
</template>

<script>
import { mapState } from "vuex"
import BannerAccount from "./BannerAccount.vue"
// import { leftContentData, rightContentData } from "utils/baseData";

export default {
	name: "Banner",
	components: { BannerAccount },
	data() {
		return {
			...mapState({
				routes: state => {
					console.log(state)
					return state
				},
			}),
			// leftContentData,
			// rightContentData,
		}
	},
	computed: {
		nowPath() {
			return this.$route.path
		},
		leftContentData() {
			// TODO: 用mapState获取routes
			const routes = this.$store.state.account.routes
			return routes.slice(0, Math.ceil(routes.length / 2))
		},
		rightContentData() {
			const routes = this.$store.state.account.routes
			return routes.slice(Math.ceil(routes.length / 2))
		},
	},
	methods: {
		toPath(path) {
			const routes = this.$store.state.account.routes
			const { path: localPath } = this.$route
			const childRoute = routes.find(i => i.path === path).children
			const defaultToChildIdx = 0
			let firstChildPath
			if (Array.isArray(childRoute) && childRoute.length > 0) {
				firstChildPath = `${path}/${childRoute[defaultToChildIdx].path}`
			} else {
				firstChildPath = path
			}
			localPath === firstChildPath || this.$router.push(firstChildPath)
		},
	},
}
</script>

<style lang="less" scoped>
@import url("styles/variables.less");

.banner-container {
	width: 100vw;
	height: @banner-include-logo-height;
	display: flex;
	justify-content: center;
	position: fixed;
	top: 0;
	background: url("~assets/images/banner-center.png") no-repeat;
	background-size: 100% 100%;
	z-index: 2;
}
.left-contant,
.right-contant {
	height: 46.6px;
	display: flex;
	justify-content: right;
}
.active {
	color: #fff;
	&::after {
		background-color: #aaddff;
		filter: blur(10px);
		opacity: 0.3;
	}
}
.content-item {
	width: 9.33rem;
	// height: 3.72rem;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	color: #aaddff;
	font-size: 1.33rem;
	cursor: pointer;
	transition: all 0.5s;
	&::after {
		content: "";
		width: 100%;
		height: 100%;
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		transform: scale(0.7);
	}
	&:hover {
		.active();
	}
}
.project-logo {
	width: 50.54rem;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: -0.5rem 0 0;
	> img {
		width: 2.67rem;
		height: 2.75rem;
		margin: 0 0.83rem 0 0;
	}
	> span {
		font-size: 2.33rem;
		color: #ffffff;
	}
	.logo-title {
		font-weight: bold;
		padding: 0 0.75rem 0 0;
	}
	.system-name {
		font-weight: 400;
	}
}
</style>