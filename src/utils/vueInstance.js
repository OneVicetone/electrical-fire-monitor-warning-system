import Vue from "vue"
import VueRouter from "vue-router"

import router from "@/router"

const getVueInstance = () => {
	Vue.use(VueRouter)
	return new Vue({
		router,
	})
}

export default getVueInstance
