import apis from "apis"
import { optionsPlaceholder } from "utils/optionsData"

const { getSelectOptions } = apis

export const tableListMixin = {
	methods: {
		search() {
			const {
				paginationData: { current, size },
			} = this
			this.getTableData(current, size)
		},
		getOptionsListPromiseArr(optionsTypes = []) {
			return optionsTypes.map(i =>
				getSelectOptions(i).then(({ data }) => {
					const optionsKey = `${i}Options`
					this[optionsKey] = [
						{ label: optionsPlaceholder[optionsKey], value: "", remark: "" },
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
	},
}
