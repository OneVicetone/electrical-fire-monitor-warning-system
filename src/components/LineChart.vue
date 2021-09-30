<template>
	<div id="line_chart_container" :style="`height: ${height}`"></div>
</template>

<script>
import * as echarts from "echarts"

export default {
	name: "LineChart",
	props: {
		xAxisData: Array,
		seriesData: Array,
		height: {
			type: [Number, String],
			default: "20rem",
		},
	},
	data() {
		return {
			chartInstance: null,
		}
	},
	computed: {
		chartOptions() {
			const { xAxisData, seriesData } = this
			const getSeriesItemByData = (data, color) => ({
				data,
				type: "line",
				areaStyle: {
					color: {
						type: "linear",
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [
							{
								offset: 0,
								color: "#0087FF",
							},
							{
								offset: 1,
								color: "rgba(0, 135, 255, 0)",
							},
						],
						global: false,
					},
				},
				// symbolOffset: ["-100%", "-50%"],
			})
			const series = []
			if (Array.isArray(seriesData[0])) {
				seriesData.forEach(i => {
					series.push(getSeriesItemByData(i))
				})
			} else {
				series.push(getSeriesItemByData(seriesData))
			}
			const marginTopAndBottom = 20
			const marginLeftAndRight = 30
			return {
				grid: {
					left: marginLeftAndRight,
					top: marginTopAndBottom,
					right: marginLeftAndRight,
					bottom: 10,
				},
				xAxis: {
					type: "category",
					axisLabel: false,
					axisLine: {
						show: false,
					},
					splitLine: {
						show: true,
						lineStyle: {
							color: ["#385982"],
						},
					},
					boundaryGap: false,
					data: xAxisData,
				},
				yAxis: {
					type: "value",
					axisLine: {
						show: false,
					},
					splitLine: {
						show: true,
						lineStyle: {
							color: ["#385982"],
						},
					},
				},
				series: series,
			}
		},
	},
	watch: {
		seriesData() {
			this.initChart()
		},
	},
	mounted() {
		this.initChart()
	},
	methods: {
		initChart() {
			if (!this.chartInstance) {
				const chart = echarts.init(document.querySelector("#bar_chart_container"))
				this.chartInstance = chart
			}
			this.chartInstance.setOption(this.chartOptions)
		},
	},
}
</script>

<style lang="less" scoped>
#line_chart_container {
	width: 100%;
}
</style>