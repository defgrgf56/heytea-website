import toast from '@/utils/toast'
import router from '@/router'

// API 基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// 是否显示请求日志（开发环境）
const SHOW_LOG = import.meta.env.DEV

/**
 * 请求拦截器 - 在发送请求前执行
 */
function requestInterceptor(url, config) {
  // 开发环境下打印请求日志
  if (SHOW_LOG) {
    console.log(`📤 API Request: ${config.method} ${url}`)
    if (config.body) {
      console.log('📦 Request Body:', JSON.parse(config.body))
    }
  }
  
  return config
}

/**
 * 响应拦截器 - 在收到响应后执行
 */
function responseInterceptor(url, response, data) {
  // 开发环境下打印响应日志
  if (SHOW_LOG) {
    console.log(`📥 API Response: ${response.status} ${url}`)
    console.log('📦 Response Data:', data)
  }
  
  return data
}

/**
 * 错误处理器
 */
function handleError(error, url, response) {
  console.error('❌ API Error:', url, error)
  
  // 根据 HTTP 状态码处理
  if (response) {
    switch (response.status) {
      case 401:
        // 未认证 - 清除 token 并跳转登录
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        toast.error('登录已过期，请重新登录')
        router.push('/login')
        break
        
      case 403:
        // 无权限
        toast.error('无权限访问')
        break
        
      case 404:
        // 资源不存在
        toast.error('请求的资源不存在')
        break
        
      case 422:
        // 参数验证失败
        toast.error(error.message || '参数验证失败')
        break
        
      case 500:
      case 502:
      case 503:
        // 服务器错误
        toast.error('服务器繁忙，请稍后重试')
        break
        
      default:
        // 其他错误
        toast.error(error.message || '请求失败')
    }
  } else {
    // 网络错误或其他错误
    if (error.message === 'Failed to fetch') {
      toast.error('网络连接失败，请检查网络')
    } else {
      toast.error(error.message || '请求失败')
    }
  }
  
  throw error
}

/**
 * 封装 fetch 请求
 */
async function request(url, options = {}) {
  const token = localStorage.getItem('token')
  
  let config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  }
  
  // 请求拦截
  config = requestInterceptor(url, config)
  
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config)
    
    console.log('📡 Fetch 完成，状态码:', response.status, 'URL:', url)
    
    // 尝试解析 JSON
    let data
    try {
      data = await response.json()
      console.log('📦 解析后的数据:', data)
    } catch (e) {
      // 如果响应不是 JSON，返回空对象
      console.warn('⚠️ 响应不是 JSON:', e)
      data = {}
    }
    
    // 响应拦截
    data = responseInterceptor(url, response, data)
    
    // 检查 HTTP 状态码
    if (!response.ok) {
      console.error('❌ HTTP 状态码不是 2xx:', response.status)
      const error = new Error(data.message || `请求失败 (${response.status})`)
      error.status = response.status
      error.data = data
      return handleError(error, url, response)
    }
    
    return data
  } catch (error) {
    // 处理网络错误等
    return handleError(error, url, null)
  }
}

/**
 * API 方法封装
 */
export const api = {
  /**
   * GET 请求
   */
  get: (url, options) => request(url, { ...options, method: 'GET' }),
  
  /**
   * POST 请求
   */
  post: (url, body, options) => request(url, { 
    ...options, 
    method: 'POST', 
    body: JSON.stringify(body) 
  }),
  
  /**
   * PUT 请求
   */
  put: (url, body, options) => request(url, { 
    ...options, 
    method: 'PUT', 
    body: JSON.stringify(body) 
  }),
  
  /**
   * DELETE 请求
   */
  delete: (url, options) => request(url, { ...options, method: 'DELETE' }),
  
  /**
   * PATCH 请求
   */
  patch: (url, body, options) => request(url, { 
    ...options, 
    method: 'PATCH', 
    body: JSON.stringify(body) 
  })
}

// 导出基础 URL（供其他模块使用）
export { API_BASE_URL }

// 导出所有 API 模块
export { productApi } from './product'
export { cartApi } from './cart'
export { orderApi } from './order'
export { addressApi } from './address'
export { authApi } from './auth'

console.log('🔧 API 配置已加载')
console.log(`📡 API Base URL: ${API_BASE_URL}`)
console.log(`🔍 日志模式: ${SHOW_LOG ? '开启' : '关闭'}`)
