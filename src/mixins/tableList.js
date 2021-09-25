export const tableListMixin = {
	methods: {
		search() {
			const {
				paginationData: { current, size },
			} = this
			this.getTableData(current, size)
		},
	},
}
