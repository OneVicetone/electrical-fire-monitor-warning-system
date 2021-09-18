<template>
    <Dialog v-model="isShowHandle" title="报警处理">
        <section class="dialog-area-content flex">
            <section class="left">
                <Nav-titles title="报警设备信息" class="equipment">
                    <div class="mb175 flex-y-center">
                        <div class="display-ib t-center">
                            <a-icon type="apple" />
                            <div class="yahei-400">高危</div>
                        </div>
                        <div class="ml225 display-ib">
                            <div class="yahei-bold size133 mb58">过温报警</div>
                            <div class="yahei-400">2020-08-10 10:20</div>
                        </div>
                    </div>
                    <div class="equipment-info flex-d-col yahei-400">
                        <span v-for="(value, key, index) in equipment" :key="index">
                            {{ mapValue(key)+ '：' +value }}
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
                    <a-radio-group class="radio-wd" v-model="warnSure" :options="warnOpt" @change="e => onChanges(e, 'sure')" />
                    <br />
                    <span class="yahei-400">处理方式：</span>
                    <a-radio-group class="radio-wd" v-model="dealWith" :options="method" @change="e => onChanges(e, 'deal')" />
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
        <section class="btns pb t-center">
            <a-button type="primary" class="mr125">确定</a-button>
            <a-button class="bg-none" @click="$emit('update:dialogVisible', false)">取消</a-button>
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

    },
    data() {
        return {
            equipment: {
				detail: '65℃',
				reset: '',
				equips: '电气火灾探测器 DQ865651221',
				unit: '深圳市',
				address: '广东省深圳',
				place: '办公室'
			},
			warnSure: '',
			dealWith: '',
			warnOpt: [
				{ label: '真实报警', value: '1' },
				{ label: '误报', value: '2' },
				{ label: '测试', value: '3' },
			],
			method: [
				{ label: '已核查', value: '1' },
				{ label: '已通知用户', value: '2' },
				{ label: '下发整改通知', value: '3' },
			]
        }
    },
    computed: {
        isShowHandle() {
            return this.dialogVisible;
        }
    },
    methods: {
        mapValue(item) {
			const key = {
				detail: '报警详情',
				reset: '报警恢复',
				equips: '报警设备',
				unit: '报警单位',
				address: '报警地址',
				place: '安装位置'
			}
			return key[item];
		},
        onChanges(e, type) {
			console.log(e, type)
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
		}
	}
}
.btns {
    &.pb {
        padding-bottom: 7.25rem;
        padding-top: 8.42rem;
    }
    .bg-none {
        background: none;
    }
}
</style>