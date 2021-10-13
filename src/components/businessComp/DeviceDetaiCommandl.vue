<template>
    <Dialog class="dialog-custom" v-model="visibles" :coefficient="1.2" title="发送指令">
        <Tabs v-model="tabModel" :tabs="tabArr"></Tabs>
        <div class="comp-content flex-between">
            <!-- 820 && 数据阙值 || 复位 -->
            <div class="comp-content__form" v-if="defaultValue && defaultValue.protocolType === '820'">
                <a-form-model v-if="showComp" :model="formData" :label-col="{ span: 4 }" :wrapper-col="{ style: 'width: 19.08rem' }">
                    <a-form-model-item v-for="(item, index) in threshold" :key="index" :label="item.label">
                        <div class="nowrap">
                            <a-input v-model="formData[item.model]" />
                            <span class="font">{{item.desc}}</span>
                        </div>
                    </a-form-model-item>
                </a-form-model>
                <a-radio-group v-else v-model="formData.control">
                    <a-radio value="quiet">消音</a-radio>
                    <a-radio value="reset">复位</a-radio>
                </a-radio-group>
                <section class="btns paddings">
                    <a-button type="primary" v-if="showComp" class="mr125" @click="doSure">确定</a-button>
                    <a-button type="primary" v-else class="mr125" @click="sendDev('820')">发送指令</a-button>
                    <a-button class="bg-none" @click="$emit('input', false)">取消</a-button>
                </section>
            </div>
            <!-- B9S && 数据阙值 || x || y -->
            <div class="comp-content__form" v-else>
                <div v-if="tabModel === '1'" class="form-ipt">
                    <div class="yahei">数据上传：按照本地的时钟每30分钟上传一次，心跳数据每30s一条</div>
                    <div class="forms">
                        <div v-for="(item, index) in B9SThreshold" :key="index" class="flex-center" style="margin-bottom: 2rem;">
                            <div class="display-ib" style="width: 29rem;">
                                <span class="font label-name">{{item.label}}：</span>
                                <a-input style="width: 10rem" v-model="B9SForm[item.model]" disabled/>
                                <span class="font">{{item.desc}}</span>
                            </div>
                            <div class="btn" @click="onModify(item)">修改</div>
                        </div>
                    </div>
                </div>
                <div v-else-if="tabModel === '3'" class="openClose">
                    <div>
                        <span class="yahei tx-r">操作分合闸：</span>
                        <a-radio-group v-model="B9SForm.workMode">
                            <a-radio value="1">自动</a-radio>
                            <a-radio value="2">手动</a-radio>
                        </a-radio-group>
                        <ul class="desc yahei">
                            <li>(1、手动模式下，不能远程进行开关控制，默认自动模式)</li>
                        </ul>
                    </div>
                    <div>
                        <span class="yahei tx-r">开关控制：</span>
                        <a-radio-group v-model="B9SForm.workStatus">
                            <a-radio value="1">分闸</a-radio>
                            <a-radio value="2">合闸</a-radio>
                            <a-radio value="3">闭锁</a-radio>
                            <a-radio value="4">解锁</a-radio>
                        </a-radio-group>
                        <ul class="desc yahei">
                            <li>1、当前开关状态：合闸</li>
                            <li>2、闭锁后不能远程控制开关，需要先在设备那里手动解锁</li>
                            <li>3、远程下发指令合闸，必须先开启自动分合闸模式</li>
                        </ul>
                    </div>
                </div>
                <div v-else class="route">
                    <div class="improt yahei">智能空开需要与网关路由绑定后才可以上报数据</div>
                    <span class="yahei">绑定路由：</span>
                    <a-input class="ipt" v-model="B9SForm.gateway"></a-input>
                </div>
                <section class="btns paddings" v-if="tabModel !== '1'">
                    <a-button type="primary" class="mr125" @click="sendDev">发送指令</a-button>
                    <a-button class="bg-none" @click="$emit('input', false)">取消</a-button>
                </section>
            </div>
            <NavTitles class="vs-custom" title="指令记录">
                <div slot="header" class="header">
                    <a-select class="ml375" style="width: 9.67rem" v-model="drevNotes" @change="notesChange">
                        <a-select-option v-for="item in selectOpt" :key="item.value" :value="item.value">
                            {{item.name}}
                        </a-select-option>
                    </a-select>
                    <img class="icons-wd ml83 pointer" src="@/assets/icons/refresh.png" @click="getList" alt="">
                </div>
                <CommandRecord
                    :details="records"
                    :paginationData="pagination"
                    @handlePage="onPage"></CommandRecord>
            </NavTitles>
        </div>
        <ModifyValue v-model="modifyLlog"
            :emitValue="emitValue" :modelValue="modelValue"
            this.modelB9SForm = this.B9SForm;
            :deviceId="source === 'alarm' ? againDevice : $route.params.id"
            @sure-modify="modifyEvent">
        </ModifyValue>
    </Dialog>
</template>

<script>
import Dialog from "components/Dialog.vue"
import Tabs from "components/Tabs.vue"
import NavTitles from "components/NavTitles.vue"
import CommandRecord from "components/businessComp/CommandRecord.vue"
import ModifyValue from "components/businessComp/ModifyValue.vue"
import { dialogControl } from "mixins"
import apis from "apis"

const { deviceCmd, commandPageList } = apis;

export default {
    name:"DeviceDetaiCommandl",
    components: {
        Dialog, Tabs, NavTitles, CommandRecord, ModifyValue
    },
    mixins: [dialogControl],
    props: {
        againDevice: [Number, String],
        source: {
            type: String,
            default: ''
        },
        // 传递过来得默认值
        defaultValue: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            tabModel: '1',
            formData: {
                control: 'quiet'
            },
            threshold: [
                {label: '漏电阈值：', model: 'iz', desc: '（建议设置80~1000mA）'},
                {label: '温度阈值：', model: 'temp', desc: '（建议设置55~140℃）'},
                {label: '额定电压：', model: 'rv', desc: '（建议设置10~500V）'},
                {label: '额定电流：', model: 'rc', desc: '（建议设置5~6000mA）'},
                {label: '三相电流变比：', model: 'ccr', desc: '（建议设置1~1000）'},
                {label: '上传频率：', model: 'realFreq', desc: '（建议设置5-1440分钟）'},
                {label: '心跳频率：', model: 'beatsFreq', desc: '（建议设置2-1440分钟）'},
            ],
            B9SForm: {},
            B9SThreshold: [
                {label: '漏电阈值', model: 'iz', desc: '（80~1000mA）'},
                {label: '过温阈值', model: 'temp', desc: '（40~150℃）'},
                {label: '过压阈值', model: 'ov', desc: '（100~500V）'},
                {label: '欠压阈值', model: 'uv', desc: '（10~500V）'},
                {label: '过电流', model: 'oi', desc: '（5~6000mA）'},
                {label: '过功率', model: 'op', desc: '（10~655350 W）'},
                {label: '过电能', model: 'os', desc: '（0~65535 kWh）'},
                {label: '额定电压', model: 'rv', desc: '（0~500 V）'},
                {label: '漏电时间', model: 'izTm', desc: '（100-2000ms）'},
                {label: '过温时间', model: 'tempTm', desc: '（0.1-360s）'},
                {label: '过压时间', model: 'ovt', desc: '（0.1-360s）'},
                {label: '欠压时间', model: 'uvt', desc: '（0.1-360s）'},
                {label: '过电流时间', model: 'oit', desc: '（0.1-360s）'},
                {label: '过功率时间', model: 'opt', desc: '（0.1-360s）'},
                {label: '过电能时间', model: 'ost', desc: '（0.1-360s）'},
                {label: '额定电流', model: 'rc', desc: '（0-2000A）'},
            ],
            drevNotes: '1',
            selectOpt: [
                { name: '数据阈值', value: '1' },
                { name: '消音&复位', value: '2' },
            ],
            records: [],
            total: 0,
            radioGroup: 'quiet',
            pagination: {
                total: 0,
				current: 1,
				size: 5,
            },
            modifyLlog: false,
            emitValue: {},
            modelValue: '',
        }
    },
    watch: {
       visibles(v) {
           this.tabModel = '1';
            if (v) {
                this.getList()
                if (this.defaultValue && this.defaultValue.protocolType === '820') {
                    this.formData = {...this.formData, ...this.defaultValue && this.defaultValue.threshold};
                    this.B9SForm = {}

                } else {
                    this.B9SForm = this.defaultValue && this.defaultValue.threshold;
                    this.formData = {}
                }
            }
        }
    },
    computed: {
        tabArr() {
            let arr = [];
            if (this.defaultValue?.protocolType === '820') {
                arr.push({ name: '数据阈值', key: '1' }, { name: '消音&复位', key: '2' })
            } else {
                arr.push(
                    { name: '数据阈值', key: '1' },
                    { name: '合闸开闸', key: '3' },
                    { name: '路由绑定', key: '4' }
                )
            }
            return arr;
        },
        showComp() {
            return this.tabModel === '1';
        }
    },
    methods: {
        getList({ current = 1, size = 5 } = {}) {
            const {
                $route: {
                    params: { id }
                },
                drevNotes,
                againDevice,
                source
            } = this;
            const params = {
                current,
                size,
                deviceId: source === 'alarm' ? againDevice : id,
                cmdType: drevNotes
            }
            commandPageList(params).then(({ data }) => {
                const { records = [], total = 0 } = data || {};
                console.log('获取弹窗内list', records)
                this.records = records;
                this.pagination.total = total;
            });
        },
        notesChange() {
            this.getList();
        },
        async doSure() {
            const {
                tabModel,
                formData,
                $route: {
                    params: { id }
                },
                againDevice,
                source
            } = this;
            const copys = {...formData};
            delete copys.control;
            const params = {
				deviceId:  source === 'alarm' ? againDevice : id,
				cmdType: tabModel,
				content: {...copys}
			}
            const result = await deviceCmd(params);
            console.log('指令结果', result)
            this.$message.success('更新成功');
            this.$emit('on-res');
            this.$emit('input', false);
        },
        async sendDev(type) {
            if (type === '820' && !this.formData.control) {
                this.$message.warning('请选择指令内容');
            }
            const {
                tabModel,
                formData,
                B9SForm,
                $route: {
                    params: { id }
                },
                againDevice,
                source
            } = this;
            const data820 = {
                control: formData.control
            }
            const dataB9S = {
                3: {
                    workMode: B9SForm.workMode,
                    workStatus: B9SForm.workStatus
                },
                4: {
                    gateway: B9SForm.gateway
                }
            }
            const data = this.defaultValue && this.defaultValue.protocolType === '820' ? data820 : dataB9S[tabModel];
            const params = {
				deviceId:  source === 'alarm' ? againDevice : id,
				cmdType: tabModel,
				content: {...data}
			}
            const result = await deviceCmd(params);
            console.log('指令结果', result)
            this.$message.success('更新成功');
            this.$emit('on-res');
            this.$emit('input', false);
        },
        onPage(val) {
            this.getList({current: val, size:5});
        },
        onModify(value) {
            this.modifyLlog = true;
            this.emitValue = value;
            this.modelValue = this.B9SForm[value.model];
        },
        async modifyEvent(params) {
            const result = await deviceCmd(params);
            console.log(result)
            this.getList()
            this.$message.success('更新成功');
            this.$emit('on-res');
        }
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
        .form-ipt {
            .forms {
                height: 47rem;
                display: flex;
                flex-direction: column;
                flex-wrap: wrap;
                padding-top: 2rem;
                .label-name {
                    display: inline-block;
                    width: 7.5rem;
                    text-align: right;
                }
                .btn {
                    width: 3rem;
                    height: 2rem;
                    color: #fff;
                    background-color:#3F4A77;
                    font-size: 1rem;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    text-align: center;
                    cursor: pointer;
                }
            }
        }
    }
    .vs-custom {
        // 待修改
        width: 31rem;
        white-space: nowrap;
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
    .openClose {
        .desc {
            margin-left: 70px;
            list-style: none;
            margin-top: 1rem;
        }
        .ant-radio-group {
            label {
                font-family: Microsoft YaHei;
                font-weight: 400;
                font-size: 1rem;
                color: #DCDCDC;
            }
        }
    }
    .route {
        .improt {
            margin-bottom: 1rem;
        }
        .ipt {
            width: 15rem;
        }
    }
}
</style>