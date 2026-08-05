import { api } from './index'

// 🎭 Mock 模式开关（设置为 true 使用虚拟数据，false 连接真实后端）
const USE_MOCK = true

// 虚拟用户数据库
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    email: 'admin@heytea.com',
    nickname: '管理员',
    avatar: '/images/logo.webp'
  },
  {
    id: 2,
    username: 'zhangsan',
    password: '123456',
    email: 'zhangsan@heytea.com',
    nickname: '张三',
    avatar: '/images/logo.webp'
  },
  {
    id: 3,
    username: 'lisi',
    password: '123456',
    email: 'lisi@heytea.com',
    nickname: '李四',
    avatar: '/images/logo.webp'
  }
]

// 已注册用户列表（用于注册时检查重复）
const registeredUsers = [...mockUsers]

/**
 * 模拟网络延迟
 */
function mockDelay(ms = 800) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Mock 登录
 */
async function mockLogin(credentials) {
  await mockDelay()
  
  const user = mockUsers.find(
    u => u.username === credentials.username && u.password === credentials.password
  )
  
  if (user) {
    const { password, ...userInfo } = user
    return {
      success: true,
      data: {
        token: `mock-token-${user.id}-${Date.now()}`,
        user: userInfo
      },
      message: '登录成功'
    }
  } else {
    return {
      success: false,
      message: '用户名或密码错误'
    }
  }
}

/**
 * Mock 注册
 */
async function mockRegister(userData) {
  await mockDelay()
  
  // 检查用户名是否已存在
  const existingUser = registeredUsers.find(u => u.username === userData.username)
  if (existingUser) {
    return {
      success: false,
      message: '用户名已存在'
    }
  }
  
  // 检查邮箱是否已存在
  const existingEmail = registeredUsers.find(u => u.email === userData.email)
  if (existingEmail) {
    return {
      success: false,
      message: '邮箱已被注册'
    }
  }
  
  // 创建新用户
  const newUser = {
    id: registeredUsers.length + 1,
    username: userData.username,
    password: userData.password,
    email: userData.email,
    nickname: userData.username,
    avatar: '/images/logo.webp'
  }
  
  registeredUsers.push(newUser)
  
  const { password, ...userInfo } = newUser
  return {
    success: true,
    data: { user: userInfo },
    message: '注册成功'
  }
}

/**
 * Mock 退出登录
 */
async function mockLogout() {
  await mockDelay(300)
  return {
    success: true,
    message: '退出登录成功'
  }
}

/**
 * Mock 获取当前用户信息
 */
async function mockGetCurrentUser() {
  await mockDelay(500)
  
  // 从 token 中获取用户 ID（简化处理）
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('未登录')
  }
  
  // 模拟从 token 解析用户 ID
  const userId = parseInt(token.split('-')[2]) || 1
  const user = mockUsers.find(u => u.id === userId)
  
  if (user) {
    const { password, ...userInfo } = user
    return {
      success: true,
      data: userInfo
    }
  } else {
    throw new Error('用户不存在')
  }
}

/**
 * Mock 刷新 token
 */
async function mockRefreshToken() {
  await mockDelay(300)
  
  const oldToken = localStorage.getItem('token')
  if (!oldToken) {
    throw new Error('未登录')
  }
  
  const userId = parseInt(oldToken.split('-')[2]) || 1
  return {
    success: true,
    data: {
      token: `mock-token-${userId}-${Date.now()}`
    }
  }
}

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
   * 测试账号（Mock 模式）：
   * - 用户名: admin, 密码: 123456
   * - 用户名: zhangsan, 密码: 123456
   * - 用户名: lisi, 密码: 123456
   */
  login(credentials) {
    if (USE_MOCK) {
      return mockLogin(credentials)
    }
    return api.post('/auth/login', credentials)
  },

  /**
   * 用户注册
   * @param {Object} userData - 注册信息
   * @param {string} userData.username - 用户名
   * @param {string} userData.email - 邮箱
   * @param {string} userData.password - 密码
   * @returns {Promise<Object>}
   */
  register(userData) {
    if (USE_MOCK) {
      return mockRegister(userData)
    }
    return api.post('/auth/register', userData)
  },

  /**
   * 用户退出登录
   * @returns {Promise<Object>}
   */
  logout() {
    if (USE_MOCK) {
      return mockLogout()
    }
    return api.post('/auth/logout')
  },

  /**
   * 获取当前用户信息
   * @returns {Promise<Object>}
   */
  getCurrentUser() {
    if (USE_MOCK) {
      return mockGetCurrentUser()
    }
    return api.get('/auth/me')
  },

  /**
   * 刷新 token
   * @returns {Promise<Object>}
   */
  refreshToken() {
    if (USE_MOCK) {
      return mockRefreshToken()
    }
    return api.post('/auth/refresh')
  }
}
