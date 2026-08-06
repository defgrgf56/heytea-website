/**
 * RSA 加密工具
 * 用于登录和注册时加密敏感数据
 */

/**
 * 将 PEM 格式公钥转换为 ArrayBuffer
 */
function pemToArrayBuffer(pem) {
  const base64 = pem
    .replace('-----BEGIN PUBLIC KEY-----', '')
    .replace('-----END PUBLIC KEY-----', '')
    .replace(/\s+/g, '')
  
  const binary = atob(base64)
  return Uint8Array.from(binary, char => char.charCodeAt(0)).buffer
}

/**
 * 将 ArrayBuffer 转换为 Base64 字符串
 */
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

/**
 * 使用 RSA 公钥加密数据
 * @param {string} publicKeyPem - PEM 格式的公钥
 * @param {object} payload - 要加密的数据对象
 * @returns {Promise<string>} Base64 编码的密文
 */
export async function encryptPayload(publicKeyPem, payload) {
  try {
    // 导入公钥
    const publicKey = await crypto.subtle.importKey(
      'spki',
      pemToArrayBuffer(publicKeyPem),
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    )

    // 加密数据
    const encrypted = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      new TextEncoder().encode(JSON.stringify(payload))
    )

    // 返回 Base64 编码的密文
    return arrayBufferToBase64(encrypted)
  } catch (error) {
    console.error('RSA 加密失败:', error)
    throw new Error('加密失败，请重试')
  }
}

console.log('🔐 RSA 加密工具已加载')
