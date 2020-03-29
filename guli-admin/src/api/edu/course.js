import request from '@/utils/request'

const apiPath = '/admin/edu/course'

export default {

  getPageList(page, limit, searchObj) {
    return request({
      url: `${apiPath}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },

  saveCourseInfo(courseInfo) {
    return request({
      url: `${apiPath}/save-course-info`,
      method: 'post',
      data: courseInfo
    })
  },

  getCourseInfoById(id) {
    return request({
      url: `${apiPath}/course-info/${id}`,
      method: 'get'
    })
  },

  updateCourseInfoById(courseInfo) {
    return request({
      url: `${apiPath}/update-course-info`,
      method: 'put',
      data: courseInfo
    })
  },
  getCoursePublishInfoById(id) {
    return request({
      url: `${apiPath}/course-publish-info/${id}`,
      method: 'get'
    })
  },

  publishCourse(id) {
    return request({
      url: `${apiPath}/publish-course/${id}`,
      method: 'put'
    })
  }
}
