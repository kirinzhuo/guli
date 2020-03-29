import request from '~/utils/request'
const apiPath = '/api/edu/subject'
export default {

  // 获取课程嵌套分类列表
  getSubjectNestedTreeList() {
    return request({
      url: `${apiPath}/subject-nested-list`,
      method: 'get'
    })
  }
}
