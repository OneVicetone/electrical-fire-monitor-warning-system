<template>
    <Dialog class="dialog-custom" v-model="visibles" title="发送指令" :forms="formData">
        <Tabs v-model="tabModel"></Tabs>
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
            <NavTitles class="vs-custom" title="指令记录">
                <div slot="header" class="header">
                    <a-select class="ml375" default-value="lucy" style="width: 9.67rem" @change="selectChange">
                        <a-select-option value="jack">
                            Jack
                        </a-select-option>
                        <a-select-option value="lucy">
                            Lucy
                        </a-select-option>
                        <a-select-option value="disabled" disabled>
                            Disabled
                        </a-select-option>
                        <a-select-option value="Yiminghe">
                            yiminghe
                        </a-select-option>
                    </a-select>
                    <img class="icons-wd ml83 pointer" src="assets/icons/refresh.png" alt="">
                </div>
                <CommandRecord :details="records"></CommandRecord>
            </NavTitles>
        </div>
    </Dialog>
</template>

<script>
import Dialog from "components/Dialog.vue"
import Tabs from "components/Tabs.vue"
import NavTitles from "components/NavTitles.vue"
import CommandRecord from "components/CommandRecord.vue"
import { dialogControl } from "mixins"
import apis from "apis"

const { deviceCmd, commandPageList } = apis;

export default {
    name:"DeviceDetaiCommandl",
    components: {
        Dialog, Tabs, NavTitles, CommandRecord
    },
    mixins: [dialogControl],
    data() {
        return {
            tabModel: '1',
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
            records: []
        }
    },
    watch: {
       visibles(v) {
            v && this.getList()
        }
    },
    methods: {
        onChanges(key) {

        },
        selectChange() {},
        getList({ current = 1, size = 10 } = {}) {
            const {
                $route: {
                    params: { id }
                }
            } = this;
            const params = {
                current,
                size,
                deviceId: id
            }
            commandPageList(params).then(({ data }) => {
                const { records = [] } = data || {};
                console.log('获取弹窗内list', records)
                this.records = records;
            });
        },
        async doSure() {
            const {
                tabModel,
                formData: {
                    leakage = "",
                    temperature = "",
                    ratedVoltage = "",
                    ratedCurrent = "",
                    threePhase = "",
                    uploadFrequency = "",
                    heartRate = ""
                },
                $route: {
                    params: { id }
                }
            } = this;
            const params = {
				deviceId: id,
				cmdType: tabModel,
				content: {
					iz: leakage,
					temp: temperature,
					rv: ratedVoltage,
					rc: ratedCurrent,
					ccr: threePhase,
					realFreq: uploadFrequency,
					beatsFreq: heartRate
				}
			}
            const result = await deviceCmd(params);
            this.log('指令结果', result)
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
    .vs-custom {
        // 待修改
        width: 31rem;
        /deep/ .little-nav__title {
            margin-top: 0;
        }
        .ml375 {
            margin-left: 3.75rem;
        }
        .ml83 {
            margin-left: .83rem;
        }
    }
}
</style>