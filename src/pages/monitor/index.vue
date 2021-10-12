<template>
	<div class="monitor-container">
		<Map :centerPoint="mapCenterPoint" @setMapInstance="setMapInstance" />
		<div class="network-group">
			<ContentTitle title="联网单位" />
			<div class="group-count">
				<div class="group-count-item" v-for="item of groupCount" :key="item.name" @click="toPath(item.path)">
					<span>{{ item.value }}</span>
					<span>{{ item.name }}</span>
				</div>
			</div>
		</div>
		<div class="data-count">
			<a-select class="select-group" :value="filterVal" :options="filterOptions" @change="uploadMapPoint" />
			<div class="count-num">
				<p v-for="str of count" :key="str">
					{{ str }}
				</p>
			</div>
			<a-select class="select-type" :value="filterType" :options="filterTypesOptions" @change="getGroupOptions" />
		</div>
		<div class="device-status">
			<ContentTitle title="设备状态统计" />
			<div class="device-data-count">
				<div v-for="device of devicesType" :key="device.key">
					<a-progress
						type="circle"
						:percent="getDevicePercent(device.key)"
						:width="80"
						:strokeWidth="10"
						:strokeColor="device.color"
						:format="formatProcess"
						strokeLinecap="square"
						@click="jumpToOtherPageByKey(device.key)"
					/>
					<span>{{ `${device.name}(${deviceStatus[device.key]})` }}</span>
				</div>
			</div>
			<div class="alarm-type-count">
				<ContentTitle title="报警类型统计" />
				<!-- <div id="device_status_chart"></div> -->
				<BarChart :dataObj="alarmTypeCountData" />
			</div>
		</div>
		<!-- <MarkerInfo v-model="showMarkerInfo" :markerInfoObj="markerInfo" :position="position" /> -->
	</div>
</template>

<script>
import { cloneDeep } from "lodash"

import Map from "components/Map.vue"
import ContentTitle from "components/ContentTitle.vue"
// import MarkerInfo from "./components/MarkerInfo.vue"
import BarChart from "components/BarChart.vue"

import apis from "apis"
import { commonMixin } from "mixins"

import mapMarkerIcon from "@/assets/icons/map-marker-icon.png"
import closeIcon from "@/assets/icons/close-icon.png"

const {
	monitorCount,
	getSelectOptions,
	getMonitorDataList,
	monitorAllDeviceStatus,
	getMonitorDataDetail,
	monitorAllAlarmType,
} = apis

export default {
	name: "Monitor",
	mixins: [commonMixin],
	components: { Map, ContentTitle, BarChart },
	data() {
		return {
			mapInstance: null,
			mapCenterPoint: { lon: 118.332222, lat: 22.223323 },
			groupCount: [
				{ name: "总接入单位", value: "-", key: "totalGroupNum", path: "/material-manage/network-unit-manage" },
				{ name: "总接入设备", value: "-", key: "totalDeviceNum", path: "/device-manage" },
				{ name: "报警累计", value: "-", key: "totalAlarmNum", path: "/alarm-center" },
				{ name: "今日报警", value: "-", key: "todayAlarmNum", path: "/alarm-center" },
				{ name: "今日故障", value: "-", key: "todayFaultNum", path: "/alarm-center" },
				{ name: "今日离线", value: "-", key: "todayOffLineDeviceNum", path: "/alarm-center" },
			],
			count: "0",
			filterTypesOptions: [
				{ label: "按单位", value: "groupType", key: 1 },
				{ label: "按设备", value: "deviceType", key: 2 },
			],
			filterOptions: [],
			filterType: "groupType",
			filterVal: 1,
			devicesType: [
				{ name: "正常", key: "normalNum", color: "#2f6bfd" },
				{ name: "报警", key: "alarmNum", color: "#fb5e4f" },
				{ name: "故障", key: "faultNum", color: "#f8bf0d" },
				{ name: "离线", key: "offLineNum", color: "#6191db" },
			],
			deviceStatus: {
				totalNum: 0,
				offLineNum: 0,
				normalNum: 0,
				alarmNum: 0,
				faultNum: 0,
			},
			showMarkerInfo: false,
			markerInfo: {},
			position: {
				left: 0,
				top: 0,
			},
			alarmTypeCountData: {},
		}
	},
	computed: {
		filterTypeKey() {
			return this.filterTypesOptions.find(i => i.value === this.filterType).key
		},
	},
	mounted() {
		const { getMonitorCount, getGroupOptions, getDeviceStatus, getAllAlarmType } = this
		this.$nextTick(() => {
			Promise.allSettled([getMonitorCount(), getGroupOptions(), getDeviceStatus(), getAllAlarmType()])
		})
	},
	methods: {
		getMonitorCount() {
			return monitorCount().then(({ data }) => {
				const groupCountClone = cloneDeep(this.groupCount)
				groupCountClone.forEach(i => {
					i.value = data[i.key]
				})
				this.groupCount = groupCountClone
			})
		},
		getAllAlarmType() {
			return monitorAllAlarmType().then(({ data }) => (this.alarmTypeCountData = data))
		},
		getGroupOptions(val = "groupType") {
			return getSelectOptions(val).then(({ data }) => {
				this.filterOptions = data.map(({ code, name }) => ({
					label: name,
					value: code,
				}))
				this.filterType = val
				this.filterVal = this.filterOptions[0].value
				this.getMapPointList()
			})
		},
		uploadMapPoint(val) {
			this.filterVal = val
		},
		getMapPointList() {
			const { filterTypeKey, filterVal } = this
			const params = {
				type: filterTypeKey,
				grooupId: filterVal,
			}
			return getMonitorDataList(params).then(
				({ data }) => new Promise(resolve => setTimeout(() => resolve(this.setMapPoint(data.filter(Boolean))), 1000))
			)
		},
		setMapPoint(arr) {
			this.count = String(arr.length)
			arr.forEach((i, idx) => {
				if (!i) return
				const { lon, lat, id } = i
				if (!lat || !lon) return
				const point = new BMapGL.Point(lon, lat)
				const makerIcon = new BMapGL.Icon(mapMarkerIcon, new BMapGL.Size(40, 40))
				const marker = new BMapGL.Marker(point, { icon: makerIcon })
				// marker.setOffset(BMapGL.Size(100, 100))
				// console.log(marker.getOffset())
				this.mapInstance.addOverlay(marker)

				// marker.addEventListener("click", e => {
				// 	const params = {
				// 		type: this.filterTypeKey,
				// 		id,
				// 	}
				// 	getMonitorDataDetail(params).then(({ data }) => {
				// 		const { top, left } = e.target.domElement.getBoundingClientRect()
				// 		const { clientHeight, clientWidth } = document.querySelector(".marker-info-container")
				// 		this.position = {
				// 			top: top - clientHeight - 10,
				// 			left: left - clientWidth / 2 + 12,
				// 		}
				// 		this.markerInfo = data
				// 		this.showMarkerInfo = true
				// 	})
				// })
				// this.mapInstance.addEventListener("dragstart", () => {
				// 	if (this.showMarkerInfo) this.showMarkerInfo = false
				// })
				// const groupInfoContainer = document.createElement("div")
				// groupInfoContainer.classList.add("marker-info-container")

				const getGroupInfoContainer = ({
					name,
					totalNum,
					alarmNum,
					offLineNum,
					address,
				}) => `<div class="marker-info-container">
							<h2 class="title">${name}</h2>
							<div class="info">
								<p>入网设备: ${totalNum}</p>
								<p>报警设备: ${alarmNum}</p>
								<p>离线设备: ${offLineNum}</p>
								<p>单位地址设备: ${address || "-"}</p>
							</div>
							<button class="to-detail-btn">详情</button>
							<img class="close-info" src="${closeIcon}" />
						</div>`

				const getGroupDetailAndShowAtMap = params => {
					getMonitorDataDetail(params).then(({ data }) => {
						const groupInfoContainer = getGroupInfoContainer(data)
						const groupInfoWindow = new BMapGL.InfoWindow(groupInfoContainer)
						this.mapInstance.openInfoWindow(groupInfoWindow, point)
						const toDetailBtn = document.querySelector(".marker-info-container .to-detail-btn")
						const closeBtn = document.querySelector(".marker-info-container .close-info")

						toDetailBtn &&
							toDetailBtn.addEventListener("click", () => this.toPath(`/monitor/group-detail/${data.id}`), false)
						// closeBtn && closeBtn.addEventListener("click", () => this.mapInstance.clearInfoWindow(), false)
						closeBtn && closeBtn.addEventListener("click", () => groupInfoWindow.close(), false)
					})
				}

				const markerClickFunc = () => {
					const params = {
						type: this.filterTypeKey,
						id,
					}
					getGroupDetailAndShowAtMap(params)
				}

				marker.addEventListener("click", () => markerClickFunc())

				// TODO: 地图中心设置为最后一个点位？
				if (idx === arr.length - 1) {
					this.mapInstance.centerAndZoom(point, 19)
					// marker.domElement.click()
					markerClickFunc()
				}
			})
		},
		setMapInstance(instance) {
			this.mapInstance = instance
		},
		getDeviceStatus() {
			return monitorAllDeviceStatus().then(({ data }) => (this.deviceStatus = { ...this.deviceStatus, ...data }))
		},
		getDevicePercent(type) {
			return (this.deviceStatus[type] / this.deviceStatus.totalNum).toFixed(2) * 100
		},
		formatProcess(percent) {
			return percent.toFixed(0) + "%"
		},
		jumpToOtherPageByKey(key) {
			if (key === "normalNum") {
				this.toPath("/device-manage")
			} else if (key === "alarmNum") {
				this.toPath("/alarm-center")
			} else if (key === "faultNum") {
				this.toPath("/alarm-center?status=1&alarmType=8")
			} else if (key === "offLineNum") {
				this.toPath("/alarm-center?status=1&alarmType=30")
			}
		},
	},
}
</script>

<style lang='less' scoped>
@import url("styles/common.less");

.monitor-container {
	@side-content-width: 31.67rem;
	@side-left-right-spacing: 1.5rem;
	@center-margin-left-right: 1.08rem;
	.network-group,
	.device-status,
	.data-count {
		position: fixed;
		top: calc(@banner-no-include-logo-height + 4.42rem);
		background-color: rgba(18, 34, 61, 0.8);
		border: 0.08px solid rgba(0, 0, 0, 0.5);
		// opacity: 0.6;
		z-index: 2;
		box-shadow: inset 0 0 8px #0ff;
	}
	.network-group,
	.device-status {
		width: 31.67rem;
		height: 40rem;
	}
	.network-group {
		left: @side-left-right-spacing;
		// padding: 0.67rem;
		padding: 1.08rem 1.33rem;
		.group-count {
			display: flex;
			flex-wrap: wrap;
			.group-count-item {
				width: 8.4rem;
				height: 5rem;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin: 1rem 0.6rem 0;
				background-color: rgba(63, 74, 119, 0.3);
				color: #aaddff;
				cursor: pointer;
				> span:first-child {
					font-size: 1.83rem;
					font-weight: bold;
				}
				> span:last-child {
					font-size: 1rem;
				}
			}
		}
	}
	.data-count {
		width: calc(100vw - @side-content-width * 2 - @side-left-right-spacing * 2 - @center-margin-left-right * 2);
		left: calc(@side-content-width + @side-left-right-spacing);
		height: 7.67rem;
		margin: 0 1.08rem;
		.count-num {
			display: flex;
			position: absolute;
			left: 50%;
			top: 20%;
			transform: translate(-50%);
			> p {
				width: 2.5rem;
				height: 4.58rem;
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 0 0.375rem;
				background-color: #244cb1;
				border-radius: 2px;
				font-size: 3.33rem;
				color: #fff;
			}
		}
		.select-group,
		.select-type {
			width: 13.08rem;
			height: 2.33rem;
			position: absolute;
			bottom: 0.67rem;
		}
		.select-group {
			left: 2.17rem;
		}
		.select-type {
			right: 2.17rem;
		}
	}
	.device-status {
		right: @side-left-right-spacing;
		padding: 1.08rem 1.33rem;
		.device-data-count {
			display: flex;
			justify-content: space-around;
			margin-top: 2.17rem;
			> div {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				> div.ant-progress {
					cursor: pointer;
					transform: scale(0.85);
				}
				> span {
					color: #aaddff;
					font-size: 1rem;
					margin-top: 1.08rem;
				}
			}
		}
		.alarm-type-count {
			margin: 6.58rem 0 0;
			#device_status_chart {
				width: 100%;
				height: 14rem;
			}
		}
	}
}
</style>