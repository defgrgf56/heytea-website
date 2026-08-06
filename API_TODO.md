# API 对接待办清单

## 📋 对接状态

- ⏳ 未开始
- 🚧 进行中
- ✅ 已完成
- ❌ 已阻塞

---

## 🔐 用户认证模块

### 1. 用户登录
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐⭐⭐⭐ 高
- **当前实现**: Mock (`src/api/auth.js`)
- **Mock 数据结构**:
  ```json
  {
    "success": true,
    "data": {
      "token": "mock-token-1-1234567890",
      "user": {
        "id": 1,
        "username": "admin",
        "email": "admin@heytea.com",
        "nickname": "用户一",
        "avatar": "/images/logo.webp"
      }
    },
    "message": "登录成功"
  }
  ```
- **API 端点**: `POST /api/auth/login`
- **请求参数**:
  ```json
  {
    "username": "admin",
    "password": "123456"
  }
  ```

### 2. 用户注册
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐⭐⭐ 高
- **当前实现**: Mock (`src/api/auth.js`)
- **API 端点**: `POST /api/auth/register`

### 3. 获取当前用户信息
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐⭐⭐ 高
- **API 端点**: `GET /api/auth/me`

### 4. 更新用户信息
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐⭐ 中
- **API 端点**: `PUT /api/auth/profile`

---

## 🛍️ 商品模块

### 1. 获取商品列表
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐⭐⭐ 高
- **当前实现**: 硬编码 (`src/views/Order.vue`)
- **Mock 数据**: 8个商品（芝士莓莓、多肉葡萄等）
- **API 端点**: `GET /api/products`
- **查询参数**:
  - `category`: 分类（tea, fruit, cheese, coffee）
  - `search`: 搜索关键词
  - `page`: 页码
  - `pageSize`: 每页数量

### 2. 获取商品详情
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐⭐ 中
- **API 端点**: `GET /api/products/:id`

---

## 🛒 购物车模块

### 1. 添加商品到购物车
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐⭐⭐ 高
- **当前实现**: Pinia Store (`src/stores/cart.js`)
- **API 端点**: `POST /api/cart/items`

### 2. 获取购物车列表
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐⭐⭐ 高
- **API 端点**: `GET /api/cart`

### 3. 更新购物车商品数量
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐⭐ 中
- **API 端点**: `PUT /api/cart/items/:id`

### 4. 删除购物车商品
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐⭐ 中
- **API 端点**: `DELETE /api/cart/items/:id`

### 5. 清空购物车
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐ 低
- **API 端点**: `DELETE /api/cart`

---

## 📦 订单模块

### 1. 创建订单
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐⭐⭐⭐ 高
- **当前实现**: Pinia Store (`src/stores/order.js`)
- **API 端点**: `POST /api/orders`

### 2. 获取订单列表
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐⭐⭐ 高
- **API 端点**: `GET /api/orders`

### 3. 获取订单详情
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐⭐⭐ 高
- **API 端点**: `GET /api/orders/:id`

### 4. 取消订单
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐⭐ 中
- **API 端点**: `PUT /api/orders/:id/cancel`

---

## 📍 收货地址模块

### 1. 获取地址列表
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐⭐⭐ 高
- **当前实现**: Pinia Store (`src/stores/address.js`)
- **API 端点**: `GET /api/addresses`

### 2. 添加地址
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐⭐⭐ 高
- **API 端点**: `POST /api/addresses`

### 3. 更新地址
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐⭐ 中
- **API 端点**: `PUT /api/addresses/:id`

### 4. 删除地址
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐⭐ 中
- **API 端点**: `DELETE /api/addresses/:id`

### 5. 设置默认地址
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐⭐ 中
- **API 端点**: `PUT /api/addresses/:id/default`

---

## 💳 支付模块（可选）

### 1. 创建支付订单
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐ 低
- **API 端点**: `POST /api/payment/create`

### 2. 支付回调
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐ 低
- **API 端点**: `POST /api/payment/callback`

---

## 📤 文件上传

### 1. 上传用户头像
- **状态**: ⏳ 未开始
- **优先级**: ⭐⭐ 低
- **API 端点**: `POST /api/upload/avatar`

---

## 🎯 对接顺序建议

### 第一批（核心功能，现在对接）
1. ✅ 用户登录/注册
2. ✅ 获取用户信息
3. ✅ 获取商品列表

### 第二批（主要功能，后台开发期间对接）
4. ✅ 购物车增删改查
5. ✅ 创建订单
6. ✅ 订单列表/详情

### 第三批（辅助功能，后台完成后对接）
7. ✅ 收货地址管理
8. ✅ 更新用户信息
9. ✅ 订单取消/再来一单
10. ✅ 文件上传

### 第四批（可选功能，按需对接）
11. ⭐ 支付功能
12. ⭐ 数据统计

---

## 📝 对接注意事项

### 1. 切换 Mock 模式
在 `src/api/auth.js` 中：
```javascript
// 当前：Mock 模式
const USE_MOCK = true

// 对接后：真实 API
const USE_MOCK = false
```

### 2. 配置 API 基础地址
在 `.env` 文件中：
```env
# 开发环境
VITE_API_BASE_URL=http://localhost:8080/api

# 生产环境
VITE_API_BASE_URL=https://api.heytea.com/api
```

### 3. Token 处理
- Token 存储在 localStorage
- 请求头自动添加：`Authorization: Bearer ${token}`
- Token 过期自动跳转登录页

### 4. 错误处理
- 统一错误提示（Toast）
- 401: 自动退出登录
- 403: 权限不足提示
- 500: 服务器错误提示

### 5. 数据格式统一
确保后端返回格式与 Mock 数据一致：
```json
{
  "success": true/false,
  "data": {},
  "message": "提示信息"
}
```

---

## 🔗 相关文件

- **API 封装**: `src/api/index.js`
- **认证 API**: `src/api/auth.js`
- **用户 Store**: `src/stores/user.js`
- **购物车 Store**: `src/stores/cart.js`
- **订单 Store**: `src/stores/order.js`
- **地址 Store**: `src/stores/address.js`

---

## 📅 更新记录

- 2026-07-23: 创建文档，规划对接顺序
- 待更新：API 对接进度

---

**建议：优先对接用户认证和商品列表，其他功能可以在后台管理系统开发期间陆续对接。**
