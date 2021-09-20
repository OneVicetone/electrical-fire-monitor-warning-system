import Layout from "layouts/Layout.vue"

const Login = () => import("pages/login/index.vue")
const Monitor = () => import("pages/monitor/index.vue")
const DeviceManage = () => import("pages/device-manage/index.vue")
const AlarmCenter = () => import("pages/alarm-center/index.vue")
const StatisticalReport = () => import("pages/statistical-report/index.vue")
const MaterialManage = () => import("pages/material-manage/index.vue")
const SystemSetting = () => import("pages/system-setting/index.vue")
const DownloadCenter = () => import("pages/download-center/index.vue")

const RoleManage = () => import("pages/material-manage/pages/role-manage/index.vue")
const NetworkUnitManage = () => import("pages/material-manage/pages/network-unit-manage/index.vue")

const DeviceTypeManage = () => import("pages/system-setting/pages/device-type-manage/index.vue")
const AddAndEditDeviceType = () => import("pages/system-setting/pages/add-and-edit-device-type/index.vue")

const DeviceInfo = () => import("pages/device-manage/pages/device-info/index.vue")
const BatchOperation = () => import("pages/device-manage/pages/batch-operation/index.vue")


const baseRoutes = [
	{
		path: "/login",
		name: "Login",
		component: Login,
	},
	{
		path: "/",
		name: "Layout",
		component: Layout,
		redirect: "/monitor",
		children: [
			{
				path: "/device-manage/device-info/:id",
				name: "DeviceInfo",
				component: DeviceInfo,
				props: true,
				meta: {
					title: "设备详情",
				},
			},
			{
				path: "/device-manage/batch-operation/:operation_type",
				name: "BatchOperation",
				component: BatchOperation,
				props: true,
				meta: {
					title: "批量操作",
				},
			},
			{
				path: "/download-center",
				name: "DownloadCenter",
				component: DownloadCenter,
				meta: {
					title: "下载中心",
				},
			},
			{
				path: "/system-setting/add-and-edit-device-type/:id",
				name: "AddAndEditDeviceType",
				component: AddAndEditDeviceType,
				props: true,
				meta: {
					title: "设备类型管理",
				},
			},
		],
	},
]

const pagesRoutes = [
	{
		path: "/monitor",
		name: "Monitor",
		component: Monitor,
		meta: {
			title: "实时监控",
		},
	},
	{
		path: "/device-manage",
		name: "DeviceManage",
		component: DeviceManage,
		meta: {
			title: "设备管理",
		},
	},
	{
		path: "/alarm-center",
		name: "AlarmCenter",
		component: AlarmCenter,
		meta: {
			title: "报警中心",
		},
	},
	{
		path: "/statistical-report",
		name: "StatisticalReport",
		component: StatisticalReport,
		meta: {
			title: "统计报表",
		},
		children: [
			{
				path: "firefighting-week-report",
				name: "FirefightingWeekReport",
				component: null,
				meta: { title: "消防周报表" },
			},
			{
				path: "firefighting-day-report",
				name: "FirefightingDayReport",
				component: null,
				meta: { title: "消防日报表" },
			},
			{
				path: "alarm-record",
				name: "AlarmRecord",
				component: null,
				meta: { title: "报警电话通知记录" },
			},
			{
				path: "alarm-type-statistics",
				name: "AlarmTypeStatistics",
				component: null,
				meta: { title: "报警类型统计" },
			},
			{
				path: "device-offline-statistics",
				name: "DeviceOfflineStatistics",
				component: null,
				meta: { title: "设备离线统计" },
			},
		],
	},
	{
		path: "/material-manage",
		name: "MaterialManage",
		component: MaterialManage,
		meta: {
			title: "资料管理",
		},
		children: [
			{
				path: "network-unit-manage",
				name: "NetworkUnitManage",
				component: NetworkUnitManage,
				meta: { title: "联网单位管理" },
			},
			{
				path: "role-manage",
				name: "RoleManage",
				component: RoleManage,
				meta: { title: "角色管理" },
			},
			{
				path: "menu-purview",
				name: "MemenuPurview",
				component: null,
				meta: { title: "菜单权限" },
			},
			{
				path: "user-manage",
				name: "UserManage",
				component: null,
				meta: { title: "用户管理" },
			},
			{
				path: "sim-manage",
				name: "SimManage",
				component: null,
				meta: { title: "sim卡管理" },
			},
		],
	},
	{
		path: "/system-setting",
		name: "SystemSetting",
		component: SystemSetting,
		meta: {
			title: "系统管理",
		},
		children: [
			{
				path: "device-type-manage",
				name: "DeviceTypeManage",
				component: DeviceTypeManage,
				meta: { title: "设备类型管理" },
			},
			{
				path: "system-log",
				name: "SystemLog",
				component: null,
				meta: { title: "系统日志" },
			},
		],
	},
]

export { baseRoutes as default, pagesRoutes }
