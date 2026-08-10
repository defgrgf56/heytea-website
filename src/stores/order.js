import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrderStore = defineStore('order', () => {
  // 订单列表
  const orders = ref([])
  
  // 加载订单（从 localStorage）
  function loadOrders() {
    const stored = localStorage.getItem('orders')
    if (stored) {
      try {
        orders.value = JSON.parse(stored)
      } catch (error) {
        console.error('加载订单失败:', error)
      }
    }
  }
  
  // 保存订单（到 localStorage）
  function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders.value))
  }
  
  // 创建订单
  function createOrder(orderData) {
    const newOrder = {
      id: Date.now(),
      orderNo: `HT${Date.now()}`,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      deliveryFee: orderData.deliveryFee || 5,
      address: orderData.address,
      status: 'pending', // pending, confirmed, preparing, completed, cancelled
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    }
    
    orders.value.unshift(newOrder)
    saveOrders()
    return newOrder
  }
  
  // 获取订单详情（从本地）
  function getOrderById(orderId) {
    return orders.value.find(order => order.id === parseInt(orderId))
  }
  
  // 获取订单详情（从 API）
  async function fetchOrderDetail(orderId) {
    try {
      const { orderApi } = await import('@/api')
      const response = await orderApi.getOrderDetail(orderId)
      
      if (response) {
        // 更新本地缓存
        const index = orders.value.findIndex(o => o.id === orderId)
        if (index > -1) {
          orders.value[index] = response
        } else {
          orders.value.unshift(response)
        }
        saveOrders()
        return response
      }
      
      return null
    } catch (error) {
      console.error('获取订单详情失败:', error)
      // 失败时尝试从本地获取
      return getOrderById(orderId)
    }
  }
  
  // 取消订单
  async function cancelOrder(orderId) {
    try {
      const { orderApi } = await import('@/api')
      await orderApi.cancelOrder(orderId)
      
      // 更新本地缓存
      const order = getOrderById(orderId)
      if (order) {
        order.status = 'cancelled'
        order.updateTime = new Date().toISOString()
        saveOrders()
      }
      return true
    } catch (error) {
      console.error('取消订单失败:', error)
      throw error
    }
  }
  
  // 重新下单（再来一单）
  async function reorder(orderId) {
    try {
      const { orderApi } = await import('@/api')
      const response = await orderApi.reorder(orderId)
      
      // 后端会将商品添加到购物车，这里返回购物车数据
      return response
    } catch (error) {
      console.error('再来一单失败:', error)
      throw error
    }
  }
  
  // 获取订单列表（从 API）
  async function fetchOrders(params = {}) {
    try {
      const { orderApi } = await import('@/api')
      const response = await orderApi.getOrders(params)
      
      if (response && response.list) {
        orders.value = response.list
        saveOrders()
        return response
      }
      
      return null
    } catch (error) {
      console.error('获取订单列表失败:', error)
      // 失败时使用本地缓存
      loadOrders()
      return { list: orders.value, total: orders.value.length }
    }
  }
  
  // 初始化时加载订单
  loadOrders()
  
  return {
    orders,
    createOrder,
    getOrderById,
    fetchOrderDetail,
    cancelOrder,
    reorder,
    fetchOrders,
    loadOrders,
    loadOrdersFromStorage: loadOrders  // 别名，兼容 Profile 页面
  }
})
