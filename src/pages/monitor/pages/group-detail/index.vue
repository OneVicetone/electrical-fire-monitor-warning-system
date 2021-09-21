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
				</div>
				<div class="system-design-drawings">
					<ContentTitle title="电气火灾系统设计图纸" />
				</div>
			</div>

			<div class="center-content">
				<div class="history-chart">
					<ContentTitle title="历史用电统计" />
				</div>
			</div>

			<div class="right-content">
				<div class="device-service-time-count">
					<ContentTitle title="设备服务期统计" />
				</div>
				<div class="alarm-type-count">
					<ContentTitle title="报警类型统计" />
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
		}
	},
	mounted() {
		console.log(this.id)
	},
}
</script>

<style lang="less" scoped>
@import url("styles/common.less");

.group-detail-cintainer {
	.pages-container-no-child-layout();
	padding-left: 1.5rem;
	padding-right: 1.5rem;
	> section {
		display: flex;
		> div {
			background-color: #131a2d;
		}
		.left-content,
		.right-content {
			flex: 0 0 auto;
			width: 31.67rem;
		}
		.left-content {
			.fraction {
				.fraction-text {
					width: 12.5rem;
					height: 9.75rem;
					margin: 1.83rem 0 0 8.17rem;
					background: url("assets/images/marker-info-fraction.png") no-repeat;
					background-size: 100%;
				}
			}
		}
		.center-content {
			width: 100%;
			margin: 0 1.25rem;
		}
		.right-content {
		}
	}
}
</style>