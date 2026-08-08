/**
 * 图片 URL 处理工具
 */

const API_BASE = 'https://haonan.online'

/**
 * 将完整的图片 URL 转换为可通过代理访问的相对路径
 * @param {string} url - 完整的图片 URL
 * @returns {string} - 相对路径或原 URL
 */
export function getProxyImageUrl(url) {
  console.log('🖼️ 原始图片 URL:', url)
  
  if (!url) return ''
  
  // 如果是相对路径，直接返回
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    console.log('✅ 已经是相对路径')
    return url
  }
  
  // 如果是后端服务器的图片，转换为相对路径走代理
  if (url.startsWith(API_BASE)) {
    const proxyUrl = url.replace(API_BASE, '')
    console.log('✅ 转换为代理路径:', proxyUrl)
    return proxyUrl
  }
  
  // 其他外部图片，直接返回（可能有 CORS 问题）
  console.log('⚠️ 外部图片，保持原样')
  return url
}

/**
 * 获取原始完整 URL（用于编辑表单）
 * @param {string} url - 可能是相对路径或完整 URL
 * @returns {string} - 完整 URL
 */
export function getFullImageUrl(url) {
  if (!url) return ''
  
  // 如果已经是完整 URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // 如果是相对路径，拼接为完整 URL
  if (url.startsWith('/api')) {
    return API_BASE + url
  }
  
  return url
}
