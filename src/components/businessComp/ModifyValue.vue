<template>
    <a-modal
        v-model="visibles" wrapClassName="map-modal"
        :closable="true" :destroyOnClose="true" :keyboard="false"
        :maskClosable="false" :footer="null" :width="widths">
        <header>
			<div>参数设置</div>
		</header>
        <div class="show-value">参数名称：</div>
        <div class="show-value">原参数值：</div>
        <div class="show-value">
            新参数值：
            <a-input v-model="ipt[name]" class="ipt"></a-input>
            <!-- {{aa}} -->
        </div>
        <section class="btns paddings">
            <a-button type="primary" class="mr125" @click="clickSure">确定</a-button>
            <a-button class="bg-none" @click="$emit('input', false)">取消</a-button>
        </section>
    </a-modal>
</template>

<script>
import { getBasePx } from "utils/initial"
import { dialogControl } from "mixins"

export default {
    name:"ModifyValue",
    mixins: [dialogControl],
    props: {
        // 放大系数
        coefficient: {
            type: Number,
            default: 0.85
        },
        emitValue: {
            type: Object,
            default: () => ({})
        },
        deviceId: [Number, String]
    },
    data() {
        return {
        }
    },
    computed: {
        widths() {
			return getBasePx() * 83.12 * this.coefficient;
		},
    },
    watch: {
        visibles(v) {
            if (v) {
            }
        }
    },
    methods: {
        clickSure() {

            const params = {
                deviceId: this.deviceId,
                cmdType: 1, // 固定
                content: {
                    iz: '',
                    temp: '',
                    izTm: '',
                    tempTm: '',
                    rv: '',
                    rc: '',
                    ov: '',
                    ovt: '',
                    uv: '',
                    uvt: '',
                    oi: '',
                    oit: '',
                    op: '',
                    opt: '',
                    os: '',
                    ost: '',
                } 
            }
        }
    }
}
</script>
<style lang='less' scoped>
/deep/ .map-modal {
    .ant-modal-body {
        background: #090D18;
    }
    .show-value {
        margin: 3rem 0;
    }
    .ipt {
        width: 20rem;
    }
    // .ant-modal-header {
    //     display: none;
    // }
    // .ant-modal-body {
    //     padding: 0;
    // }
    // .map {
    //     position: relative;
    //     .inputs {
    //         position: absolute;
    //         z-index: 9999999;
    //         margin-top: 1.58rem;
    //         margin-left: 1rem;
    //     }
    //     .btn {
    //         width: 6.67rem;
    //         height: 2.67rem;
    //         line-height: 2.67rem;
    //         font-size: 1.17rem;
    //         font-family: Microsoft YaHei;
    //         font-weight: 400;
    //         color: #fff;
    //         text-align: center;
    //         margin-left: .58rem;
    //         cursor: pointer;
    //         user-select: none;
    //         &.sure {
    //             background: #0188E8;
    //         }
    //         &.cancel {
    //             background: #81899C;
    //         }
    //     }
    //     .icons {
    //         width: 2.5rem;
    //         height: 2.5rem;
    //         position: relative;
    //         left: 100%;
    //         transform: translateX(9rem);
    //     }
    // }
}
</style>