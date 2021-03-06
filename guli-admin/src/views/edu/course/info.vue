
<template>
  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="active" finish-status="success" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="发布课程"/>
    </el-steps>

    <!-- 课程信息表单 -->
    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类 -->
      <el-form-item label="课程类别">
        <!-- 一级类别 -->
        <el-select
          v-model="courseInfo.subjectParentId"
          @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectNestedList"
            :key="subject.id"
            :value="subject.id"
            :label="subject.title" />
        </el-select>
        <!-- 二级类别 -->
        <el-select
          v-model="courseInfo.subjectId">
          <el-option
            v-for="subject in subSubjectList"
            :key="subject.id"
            :value="subject.id"
            :label="subject.title" />
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :value="teacher.id"
            :label="teacher.name" />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce ref="tinymce" :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleCoverSuccess"
          :before-upload="beforeCoverUpload"
          action="http://127.0.0.1:8120/admin/oss/file/upload?module=cover"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>
    </el-form>

    <div style="text-align:center">
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next()">保存并下一步</el-button>
    </div>
  </div>
</template>

<script>
import courseApi from '@/api/edu/course'
import teacherApi from '@/api/edu/teacher'
import subjectApi from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'

export default {

  components: { Tinymce }, // 注册富文本编辑器

  data() {
    return {
      active: 0,
      saveBtnDisabled: false, // 保存按钮是否禁用

      courseInfo: {
        price: 0,
        lessonNum: 0,
        cover: process.env.OSS_PATH + '/cover/default.gif',
        subjectId: ''
      }, // 课程基本信息

      teacherList: [], // 讲师下拉列表
      subjectNestedList: [], // 一级分类列表
      subSubjectList: [] // 二级分类列表
    }
  },

  watch: {
    $route(to, from) {
      this.init()
    }
  },

  created() {
    console.log('info created')
    this.init()
  },

  methods: {

    init() {
      if (this.$route.params && this.$route.params.id) { // 回显
        this.getCourseInfoById(this.$route.params.id)
      } else { // 新增
        // 初始化课程数据
        this.courseInfo = {
          price: 0,
          lessonNum: 0,
          subjectId: '',
          cover: process.env.OSS_PATH + '/cover/default.gif'
        }
        // 清空富文本编辑器的内容
        if (this.$refs.tinymce) { // 解决tinymce新增时tinymce找不到的问题
          this.$refs.tinymce.setContent('')
        }

        this.initSubjectList()
      }

      this.initTeacherList()
    },

    // 获取当前课程基本信息
    getCourseInfoById(id) {
      courseApi.getCourseInfoById(id).then(response => {
        this.courseInfo = response.data.item

        subjectApi.getNestedTreeList().then(response => {
          this.subjectNestedList = response.data.items

          // 根据courseInfo.subjectId获取子分类列表
          this.subjectNestedList.forEach(subject => {
            if (subject.id === this.courseInfo.subjectParentId) {
              this.subSubjectList = subject.children
            }
          })
        })
      })
    },

    // 获取课程分类列表
    initSubjectList() {
      subjectApi.getNestedTreeList().then(response => {
        this.subjectNestedList = response.data.items
      })
    },

    // 获取讲师下拉列表
    initTeacherList() {
      teacherApi.getList().then(response => {
        this.teacherList = response.data.items
      })
    },

    // 课程一级分类变化时触发
    subjectLevelOneChanged(value) {
      console.log('value', value)
      // 根据value值找到父类别，将父类别中的children数据赋值给subSubjectList
      this.subjectNestedList.forEach(subject => {
        if (subject.id === value) {
          this.courseInfo.subjectId = ''
          this.subSubjectList = subject.children
        }
      })
    },

    // 课程封面上传成功
    handleCoverSuccess(response) {
      this.courseInfo.cover = response.data.url
    },

    // 上传之间的校验工作
    beforeCoverUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // 保存课程基本信息
    saveData() {
      courseApi.saveCourseInfo(this.courseInfo).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.$router.push({ path: '/edu/course/chapter/' + response.data.courseId })
      })
    },

    updateData() {
      this.saveBtnDisabled = true
      courseApi.updateCourseInfoById(this.courseInfo).then(response => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
        this.$router.push({ path: '/edu/course/chapter/' + this.courseInfo.id })
      })
    },

    next() {
      console.log('next')
      this.saveBtnDisabled = true
      if (!this.courseInfo.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    }
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}
</style>
