# API 使用文档

**更新时间**: 2026-07-23  
**版本**: v1.0

---

## 📋 目录

1. [快速开始](#快速开始)
2. [API 配置](#api-配置)
3. [商品 API](#商品-api)
4. [购物车 API](#购物车-api)
5. [订单 API](#订单-api)
6. [地址 API](#地址-api)
7. [用户认证 API](#用户认证-api)
8. [切换 Mock/真实 API](#切换-mock真实-api)

---

## 🚀 快速开始

### 导入 API

```javascript
import { productApi, cartApi, orderApi, addressApi, authApi } from '@/api'
```

### 使用示例

```javascript
// 获取商品列表
const response = await productApi.getProducts({ category: 'tea' })

// 添加到购物车
await cartApi.addItem(product)

// 创建订单
await orderApi.createOrder(orderData)
```

---

## ⚙️ API 配置

### 基础配置

文件位置：`src/api/index.js`

**功能特性：**
- ✅ 自动添加 Token 到请求头
- ✅ 统一错误处理
- ✅ 请求/响应拦截器
- ✅ 开发环境日志输出
- ✅ 401 自动跳转登录
- ✅ 网络错误处理

### 环境变量配置

创建 `.env.development` 文件：

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 📦 商品 API

### 1. 获取商品列表

```javascript
import { productApi } from '@/api'

const response = await productApi.getProducts({
  category: 'tea',      // 可选：分类（all/tea/fruit/cheese/coffee）
  search: '芝士',       // 可选：搜索关键词
  page: 1,             // 可选：页码
  pageSize: 20         // 可选：每页数量
})

// 响应格式
{
  success: true,
  data: {
    items: [...],      // 商品列表
    total: 8,          // 总数量
    page: 1,           // 当前页
    pageSize: 20,      // 每页数量
    totalPages: 1      // 总页数
  }
}
```

### 2. 获取商品详情

```javascript
const response = await productApi.getProductDetail(productId)

// 响应格式
{
  success: true,
  data: {
    id: 1,
    name: '芝士莓莓',
    price: 28,
    // ... 完整商品信息
  }
}
```

---

## 🛒 购物车 API

### 1. 获取购物车

```javascript
import { cartApi } from '@/api'

const response = await cartApi.getCart()

// 响应格式
{
  success: true,
  data: {
    items: [...],       // 购物车商品列表
    totalPrice: 56      // 总价
  }
}
```

### 2. 添加商品到购物车

```javascript
await cartApi.addItem({
  id: 1,
  name: '芝士莓莓',
  price: 28,
  selectedSize: 'medium',
  selectedToppings: ['珍珠'],
  selectedSweetness: '标准糖',
  quantity: 1
})
```

### 3. 更新商品数量

```javascript
await cartApi.updateQuantity(cartItemId, newQuantity)
```

### 4. 删除商品

```javascript
await cartApi.removeItem(cartItemId)
```

### 5. 清空购物车

```javascript
await cartApi.clearCart()
```

---

## 📦 订单 API

### 1. 创建订单

```javascript
import { orderApi } from '@/api'

const response = await orderApi.createOrder({
  items: [
    {
      productId: 1,
      name: '芝士莓莓',
      quantity: 2,
      price: 28,
      selectedSize: '中杯',
      selectedToppings: ['珍珠'],
      selectedSweetness: '标准糖'
    }
  ],
  totalAmount: 56,
  deliveryFee: 5,
  address: {
    name: '张三',
    phone: '13800138000',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detail: '科技园XX路XX号'
  },
  remark: '少冰' // 可选
})

// 响应格式
{
  success: true,
  data: {
    id: 1001,
    orderNo: 'HT202607231234567',
    status: 'pending',
    // ... 完整订单信息
  }
}
```

### 2. 获取订单列表

```javascript
const response = await orderApi.getOrders({
  status: 'pending',   // 可选：订单状态
  page: 1,            // 可选：页码
  pageSize: 10        // 可选：每页数量
})

// 订单状态：
// - pending: 待支付
// - confirmed: 已确认
// - preparing: 制作中
// - completed: 已完成
// - cancelled: 已取消
```

### 3. 获取订单详情

```javascript
const response = await orderApi.getOrderDetail(orderId)
```

### 4. 取消订单

```javascript
await orderApi.cancelOrder(orderId)
```

### 5. 再来一单

```javascript
// 将订单商品添加到购物车
await orderApi.reorder(orderId)
```

---

## 📍 地址 API

### 1. 获取地址列表

```javascript
import { addressApi } from '@/api'

const response = await addressApi.getAddresses()

// 响应格式
{
  success: true,
  data: [
    {
      id: 1,
      name: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园XX路XX号',
      isDefault: true
    }
  ]
}
```

### 2. 添加地址

```javascript
await addressApi.addAddress({
  name: '李四',
  phone: '13900139000',
  province: '广东省',
  city: '深圳市',
  district: '福田区',
  detail: '华强北XX大厦',
  isDefault: false  // 可选
})
```

### 3. 更新地址

```javascript
await addressApi.updateAddress(addressId, {
  name: '张三',
  phone: '13800138000',
  // ... 其他字段
})
```

### 4. 删除地址

```javascript
await addressApi.deleteAddress(addressId)
```

### 5. 设置默认地址

```javascript
await addressApi.setDefaultAddress(addressId)
```

### 6. 获取默认地址

```javascript
const response = await addressApi.getDefaultAddress()
```

---

## 🔐 用户认证 API

### 1. 登录

```javascript
import { authApi } from '@/api'

const response = await authApi.login({
  username: 'admin',
  password: '123456'
})

// 响应格式
{
  success: true,
  data: {
    token: 'xxx',
    user: {
      id: 1,
      username: 'admin',
      nickname: '用户一',
      // ...
    }
  }
}
```

### 2. 注册

```javascript
await authApi.register({
  username: 'newuser',
  email: 'newuser@example.com',
  password: '123456'
})
```

### 3. 获取当前用户信息

```javascript
const response = await authApi.getCurrentUser()
```

### 4. 更新用户信息

```javascript
await authApi.updateProfile({
  nickname: '新昵称',
  avatar: '/images/new-avatar.jpg'
})
```

---

## 🔄 切换 Mock/真实 API

### 方法 1：全局切换（推荐）

在各个 API 文件中修改 `USE_MOCK` 开关：

```javascript
// src/api/product.js
const USE_MOCK = false  // 改为 false 使用真实 API

// src/api/cart.js
const USE_MOCK = false

// src/api/order.js
const USE_MOCK = false

// src/api/address.js
const USE_MOCK = false
```

### 方法 2：环境变量切换

在 `.env.development` 中配置：

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 方法 3：渐进式切换

可以部分模块使用 Mock，部分使用真实 API：

```javascript
// 商品用真实 API
const USE_MOCK = false  // product.js

// 其他仍用 Mock
const USE_MOCK = true   // cart.js, order.js, address.js
```

---

## 📊 响应格式规范

### 成功响应

```json
{
  "success": true,
  "data": { /* 实际数据 */ },
  "message": "操作成功"
}
```

### 失败响应

```json
{
  "success": false,
  "data": null,
  "message": "错误描述"
}
```

---

## 🐛 错误处理

### 自动处理的错误

API 配置层会自动处理以下错误：

- **401 未认证**: 自动跳转登录页
- **403 无权限**: Toast 提示
- **404 资源不存在**: Toast 提示
- **422 参数错误**: Toast 提示错误信息
- **500 服务器错误**: Toast 提示"服务器繁忙"
- **网络错误**: Toast 提示"网络连接失败"

### 手动处理错误

```javascript
try {
  const response = await productApi.getProducts()
  if (response.success) {
    // 处理成功
  }
} catch (error) {
  // 这里的错误已经被 Toast 提示过了
  // 可以做额外的处理（如日志记录）
  console.error('获取商品失败:', error)
}
```

---

## 🛠️ 开发工具

### 查看所有商品

在浏览器控制台输入：

```javascript
window.showMockProducts()
```

### 模拟订单状态变化

```javascript
// 自动模拟订单从待支付到完成的过程
window.mockOrderProgress(orderId)
```

---

## 📝 使用建议

### 1. 在 Store 中使用

```javascript
// src/stores/product.js
import { productApi } from '@/api'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  
  async function fetchProducts(params) {
    const response = await productApi.getProducts(params)
    if (response.success) {
      products.value = response.data.items
    }
  }
  
  return { products, fetchProducts }
})
```

### 2. 在组件中使用

```javascript
// 推荐：通过 Store
const productStore = useProductStore()
await productStore.fetchProducts()

// 不推荐：直接调用（除非是一次性操作）
import { productApi } from '@/api'
await productApi.getProducts()
```

### 3. 错误处理最佳实践

```javascript
async function loadProducts() {
  loading.value = true
  error.value = null
  
  try {
    const response = await productApi.getProducts()
    if (response.success) {
      products.value = response.data.items
    }
  } catch (err) {
    error.value = err.message
    // Toast 已自动提示，这里不需要重复提示
  } finally {
    loading.value = false
  }
}
```

---

## 🔗 相关文档

- **API 对接清单**: `API_TODO.md`
- **后端集成指南**: `BACKEND_INTEGRATION_GUIDE.md`
- **功能审查报告**: `FUNCTIONALITY_AUDIT.md`

---

**维护人**: 前端开发团队  
**最后更新**: 2026-07-23  
**版本**: v1.0

