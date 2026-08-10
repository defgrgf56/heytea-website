# 修改密码功能实现

## 问题描述

个人中心（Profile.vue）的"修改密码"功能不可用，点击保存后只做了前端验证，没有调用后端 API。

## 问题原因

`Profile.vue` 中的 `changePassword` 函数只做了简单的前端验证和提示，没有实际调用后端的修改密码接口。

**原代码：**
```javascript
// 修改密码
function changePassword() {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.error(t('profile.passwordNotMatch'))
    return
  }
  toast.success(t('profile.changePasswordSuccess'))
  showChangePassword.value = false
  // ... 清空表单
}
```

## 解决方案

### 1️⃣ 在 auth.js 中添加修改密码 API

根据后端接口文档，修改密码需要使用 RSA 加密，接口是 `PUT /auth/password`。

**添加的代码：**

```javascript
/**
 * 修改密码（使用 RSA 加密）
 * @param {Object} passwordData - 密码数据
 * @param {string} passwordData.oldPassword - 旧密码
 * @param {string} passwordData.newPassword - 新密码
 * @returns {Promise<Object>}
 */
async changePassword(passwordData) {
  if (USE_MOCK) {
    // Mock 模式实现
    await mockDelay(500)
    
    // 验证旧密码
    const userId = parseInt(token.split('-')[2]) || 1
    const userIndex = registeredUsers.findIndex(u => u.id === userId)
    
    if (registeredUsers[userIndex].password !== passwordData.oldPassword) {
      return {
        success: false,
        message: '旧密码不正确',
        code: 'INVALID_CREDENTIALS'
      }
    }
    
    // 更新密码
    registeredUsers[userIndex].password = passwordData.newPassword
    saveUsersToStorage(registeredUsers)
    
    return {
      success: true,
      message: '密码修改成功，请重新登录'
    }
  }
  
  // 真实后端 API：使用 RSA 加密修改密码
  try {
    // 1. 获取 Challenge
    const challenge = await api.get('/auth/challenge?purpose=change-password')
    
    // 2. 加密密码数据
    const payload = await encryptPayload(challenge.publicKey, {
      purpose: 'change-password',
      challengeId: challenge.challengeId,
      nonce: challenge.nonce,
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword
    })
    
    // 3. 提交加密后的修改密码请求
    await api.put('/auth/password', {
      credential: {
        challengeId: challenge.challengeId,
        payload
      }
    })
    
    return {
      success: true,
      message: '密码修改成功，请重新登录'
    }
  } catch (error) {
    console.error('❌ 修改密码失败:', error)
    
    if (error.message === 'INVALID_CREDENTIALS') {
      throw new Error('旧密码不正确')
    }
    throw error
  }
}
```

### 2️⃣ 修复 Profile.vue 中的调用

**修改后的代码：**

```javascript
// 修改密码
async function changePassword() {
  // 验证密码
  if (!passwordForm.oldPassword) {
    toast.error('请输入旧密码')
    return
  }
  
  if (!passwordForm.newPassword) {
    toast.error('请输入新密码')
    return
  }
  
  if (passwordForm.newPassword.length < 6) {
    toast.error('新密码长度不能少于 6 位')
    return
  }
  
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.error(t('profile.passwordNotMatch'))
    return
  }
  
  const loadingId = toast.loading('正在修改密码...')
  
  try {
    // 调用修改密码接口（使用 RSA 加密）
    const { authApi } = await import('@/api')
    await authApi.changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })
    
    console.log('✅ 密码修改成功')
    
    toast.dismiss(loadingId)
    toast.success(t('profile.changePasswordSuccess'))
    
    // 清空表单
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    showChangePassword.value = false
    
    // 密码修改成功后，旧 Token 失效，需要重新登录
    setTimeout(async () => {
      await userStore.logout()
      router.push('/login')
      toast.info('请使用新密码重新登录')
    }, 1500)
  } catch (error) {
    console.error('❌ 修改密码失败:', error)
    toast.dismiss(loadingId)
    toast.error(error.message || '修改密码失败，请重试')
  }
}
```

## 修改文件

1. **C:\Users\刘刘\Desktop\喜茶\src\api\auth.js**
   - 添加 `changePassword()` 方法
   - 支持 Mock 模式和真实 API 模式
   - 使用 RSA 加密保护密码安全

2. **C:\Users\刘刘\Desktop\喜茶\src\views\Profile.vue**
   - 完善 `changePassword()` 函数
   - 添加完整的表单验证
   - 调用 `authApi.changePassword()` API
   - 修改成功后自动退出并跳转到登录页

## 功能特性

### ✅ 完整的表单验证

- 检查旧密码是否为空
- 检查新密码是否为空
- 检查新密码长度（至少 6 位）
- 检查两次输入的新密码是否一致

### ✅ RSA 加密传输

按照后端接口文档要求，使用 Challenge-Response 模式：

1. 获取一次性 Challenge（包含公钥）
2. 使用 RSA-OAEP-SHA256 加密密码数据
3. 提交 Base64 编码的密文
4. Challenge 使用一次后即失效，防止重放攻击

### ✅ Mock 模式支持

Mock 模式下：
- 验证旧密码是否正确
- 更新 localStorage 中的用户密码
- 保持与真实 API 相同的行为

### ✅ 自动退出登录

根据后端接口文档说明：

> 修改成功后所有旧 Token 失效，前端应清除本地登录状态并重新登录。

因此，密码修改成功后：
1. 显示成功提示
2. 1.5秒后自动退出登录
3. 跳转到登录页
4. 提示"请使用新密码重新登录"

### ✅ 错误处理

- 旧密码不正确：显示"旧密码不正确"
- 网络错误：显示"修改密码失败，请重试"
- 其他错误：显示具体的错误信息

## 测试步骤

### Mock 模式测试

1. 保持 `.env.development` 中 `VITE_USE_MOCK=true`
2. 登录系统（使用 admin/123456）
3. 进入个人中心
4. 点击"修改密码"
5. 输入：
   - 旧密码：`123456`
   - 新密码：`654321`
   - 确认密码：`654321`
6. 点击保存
7. ✅ 提示"密码修改成功"
8. ✅ 自动退出登录并跳转到登录页
9. 使用新密码 `654321` 登录
10. ✅ 登录成功

### 真实 API 测试

1. 修改 `.env.development`：`VITE_USE_MOCK=false`
2. 重启开发服务器：`npm run dev`
3. 使用测试账号登录：`user / 123456`
4. 进入个人中心
5. 点击"修改密码"
6. 控制台应显示：
   ```
   📦 Challenge 数据: {challengeId, nonce, publicKey, ...}
   ✅ 公钥已获取，准备加密...
   ✅ 数据已加密，提交修改密码请求...
   ✅ 密码修改成功
   ```
7. 使用新密码重新登录
8. ✅ 登录成功

### 错误场景测试

1. **旧密码错误**：
   - 输入错误的旧密码
   - ✅ 提示"旧密码不正确"

2. **新密码太短**：
   - 输入少于 6 位的新密码
   - ✅ 提示"新密码长度不能少于 6 位"

3. **两次密码不一致**：
   - 新密码和确认密码不一致
   - ✅ 提示"两次输入的密码不一致"

4. **未登录**：
   - 清除 Token
   - ✅ 提示"未登录"

## 安全特性

### 🔒 密码加密传输

- 使用 RSA 非对称加密
- 公钥从服务端动态获取
- 私钥只存在于服务端，不提供给前端

### 🔒 Challenge-Response 模式

- 每次修改密码获取新的 Challenge
- Challenge 包含随机 nonce 值
- Challenge 使用一次后即失效
- 防止重放攻击

### 🔒 Token 失效机制

- 修改密码后所有旧 Token 立即失效
- 强制用户重新登录
- 防止密码被修改后仍可使用旧 Token 访问

### 🔒 密码存储

- 数据库只保存 bcrypt 哈希值
- 不保存明文或可逆密文
- 服务端无法恢复原始密码

## 相关文档

- `前端接口对接说明.md` - 后端接口文档
- `AUTH_LOGIN_FIX.md` - 登录加密修复文档
- `API_INTEGRATION_CHECK.md` - API 对接检查报告

## 日期

2026-08-10
