<template>
	<div id="map_container"></div>
</template>

<script>
import apis from "apis"

const { getMapKey } = apis

export default {
	name: "Monitor",
	data() {
		return {}
	},
	mounted() {
		this.setMap()
	},
	methods: {
		setMap() {
			getMapKey().then(({ data }) => {
				const map = new AMap.Map("map_container", {
					zoom: 11,
					mapStyle: "amap://styles/blue",
				})
			})
		},
	},
}
</script>

<style lang='less' scoped>
#map_container {
	width: 100vw;
	height: 100vh;
}
</style>