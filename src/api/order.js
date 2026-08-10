import { api } from './index'

/**
 * 生成客户端请求ID（用于防重复提交）
 */
function generateClientRequestId() {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 10)
  return `checkout-${timestamp}-${random}`
}

/**
 * 订单相关 API
 * 注意：订单接口始终调用真实后端 API，不使用 Mock 模式
 */
export const orderApi = {
  /**
   * 创建订单（从服务端购物车创建）
   * @param {Object} orderData - 订单数据
   * @param {string} orderData.addressId - 地址ID（必填，ObjectId格式）
   * @param {string} orderData.payMethod - 支付方式（必填，mock_wechat/mock_alipay）
   * @param {string} orderData.remark - 备注（可选）
   * @param {string} orderData.clientRequestId - 客户端请求ID（可选，8-80位，防重复提交）
   * @returns {Promise<Object>}
   */
  async createOrder(orderData) {
    console.log('📤 创建订单请求:', {
      addressId: orderData.addressId,
      payMethod: orderData.payMethod,
      remark: orderData.remark,
      clientRequestId: orderData.clientRequestId
    })
    
    // 真实 API - 按照接口文档规范
    // 注意：后端会从服务端购物车读取商品，不接收前端传递的商品列表
    const response = await api.post('/orders', {
      addressId: orderData.addressId,  // 必填，ObjectId格式
      payMethod: orderData.payMethod || 'mock_wechat',  // 必填（教学占位值）
      remark: orderData.remark || '',  // 可选
      clientRequestId: orderData.clientRequestId || generateClientRequestId()  // 防重复提交
    })
    
    console.log('✅ 订单创建成功:', response)
    return response
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
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/orders${queryString ? '?' + queryString : ''}`)
  },

  /**
   * 获取订单详情
   * @param {string} orderId - 订单 ID (ObjectId)
   * @returns {Promise<Object>}
   */
  async getOrderDetail(orderId) {
    return api.get(`/orders/${orderId}`)
  },

  /**
   * 取消订单（顾客端）
   * 只能取消 pending 或 confirmed 状态的订单
   * @param {string} orderId - 订单 ID
   * @returns {Promise<Object>}
   */
  async cancelOrder(orderId) {
    return api.put(`/orders/${orderId}/cancel`)
  },

  /**
   * 再来一单
   * 将历史订单中仍可购买的商品重新加入购物车
   * @param {string} orderId - 原订单 ID
   * @returns {Promise<Object>} 返回更新后的购物车和跳过的商品列表
   */
  async reorder(orderId) {
    return api.post(`/orders/${orderId}/reorder`)
  }
}

// 导出工具函数
export { generateClientRequestId }

console.log('📦 订单 API 已加载（真实后端模式）')
