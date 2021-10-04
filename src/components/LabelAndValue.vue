<template>
	<div class="label-and-value-container">
		<div class="label-list" :style="`color: ${labelColor};`">
			<p v-for="item of labels" :key="item.label">
				{{ item.label }}
			</p>
		</div>
		<div class="value-list" :style="`color: ${valueColor};`">
			<p v-for="item of labels" :key="item.label">
				{{ item.key && values[item.key] ? values[item.key] : "-" }}
				<a-button v-if="item.key === 'installPosition'" ghost size="small" @click="onView">查看</a-button>
			</p>
		</div>
		<AccordPic
			v-model="picLog" :havePic="picList"
			@on-delete-img="delImg" @add-pic="addPic">
			<div class="positions">安装位置：{{values.installPosition}}</div>
		</AccordPic>
	</div>
</template>

<script>
import AccordPic from "components/businessComp/AccordPic.vue"

export default {
	name: "LabelAndValue",
	components: { AccordPic },
	props: {
		labels: {
			type: Array,
			required: true,
		},
		values: {
			type: Object,
		},
		labelColor: {
			type: String,
			default: "#81899c",
		},
		valueColor: {
			type: String,
			default: "#dcdcdc",
		},
		picList: Array
	},
	data() {
		return {
			picLog: false
		}
	},
	methods: {
		onView() {
			console.log('待看')
			this.picLog = true;
			// this.$emit('on-view-pic')
		},
		delImg(url) {
			this.$emit('delete-img-source', url)
		},
		addPic(url) {
			this.$emit('add-img-source', url)
		}
	}
}
</script>

<style lang="less" scoped>
.label-and-value-container {
	display: flex;
	font-size: 1rem;
	padding: 0 1.83rem 2.25rem;
	> div {
		line-height: 12px;
	}
	.label-list {
		padding: 0 1rem 0 0;
	}
	.value-list {
		> p {
			position: relative;
			button {
				position: absolute;
				right: 0;
			}
		}
	}
}
</style>