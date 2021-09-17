const optionsPlaceholder = {
	allOptionsData: "",
	alarmLevelOptions: "",
	deviceIdOptions: "",
	handleStatusOptions: "",
	deviceTypeOptions: "",
	deviceIdOptions: ""
}
const allOptionsData = {
	alarmTypeOptions: [
		{ label: "漏电报警", value: 1 },
		{ label: "过流报警", value: 2 },
		{ label: "过压报警", value: 3 },
		{ label: "欠压报警", value: 4 },
		{ label: "断电报警", value: 5 },
		{ label: "过温报警", value: 6 },
		{ label: "离线报警", value: 7 },
		{ label: "缺相报警", value: 8 },
	],
	alarmLevelOptions: [
		{ label: "高危", value: 1 },
		{ label: "预警", value: 2 },
		{ label: "正常", value: 3 },
	],
	deviceIdOptions: [
		{ label: "BY-001", value: 1 },
		{ label: "BY-002", value: 2 },
		{ label: "BY-003", value: 3 },
	],
	handleStatusOptions: [
		{ label: "待处理", value: 1 },
		{ label: "已处理", value: 2 },
		{ label: "已恢复", value: 3 },
	],

	deviceTypeOptions: [
		{ label: "电气火灾探测器", value: 1 },
		{ label: "智能空气开关", value: 2 },
	],
	deviceIdOptions: [
		{ label: "BY-001", value: 1 },
		{ label: "BY-002", value: 2 },
		{ label: "BY-003", value: 3 },
	],
}

for (let key in allOptionsData) {
    const defaultSelectItem = {
        label: "请选择",
        value: "0"
    }
    allOptionsData[key].unshift(defaultSelectItem)
}

export default allOptionsData