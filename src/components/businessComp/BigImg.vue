<template>
    <Dialog v-model="visibles" title="" class="dialog-pic">
        <img alt="example" style="width: 80rem;height: 60rem" :src="url" />
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