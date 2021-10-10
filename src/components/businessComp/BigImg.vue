<template>
    <Dialog v-model="visibles" title="" :coefficient="0.8" class="dialog-pic">
        <img alt="example" style="width: 100%;height: 100%" :src="url" />
    </Dialog>
</template>

<script>
import Dialog from "components/Dialog.vue"
import { dialogControl } from "mixins"

export default {
    name:"BigImg",
    components: { Dialog },
	mixins: [dialogControl],
    props: {
        url: {
            type: String,
            required: true
        }
    },
}
</script>
<style lang='less' scoped>
/deep/ .ant-modal-body {
    header {
        opacity: 0;
    }
}
</style>