<template>
  <!-- 添加和修改课时表单 -->
  <el-dialog :visible.sync="dialogVisible" title="添加课时" @close="close">
    <el-form :model="video" label-width="120px">
      <el-form-item label="课时标题">
        <el-input v-model="video.title"/>
      </el-form-item>
      <el-form-item label="课时排序">
        <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
      </el-form-item>
      <el-form-item label="是否免费">
        <el-radio-group v-model="video.free">
          <el-radio :label="true">免费</el-radio>
          <el-radio :label="false">默认</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上传视频">
        <!-- 上传视频 -->
        <!-- javascript sdk上传 -->
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-change="fileChange"
          :on-exceed="fileUploadExceed"
          :before-remove="handleBeforeRemove"
          :on-remove="handleOnRemove"
          :file-list="fileList"
          :limit="1"
          class="upload-demo"
          action=""><!--action属性不写会报错-->
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-tooltip placement="right-end">
            <div slot="content">最大支持1G，<br>
              支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
              GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
              MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
              SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
            <i class="el-icon-question"/>
          </el-tooltip>
          <el-button
            :disabled="uploadBtnDisabled"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload()">上传</el-button>
          <label class="status"><span>{{ statusText }}</span></label>
          <span class="progress"><i id="auth-progress">{{ authProgress }}</i></span>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
    </div>
  </el-dialog>

</template>
<script>
import videoApi from '@/api/edu/video'
import vodVideo from '@/api/vod/video'
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
      video: {// 课时对象
        chapterId: '',
        title: '',
        sort: 0,
        free: false,
        videoSourceId: '', // 阿里云视频id
        videoOriginalName: '' // 视频名称

      },
      fileList: [], // 上传文件列表
      uploadBtnDisabled: false,
      timeout: 60000, // 超时时间
      partSize: 1048576, // 分片大小默认1M，不能小于100K
      parallel: 5, // 并行上传分片个数，默认5
      retryCount: 3, // 网络原因失败时，重新上传次数，默认为3
      retryDuration: 2, // 网络原因失败时，重新上传间隔时间，默认为2秒
      region: 'cn-shanghai', // 上传到点播的地域， 默认值为'cn-shanghai',//eu-central-1,ap-southeast-1
      userId: '1416073142040786', // 阿里账号ID
      authProgress: null, // 上传进度
      uploader: null, // 上传对象
      statusText: '' // 上传状态提示

    }
  },

  methods: {
    /**
     * 创建AliyunUpload播放器组件
     */
    createUploader(type) {
      console.log('createUploader')
      const self = this

      /* eslint-disable no-undef */
      const uploader = new AliyunUpload.Vod({
        userId: self.userId,
        region: self.region,
        timeout: self.timeout,
        partSize: self.partSize,
        parallel: self.parallel,
        retryCount: self.retryCount,
        retryDuration: self.retryDuration,
        // 添加文件成功
        addFileSuccess: function(uploadInfo) {
          console.log('addFileSuccess调用成功')
          console.log('添加文件成功：' + uploadInfo.file.name)
          self.statusText = '添加文件成功, 等待上传...'
        },
        // 开始上传
        onUploadstarted: function(uploadInfo) {
          console.log('获取上传地址和凭证：' + uploadInfo.file.name)
          self.uploadBtnDisabled = true
          const fileName = uploadInfo.file.name
          const title = fileName.substring(0, fileName.lastIndexOf('.'))
          vodVideo.getUploadAuthAndAddress(title, fileName).then(response => {
            console.log('获取上传地址和凭证成功')
            const uploadAuth = response.data.uploadAuth
            const uploadAddress = response.data.uploadAddress
            const videoId = response.data.videoId
            uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
            console.log('开始上传')
            self.statusText = '开始上传...'
          })
        },
        // 上传凭证超时
        onUploadTokenExpired: function(uploadInfo) {
          // 上传大文件超时,需要调用resumeUploadWithAuth方法
          console.log('上传超时：' + uploadInfo.file.name)
          vodVideo.refreshUploadAuth(uploadInfo.videoId).then(response => {
            console.log('刷新上传凭证成功')
            const uploadAuth = response.data.uploadAuth
            // 上传凭证失效后恢复上传
            uploader.resumeUploadWithAuth(uploadAuth)
          })
        },
        // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
        onUploadProgress: function(uploadInfo, totalSize, progress) {
          console.log(
            '上传进度：' + uploadInfo.file.name +
                ', fileSize:' + totalSize +
                ', percent:' + Math.ceil(progress * 100) + '%')
          const progressPercent = Math.ceil(progress * 100)
          self.authProgress = progressPercent + '%'
          self.statusText = '文件上传中...'
        },
        // 文件上传成功
        onUploadSucceed: function(uploadInfo) {
          console.log('上传成功：' + uploadInfo.file.name)
          self.statusText = '文件上传成功!'
          const fileName = uploadInfo.file.name
          self.video.videoOriginalName = fileName.substring(0, fileName.lastIndexOf('.'))
          self.video.videoSourceId = uploadInfo.videoId
        },
        // 文件上传失败
        onUploadFailed: function(uploadInfo, code, message) {
          console.log('上传失败：' + uploadInfo.file.name + ',code:' + code + ', message:' + message)
          self.statusText = '文件上传失败!'
        },
        // 全部文件上传结束
        onUploadEnd: function(uploadInfo) {
          console.log('全部文件上传结束')
          self.uploadBtnDisabled = true
          self.statusText = '文件上传完毕'
        }
      })
      return uploader
    },
    fileChange(file) {
      console.log('fileChange')
      this.uploader = this.createUploader()
      this.uploader.addFile(file.raw)
    },
    submitUpload() {
      if (this.uploader !== null) {
        this.uploader.startUpload()
      }
    },

    // 删除视频文件确认
    handleBeforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },

    // 执行视频文件的删除
    handleOnRemove(file, fileList) {
      if (!this.video.videoSourceId) {
        return
      }
      vodVideo.removeByVodId(this.video.videoSourceId).then(response => {
        this.video.videoSourceId = ''
        this.video.videoOriginalName = ''
        videoApi.updateById(this.video)
        this.$message({
          type: 'success',
          message: response.message
        })
      })
    },

    // 上传多于一个视频
    fileUploadExceed(files, fileList) {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },
    open(chapterId, videoId) {
      this.dialogVisible = true
      this.video.chapterId = chapterId
      if (videoId) {
        videoApi.getById(videoId).then(response => {
          this.video = response.data.item
          // 回显
          if (this.video.videoSourceId && this.video.videoOriginalName) {
            this.fileList = [{ 'name': this.video.videoOriginalName }]
          }
        })
      }
    },

    saveOrUpdate() {
      if (!this.video.id) {
        this.save()
      } else {
        this.update()
      }
    },

    save() {
      this.video.courseId = this.courseId
      videoApi.save(this.video).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        // 关闭组件
        this.close()
        // 调用父组件监听函数
        this.$emit('onSaveSuccess')
      })
    },

    close() {
      this.dialogVisible = false
      // 重置表单
      this.resetForm()
    },

    resetForm() {
      this.video = {
        id: null,
        title: '',
        sort: 0,
        chapterId: '',
        free: false,
        videoSourceId: '',
        videoOriginalName: ''
      }
      this.authProgress = null
      this.uploadDisabled = true
      this.uploader = null
      this.statusText = ''
    },

    update() {
      videoApi.updateById(this.video).then(response => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        // 关闭组件
        this.close()
        // 调用父组件监听函数
        this.$emit('onSaveSuccess')
      })
    }
  }
}
</script>
