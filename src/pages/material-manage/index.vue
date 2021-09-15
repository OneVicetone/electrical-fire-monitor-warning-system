<template>
	<ChildLayout :siderList="siderList">
        <RouterView />
    </ChildLayout>
</template>

<script>
import ChildLayout from 'layouts/ChildLayout.vue'
import { commonMinix } from "minixs"

export default {
	name: "MaterialManage",
	mixins: [commonMinix],
    components: {
        ChildLayout
    }
}
</script>