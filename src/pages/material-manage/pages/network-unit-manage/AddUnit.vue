<template>
    <Dialog v-model="addVisible" title="新增单位">
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
                        :suffix="inputLen"
                        :maxLength="20"
                        placeholder="请选择单位名称"
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
                        disabled
                        placeholder="请选择单位地址"
                    />
                </a-form-model-item>
            </a-form-model>
            <a-form-model class="form-right" layout="inline" :model="unitForm" :labelCol="{ style: 'width: 72px;float: left;' }"
                :wrapper-col="{ style: 'width: 21rem' }">
                <a-form-model-item label="单位人数" class="mr0">
                    <a-input v-model="unitForm.unitName" placeholder="请输入单位大概人数" />
                </a-form-model-item>
                <a-form-model-item label="占地面积" class="mr0">
                    <a-input v-model="unitForm.unitName" placeholder="请输入单位占地面积（㎡）" />
                </a-form-model-item>
            </a-form-model>
        </Nav-titles>
        <Nav-titles class="qa" title="安全负责人">
            <div class="form-content">
                <a-form-model
                    ref="unitInfo"
                    :model="unitForm"
                    :rules="baseInfoRules"
                    labelAlign="right"
                    :labelCol="{ style: 'width: 132px;float: left;' }"
                    :wrapper-col="{ span: 18 }"
                    class="form-right"
                >
                    <a-form-model-item ref="unitName" label="安全负责人" prop="unitName">
                        <a-input
                            v-model="unitForm.unitName"
                            @blur="() => {$refs.unitName.onFieldBlur()}"
                            :suffix="inputLen"
                            :maxLength="20"
                            placeholder="请选择单位名称"
                        />
                    </a-form-model-item>
                    <a-form-model-item ref="unitName" label="安全负责人登录账户" prop="unitName">
                        <a-input
                            v-model="unitForm.unitName"
                            @blur="() => {$refs.unitName.onFieldBlur()}"
                            :suffix="inputLen"
                            :maxLength="20"
                            placeholder="请选择单位名称"
                        />
                    </a-form-model-item>
                    <a-form-model-item ref="unitName" label="请输入联系电话" prop="unitName">
                        <a-input
                            v-model="unitForm.unitName"
                            @blur="() => {$refs.unitName.onFieldBlur()}"
                            :suffix="inputLen"
                            :maxLength="20"
                            placeholder="请选择单位名称"
                        />
                    </a-form-model-item>
                </a-form-model>
            </div>
        </Nav-titles>
    </Dialog>
</template>

<script>
import Dialog from "components/Dialog.vue"
import NavTitles from "components/NavTitles.vue"

export default {
    name:"",
    components: {
        Dialog, NavTitles
    },
    props: {
        unitVisible: {
            type: Boolean,
            default: false
        }
    },
    model: {
        prop: "unitVisible",
        event: "input"
    },
    data() {
        return {
            unitForm: {
                unitName: '',
                upUnit: '',
                unitType: '',
                unitAddress: '',
            },
            baseInfoRules: {
                unitName: [
                    { required: true, message: 'Please input Activity name', trigger: 'blur' },
                    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
                ],
                upUnit: [
                    {
                        type: 'array',
                        required: true,
                        message: 'Please select at least one activity type',
                        trigger: 'change',
                    },
                ],
                unitType: [
                     { required: true, message: 'Please select activity resource', trigger: 'change' },
                ],
                unitAddress: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
            }
        }
    },
    computed: {
        addVisible: {
            get(){return this.unitVisible},
            set(v){this.$emit('input', v)}
        },
        inputLen() {
            const lens = this.unitForm.unitName.length;
            return `${lens}/20`
        }
    },
    created() {

    },
    mounted() {

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
.qa {
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
</style>