<template>
    <Dialog v-model="visibles" :title="title" :coefficient="coefficient" class="dialog-pic">
        <img alt="example" :src="url" />
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
        title: {
            type: String,
            default: ''
        },
        coefficient: {
            type: Number,
            default: 0.8
        },
        url: {
            type: String,
            required: true
        }
    },
}
</script>
<style lang='less' scoped>
.dialog-pic {
    img {
        width: 100%;
        height: 50rem;
        padding-top: 24px;
    }
}
</style>