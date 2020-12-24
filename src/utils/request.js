import axios from 'axios'
import router from '@/router'
import store from '@/store'
import { Notification } from 'element-ui'
import Config from '@/settings'
import Cookies from 'js-cookie'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseUrl: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/',
  timeout: Config.timeout
})

service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers.Authorization = getToken()
    }
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => {
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    var data = response.data
    if (data.code !== 0) {
      Notification.error({
        title: data.errMsg,
        duration: 5000
      })
      // return Promise.reject()
    }
    return data
  },
  error => {
    if (error.response.data instanceof Blob && error.response.data.type.toLowerCase().indexOf('json') !== -1) {
      const reader = new FileReader()
      reader.readAsText(error.response.data, 'utf-8')
      reader.onload = e => {
        const errorMsg = JSON.parse(reader.result).message
        Notification.error({
          title: errorMsg,
          duration: 5000
        })
      }
    } else {
      const code = error.response.status
      if (error.toString().indexOf('Error: timeout') !== -1) {
        Notification.error({
          title: '网络请求超时',
          duration: 5000
        })
        return Promise.reject(error)
      }

      if (code) {
        if (code === 401) {
          store.dispatch('Logout').then(() => {
            Cookies.set('point', 401)
            location.reload()
          })
        } else if (code === 403) {
          router.push({ path: '/401' })
        } else {
          Notification.error({
            title: '接口请求失败',
            duration: 5000
          })
        }
      }
    }
    return Promise.reject(error)
  }
)

export default service
