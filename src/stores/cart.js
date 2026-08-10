import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const CART_STORAGE_KEY = 'heytea_cart'

export const useCartStore = defineStore('cart', () => {
  // 状态 - 从 localStorage 初始化
  const items = ref(loadCartFromStorage())
  const syncEnabled = ref(false) // 是否启用后端同步（登录后启用）

  // 计算属性
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const cartCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const cartTotal = computed(() => {
    return items.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })
  
  const totalPrice = computed(() => {
    return cartTotal.value.toFixed(2)
  })

  // 监听购物车变化，自动保存到 localStorage
  watch(
    items,
    (newItems) => {
      saveCartToStorage(newItems)
    },
    { deep: true }
  )

  // 方法
  const addItem = async (product) => {
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      // ✅ 累加用户选择的数量，而不是固定加1
      existingItem.quantity += (product.quantity || 1)
    } else {
      items.value.push({
        ...product,
        quantity: product.quantity || 1
      })
    }

    // 同步到后端（如果已登录）
    if (syncEnabled.value) {
      try {
        const { cartApi } = await import('@/api')
        await cartApi.addToCart(product)
      } catch (error) {
        console.warn('⚠️ 购物车同步失败（已保存到本地）:', error.message)
      }
    }
  }

  const removeItem = async (productId) => {
    const index = items.value.findIndex(item => item.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
    }

    // 同步到后端（如果已登录）
    if (syncEnabled.value) {
      try {
        const { cartApi } = await import('@/api')
        await cartApi.removeCartItem(productId)
      } catch (error) {
        console.warn('⚠️ 购物车同步失败（已从本地删除）:', error.message)
      }
    }
  }

  const updateQuantity = async (productId, quantity) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      item.quantity = Math.max(0, quantity)
      if (item.quantity === 0) {
        await removeItem(productId)
        return
      }
    }

    // 同步到后端（如果已登录）
    if (syncEnabled.value) {
      try {
        const { cartApi } = await import('@/api')
        await cartApi.updateCartItem(productId, quantity)
      } catch (error) {
        console.warn('⚠️ 购物车同步失败（已在本地更新）:', error.message)
      }
    }
  }

  const clearCart = async () => {
    items.value = []

    // 同步到后端（如果已登录）
    if (syncEnabled.value) {
      try {
        const { cartApi } = await import('@/api')
        await cartApi.clearCart()
      } catch (error) {
        console.warn('⚠️ 购物车同步失败（已清空本地）:', error.message)
      }
    }
  }

  // 从服务器加载购物车（登录后调用）
  const syncFromServer = async () => {
    try {
      const { cartApi } = await import('@/api')
      const response = await cartApi.getCart()
      
      if (response && response.items) {
        // 如果本地有购物车，需要合并
        if (items.value.length > 0) {
          await mergeWithServer(response.items)
        } else {
          // 本地为空，直接使用服务器数据
          items.value = response.items
          console.log('🔄 已从服务器加载购物车:', items.value.length, '件商品')
        }
      }
      
      // 启用后端同步
      syncEnabled.value = true
    } catch (error) {
      console.error('❌ 同步购物车失败:', error)
      // 即使同步失败，仍然使用本地购物车
      syncEnabled.value = false
    }
  }

  // 合并本地和服务器购物车
  const mergeWithServer = async (serverItems) => {
    if (!serverItems || serverItems.length === 0) {
      // 服务器为空，将本地购物车上传
      try {
        const { cartApi } = await import('@/api')
        await cartApi.mergeCart(items.value)
        console.log('🔄 已将本地购物车同步到服务器')
      } catch (error) {
        console.warn('⚠️ 合并购物车失败:', error.message)
      }
      return
    }

    // 合并逻辑：相同商品取较大数量
    const merged = [...items.value]
    
    serverItems.forEach(serverItem => {
      const localIndex = merged.findIndex(item => item.id === serverItem.id)
      if (localIndex > -1) {
        // 本地已存在，取较大数量
        merged[localIndex].quantity = Math.max(merged[localIndex].quantity, serverItem.quantity)
      } else {
        // 本地不存在，添加
        merged.push(serverItem)
      }
    })

    items.value = merged
    console.log('🔄 购物车合并完成:', items.value.length, '件商品')

    // 将合并结果同步到服务器
    try {
      const { cartApi } = await import('@/api')
      await cartApi.mergeCart(items.value)
    } catch (error) {
      console.warn('⚠️ 合并后同步失败:', error.message)
    }
  }

  // 禁用后端同步（退出登录时调用）
  const disableSync = () => {
    syncEnabled.value = false
    console.log('🔒 购物车后端同步已禁用')
  }

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

// 从 localStorage 加载购物车
function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      console.log('🛒 从本地恢复购物车:', parsed.length, '件商品')
      return parsed
    }
  } catch (error) {
    console.error('❌ 加载购物车失败:', error)
  }
  return []
}

// 保存购物车到 localStorage
function saveCartToStorage(items) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    console.log('💾 购物车已保存:', items.length, '件商品')
  } catch (error) {
    console.error('❌ 保存购物车失败:', error)
  }
}
