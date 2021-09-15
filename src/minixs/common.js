import { getBasePx } from "utils/initial"

export const commonMinix = {
	computed: {
		siderList() {
			const { routes } = this.$store.state.account
			return routes.find(route => this.$route.path.includes(route.path)).children
		},
	},
	methods: {
		getBasePx,
		toPath(path) {
			this.$router.push(path)
		},
		goBack() {
			this.$router.go(-1)
		}
	},
}
