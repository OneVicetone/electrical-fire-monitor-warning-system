<template>
    <Dialog v-model="visibles" :title="headerName" :coefficient="1.2">
        <Nav-titles class="unit-base-info" title="单位基本信息">
            <a-form-model
                ref="unitInfo"
                :model="unitForm"
                :rules="baseInfoRules"
                :labelCol="{ style: 'width: 72px;float: left;' }"
                :wrapper-col="{ span: 20 }"
                class="form-right"
            >
                <a-form-model-item ref="unitName" label="单位名称" prop="unitName">
                    <a-input
                        v-model="unitForm.unitName"
                        @blur="() => {$refs.unitName.onFieldBlur()}"
                        :suffix="computedLen(unitForm.unitName)"
                        :maxLength="20"
                        placeholder="请输入单位名称"
                    />
                </a-form-model-item>
                <a-form-model-item label="上级单位" prop="upUnit">
                    <a-cascader :options="groupOptions"
                        :disabled="sources"
                        change-on-select v-model="unitForm.upUnit"
                        :fieldNames="{ label: 'title', value: 'key', children: 'children' }"
                        placeholder="请选择上级单位"/>
                </a-form-model-item>
                <a-form-model-item label="单位类型" prop="unitType">
                    <a-select v-model="unitForm.unitType" placeholder="请选择单位类型">
                        <a-select-option v-for="item in unitTypeOption" :key="item.value" :value="item.value">
                            {{item.name}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="单位地址" prop="unitAddress">
                    <a-input
                        v-model="unitForm.unitAddress"
                        class="ipt-disabled__color"
                        placeholder="请选择单位地址"
                        disabled>
                        <a-icon slot="suffix" type="bulb" @click="alertMap" />
                    </a-input>
                </a-form-model-item>
            </a-form-model>
            <a-form-model class="form-right" layout="inline" :model="unitForm" :labelCol="{ style: 'width: 72px;float: left;' }"
                :wrapper-col="{ style: 'width: 29rem;' }">
                <a-form-model-item label="单位人数" class="mr0">
                    <a-input v-model="unitForm.unitCount" @change="unitForm.unitCount = unitForm.unitCount.replace(/\D/g, '')"
                    placeholder="请输入单位大概人数" :maxLength="10"/>
                </a-form-model-item>
                <a-form-model-item label="占地面积" class="mr0">
                    <a-input v-model="unitForm.area" @change="unitForm.area = unitForm.area.replace(/\D/g, '')"
                    placeholder="请输入单位占地面积（㎡）"  :maxLength="10"/>
                </a-form-model-item>
            </a-form-model>
        </Nav-titles>
        <Nav-titles class="safe" title="安全负责人">
            <div class="form-content">
                <a-form-model
                    ref="safe"
                    :model="safe"
                    :rules="safeRules"
                    labelAlign="right"
                    :labelCol="{ style: 'width: 132px;float: left;' }"
                    :wrapper-col="{ style: 'width: 65.5rem;float: left;' }"
                    class="form-right"
                >
                    <a-form-model-item ref="safePrincipal" label="安全负责人" prop="safePrincipal">
                        <a-input
                            v-model="safe.safePrincipal"
                            @blur="() => {$refs.safePrincipal.onFieldBlur()}"
                            :suffix="computedLen(safe.safePrincipal)"
                            :maxLength="20"
                            placeholder="请输入安全负责人姓名"
                        />
                    </a-form-model-item>
                    <a-form-model-item ref="principalAccount" label="安全负责人登录账户" prop="principalAccount">
                        <a-input
                            v-model="safe.principalAccount"
                            :disabled="sources"
                            @blur="() => {$refs.principalAccount.onFieldBlur()}"
                            :suffix="computedLen(safe.principalAccount)"
                            :maxLength="20"
                            placeholder="请输入安全负责人登录账户名"
                        />
                    </a-form-model-item>
                    <a-form-model-item ref="linkPhone" label="请输入联系电话" prop="linkPhone">
                        <a-input
                            v-model="safe.linkPhone"
                            @blur="() => {$refs.linkPhone.onFieldBlur()}"
                            :suffix="computedLen(safe.linkPhone, 11)"
                            @change="safe.linkPhone = safe.linkPhone.replace(/\D/g, '')"
                            :maxLength="11"
                            placeholder="请输入安全负责人联系电话"
                        />
                    </a-form-model-item>
                </a-form-model>
            </div>
        </Nav-titles>
        <Nav-titles class="unit-pic" title="单位图片">
            <div class="uploads flex">
                <div class="content-wd effect-picture">
                    <a-upload
                        name="avatar"
                        list-type="picture-card"
                        class="avatar-uploader"
                        :show-upload-list="false"
                        :customRequest="(arg) => handleUploadFile(arg, 'effect')"
                    >
                        <img v-if="upload.effectPic" :src="upload.effectPic" />
						<div v-else>
							<a-icon :type="effectLoading ? 'loading' : 'plus'" />
							<div class="ant-upload-text">上传图片</div>
						</div>
                    </a-upload>
                    <div class="yahei-81899C t-center">公司处景观/效果图</div>
                </div>
                <div class="content-wd design-diagram">
                    <a-upload
                        name="avatar"
                        list-type="picture-card"
                        class="avatar-uploader"
                        :show-upload-list="false"
                        :customRequest="(arg) => handleUploadFile(arg, 'design')"
                    >
                        <img v-if="upload.designPic" :src="upload.designPic" />
						<div v-else>
							<a-icon :type="designLoading ? 'loading' : 'plus'" />
							<div class="ant-upload-text">上传图片</div>
						</div>
                    </a-upload>
                    <div class="yahei-81899C ml-58">电气火灾系统设计图纸(800*560)</div>
                </div>
            </div>
        </Nav-titles>
        <section class="btns pb t-center">
            <a-button type="primary" class="mr125" @click="formSure">确定</a-button>
            <a-button class="bg-none" @click="$emit('input', false)">取消</a-button>
        </section>
        <MapModal v-model="showMap"
            :sources="sources"
            :emitPoint="{ lat: unitForm.lat, lng: unitForm.lngs, name: unitForm.unitAddress }"
            @save-select-point="showAddress">
        </MapModal>
    </Dialog>
</template>

<script>
import { message as msg } from "ant-design-vue"
import Dialog from "components/Dialog.vue"
import NavTitles from "components/NavTitles.vue"
import Upload from "components/Upload.vue"
import MapModal from "components/MapModal.vue"
import apis from "apis"
import { dialogControl, form, uploadFileMixin } from "mixins"

const { createUnit, getSelectOptions, updateUnit } = apis
export default {
    name:"AddUnit",
    components: { Dialog, NavTitles, Upload, MapModal },
    mixins: [dialogControl, form, uploadFileMixin],
    props: {
        headerName: String,
        editForm: {
            type: Object,
            default: () => ({})
        },
        groupOptions: {
            type: Array,
            default: () => ([])
        }
    },
    data() {
        return {
            unitTypeOption: [],
            unitForm: {
                unitName: '',
                upUnit: '',
                unitType: '',
                unitAddress: '',
                lngs: "",
                lat: "",
                unitCount: '',
                area: '',
            },
            baseInfoRules: {
                unitName: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
                upUnit: [{ required: true, message: '请选择上级单位', trigger: 'change' }],
                unitType: [{ required: true, message: '请选择单位类型', trigger: 'change' }],
                unitAddress: [{ required: true, message: '请选择单位地址', trigger: 'blur' }],
            },
            safe: {
                safePrincipal: '',
                principalAccount: '',
                linkPhone: ''
            },
            safeRules: {
                safePrincipal: [{ required: true, message: '请输入安全负责人姓名', trigger: 'blur' }],
                principalAccount: [{ required: true, message: '请输入安全负责人登录账户名', trigger: 'blur' }],
                linkPhone: [{ required: true, message: '请输入安全负责人联系电话', trigger: 'blur' }],
            },
            fileList: [],
            showMap: false,
            upload: {
                effectPic: '',
                designPic: ''
            },
            effectLoading: false,
            designLoading: false
        }
    },
    computed: {
        sources() {
            return this.headerName === '编辑单位';
        }
    },
    watch: {
        visibles(v) {
            console.log(v)
            if (v) {
                this.getOptions();
                // const userInfo = JSON.parse(localStorage.getItem('vuex'))
                const {
                    name = '',
                    parentId = '',
                    typeCode = '',
                    address = '',
                    addressLat = '',
                    addressLon = '',
                    employeeNum = '',
                    floorSpace = '',
                    principalUserName = '',
                    principalLoginName = '',
                    mobile = '',
                    effectPicPath = '',
                    designPicPath = ''
                } = this.editForm || {};
                console.log('---', this.unitForm, this.upload )
                console.log('级联', this.groupOptions, parentId, this.treeShow(this.groupOptions, parentId))
                this.unitForm = {
                    unitName: name,
                    upUnit: this.treeShow(this.groupOptions, parentId),
                    unitType: typeCode,
                    unitAddress: address,
                    lngs: addressLon || 24.600386,
                    lat: addressLat || 113.840743,
                    unitCount: employeeNum,
                    area: floorSpace,
                }
                this.safe = {
                    safePrincipal: principalUserName,
                    principalAccount: principalLoginName,
                    linkPhone: mobile
                }
                this.upload = {
                    effectPic: effectPicPath,
                    designPic: designPicPath
                }
            } else {
                this.$refs.unitInfo.resetFields()
                this.$refs.safe.resetFields()

            }
        }
    },
    mounted() {
        this.getUploadUrl()
    },
    methods: {
        treeShow(list, id) {
            for(let i =0; i<list.length; i++){
                const item = list[i];
                if(item.key === id) return [id];
                if(!(item.children && item.children.length)) continue;
                const res = this.treeShow(item.children, id);
                if(res)return [item.key, ...res];
            }
        },
        getOptions() {
            getSelectOptions('groupType').then(option => {
                const data = option.data;
                this.unitTypeOption = data.map(item => ({
                    value: item.code,
                    name: item.name
                }))
            })
        },
        computedLen(value, totalLen = 20) {
            if (value === null || value === undefined || typeof value === 'number') value = '';
            return `${value.length}/${totalLen}`
        },
        handleUploadFile(arg, type) {
            console.log('上传文件', arg,type)
			arg.file instanceof File &&
				this.toUploadFile(arg.file).then(imgUrl => {
                    this[`${type}Loading`]  = false;
                    console.log(imgUrl)
                    this.upload[`${type}Pic`] = imgUrl;
				})
        },
        alertMap() {
            this.showMap = true;
        },
        showAddress({ point: { lng, lat }, address }) {
            this.unitForm.unitAddress = address;
            this.unitForm.lngs = lng;
            this.unitForm.lat = lat;
            this.showMap = false;
        },
        formSure() {
            const validates = [this.$refs.unitInfo, this.$refs.safe];
            const cb = async () => {
                const {
                    editForm: { id },
                    unitForm: {
                        unitName,
                        upUnit,
                        unitType,
                        unitAddress,
                        lngs,
                        lat,
                        unitCount,
                        area,
                    },
                    safe: {
                        safePrincipal,
                        principalAccount,
                        linkPhone
                    },
                    upload: {
                        effectPic,
                        designPic
                    }
                } = this;
                console.log(lat, lngs)
                // 参数
                const params = {
                    name: unitName,
                    parentId: upUnit[upUnit.length - 1],
                    typeCode: unitType,
                    address: unitAddress,
                    addressLat: lat,
                    addressLon: lngs,
                    employeeNum: unitCount,
                    floorSpace: area,
                    principalUserName: safePrincipal,
                    mobile: linkPhone,
                    effectPicPath: effectPic,
                    designPicPath: designPic
                };
                Object.assign(params, this.sources ? { id } : {loginName: principalAccount});
                // const res = await createUnit(params);
                const res = this.sources ? await updateUnit(params) : await createUnit(params);
                console.log('表单填写', res)
                this.$emit('input', false);
                msg.success(`${this.sources ? "修改" : "新增"}成功`)
                this.$emit('refresh-table');
            }
            this.recursionRef(validates, cb);
        },
    }
}
</script>
<style lang='less' scoped>
.unit-base-info {
    padding-left: calc(11.75rem - 35px);
    padding-right: calc(11.58rem - 35px);
    .form-right {
        /deep/ .ant-form-item-label {
            label {
                font-size: 1.17rem;
                font-family: Microsoft YaHei;
                font-weight: 400;
                // color: #FB5E4F;
            }
        }
    }
}
.safe {
    /deep/ .little-nav__title {
        padding-left: calc(11.75rem - 35px);
    }
    .form-content {
        padding-left: calc(5.67rem - 35px);
        padding-right: calc(11.58rem - 35px);
        .form-right {
            /deep/ .ant-form-item-label {
                label {
                    font-size: 1.17rem;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    // color: #FB5E4F;
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
                padding: 0;
                svg {
                    width: 3.33rem;
                    height: 3.33rem;
                }
            }
        }
        .design-diagram {
            margin-left: 4.08rem
        }
        img {
            width: 13.42rem;
            height: 13.42rem;
        }
    }
}
</style>