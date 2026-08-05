# 🔐 喜茶网站 - 登录功能说明

## ✨ 功能概述

已为喜茶网站添加完整的用户登录/注册功能，包括：

- ✅ 用户登录页面（支持中英文）
- ✅ 用户注册功能
- ✅ 登录状态管理（Pinia）
- ✅ 路由守卫（保护需要登录的页面）
- ✅ Header 用户菜单（头像、用户名、退出）
- ✅ API 接口预留（详见 API_INTEGRATION.md）
- ✅ Token 自动存储和恢复
- ✅ 响应式设计（移动端适配）

---

## 📁 新增文件

```
src/
├── api/
│   ├── index.js          # API 基础配置和请求封装
│   └── auth.js           # 用户认证 API（登录、注册、退出等）
├── stores/
│   └── user.js           # 用户状态管理（Pinia store）
├── views/
│   └── Login.vue         # 登录/注册页面
.env                       # 环境变量配置
.env.example               # 环境变量示例
API_INTEGRATION.md         # 后端 API 集成文档
LOGIN_FEATURE.md           # 本文档
```

---

## 🎯 功能特点

### 1️⃣ 登录页面
- 路径: `/login`
- 支持登录和注册模式切换
- 表单验证（密码长度、邮箱格式等）
- 优雅的动画效果
- 中英文双语支持

### 2️⃣ 用户状态管理
- 使用 Pinia 管理用户状态
- 自动保存到 localStorage
- 页面刷新后自动恢复登录状态
- 统一的错误处理

### 3️⃣ Header 集成
- **未登录**: 显示"登录"按钮
- **已登录**: 显示用户头像和用户名
- 点击头像展开菜单：
  - 个人中心（预留）
  - 退出登录

### 4️⃣ 路由守卫
- 保护需要登录的页面
- 自动跳转到登录页
- 登录后返回原始页面

---

## 🚀 使用方法

### 访问登录页面

在浏览器中访问：
```
http://localhost:5173/login
```

或点击 Header 右上角的"登录"按钮。

### 开发环境测试

#### 方法1: 使用 Mock 数据

在 `src/api/auth.js` 中，可以暂时使用 mock 数据测试：

```javascript
// 测试账号
用户名: admin
密码: 123456
```

#### 方法2: 连接真实后端

1. 启动后端服务器（例如 http://localhost:3000）
2. 修改 `.env` 文件中的 API 地址：
```env
VITE_API_BASE_URL=http://localhost:3000/api
```
3. 重启前端开发服务器

---

## 🔧 配置说明

### 环境变量

`.env` 文件：
```env
# API 基础地址
VITE_API_BASE_URL=http://localhost:3000/api
```

修改后需要重启开发服务器：
```bash
npm run dev
```

---

## 📖 代码示例

### 在组件中使用用户信息

```vue
<script setup>
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { isLoggedIn, user, userName } = storeToRefs(userStore)
</script>

<template>
  <div>
    <div v-if="isLoggedIn">
      欢迎，{{ userName }}！
    </div>
    <div v-else>
      <router-link to="/login">请登录</router-link>
    </div>
  </div>
</template>
```

### 编程式登录

```javascript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 登录
const result = await userStore.login({
  username: 'zhangsan',
  password: '123456'
})

if (result.success) {
  console.log('登录成功')
  router.push('/')
} else {
  console.error('登录失败:', result.message)
}
```

### 退出登录

```javascript
await userStore.logout()
router.push('/')
```

---

## 🔒 添加需要登录的页面

在路由配置中添加 `meta.requiresAuth`:

```javascript
// src/router/index.js
{
  path: '/profile',
  name: 'Profile',
  component: () => import('../views/Profile.vue'),
  meta: { 
    requiresAuth: true  // 需要登录才能访问
  }
}
```

路由守卫会自动：
1. 检查用户是否已登录
2. 未登录则跳转到 `/login?redirect=/profile`
3. 登录成功后自动返回 `/profile`

---

## 🎨 自定义样式

登录页面样式位于 `src/views/Login.vue` 的 `<style>` 部分，可以根据品牌需求调整：

- 主色调：`#1a1a1a`（黑色）
- 字体：楷体（与全站统一）
- 圆角：`8px`、`16px`
- 阴影：`rgba(0, 0, 0, 0.08)`

---

## 📱 移动端支持

登录页面已适配移动端：
- 响应式布局
- 触摸友好的按钮尺寸
- 自动调整表单宽度

---

## 🔐 安全特性

- ✅ 密码最小长度验证（6位）
- ✅ Token 存储在 localStorage
- ✅ 自动在请求 Header 中添加 Authorization
- ✅ Token 过期自动清除登录状态
- ⚠️ 生产环境请使用 HTTPS

---

## 📚 相关文档

- **后端 API 集成**: 查看 `API_INTEGRATION.md`
- **项目架构**: 查看 `ARCHITECTURE.md`
- **快速开始**: 查看 `QUICK_START.md`

---

## ✅ 下一步

1. **连接后端 API**
   - 实现后端接口（参考 API_INTEGRATION.md）
   - 修改 `.env` 文件中的 API 地址
   - 测试登录/注册功能

2. **添加个人中心页面**（可选）
   ```javascript
   {
     path: '/profile',
     name: 'Profile',
     component: () => import('../views/Profile.vue'),
     meta: { requiresAuth: true }
   }
   ```

3. **添加忘记密码功能**（可选）
   - 创建忘记密码页面
   - 添加邮箱验证码功能

4. **添加第三方登录**（可选）
   - 微信登录
   - 支付宝登录
   - 手机号登录

---

## 🐛 常见问题

### Q: 登录后刷新页面，登录状态丢失？
A: 检查 `src/components/Header.vue` 中是否调用了 `userStore.restoreUserFromStorage()`。

### Q: API 请求失败，显示网络错误？
A: 
1. 检查后端服务器是否启动
2. 检查 `.env` 中的 API 地址是否正确
3. 打开浏览器控制台查看详细错误

### Q: 如何修改 Token 存储位置？
A: 在 `src/stores/user.js` 中修改 `localStorage` 相关代码。

### Q: 如何自定义用户头像？
A: 后端 API 返回 `avatar` 字段，前端会自动显示。

---

## 📞 技术支持

如有问题，请查看：
1. 浏览器控制台错误信息
2. API_INTEGRATION.md 文档
3. 相关源代码注释

---

**功能版本**: v1.0  
**创建日期**: 2026-07-23  
**开发者**: Kiro AI
