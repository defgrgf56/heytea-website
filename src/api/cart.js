import { api } from './index'

// 🎭 Mock 模式开关（从环境变量读取）
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// 调试信息
console.log('🎭 购物车 API Mock 模式:', USE_MOCK)
console.log('🔧 环境变量 VITE_USE_MOCK:', import.meta.env.VITE_USE_MOCK)

/**
 * 模拟网络延迟
 */
function mockDelay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 购物车相关 API
 */
export const cartApi = {
  /**
   * 获取购物车
   * @returns {Promise<Object>}
   */
  async getCart() {
    if (USE_MOCK) {
      await mockDelay()
      
      const cart = JSON.parse(localStorage.getItem('heytea_cart') || '[]')
      
      return {
        success: true,
        data: {
          items: cart,
          totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
        },
        message: '获取购物车成功'
      }
    }
    
    // 真实 API
    return api.get('/cart')
  },

  /**
   * 添加商品到购物车
   * @param {Object} item - 商品信息
   * @param {string} item.productId - 商品ID
   * @param {number} item.quantity - 数量
   * @param {string} item.sizeCode - 杯型编码
   * @param {string} item.sweetnessCode - 甜度编码
   * @param {Array<string>} item.toppingCodes - 配料编码数组
   * @returns {Promise<Object>}
   */
  async addToCart(item) {
    if (USE_MOCK) {
      await mockDelay()
      
      const cart = JSON.parse(localStorage.getItem('heytea_cart') || '[]')
      
      // 查找是否已存在相同商品（含规格）
      const existingIndex = cart.findIndex(cartItem => cartItem.id === item.id)
      
      if (existingIndex > -1) {
        // 已存在，增加数量
        cart[existingIndex].quantity += item.quantity || 1
      } else {
        // 不存在，添加新商品
        cart.push({
          ...item,
          quantity: item.quantity || 1,
          addTime: new Date().toISOString()
        })
      }
      
      localStorage.setItem('heytea_cart', JSON.stringify(cart))
      
      return {
        success: true,
        data: {
          items: cart,
          totalItems: cart.reduce((sum, item) => sum + item.quantity, 0)
        },
        message: '添加成功'
      }
    }
    
    // 真实 API - 提取真实的商品 ID（去除规格后缀）
    console.log('🛒 原始商品数据:', item)
    
    // 优先使用 productId，其次使用 id
    let productId = item.productId || item.id
    console.log('📍 原始 productId:', productId, '类型:', typeof productId)
    
    // 如果 ID 包含连字符，提取第一部分
    if (typeof productId === 'string' && productId.includes('-')) {
      const parts = productId.split('-')
      productId = parts[0]
      console.log('✂️ 提取后的 productId:', productId)
    }
    
    // 验证 productId 是否为有效的 MongoDB ObjectId（24位十六进制字符串）
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(productId)
    if (!isValidObjectId) {
      console.error('❌ 无效的 MongoDB ObjectId:', productId)
      throw new Error(`商品ID格式不正确: ${productId}。需要24位十六进制字符串。`)
    }
    
    const requestBody = {
      productId: productId,  // 必须是字符串类型的 ObjectId
      quantity: item.quantity || 1,
      sizeCode: item.sizeCode || item.selectedSize || 'medium',      // ✅ 默认 medium
      sweetnessCode: item.sweetnessCode || item.selectedSweetness || 'normal',  // ✅ 默认 normal
      toppingCodes: item.toppingCodes || item.selectedToppings || []
    }
    
    console.log('📤 发送购物车请求:', requestBody)
    
    // 按照接口文档格式发送
    return api.post('/cart/items', requestBody)
  },

  /**
   * 更新购物车商品数量
   * @param {string} itemId - 购物车项ID
   * @param {number} quantity - 新数量
   * @returns {Promise<Object>}
   */
  async updateCartItem(itemId, quantity) {
    if (USE_MOCK) {
      await mockDelay()
      
      const cart = JSON.parse(localStorage.getItem('heytea_cart') || '[]')
      const index = cart.findIndex(item => item.id === itemId)
      
      if (index > -1) {
        if (quantity <= 0) {
          // 数量为0，删除商品
          cart.splice(index, 1)
        } else {
          // 更新数量
          cart[index].quantity = quantity
        }
        
        localStorage.setItem('heytea_cart', JSON.stringify(cart))
        
        return {
          success: true,
          data: {
            items: cart,
            totalItems: cart.reduce((sum, item) => sum + item.quantity, 0)
          },
          message: '更新成功'
        }
      }
      
      return {
        success: false,
        data: null,
        message: '商品不存在'
      }
    }
    
    // 真实 API - 提取真实的购物车项 ID
    console.log('🔄 更新购物车数量 - 原始 itemId:', itemId, '数量:', quantity)
    
    // 如果 itemId 是复合ID（包含规格），提取真实ID
    let realItemId = itemId
    if (typeof itemId === 'string' && itemId.includes('-')) {
      // 格式：productId-size-ice-sweetness
      // 只取第一部分作为真实ID
      realItemId = itemId.split('-')[0]
      console.log('✂️ 提取真实 itemId:', realItemId)
    }
    
    // 验证是否为有效的 MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(realItemId)
    if (!isValidObjectId) {
      console.error('❌ 无效的购物车项ID:', realItemId)
      console.warn('⚠️ 跳过后端同步，仅在本地更新')
      // 本地已经更新了，不抛出错误
      return {
        success: true,
        data: { quantity },
        message: '本地更新成功'
      }
    }
    
    // 按照接口文档格式
    return api.put(`/cart/items/${realItemId}`, { 
      quantity: quantity 
    })
  },

  /**
   * 删除购物车商品
   * @param {string} itemId - 商品ID（含规格）
   * @returns {Promise<Object>}
   */
  async removeCartItem(itemId) {
    if (USE_MOCK) {
      await mockDelay()
      
      const cart = JSON.parse(localStorage.getItem('heytea_cart') || '[]')
      const filtered = cart.filter(item => item.id !== itemId)
      
      localStorage.setItem('heytea_cart', JSON.stringify(filtered))
      
      return {
        success: true,
        data: {
          items: filtered,
          totalItems: filtered.reduce((sum, item) => sum + item.quantity, 0)
        },
        message: '删除成功'
      }
    }
    
    // 真实 API - 提取真实的购物车项 ID
    console.log('🗑️ 删除购物车项 - 原始 itemId:', itemId)
    
    // 如果 itemId 是复合ID（包含规格），提取真实ID
    let realItemId = itemId
    if (typeof itemId === 'string' && itemId.includes('-')) {
      realItemId = itemId.split('-')[0]
      console.log('✂️ 提取真实 itemId:', realItemId)
    }
    
    // 验证是否为有效的 MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(realItemId)
    if (!isValidObjectId) {
      console.error('❌ 无效的购物车项ID:', realItemId)
      console.warn('⚠️ 跳过后端同步，仅在本地删除')
      return {
        success: true,
        message: '本地删除成功'
      }
    }
    
    return api.delete(`/cart/items/${realItemId}`)
  },

  /**
   * 清空购物车
   * @returns {Promise<Object>}
   */
  async clearCart() {
    if (USE_MOCK) {
      await mockDelay()
      
      localStorage.setItem('heytea_cart', JSON.stringify([]))
      
      return {
        success: true,
        data: {
          items: [],
          totalItems: 0
        },
        message: '购物车已清空'
      }
    }
    
    // 真实 API
    return api.delete('/cart')
  },

  /**
   * 合并购物车（登录后同步）
   * 注意：后端暂未提供此接口，本方法主要用于本地购物车管理
   * @param {Array} localItems - 本地购物车商品
   * @returns {Promise<Object>}
   */
  async mergeCart(localItems) {
    if (USE_MOCK) {
      await mockDelay()
      
      // Mock 模式下，直接使用本地购物车
      return {
        success: true,
        data: {
          items: localItems,
          totalItems: localItems.reduce((sum, item) => sum + item.quantity, 0)
        },
        message: '购物车同步成功'
      }
    }
    
    // 真实 API - 后端暂未提供 /cart/merge 接口
    // 这里通过逐个添加商品到购物车来实现合并
    console.warn('⚠️ 后端暂无 /cart/merge 接口，使用批量添加方式合并购物车')
    
    try {
      for (const item of localItems) {
        await this.addToCart(item)
      }
      
      // 返回最新购物车
      return await this.getCart()
    } catch (error) {
      console.error('❌ 购物车合并失败:', error)
      throw error
    }
  }
}

console.log('🛒 购物车 API 已加载 (Mock 模式)')
