import { api } from './index'
import { encryptPayload } from '@/utils/rsa'

// 🎭 Mock 模式开关（从环境变量读取，也可以手动设置）
// 方式1: 从环境变量读取（推荐）
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
// 方式2: 手动设置（调试时使用）
// const USE_MOCK = true

console.log(`🔧 认证 API 模式: ${USE_MOCK ? 'Mock' : '真实后端'}`)

// LocalStorage 存储键
const USERS_STORAGE_KEY = 'heytea_mock_users'

// 虚拟用户数据库（初始预设用户）
const defaultMockUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    email: 'admin@heytea.com',
    nickname: '用户一',
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

/**
 * 从 localStorage 加载用户列表
 */
function loadUsersFromStorage() {
  try {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY)
    if (storedUsers) {
      const users = JSON.parse(storedUsers)
      console.log('✅ 从本地加载用户数据:', users.length, '个用户')
      return users
    }
  } catch (error) {
    console.error('加载用户数据失败:', error)
  }
  
  // 如果没有存储数据，返回默认用户并保存
  console.log('💾 初始化默认用户数据')
  saveUsersToStorage(defaultMockUsers)
  return [...defaultMockUsers]
}

/**
 * 保存用户列表到 localStorage
 */
function saveUsersToStorage(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    console.log('💾 用户数据已保存:', users.length, '个用户')
  } catch (error) {
    console.error('保存用户数据失败:', error)
  }
}

// 已注册用户列表（从 localStorage 加载，包含持久化数据）
let registeredUsers = loadUsersFromStorage()

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
  
  // 从 registeredUsers 查找（包含所有用户，包括新注册的）
  const user = registeredUsers.find(
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
    avatar: '/images/logo.webp',
    createdAt: new Date().toISOString()
  }
  
  // 添加到用户列表
  registeredUsers.push(newUser)
  
  // 💾 持久化到 localStorage
  saveUsersToStorage(registeredUsers)
  
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
  const user = registeredUsers.find(u => u.id === userId)
  
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
 * 重置用户数据（开发测试用）
 * 在浏览器控制台执行: window.resetMockUsers()
 */
window.resetMockUsers = function() {
  localStorage.removeItem(USERS_STORAGE_KEY)
  registeredUsers = [...defaultMockUsers]
  saveUsersToStorage(registeredUsers)
  console.log('✅ 用户数据已重置为默认状态')
  console.log('默认账号: admin/123456, zhangsan/123456, lisi/123456')
}

/**
 * 查看所有用户（开发测试用）
 * 在浏览器控制台执行: window.showMockUsers()
 */
window.showMockUsers = function() {
  console.log('📋 当前注册用户列表:')
  console.table(registeredUsers.map(u => ({
    ID: u.id,
    用户名: u.username,
    邮箱: u.email,
    昵称: u.nickname,
    注册时间: u.createdAt || '预设用户'
  })))
}

// 启动时显示用户数据状态
console.log('🎭 Mock 模式已启用')
console.log(`📊 当前共有 ${registeredUsers.length} 个注册用户`)
console.log('💡 开发工具: window.resetMockUsers() - 重置用户数据')
console.log('💡 开发工具: window.showMockUsers() - 查看所有用户')

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
   * 
   * 测试账号（真实后端）：
   * - 管理员: admin / 123456
   * - 普通用户: user / 123456
   */
  async login(credentials) {
    if (USE_MOCK) {
      return mockLogin(credentials)
    }
    
    // 真实后端 API：使用 RSA 加密登录
    try {
      // 1. 获取 Challenge
      const challengeResponse = await api.get('/auth/challenge?purpose=login')
      console.log('📦 Challenge 完整响应:', challengeResponse)
      
      // 从响应中提取 data 字段（后端返回格式：{success, message, data}）
      const challenge = challengeResponse.data
      
      if (!challenge || !challenge.publicKey) {
        console.error('❌ Challenge 数据无效:', challenge)
        throw new Error('未获取到公钥，请检查网络连接')
      }
      
      console.log('✅ 公钥已获取，准备加密...')
      
      // 2. 加密登录数据
      const payload = await encryptPayload(challenge.publicKey, {
        purpose: 'login',
        challengeId: challenge.challengeId,
        nonce: challenge.nonce,
        identifier: credentials.username, // 后端使用 identifier 字段
        password: credentials.password
      })
      
      console.log('✅ 数据已加密，提交登录...')
      
      // 3. 提交加密后的登录请求
      const loginResponse = await api.post('/auth/login', {
        credential: {
          challengeId: challenge.challengeId,
          payload
        }
      })
      
      console.log('📦 登录完整响应:', loginResponse)
      
      // 从响应中提取 data 字段
      const responseData = loginResponse.data
      
      // 4. 转换响应格式，兼容前端
      return {
        success: true,
        data: {
          token: responseData.token,
          user: {
            id: responseData.user.id,
            username: responseData.user.username,
            email: responseData.user.email,
            nickname: responseData.user.nickname || responseData.user.username,
            avatar: responseData.user.avatar || '/images/logo.webp',
            role: responseData.user.role,
            roles: responseData.user.roles,
            permissions: responseData.user.permissions
          }
        },
        message: '登录成功'
      }
    } catch (error) {
      console.error('❌ 登录失败:', error)
      throw error
    }
  },

  /**
   * 用户注册
   * @param {Object} userData - 注册信息
   * @param {string} userData.username - 用户名
   * @param {string} userData.email - 邮箱
   * @param {string} userData.password - 密码
   * @param {string} userData.nickname - 昵称（可选）
   * @returns {Promise<Object>}
   */
  async register(userData) {
    if (USE_MOCK) {
      return mockRegister(userData)
    }
    
    // 真实后端 API：使用 RSA 加密注册
    try {
      // 1. 获取 Challenge
      const challengeResponse = await api.get('/auth/challenge?purpose=register')
      console.log('📦 Challenge 完整响应:', challengeResponse)
      
      // 从响应中提取 data 字段（后端返回格式：{success, message, data}）
      const challenge = challengeResponse.data
      
      if (!challenge || !challenge.publicKey) {
        console.error('❌ Challenge 数据无效:', challenge)
        throw new Error('未获取到公钥，请检查网络连接')
      }
      
      console.log('✅ 公钥已获取，准备加密...')
      
      // 2. 加密注册数据
      const payload = await encryptPayload(challenge.publicKey, {
        purpose: 'register',
        challengeId: challenge.challengeId,
        nonce: challenge.nonce,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        nickname: userData.nickname || userData.username
      })
      
      console.log('✅ 数据已加密，提交注册...')
      
      // 3. 提交加密后的注册请求
      const registerResponse = await api.post('/auth/register', {
        credential: {
          challengeId: challenge.challengeId,
          payload
        }
      })
      
      console.log('📦 注册完整响应:', registerResponse)
      
      // 从响应中提取 data 字段
      const responseData = registerResponse.data
      
      // 4. 返回成功响应
      return {
        success: true,
        data: { user: responseData.user },
        message: '注册成功，请登录'
      }
    } catch (error) {
      console.error('注册失败:', error)
      throw error
    }
  },

  /**
   * 用户退出登录
   * @returns {Promise<Object>}
   */
  async logout() {
    if (USE_MOCK) {
      return mockLogout()
    }
    return api.post('/auth/logout')
  },

  /**
   * 获取当前用户信息
   * @returns {Promise<Object>}
   */
  async getCurrentUser() {
    if (USE_MOCK) {
      return mockGetCurrentUser()
    }
    
    // 真实后端 API
    try {
      const user = await api.get('/auth/me')
      
      return {
        success: true,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          nickname: user.nickname || user.username,
          avatar: user.avatar || '/images/logo.webp',
          role: user.role,
          roles: user.roles,
          permissions: user.permissions
        }
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  },

  /**
   * 刷新 token
   * @returns {Promise<Object>}
   */
  async refreshToken() {
    if (USE_MOCK) {
      return mockRefreshToken()
    }
    
    // 真实后端 API
    const response = await api.post('/auth/refresh')
    return {
      success: true,
      data: {
        token: response.token
      }
    }
  }
}
