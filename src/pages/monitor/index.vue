<template>
	<div id="map_container"></div>
</template>

<script>
export default {
	name: "Monitor",
	data() {
		return {}
	},
	mounted() {
		const map = new AMap.Map("map_container", {
			zoom: 11,
			mapStyle: "amap://styles/blue",
		})
	},
}
</script>

<style lang='less' scoped>
#map_container {
	width: 100vw;
	height: 100vh;
}
</style>