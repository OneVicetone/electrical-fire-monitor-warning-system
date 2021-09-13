<template>
  <div class="layout-container">
      <Banner />
      <router-view></router-view>
  </div>
</template>

<script>
import Banner from './Banner.vue'

export default {
    name: "Layout",
    components: {
        Banner
    }
}
</script>

<style lang="less" scoped>

</style>