# 喜茶网站 - 后端 API 集成文档

## 📋 概述

本文档说明了前端登录功能所需的后端 API 接口规范。

## 🔑 认证流程

1. **用户登录** → 后端返回 JWT token
2. **存储 token** → 前端保存到 localStorage
3. **请求携带 token** → 在 Header 中添加 `Authorization: Bearer <token>`
4. **token 验证** → 后端验证 token 有效性
5. **token 过期** → 前端清除登录状态，跳转到登录页

## 🌐 API 基础信息

**基础 URL**: `http://localhost:3000/api` (可在 `.env` 文件中配置)

**通用 Header**:
```
Content-Type: application/json
Authorization: Bearer <token>  // 需要认证的接口
```

## 📝 接口规范

### 1. 用户登录

**接口地址**: `POST /auth/login`

**请求参数**:
```json
{
  "username": "string",  // 用户名或邮箱
  "password": "string"   // 密码
}
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "zhangsan",
      "email": "zhangsan@example.com",
      "nickname": "张三",
      "avatar": "https://example.com/avatar.jpg"
    }
  },
  "message": "登录成功"
}
```

**失败响应** (401):
```json
{
  "success": false,
  "message": "用户名或密码错误"
}
```

---

### 2. 用户注册

**接口地址**: `POST /auth/register`

**请求参数**:
```json
{
  "username": "string",     // 用户名 (必填)
  "email": "string",        // 邮箱 (必填)
  "password": "string"      // 密码 (必填，最少6位)
}
```

**成功响应** (201):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "zhangsan",
      "email": "zhangsan@example.com"
    }
  },
  "message": "注册成功"
}
```

**失败响应** (400):
```json
{
  "success": false,
  "message": "用户名已存在"
}
```

---

### 3. 退出登录

**接口地址**: `POST /auth/logout`

**请求 Header**:
```
Authorization: Bearer <token>
```

**成功响应** (200):
```json
{
  "success": true,
  "message": "退出登录成功"
}
```

---

### 4. 获取当前用户信息

**接口地址**: `GET /auth/me`

**请求 Header**:
```
Authorization: Bearer <token>
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "zhangsan",
    "email": "zhangsan@example.com",
    "nickname": "张三",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

**失败响应** (401):
```json
{
  "success": false,
  "message": "未授权或 token 已过期"
}
```

---

### 5. 刷新 Token

**接口地址**: `POST /auth/refresh`

**请求 Header**:
```
Authorization: Bearer <token>
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 🔐 Token 说明

### Token 格式
使用 JWT (JSON Web Token)，格式为：
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token 存储位置
- **localStorage**: `token` 键
- **localStorage**: `user` 键 (用户信息 JSON 字符串)

### Token 有效期
建议：
- Access Token: 24 小时
- Refresh Token: 7 天（可选）

---

## 🛠️ 前端集成说明

### 1. 配置 API 地址

修改 `.env` 文件：
```env
VITE_API_BASE_URL=http://your-backend-api.com/api
```

### 2. API 调用示例

登录功能已集成在：
- **API 模块**: `src/api/auth.js`
- **状态管理**: `src/stores/user.js`
- **登录页面**: `src/views/Login.vue`

使用示例：
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
}

// 退出
await userStore.logout()

// 获取当前用户
console.log(userStore.user)
console.log(userStore.isLoggedIn)
```

### 3. 路由守卫

需要登录才能访问的页面，在路由配置中添加 `meta.requiresAuth`:

```javascript
{
  path: '/profile',
  name: 'Profile',
  component: () => import('../views/Profile.vue'),
  meta: { requiresAuth: true }  // 需要登录
}
```

已实现的路由守卫会自动：
- 检查登录状态
- 未登录跳转到 `/login`
- 保存原始目标路径 (query.redirect)

---

## 📦 依赖说明

前端已安装的相关依赖：
- `pinia`: 状态管理
- `vue-router`: 路由管理
- `vue-i18n`: 国际化（支持中英文切换）

无需安装额外的 HTTP 库，已使用原生 `fetch` API。

---

## 🧪 测试建议

### Mock 数据测试

在后端未完成前，可以在 `src/api/auth.js` 中添加 mock 响应：

```javascript
// 临时 mock 登录
login(credentials) {
  // return api.post('/auth/login', credentials)
  
  // Mock 响应
  return new Promise((resolve) => {
    setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === '123456') {
        resolve({
          success: true,
          data: {
            token: 'mock-token-12345',
            user: {
              id: 1,
              username: 'admin',
              email: 'admin@heytea.com',
              nickname: '用户一',
              avatar: '/images/logo.webp'
            }
          }
        })
      } else {
        resolve({
          success: false,
          message: '用户名或密码错误'
        })
      }
    }, 1000)
  })
}
```

---

## ⚠️ 安全建议

1. **HTTPS**: 生产环境必须使用 HTTPS
2. **Token 过期**: 实现 token 自动刷新机制
3. **密码强度**: 后端应验证密码复杂度
4. **防暴力破解**: 添加登录失败次数限制
5. **XSS 防护**: 用户输入内容需转义
6. **CSRF 防护**: 添加 CSRF token（如需要）

---

## 📞 联系方式

如有问题，请联系前端开发团队。

---

**文档版本**: v1.0  
**最后更新**: 2026-07-23
