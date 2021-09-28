<template>
    <div class="222">
        <!-- :pending="true" 可以控制第一个节点或最后一个节点的延长线 -->
        <a-timeline class="reset-timeline">
            <a-timeline-item v-for="(status, index) in list" :key="index">
                <img slot="dot" :src="status.icon" class="icons" alt="">
                <div class="flex-yCenter">
                    <div class="mr317">
                        <div>指令状态：{{status.sendStatus}}</div>
                        <div>指令内容：{{status.sendContent}}</div>
                        <div>发  送 人：{{status.sendUser}}</div>
                        <div class="wd1633 yahei t-ellipsis">发送时间：{{status.sendTime}}</div>
                        <div class="wd1633 yahei t-ellipsis">应答时间：{{status.responseTime}}</div>
                    </div>
                    <a-popover trigger="hover" placement="bottomRight">
                        <template slot="content">
                            <p v-for="(item, index) in doContent(status.sendContent)" :key="index">{{item}}</p>
                            <p v-if="!status.sendContent">暂无数据</p>
                        </template>
                        <a-icon type="caret-down" />
                    </a-popover>
                </div>
            </a-timeline-item>
        </a-timeline>
        <a-pagination
			size="small"
			v-model="paginationData.current"
			:pageSize="paginationData.size"
			:total="paginationData.total"
			:show-total="(total, range) => `共${total}条 ${range[1]}页`"
			:show-size-changer="false"
			@showSizeChange="changePageSizeHandle"
			@change="changePageHandle"
			:showQuickJumper="false"
		/>
    </div>
</template>

<script>
import waiting from "assets/icons/waiting.png"
import bingo from "assets/icons/bingo.png"
import errors from "assets/icons/error.png"
import cancel from "assets/icons/cancel.png"

export default {
    name:"CommandRecord",
    props: {
        details: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            paginationData: {
                total: 200,
				current: 50,
				size: 10,
            }
        }
    },
    computed: {
        list() {
            const status = {
                '1': waiting,
                '2': bingo,
                '3': errors,
                '4': cancel,
            }
            return this.details.map(item => {
                item.icon = status[item.status];
                return item;
            })
        }
    },
    methods: {
        doContent(data) {
            return data && data.split(';');
        },
        changePageSizeHandle() {},
        changePageHandle() {},
    }
}
</script>
<style lang='less' scoped>
.reset-timeline {
    height: 50rem;
    overflow-y: scroll;
    padding-left: 0.2rem;
    /deep/ .ant-timeline-item-content {
        font-size: 1rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #DCDCDC;
    }
    /deep/ .ant-timeline-item-head-custom {
        background: #090D18;
        padding: 0;
        line-height: 0;
        .icons {
            width: 1.33rem;
            height: 1.33rem;
        }
        &.ant-timeline-item-head {
            background-color: #090D18;
        }
    }
    /deep/ .ant-timeline-item {
        padding-bottom: 2.33rem;
    }
    /deep/ .ant-timeline-item-last {
        padding: 0;
        .ant-timeline-item-tail {
            display: inline-block;
        }
    }
    .mr317 {
        margin-right: 3.17rem;
    }
    .wd1633 {
        width: 16.33rem;
    }
    
}
/deep/ .ant-pagination-total-text {
		font-size: 1rem;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #81899C;
	}
	/deep/ .ant-pagination-item-active {
		width: 2.5rem;
		height: 2.5rem;
		min-width: none;
		background: rgba(21, 35, 72, 0);
		line-height: 2.5rem;
		a {
			padding: 0;
		}
	}
</style>
<style>
.reset-timeline::-webkit-scrollbar {
    width: 4px;    
}
.reset-timeline::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
}
.reset-timeline::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);

}
</style>