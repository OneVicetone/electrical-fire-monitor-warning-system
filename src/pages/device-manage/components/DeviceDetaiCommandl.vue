<template>
    <Dialog v-model="visibles" title="发送指令" :forms="formData">
        <Tabs @tab-change="onChanges"></Tabs>
        <div class="comp-content flex-between">
            <div class="comp-content__form">
                <a-form-model :model="formData" :label-col="{ span: 4 }" :wrapper-col="{ style: 'width: 19.08rem' }">
                    <a-form-model-item v-for="(item, index) in threshold" :key="index" :label="item.label">
                        <div class="nowrap">
                            <a-input v-model="formData[item.model]" />
                            <span class="font">{{item.desc}}</span>
                        </div>
                    </a-form-model-item>
                </a-form-model>
                <section class="btns paddings">
                    <a-button type="primary" class="mr125" @click="doSure">确定</a-button>
                    <a-button class="bg-none" @click="$emit('input', false)">取消</a-button>
                </section>
            </div>
            <CommandRecord></CommandRecord>
        </div>
    </Dialog>
</template>

<script>
import Dialog from "components/Dialog.vue"
import Tabs from "components/Tabs.vue"
import CommandRecord from "components/CommandRecord.vue"
import { dialogControl } from "mixins"

export default {
    name:"DeviceDetaiCommandl",
    components: {
        Dialog, Tabs, CommandRecord
    },
    mixins: [dialogControl],
    data() {
        return {
            formData: {},
            threshold: [
                {label: '漏电阈值：', model: 'leakage', desc: '（建议设置80~1000mA）'},
                {label: '温度阈值：', model: 'temperature', desc: '（建议设置55~140℃）'},
                {label: '额定电压：', model: 'ratedVoltage', desc: '（建议设置10~500V）'},
                {label: '额定电流：', model: 'ratedCurrent', desc: '（建议设置5~6000mA）'},
                {label: '三相电流变比：', model: 'threePhase', desc: '（建议设置1~1000）'},
                {label: '上传频率：', model: 'uploadFrequency', desc: '（建议设置5-1440分钟）'},
                {label: '心跳频率：', model: 'heartRate', desc: '（建议设置2-1440分钟）'},
            ],
        }
    },
    methods: {
        onChanges(key) {

        },
        doSure() {
            this.log('确定', this.formData)
        },
    }
}
</script>
<style lang='less' scoped>
.comp-content {
    &__form {
        width: 100%;
        /deep/ .ant-form-item-label > label {
            font-size: 1.17rem;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #DCDCDC;
        }
        .font {
            font-size: 1.17rem;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #3F4A77
        }
        .paddings {
            padding-left: calc( 10.75rem - 24px);
            padding-top: 7.08rem;
            padding-bottom: calc( 10.83rem - 24px);
            padding-right: 0;
        }
    }
}
</style>