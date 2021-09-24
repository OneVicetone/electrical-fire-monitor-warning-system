<template>
    <div class="little-nav">
        <div class="little-nav__title flex-yCenter">
            {{title}}
            <slot name="header"></slot>
        </div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name:"NavTitle",
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
        font-size: 1.33rem;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #8FD6FF;
        margin-bottom: 1.33rem;
        margin-top: 2.92rem;
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