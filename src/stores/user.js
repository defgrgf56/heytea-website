import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')
  const isLoading = ref(false)
  const error = ref(null)

  // 计算属性
  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const userAvatar = computed(() => user.value?.avatar || '/images/default-avatar.png')
  const userName = computed(() => user.value?.nickname || user.value?.username || '用户')

  /**
   * 用户登录
   */
  async function login(credentials) {
    isLoading.value = true
    error.value = null

    try {
      // 调用登录 API
      const response = await authApi.login(credentials)
      
      if (response.success) {
        // 保存 token 和用户信息
        token.value = response.data.token
        user.value = response.data.user
        
        // 尝试加载用户之前保存的头像
        const userId = response.data.user.id || response.data.user.username
        const savedAvatar = localStorage.getItem(`avatar_${userId}`)
        if (savedAvatar) {
          user.value.avatar = savedAvatar
        }
        
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(user.value))
        
        // 🛒 登录成功后同步购物车
        try {
          const { useCartStore } = await import('./cart')
          const cartStore = useCartStore()
          await cartStore.syncFromServer()
          console.log('✅ 购物车同步完成')
        } catch (err) {
          console.warn('⚠️ 购物车同步失败:', err.message)
        }
        
        // 📍 登录成功后加载收货地址
        try {
          const { useAddressStore } = await import('./address')
          const addressStore = useAddressStore()
          await addressStore.fetchAddresses()
          console.log('✅ 地址列表加载完成')
        } catch (err) {
          console.warn('⚠️ 地址列表加载失败:', err.message)
        }
        
        return { success: true }
      } else {
        throw new Error(response.message || '登录失败')
      }
    } catch (err) {
      error.value = err.message
      console.error('登录失败:', err)
      return { success: false, message: err.message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 用户注册
   */
  async function register(userData) {
    isLoading.value = true
    error.value = null

    try {
      const response = await authApi.register(userData)
      
      if (response.success) {
        return { success: true, message: '注册成功，请登录' }
      } else {
        throw new Error(response.message || '注册失败')
      }
    } catch (err) {
      error.value = err.message
      return { success: false, message: err.message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 用户退出
   */
  async function logout() {
    try {
      // 调用退出 API（可选）
      if (token.value) {
        await authApi.logout()
      }
    } catch (err) {
      console.error('退出登录 API 调用失败:', err)
    } finally {
      // 🛒 禁用购物车同步
      try {
        const { useCartStore } = await import('./cart')
        const cartStore = useCartStore()
        cartStore.disableSync()
      } catch (err) {
        console.warn('⚠️ 购物车同步禁用失败:', err.message)
      }
      
      // 清除本地数据
      user.value = null
      token.value = ''
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  /**
   * 获取当前用户信息（从服务器刷新）
   */
  async function fetchUserInfo() {
    if (!token.value) return

    try {
      const response = await authApi.getCurrentUser()
      if (response.success) {
        user.value = response.data
        
        // 尝试加载用户之前保存的头像
        const userId = response.data.id || response.data.username
        const savedAvatar = localStorage.getItem(`avatar_${userId}`)
        if (savedAvatar) {
          user.value.avatar = savedAvatar
        }
        
        localStorage.setItem('user', JSON.stringify(user.value))
      }
    } catch (err) {
      console.error('获取用户信息失败:', err)
      // token 可能已过期，清除登录状态
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        await logout()
      }
    }
  }

  /**
   * 从本地存储恢复用户信息（页面刷新时）
   */
  async function restoreUserFromStorage() {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      try {
        user.value = JSON.parse(storedUser)
        
        // 尝试加载用户之前保存的头像
        const userId = user.value.id || user.value.username
        const savedAvatar = localStorage.getItem(`avatar_${userId}`)
        if (savedAvatar) {
          user.value.avatar = savedAvatar
        }

        // 🛒 页面刷新后重新启用购物车同步
        try {
          const { useCartStore } = await import('./cart')
          const cartStore = useCartStore()
          await cartStore.syncFromServer()
          console.log('✅ 页面刷新后购物车同步完成')
        } catch (err) {
          console.warn('⚠️ 页面刷新后购物车同步失败:', err.message)
        }
        
        // 📍 页面刷新后加载地址列表
        try {
          const { useAddressStore } = await import('./address')
          const addressStore = useAddressStore()
          await addressStore.fetchAddresses()
          console.log('✅ 页面刷新后地址列表加载完成')
        } catch (err) {
          console.warn('⚠️ 页面刷新后地址列表加载失败:', err.message)
        }
      } catch (err) {
        console.error('解析用户信息失败:', err)
        localStorage.removeItem('user')
      }
    }
  }

  /**
   * 刷新 token
   */
  async function refreshToken() {
    try {
      const response = await authApi.refreshToken()
      if (response.success) {
        token.value = response.data.token
        localStorage.setItem('token', response.data.token)
        return true
      }
      return false
    } catch (err) {
      console.error('刷新 token 失败:', err)
      return false
    }
  }

  return {
    // 状态
    user,
    token,
    isLoading,
    error,
    // 计算属性
    isLoggedIn,
    userAvatar,
    userName,
    // 方法
    login,
    register,
    logout,
    fetchUserInfo,
    restoreUserFromStorage,
    refreshToken
  }
})
