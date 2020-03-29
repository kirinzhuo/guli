import request from '@/utils/request'

const apiPath = '/admin/edu/video'

export default {

  save(videoInfo) {
    return request({
      url: `${apiPath}/save`,
      method: 'post',
      data: videoInfo
    })
  },

  getById(id) {
    return request({
      url: `${apiPath}/get/${id}`,
      method: 'get'
    })
  },

  updateById(videoInfo) {
    return request({
      url: `${apiPath}/update`,
      method: 'put',
      data: videoInfo
    })
  },

  removeById(id) {
    return request({
      url: `${apiPath}/remove/${id}`,
      method: 'delete'
    })
  },
  getUploadAuthAndAddress(title, fileName) {
    return request({
      baseURL: 'http://127.0.0.1:8130',
      url: `${apiPath}/get-upload-auth-and-address/${title}/${fileName}`,
      method: 'get'
    })
  },

  refreshUploadAuth(videoId) {
    return request({
      baseURL: 'http://127.0.0.1:8130',
      url: `${apiPath}/refresh-upload-auth/${videoId}`,
      method: 'get'
    })
  }
}
