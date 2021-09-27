<template>
    <div class="label-and-value-container">
        <div class="label-list">
            <p v-for="item of labels" :key="item.label">
                {{ item.label }}
            </p>
        </div>
        <div class="val-list">
            <p v-for="item of labels" :key="item.label">
                {{ item.key && values[item.key] ? values[item.key] : '-' }}
            </p>
        </div>
    </div>
</template>

<script>
const labelArr = ["安装位置", "SIM 卡号", "ICCID 号", "版本号", "服务到期", "报警类型", "信号时间", "信号强度", "上报地址", "安全负责人", "联系方式" ]
export default {
    name: "LabelAndValue",
    props: {
        labels: {
            type: Array,
            default: () => labelArr.map(i => ({
                label: i,
                key: 'a'
            }))
        },
        values: {
            type: Object,
            default: () => {}
        }
    }
}
</script>

<style lang="less" scoped>
.label-and-value-container {
    display: flex;
    font-size: 1rem;
    padding: 2.25rem 1.83rem;
    > div {
        line-height: 12px;
    }
    .label-list {
        color: #81899C;
        padding: 0 1rem 0 0;
    }
    .value-list {
        color: #DCDCDC;
    }
}
</style>