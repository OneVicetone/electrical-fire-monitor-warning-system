<template>
	<div :id="containerId" :style="`height: ${height}`"></div>
</template>

<script>
import * as echarts from "echarts"

export default {
	name: "LineChart",
	props: {
		xAxisData: Array,
		seriesData: Array,
		showXAxisLabel: { type: Boolean, default: false },
		showXAxisLine: { type: Boolean, default: false },
		height: {
			type: [Number, String],
			default: "20rem",
		},
		chartKey: {
			type: String,
			default: "",
		},
	},
	data() {
		return {
			chartInstance: null,
		}
	},
	computed: {
		chartOptions() {
			const { xAxisData, seriesData, showXAxisLabel, showXAxisLine } = this
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
			if (seriesData && Array.isArray(seriesData[0])) {
				seriesData.forEach(i => {
					series.push(getSeriesItemByData(i))
				})
			} else {
				series.push(getSeriesItemByData(seriesData))
			}
			const marginTopAndBottom = 20
			const marginLeftAndRight = 35
			return {
				grid: {
					left: marginLeftAndRight,
					top: marginTopAndBottom,
					right: marginLeftAndRight,
					bottom: marginTopAndBottom,
				},
				legend: {
					data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
				},
				xAxis: {
					type: "category",
					axisLabel: {
						show: showXAxisLabel,
						color: "#81899C",
					},
					axisLine: {
						show: showXAxisLabel,
					},
					splitLine: {
						show: showXAxisLine,
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
		containerId() {
			return `line_chart_container${this.chartKey ? `_${this.chartKey}` : ""}`
		},
	},
	watch: {
		seriesData() {
			this.initChart()
		},
	},
	mounted() {
		this.$nextTick(() => this.initChart())
		console.log(this.xAxisData)
		console.log(this.seriesData)
	},
	methods: {
		initChart() {
			if (!this.chartInstance) {
				const chart = echarts.init(document.querySelector(`#${this.containerId}`))
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