<template>
	<div class="banner-account-container">
		<a-badge :count="notifyNum" :offset="[0, 0]" @click="toPath('/alarm-center')">
			<a-icon class="notify-icon" type="bell" />
		</a-badge>
		<div class="account">
			<a-avatar size="small" icon="user" />
			<a-popover v-model="isShowPopover">
				<a-list slot="content" size="small" :data-source="dropdownOptions">
					<a-list-item
						slot="renderItem"
						slot-scope="item"
						@click="
							() => {
								isShowPopover = false
								item.operate.call($router, $data)
							}
						"
					>
						<span class="list-item">{{ item.name }}</span>
					</a-list-item>
				</a-list>
				<a-button type="link" ghost @click="isShowPopover = true">
					您好，{{ userInfo.loginName }} <a-icon type="caret-down" />
				</a-button>
			</a-popover>
		</div>
		<Dialog v-model="isShowChangePasswordDialog" title="修改密码">
			<div class="change-password-dialog">
				<NavTitles title="修改密码" />
				<a-form-model :model="changePasswordForm">
					<a-form-model-item label="原密码">
						<a-input v-model="changePasswordForm.password" type="password" placeholder="请输入原密码" />
					</a-form-model-item>
					<a-form-model-item label="新密码">
						<a-input v-model="changePasswordForm.newPassword" type="password" placeholder="请输入新密码" />
					</a-form-model-item>
					<a-form-model-item label="确认密码">
						<a-input v-model="changePasswordForm.enterNewPassword" type="password" placeholder="请再次输入新密码" />
					</a-form-model-item>
				</a-form-model>
				<div class="btn-group">
					<a-button type="primary" @click="updatePassword">确定</a-button>
					<a-button ghost @click="cancelChangePassword">取消</a-button>
				</div>
			</div>
		</Dialog>
	</div>
</template>

<script>
import { cloneDeep } from "lodash"
import { message as msg } from "ant-design-vue"

import Dialog from "components/Dialog.vue"
import NavTitles from "components/NavTitles.vue"

import apis from "apis"
import { commonMixin } from "mixins"
const { loginout, changePassword, getUserNotifyNum } = apis

export default {
	name: "BannerAccount",
	mixins: [commonMixin],
	components: { NavTitles, Dialog },
	data() {
		return {
			isShowPopover: false,
			isShowChangePasswordDialog: false,
			changePasswordForm: {
				password: "",
				newPassword: "",
				enterNewPassword: "",
			},
			notifyNum: 0,
			dropdownOptions: [
				{
					name: "下载中心",
					operate() {
						this.push("/download-center")
					},
				},
				{ name: "报警设置", operate() {} },
				{
					name: "修改密码",
					operate(arg) {
						arg.isShowChangePasswordDialog = true
					},
				},
				{
					name: "退出登录",
					operate() {
						const self = this
						loginout().then(() => {
							localStorage.clear()
							self.push("/login")
						})
					},
				},
			],
		}
	},
	computed: {
		userInfo() {
			const { loginName, sub } = this.$store.state.account.userInfo
			return { loginName, sub }
		},
	},
	mounted() {
		this.getNotify()
	},
	methods: {
		resetChangePasswordForm() {
			this.isShowChangePasswordDialog = false
			const form = cloneDeep(this.changePasswordForm)
			for (let key in form) {
				form[key] = ""
			}
			this.changePasswordForm = form
		},
		updatePassword() {
			const { password, newPassword, enterNewPassword } = this.changePasswordForm
			if (!password) return msg.error("当前密码不能为空")
			if (!newPassword) return msg.error("新密码不能为空")
			if (newPassword !== enterNewPassword) return msg.error("两次输入密码不一致")
			const params = {
				userId: this.userInfo.sub,
				...this.changePasswordForm,
			}
			changePassword(params).then(() => {
				msg.success("修改成功, 请使用新密码重新登录")
				this.resetChangePasswordForm()
				localStorage.clear()
				this.toPath("/login")
			})
		},
		cancelChangePassword() {
			this.resetChangePasswordForm()
		},
		getNotify() {
			return getUserNotifyNum().then(({ data }) => (this.notifyNum = data))
		},
	},
}
</script>

<style lang="less" scoped>
@import url("styles/variables.less");

.banner-account-container {
	height: @banner-no-include-logo-height;
	display: flex;
	align-items: center;
	position: fixed;
	top: 0;
	right: 0;
	.ant-badg .ant-badge-count {
		height: 14px;
		line-height: 14px;
		transform: scale(0.2);
	}
	.notify-icon {
		font-size: 1.67rem;
	}
	.account {
		margin: 0 0 0 30px;
	}
}
.ant-popover-inner {
	background-color: #000;
}
.ant-list .ant-list-item span {
	cursor: pointer;
}
.change-password-dialog {
	padding: 2.75rem 8.67rem;
	.btn-group {
		display: flex;
		justify-content: center;
		> button {
			margin: 0 0.5rem;
		}
	}
}
</style>