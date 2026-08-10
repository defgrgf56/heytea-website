import { API_BASE_URL } from './index'
import toast from '@/utils/toast'

/**
 * 图片上传 API
 */
export const uploadApi = {
  /**
   * 上传图片（管理员）
   * @param {File} file - 图片文件（JPG、PNG、WEBP，最大 2 MB）
   * @returns {Promise<Object>} 返回图片信息 {url, originalName, size, mimeType}
   */
  async uploadImage(file) {
    return this._uploadToEndpoint(file, `${API_BASE_URL}/admin/uploads/images`)
  },
  
  /**
   * 上传图片（普通用户）
   * @param {File} file - 图片文件（JPG、PNG、WEBP，最大 2 MB）
   * @returns {Promise<Object>} 返回图片信息 {url, originalName, size, mimeType}
   */
  async uploadUserImage(file) {
    return this._uploadToEndpoint(file, `${API_BASE_URL}/uploads/images`)
  },
  
  /**
   * 通用上传逻辑
   * @private
   */
  async _uploadToEndpoint(file, endpoint) {
    // 验证文件
    if (!file) {
      throw new Error('请选择要上传的图片')
    }
    
    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('只支持 JPG、PNG、WEBP 格式的图片')
    }
    
    // 验证文件大小（2MB）
    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('图片大小不能超过 2MB')
    }
    
    // 构建 FormData
    const formData = new FormData()
    formData.append('file', file)
    
    // 获取 token
    const token = localStorage.getItem('token')
    
    try {
      console.log('📤 开始上传图片:', file.name, `(${(file.size / 1024).toFixed(2)}KB)`)
      console.log('📡 上传接口:', endpoint)
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          // 不要设置 Content-Type，让浏览器自动设置（包含 boundary）
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formData
      })
      
      console.log('📡 上传响应状态:', response.status)
      
      // 解析响应
      const data = await response.json()
      console.log('📦 上传响应数据:', data)
      
      // 检查 HTTP 状态码
      if (!response.ok) {
        const error = new Error(data.message || `上传失败 (${response.status})`)
        error.status = response.status
        error.code = data.code
        
        // 特殊错误处理
        if (response.status === 422) {
          if (data.code === 'UNSUPPORTED_FILE_TYPE') {
            throw new Error('不支持的图片格式')
          } else if (data.code === 'FILE_TOO_LARGE') {
            throw new Error('图片大小超过 2MB')
          }
        } else if (response.status === 401) {
          throw new Error('未登录，请先登录')
        } else if (response.status === 403) {
          throw new Error('无权限上传图片')
        }
        
        throw error
      }
      
      // 检查业务状态
      if (!data.success) {
        throw new Error(data.message || '上传失败')
      }
      
      console.log('✅ 图片上传成功:', data.data.url)
      
      // 返回图片数据
      return data.data
    } catch (error) {
      console.error('❌ 图片上传失败:', error)
      toast.error(error.message || '图片上传失败')
      throw error
    }
  },
  
  /**
   * 上传多张图片
   * @param {File[]} files - 图片文件数组
   * @returns {Promise<Array>} 返回图片信息数组
   */
  async uploadImages(files) {
    if (!files || files.length === 0) {
      throw new Error('请选择要上传的图片')
    }
    
    // 逐个上传
    const results = []
    for (const file of files) {
      try {
        const result = await this.uploadImage(file)
        results.push(result)
      } catch (error) {
        console.error('上传失败:', file.name, error)
        // 继续上传其他文件
      }
    }
    
    return results
  }
}
