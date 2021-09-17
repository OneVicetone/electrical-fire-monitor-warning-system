<template>
    <div class="little-nav">
        <div class="little-nav__title">{{title}}</div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name:"navTitle",
    props: {
        title: {
            type: [String, Number],
            default: 'xxx详情'
        }
    },
}
</script>
<style lang='less' scoped>
.little-nav {
    &__title {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #8FD6FF;
        &::before {
            content: '';
            display: inline-block;
            width: 0.33rem;
            height: 1.33rem;
            background: #0188E8;
            border-radius: 1px;
            margin-right: .75rem;
        }
    }
}

</style>