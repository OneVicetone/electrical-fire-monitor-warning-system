<template>
	<div class="alarm-list-container">
		<Header name="报警列表">
			<template v-slot:headerRightContent>
				<a-icon type="filter" @click="changeShowFilter" />
			</template>
		</Header>
		<section>
			<AlarmCard v-for="item of alarmList" :key="item.id" :alarmInfo="item" />
		</section>
		<div class="mask" v-show="isShowFilter"></div>
		<div :class="`filter-container ${isShowFilter ? 'show-filter' : 'hide-filter'}`">
			<div class="search-input">
				<a-icon type="left" @click="changeShowFilter" />
				<a-input v-model="searchForm.deviceSnName" placeholder="请输入设备名称/设备号">
					<a-icon slot="prefix" type="user" />
				</a-input>
			</div>
			<div class="filter-form">
				<div>
					<p class="label">报警类型</p>
					<Radio v-model="searchForm.alarmType" :options="alarmTypeOptions" />
				</div>
				<div>
					<p class="label">报警时间</p>
					<div class="time-picker">
						<button @click="showTimePicker('startDate')">
							<!-- {{ searchForm.startDate ? moment(searchForm.startDate).format("YYYY-MM-DD") : "报警开始时间" }} -->
							{{ searchForm.startDate || "报警开始时间" }}
						</button>
						<span>~</span>
						<button @click="showTimePicker('endDate')">
							<!-- {{ searchForm.endDate ? moment(searchForm.endDate).format("YYYY-MM-DD") : "报警结束时间" }} -->
							{{ searchForm.endDate || "报警结束时间" }}
						</button>
					</div>
				</div>
				<div>
					<p class="label">报警等级</p>
					<Radio v-model="searchForm.alarmLevel" :options="phoneAlarmLevelOptions" />
				</div>
			</div>
			<div class="btn-group">
				<a-button @click="reset">重置</a-button>
				<a-button type="primary" @click="enterSearch">完成</a-button>
			</div>
		</div>
		<van-popup v-model="isShowTimePicker">
			<van-datetime-picker
				v-model="searchForm[pickerType]"
				type="date"
				title="选择年月日"
				@confirm="getPickTime"
				@cancel="changeShowTimePicker"
			/>
		</van-popup>
	</div>
</template>

<script>
import moment from "moment"
import { cloneDeep } from "lodash"

import Radio from "../components/Radio.vue"
import Header from "../components/Header.vue"
import AlarmCard from "./components/AlarmCard.vue"

import apis from "apis"
import { initHtmlBasePx } from "utils/initial"
import allOptionsData from "utils/optionsData"
import { tableListMixin, phonePageMixin } from "mixins"

const { phoneAlarmLevelOptions } = allOptionsData
const { getAlarmList } = apis
const searchFromInitial = {
	unit: "",
	deviceSnName: "",
	alarmType: "",
	alarmLevel: "",
	deviceTypeId: "",
	status: "",
	startDate: "",
	endDate: "",
}

export default {
	name: "AlarmList",
	mixins: [
		tableListMixin,
		// phonePageMixin
	],
	components: { Header, AlarmCard, Radio },
	data() {
		return {
			searchForm: cloneDeep(searchFromInitial),
			paginationData: {
				total: 0,
				current: 1,
				size: 10,
			},
			alarmList: [],
			isShowFilter: false,
			alarmTypeOptions: [],
			phoneAlarmLevelOptions,
			pickerType: "startDate",
			isShowTimePicker: false,
		}
	},
	beforeCreate() {
		initHtmlBasePx(62.5)
	},
	mounted() {
		const optionsTypes = ["alarmType"]
		const { getOptionsListPromiseArr, getAlarmList } = this
		Promise.allSettled([getAlarmList(), ...getOptionsListPromiseArr(optionsTypes)])
	},
	methods: {
		getAlarmList(current = 1, size = 999) {
			const params = {
				current,
				size,
				...this.searchForm,
			}
			return getAlarmList(params).then(({ data: { records, total, current, size } }) => {
				this.alarmList = records
				this.paginationData = {
					...this.paginationData,
					total,
					current,
					size,
				}
			})
		},
		changeShowFilter() {
			this.isShowFilter = !this.isShowFilter
		},
		reset() {
			this.changeShowFilter()
			this.searchForm = cloneDeep(searchFromInitial)
			this.search("getAlarmList")
		},
		enterSearch() {
			this.changeShowFilter()
			this.search("getAlarmList")
		},
		showTimePicker(type) {
			this.pickerType = type
			this.isShowTimePicker = true
		},
		changeShowTimePicker() {
			this.isShowTimePicker = !this.isShowTimePicker
		},
		getPickTime(val) {
			this.searchForm[this.pickerType] = moment(val).format("YYYY-MM-DD")
			this.changeShowTimePicker()
		},
	},
}
</script>

<style lang="less" scoped>
@import url("styles/phone-pages-common.less");

.alarm-list-container {
	> header {
		> i[aria-label] {
			font-size: 3rem;
			color: #008da0;
		}
	}
	> section {
		.section();
		padding: 1.75rem 1.17rem 0;
	}
	.mask {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		z-index: 1;
		background-color: RGBA(112, 113, 114, 0.5);
	}
	.filter-container {
		width: 100%;
		// height: 76.26rem;
		padding: 3.08rem 2.33rem;
		position: relative;
		background-color: #fff;
		border-bottom-left-radius: 12px;
		border-bottom-right-radius: 12px;
		transition: all 0.5s;
		z-index: 2;
		&.show-filter {
			transform: translateY(-100vh);
		}
		&.hide-filter {
			transform: translateY(-200vh);
		}
		.search-input {
			display: flex;
			align-items: center;
			> i {
				color: #000;
				font-size: 3.5rem;
				padding: 0 2rem 0 0;
			}
			/deep/ .ant-input-affix-wrapper {
				.ant-input {
					background-color: #f7f7f8;
					color: #474749;
					border-color: #81899c;
					&::placeholder {
						color: #8994a7;
					}
				}
				i {
					color: #8994a7;
				}
			}
		}
		.filter-form {
			.label {
				color: #656566;
				font-size: 2.17rem;
				margin: 2.17rem 0 1.75rem 1rem;
			}
			.time-picker {
				display: flex;
				justify-content: space-between;
				padding: 1rem;
				> button {
					width: 26.67rem;
					height: 5rem;
					background-color: #f5f5f5;
					border-radius: 4px;
					outline: none;
					border: none;
				}
			}
		}
		.btn-group {
			display: flex;
			padding: 0;
			padding: 3.75rem 0;
			> button {
				width: 27.5rem;
				height: 7rem;
			}
			> button:first-child {
				border: none;
				background-color: #f5f5f5;
				color: #474749;
			}
		}
	}
}
</style>