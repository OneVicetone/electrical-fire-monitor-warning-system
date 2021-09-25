<template>
	<div class="group-detail-cintainer">
		<Breadcrumb :historyList="historyList" />
		<section>
			<div class="left-content">
				<div class="fraction">
					<ContentTitle title="电气消防安全21年8月评估分" />
					<div class="fraction-text"></div>
				</div>
				<div class="group-info">
					<ContentTitle title="单位信息" />
					<div class="group-info-table">
						<div class="table-item" v-for="item of groupInfoList" :key="item.label">
							<div class="label">{{ item.label }}</div>
							<div class="value">{{ item.value }}</div>
						</div>
					</div>
				</div>
				<div class="system-design-drawings">
					<ContentTitle title="电气火灾系统设计图纸" />
					<img class="enlarge-icon" src="assets/icons/enlarge-img-icon.png" alt="enlarge-icon" @click="enlargeImg" />
					<img class="drawings-img" src="assets/icons/enlarge-img-icon.png" alt="drawings-img" />
				</div>
			</div>

			<div class="center-content">
				<div class="history-chart">
					<ContentTitle :title="historyChartTitle" @changeTitleContent="changeTitleContent" />
				</div>
			</div>

			<div class="right-content">
				<div class="device-service-time-count">
					<ContentTitle title="设备服务期统计" />
					<div id="device_service_time_count_chart"></div>
				</div>
				<div class="alarm-type-count">
					<ContentTitle title="报警类型统计" />
					<div id="alarm_type_count_chart"></div>

				</div>
				<div class="service-type-count">
					<ContentTitle title="设备服务期统计" />
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import Breadcrumb from "components/Breadcrumb.vue"
import ContentTitle from "components/ContentTitle.vue"

export default {
	name: "GroupDetail",
	components: { Breadcrumb, ContentTitle },
	props: {
		id: String,
	},
	data() {
		return {
			historyList: ["首页", "设备监控", "单位详情"],
			historyChartTitle: [
				{ name: '历史用电统计', key: 'history' },
				{ name: '历史报警统计', key: 'alarm' },
				{ name: '设备列表', key: 'device' },
			],
			groupInfoList: [
				{ label: "单位类型", value: "国有企业" },
				{ label: "占地面积", value: "2500㎡" },
				{ label: "公司人数", value: "500" },
				{ label: "安全负责人", value: "张三" },
				{ label: "联系方式", value: "135785623552" },
				{ label: "公司地址", value: "广东省深圳市宝安区华丰机器人产业园F栋413" },
			],
		}
	},
	mounted() {
		console.log(this.id)
	},
	methods: {
		enlargeImg() {},
		changeTitleContent(key) {
			console.log(key)
		}
	},
}
</script>

<style lang="less" scoped>
@import url("styles/common.less");

@chunk-bg-color: #131a2d;
@content-default-padding: 1.67rem 0 0 1.17rem;

.group-detail-cintainer {
	.pages-container-no-child-layout();
	padding-left: 1.5rem;
	padding-right: 1.5rem;
	> section {
		// max-height: 100%;
		display: flex;
		.left-content,
		.right-content {
			flex: 0 0 auto;
			width: 31.67rem;
		}
		> div:not(.center-content) {
			> div {
				background-color: #131a2d;
				&:not(div:first-child) {
					margin-top: 1.25rem;
				}
			}
		}
		.left-content {
			.fraction {
				height: 16.67rem;
				padding: @content-default-padding;
				background-color: @chunk-bg-color;
				.fraction-text {
					width: 12.5rem;
					height: 9.75rem;
					margin: 1.83rem 0 0 8.17rem;
					background: url("assets/images/marker-info-fraction.png") no-repeat;
					background-size: 100%;
				}
			}
			.group-info {
				height: 27.71rem;
				padding: 1.42rem 1.25rem 2.17rem 1.67rem;
				background-color: @chunk-bg-color;
				@border: 1px solid #1f2944;
				.group-info-table {
					margin-top: 1.58rem;
					.table-item {
						height: 3rem;
						display: flex;
						border: @border;
						border-top: 0px;
						> div {
							display: flex;
							align-items: center;
							color: #aaddff;
							font-size: 1rem;
						}
						.label {
							width: 9.17rem;
							background-color: #131f37;
							justify-content: center;
							border-right: @border;
						}
						.value {
							width: 21.25rem;
							padding: 0 0 0 1.83rem;
							justify-content: flex-start;
							background-color: transparent;
						}
					}
					.table-item:first-child {
						border-top: 1px;
					}
				}
			}
			.system-design-drawings {
				height: 25.83rem;
				padding: 1.42rem 2.5rem 1.25rem 1.67rem;
				position: relative;
				.enlarge-icon {
					height: 1.58rem;
					width: 1.58rem;
					position: absolute;
					top: 1.42rem;
					right: 1.83rem;
					cursor: pointer;
				}
			}
		}
		.center-content {
			width: 100%;
			height: 25.83rem;
			margin: 0 1.25rem;
			padding: 1.42rem 0 0 1.67rem;
			background-color: #131a2d;
			align-self: flex-end;
		}
		.right-content {
			.device-service-time-count {
				height: 16.75rem;
				padding: @content-default-padding;
			}
			.alarm-type-count {
				height: 27.33rem;
				padding: @content-default-padding;
			}
			.service-type-count {
				height: 25.83rem;
				padding: @content-default-padding;
			}
		}
	}
}
</style>