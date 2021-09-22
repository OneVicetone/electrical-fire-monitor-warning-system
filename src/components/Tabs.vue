<template>
    <a-tabs class="global-tab" v-model="activeKey" :type="type" @change="callbacks">
        <a-tab-pane v-for="tab in tabs" :key="tab.key" :tab="tab.name">
            <slot></slot>
        </a-tab-pane>
    </a-tabs>
</template>

<script>
export default {
    name:"Tabs",
    props: {
        tabs: {
            type: Array,
            default: () => ([
                {name: '数据阈值', key: '1'},
                {name: '消音&复位', key: '2'},
            ])
        },
        type: {
            type: String,
            default: 'card'
        }
    },
    data() {
        return {
            activeKey: '1'
        }
    },
    methods: {
        callbacks(key) {
            this.$emit('tab-change', key)
        },
    }
}
</script>
<style lang='less' scoped>
.global-tab {
    margin-top: 1.92rem;
    margin-bottom: 3.83rem;
    /deep/.ant-tabs-bar {
        border-bottom: 1px solid #0096FF;
    }
    /deep/ .ant-tabs-tab {
        width: 10.58rem;
        text-align: center;
        white-space: nowrap; 
        text-overflow: ellipsis; 
        overflow: hidden; 
        word-break: break-all;
        background: #090D18 !important;
        border-color: #3F4A77 !important;
        border-bottom: 1px solid #0096FF !important;
        font-size: 1.17rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #DCDCDC;
    }
    /deep/.ant-tabs-tab-active {
        border-color: #0096FF !important;
        border-bottom: 1px solid #090D18 !important;
    }
}
</style>