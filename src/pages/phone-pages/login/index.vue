<template>
	<div class="phone-login-container">
		<header>
			<h1>您好,</h1>
			<h2>欢迎使用电放心电气火灾监控系统</h2>
		</header>
		<section>
			<a-input placeholder="请输入登录账户" v-model="username">
				<a-icon slot="prefix" type="user" />
			</a-input>
			<a-input placeholder="请输入密码" v-model="password" type="password">
				<a-icon slot="prefix" type="lock" />
			</a-input>
			<a-button type="primary" block :loading="isLogining" @click="toLogin">登录</a-button>
		</section>
		<footer>
			<p>24小时客服热线：0755-36567158</p>
			<p>©深圳市标越科技有限公司</p>
		</footer>
		<a-icon class="close-page-btn" type="close" />
	</div>
</template>

<script>
import md5 from "md5"
import { createNamespacedHelpers } from "vuex"

import { initHtmlBasePx } from "utils/initial"
import { getCookieByKey } from "utils/commonFunctions"
import { LOGIN, GET_MENU_LIST } from "store/account"

const { mapActions } = createNamespacedHelpers("account")

export default {
	name: "PhoneLogin",
	data() {
		return {
			username: "ww",
			password: "BYkj8080",
			// username: "",
			// password: "",
			source: 3,
			isLogining: false,
		}
	},
	beforeCreate() {
		initHtmlBasePx(62.5)
	},
	methods: {
		...mapActions({
			login: LOGIN,
			getMenuList: GET_MENU_LIST,
		}),
		async toLogin() {
			this.isLogining = true
			try {
				const { username, password, source, $router, login } = this
				const formData = new FormData()
				formData.append("username", username)
				formData.append("password", md5(password))
				formData.append("source", source)
				formData.append("openId", getCookieByKey("openId"))
				await login(formData)
				// setRoutes(this.routes)
				// addRoutes(this.routes)
				$router.replace("/phone-alarm-list")
			} catch (err) {
				this.isLogining = false
				console.error(err)
			}
		},
	},
}
</script>

<style lang="less">
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
		.ant-input {
			background-color: #fff;
			border: none;
			border-bottom: 1px solid;
			border-color: #e5e5e5;
			border-radius: 0;
			color: #131a2d;
			&::focus {
				border: none;
				outline: none;
				box-shadow: none;
			}
			&::hover {
				border: none;
			}
		}
		.ant-input-affix-wrapper {
			margin-bottom: 9.08rem;
		}
		.ant-input-affix-wrapper:hover .ant-input:not(.ant-input-disabled) {
			border-color: #e5e5e5;
		}
		.ant-btn {
			height: 8.33rem;
		}
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