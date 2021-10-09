<template>
    <Dialog v-model="isShowHandle" title="报警处理">
        <section class="dialog-area-content flex">
            <section class="left">
                <Nav-titles title="报警设备信息" class="equipment">
                    <div class="mb175 flex-yCenter">
                        <div class="display-ib t-center">
                            <!-- <a-icon type="apple" /> -->
                            <img class="imgs" :src="mapValue(showList.alarmLevel, 'alarmIcons')" alt="">
                            <div class="yahei">{{ mapValue(showList.alarmLevel, 'alarmLevel') }}</div> 
                        </div>
                        <div class="ml225 display-ib">
                            <div class="yahei-bold size133 mb58">过温报警</div>
                            <div class="yahei">{{ showList.alarmTime }}</div>
                        </div>
                    </div>
                    <div class="equipment-info flex-d-col yahei">
                        <span v-for="(value, key, index) in equipment" :key="index">
                            {{ mapValue(key, 'deviceInfo')+ '：' +value }}
                        </span>
                    </div>
                </Nav-titles>
                <Nav-titles title="报警处理意见">
                    <div class="yahei opinions">{{opinions}}</div>
                </Nav-titles>
                <Nav-titles title="报警处理" class="deal">
                    <span class="yahei">警情确定：</span>
                    <a-radio-group class="radio-wd" v-model="warnSure" :options="warnOpt" :disabled="!able" />
                    <br />
                    <span class="yahei">处理方式：</span>
                    <a-radio-group class="radio-wd" v-model="dealWith" :options="methodOpt" :disabled="!able" />
                    <br />
                    <span class="yahei">指令下发：</span>
                    <a class="yahei underline" href="javascript:void(0)" @click="sendDrec">下发指令></a>
                    <br />
                    <div class="flex mt">
                        <span class="yahei nowrap">现场图片：</span>
                        <Upload v-if="able" ref="upload" @is-done="uploadDone"></Upload>
                        <div v-else class="show-img" >
                            <img v-for="(item, index) in imgList" :key="index" :src="item" @click="openBigImg(item)" alt="">
                        </div>
                    </div>
                </Nav-titles>
            </section>
            <section class="right">
                <Nav-titles title="报警处理">
                    <Simple-table :columns="columns" :tableData="list"></Simple-table>
                </Nav-titles>
            </section>
        </section>
        <section class="btns pb t-center" v-if="able">
            <a-button type="primary" class="mr125" @click="sure">确定</a-button>
            <a-button class="bg-none" @click="$emit('input', false)">取消</a-button>
        </section>
        <DeviceDetaiCommandl v-model="deviceDetaiCommandl"
            source="alarm" :againDevice="showList.deviceId"
            :defaultValue="deviceDetaiCommandlValue"
            @on-res="deviceRes"
        ></DeviceDetaiCommandl>
        <BigImg v-model="bigImg" :url="imgBig"></BigImg>
    </Dialog>
</template>

<script>
import Dialog from "components/Dialog.vue"
import NavTitles from "components/NavTitles.vue"
import SimpleTable from "components/SimpleTable.vue"
import Upload from "components/Upload.vue"
import DeviceDetaiCommandl from "components/businessComp/DeviceDetaiCommandl.vue"
import BigImg from "components/businessComp/BigImg.vue"
import warnIcon from "@/assets/icons/warn-icon.png"
import dangerIcon from "@/assets/icons/danger-icon.png"

import apis from "apis"

const { getDeviceConfig } = apis;

const nameForKey = {
	temp: "温度",
	electricLeakage: "漏电",
	electricity: "电流",
	voltage: "电压",
	power: "功率",
	electricEnergy: "电量",
}

export default {
    name:"DealWithDialog",
    components: { Dialog, NavTitles, SimpleTable, Upload, DeviceDetaiCommandl, BigImg },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        able: {
            type: Boolean,
            default: false
        },
        opinions: {
            type: String,
            default: ''
        },
        alarmData: {
            type: Object,
            default: () => ({})
        },
        handAlarmList: {
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
			],
            columns: [
				{ title: "名称", key: "name" },
				{ title: "1/A", key: "1a" },
				{ title: "2/B", key: "2b" },
				{ title: "3/C", key: "3c" },
				{ title: "4/N", key: "4n" },
			],
            defaultTableData: [
				{ name: "漏电(mA)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
				{ name: "温度(℃)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
				{ name: "电压(V)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
				{ name: "电流(A)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
				{ name: "功率(W)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
				{ name: "电量(度)", "1a": "0", "2b": "0", "3c": "0", "4n": "0" },
			],
            uploadList: [{id: 1, comp: 'Upload'}],
            resultList: [],
            deviceDetaiCommandl: false,
            bigImg: false,
            imgBig: '',
            deviceDetaiCommandlValue: {}
        }
    },
    computed: {
        isShowHandle: {
            get: function() { return this.dialogVisible },
			set(v){ this.$emit('input', v) }
        },
        showList() {
            console.log('获取报警详情数据', this.alarmData)
            return Object.keys(this.alarmData).length && this.alarmData;
        },
        equipment() {
            const { deviceAlias = '--', deviceSn = '--', groupName = '--', recoverTime = '--', address = '--',  installPosition = '--'} = this.showList;
            return {
                address,
				detail: '65℃',
				reset: recoverTime,
				equips: `${deviceAlias} ${deviceSn}`,
				unit: groupName || '--',
				place: installPosition || '--'
			}
        },
        list() {
            console.log('this.handAlarmList', this.handAlarmList, Object.keys(this.handAlarmList).length)
            if (!Object.keys(this.handAlarmList).length) return []; 
            return this.defaultTableData.map(i => {
				Object.keys(i).forEach((j, idx) => {
					const num = idx - 1
					if (num >= 0) {
						const key = Object.keys(nameForKey)[Object.values(nameForKey).findIndex(k => i.name.includes(k))]
						i[j] = this.handAlarmList[num] && this.handAlarmList[num][key] || '-'
					}
				})
				return i
			})
        },
        imgList() {
            const keys = Object.keys(this.showList)
            const str = keys.length && this.showList && this.showList.processBOList[0] && this.showList.processBOList[0].sitePhotos;
            return str && str.split(',') || [];
        }
    },
    watch: {
        dialogVisible(v) {
            if (v) {
                const { processBOList } = this.showList;
                const { confirmFlag = '', processType = '' } = processBOList[0] || {};
                console.log('---------', confirmFlag, processType)
                this.warnSure = `${confirmFlag}`;
                this.dealWith = `${processType}`;
                // 清空上传记录
                if (this.able) {
                    this.$nextTick(() => {
                        const refs = this.$refs?.upload;
                        refs.fileList = [];
                    })
                }
            }
        }
    },
    methods: {
        mapValue(item, type) {
            const _map = {
                alarmLevel: { 1: '预警', 2: '高危' },
                alarmIcons: {
                    1: warnIcon,
                    2: dangerIcon
                },
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
        uploadDone(list) {
            this.resultList = list.map(img => img.url);
        },
        sure() {
            console.log(this.resultList)
            const { showList: { id }, warnSure, dealWith, resultList } = this;
            const params = { 
                alarmId: id,
                confirmFlag: warnSure,
                processType: dealWith,
                sitePhotos: resultList.join(','),
                remark: ''
            }
            this.$emit('on-sure', params);
        },
        async sendDrec() {
            const res = await getDeviceConfig(this.showList.deviceId);
			this.deviceDetaiCommandlValue = res.data || {};
            this.deviceDetaiCommandl = true;
        },
        deviceRes() {
            this.$emit('input', false);
            this.$emit('refresh-alarm-list')
        },
        openBigImg(url) {
            this.bigImg = true;
            this.imgBig = url;
        }
    }
}
</script>
<style lang='less' scoped>
.dialog-area-content {
	.left {
		.equipment {
            .imgs {
                width: 0.92rem;
                height: 1.67rem;
            }
			&-info {
				span {
					display: block;
				}
			}
		}
	}
    .opinions {
        width: 43rem;
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
        .show-img {
            img{
                width: 6.67rem;
                height: 6.67rem;
                cursor: pointer;
                &:not(:first-child) {
                    margin-left: 8px;
                }
            }
        }
        .mt {
            margin-top: 2.58rem;
        }
	}
}
</style>