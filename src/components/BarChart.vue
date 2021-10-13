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
				label: {
					show: true,
					position: "top",
					color: "#26D3DD",
					fontSize: 10
				},
				itemStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: "#2CDEDD" },
						// { offset: 0.5, color: "#188df0" },
						{ offset: 1, color: "#0895E0" },
					]),
				},
				barWidth: 20,
			})
			const seriesData = Object.values(this.dataObj)
			// const seriesData = [5, 7, 10, 15, 2]

			const xAxisData = Object.keys(this.dataObj).map(i => ({
				value: i,
				textStyle: {
					color: "#AADDFF",
				},
			}))
			const series = getSeriesItemByData(seriesData)

			// const marginTopAndBottom = 20
			// const marginLeftAndRight = 30
			return {
				grid: {
					// left: marginLeftAndRight,
					top: 40,
					// right: marginLeftAndRight,
					bottom: 30,
				},
				xAxis: {
					type: "category",
					axisLabel: {
						interval: 0,
					},
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