import request from '@/utils/request'
import cookie from 'js-cookie'
const apiPath = '/api/ucenter/member'

export default {

  sendMessage(mobile) {
    return request({
      baseURL: 'http://localhost:8160',
      url: `/api/sms/send/${mobile}`,
      method: 'get'
    })
  },

  submitRegister(formItem) {
    return request({
      baseURL: 'http://localhost:8150',
      url: `${apiPath}/register`,
      method: 'post',
      data: formItem
    })
  },

  submitLogin(userInfo) {
    return request({
      baseURL: 'http://localhost:8150',
      url: `${apiPath}/login`,
      method: 'post',
      data: userInfo
    })
  },

  getLoginInfo() {
    return request({
      baseURL: 'http://localhost:8150',
      url: `${apiPath}/auth/get-login-info`,
      method: 'get',
      headers: { 'token': cookie.get('guli_token') }
    })
  }
}
