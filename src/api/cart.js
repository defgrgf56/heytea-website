import { api } from './index'

// 🎭 Mock 模式开关
const USE_MOCK = true

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
   * 获取购物车列表
   * @returns {Promise<Object>}
   */
  async getCart() {
    if (USE_MOCK) {
      await mockDelay()
      
      // Mock 数据从 localStorage 读取
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')
      
      return {
        success: true,
        data: {
          items: cartItems,
          totalPrice: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
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
   * @returns {Promise<Object>}
   */
  async addItem(item) {
    if (USE_MOCK) {
      await mockDelay()
      
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')
      
      // 检查是否已存在相同规格的商品
      const existingIndex = cartItems.findIndex(
        i => i.id === item.id && 
        i.selectedSize === item.selectedSize &&
        JSON.stringify(i.selectedToppings) === JSON.stringify(item.selectedToppings) &&
        i.selectedSweetness === item.selectedSweetness
      )
      
      if (existingIndex > -1) {
        // 已存在，增加数量
        cartItems[existingIndex].quantity += item.quantity || 1
      } else {
        // 不存在，添加新项
        cartItems.push({
          ...item,
          cartItemId: Date.now(), // 生成唯一 ID
          quantity: item.quantity || 1
        })
      }
      
      localStorage.setItem('cart', JSON.stringify(cartItems))
      
      return {
        success: true,
        data: cartItems,
        message: '添加成功'
      }
    }
    
    // 真实 API
    return api.post('/cart/items', {
      productId: item.id,
      quantity: item.quantity || 1,
      size: item.selectedSize,
      toppings: item.selectedToppings,
      sweetness: item.selectedSweetness
    })
  },

  /**
   * 更新购物车商品数量
   * @param {string} cartItemId - 购物车项 ID
   * @param {number} quantity - 新数量
   * @returns {Promise<Object>}
   */
  async updateQuantity(cartItemId, quantity) {
    if (USE_MOCK) {
      await mockDelay()
      
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')
      const index = cartItems.findIndex(i => i.cartItemId === cartItemId)
      
      if (index > -1) {
        if (quantity <= 0) {
          // 数量为 0，删除该项
          cartItems.splice(index, 1)
        } else {
          cartItems[index].quantity = quantity
        }
        
        localStorage.setItem('cart', JSON.stringify(cartItems))
        
        return {
          success: true,
          data: cartItems,
          message: '更新成功'
        }
      }
      
      return {
        success: false,
        data: null,
        message: '商品不存在'
      }
    }
    
    // 真实 API
    return api.put(`/cart/items/${cartItemId}`, { quantity })
  },

  /**
   * 删除购物车商品
   * @param {string} cartItemId - 购物车项 ID
   * @returns {Promise<Object>}
   */
  async removeItem(cartItemId) {
    if (USE_MOCK) {
      await mockDelay()
      
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')
      const filteredItems = cartItems.filter(i => i.cartItemId !== cartItemId)
      
      localStorage.setItem('cart', JSON.stringify(filteredItems))
      
      return {
        success: true,
        data: filteredItems,
        message: '删除成功'
      }
    }
    
    // 真实 API
    return api.delete(`/cart/items/${cartItemId}`)
  },

  /**
   * 清空购物车
   * @returns {Promise<Object>}
   */
  async clearCart() {
    if (USE_MOCK) {
      await mockDelay()
      
      localStorage.setItem('cart', JSON.stringify([]))
      
      return {
        success: true,
        data: [],
        message: '购物车已清空'
      }
    }
    
    // 真实 API
    return api.delete('/cart')
  }
}

console.log('🛒 购物车 API 已加载 (Mock 模式)')
