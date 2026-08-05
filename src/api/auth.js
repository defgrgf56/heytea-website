import { api } from './index'

/**
 * 用户认证相关 API
 */
export const authApi = {
  /**
   * 用户登录
   * @param {Object} credentials - 登录凭证
   * @param {string} credentials.username - 用户名或邮箱
   * @param {string} credentials.password - 密码
   * @returns {Promise<Object>} 返回用户信息和 token
   * 
   * 预期接口格式：
   * POST /auth/login
   * Request Body: { username: string, password: string }
   * Response: { 
   *   success: boolean,
   *   data: {
   *     token: string,
   *     user: {
   *       id: number,
   *       username: string,
   *       email: string,
   *       avatar?: string,
   *       nickname?: string
   *     }
   *   },
   *   message: string
   * }
   */
  login(credentials) {
    return api.post('/auth/login', credentials)
  },

  /**
   * 用户注册
   * @param {Object} userData - 注册信息
   * @param {string} userData.username - 用户名
   * @param {string} userData.email - 邮箱
   * @param {string} userData.password - 密码
   * @returns {Promise<Object>}
   * 
   * 预期接口格式：
   * POST /auth/register
   * Request Body: { username: string, email: string, password: string }
   * Response: { 
   *   success: boolean,
   *   data: {
   *     user: { id, username, email }
   *   },
   *   message: string
   * }
   */
  register(userData) {
    return api.post('/auth/register', userData)
  },

  /**
   * 用户退出登录
   * @returns {Promise<Object>}
   * 
   * 预期接口格式：
   * POST /auth/logout
   * Headers: { Authorization: 'Bearer token' }
   * Response: { success: boolean, message: string }
   */
  logout() {
    return api.post('/auth/logout')
  },

  /**
   * 获取当前用户信息
   * @returns {Promise<Object>}
   * 
   * 预期接口格式：
   * GET /auth/me
   * Headers: { Authorization: 'Bearer token' }
   * Response: {
   *   success: boolean,
   *   data: {
   *     id: number,
   *     username: string,
   *     email: string,
   *     avatar?: string,
   *     nickname?: string
   *   }
   * }
   */
  getCurrentUser() {
    return api.get('/auth/me')
  },

  /**
   * 刷新 token
   * @returns {Promise<Object>}
   * 
   * 预期接口格式：
   * POST /auth/refresh
   * Headers: { Authorization: 'Bearer token' }
   * Response: { 
   *   success: boolean,
   *   data: { token: string }
   * }
   */
  refreshToken() {
    return api.post('/auth/refresh')
  }
}
