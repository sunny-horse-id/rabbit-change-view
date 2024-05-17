import { useMemberStore } from '@/stores'

// 基地址
const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

// 添加拦截器
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 非 http 开头需拼接地址
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    // 请求超时, 默认 60s
    options.timeout = 10000
    // 添加小程序端请求头标识
    options.header = {
      // 如果有请求头, 带上
      ...options.header,
      'source-client': 'miniapp',
    }
    // 添加 token 请求头标识
    const memberStore = useMemberStore()
    // 获取 token，如果不存在直接返回未定义
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }
  },
}
// 添加拦截器
// 拦截request请求
uni.addInterceptor('request', httpInterceptor)
// 拦截uploadFile请求
uni.addInterceptor('uploadFile', httpInterceptor)

interface Data<T> {
  code: string
  msg: string
  result: T
}

// 支持泛型
export const http = <T>(options: UniApp.RequestOptions) => {
  // 返回一个promise
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      // 作用是将 options 对象中的所有属性和值，都拷贝到新的对象中去。拷贝到 uni.request 方法的参数对象中去
      ...options,
      // 响应成功
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 状态码在 200 到 300 之间，才认为是成功的
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 400) {
          // 状态码为 401，表示 token 失效，清理用户信息，需要重新登录
          // 清理用户信息
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          // 跳转到登录页面
          uni.navigateTo({ url: '/pages/login/login' })
          // 标记失败, 以便进行错误处理
          reject(res)
        } else {
          // 其它情况, 根据后端轻提示
          uni.showToast({
            icon: 'none',
            // 没有就返回请求错误
            title: (res.data as Data<T>).msg || '请求错误',
          })
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          // 没有就返回请求错误
          title: '网络错误',
        })
        reject(err)
      },
    })
  })
}
