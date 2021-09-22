<template>
 <!-- :pending="true" 可以控制第一个节点或最后一个节点的延长线 -->
    <a-timeline class="reset-timeline">
         <!-- v-for="(status, index) in details" :key="index" -->
        <a-timeline-item>
            <a-icon slot="dot" type="check-circle" style="font-size: 16px" />
            <div class="flex-yCenter">
                <div class="mr317">
                    <div>指令状态：发送成功</div>
                    <div>指令内容：漏电阈值  20...</div>
                    <div>发  送 人：王标</div>
                    <div class="wd1633 yahei t-ellipsis">发送时间：2018-06-14 17：26：18</div>
                    <div class="wd1633 yahei t-ellipsis">应答时间：2018-06-14 17：27：10</div>
                </div>
                <a-popover title="Title" trigger="hover">
                    <template slot="content">
                        <p>Content</p>
                        <p>Content</p>
                    </template>
                    <a-icon type="caret-down" />
                </a-popover>
            </div>
        </a-timeline-item>
        <!-- <a-timeline-item>
            <a-icon slot="dot" type="close-circle" style="font-size: 16px"/>
            <div>指令状态：发送成功</div>
            <div>指令内容：漏电阈值  20...</div>
            <div>发  送 人：王标</div>
            <div>发送时间：2018-06-14 17：26：18</div>
            <div>应答时间：2018-06-14 17：27：10</div>
        </a-timeline-item>
        <a-timeline-item>
            <a-icon slot="dot" type="clock-circle" style="font-size: 16px"/>
            <div>指令状态：发送成功</div>
            <div>指令内容：漏电阈值  20...</div>
            <div>发  送 人：王标</div>
            <div>发送时间：2018-06-14 17：26：18</div>
            <div>应答时间：2018-06-14 17：27：10</div>
        </a-timeline-item> -->
    </a-timeline>
</template>

<script>
export default {
    name:"CommandRecord",
    data() {
        return {

        }
    },
    created() {

    },
    mounted() {

    }
}
</script>
<style lang='less' scoped>
.mr317 {
    margin-right: 3.17rem;
}
.wd1633 {
    width: 16.33rem;
}
</style>