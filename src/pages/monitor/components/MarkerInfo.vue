<template>
	<div
		class="marker-info-container"
		:style="`visibility: ${visible ? 'visible' : 'hidden'};top: ${position.top}px; left: ${position.left}px;`"
	>
		<h2 class="title">
			<!-- {{ markerInfoObj.name | filterNull }} -->
			测试测试测试
		</h2>
		<div class="info">
			<p>入网设备: {{ markerInfoObj.totalNum | filterNull }}</p>
			<p>报警设备: {{ markerInfoObj.alarmNum | filterNull }}</p>
			<p>离线设备: {{ markerInfoObj.offLineNum | filterNull }}</p>
			<p>单位地址设备: {{ markerInfoObj.address | filterNull }}</p>
		</div>

		<a-button ghost @click="toPath(`/monitor/group-detail/${markerInfoObj.id}`)">详情</a-button>
		<a-icon class="close-info" type="close" @click="close" />
	</div>
</template>

<script>
import { commonMixin } from "mixins"

export default {
	name: "MarkerInfo",
	mixins: [commonMixin],
	model: {
		prop: "isShow",
		event: "changeShow",
	},
	props: {
		isShow: {
			type: Boolean,
			dafault: false,
		},
		markerInfoObj: {
			type: Object,
		},
		position: {
			type: Object,
			default: () => ({
				top: 0,
				left: 0,
			}),
		},
	},
	computed: {
		visible: {
			get: function () {
				return this.isShow
			},
			set: () => {},
		},
	},
	updated() {
		console.log(this.markerInfoObj)
		console.log(this.position)
	},
	methods: {
		close() {
			this.$emit("changeShow", false)
		},
	},
}
</script>

<style lang="less" scoped>
.marker-info-container {
	width: 30.83rem;
	height: 17.33rem;
	padding: 1.5rem 1.75rem;
	position: fixed;
	background: url("assets/images/marker-info-bg.png") no-repeat;
    background-size: 100%;
    background-color: transparent;
	opacity: 0.5;
	transition: all 0.5s;
	z-index: 2;
	.title {
		height: 2.58rem;
		color: #0096ff;
		font-size: 1.5rem;
		font-weight: bold;
		&::before {
			content: "";
			display: block;
			width: 1.83rem;
			height: 0.25rem;
			background-color: #0096ff;
			position: relative;
			top: -0.25rem;
			left: 0;
		}
	}
	.info {
		> p {
			color: #fff;
			overflow: hidden;
			text-overflow: ellipsis;
            margin: 0;
			&:last-child {
				margin: 0 0 0.75rem 0;
				height: 1.5rem;
			}
		}
	}
	// &::after {
	// 	content: "";
	// 	position: absolute;
	// 	border-style: solid;
	// 	border-color: transparent;
	// 	left: 50%;
	// 	bottom: -18px;
	// 	transform: translateX(-50%);
	// 	border-width: 10px 18px;
	// 	border-top-color: #090d18;
	// }
	.close-info {
		position: absolute;
		right: 1.25rem;
		top: 1.58rem;
		color: #0096ff;
		font-size: 1.33rem;
		cursor: pointer;
	}
}
</style>