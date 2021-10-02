<template>
	<div class="alarm-list-container">
		<Header name="报警列表">
			<template v-slot:headerRightContent>
				<a-icon type="filter" />
			</template>
		</Header>
		<section>
			<AlarmCard v-for="item of alarmList" :key="item.id" :alarmInfo="item" />
		</section>
	</div>
</template>

<script>
import moment from "moment"

import { initHtmlBasePx } from "utils/initial"

import Header from "../components/Header.vue"
import AlarmCard from "./components/AlarmCard.vue"

import apis from "apis"
import { tableListMixin } from "mixins"

const { getAlarmList } = apis

export default {
	name: "AlarmList",
	mixins: [tableListMixin],
	components: { Header, AlarmCard },
	data() {
		return {
			searchForm: {
				unit: "",
				deviceSnName: "",
				alarmType: "",
				alarmLevel: "",
				deviceTypeId: "",
				status: "",
				alarmTime: [moment(), moment()],
			},
			paginationData: {
				total: 0,
				current: 1,
				size: 10,
			},
			alarmList: [],
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
		getAlarmList(current = 1, size = 10) {
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
}
</style>