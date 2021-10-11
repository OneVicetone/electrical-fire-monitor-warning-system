import apis from "apis"
import { isPC } from "utils/commonFunctions"
import { optionsPlaceholder } from "utils/optionsData"

const { getSelectOptions, getDeviceIdOptionsData } = apis

export const tableListMixin = {
	methods: {
		search(getDataFuncName) {
			if (typeof getDataFuncName !== "string") {
				getDataFuncName = "getTableData"
			}
			const {
				paginationData: { current, size },
			} = this
			return this[getDataFuncName](current, size)
		},
		getOptionsListPromiseArr(optionsTypes = []) {
			return optionsTypes.map(i =>
				getSelectOptions(i).then(({ data }) => {
					const optionsKey = `${i}Options`
					this[optionsKey] = [
						{
							label: isPC() ? optionsPlaceholder[optionsKey] : optionsPlaceholder["phoneSelectDefaultSelected"],
							value: "",
							remark: "",
						},
						...data.map(({ code, name, remark }) => ({
							remark,
							label: name,
							value: code,
						})),
					]
				})
			)
		},
		getListIdx({ current, size }, index) {
			const idx = index + 1
			const currentNum = (current - 1) * size
			return currentNum + idx
		},
		getDeviceId(typeId = 0) {
			return getDeviceIdOptionsData(typeId).then(({ data }) => {
				this.deviceIdOptions = [
					{ label: optionsPlaceholder["deviceIdOptions"], value: "" },
					...data.map(({ parameterName, parameterCode }) => ({
						label: parameterName,
						value: parameterCode,
					})),
				]
			})
		},
		setSearchFormByQuery() {
			const { query } = this.$route
			for (let key in query) {
				if (!isNaN(query[key])) {
					query[key] = Number(query[key])
				}
			}
			this.searchForm = {
				...this.searchForm,
				...query,
			}
		},
	},
}
