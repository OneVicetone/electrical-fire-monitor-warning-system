<template>
	<div :id="containerId" :style="`height: ${height}`"></div>
</template>

<script>
import moment from "moment"
import * as echarts from "echarts"

export default {
	name: "LineChart",
	props: {
		defaultXAxisData: Array,
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
			const { defaultXAxisData, seriesData, showXAxisLabel, showXAxisLine } = this
			let xAxis = null
			const hasTimeData = seriesData.find(i => Array.isArray(i) && i.length > 0)
			if (hasTimeData) {
				xAxis = hasTimeData.map(i => moment(i.updateTime).format("YYYY-MM-DD HH:mm"))
			} else {
				xAxis = seriesData.length > 0 ? seriesData.map(i => i.statisticDate) : defaultXAxisData
			}
			// channelName N相 A相 B相 C相
			const lineNameAndColor = [
				{
					name: "N相",
					color: "#FB5E4F",
				},
				{
					name: "A相",
					color: "#0096FF",
				},
				{
					name: "B相",
					color: "#35D4AC",
				},
				{
					name: "C相",
					color: "#3F4A77",
				},
			]
			const getSeriesItemByData = (data, color = "#0087FF", name) => ({
				name,
				data,
				type: "line",
				smooth: true,
				symbol: "circle",
				lineStyle: {
					color,
				},
				itemStyle: {
					normal: {
						color,
					},
				},
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
								color: color,
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
			const legendData = []
			let xAxisLabelInterval = 0
			if (seriesData && hasTimeData) {
				seriesData.forEach((i, idx) => {
					const { color, name } = lineNameAndColor[idx]
					series.push(getSeriesItemByData(i, color, name))
					legendData.push(name)
				})
				xAxisLabelInterval = parseInt(hasTimeData.length / 7)
			} else {
				series.push(getSeriesItemByData(seriesData.map(i => i.energyValue)))
			}
			const marginTopAndBottom = 20
			const marginLeftAndRight = 35
			return {
				tooltip: {
					trigger: "axis",
					backgroundColor: "#172037",
					borderColor: "#172037",
					textStyle: {
						color: "#fff",
					},
					axisPointer: {
						lineStyle: {
							color: "#0672B2",
						},
					},
				},
				grid: {
					left: marginLeftAndRight,
					top: marginTopAndBottom,
					right: marginLeftAndRight,
					bottom: marginTopAndBottom,
				},
				legend: {
					data: legendData,
					left: marginLeftAndRight + 10,
					textStyle: {
						color: "#DCDCDC",
					},
				},
				xAxis: {
					type: "category",
					axisLabel: {
						show: showXAxisLabel,
						color: "#81899C",
						interval: xAxisLabelInterval,
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
					data: xAxis,
				},
				yAxis: {
					type: "value",
					axisLine: {
						show: false,
					},
					splitLine: {
						show: false,
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