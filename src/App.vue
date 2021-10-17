<template>
	<a-locale-provider :locale="locale">
		<RouterView />
	</a-locale-provider>
</template>

<script>
import { createNamespacedHelpers } from "vuex"

import zhCN from "ant-design-vue/lib/locale-provider/zh_CN"

import { commonMixin } from "./mixins"
import { isPC } from 'utils/commonFunctions'
import { phonePageRoutes } from "utils/baseData"
import { GET_ROUTES_BY_MENU_LIST } from "./store/account"

const { mapGetters } = createNamespacedHelpers("account")

export default {
	name: "App",
	mixins: [commonMixin],
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
		const { routes, $router, $route, addRoutes } = this
		if (routes && Array.isArray(routes) && routes.length > 0) {
			addRoutes(this.routes)
		} else {
			console.log('is pc ', isPC())
			console.log(phonePageRoutes)
			console.log($route)
			console.log(phonePageRoutes.includes($route.path))
			// !phonePageRoutes.includes($route.path) && $router.replace("/login")
			isPC() && $router.replace("/login")
		}
	},
}
</script>
<style lang="less">
@import url("styles/public.less");
</style>
