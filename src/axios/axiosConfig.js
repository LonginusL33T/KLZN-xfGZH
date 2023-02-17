import axios from 'axios'
import Global from '@/assets/js/global.js'

/*
 * axios请求拦截
 */
axios.interceptors.request.use(
    config => {
        if (Global.storage.get('token')) {
            config.headers.Authorization = 'Bearer ' + Global.storage.get('token')
        }
        // 提交FormData格式的数据时不开启loading效果(上传图片)
        if (!(config.data instanceof FormData) && !Global.requestLoading) {
            Global.startLoading()
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

/*
 * axios响应拦截
 */
axios.interceptors.response.use(
    response => {
        if (Global.requestLoading) {
            Global.endLoading()
        }
        return response
    },
    error => {
        if (error.response && error.response.status) {
            let msg = '';
            switch (error.response.status) {
                case 401: // 没有经过登录授权
                    msg = '请登录后访问！'
                    break
                case 403: // 登录过期
                    msg = '请重新登录！'
                    break
                case 404: // 请求不存在
                    msg = '请求不存在！'
                    break
                case 417: // 没有操作权限
                    msg = '没有操作权限，请联系管理员设置！'
                    break
                default: // 其他错误
                    msg = error.response.data.message
            }
            Global.axiosMessage('warning', msg, Global.endLoading)
            return Promise.reject(error.response)
        }
    }
)

export default axios