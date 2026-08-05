# 🎭 虚拟数据使用指南

## 📋 概述

登录功能现在支持**虚拟数据模式**，无需后端服务器即可测试完整的登录/注册流程！

**🎉 新功能：用户数据持久化**
- ✅ 新注册的用户会自动保存到 localStorage
- ✅ 刷新页面、关闭浏览器后数据不丢失
- ✅ 注册后的账号可以一直使用

---

## 🔧 模式切换

### 当前模式：**虚拟数据模式（Mock）**

在 `src/api/auth.js` 文件中：

```javascript
// 🎭 Mock 模式开关
const USE_MOCK = true  // ✅ 使用虚拟数据
// const USE_MOCK = false  // 连接真实后端
```

### 切换到真实后端

将 `USE_MOCK` 改为 `false`，并配置 `.env` 文件中的 API 地址：

```env
VITE_API_BASE_URL=http://your-backend-server.com/api
```

---

## 👥 测试账号

### 预设账号（可直接登录）

| 用户名 | 密码 | 邮箱 | 昵称 |
|--------|------|------|------|
| **admin** | 123456 | admin@heytea.com | 管理员 |
| **zhangsan** | 123456 | zhangsan@heytea.com | 张三 |
| **lisi** | 123456 | lisi@heytea.com | 李四 |

### 🔑 快速测试

1. 访问 http://localhost:3001/login
2. 输入用户名：`admin`
3. 输入密码：`123456`
4. 点击"登录"

---

## ✨ 支持的功能

### ✅ 1. 用户登录
- 验证用户名和密码
- 返回 token 和用户信息
- 自动保存登录状态
- 模拟网络延迟（800ms）

### ✅ 2. 用户注册
- 检查用户名是否重复
- 检查邮箱是否重复
- 自动创建新用户
- 新用户可立即登录

**注册示例**：
```
用户名: wangwu
邮箱: wangwu@heytea.com
密码: 123456
```

### ✅ 3. 退出登录
- 清除本地登录状态
- 跳转到首页

### ✅ 4. 获取用户信息
- 从 token 解析用户 ID
- 返回完整用户信息

### ✅ 5. Token 刷新
- 自动生成新 token
- 保持登录状态

---

## 🎯 功能演示

### 场景1: 用户登录流程

```
1. 访问 http://localhost:3001/login
2. 输入用户名: admin
3. 输入密码: 123456
4. 点击"登录"
5. 成功后跳转到首页
6. Header 右上角显示"管理员"和头像
7. 点击头像可看到菜单（个人中心、退出登录）
```

### 场景2: 新用户注册

```
1. 访问登录页
2. 点击"还没有账号？立即注册"
3. 输入用户名: test001
4. 输入邮箱: test001@heytea.com
5. 输入密码: 123456
6. 确认密码: 123456
7. 点击"注册"
8. 提示"注册成功！请登录"
9. 切换到登录模式
10. 使用新账号登录
```

### 场景3: 页面刷新保持登录

```
1. 先登录任意账号
2. 刷新页面（F5）
3. 登录状态自动恢复
4. Header 右上角仍显示用户信息
```

### 场景4: 路由守卫测试

```
1. 未登录状态访问需要登录的页面
2. 自动跳转到登录页
3. 登录成功后返回原始页面
```

---

## 🔍 数据持久化

### ✨ 持久化功能
所有注册的用户数据会自动保存到浏览器的 **localStorage** 中：

- ✅ 刷新页面不丢失
- ✅ 关闭浏览器后重新打开仍然存在
- ✅ 新注册的用户永久保存（直到手动清除）

### 存储位置
```javascript
// 存储键
localStorage.getItem('heytea_mock_users')

// 查看存储的数据（浏览器控制台）
console.log(localStorage.getItem('heytea_mock_users'))
```

### 🛠️ 开发工具

#### 1. 查看所有用户
在浏览器控制台（F12）执行：
```javascript
window.showMockUsers()
```
会显示所有注册用户的表格，包括：
- ID
- 用户名
- 邮箱
- 昵称
- 注册时间

#### 2. 重置用户数据
如需清除所有新注册的用户，恢复为默认 3 个账号：
```javascript
window.resetMockUsers()
```
执行后会：
- 删除所有新注册用户
- 恢复为默认 3 个账号（admin, zhangsan, lisi）
- 清除相关 localStorage 数据

### 清除数据的方法

**方法 1: 使用开发工具**
```javascript
// 浏览器控制台执行
window.resetMockUsers()
```

**方法 2: 清除 localStorage**
```javascript
// 只清除用户数据
localStorage.removeItem('heytea_mock_users')

// 清除所有数据（包括登录状态）
localStorage.clear()

// 刷新页面
location.reload()
```

**方法 3: 浏览器开发者工具**
```
F12 → Application → Local Storage → 
找到 heytea_mock_users → 右键删除
```

---

## 🛠️ 开发者功能

### 添加新的测试账号

编辑 `src/api/auth.js`，在 `mockUsers` 数组中添加：

```javascript
const mockUsers = [
  // ... 现有账号
  {
    id: 4,
    username: 'wangwu',
    password: '123456',
    email: 'wangwu@heytea.com',
    nickname: '王五',
    avatar: '/images/logo.webp'
  }
]
```

### 修改网络延迟

```javascript
// 默认延迟 800ms
function mockDelay(ms = 800) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 改为 500ms（更快）
function mockDelay(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

### 模拟登录失败

```javascript
// 输入错误的用户名或密码即可
用户名: wrong_user
密码: wrong_password
```

---

## 🎨 自定义响应

### 修改成功消息

```javascript
// 在 mockLogin 函数中
return {
  success: true,
  data: { token, user },
  message: '欢迎回来！' // ← 自定义消息
}
```

### 修改错误消息

```javascript
// 在 mockLogin 函数中
return {
  success: false,
  message: '账号或密码不正确，请重试' // ← 自定义消息
}
```

---

## 📊 数据流程

```
登录流程：
用户输入 → mockLogin() → 验证数据 → 返回 token + 用户信息 → 保存到 localStorage → 更新 Pinia store → 跳转首页

注册流程：
用户输入 → mockRegister() → 检查重复 → 创建新用户 → 添加到 registeredUsers → 返回成功 → 提示登录

退出流程：
点击退出 → mockLogout() → 清除 localStorage → 清除 Pinia store → 跳转首页
```

---

## ⚙️ 高级配置

### 1. 模拟不同的响应状态

```javascript
// 模拟服务器错误
async function mockLogin(credentials) {
  await mockDelay()
  
  // 模拟服务器维护
  if (Math.random() > 0.9) {
    throw new Error('服务器维护中，请稍后再试')
  }
  
  // 正常逻辑...
}
```

### 2. 添加登录失败次数限制

```javascript
let loginAttempts = {}

async function mockLogin(credentials) {
  const { username } = credentials
  
  // 记录失败次数
  if (!loginAttempts[username]) {
    loginAttempts[username] = { count: 0, lastAttempt: Date.now() }
  }
  
  // 5次失败后锁定10分钟
  if (loginAttempts[username].count >= 5) {
    const lockTime = 10 * 60 * 1000 // 10分钟
    if (Date.now() - loginAttempts[username].lastAttempt < lockTime) {
      return {
        success: false,
        message: '登录失败次数过多，请10分钟后再试'
      }
    } else {
      // 重置计数
      loginAttempts[username] = { count: 0, lastAttempt: Date.now() }
    }
  }
  
  // 验证用户...
  const user = mockUsers.find(/*...*/)
  
  if (!user) {
    loginAttempts[username].count++
    loginAttempts[username].lastAttempt = Date.now()
    return { success: false, message: '用户名或密码错误' }
  }
  
  // 登录成功，重置计数
  loginAttempts[username] = { count: 0, lastAttempt: Date.now() }
  return { success: true, data: { token, user } }
}
```

### 3. 自动生成测试用户

```javascript
// 生成100个测试用户
function generateMockUsers(count = 100) {
  const users = []
  for (let i = 1; i <= count; i++) {
    users.push({
      id: i,
      username: `user${i}`,
      password: '123456',
      email: `user${i}@heytea.com`,
      nickname: `用户${i}`,
      avatar: '/images/logo.webp'
    })
  }
  return users
}

const mockUsers = generateMockUsers(100)
```

---

## 🔄 切换到真实后端

当后端 API 开发完成后：

### 1. 修改 Mock 开关
```javascript
// src/api/auth.js
const USE_MOCK = false  // ❌ 关闭虚拟数据
```

### 2. 配置 API 地址
```env
# .env
VITE_API_BASE_URL=http://your-backend-api.com/api
```

### 3. 重启开发服务器
```bash
# 停止当前服务器（Ctrl+C）
# 重新启动
npm run dev
```

### 4. 测试真实接口
访问登录页，使用真实账号测试。

---

## 📝 注意事项

1. **数据持久化**
   - ✅ 新注册的用户会永久保存在 localStorage
   - ✅ 刷新页面、关闭浏览器后数据仍然存在
   - ⚠️ 清除浏览器数据或使用隐私模式会丢失

2. **开发环境使用**
   - Mock 模式仅用于开发测试
   - 生产环境必须切换到真实后端

3. **安全性**
   - Mock 模式下，密码以明文存储（仅用于演示）
   - 真实环境必须使用加密传输和存储

4. **性能**
   - Mock 延迟可以调整
   - 真实网络延迟取决于后端响应速度

5. **数据管理**
   - 使用 `window.showMockUsers()` 查看所有用户
   - 使用 `window.resetMockUsers()` 重置为默认状态

---

## 🆘 常见问题

### Q: 注册的新用户刷新后还在吗？
A: ✅ **是的！** 新用户数据已持久化到 localStorage，刷新页面或重启浏览器都不会丢失。

### Q: 如何查看当前有多少注册用户？
A: 打开浏览器控制台（F12），输入：
```javascript
window.showMockUsers()
```

### Q: 如何查看当前登录状态？
A: 打开浏览器控制台，输入：
```javascript
console.log(localStorage.getItem('user'))
console.log(localStorage.getItem('token'))
```

### Q: 如何重置所有用户数据？
A: 浏览器控制台执行：
```javascript
window.resetMockUsers()
```
这会删除所有新注册用户，恢复为默认的 3 个账号。

### Q: 登录后 Header 没有显示用户信息？
A: 检查 `src/components/Header.vue` 是否调用了 `userStore.restoreUserFromStorage()`

### Q: 为什么有些新用户无法登录？
A: 可能是数据损坏，尝试重置用户数据：
```javascript
window.resetMockUsers()
```
然后重新注册。

### Q: 数据会占用多少空间？
A: 每个用户约 200-300 字节，100 个用户约 20-30KB，localStorage 限制通常为 5-10MB，完全够用。

---

## 🎉 开始测试

1. 确保开发服务器正在运行：`npm run dev`
2. 访问：http://localhost:3001/login
3. 使用测试账号：
   - 用户名：`admin`
   - 密码：`123456`
4. 享受完整的登录体验！

---

**文档版本**: v1.0  
**最后更新**: 2026-07-23  
**Mock 模式**: ✅ 已启用
