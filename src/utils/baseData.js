export const leftContentData = [
	{ name: "实时监控", path: "/monitor" },
	{ name: "设备管理", path: "/device-manage" },
	{ name: "报警中心", path: "/alarm-center" },
]
const batchKeytoName = {
	ship: "发货",
	transfer: "转组",
	import: "导入",
}

const SHIP = 'ship' // 发货
const TRANSFER = 'transfer' // 转组
const IMPORT = 'import' // 导入

export {
	batchKeytoName,
	SHIP,
	TRANSFER,
	IMPORT
}