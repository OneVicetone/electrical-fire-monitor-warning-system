<template>
	<div class="monitor-container">
		<Map :centerPoint="mapCenterPoint" @setMapInstance="setMapInstance" />
		<div class="network-group">
			<ContentTitle title="联网单位" />
			<div class="group-count">
				<div class="group-count-item" v-for="item of groupCount" :key="item.name">
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
					<a-progress type="circle" :percent="getDevicePercent(device.key)" :width="80" :strokeColor="device.color" />
					<span>{{ `${device.name}(${deviceStatus[device.key]})` }}</span>
				</div>
			</div>
			<div id="device_status_chart"></div>
		</div>
		<MarkerInfo v-model="showMarkerInfo" :markerInfoObj="markerInfo" :position="position" />
	</div>
</template>

<script>
import { cloneDeep } from "lodash"
import * as echarts from "echarts"

import Map from "components/Map.vue"
import ContentTitle from "components/ContentTitle.vue"
import MarkerInfo from "./components/MarkerInfo.vue"

import apis from "apis"

const { monitorCount, getSelectOptions, getMonitorDataList, monitorAllDeviceStatus, getMonitorDataDetail } = apis

export default {
	name: "Monitor",
	components: { Map, ContentTitle, MarkerInfo },
	data() {
		return {
			mapInstance: null,
			mapCenterPoint: { lon: 118.332222, lat: 22.223323 },
			groupCount: [
				{ name: "总接入单位", value: "-", key: "totalGroupNum" },
				{ name: "总接入设备", value: "-", key: "totalDeviceNum" },
				{ name: "报警累计", value: "-", key: "totalAlarmNum" },
				{ name: "今日报警", value: "-", key: "todayAlarmNum" },
				{ name: "今日故障", value: "-", key: "todayFaultNum" },
				{ name: "今日离线", value: "-", key: "todayOffLineDeviceNum" },
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
		}
	},
	computed: {
		filterTypeKey() {
			return this.filterTypesOptions.find(i => i.value === this.filterType).key
		},
	},
	mounted() {
		const { getMonitorCount, getGroupOptions, getDeviceStatus } = this
		this.$nextTick(() => {
			Promise.allSettled([getMonitorCount(), getGroupOptions(), getDeviceStatus()])
		})
		const deviceStatusChart = echarts.init(document.querySelector("#device_status_chart"))
		deviceStatusChart.setOption({
			xAxis: {
				type: "category",
				data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			},
			yAxis: {
				type: "value",
			},
			series: [
				{
					data: [120, 200, 150, 80, 70, 110, 130],
					type: "bar",
				},
			],
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
		getGroupOptions(val = "groupType") {
			return getSelectOptions(val).then(({ data }) => {
				this.filterOptions = data.map(({ id, parameterName }) => ({
					label: parameterName,
					value: id,
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
			return getMonitorDataList(params).then(({ data }) => this.setMapPoint(data.filter(Boolean)))
		},
		setMapPoint(arr) {
			this.count = String(arr.length)
			arr.forEach((i, idx) => {
				if (!i) return
				const { lon, lat, id } = i
				if (!lat || !lon) return
				const point = new BMapGL.Point(lon, lat)
				const marker = new BMapGL.Marker(point)
				marker.addEventListener("click", e => {
					const params = {
						type: this.filterTypeKey,
						id,
					}
					getMonitorDataDetail(params).then(({ data }) => {
						const { top, left } = e.target.domElement.getBoundingClientRect()
						const { clientHeight, clientWidth } = document.querySelector(".marker-info-container")
						this.position = {
							top: top - clientHeight - 18,
							left: left - clientWidth / 2 + 6,
						}
						this.markerInfo = data
						this.showMarkerInfo = true
					})
				})
				this.mapInstance.addOverlay(marker)
				this.mapInstance.addEventListener("dragstart", () => {
					if (this.showMarkerInfo) this.showMarkerInfo = false
				})
				// TODO: 地图中心设置为最后一个点位？
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
		background-color: #12223d;
		border: 0.08px solid rgba(0, 0, 0, 0.5);
		opacity: 0.6;
		z-index: 2;
	}
	.network-group,
	.device-status {
		width: 31.67rem;
		height: 40rem;
	}
	.network-group {
		left: @side-left-right-spacing;
		padding: 0.67rem;
		.group-count {
			display: flex;
			flex-wrap: wrap;
			.group-count-item {
				width: 8.83rem;
				height: 5rem;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin: 1rem 0.6rem 0;
				background-color: #3f4a77;
				color: #aaddff;
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
				> span {
					color: #aaddff;
					font-size: 1rem;
					margin-top: 1.08rem;
				}
			}
		}
		#device_status_chart {
			width: 100%;
			height: 50%;
		}
	}
}
</style>