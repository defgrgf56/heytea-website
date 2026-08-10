import { api } from './index'

/**
 * 地址相关 API
 * 注意：地址接口始终调用真实后端 API，不使用 Mock 模式
 */
export const addressApi = {
  /**
   * 获取地址列表
   * @returns {Promise<Array>}
   */
  async getAddresses() {
    try {
      const response = await api.get('/addresses')
      // 后端返回的是数组，直接返回
      return response || []
    } catch (error) {
      console.error('❌ 获取地址列表失败:', error)
      // 失败时返回空数组，不中断用户流程
      return []
    }
  },

  /**
   * 获取默认地址
   * @returns {Promise<Object|null>}
   */
  async getDefaultAddress() {
    try {
      const response = await api.get('/addresses/default')
      // 后端可能返回 null（没有地址时）
      return response || null
    } catch (error) {
      console.error('❌ 获取默认地址失败:', error)
      return null
    }
  },

  /**
   * 获取地址详情
   * @param {string} addressId - 地址 ID (ObjectId)
   * @returns {Promise<Object>}
   */
  async getAddressDetail(addressId) {
    return api.get(`/addresses/${addressId}`)
  },

  /**
   * 添加地址
   * @param {Object} addressData - 地址数据
   * @param {string} addressData.receiverName - 收件人姓名（或使用兼容字段 name）
   * @param {string} addressData.receiverPhone - 收件人电话（或使用兼容字段 phone）
   * @param {string} addressData.province - 省份
   * @param {string} addressData.city - 城市
   * @param {string} addressData.district - 区县
   * @param {string} addressData.detailAddress - 详细地址（或使用兼容字段 detail）
   * @param {string} addressData.label - 地址标签（公司/家/学校等）
   * @param {boolean} addressData.isDefault - 是否默认地址
   * @returns {Promise<Object>}
   */
  async addAddress(addressData) {
    // 统一使用正式字段名，同时兼容旧字段名
    const payload = {
      receiverName: addressData.receiverName || addressData.name,
      receiverPhone: addressData.receiverPhone || addressData.phone,
      province: addressData.province,
      city: addressData.city,
      district: addressData.district,
      detailAddress: addressData.detailAddress || addressData.detail,
      label: addressData.label || '',
      isDefault: addressData.isDefault || false
    }
    
    console.log('📤 添加地址请求:', payload)
    return api.post('/addresses', payload)
  },

  /**
   * 更新地址
   * @param {string} addressId - 地址 ID
   * @param {Object} addressData - 新地址数据（部分字段更新）
   * @returns {Promise<Object>}
   */
  async updateAddress(addressId, addressData) {
    // 只发送需要更新的字段
    const payload = {}
    
    if (addressData.receiverName !== undefined || addressData.name !== undefined) {
      payload.receiverName = addressData.receiverName || addressData.name
    }
    if (addressData.receiverPhone !== undefined || addressData.phone !== undefined) {
      payload.receiverPhone = addressData.receiverPhone || addressData.phone
    }
    if (addressData.province !== undefined) {
      payload.province = addressData.province
    }
    if (addressData.city !== undefined) {
      payload.city = addressData.city
    }
    if (addressData.district !== undefined) {
      payload.district = addressData.district
    }
    if (addressData.detailAddress !== undefined || addressData.detail !== undefined) {
      payload.detailAddress = addressData.detailAddress || addressData.detail
    }
    if (addressData.label !== undefined) {
      payload.label = addressData.label
    }
    if (addressData.isDefault !== undefined) {
      payload.isDefault = addressData.isDefault
    }
    
    console.log('📤 更新地址请求:', payload)
    return api.put(`/addresses/${addressId}`, payload)
  },

  /**
   * 删除地址（软删除）
   * @param {string} addressId - 地址 ID
   * @returns {Promise<Object>}
   */
  async deleteAddress(addressId) {
    return api.delete(`/addresses/${addressId}`)
  },

  /**
   * 设置默认地址
   * @param {string} addressId - 地址 ID
   * @returns {Promise<Object>}
   */
  async setDefaultAddress(addressId) {
    return api.put(`/addresses/${addressId}/default`)
  }
}

console.log('📍 地址 API 已加载（真实后端模式）')
