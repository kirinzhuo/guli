<template>
  <div class="app-container">
    <el-input
      v-model="filterText"
      placeholder="输入关键字进行过滤"/>

    <el-tree
      ref="tree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all/>

  </div>
</template>

<script>
import subject from '@/api/edu/subject'

export default {

  data() {
    return {
      filterText: '', // 过滤条件
      subjectList: [], // 嵌套课程分类列表
      defaultProps: { // 数据中的属性key定义
        children: 'children',
        label: 'title'
      }
    }
  },

  //
  watch: {
    filterText(val) {
    //   console.log(val)
      this.$refs.tree.filter(val)
    }
  },

  created() {
    this.fetchNodeList()
  },

  methods: {

    // 获取嵌套课程分类数据
    fetchNodeList() {
      subject.getNestedTreeList().then(response => {
        this.subjectList = response.data.items
      })
    },

    filterNode(value, data, node) {
    //   console.log('value', value)
      //   console.log('data', data)
      //   console.log('node', node)
      if (!value) return true
      //   console.log(data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1)
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
  }
}
</script>
