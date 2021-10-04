<template>
    <Dialog v-model="visibles" title="电气火灾系统设计图纸" class="dialog-pic">
        <img alt="example" style="width: 102rem;height: 72rem" :src="url" />
    </Dialog>
</template>

<script>
import Dialog from "components/Dialog.vue"
import { dialogControl } from "mixins"

export default {
    name:"SeePic",
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

</style>