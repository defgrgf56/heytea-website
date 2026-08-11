import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrderStore = defineStore('order', () => {
  // 订单列表
  const orders = ref([])
  
  // 获取当前用户的订单存储 key
  function getStorageKey() {
    const userStore = JSON.parse(localStorage.getItem('user') || '{}')
    const userId = userStore.user?.id || userStore.user?.username || 'guest'
    return `heytea_orders_${userId}`
  }
  
  // 加载订单（从 localStorage，按用户隔离）
  function loadOrders() {
    const key = getStorageKey()
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        orders.value = JSON.parse(stored)
        console.log(`📦 从本地加载订单: ${orders.value.length} 个订单 (key: ${key})`)
      } catch (error) {
        console.error('加载订单失败:', error)
        orders.value = []
      }
    } else {
      orders.value = []
    }
  }
  
  // 保存订单（到 localStorage，按用户隔离）
  function saveOrders() {
    const key = getStorageKey()
    localStorage.setItem(key, JSON.stringify(orders.value))
    console.log(`💾 订单已保存到本地: ${orders.value.length} 个订单 (key: ${key})`)
  }
  
  // 清空订单（用户登出时调用）
  function clearOrders() {
    orders.value = []
    const key = getStorageKey()
    localStorage.removeItem(key)
    console.log(`🗑️ 已清空订单缓存 (key: ${key})`)
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
      
      console.log('📦 原始订单数据:', response)
      console.log('📍 地址对象:', response?.address)
      console.log('📍 地址类型:', typeof response?.address)
      console.log('📍 地址键名:', response?.address ? Object.keys(response.address) : '无地址')
      
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
  
  // 获取订单列表（从 API，这是主要数据源）
  async function fetchOrders(params = {}) {
    try {
      const { orderApi } = await import('@/api')
      const response = await orderApi.getOrders(params)
      
      if (response && response.list) {
        // ⚠️ 重要：订单数据应该完全从服务器获取，不要混合本地缓存
        orders.value = response.list
        saveOrders()  // 保存到本地作为缓存
        console.log(`✅ 从服务器加载订单: ${orders.value.length} 个订单`)
        return response
      }
      
      return { list: [], total: 0 }
    } catch (error) {
      console.error('获取订单列表失败:', error)
      // 失败时使用本地缓存（离线模式）
      loadOrders()
      console.log(`⚠️ 使用本地缓存: ${orders.value.length} 个订单`)
      return { list: orders.value, total: orders.value.length }
    }
  }
  
  // ⚠️ 不要在初始化时自动加载本地缓存
  // 订单数据应该在用户登录后从服务器获取
  // loadOrders()
  
  return {
    orders,
    createOrder,
    getOrderById,
    fetchOrderDetail,
    cancelOrder,
    reorder,
    fetchOrders,
    loadOrders,
    clearOrders,  // 新增：清空订单
    loadOrdersFromStorage: loadOrders  // 别名，兼容 Profile 页面
  }
})
