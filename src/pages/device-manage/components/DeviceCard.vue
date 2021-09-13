<template>
	<div class="device-card">
		<header>
			<div class="device-name">
				<img src="assets/icons/device-icon.png" alt="设备图标" />
				<span class="device-name">{{ deviceName }}</span>
			</div>
			<a-popover trigger="click">
				<a-list slot="content" size="small" :data-source="dropdownOptions">
					<a-list-item slot="renderItem" slot-scope="item">
						{{ item.name }}
					</a-list-item>
				</a-list>
				<a-icon type="ellipsis" />
			</a-popover>
		</header>
		<section>
			<div class="device-info">
				<div class="img" alt="设备图片" />
				<div class="info">
					<p>设备ID：{{ deviceId }}</p>
					<p>设备类型：{{ deviceType }}</p>
					<p>信号时间：{{ signalTime }}</p>
					<p>设备状态：{{ deviceStatus }}</p>
					<p>到期时间：{{ maturityTime }}</p>
				</div>
			</div>
			<a-table :columns="columns" size="small" rowClassName="row"></a-table>
		</section>
	</div>
</template>

<script>
export default {
	name: "DeviceCard",
	data() {
		return {
			columns: [
				{ title: "名称", dataIndex: "", key: "" },
				{ title: "1/A", dataIndex: "", key: "" },
				{ title: "2/B", dataIndex: "", key: "" },
				{ title: "3/C", dataIndex: "", key: "" },
				{ title: "4/N", dataIndex: "", key: "" },
			],
		}
	},
}
</script>

<style lang="less" scoped>
.device-card {
	width: 30rem;
	height: 28.33rem;
	background-color: #131a2d;
	border: 1px solid #00a0e9;
	box-shadow: 0px 3px 16px 0px rgba(0, 150, 255, 0.25);
	border-radius: 4px;
	padding: 0.92rem 1.25rem;
	> header {
		display: flex;
		justify-content: space-between;
		.device-name {
			> img {
				width: 2rem;
				height: 2rem;
				background-color: #0096ff;
			}
			> span {
				font-size: 1.17rem;
				color: #0096ff;
			}
		}
	}
	> section {
		.device-info {
			padding: 1.75rem 0 1.42rem 0;
			display: flex;
			align-items: center;
			.img {
				width: 6.5rem;
				height: 6.5rem;
				background: url("assets/images/device-default.png") no-repeat;
				background-color: #122849;
				background-size: 70%;
				background-position: 50% 50%;
				border-radius: 50%;
			}
			.info {
				margin: 0 0 0 1.17rem;
				color: #dcdcdc;
				font-size: 0.8rem;
				line-height: 6px;
			}
		}
		.row {
			height: 2rem;
		}
	}
}
</style>