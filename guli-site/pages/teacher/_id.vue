<template>
  <div>
    讲师介绍：
    {{ item.id }}<br>
    {{ item.name }}<br>
    {{ item.intro }}<br>
  </div>
</template>

<script>
import teacherApi from '~/api/teacher'

export default {
  // 定义异步获取的数据模型
  async asyncData({ params }) {
    const response = await teacherApi.getById(params.id)
    return {
      item: response.data.data.item
    }
  },
  created() {
    this.id = this.$route.params.id
    console.log(this.id)
  }
}
</script>
