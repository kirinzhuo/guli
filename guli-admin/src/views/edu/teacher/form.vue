<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="入驻时间">
        <el-date-picker
          v-model="teacher.joinDate"
          type="date"
          placeholder="选择入驻时间"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" :min="0" controls-position="right"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <pan-thumb :image="teacher.avatar"/>

        <el-button type="primary" icon="upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">上传头像
        </el-button>

        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          url="http://localhost:8120/admin/oss/file/upload?module=avatar"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>

    <!-- <input v-model="a" type="text"> -->
  </div>
</template>

<script>
import teacherApi from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      // a: 'a',
      teacher: {
        sort: 0,
        level: 1
      },
      saveBtnDisabled: false, // 保存按钮是否禁用,

      imagecropperShow: false, // 控制头像上传组件的显示或隐藏
      imagecropperKey: 0 // 上传组件的唯一key值，如果key值被更新，可以用于重新渲染组件
    }
  },

  watch: {
    // a(newValue, oldValue) {
    //   console.log(newValue)
    //   console.log(oldValue)
    // },

    // 当组件不变路由变化时，不会访问created，访问监听器
    $route(to, from) {
      // console.log(to)
      // console.log(from)
      this.init()
    }
  },

  // 当第一次访问组件时访问created
  created() {
    // debugger
    console.log('created')
    this.init()
  },

  methods: {

    init() {
      if (this.$route.params && this.$route.params.id) { // 回显
        this.fetchDataById(this.$route.params.id)
      } else { // 重新初始化teacher对象
        this.teacher = {
          sort: 0,
          level: 1,
          avatar: process.env.OSS_PATH + '/avatar/default.jpg'
        }
      }
    },

    // 根据id获取讲师列表
    fetchDataById(id) {
      teacherApi.getById(id).then(response => {
        this.teacher = response.data.item
      })
    },

    // 保存表单
    saveOrUpdate() {
      this.saveBtnDisabled = true// 禁用按钮，防止表单重复提交
      if (!this.teacher.id) {
        this.saveData()
      } else {
        this.updateData()
      }
    },

    // 新增讲师
    saveData() {
      teacherApi.save(this.teacher).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })

        // 路由跳转
        this.$router.push({
          path: '/edu/teacher'
        })
      })
    },

    // 更新讲师
    updateData() {
      teacherApi.updateById(this.teacher).then(response => {
        this.$message({
          type: 'success',
          message: '更新成功'
        })
        // 路由跳转
        this.$router.push({
          path: '/edu/teacher'
        })
      })
    },

    // 上传成功回调
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1

      console.log(resData)
      this.teacher.avatar = resData.url // 获取图片的url地址
      console.log(this.teacher)
    },
    // 关闭上传组件
    close() {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
    }
  }
}
</script>
