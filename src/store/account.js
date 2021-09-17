// import jwt from 'jsonwebtoken'
import apis from "apis"
import { cloneDeep } from "lodash"
import { TOKEN } from "utils/storageConstant"
import { pagesRoutes } from "@/router/routes"
import { menuListMockData } from "@/mock"

const { login, getUserMenuList } = apis

// getters name
const GET_ROUTES_BY_MENU_LIST = "get_routes_by_menu_list"

// mutations name
const SET_USERINFO = "set_userinfo"
const SET_MENU_LIST = "set_menu_list"
const SET_ROUTES = "set_routes"

// actions name
const LOGIN = "login"
const GET_MENU_LIST = "get_menu_list"

const initialState = {
	username: "",
	password: "",
	userInfo: {
		loginName: "",
		nickName: "",
		roleId: "",
		roleName: "",
		groupId: "",
		token: "",
	},
	menuList: [],
	routes: [],
	...(localStorage.getItem('vuex')?.account || {})
}

const accountModule = {
	namespaced: true,
	state() {
		return initialState
	},
	getters: {
		[GET_ROUTES_BY_MENU_LIST](state) {
			const getMenuInLocalRoutes = (menus, routes) => {
				const routeArr = []
				const allMenuList = cloneDeep(menus)
				const allLocalRoutes = cloneDeep(routes)
				const func = menuList => {
					menuList.forEach(menu => {
						const { name, childList, parentId } = menu
						let inLocalRoutes

						if (parentId === 0) {
							inLocalRoutes = allLocalRoutes.find(i => i.meta.title === name)
							routeArr.push({ ...inLocalRoutes, children: [] })
						} else {
							const { name: parentName } = allMenuList.find(j => j.id === parentId)
							const parentAtRouteIdx = allLocalRoutes.findIndex(k => k.meta.title === parentName)
							inLocalRoutes = allLocalRoutes[parentAtRouteIdx].children.find(i => i.meta.title === name)
							routeArr[parentAtRouteIdx].children.push({ ...inLocalRoutes, children: [] })
						}

						if (inLocalRoutes && Array.isArray(childList) && childList.length > 0) {
							return func(childList)
						} else {
							return routeArr
						}
					})
				}
				func(menus, routes)
				return routeArr
			}
			return getMenuInLocalRoutes(state.menuList, pagesRoutes)
		},
	},
	mutations: {
		[SET_USERINFO](state, payload) {
			const {
				headers: { authorization },
			} = payload
			// TODO: authorization 需要jwt揭解密
			state.userInfo.token = authorization
			localStorage.setItem(TOKEN, authorization)
		},
		[SET_MENU_LIST](state, payload) {
			state.menuList = payload
		},
		[SET_ROUTES](state, payload) {
			state.routes = payload
		}
	},
	actions: {
		async [LOGIN]({ commit, dispatch }, payload) {
			const res = await login(payload)
			commit(SET_USERINFO, res)
			dispatch(GET_MENU_LIST)
		},
		async [GET_MENU_LIST]({ commit }) {
			const res = await getUserMenuList()
			commit(SET_MENU_LIST, res.data.data)
			// commit(SET_MENU_LIST, menuListMockData)
		},
	},
}

export { accountModule as default, LOGIN, SET_USERINFO, GET_MENU_LIST, GET_ROUTES_BY_MENU_LIST, SET_ROUTES }
