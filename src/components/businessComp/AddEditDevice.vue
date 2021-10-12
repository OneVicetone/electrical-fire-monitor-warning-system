<template>
    <Dialog v-model="visibles" :title="eventType">
        <Nav-titles class="unit-base-info" title="设备信息">
            <a-form-model
                ref="unitInfo"
                :model="unitForm"
                :rules="baseInfoRules"
                :labelCol="{ span: 5 }"
                :wrapper-col="{ span: 19 }"
                class="form-right"
            >
                <a-form-model-item ref="deviceNumber" label="设备编号" prop="deviceNumber">
                    <a-input
                        v-model="unitForm.deviceNumber"
                        @blur="() => {$refs.deviceNumber.onFieldBlur()}"
                        @change="limintChange"
                        :maxLength="50"
                        :disabled="sourcesType"
                        placeholder="请输入设备编号"
                    />
                </a-form-model-item>
                <a-form-model-item ref="deviceName" label="设备名称" prop="deviceName">
                    <a-input
                        v-model="unitForm.deviceName"
                        @blur="() => {$refs.deviceName.onFieldBlur()}"
                        :maxLength="50"
                        placeholder="请输入设备名称"
                    />
                </a-form-model-item>
                <a-form-model-item label="设备型号" prop="deviceType">
                    <a-select v-model="unitForm.deviceType" placeholder="请选择设备型号">
                        <a-select-option v-for="item in deviceTypeOption" :key="item.value" :value="item.value">
                            {{item.label}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="关联分组" prop="linkGroup">
                    <a-cascader :options="groupOptions"
                        change-on-select v-model="unitForm.linkGroup"
                        :fieldNames="{ label: 'title', value: 'key', children: 'children' }"
                        placeholder="请选择设备分组"/>
                </a-form-model-item>
                <a-form-model-item class="spc-item"  label="关联SIM卡">
                    <a-form-model class="mb form-right spc-form-item" layout="inline" :model="unitForm" :labelCol="{ span: 9 }">
                        <a-input v-model="unitForm.iccid" @change="iccidChange" :maxLength="50" :style="{width: iptWd}" placeholder="请输入ICCID号" />
                        <a-form-model-item label="安装位置" class="mr0 spc-form-item">
                            <a-input v-model="unitForm.installLocation" :maxLength="50" :style="{width: iptWd}" placeholder="请输入设备安装位置" />
                        </a-form-model-item>
                    </a-form-model>
                </a-form-model-item>
                <a-form-model-item label="定位地址" prop="location">
                    <a-input
                        v-model="unitForm.location"
                        disabled
                        placeholder="请输入设备定位地址">
                        <a-icon slot="suffix" type="bulb" @click="alertMap" />
                    </a-input>
                </a-form-model-item>
            </a-form-model>
        </Nav-titles>
        <Nav-titles class="safe" title="安全负责人">
            <div class="form-content">
                <a-form-model
                    ref="safe"
                    :model="safe"
                    labelAlign="right"
                    :labelCol="{ span: 5 }"
                    :wrapper-col="{ span: 19 }"
                    class="form-right"
                >
                    <a-form-model-item label="安全负责人" prop="safePrincipal">
                        <a-input
                            v-model="safe.safePrincipal"
                            :suffix="computedLen(safe.safePrincipal)"
                            :maxLength="20"
                            placeholder="请输入安全负责人姓名"
                        />
                    </a-form-model-item>
                    <a-form-model-item label="请输入联系电话" prop="linkPhone">
                        <a-input
                            v-model="safe.linkPhone"
                            :suffix="computedLen(safe.linkPhone, 11)"
                            :maxLength="11"
                            @change="safe.linkPhone = safe.linkPhone.replace(/\D/g, '')"
                            placeholder="请输入安全负责人联系电话"
                        />
                    </a-form-model-item>
                </a-form-model>
            </div>
        </Nav-titles>
        <section class="btns pb t-center">
            <a-button type="primary" class="mr125" @click="formSure">确定</a-button>
            <a-button class="bg-none" @click="$emit('input', false)">取消</a-button>
        </section>
        <MapModal v-model="showMap"
            :sources="sourcesType"
            :emitPoint="{ lat: unitForm.lat || 0, lng: unitForm.lng || 0, name: unitForm.location || '' }"
            @save-select-point="showAddress"></MapModal>
    </Dialog>
</template>

<script>
import { message as msg } from "ant-design-vue"
import Dialog from "components/Dialog.vue"
import NavTitles from "components/NavTitles.vue"
import MapModal from "components/MapModal.vue"
import apis from "apis"
import { dialogControl, form, commonMixin } from "mixins"

const { createDevice, getSelectOptions, changeDeviceInfo } = apis

export default {
    name:"AddUnit",
    components: { Dialog, NavTitles, MapModal },
    mixins: [dialogControl, form, commonMixin],
    props: {
        treeData: {
            type: Array,
            default: () => ([])
        },
        formCell:{
            type: Object,
            default: () => ({})
        },
        eventType: String,
        deviceTypeOption: {
            type: Array,
            default: () => ([])
        }
    },
    data() {
        return {
            unitForm: {
                deviceNumber: '',
                deviceName: '',
                deviceType: '',
                linkGroup: [],
                location: '',
                lng: '',
                lat: '',
                iccid: '',
                installLocation: '',
            },
            baseInfoRules: {
                deviceNumber: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
                deviceType: [{ required: true, message: '请选择设备型号', trigger: 'change' }],
                linkGroup: [{ required: true, message: '请选择关联分组', trigger: 'change' }],
            },
            safe: {
                safePrincipal: '',
                linkPhone: ''
            },
            fileList: [],
            showMap: false,
        }
    },
    computed: {
        groupOptions() {
            return this.treeData;
        },
        sourcesType() {
            return this.eventType === '编辑设备'
        },
        iptWd() {
            // 此缩放依照弹窗的大小为依据，可能会存在一小点误差，修改22.2即可
            let len = this.getBasePx() * 83.12 / 22.2;
            if (len >= 22.2) len = 22.2
            return `${len}rem`;
        }
    },
    watch: {
        visibles(v) {
            if (v) {
                console.log(this.formCell)
                const { treeShow, groupOptions } = this;
                const {
                    sn = '',
                    deviceTypeId = '',
                    installPosition = '',
                    address = '',
                    // addressLat = '',
                    // addressLon = '',
                    alias = '',
                    iccid = '',
                    groupId = '',
                    safetyDirector = '',
                    safetyDirectorMobile = '',
                } = this.formCell || {};
                console.log(treeShow(groupOptions, groupId))
                this.unitForm = {
                    deviceNumber: sn,
                    deviceType: deviceTypeId,
                    installLocation: installPosition,
                    location: address,
                    // addressLat: 23.333,
                    // addressLon: 108.3333,
                    deviceName: alias,
                    iccid,
                    linkGroup: treeShow(groupOptions, groupId),
                    safePrincipal: safetyDirector,
                    linkPhone: safetyDirectorMobile,
                }
                this.safe = {
                    safePrincipal: safetyDirector,
                    linkPhone: safetyDirectorMobile
                }
            } else {
                this.$refs.unitInfo.resetFields()
                this.$refs.safe.resetFields()
            }
        }
    },
    methods: {
        limintChange() {
            // 字母加数字
            this.unitForm.deviceNumber = this.unitForm.deviceNumber.replace(/[\W]/g,'')
        },
        iccidChange() {
            this.unitForm.iccid = this.unitForm.iccid.replace(/[^a-z0-9_]/g,'')
        },
        computedLen(value, totalLen = 20) {
            if (value === null || value === undefined || typeof value === 'number') value = '';
            return `${value.length}/${totalLen}`
        },
        treeShow(list, id) {
            for(let i =0; i<list.length; i++){
                const item = list[i];
                if(item.key === id) return [id];
                if(!(item.children && item.children.length)) continue;
                const res = this.treeShow(item.children, id);
                if(res)return [item.key, ...res];
            }
        },
        // treeChange(value) {
        //     console.log(value)
        //     const [ firstNode ] = value;
        //     this.unitForm.linkGroup = firstNode;
        // },
        alertMap() {
            this.showMap = true;
        },
        showAddress({ point: { lng, lat }, address }) {
            this.unitForm.location = address;
            this.unitForm.lng = lng;
            this.unitForm.lat = lat;
            this.showMap = false;
        },
        formSure() {
            const validates = [this.$refs.unitInfo, this.$refs.safe];
            const cb = async () => {
                const {
                    unitForm: {
                        deviceNumber = '',
                        deviceType = '',
                        deviceName = '',
                        linkGroup,
                        location = '',
                        lng = '',
                        lat = '',
                        iccid = '',
                        installLocation = '',
                    },
                    safe: {
                        safePrincipal,
                        linkPhone
                    }
                } = this;
                // 参数
                console.log(linkGroup)
                const params = {
                    sn: deviceNumber,
                    deviceTypeId: +deviceType,
                    installPosition: installLocation,
                    address: location,
                    addressLat: lat,
                    addressLon: lng,
                    alias: deviceName,
                    iccid,
                    groupId: linkGroup[linkGroup.length-1],
                    safetyDirector: safePrincipal,
                    safetyDirectorMobile: linkPhone,
                };
                const modify = {
                    id: Object.keys(this.formCell).length && this.formCell.id,
                    deviceTypeId: +deviceType,
                    groupId: linkGroup[linkGroup.length-1],
                    installPosition: installLocation,
                    address: location,
                    addressLat: lat,
                    addressLon: lng,
                    alias: deviceName,
                    iccid,
                    safetyDirector: safePrincipal,
                    safetyDirectorMobile: linkPhone,
                }
                const res = this.sourcesType ? await changeDeviceInfo(modify) : await createDevice(params);
                console.log(res)
                this.$emit('input', false);
                msg.success(`${this.sourcesType ? "修改" : "新增"}成功`)
                this.$emit('on-fresh-data');
            }
            this.recursionRef(validates, cb);
        },
    }
}
</script>
<style lang='less' scoped>
.unit-base-info {
    /deep/ .little-nav__title {
        padding-left: calc(11.75rem - 35px);
    }
    padding-right: calc(11.58rem - 35px);
    .form-right {
        /deep/ .ant-form-item-label {
            label {
                font-size: 1.17rem;
                font-family: Microsoft YaHei;
                font-weight: 400;
            }
        }
        .spc-item {
            display: flex;
            justify-content: center;
            margin-bottom: 0;
            .ant-col {
                display: flex;
                .spc-form-item {
                    display: flex;
                }
            }
        }
    }
}
.safe {
    /deep/ .little-nav__title {
        padding-left: calc(11.75rem - 35px);
    }
    .form-content {
        // padding-left: calc(5.67rem - 35px);
        padding-right: calc(11.58rem - 35px);
        .form-right {
            /deep/ .ant-form-item-label {
                label {
                    font-size: 1.17rem;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                }
            }
        }
    }
}
.unit-pic {
    /deep/ .little-nav__title {
        padding-left: calc(11.75rem - 35px);
    }
    .uploads {
        padding-left: calc(11.75rem + 37px );
        .content-wd {
            /deep/ .ant-upload  {
                width: 13.42rem;
                height: 13.42rem;
                margin-bottom: 1.08rem;
                margin-right: 0;
                svg {
                    width: 3.33rem;
                    height: 3.33rem;
                }
            }
        }
        .design-diagram {
            margin-left: 4.08rem
        }
    }
}
.mb {
    margin-bottom: 24px;
}
/deep/ .ant-input-affix-wrapper .ant-input-disabled ~ .ant-input-suffix .anticon {
	color: #dcdcdc !important;
	cursor: pointer !important;
}
</style>