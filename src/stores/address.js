import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { addressApi } from '@/api'

export const useAddressStore = defineStore('address', () => {
  // 地址列表
  const addresses = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  // 计算属性：默认地址
  const defaultAddress = computed(() => {
    return addresses.value.find(addr => addr.isDefault) || addresses.value[0] || null
  })
  
  /**
   * 从后端加载地址列表
   */
  async function fetchAddresses() {
    isLoading.value = true
    error.value = null
    
    try {
      const data = await addressApi.getAddresses()
      addresses.value = data || []
      console.log('✅ 地址列表加载成功:', addresses.value.length, '个地址')
      return addresses.value
    } catch (err) {
      console.error('❌ 加载地址列表失败:', err)
      error.value = err.message
      // 失败时不清空现有数据
      return addresses.value
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * 获取默认地址
   */
  async function fetchDefaultAddress() {
    try {
      const data = await addressApi.getDefaultAddress()
      if (data) {
        // 更新本地缓存中的默认地址
        const index = addresses.value.findIndex(addr => addr.id === data.id)
        if (index > -1) {
          addresses.value[index] = data
        } else {
          addresses.value.unshift(data)
        }
      }
      return data
    } catch (err) {
      console.error('❌ 获取默认地址失败:', err)
      return null
    }
  }
  
  /**
   * 添加地址
   * @param {Object} addressData - 地址数据
   */
  async function addAddress(addressData) {
    try {
      // ⚠️ 如果新地址设置为默认，需要先取消其他地址的默认状态
      if (addressData.isDefault && addresses.value.length > 0) {
        console.log('⚠️ 新地址设为默认，将取消其他地址的默认状态')
        // 后端会自动处理，这里只需要更新本地状态
      }
      
      const newAddress = await addressApi.addAddress(addressData)
      
      // 如果新地址是默认地址，取消本地其他地址的默认状态
      if (newAddress.isDefault) {
        addresses.value.forEach(addr => {
          addr.isDefault = false
        })
      }
      
      // 添加到本地列表
      addresses.value.unshift(newAddress)
      
      console.log('✅ 地址添加成功:', newAddress)
      return { success: true, data: newAddress }
    } catch (err) {
      console.error('❌ 添加地址失败:', err)
      error.value = err.message
      return { success: false, message: err.message }
    }
  }
  
  /**
   * 更新地址
   * @param {string} id - 地址 ID
   * @param {Object} addressData - 新地址数据
   */
  async function updateAddress(id, addressData) {
    try {
      // ⚠️ 如果地址设置为默认，需要先取消其他地址的默认状态
      if (addressData.isDefault) {
        console.log('⚠️ 地址设为默认，将取消其他地址的默认状态')
        // 后端会自动处理，这里只需要更新本地状态
      }
      
      const updatedAddress = await addressApi.updateAddress(id, addressData)
      
      // 如果更新后的地址是默认地址，取消本地其他地址的默认状态
      if (updatedAddress.isDefault) {
        addresses.value.forEach(addr => {
          if (addr.id !== id) {
            addr.isDefault = false
          }
        })
      }
      
      // 更新本地列表
      const index = addresses.value.findIndex(addr => addr.id === id)
      if (index > -1) {
        addresses.value[index] = updatedAddress
      }
      
      console.log('✅ 地址更新成功:', updatedAddress)
      return { success: true, data: updatedAddress }
    } catch (err) {
      console.error('❌ 更新地址失败:', err)
      error.value = err.message
      return { success: false, message: err.message }
    }
  }
  
  /**
   * 删除地址
   * @param {string} id - 地址 ID
   */
  async function deleteAddress(id) {
    try {
      await addressApi.deleteAddress(id)
      
      // 从本地列表删除
      const index = addresses.value.findIndex(addr => addr.id === id)
      if (index > -1) {
        addresses.value.splice(index, 1)
      }
      
      console.log('✅ 地址删除成功')
      return { success: true }
    } catch (err) {
      console.error('❌ 删除地址失败:', err)
      error.value = err.message
      return { success: false, message: err.message }
    }
  }
  
  /**
   * 设置默认地址
   * @param {string} id - 地址 ID
   */
  async function setDefaultAddress(id) {
    try {
      const updatedAddress = await addressApi.setDefaultAddress(id)
      
      // 更新本地列表：取消其他地址的默认状态
      addresses.value.forEach(addr => {
        addr.isDefault = (addr.id === id)
      })
      
      // 更新被设置为默认的地址
      const index = addresses.value.findIndex(addr => addr.id === id)
      if (index > -1) {
        addresses.value[index] = updatedAddress
      }
      
      console.log('✅ 默认地址设置成功')
      return { success: true, data: updatedAddress }
    } catch (err) {
      console.error('❌ 设置默认地址失败:', err)
      error.value = err.message
      return { success: false, message: err.message }
    }
  }
  
  /**
   * 根据 ID 获取地址
   * @param {string} id - 地址 ID
   */
  function getAddressById(id) {
    return addresses.value.find(addr => addr.id === id) || null
  }
  
  /**
   * 清空地址数据（用户登出时调用）
   */
  function clearAddresses() {
    addresses.value = []
    isLoading.value = false
    error.value = null
    console.log('🗑️ 地址数据已清空')
  }
  
  return {
    // 状态
    addresses,
    isLoading,
    error,
    // 计算属性
    defaultAddress,
    // 方法
    fetchAddresses,
    fetchDefaultAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getAddressById,
    clearAddresses  // 新增：清空地址
  }
})
