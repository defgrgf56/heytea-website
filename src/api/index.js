// API 基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

/**
 * 封装 fetch 请求
 */
async function request(url, options = {}) {
  const token = localStorage.getItem('token')
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '请求失败')
    }

    return data
  } catch (error) {
    console.error('API 请求错误:', error)
    throw error
  }
}

export const api = {
  get: (url, options) => request(url, { ...options, method: 'GET' }),
  post: (url, body, options) => request(url, { 
    ...options, 
    method: 'POST', 
    body: JSON.stringify(body) 
  }),
  put: (url, body, options) => request(url, { 
    ...options, 
    method: 'PUT', 
    body: JSON.stringify(body) 
  }),
  delete: (url, options) => request(url, { ...options, method: 'DELETE' })
}
