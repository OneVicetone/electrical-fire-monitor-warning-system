const optionsPlaceholder = {
	groupTypeOptions: "请选择单位",
	alarmTypeOptions: "请选择报警类型",
	alarmLevelOptions: "请选择报警级别",
	// deviceIdOptions: "请选择设备编号",
	handleStatusOptions: "请选择报警处理状态",
	deviceTypeOptions: "请选择设备类型",
	deviceIdOptions: "请选择设备型号",
	networkTypeOptions: "请选择联网方式",
	needGatewayOptions: "请选择是否需要网关",
	protocolTypeOptions: "请选择设备协议",
	phoneSelectDefaultSelected: "全部",
	phoneAlarmLevelOptions: "全部",
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
	phoneAlarmLevelOptions: [
		{ label: "高危", value: 1 },
		{ label: "预警", value: 2 },
	],
	deviceIdOptions: [
		{ label: "BY-001", value: 1 },
		{ label: "BY-002", value: 2 },
		{ label: "BY-003", value: 3 },
	],
	handleStatusOptions: [
		{ label: "未处理", value: 1 },
		{ label: "已处理", value: 3 },
		{ label: "已恢复", value: 2 },
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
	networkTypeOptions: [
		{ label: "蜂窝（2G/3G/4G)", value: 0 },
		{ label: "NB", value: 1 },
	],
	needGatewayOptions: [
		{ label: "是", value: 0 },
		{ label: "否", value: 1 },
	],
}

for (let key in allOptionsData) {
	const defaultSelectItem = {
		label: optionsPlaceholder[key],
		value: "",
	}
	allOptionsData[key].unshift(defaultSelectItem)
}

export { allOptionsData as default, optionsPlaceholder }
