<template>
	<div class="phone-login-container">
		<header>
			<h1>您好,</h1>
			<h2>欢迎使用电放心电气火灾监控系统</h2>
		</header>
		<section></section>
		<footer>
			<p>24小时客服热线：0755-36567158</p>
			<p>©深圳市标越科技有限公司</p>
		</footer>
		<a-icon class="close-page-btn" type="close" />
	</div>
</template>

<script>
import { initHtmlBasePx } from "utils/initial"

export default {
	name: "PhoneLogin",
	beforeCreate() {
		initHtmlBasePx(62.5)
	},
}
</script>

<style lang="less" scoped>
.phone-login-container {
	width: 100vw;
	height: 100vh;
	padding: 0 3.33rem;
	background-color: #fff;
	position: relative;
	> header {
		padding: 15.67rem 0.59rem 10.42rem;
		color: #131a2d;
		> h1 {
			font-size: 4.83rem;
			font-weight: bold;
		}
		> h2 {
			font-size: 2.67rem;
			font-weight: 500;
		}
	}
	> section {
	}
	> footer {
		width: calc(100% - 3.33rem * 2);
		position: absolute;
		bottom: 5.75rem;
		> p {
			text-align: center;
			font-weight: 400;
		}
		> p:first-child {
			color: #313e5a;
			font-size: 2.17rem;
		}
		> p:last-child {
			color: #8593a8;
			font-size: 1.83rem;
			margin-bottom: 0;
		}
	}
	.close-page-btn {
		font-size: 3.67rem;
		color: #131a2d;
		position: absolute;
		top: 5.67rem;
		right: 2.92rem;
	}
}
</style>