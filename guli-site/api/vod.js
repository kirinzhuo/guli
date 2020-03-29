import request from '~/utils/request'
const apiPath = '/api/vod/video'

export default {

  getPlayAuth(vid) {
    return request({
      baseURL: 'http://localhost:8130',
      url: `${apiPath}/get-play-auth/${vid}`,
      method: 'get'
    })
  }
}
