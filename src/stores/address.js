import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAddressStore = defineStore('address', () => {
  // 地址列表
  const addresses = ref([])
  
  // 加载地址（从 localStorage）
  function loadAddresses() {
    const stored = localStorage.getItem('heytea_addresses')
    if (stored) {
      try {
        addresses.value = JSON.parse(stored)
      } catch (error) {
        console.error('加载地址失败:', error)
      }
    }
  }
  
  // 保存地址（到 localStorage）
  function saveAddresses() {
    localStorage.setItem('heytea_addresses', JSON.stringify(addresses.value))
  }
  
  // 添加地址
  function addAddress(addressData) {
    const newAddress = {
      id: Date.now(),
      ...addressData,
      isDefault: addresses.value.length === 0 ? true : addressData.isDefault || false
    }
    
    // 如果设为默认，清除其他默认地址
    if (newAddress.isDefault) {
      addresses.value.forEach(addr => {
        addr.isDefault = false
      })
    }
    
    addresses.value.unshift(newAddress)
    saveAddresses()
    return newAddress
  }
  
  // 更新地址
  function updateAddress(id, addressData) {
    const index = addresses.value.findIndex(addr => addr.id === id)
    if (index > -1) {
      // 如果设为默认，清除其他默认地址
      if (addressData.isDefault) {
        addresses.value.forEach(addr => {
          addr.isDefault = false
        })
      }
      
      addresses.value[index] = {
        ...addresses.value[index],
        ...addressData
      }
      saveAddresses()
      return true
    }
    return false
  }
  
  // 删除地址
  function deleteAddress(id) {
    const index = addresses.value.findIndex(addr => addr.id === id)
    if (index > -1) {
      const wasDefault = addresses.value[index].isDefault
      addresses.value.splice(index, 1)
      
      // 如果删除的是默认地址，设置第一个为默认
      if (wasDefault && addresses.value.length > 0) {
        addresses.value[0].isDefault = true
      }
      
      saveAddresses()
      return true
    }
    return false
  }
  
  // 设置默认地址
  function setDefaultAddress(id) {
    addresses.value.forEach(addr => {
      addr.isDefault = addr.id === id
    })
    saveAddresses()
  }
  
  // 获取默认地址
  function getDefaultAddress() {
    return addresses.value.find(addr => addr.isDefault) || null
  }
  
  // 初始化时加载地址
  loadAddresses()
  
  return {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress,
    loadAddresses
  }
})
