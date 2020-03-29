<template>
  <div>
    <h2>用户中心</h2>
    <ul>
      <!-- 切换子页面 -->
      <li><nuxt-link to="/ucenter">个人信息</nuxt-link></li>
      <li><nuxt-link to="/ucenter/order">我的订单</nuxt-link></li>
      <li><nuxt-link to="/ucenter/collect">我的收藏</nuxt-link></li>
    </ul>
    <!-- 子页面组件的占位符 -->
    <nuxt-child :id="123"/>
  </div>
</template>
<script>
export default {

}
</script>
