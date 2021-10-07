<template>
	<div id="map_container" :style="customStyle"></div>
</template>

<script>
import { addMapScript, initMapTheme } from "utils/commonFunctions"
import apis from "apis"

const { getMapKey } = apis

export default {
	name: "Map",
	props: {
		customStyle: {
			type: Object,
			default: () => ({width: '100vw',height: '100vh'})
		},
		centerPoint: {
			type: Object,
			default: () => ({
				lat: 22.223323,
				lon: 118.332222,
			}),
		},
	},
	data() {
		return {
			mapInstance: null,
		}
	},
	mounted() {
		this.setMap()
	},
	methods: {
		setMap() {
			if (window.BMapGL) return this.setMapToContainer(window.BMapGL)
			const mapModule = "web"
			getMapKey(mapModule).then(({ data: { ak, defaultStyleId } }) => {
				addMapScript(ak).then(BMapGL => this.setMapToContainer(BMapGL, defaultStyleId))
			})
		},
		setMapToContainer(BMapGL, defaultStyleId) {
			const mapDefaultZoom = 19
			const map = new BMapGL.Map("map_container")
			this.mapInstance = map
			map.enableScrollWheelZoom(true)
			this.changeMapCenterAndZoom(this.centerPoint, mapDefaultZoom)
			initMapTheme(map, defaultStyleId)
			map.enableScrollWheelZoom(true)
			// map.addControl(new BMapGL.LocationControl)
			// map.addControl(new BMapGL.CityListControl)
			this.$emit("setMapInstance", map)
		},
		changeMapCenterAndZoom({ lon, lat }, zoom = 15) {
			const point = new BMapGL.Point(lon, lat)
			this.mapInstance.centerAndZoom(point, zoom)
		},
	},
}
</script>

<style lang="less" scoped>
#map_container {
	// width: 100vw;
	// height: 100vh;
	position: fixed;
	z-index: 1;
}
</style>