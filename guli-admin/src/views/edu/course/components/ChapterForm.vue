<template>
  <!-- 添加和修改章节表单 -->
  <el-dialog :visible.sync="dialogVisible" title="添加章节" @close="close()">
    <el-form :model="chapter" label-width="120px">
      <el-form-item label="章节标题">
        <el-input v-model="chapter.title"/>
      </el-form-item>
      <el-form-item label="章节排序">
        <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import chapterApi from '@/api/edu/chapter'

export default {

  // 父组件向子组件传值
  props: {
    courseId: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      dialogVisible: false,
      chapter: {// 章节对象
        courseId: '',
        title: '',
        sort: 0
      }
    }
  },

  methods: {
    open(chapterId) {
      this.dialogVisible = true
      if (chapterId) {
        chapterApi.getById(chapterId).then(response => {
          this.chapter = response.data.item
        })
      }
    },

    // 关闭表单
    close() {
      this.dialogVisible = false
      this.resetForm()
    },

    // 重置表单数据
    resetForm() {
      this.chapter = {
        id: '',
        title: '',
        sort: 0
      }
    },

    saveOrUpdate() {
      if (!this.chapter.id) {
        this.save()
      } else {
        this.update()
      }
    },

    save() {
      this.chapter.courseId = this.courseId
      chapterApi.save(this.chapter).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        // 关闭组件
        this.close()
        // 刷新章节列表：调用父组件的方法(触发事件@on-save-success)
        this.$emit('onSaveSuccess')
      })
    },

    update() {
      chapterApi.updateById(this.chapter).then(response => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        // 关闭组件
        this.close()
        // 刷新章节列表：调用父组件的方法(触发事件@on-save-success)
        this.$emit('onSaveSuccess')
      })
    }
  }
}
</script>
