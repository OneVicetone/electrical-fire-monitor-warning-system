<template>
	<a-modal
		v-model="visible"
		:footer="null"
		:width="getBasePx() * 83.12"
		class="dialog-container"
		:centered="centered"
		@cancel="closeDialog"
	>
		<header>
			<div>{{ title }}</div>
		</header>
		<slot></slot>
	</a-modal>
</template>

<script>
import { commonMinix } from "minixs"

export default {
	name: "Dialog",
	mixins: [commonMinix],
	model: {
		prop: "show",
		event: "changeShow",
	},
	props: {
		show: {
			type: Boolean,
			required: true,
			default: false,
		},
		title: {
			type: String,
			required: true,
			default: "",
		},
		centered: {
			type: Boolean,
			default: true,
		},
	},
	computed: {
		visible: {
			get: function() { return this.show },
			set: () => {}
		}
	},
	methods: {
		closeDialog() {
			this.$emit("changeShow", false)
		},
	},
}
</script>

<style lang="less">
.bevel-pseudo-element {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	border-style: solid;
	border-color: transparent;
}
.dialog-container {
	// TODO: 修改关闭按钮样式
	// .ant-modal-close {
	//     margin:  -10px -10px 0 0;
	//     > span {
	//         width: 1.83rem;
	//         height: 1.83rem;
	//         color: #0096ff;
	//     }
	//     i {
	//         color: #0096ff;
	//         font-size: 1.83rem;
	//     }
	// }
	.ant-modal-content {
		min-height: 60vh;
		position: relative;
		background: url("assets/images/dialog-border.png") no-repeat;
		background-position: -0.5rem 0;
		background-color: #090d18;
		border: 0.17rem #0096ff solid;
		border-left: none;
		border-radius: 0px !important;
		&::after {
			.bevel-pseudo-element();
			left: -9px;
			top: -7px;
			border-width: 21px;
			border-top-color: #090d18;
			transform: rotate(6deg);
		}
	}
	header {
		width: 54.58rem;
		height: 1.83rem;
		margin: 0 0 0 1.68rem;
		background: linear-gradient(90deg, #0096ff 0%, rgba(0, 150, 255, 0) 100%);
		position: relative;
		&::after {
			.bevel-pseudo-element();
			left: -5px;
			border-width: 20px 6px;
			border-top-color: #090d18;
		}
		// opacity: 0.6;
		> div {
			padding: 0 0 0 10px;
			font-size: 1.33rem;
			font-weight: bold;
			position: relative;
			&::before {
				content: "";
				display: block;
				width: 1.48rem;
				height: 1.42rem;
				position: absolute;
				left: -1.68rem;
				top: 50%;
				transform: translateY(-50%);
				background: url("assets/icons/company.png") no-repeat;
				background-size: 100%;
			}
		}
	}
}
</style>