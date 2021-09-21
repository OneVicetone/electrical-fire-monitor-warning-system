<template>
    <Dialog v-model="isShowHandle" title="报警处理">
        <!-- <div v-for="(value, key,index) in showList" :key="index">
            <span style="background: red">{{key}}</span>===
            <span>{{value}}</span>
        </div> -->
        <section class="dialog-area-content flex">
            <section class="left">
                <Nav-titles title="报警设备信息" class="equipment">
                    <div class="mb175 flex-yCenter">
                        <div class="display-ib t-center">
                            <a-icon type="apple" />
                            <div class="yahei-400">{{ mapValue(showList.alarmLevel, 'alarmLevel') }}</div> 
                        </div>
                        <div class="ml225 display-ib">
                            <div class="yahei-bold size133 mb58">过温报警</div>
                            <div class="yahei-400">{{ showList.alarmTime }}</div>
                        </div>
                    </div>
                    <div class="equipment-info flex-d-col yahei-400">
                        <span v-for="(value, key, index) in equipment" :key="index">
                            {{ mapValue(key, 'deviceInfo')+ '：' +value }}
                        </span>
                    </div>
                </Nav-titles>
                <Nav-titles title="报警处理意见">
                    <div class="yahei-400">
                        电线头接触不良或电路过载可能会引起电路温度过高。建议查看电线接头处是否接触不良。若同时发生过载报警，则可能是电路超负载引起的电路高温报警。
                    </div>
                </Nav-titles>
                <Nav-titles title="报警处理" class="deal">
                    <span class="yahei-400">警情确定：</span>
                    <a-radio-group class="radio-wd" v-model="warnSure" :options="warnOpt" :disabled="!able" />
                    <br />
                    <span class="yahei-400">处理方式：</span>
                    <a-radio-group class="radio-wd" v-model="dealWith" :options="methodOpt" :disabled="!able" />
                    <br />
                    <span class="yahei-400">指令下发：</span>
                    <a class="yahei-400 underline" href="javascript:void(0)">下发指令></a>
                </Nav-titles>
            </section>
            <section class="right">
                <Nav-titles title="报警处理">
                    <Simple-table></Simple-table>
                </Nav-titles>
            </section>
        </section>
        <section class="btns pb t-center" v-if="able">
            <a-button type="primary" class="mr125" @click="sure">确定</a-button>
            <a-button class="bg-none" @click="$emit('input', false)">取消</a-button>
        </section>
    </Dialog>
</template>

<script>
import Dialog from "components/Dialog.vue"
import NavTitles from "components/NavTitles.vue"
import SimpleTable from "components/SimpleTable.vue"

export default {
    name:"DealWithDialog",
    components: { Dialog, NavTitles, SimpleTable },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        able: {
            type: Boolean,
            default: false
        },
        alarmData: {
            type: Object,
            default: () => ({})
        }
    },
    model: {
		prop: "dialogVisible",
        event: "input"
	},
    data() {
        return {
			warnSure: '',
			dealWith: '',
			warnOpt: [
				{ label: '真实报警', value: '1' },
				{ label: '误报', value: '2' },
				{ label: '测试', value: '3' },
			],
			methodOpt: [
				{ label: '已核查', value: '1' },
				{ label: '已通知用户', value: '2' },
				{ label: '下发整改通知', value: '3' },
			]
        }
    },
    computed: {
        isShowHandle: {
            get: function() { return this.dialogVisible },
			set(v){ this.$emit('input', v) }
        },
        showList() {
            return this.alarmData;
        },
        equipment() {
            const { deviceAlias = '--', deviceSn = '--', groupName = '--', address = '--',  installPosition = '--'} = this.showList;
            return {
                address,
				detail: '65℃',
				reset: '',
				equips: `${deviceAlias} ${deviceSn}`,
				unit: groupName || '--',
				place: installPosition || '--'
			}
        },
    },
    watch: {
        dialogVisible(v) {
            if (v) {
                const { processBOList } = this.alarmData;
                const { confirmFlag = '', processType = '' } = processBOList[0] || {};
                this.log('---------', confirmFlag, processType)
                this.warnSure = `${confirmFlag}`;
                this.dealWith = `${processType}`;
            }
        }
    },
    methods: {
        mapValue(item, type) {
            const _map = {
                alarmLevel: { 1: '预警', 2: '高危' },
                deviceInfo: {
                    detail: '报警详情',
                    reset: '报警恢复',
                    equips: '报警设备',
                    unit: '报警单位',
                    address: '报警地址',
                    place: '安装位置'
                },
            }
            return _map[type][item] || '--'
		},
        sure() {
            const { showList: { id }, warnSure, dealWith } = this;
            const params = { 
                alarmId: id,
                confirmFlag: warnSure,
                processType: dealWith
            }
            this.$emit('on-sure', params);
        }
    }
}
</script>
<style lang='less' scoped>
.dialog-area-content {
	.left {
		.equipment {
			&-info {
				span {
					display: block;
				}
			}
		}
	}
	.deal {
		.radio-wd {
			margin-bottom: 2rem;
			/deep/ .ant-radio-wrapper {
				width: 10rem;
				font-size: 1rem;
				font-family: Microsoft YaHei;
				font-weight: 400;
				color: #DCDCDC;
			}
            /deep/ .ant-radio-wrapper-disabled {
                span:last-child {
                    color: #DCDCDC;
                }
            }
		}
	}
}
</style>