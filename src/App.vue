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
		const { routes, $router, addRoutes } = this
		if (routes && Array.isArray(routes) && routes.length > 0) {
			addRoutes(this.routes)
		} else {
			$router.replace('/login')
		}
	},
}
</script>
