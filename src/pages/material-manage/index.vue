<template>
	<ChildLayout :siderList="siderList">
        <RouterView />
    </ChildLayout>
</template>

<script>
import ChildLayout from 'layouts/ChildLayout.vue'

export default {
	name: "MaterialManage",
    components: {
        ChildLayout
    },
    data() {
        return {}
    },
    computed: {
        siderList() {
            const { routes } = this.$store.state.account
            return routes.find(route => this.$route.path.includes(route.path)).children
        }
    }
}
</script>

<style lang="less" scoped>
    
</style>