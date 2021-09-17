import moment from "moment"
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
		},
	},
	filters: {
		filterNull(val) {
			if (!val) {
				return "-"
			}
		},
		filterTimeToYYYYMMDD(val) {
			return moment(val).format("YYYY-MM-DD")
		},
		filterAlarmStatus(val) {
			switch (val) {
				case 1:
					return "报警中"
				case 2:
					return "已恢复"
				case 3:
					return "已处理"
				default:
					return "-"
			}
		},
		filterAlarmLevel(val) {
			switch (val) {
				case 1:
					return "预警"
				case 2:
					return "高危"
				default:
					return "-"
			}
		},
	},
}
