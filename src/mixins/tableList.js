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
						{ label: optionsPlaceholder[optionsKey], value: 99, remark: "" },
						...data.map(({ id, parameterName, remark }) => ({
							remark,
							label: parameterName,
							value: id,
						})),
					]
				})
			)
		},
	},
}
