<template>
	<div class="login-container">
		<div class="login-form">
			<a-input palceholder="请输入用户账号" />
			<a-input-password palceholder="请输入用户密码" />
			<a-button class="login-btn" @click="toLogin">登录</a-button>
		</div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import md5 from "md5"
import { LOGIN, GET_MENU_LIST, GET_ROUTES_BY_MENU_LIST, SET_ROUTES } from 'store/account'

const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers('account')
export default {
	name: "Login",
	data() {
		return {
			username: "ww",
			password: "BYkj8080",
			source: 1,
		}
	},
	computed: mapGetters({
		routes: GET_ROUTES_BY_MENU_LIST
	}),
	methods: {
		...mapMutations({
			setRoutes: SET_ROUTES
		}),
		...mapActions({
			login: LOGIN,
			getMenuList: GET_MENU_LIST,
		}),
		toLogin() {
			const { username, password, source, $router, setRoutes, login, getMenuList  } = this
			const formData = new FormData()
			formData.append("username", username)
			formData.append("password", md5(password))
			formData.append("source", source)
			login(formData)
			getMenuList()
			setRoutes(this.routes)
			this.routes.forEach(route => $router.addRoute('Layout', route))
			this.$router.push('/device-manage')
		},
	},
}
</script>

<style lang="less" scoped>
.login-container {
	width: 100vw;
	height: 100vh;
	background-color: #12172a;
	.login-form {
		width: 50%;
		height: 40%;
	}
}
</style>