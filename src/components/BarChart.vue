<template>
	<div id="bar_chart_container" :style="`height: ${height}`"></div>
</template>

<script>
import * as echarts from "echarts"

export default {
	name: "BarChart",
	props: {
		dataObj: Object,
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
			const getSeriesItemByData = (data, color) => ({
				data,
				type: "bar",
				itemStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: "#83bff6" },
						{ offset: 0.5, color: "#188df0" },
						{ offset: 1, color: "#188df0" },
					]),
				},
			})

			const seriesData = Object.values(this.dataObj)
			const xAxisData = Object.keys(this.dataObj)
			const series = getSeriesItemByData(seriesData)

			const marginTopAndBottom = 20
			const marginLeftAndRight = 30
			return {
				// grid: {
				// 	left: marginLeftAndRight,
				// 	top: marginTopAndBottom,
				// 	right: marginLeftAndRight,
				// 	bottom: 10,
				// },
				xAxis: {
					type: "category",
					// axisLabel: false,
					// axisLine: {
					// 	show: false,
					// },
					// splitLine: {
					// 	show: true,
					// 	lineStyle: {
					// 		color: ["#385982"],
					// 	},
					// },
					// boundaryGap: false,
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
		dataObj() {
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
#bar_chart_container {
	width: 100%;
}
</style>