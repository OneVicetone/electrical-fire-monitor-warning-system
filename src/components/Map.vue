<template>
	<div id="map_container"></div>
</template>

<script>
import { addMapScript, initMapTheme } from "utils/commonFunctions"
import apis from "apis"

const { getMapKey } = apis

export default {
	name: "Map",
	props: {
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
			const mapModule = "web"
			getMapKey(mapModule).then(({ data }) => {
				addMapScript(data).then(BMap => {
					const mapDefaultZoom = 15
					const map = new BMap.Map("map_container")
					map.enableScrollWheelZoom(true);
					// initMapTheme(map)
					this.mapInstance = map
                    this.changeMapCenterAndZoom(this.centerPoint, mapDefaultZoom)
					this.$emit("setMapInstance", map)
				})
			})
		},
		changeMapCenterAndZoom({ lon, lat }, zoom = 15) {
			const point = new BMap.Point(lon, lat)
			this.mapInstance.centerAndZoom(point, zoom)
		},
	},
}
</script>

<style lang="less" scoped>
#map_container {
	width: 100vw;
	height: 100vh;
	position: fixed;
	z-index: 1;
}
</style>