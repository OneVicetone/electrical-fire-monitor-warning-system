<template>
    <a-tabs class="global-tab" v-model="activeKey" :type="type" @change="callbacks">
        <a-tab-pane v-for="tab in tabs" :key="tab.key" :tab="tab.name" :disabled="tab.disabled">
            <slot></slot>
        </a-tab-pane>
    </a-tabs>
</template>

<script>
export default {
    name:"Tabs",
    model: {
		prop: "tab",
		event: "tabEvent",
	},
    props: {
        tab: {
            type: String,
            default: '1'
        },
        tabs: {
            type: Array,
            default: () => ([
                {name: '数据阈值', key: '1'},
                {name: '消音&复位', key: '2', disabled: false},
            ])
        },
        type: {
            type: String,
            default: 'card'
        }
    },
    data() {
        return {
            // activeKey: '1'
        }
    },
    computed: {
        activeKey: {
            get() {return this.tab},
            set(v) {this.$emit('tabEvent', v)}
        }
    },
    methods: {
        callbacks(key) {
            this.$emit('tab-change', key)
            this.$emit('tabEvent', key)
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
        color: #DCDCDC !important;
    }
    /deep/.ant-tabs-tab-active {
        border-color: #0096FF !important;
        border-bottom: 1px solid #090D18 !important;
    }
}
</style>