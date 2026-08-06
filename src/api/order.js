import { api } from './index'

// 🎭 Mock 模式开关（从环境变量读取）
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 模拟网络延迟
 */
function mockDelay(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 生成订单号
 */
function generateOrderNo() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000000).toString().padStart(7, '0')
  return `HT${year}${month}${day}${random}`
}

/**
 * 订单相关 API
 */
export const orderApi = {
  /**
   * 创建订单
   * @param {Object} orderData - 订单数据
   * @returns {Promise<Object>}
   */
  async createOrder(orderData) {
    if (USE_MOCK) {
      await mockDelay()
      
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      
      const newOrder = {
        id: Date.now(),
        orderNo: generateOrderNo(),
        status: 'pending', // pending/confirmed/preparing/completed/cancelled
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        deliveryFee: orderData.deliveryFee || 5,
        address: orderData.address,
        remark: orderData.remark || '',
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      }
      
      orders.unshift(newOrder) // 添加到开头
      localStorage.setItem('orders', JSON.stringify(orders))
      
      // 清空购物车
      localStorage.setItem('cart', JSON.stringify([]))
      
      return {
        success: true,
        data: newOrder,
        message: '订单创建成功'
      }
    }
    
    // 真实 API
    return api.post('/orders', orderData)
  },

  /**
   * 获取订单列表
   * @param {Object} params - 查询参数
   * @param {string} params.status - 订单状态
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @returns {Promise<Object>}
   */
  async getOrders(params = {}) {
    if (USE_MOCK) {
      await mockDelay()
      
      let orders = JSON.parse(localStorage.getItem('orders') || '[]')
      
      // 按状态过滤
      if (params.status && params.status !== 'all') {
        orders = orders.filter(o => o.status === params.status)
      }
      
      // 分页
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const total = orders.length
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const items = orders.slice(start, end)
      
      return {
        success: true,
        data: {
          items,
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize)
        },
        message: '获取订单列表成功'
      }
    }
    
    // 真实 API
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/orders?${queryString}`)
  },

  /**
   * 获取订单详情
   * @param {number} orderId - 订单 ID
   * @returns {Promise<Object>}
   */
  async getOrderDetail(orderId) {
    if (USE_MOCK) {
      await mockDelay()
      
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      const order = orders.find(o => o.id === parseInt(orderId))
      
      if (order) {
        return {
          success: true,
          data: order,
          message: '获取订单详情成功'
        }
      }
      
      return {
        success: false,
        data: null,
        message: '订单不存在'
      }
    }
    
    // 真实 API
    return api.get(`/orders/${orderId}`)
  },

  /**
   * 取消订单
   * @param {number} orderId - 订单 ID
   * @returns {Promise<Object>}
   */
  async cancelOrder(orderId) {
    if (USE_MOCK) {
      await mockDelay()
      
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      const index = orders.findIndex(o => o.id === parseInt(orderId))
      
      if (index > -1) {
        // 只有待支付和已确认状态可以取消
        if (['pending', 'confirmed'].includes(orders[index].status)) {
          orders[index].status = 'cancelled'
          orders[index].updateTime = new Date().toISOString()
          
          localStorage.setItem('orders', JSON.stringify(orders))
          
          return {
            success: true,
            data: orders[index],
            message: '订单已取消'
          }
        }
        
        return {
          success: false,
          data: null,
          message: '当前状态不能取消订单'
        }
      }
      
      return {
        success: false,
        data: null,
        message: '订单不存在'
      }
    }
    
    // 真实 API
    return api.put(`/orders/${orderId}/cancel`)
  },

  /**
   * 再来一单（重新下单）
   * @param {number} orderId - 原订单 ID
   * @returns {Promise<Object>}
   */
  async reorder(orderId) {
    if (USE_MOCK) {
      await mockDelay()
      
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      const originalOrder = orders.find(o => o.id === parseInt(orderId))
      
      if (!originalOrder) {
        return {
          success: false,
          data: null,
          message: '原订单不存在'
        }
      }
      
      // 将原订单商品添加到购物车
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')
      
      originalOrder.items.forEach(item => {
        cartItems.push({
          ...item,
          cartItemId: Date.now() + Math.random(), // 生成新的购物车 ID
          quantity: item.quantity
        })
      })
      
      localStorage.setItem('cart', JSON.stringify(cartItems))
      
      return {
        success: true,
        data: cartItems,
        message: '商品已添加到购物车'
      }
    }
    
    // 真实 API
    return api.post(`/orders/${orderId}/reorder`)
  },

  /**
   * 更新订单状态（管理员功能，仅供测试）
   * @param {number} orderId - 订单 ID
   * @param {string} status - 新状态
   * @returns {Promise<Object>}
   */
  async updateOrderStatus(orderId, status) {
    if (USE_MOCK) {
      await mockDelay()
      
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      const index = orders.findIndex(o => o.id === parseInt(orderId))
      
      if (index > -1) {
        orders[index].status = status
        orders[index].updateTime = new Date().toISOString()
        
        localStorage.setItem('orders', JSON.stringify(orders))
        
        return {
          success: true,
          data: orders[index],
          message: '订单状态已更新'
        }
      }
      
      return {
        success: false,
        data: null,
        message: '订单不存在'
      }
    }
    
    // 真实 API（需要管理员权限）
    return api.put(`/orders/${orderId}/status`, { status })
  }
}

// 开发工具：模拟订单状态变化
window.mockOrderProgress = function(orderId) {
  const statuses = ['pending', 'confirmed', 'preparing', 'completed']
  let currentIndex = 0
  
  const interval = setInterval(async () => {
    if (currentIndex >= statuses.length) {
      clearInterval(interval)
      console.log('✅ 订单流程完成')
      return
    }
    
    const status = statuses[currentIndex]
    await orderApi.updateOrderStatus(orderId, status)
    console.log(`📦 订单状态更新为: ${status}`)
    currentIndex++
  }, 3000) // 每3秒更新一次状态
}

console.log('📦 订单 API 已加载 (Mock 模式)')
console.log('💡 开发工具: window.mockOrderProgress(orderId) - 模拟订单状态变化')
