import request from '@/utils/request'
const apiPath = '/admin/edu/subject'

export default {
  getNestedTreeList() {
    return request({
      url: `${apiPath}/nested-list`,
      method: 'get'
    })
  }
}
