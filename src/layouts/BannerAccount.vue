<template>
	<div class="banner-account-container">
		<a-badge :count="99" :offset="[0, 0]">
			<a-icon class="notify-icon" type="bell" />
		</a-badge>
		<div class="account">
			<a-avatar size="small" icon="user" />
			<a-popover trigger="click">
				<a-list slot="content" size="small" :data-source="dropdownOptions">
					<a-list-item slot="renderItem" slot-scope="item">
						<span class="list-item" @click="handleClick(item)">{{ item.name }}</span>
					</a-list-item>
				</a-list>
				<a-button type="link" ghost> 您好，张三 <a-icon type="caret-down" /> </a-button>
			</a-popover>
		</div>
	</div>
</template>

<script>
import { commonMinix } from "minixs"

export default {
	name: "BannerAccount",
	mixins: [commonMinix],
	data() {
		return {
			dropdownOptions: [
				{ name: "下载中心", path: "/download-center" },
				{ name: "报警设置", path: "/download-center" },
				{ name: "修改密码", path: "/download-center" },
				{ name: "退出登录", path: "", func: "" },
			],
		}
	},
    methods: {
        handleClick({ path, func }) {
            if (path) {
                return this.toPath(path)
            }
            this[func]()
        }
    }
}
</script>

<style lang="less" scoped>
@import url("styles/variables.less");

.banner-account-container {
	height: @banner-no-include-logo-height;
	display: flex;
	align-items: center;
	position: fixed;
	top: 0;
	right: 0;
	.ant-badg .ant-badge-count {
		height: 14px;
		line-height: 14px;
		transform: scale(0.2);
	}
	.notify-icon {
		font-size: 1.67rem;
	}
	.account {
		margin: 0 0 0 30px;
	}
	.ant-list .ant-list-item span {
		cursor: pointer;
	}
}
</style>