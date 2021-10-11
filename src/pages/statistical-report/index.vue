<template>
	<ChildLayout :siderList="siderList">
		<RouterView />
	</ChildLayout>
</template>

<script>
import ChildLayout from "layouts/ChildLayout.vue"
import { commonMixin } from "mixins"

export default {
	name: "StatisticalReport",
	mixins: [commonMixin],
	components: {
		ChildLayout,
	},
}
</script>