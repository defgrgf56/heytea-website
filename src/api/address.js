import { api } from './index'

// 🎭 Mock 模式开关（从环境变量读取）
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 模拟网络延迟
 */
function mockDelay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 地址相关 API
 */
export const addressApi = {
  /**
   * 获取地址列表
   * @returns {Promise<Object>}
   */
  async getAddresses() {
    if (USE_MOCK) {
      await mockDelay()
      
      const addresses = JSON.parse(localStorage.getItem('addresses') || '[]')
      
      return {
        success: true,
        data: addresses,
        message: '获取地址列表成功'
      }
    }
    
    // 真实 API
    return api.get('/addresses')
  },

  /**
   * 获取地址详情
   * @param {number} addressId - 地址 ID
   * @returns {Promise<Object>}
   */
  async getAddressDetail(addressId) {
    if (USE_MOCK) {
      await mockDelay()
      
      const addresses = JSON.parse(localStorage.getItem('addresses') || '[]')
      const address = addresses.find(a => a.id === parseInt(addressId))
      
      if (address) {
        return {
          success: true,
          data: address,
          message: '获取地址详情成功'
        }
      }
      
      return {
        success: false,
        data: null,
        message: '地址不存在'
      }
    }
    
    // 真实 API
    return api.get(`/addresses/${addressId}`)
  },

  /**
   * 添加地址
   * @param {Object} addressData - 地址数据
   * @returns {Promise<Object>}
   */
  async addAddress(addressData) {
    if (USE_MOCK) {
      await mockDelay()
      
      const addresses = JSON.parse(localStorage.getItem('addresses') || '[]')
      
      const newAddress = {
        id: Date.now(),
        ...addressData,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      }
      
      // 如果是默认地址，取消其他地址的默认状态
      if (newAddress.isDefault) {
        addresses.forEach(addr => {
          addr.isDefault = false
        })
      }
      
      // 如果是第一个地址，自动设为默认
      if (addresses.length === 0) {
        newAddress.isDefault = true
      }
      
      addresses.push(newAddress)
      localStorage.setItem('addresses', JSON.stringify(addresses))
      
      return {
        success: true,
        data: newAddress,
        message: '添加地址成功'
      }
    }
    
    // 真实 API
    return api.post('/addresses', addressData)
  },

  /**
   * 更新地址
   * @param {number} addressId - 地址 ID
   * @param {Object} addressData - 新地址数据
   * @returns {Promise<Object>}
   */
  async updateAddress(addressId, addressData) {
    if (USE_MOCK) {
      await mockDelay()
      
      const addresses = JSON.parse(localStorage.getItem('addresses') || '[]')
      const index = addresses.findIndex(a => a.id === parseInt(addressId))
      
      if (index > -1) {
        // 如果更新为默认地址，取消其他地址的默认状态
        if (addressData.isDefault) {
          addresses.forEach(addr => {
            addr.isDefault = false
          })
        }
        
        addresses[index] = {
          ...addresses[index],
          ...addressData,
          updateTime: new Date().toISOString()
        }
        
        localStorage.setItem('addresses', JSON.stringify(addresses))
        
        return {
          success: true,
          data: addresses[index],
          message: '更新地址成功'
        }
      }
      
      return {
        success: false,
        data: null,
        message: '地址不存在'
      }
    }
    
    // 真实 API
    return api.put(`/addresses/${addressId}`, addressData)
  },

  /**
   * 删除地址
   * @param {number} addressId - 地址 ID
   * @returns {Promise<Object>}
   */
  async deleteAddress(addressId) {
    if (USE_MOCK) {
      await mockDelay()
      
      const addresses = JSON.parse(localStorage.getItem('addresses') || '[]')
      const index = addresses.findIndex(a => a.id === parseInt(addressId))
      
      if (index > -1) {
        const wasDefault = addresses[index].isDefault
        addresses.splice(index, 1)
        
        // 如果删除的是默认地址，将第一个地址设为默认
        if (wasDefault && addresses.length > 0) {
          addresses[0].isDefault = true
        }
        
        localStorage.setItem('addresses', JSON.stringify(addresses))
        
        return {
          success: true,
          data: null,
          message: '删除地址成功'
        }
      }
      
      return {
        success: false,
        data: null,
        message: '地址不存在'
      }
    }
    
    // 真实 API
    return api.delete(`/addresses/${addressId}`)
  },

  /**
   * 设置默认地址
   * @param {number} addressId - 地址 ID
   * @returns {Promise<Object>}
   */
  async setDefaultAddress(addressId) {
    if (USE_MOCK) {
      await mockDelay()
      
      const addresses = JSON.parse(localStorage.getItem('addresses') || '[]')
      
      // 取消所有地址的默认状态
      addresses.forEach(addr => {
        addr.isDefault = false
      })
      
      // 设置指定地址为默认
      const index = addresses.findIndex(a => a.id === parseInt(addressId))
      if (index > -1) {
        addresses[index].isDefault = true
        addresses[index].updateTime = new Date().toISOString()
        
        localStorage.setItem('addresses', JSON.stringify(addresses))
        
        return {
          success: true,
          data: addresses[index],
          message: '设置默认地址成功'
        }
      }
      
      return {
        success: false,
        data: null,
        message: '地址不存在'
      }
    }
    
    // 真实 API
    return api.put(`/addresses/${addressId}/default`)
  },

  /**
   * 获取默认地址
   * @returns {Promise<Object>}
   */
  async getDefaultAddress() {
    if (USE_MOCK) {
      await mockDelay()
      
      const addresses = JSON.parse(localStorage.getItem('addresses') || '[]')
      const defaultAddress = addresses.find(a => a.isDefault)
      
      if (defaultAddress) {
        return {
          success: true,
          data: defaultAddress,
          message: '获取默认地址成功'
        }
      }
      
      // 如果没有默认地址，返回第一个地址
      if (addresses.length > 0) {
        return {
          success: true,
          data: addresses[0],
          message: '获取默认地址成功'
        }
      }
      
      return {
        success: false,
        data: null,
        message: '暂无收货地址'
      }
    }
    
    // 真实 API
    return api.get('/addresses/default')
  }
}

console.log('📍 地址 API 已加载 (Mock 模式)')
