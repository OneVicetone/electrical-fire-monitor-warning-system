<template>
    <Dialog v-model="visibles" title="新增单位">
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
                    <a-select v-model="unitForm.upUnit" placeholder="请选择上级单位">
                        <a-select-option value="shanghai">
                        Zone one
                        </a-select-option>
                        <a-select-option value="beijing">
                        Zone two
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="单位类型" prop="unitType">
                    <a-select v-model="unitForm.unitType" placeholder="请选择单位类型">
                        <a-select-option value="shanghai">
                        Zone one
                        </a-select-option>
                        <a-select-option value="beijing">
                        Zone two
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="单位地址" prop="unitAddress">
                    <a-input
                        v-model="unitForm.unitAddress"
                        class="ipt-disabled__color"
                        placeholder="请选择单位地址">
                        <a-icon slot="suffix" type="bulb" @click="alertMap" />
                    </a-input>
                </a-form-model-item>
            </a-form-model>
            <a-form-model class="form-right" layout="inline" :model="unitForm" :labelCol="{ style: 'width: 72px;float: left;' }"
                :wrapper-col="{ span: 16 }">
                <a-form-model-item label="单位人数" class="mr0">
                    <a-input v-model="unitForm.unitCount" placeholder="请输入单位大概人数" />
                </a-form-model-item>
                <a-form-model-item label="占地面积" class="mr0">
                    <a-input v-model="unitForm.area" placeholder="请输入单位占地面积（㎡）" />
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
                    :wrapper-col="{ span: 18 }"
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
                            :suffix="computedLen(safe.linkPhone)"
                            :maxLength="20"
                            placeholder="请输入安全负责人联系电话"
                        />
                    </a-form-model-item>
                </a-form-model>
            </div>
        </Nav-titles>
        <Nav-titles class="unit-pic" title="单位图片">
            <div class="uploads flex">
                <div class="content-wd effect-picture">
                    <!-- :before-upload="beforeUpload"
                        @change="handleChange" -->
                    <a-upload
                        name="avatar"
                        list-type="picture-card"
                        class="avatar-uploader"
                        :show-upload-list="false"
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    >
                        <!-- <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                        <div v-else>
                            <a-icon :type="loading ? 'loading' : 'plus'" />
                        </div> -->
                    </a-upload>
                    <div class="yahei-81899C t-center">公司处景观/效果图</div>
                </div>
                <div class="content-wd design-diagram">
                    <a-upload
                        name="avatar"
                        list-type="picture-card"
                        class="avatar-uploader"
                        :show-upload-list="false"
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    >
                        <!-- <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                        <div v-else>
                            <a-icon :type="loading ? 'loading' : 'plus'" />
                        </div> -->
                    </a-upload>
                    <div class="yahei-81899C ml-58">电气火灾系统设计图纸(800*560)</div>
                </div>
            </div>
        </Nav-titles>
        <section class="btns pb t-center">
            <a-button type="primary" class="mr125" @click="formSure">确定</a-button>
            <a-button class="bg-none" @click="$emit('input', false)">取消</a-button>
        </section>
        <MapModal v-model="showMap"></MapModal>
    </Dialog>
</template>

<script>
import Dialog from "components/Dialog.vue"
import NavTitles from "components/NavTitles.vue"
import Upload from "components/Upload.vue"
import MapModal from "components/MapModal.vue"
import apis from "apis"
import { dialogControl, form } from "mixins"

const { createUnit } = apis
export default {
    name:"AddUnit",
    components: { Dialog, NavTitles, Upload, MapModal },
    mixins: [dialogControl, form],
    data() {
        return {
            unitForm: {
                unitName: '',
                upUnit: '',
                unitType: '',
                unitAddress: '222',
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
            showMap: false
        }
    },
    mounted() {

    },
    methods: {
        computedLen(value, totalLen = 20) {
            if (value === null || value === undefined || typeof value === 'number') value = '';
            return `${value.length}/${totalLen}`
        },
        alertMap() {
            this.showMap = true;
        },
        formSure() {
            const validates = [this.$refs.unitInfo, this.$refs.safe];
            const cb = async () => {
                const {
                    unitForm: {
                        unitName,
                        upUnit,
                        unitType,
                        unitAddress,
                        unitCount,
                        area,
                    },
                    safe: {
                        safePrincipal,
                        principalAccount,
                        linkPhone
                    }
                } = this;
                // 参数
                const params = {
                    name: unitName,
                    parentId: upUnit,
                    typeCode: unitType,
                    address: unitAddress,
                    addressLat: 22.223323,
                    addressLng: 118.332222,
                    employeeNum: unitCount,
                    floorSpace: area,
                    principalUserName: safePrincipal,
                    loginName: principalAccount,
                    mobile: linkPhone,
                    effectPicPath: "未定",
                    designPicPath: "未定"
                    };
                const res = await createUnit(params);
                console.log('表单填写', res)
            }
            this.recursionRef(validates, cb);
        },
        onUpload(e) {
            this.fileList = e;
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
                color: #FB5E4F;
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
                    color: #FB5E4F;
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
</style>