<template>
    <Dialog v-model="addVisible" title="发送指令">
        <Tabs></Tabs>
        <div class="comp-content flex-between">
            <div class="comp-content__form">
                <a-form-model :model="form" :label-col="{ span: 4 }" :wrapper-col="{ style: 'width: 19.08rem' }">
                    <a-form-model-item label="漏电阈值：">
                        <div class="nowrap">
                            <a-input v-model="form.leakageThreshold" />
                            <span>ssssssssssss</span>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="温度阈值：">
                        <div class="nowrap">
                            <a-input v-model="form.leakageThreshold" />
                            <span>ssssssssssss</span>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="额定电压：">
                        <div class="nowrap">
                            <a-input v-model="form.leakageThreshold" />
                            <span>ssssssssssss</span>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="额定电流：">
                        <div class="nowrap">
                            <a-input v-model="form.leakageThreshold" />
                            <span>ssssssssssss</span>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="三相电流变比:">
                        <div class="nowrap">
                            <a-input v-model="form.leakageThreshold" />
                            <span>ssssssssssss</span>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="上传频率：">
                        <div class="nowrap">
                            <a-input v-model="form.leakageThreshold" />
                            <span>ssssssssssss</span>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="心跳频率：">
                        <div class="nowrap">
                            <a-input v-model="form.leakageThreshold" />
                            <span>ssssssssssss</span>
                        </div>
                    </a-form-model-item>
                </a-form-model>
            </div>
            <CommandRecord></CommandRecord>
        </div>
    </Dialog>
</template>

<script>
import Dialog from "components/Dialog.vue"
import Tabs from "components/Tabs.vue"
import CommandRecord from "components/CommandRecord.vue"
export default {
    name:"",
    components: {
        Dialog, Tabs, CommandRecord
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
            form: {
                leakageThreshold: ''
            }
        }
    },
    computed: {
        addVisible: {
            get(){return this.unitVisible},
            set(v){this.$emit('input', v)}
        },
    },
    created() {

    },
    mounted() {

    }
}
</script>
<style lang='less' scoped>
.comp-content {
    &__form {
        width: 100%;
    }
}
</style>