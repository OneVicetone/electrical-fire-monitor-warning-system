import Vue from 'vue'
import VueRouter from 'vue-router'
import Antd from 'ant-design-vue'
import Vuex from 'vuex'
import 'es6-promise/auto'

import router from './router'
import createStore from './store'
import App from './App.vue'

import './styles/initial.less'
import 'ant-design-vue/dist/antd.less';

import { initHtmlBasePx } from 'utils/initial'

Vue.use(Vuex)
Vue.use(Antd)
Vue.use(VueRouter)

Vue.prototype.log = (v) => console.log(v);

function main() {
    new Vue({
        render: h => h(App),
        router,
        store: createStore(Vuex)
    }).$mount('#app')

    initHtmlBasePx()
}

main()


