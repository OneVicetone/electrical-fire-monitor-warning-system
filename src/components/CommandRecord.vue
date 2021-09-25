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
                    <a-popover title="Title" trigger="hover" placement="bottomRight">
                        <template slot="content">
                            <p>Content</p>
                            <p>Content</p>
                        </template>
                        <a-icon type="caret-down" />
                    </a-popover>
                </div>
            </a-timeline-item>
            <a-timeline-item>
                <img slot="dot" src="assets/icons/error.png" class="icons" alt="">
                <div class="flex-yCenter">
                    <div class="mr317">
                        <div>指令状态：发送成功</div>
                        <div>指令内容：漏电阈值  20...</div>
                        <div>发  送 人：王标</div>
                        <div class="wd1633 yahei t-ellipsis">发送时间：2018-06-14 17：26：18</div>
                        <div class="wd1633 yahei t-ellipsis">应答时间：2018-06-14 17：27：10</div>
                    </div>
                    <a-popover title="Title" trigger="hover" placement="bottomRight">
                        <template slot="content">
                            <p>Content</p>
                            <p>Content</p>
                        </template>
                        <a-icon type="caret-down" />
                    </a-popover>
                </div>
            </a-timeline-item>
            <a-timeline-item>
                <img slot="dot" src="assets/icons/waiting.png" class="icons" alt="">
                <div class="flex-yCenter">
                    <div class="mr317">
                        <div>指令状态：发送成功</div>
                        <div>指令内容：漏电阈值  20...</div>
                        <div>发  送 人：王标</div>
                        <div class="wd1633 yahei t-ellipsis">发送时间：2018-06-14 17：26：18</div>
                        <div class="wd1633 yahei t-ellipsis">应答时间：2018-06-14 17：27：10</div>
                    </div>
                    <a-popover title="Title" trigger="hover" placement="bottomRight">
                        <template slot="content">
                            <p>Content</p>
                            <p>Content</p>
                        </template>
                        <a-icon type="caret-down" />
                    </a-popover>
                </div>
            </a-timeline-item>
            <a-timeline-item>
                <img slot="dot" src="assets/icons/waiting.png" class="icons" alt="">
                <div class="flex-yCenter">
                    <div class="mr317">
                        <div>指令状态：发送成功</div>
                        <div>指令内容：漏电阈值  20...</div>
                        <div>发  送 人：王标</div>
                        <div class="wd1633 yahei t-ellipsis">发送时间：2018-06-14 17：26：18</div>
                        <div class="wd1633 yahei t-ellipsis">应答时间：2018-06-14 17：27：10</div>
                    </div>
                    <a-popover title="Title" trigger="hover" placement="bottomRight">
                        <template slot="content">
                            <p>Content</p>
                            <p>Content</p>
                        </template>
                        <a-icon type="caret-down" />
                    </a-popover>
                </div>
            </a-timeline-item>
        </a-timeline>
        <Pagination :showQuickJumper="false" :showSizeChanger="false"></Pagination>
    </div>
</template>

<script>
import Pagination from "components/Pagination.vue"

export default {
    name:"CommandRecord",
    components: { Pagination },
    props: {
        details: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {

        }
    },
    computed: {
        list() {
            const status = {
                '发送中': 'assets/icons/waiting.png',
                '取消': 'assets/icons/error.png',
            }
            return this.details.map(item => {
                item.icon = status[item.sendStatus];
                return item;
            })
        }
    },
    created() {

    },
}
</script>
<style lang='less' scoped>
.reset-timeline {
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
</style>