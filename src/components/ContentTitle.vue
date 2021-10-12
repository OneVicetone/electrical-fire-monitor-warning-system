<template>
	<header>
		<div class="string-title" v-if="typeof title === 'string'">{{ title }}</div>
		<div class="array-title" v-else-if="title instanceof Array">
			<div :class="`title-item ${selectIdx === index ? 'active' : ''}`" v-for="(item, index) of title" :key="item.name">
				<span @click="changeSelectIdx(index)">{{ item.name }}</span>
				<a-divider v-if="index !== title.length - 1" type="vertical" />
			</div>
		</div>
	</header>
</template>

<script>
export default {
	name: "ContentTitle",
	data() {
		return {
			selectIdx: 0,
		}
	},
	props: {
		title: {
			type: [String, Array],
		},
	},
	methods: {
		changeSelectIdx(idx) {
			this.selectIdx = idx
			this.$emit("changeTitleContent", this.title[idx].key)
		},
	},
}
</script>

<style lang="less" scoped>
.bevel-pseudo-element {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	border-style: solid;
	border-color: transparent;
}
header {
	height: 1.83rem;
	margin: 0 0 0 1.68rem;
	// background: linear-gradient(90deg, #0096ff 0%, rgba(0, 150, 255, 0) 100%);

	position: relative;
	&::after {
		.bevel-pseudo-element();
		left: -5px;
		border-width: 20px 6px;
		// border-top-color: #090d18;
	}
	// opacity: 0.6;
	> div {
		padding: 0 0 0 10px;
		font-size: 1.33rem;
		font-weight: bold;
		position: relative;
		&:first-child::before {
			content: "";
			display: block;
			width: 3rem;
			height: 2.5rem;
			position: absolute;
			left: -2.5rem;
			top: 50%;
			transform: translateY(-50%);
			background: url("~assets/icons/content-title-icon.png") no-repeat;
			background-size: 100%;
		}
	}
	.string-title {
		background: url("~assets/images/title-bg.png") no-repeat;
		background-position: 0px 10px;
		background-size: 18rem;
	}
	.array-title {
		display: flex;
		.title-item {
			min-width: 11.42rem;
			color: #81899c;
			> span {
				padding: 0 2.58rem 0 1.83rem;
				cursor: pointer;
			}
		}
		.title-item.active {
			color: #fff;
			background: url("~assets/images/title-bg.png") no-repeat;
			background-position: 0px 10px;
			background-size: 18rem;
		}
	}
}
</style>