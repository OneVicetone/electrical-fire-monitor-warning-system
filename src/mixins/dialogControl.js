export const dialogControl = {
    props: {
        publicVisible: {
            type: Boolean,
            default: false
        }
    },
    model: {
        prop: "publicVisible",
        event: "input"
    },
    computed: {
        visibles: {
            get(){return this.publicVisible},
            set(v){this.$emit('input', v)}
        },
    },
}