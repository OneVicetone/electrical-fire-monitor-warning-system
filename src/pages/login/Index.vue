<template>
	<div class="login-container">
		<div class="login-form-container">
			<img src="assets/images/logo-has-text.png" alt="logo" />
			<div>
				<a-input class="username-input" v-model="username" palceholder="请输入用户账号" />
				<a-input class="password-input" type="password" v-model="password" palceholder="请输入用户密码" />
				<a-button type="primary" class="login-btn" block :loading="isLogining" @click="toLogin">登录</a-button>
				<a-checkbox v-model="saveLocalUserName">记住用户名</a-checkbox>
			</div>
		</div>
		<div class="footer-text">
			© 2013-2021 深圳市标越科技有限公司 版权所有 粤ICP备13062443号-9 粤公网安备 44030602005750号
			客服电话：0755-36567158
		</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from "vuex"
import md5 from "md5"
import { LOGIN, GET_MENU_LIST, GET_ROUTES_BY_MENU_LIST, SET_ROUTES } from "store/account"
import { USERNAME } from "utils/storageConstant"

const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers("account")
export default {
	name: "Login",
	data() {
		return {
			username: "ww",
			password: "BYkj8080",

			source: 1,
			// username: localStorage.getItem(USERNAME) || "",
			// password: "",
			// source: 1,
			saveLocalUserName: false,
			isLogining: false,
		}
	},
	computed: mapGetters({
		routes: GET_ROUTES_BY_MENU_LIST,
	}),
	methods: {
		...mapMutations({
			setRoutes: SET_ROUTES,
		}),
		...mapActions({
			login: LOGIN,
			getMenuList: GET_MENU_LIST,
		}),
		async toLogin() {
			this.isLogining = true
			try {
				const { username, password, source, $router, setRoutes, login, getMenuList } = this
				const formData = new FormData()
				formData.append("username", username)
				formData.append("password", md5(password))
				formData.append("source", source)
				await login(formData)
				setRoutes(this.routes)
				this.routes.forEach(route => $router.addRoute("Layout", route))
				this.$router.push("/device-manage")
			} catch (err) {
				this.isLogining = false
				console.error(err)
			}
		},
		saveLocalUserName() {
			this.username && localStorage.setItem(USERNAME, this.username)
		},
	},
	watch: {
		saveLocalUserName(val) {
			if (val && this.username) {
				this.username && localStorage.setItem(USERNAME, this.username)
			} else if (!val) {
				localStorage.removeItem(USERNAME)
			}
		},
	},
}
</script>

<style lang="less">
.login-container {
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background: url("assets/images/login-bg.png") no-repeat;
	background-size: 100% 100%;
	.login-form-container {
		width: 45.17rem;
		height: 41.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: url("assets/images/login-form-bg.png") no-repeat;
		background-size: 100% 100%;
		> img {
			margin: 1.5rem 0 0;
			width: 35rem;
			height: 10.5rem;
		}
		> div {
			width: 31.85rem;
			.username-input,
			.password-input {
				margin: -1rem 0 5rem;
				border: none;
				border-bottom: 1px solid #4c8bff;
				border-radius: 0;
				background-color: transparent;
				&:focus {
					box-shadow: none;
				}
				&::placeholder {
					color: #81899c;
				}
			}
			> button {
				height: 4.16rem;
			}
			.ant-checkbox-wrapper {
				margin: 2.58rem 0 0;
				color: #81899c;
				font-size: 1.11rem;
				.ant-checkbox {
					.ant-checkbox-inner {
						border-radius: 50%;
					}
				}
			}
		}
	}
	.footer-text {
		width: 49.92rem;
		text-align: center;
		margin: 9.75rem;
		font-size: 1rem;
		font-weight: 400;
		color: #a6abe4;
	}
}
</style>