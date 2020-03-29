import request from '@/utils/request'

const apiPath = '/admin/edu/chapter'

export default {

  getNestedTreeList(courseId) {
    return request({
      url: `${apiPath}/nested-list/${courseId}`,
      method: 'get'
    })
  },

  removeById(id) {
    return request({
      url: `${apiPath}/remove/${id}`,
      method: 'delete'
    })
  },

  save(chapter) {
    return request({
      url: `${apiPath}/save`,
      method: 'post',
      data: chapter
    })
  },

  getById(id) {
    return request({
      url: `${apiPath}/get/${id}`,
      method: 'get'
    })
  },

  updateById(chapter) {
    return request({
      url: `${apiPath}/update`,
      method: 'put',
      data: chapter
    })
  }
}
