import Vue from "vue"
import VueRouter from "vue-router"
import Antd from "ant-design-vue"
import Vuex from "vuex"
import { DatetimePicker, Popup } from 'vant';

import router from "./router"
import createStore from "./store"
import App from "./App.vue"
import ElementUI from "@/assets/element/element-config"

import "./styles/initial.less"
import "ant-design-vue/dist/antd.less"
import "element-ui/lib/theme-chalk/index.css"
import 'vant/lib/index.css';

import { initHtmlBasePx } from "utils/initial"

Vue.use(Vuex)
Vue.use(Antd)
Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(DatetimePicker)
Vue.use(Popup)

function main() {
	new Vue({
		render: h => h(App),
		router,
		store: createStore(Vuex),
	}).$mount("#app")

	initHtmlBasePx()
}

main()
