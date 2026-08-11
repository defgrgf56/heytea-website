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
 * ✅ 重构后：完全使用后端购物车数据结构和ID
 */
export const cartApi = {
  /**
   * 获取购物车
   * @returns {Promise<Object>} 返回购物车数据 { items, totalItems, goodsAmount, totalPrice }
   */
  async getCart() {
    if (USE_MOCK) {
      await mockDelay()
      
      const cart = JSON.parse(localStorage.getItem('heytea_cart') || '[]')
      
      return {
        items: cart,
        totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
        goodsAmount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      }
    }
    
    // 真实 API - 返回完整购物车数据
    return api.get('/cart')
  },

  /**
   * 添加商品到购物车
   * @param {Object} item - 商品信息
   * @param {string} item.productId - 商品ID（MongoDB ObjectId）
   * @param {number} item.quantity - 数量
   * @param {string} item.sizeCode - 杯型编码
   * @param {string} item.sweetnessCode - 甜度编码
   * @param {Array<string>} item.toppingCodes - 配料编码数组
   * @returns {Promise<Object>} 返回完整购物车数据
   */
  async addToCart(item) {
    if (USE_MOCK) {
      await mockDelay()
      
      const cart = JSON.parse(localStorage.getItem('heytea_cart') || '[]')
      
      // 查找是否已存在相同商品（含规格）
      const existingIndex = cart.findIndex(cartItem => cartItem.id === item.id)
      
      if (existingIndex > -1) {
        cart[existingIndex].quantity += item.quantity || 1
      } else {
        cart.push({
          ...item,
          quantity: item.quantity || 1,
          addTime: new Date().toISOString()
        })
      }
      
      localStorage.setItem('heytea_cart', JSON.stringify(cart))
      
      return {
        items: cart,
        totalItems: cart.reduce((sum, item) => sum + item.quantity, 0)
      }
    }
    
    // 真实 API - 构建请求体
    const requestBody = {
      productId: item.productId || item.id,  // 商品ID
      quantity: item.quantity || 1,
      sizeCode: item.sizeCode || item.selectedSize || 'medium',
      sweetnessCode: item.sweetnessCode || item.selectedSweetness || 'normal',
      toppingCodes: item.toppingCodes || item.selectedToppings || []
    }
    
    console.log('📤 添加到购物车:', requestBody)
    
    // 后端返回完整购物车数据（包含所有购物车项及其真实ID）
    const response = await api.post('/cart/items', requestBody)
    console.log('✅ 购物车更新:', response)
    
    return response
  },

  /**
   * 更新购物车商品数量
   * @param {string} itemId - 购物车项ID（后端返回的真实ID）
   * @param {number} quantity - 新数量
   * @returns {Promise<Object>} 返回完整购物车数据
   */
  async updateCartItem(itemId, quantity) {
    if (USE_MOCK) {
      await mockDelay()
      
      const cart = JSON.parse(localStorage.getItem('heytea_cart') || '[]')
      const index = cart.findIndex(item => item.id === itemId)
      
      if (index > -1) {
        if (quantity <= 0) {
          cart.splice(index, 1)
        } else {
          cart[index].quantity = quantity
        }
        
        localStorage.setItem('heytea_cart', JSON.stringify(cart))
        
        return {
          items: cart,
          totalItems: cart.reduce((sum, item) => sum + item.quantity, 0)
        }
      }
      
      throw new Error('商品不存在')
    }
    
    // 真实 API - 直接使用后端返回的购物车项ID
    console.log('🔄 更新购物车数量 - itemId:', itemId, 'quantity:', quantity)
    
    const response = await api.put(`/cart/items/${itemId}`, { quantity })
    console.log('✅ 购物车更新:', response)
    
    return response
  },

  /**
   * 删除购物车商品
   * @param {string} itemId - 购物车项ID（后端返回的真实ID）
   * @returns {Promise<Object>} 返回完整购物车数据
   */
  async removeCartItem(itemId) {
    if (USE_MOCK) {
      await mockDelay()
      
      const cart = JSON.parse(localStorage.getItem('heytea_cart') || '[]')
      const filtered = cart.filter(item => item.id !== itemId)
      
      localStorage.setItem('heytea_cart', JSON.stringify(filtered))
      
      return {
        items: filtered,
        totalItems: filtered.reduce((sum, item) => sum + item.quantity, 0)
      }
    }
    
    // 真实 API - 直接使用后端返回的购物车项ID
    console.log('🗑️ 删除购物车项 - itemId:', itemId)
    
    const response = await api.delete(`/cart/items/${itemId}`)
    console.log('✅ 购物车更新:', response)
    
    return response
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
        items: [],
        totalItems: 0
      }
    }
    
    // 真实 API
    const response = await api.delete('/cart')
    console.log('✅ 购物车已清空')
    
    return response
  }
}

console.log('🛒 购物车 API 已加载')
