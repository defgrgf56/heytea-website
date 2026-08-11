import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartApi } from '@/api/cart'

const CART_STORAGE_KEY = 'heytea_cart'

export const useCartStore = defineStore('cart', () => {
  // 状态 - 购物车项（使用后端返回的完整数据结构）
  const items = ref([])
  const syncEnabled = ref(false) // 是否启用后端同步（登录后启用）

  // 计算属性
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const cartCount = computed(() => {
    return totalItems.value
  })

  const cartTotal = computed(() => {
    return items.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })
  
  const totalPrice = computed(() => {
    return cartTotal.value.toFixed(2)
  })

  /**
   * 添加商品到购物车
   * ✅ 重构：调用后端API，使用返回的购物车数据更新本地状态
   */
  const addItem = async (product) => {
    console.log('🛒 添加商品到购物车:', product)
    
    try {
      // 如果启用了后端同步（已登录），调用后端API
      if (syncEnabled.value) {
        const response = await cartApi.addToCart(product)
        
        // 使用后端返回的完整购物车数据更新本地状态
        if (response && response.items) {
          items.value = response.items
          saveCartToStorage(items.value)
          console.log('✅ 购物车已更新（来自后端）:', items.value.length, '件商品')
        }
      } else {
        // 未登录，使用本地购物车
        const existingItem = items.value.find(item => 
          item.productId === product.productId &&
          item.sizeCode === product.sizeCode &&
          item.sweetnessCode === product.sweetnessCode &&
          JSON.stringify(item.toppingCodes || []) === JSON.stringify(product.toppingCodes || [])
        )
        
        if (existingItem) {
          existingItem.quantity += (product.quantity || 1)
        } else {
          items.value.push({
            id: `${product.productId}-${Date.now()}`, // 临时本地ID
            ...product,
            quantity: product.quantity || 1
          })
        }
        
        saveCartToStorage(items.value)
        console.log('✅ 购物车已更新（本地）:', items.value.length, '件商品')
      }
    } catch (error) {
      console.error('❌ 添加到购物车失败:', error)
      throw error
    }
  }

  /**
   * 更新购物车商品数量
   * ✅ 重构：使用后端返回的购物车项ID
   */
  const updateQuantity = async (itemId, quantity) => {
    console.log('🔄 更新购物车数量 - itemId:', itemId, 'quantity:', quantity)
    
    try {
      if (quantity <= 0) {
        await removeItem(itemId)
        return
      }
      
      // 先更新本地状态（立即反馈）
      const item = items.value.find(item => item.id === itemId)
      if (item) {
        item.quantity = quantity
      }
      
      // 如果启用了后端同步，调用后端API
      if (syncEnabled.value) {
        const response = await cartApi.updateCartItem(itemId, quantity)
        
        // 使用后端返回的完整购物车数据更新本地状态
        if (response && response.items) {
          items.value = response.items
          saveCartToStorage(items.value)
          console.log('✅ 购物车数量已更新（来自后端）')
        }
      } else {
        // 未登录，只更新本地
        saveCartToStorage(items.value)
        console.log('✅ 购物车数量已更新（本地）')
      }
    } catch (error) {
      console.error('❌ 更新购物车数量失败:', error)
      // 失败时恢复原状态
      await syncFromServer()
    }
  }

  /**
   * 删除购物车商品
   * ✅ 重构：使用后端返回的购物车项ID
   */
  const removeItem = async (itemId) => {
    console.log('🗑️ 删除购物车项 - itemId:', itemId)
    
    try {
      // 先从本地删除（立即反馈）
      const index = items.value.findIndex(item => item.id === itemId)
      if (index > -1) {
        items.value.splice(index, 1)
      }
      
      // 如果启用了后端同步，调用后端API
      if (syncEnabled.value) {
        const response = await cartApi.removeCartItem(itemId)
        
        // 使用后端返回的完整购物车数据更新本地状态
        if (response && response.items) {
          items.value = response.items
          saveCartToStorage(items.value)
          console.log('✅ 购物车项已删除（来自后端）')
        }
      } else {
        // 未登录，只更新本地
        saveCartToStorage(items.value)
        console.log('✅ 购物车项已删除（本地）')
      }
    } catch (error) {
      console.error('❌ 删除购物车项失败:', error)
      // 失败时恢复原状态
      await syncFromServer()
    }
  }

  /**
   * 清空购物车
   */
  const clearCart = async () => {
    console.log('🗑️ 清空购物车')
    
    try {
      // 先清空本地状态
      items.value = []
      
      // 如果启用了后端同步，调用后端API
      if (syncEnabled.value) {
        await cartApi.clearCart()
        console.log('✅ 购物车已清空（后端）')
      }
      
      saveCartToStorage([])
      console.log('✅ 购物车已清空')
    } catch (error) {
      console.error('❌ 清空购物车失败:', error)
    }
  }

  /**
   * 从服务器加载购物车（登录后调用）
   * ✅ 重构：完整加载后端购物车并替换本地数据
   */
  const syncFromServer = async () => {
    console.log('🔄 从服务器同步购物车...')
    
    try {
      const response = await cartApi.getCart()
      
      if (response && response.items) {
        // 完全使用后端购物车数据（包含后端生成的真实ID）
        items.value = response.items
        saveCartToStorage(items.value)
        syncEnabled.value = true
        console.log('✅ 购物车同步完成:', items.value.length, '件商品')
      } else {
        items.value = []
        syncEnabled.value = true
        console.log('✅ 购物车为空')
      }
    } catch (error) {
      console.error('❌ 同步购物车失败:', error)
      // 同步失败时，使用本地缓存
      loadCartFromStorage()
      syncEnabled.value = false
    }
  }

  /**
   * 禁用后端同步（退出登录时调用）
   */
  const disableSync = () => {
    syncEnabled.value = false
    items.value = []
    saveCartToStorage([])
    console.log('🔒 购物车后端同步已禁用，已清空购物车')
  }

  /**
   * 从本地存储加载购物车
   */
  function loadCartFromStorage() {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        items.value = parsed
        console.log('🛒 从本地恢复购物车:', parsed.length, '件商品')
      }
    } catch (error) {
      console.error('❌ 加载购物车失败:', error)
      items.value = []
    }
  }

  /**
   * 保存购物车到本地存储
   */
  function saveCartToStorage(cartItems) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
      console.log('💾 购物车已保存:', cartItems.length, '件商品')
    } catch (error) {
      console.error('❌ 保存购物车失败:', error)
    }
  }

  // 初始化时从本地加载（未登录状态）
  loadCartFromStorage()

  return {
    items,
    totalItems,
    cartCount,
    cartTotal,
    totalPrice,
    syncEnabled,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    syncFromServer,
    disableSync
  }
})
