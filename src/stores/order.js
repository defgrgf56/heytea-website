import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrderStore = defineStore('order', () => {
  // 订单列表
  const orders = ref([])
  
  // 加载订单（从 localStorage）
  function loadOrders() {
    const stored = localStorage.getItem('heytea_orders')
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
    localStorage.setItem('heytea_orders', JSON.stringify(orders.value))
  }
  
  // 创建订单
  function createOrder(orderData) {
    const newOrder = {
      id: Date.now(),
      orderNo: `HT${Date.now()}`,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      status: 'pending', // pending, confirmed, preparing, completed, cancelled
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    }
    
    orders.value.unshift(newOrder)
    saveOrders()
    return newOrder
  }
  
  // 获取订单详情
  function getOrderById(orderId) {
    return orders.value.find(order => order.id === orderId)
  }
  
  // 取消订单
  function cancelOrder(orderId) {
    const order = getOrderById(orderId)
    if (order && order.status === 'pending') {
      order.status = 'cancelled'
      order.updateTime = new Date().toISOString()
      saveOrders()
      return true
    }
    return false
  }
  
  // 重新下单
  function reorder(orderId) {
    const order = getOrderById(orderId)
    if (order) {
      return createOrder({
        items: order.items,
        totalAmount: order.totalAmount
      })
    }
    return null
  }
  
  // 初始化时加载订单
  loadOrders()
  
  return {
    orders,
    createOrder,
    getOrderById,
    cancelOrder,
    reorder,
    loadOrders
  }
})
