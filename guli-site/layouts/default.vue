<template>
  <div class="in-wrap">
    <!-- 公共头 -->
    <app-header/>
    <!-- /公共头 -->

    <!-- 内容区域 -->
    <nuxt/>
    <!-- /内容区域 -->

    <!-- 公共底 -->
    <app-footer />
    <!-- /公共底 -->
  </div>
</template>

<script>
import AppHeader from '~/components/AppHeader.vue'
import AppFooter from '~/components/AppFooter.vue'
import '~/assets/css/reset.css'
import '~/assets/css/theme.css'
import '~/assets/css/global.css'
import '~/assets/css/web.css'

export default {
  components: {
    AppHeader, AppFooter
  }
}
</script>
