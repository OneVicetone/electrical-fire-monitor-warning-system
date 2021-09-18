<template>
	<a-locale-provider :locale="locale">
		<RouterView />
	</a-locale-provider>
</template>

<script>
import { createNamespacedHelpers } from "vuex"

import zhCN from "ant-design-vue/lib/locale-provider/zh_CN"

import { commonMinix } from "./minixs"
import { GET_ROUTES_BY_MENU_LIST } from './store/account'

const { mapGetters } = createNamespacedHelpers("account")

export default {
	name: "App",
	mixins: [commonMinix],
	data() {
		return {
			locale: zhCN,
		}
	},
	computed: {
		...mapGetters({
			routes: GET_ROUTES_BY_MENU_LIST,
		}),
	},
	created() {
		this.routes && this.addRoutes(this.routes)
	},
}
</script>
<style lang="less">
	@import url("styles/public.less");
</style>
