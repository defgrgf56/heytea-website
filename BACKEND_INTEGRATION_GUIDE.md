# 前后端对接完整指南

**更新时间**: 2026-07-23  
**适用版本**: 喜茶网站 v1.0

---

## 📋 目录

1. [对接前准备](#对接前准备)
2. [环境配置](#环境配置)
3. [API 接口规范](#api-接口规范)
4. [分阶段对接计划](#分阶段对接计划)
5. [Mock 切换真实 API](#mock-切换真实-api)
6. [错误处理](#错误处理)
7. [测试验证](#测试验证)
8. [常见问题](#常见问题)

---

## 🎯 对接前准备

### 前端当前状态

✅ **已完成**
- Mock 数据模式运行正常
- 完整的 API 封装层 (`src/api/`)
- Token 认证机制
- 错误处理和 Toast 提示
- localStorage 数据持久化

⚠️ **需要后端提供**
- API 基础地址
- 接口文档（建议使用 Swagger/Apifox）
- 测试账号和数据
- Token 有效期和刷新机制

### 后端需要准备

1. **部署环境**
   - 开发环境 API 地址（如：`http://localhost:8080/api`）
   - 测试环境 API 地址（如：`https://test-api.heytea.com/api`）
   - 生产环境 API 地址（如：`https://api.heytea.com/api`）

2. **跨域配置（CORS）**
   ```javascript
   // 后端需要允许前端域名
   Access-Control-Allow-Origin: http://localhost:3001
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Authorization
   Access-Control-Allow-Credentials: true
   ```

3. **统一响应格式**
   ```json
   {
     "success": true/false,
     "data": {},
     "message": "提示信息"
   }
   ```

---

## ⚙️ 环境配置

### 第一步：创建环境变量文件


在项目根目录创建以下文件：

**`.env.development`** (开发环境)
```env
# 开发环境 - 连接本地后端
VITE_API_BASE_URL=http://localhost:8080/api

# 或连接远程测试环境
# VITE_API_BASE_URL=https://test-api.heytea.com/api
```

**`.env.production`** (生产环境)
```env
# 生产环境
VITE_API_BASE_URL=https://api.heytea.com/api
```

**`.env.local`** (本地覆盖，不提交到 Git)
```env
# 可选：个人本地配置
VITE_API_BASE_URL=http://192.168.1.100:8080/api
```

### 第二步：配置 `.gitignore`

确保 `.gitignore` 包含：
```
.env.local
.env.*.local
```

---

## 📡 API 接口规范

### 1. 请求头规范

所有请求应包含：
```http
Content-Type: application/json
Authorization: Bearer {token}  # 需要登录的接口
```

### 2. 响应格式规范

**成功响应**
```json
{
  "success": true,
  "data": {
    // 实际数据
  },
  "message": "操作成功"
}
```

**失败响应**
```json
{
  "success": false,
  "data": null,
  "message": "错误描述"
}
```

### 3. HTTP 状态码

| 状态码 | 含义 | 前端处理 |
|-------|------|---------|
| 200 | 成功 | 正常处理 |
| 400 | 参数错误 | Toast 提示 |
| 401 | 未认证 | 跳转登录页 |
| 403 | 无权限 | Toast 提示 |
| 404 | 资源不存在 | Toast 提示 |
| 500 | 服务器错误 | Toast 提示 |

---

## 🚀 分阶段对接计划

### 第一阶段：用户认证（第 1 周）⭐⭐⭐⭐⭐

#### 1.1 用户登录

**前端调用**：`src/api/auth.js` - `authApi.login()`

**接口定义**：
```
POST /api/auth/login
Content-Type: application/json

请求体：
{
  "username": "admin",
  "password": "123456"
}

响应：
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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

**前端使用位置**：
- `src/views/Login.vue` - 登录表单
- `src/stores/user.js` - 用户状态管理

#### 1.2 用户注册

```
POST /api/auth/register

请求体：
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "123456"
}
```

#### 1.3 获取当前用户信息

```
GET /api/auth/me
Authorization: Bearer {token}

响应：
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@heytea.com",
    "nickname": "用户一",
    "avatar": "/images/logo.webp"
  }
}
```

#### 1.4 更新用户信息

```
PUT /api/auth/profile
Authorization: Bearer {token}

请求体：
{
  "nickname": "新昵称",
  "avatar": "/images/new-avatar.jpg"
}
```

**前端使用位置**：`src/views/Profile.vue`

---

### 第二阶段：商品模块（第 2 周）⭐⭐⭐⭐

#### 2.1 获取商品列表

**前端数据位置**：`src/views/Order.vue` (当前硬编码 8 个商品)

**接口定义**：
```
GET /api/products?category=tea&search=芝士&page=1&pageSize=20

响应：
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "name": "芝士莓莓",
        "nameEn": "Cheezo Berry Berry",
        "description": "新鲜草莓配芝士奶盖",
        "price": 25,
        "image": "/images/products/product1.png",
        "category": "cheese",
        "stock": 100,
        "sales": 1234,
        "rating": 4.8,
        "sizes": ["小杯", "中杯", "大杯"],
        "toppings": ["珍珠", "椰果", "芋圆", "红豆"],
        "sweetness": ["标准糖", "少糖", "无糖"]
      }
    ],
    "total": 8,
    "page": 1,
    "pageSize": 20
  }
}
```

**前端需要修改**：
- 创建 `src/api/product.js`
- 修改 `src/views/Order.vue` 从 API 获取数据
- 更新 `src/stores/product.js`

#### 2.2 获取商品详情

```
GET /api/products/:id

响应：
{
  "success": true,
  "data": {
    "id": 1,
    "name": "芝士莓莓",
    // ... 完整商品信息
    "reviews": []  // 可选：评价列表
  }
}
```

**前端使用位置**：`src/views/ProductDetail.vue`

---

### 第三阶段：购物车（第 2-3 周）⭐⭐⭐⭐

#### 3.1 获取购物车

```
GET /api/cart
Authorization: Bearer {token}

响应：
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "cart-item-1",
        "productId": 1,
        "product": {
          "id": 1,
          "name": "芝士莓莓",
          "price": 25,
          "image": "/images/products/product1.png"
        },
        "quantity": 2,
        "size": "中杯",
        "toppings": ["珍珠"],
        "sweetness": "标准糖",
        "subtotal": 56  // 含配料价格
      }
    ],
    "totalPrice": 56
  }
}
```


#### 3.2 添加商品到购物车

```
POST /api/cart/items
Authorization: Bearer {token}

请求体：
{
  "productId": 1,
  "quantity": 1,
  "size": "中杯",
  "toppings": ["珍珠", "椰果"],
  "sweetness": "少糖"
}

响应：
{
  "success": true,
  "data": {
    "id": "cart-item-123",
    // ... 购物车项信息
  },
  "message": "已加入购物车"
}
```

**前端使用位置**：
- `src/views/ProductDetail.vue` - 加入购物车
- `src/stores/cart.js` - 购物车管理

#### 3.3 更新购物车数量

```
PUT /api/cart/items/:id
Authorization: Bearer {token}

请求体：
{
  "quantity": 3
}
```

#### 3.4 删除购物车商品

```
DELETE /api/cart/items/:id
Authorization: Bearer {token}
```

#### 3.5 清空购物车

```
DELETE /api/cart
Authorization: Bearer {token}
```

**前端使用位置**：`src/components/CartSidebar.vue`

---

### 第四阶段：订单（第 3-4 周）⭐⭐⭐⭐⭐

#### 4.1 创建订单

**前端使用位置**：`src/views/Checkout.vue`

```
POST /api/orders
Authorization: Bearer {token}

请求体：
{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "size": "中杯",
      "toppings": ["珍珠"],
      "sweetness": "标准糖",
      "price": 25
    }
  ],
  "totalAmount": 55,
  "deliveryFee": 5,
  "address": {
    "id": 1,
    "name": "张三",
    "phone": "13800138000",
    "province": "广东省",
    "city": "深圳市",
    "district": "南山区",
    "detail": "科技园XX路XX号"
  },
  "remark": "少冰"
}

响应：
{
  "success": true,
  "data": {
    "id": 1001,
    "orderNo": "HT202607231234567",
    "status": "pending",
    "totalAmount": 55,
    "createTime": "2026-07-23T10:30:00Z"
  },
  "message": "订单创建成功"
}
```


#### 4.2 获取订单列表

**前端使用位置**：`src/views/Orders.vue`

```
GET /api/orders?status=pending&page=1&pageSize=10
Authorization: Bearer {token}

响应：
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1001,
        "orderNo": "HT202607231234567",
        "status": "pending",  // pending/confirmed/preparing/completed/cancelled
        "items": [
          {
            "productId": 1,
            "name": "芝士莓莓",
            "image": "/images/products/product1.png",
            "quantity": 2,
            "price": 25,
            "size": "中杯",
            "toppings": ["珍珠"],
            "sweetness": "标准糖"
          }
        ],
        "totalAmount": 55,
        "deliveryFee": 5,
        "createTime": "2026-07-23T10:30:00Z",
        "updateTime": "2026-07-23T10:30:00Z"
      }
    ],
    "total": 5,
    "page": 1,
    "pageSize": 10
  }
}
```

#### 4.3 获取订单详情

**前端使用位置**：`src/views/OrderDetail.vue`

```
GET /api/orders/:id
Authorization: Bearer {token}

响应：与订单列表中的单个订单格式相同，但包含更多详情
{
  "success": true,
  "data": {
    "id": 1001,
    "orderNo": "HT202607231234567",
    "status": "confirmed",
    "items": [...],
    "totalAmount": 55,
    "deliveryFee": 5,
    "address": {
      "name": "张三",
      "phone": "13800138000",
      "fullAddress": "广东省深圳市南山区科技园XX路XX号"
    },
    "remark": "少冰",
    "createTime": "2026-07-23T10:30:00Z",
    "updateTime": "2026-07-23T10:35:00Z",
    "estimatedDeliveryTime": "2026-07-23T11:00:00Z"  // 可选
  }
}
```

#### 4.4 取消订单

**前端使用位置**：`src/views/OrderDetail.vue`, `src/views/Orders.vue`

```
PUT /api/orders/:id/cancel
Authorization: Bearer {token}

响应：
{
  "success": true,
  "message": "订单已取消"
}
```

---

### 第五阶段：收货地址（第 4 周）⭐⭐⭐⭐

**前端使用位置**：`src/views/Profile.vue`, `src/stores/address.js`

#### 5.1 获取地址列表

```
GET /api/addresses
Authorization: Bearer {token}

响应：
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "张三",
      "phone": "13800138000",
      "province": "广东省",
      "city": "深圳市",
      "district": "南山区",
      "detail": "科技园XX路XX号",
      "isDefault": true
    }
  ]
}
```


#### 5.2 添加地址

```
POST /api/addresses
Authorization: Bearer {token}

请求体：
{
  "name": "李四",
  "phone": "13900139000",
  "province": "广东省",
  "city": "深圳市",
  "district": "福田区",
  "detail": "华强北XX大厦",
  "isDefault": false
}
```

#### 5.3 更新地址

```
PUT /api/addresses/:id
Authorization: Bearer {token}

请求体：同添加地址
```

#### 5.4 删除地址

```
DELETE /api/addresses/:id
Authorization: Bearer {token}
```

#### 5.5 设置默认地址

```
PUT /api/addresses/:id/default
Authorization: Bearer {token}
```

---

## 🔄 Mock 切换真实 API

### 方法一：全局切换（推荐）

**步骤 1**：在 `src/api/auth.js` 修改：

```javascript
// 🎭 Mock 模式开关
const USE_MOCK = false  // 改为 false 使用真实 API
```

**步骤 2**：配置环境变量

创建 `.env.development`：
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

**步骤 3**：重启开发服务器

```bash
npm run dev
```

### 方法二：渐进式切换

可以单独控制每个模块的 Mock 状态：

```javascript
// src/api/auth.js
const USE_MOCK_AUTH = false  // 认证使用真实 API

// src/api/product.js  
const USE_MOCK_PRODUCT = true  // 商品仍使用 Mock

// src/api/cart.js
const USE_MOCK_CART = true  // 购物车仍使用 Mock
```

这样可以逐步对接，降低风险。

---

## 🐛 错误处理

### 前端已实现的错误处理

在 `src/api/index.js` 中：

```javascript
async function request(url, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '请求失败')
    }

    return data
  } catch (error) {
    console.error('API 请求错误:', error)
    throw error
  }
}
```

### 需要后端配合

**401 未认证**：
- 前端自动跳转登录页
- 清除本地 token

**403 无权限**：
- Toast 提示用户
- 返回上一页

**500 服务器错误**：
- Toast 提示"服务器繁忙"
- 记录错误日志


### 需要增强的错误处理

在 `src/api/index.js` 中添加：

```javascript
async function request(url, options = {}) {
  const token = localStorage.getItem('token')
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config)
    const data = await response.json()

    // 🆕 根据 HTTP 状态码处理
    if (response.status === 401) {
      // 未认证，清除 token 并跳转登录
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
      throw new Error('未登录或登录已过期')
    }

    if (response.status === 403) {
      throw new Error(data.message || '无权限访问')
    }

    if (response.status === 404) {
      throw new Error(data.message || '资源不存在')
    }

    if (response.status >= 500) {
      throw new Error('服务器繁忙，请稍后重试')
    }

    if (!response.ok) {
      throw new Error(data.message || '请求失败')
    }

    return data
  } catch (error) {
    console.error('API 请求错误:', error)
    throw error
  }
}
```

---

## ✅ 测试验证

### 对接前测试清单

在切换到真实 API 前，确保 Mock 模式下所有功能正常：

- [ ] 用户登录/退出
- [ ] 商品列表加载
- [ ] 商品详情查看
- [ ] 添加到购物车
- [ ] 购物车增删改
- [ ] 创建订单
- [ ] 查看订单列表
- [ ] 查看订单详情
- [ ] 取消订单
- [ ] 地址增删改查

### 对接后测试清单

每对接一个模块，按此清单测试：

**用户认证模块**
- [ ] 正确账号密码能登录
- [ ] 错误密码显示错误提示
- [ ] 登录后 Token 正确存储
- [ ] Header 显示用户信息
- [ ] 退出登录清除 Token
- [ ] 未登录访问受保护页面跳转登录页

**商品模块**
- [ ] 商品列表正常加载
- [ ] 分类筛选正确
- [ ] 搜索功能正常
- [ ] 商品详情正确显示
- [ ] 规格选择正常

**购物车模块**
- [ ] 添加商品成功
- [ ] 购物车数量正确
- [ ] 增减数量正常
- [ ] 删除商品成功
- [ ] 总价计算正确

**订单模块**
- [ ] 创建订单成功
- [ ] 订单列表正确
- [ ] 订单详情完整
- [ ] 取消订单成功
- [ ] 订单状态正确

**地址模块**
- [ ] 地址列表加载
- [ ] 添加地址成功
- [ ] 编辑地址成功
- [ ] 删除地址成功
- [ ] 设置默认地址成功


### 使用工具测试

**推荐工具**：
1. **Postman / Apifox** - API 接口测试
2. **Chrome DevTools** - 网络请求查看
3. **Vue DevTools** - 状态管理调试

**测试步骤**：
```bash
# 1. 后端先用 Postman 测试接口
POST http://localhost:8080/api/auth/login
Body: {"username": "admin", "password": "123456"}

# 2. 确认返回格式正确
{
  "success": true,
  "data": {...},
  "message": "登录成功"
}

# 3. 前端切换到真实 API
USE_MOCK = false

# 4. 前端测试登录功能
# 5. Chrome DevTools 查看网络请求
# 6. Vue DevTools 查看 store 状态
```

---

## ❓ 常见问题

### Q1: CORS 跨域错误

**现象**：
```
Access to fetch at 'http://localhost:8080/api/auth/login' from origin 
'http://localhost:3001' has been blocked by CORS policy
```

**解决**：后端添加 CORS 配置

**Node.js (Express)**：
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
```

**Spring Boot**：
```java
@CrossOrigin(origins = "http://localhost:3001", allowCredentials = "true")
```

### Q2: Token 过期处理

**方案 1**：后端返回新 token
```javascript
// 每次请求都返回新 token（如果快过期）
response.headers['X-New-Token'] = newToken
```

**方案 2**：前端主动刷新
```javascript
// 定时刷新 token
setInterval(async () => {
  const newToken = await authApi.refreshToken()
  localStorage.setItem('token', newToken)
}, 25 * 60 * 1000) // 25 分钟刷新一次
```

### Q3: 响应格式不一致

**问题**：后端返回格式与前端期望不同

**前端适配**：在 `src/api/index.js` 添加适配层
```javascript
async function request(url, options = {}) {
  // ... 原有代码
  
  const data = await response.json()
  
  // 🆕 适配不同的响应格式
  if (data.code !== undefined) {
    // 后端返回 {code, data, msg}
    return {
      success: data.code === 200,
      data: data.data,
      message: data.msg
    }
  }
  
  return data // 标准格式 {success, data, message}
}
```

### Q4: 图片路径问题

**问题**：商品图片显示不出来

**解决**：
1. 后端返回完整 URL：`https://api.heytea.com/uploads/product1.jpg`
2. 或返回相对路径，前端拼接：
```javascript
const imageUrl = product.image.startsWith('http') 
  ? product.image 
  : `${import.meta.env.VITE_API_BASE_URL}${product.image}`
```

### Q5: 开发环境调试

**技巧**：
```javascript
// 在 src/api/index.js 添加日志
async function request(url, options = {}) {
  console.log('🚀 API Request:', url, options)
  
  const data = await response.json()
  
  console.log('✅ API Response:', url, data)
  return data
}
```


---

## 📞 联系与协作

### 前端团队需要提供给后端

1. **接口文档需求** - 参考本文档的接口定义
2. **测试前端地址** - `http://localhost:3001`
3. **Token 使用方式** - `Authorization: Bearer {token}`
4. **响应格式期望** - `{success, data, message}`

### 后端团队需要提供给前端

1. **API 基础地址** - 开发/测试/生产环境
2. **接口文档** - Swagger/Apifox 文档链接
3. **测试账号** - 用于前端调试
4. **Token 有效期** - 用于刷新策略
5. **CORS 配置确认** - 确保前端能访问

### 建议的协作流程

```
第 1 天：
- 后端提供 API 地址和文档
- 前端创建环境变量文件
- 双方确认响应格式

第 2-3 天：
- 对接用户认证模块
- 前端切换 Mock 为真实 API
- 测试登录/退出功能

第 4-7 天：
- 对接商品模块
- 测试商品列表/详情
- 测试搜索/筛选

第 8-10 天：
- 对接购物车模块
- 测试增删改查

第 11-14 天：
- 对接订单模块
- 测试订单创建/列表/详情

第 15-17 天：
- 对接地址模块
- 完整流程测试

第 18-21 天：
- Bug 修复
- 性能优化
- 上线准备
```

---

## 📚 相关文档

- **功能审查报告**：`FUNCTIONALITY_AUDIT.md`
- **API 待办清单**：`API_TODO.md`
- **功能总结**：`FEATURE_SUMMARY.md`

---

## 🎓 快速开始示例

### 示例：对接登录功能

**第 1 步**：后端启动并提供接口
```
http://localhost:8080/api/auth/login
```

**第 2 步**：创建 `.env.development`
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

**第 3 步**：修改 `src/api/auth.js`
```javascript
const USE_MOCK = false  // 关闭 Mock
```

**第 4 步**：重启前端
```bash
npm run dev
```

**第 5 步**：测试登录
- 打开 `http://localhost:3001/login`
- 输入账号密码
- 查看 Chrome DevTools Network 面板
- 确认请求发送到后端
- 确认响应格式正确
- 确认登录成功并跳转

**第 6 步**：调试问题
```javascript
// 如果有问题，打开浏览器控制台查看：
// 1. 请求地址是否正确
// 2. 响应状态码
// 3. 响应内容
// 4. 错误信息
```

---

## 🚀 上线准备

### 生产环境配置

**第 1 步**：创建 `.env.production`
```env
VITE_API_BASE_URL=https://api.heytea.com/api
```

**第 2 步**：构建生产版本
```bash
npm run build
```

**第 3 步**：部署 `dist` 目录

**第 4 步**：配置 Nginx（示例）
```nginx
server {
  listen 80;
  server_name www.heytea.com;
  
  root /var/www/heytea/dist;
  index index.html;
  
  # SPA 路由支持
  location / {
    try_files $uri $uri/ /index.html;
  }
  
  # API 代理（可选，避免 CORS）
  location /api/ {
    proxy_pass http://backend-server:8080/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

---

## 📝 总结

### 对接步骤总结

1. ✅ 确认后端 API 地址和文档
2. ✅ 创建环境变量文件
3. ✅ 按阶段逐模块对接
4. ✅ 每个模块对接后完整测试
5. ✅ 修复问题和优化
6. ✅ 生产环境部署

### 关键要点

- 🔥 统一响应格式：`{success, data, message}`
- 🔥 配置 CORS 允许前端访问
- 🔥 Token 放在 `Authorization: Bearer {token}`
- 🔥 401 自动跳转登录页
- 🔥 渐进式对接降低风险

---

**文档维护人**：前端开发团队  
**最后更新**：2026-07-23  
**版本**：v1.0

