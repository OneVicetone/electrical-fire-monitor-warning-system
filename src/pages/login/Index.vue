<template>
	<div class="login-container">
		<div class="login-form-container">
			<img src="@/assets/images/logo-has-text.png" alt="logo" />
			<div>
				<a-input class="username-input" v-model="username" palceholder="请输入用户账号" />
				<a-input class="password-input" type="password" v-model="password" palceholder="请输入用户密码" />
				<drag-verify
					ref="dragVerify"
					:width="getBasePx() * 31.85"
					text="请按住滑块拖动到最右边验证"
					radius="0px"
					background="transparent"
					successText="验证成功"
					:isPassing.sync="isPassing"
					handlerIcon="el-icon-right"
					successIcon="el-icon-check"
				>
				</drag-verify>
				<a-button type="primary" class="login-btn" block :disabled="!isPassing" :loading="isLogining" @click="toLogin"
					>登录</a-button
				>
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
import md5 from "md5"
import dragVerify from "vue-drag-verify2"
import { createNamespacedHelpers } from "vuex"
import { message as msg } from "ant-design-vue"

import { commonMixin } from "mixins"
import { getBasePx } from "utils/initial"
import { USERNAME } from "utils/storageConstant"
import { LOGIN, GET_MENU_LIST, GET_ROUTES_BY_MENU_LIST, SET_ROUTES } from "store/account"

const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers("account")
export default {
	name: "Login",

	mixins: [commonMixin],
	components: { dragVerify },
	data() {
		return {
			// username: "ww",
			// password: "BYkj8080",
			username: localStorage.getItem(USERNAME) || "",
			password: "",
			source: 1,
			saveLocalUserName: false,
			isLogining: false,
			isPassing: false,
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
				const { username, password, source, $router, setRoutes, login, addRoutes } = this
				if (!username) {
					this.isLogining = false
					return msg.error("用户名不能为空")
				}
				if (!password) {
					this.isLogining = false
					return msg.error("用户密码不能为空")
				}
				const formData = new FormData()
				formData.append("username", username)
				formData.append("password", md5(password))
				formData.append("source", source)
				await login(formData)
				setRoutes(this.routes)
				addRoutes(this.routes)
				msg.success("登录成功")
				$router.replace("/monitor")
			} catch (err) {
				this.isLogining = false
				console.error(err)
			}
		},
		getBasePx,
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
	background: url("~assets/images/login-bg.png") no-repeat;
	background-size: 100% 100%;
	.login-form-container {
		width: 45.17rem;
		height: 41.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: url("~assets/images/login-form-bg.png") no-repeat;
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
			.password-input {
				margin-bottom: 0;
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
		.drag_verify {
			margin: 2.75rem 0 2.92rem;
			// background: transparent !important;
			// color: #0096ff;
		}
		.ant-btn-primary[disabled] {
			background-color: transparent;
			color: #dcdcdc;
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