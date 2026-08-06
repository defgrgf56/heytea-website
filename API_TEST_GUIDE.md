# API 对接测试指南

**更新时间**: 2026-07-23  
**后端文档**: `茶饮业务API对接文档.md`

---

## ✅ 对接完成状态

### 已完成
- ✅ RSA 加密工具 (`src/utils/rsa.js`)
- ✅ 环境变量配置 (`.env.development`, `.env.production`)
- ✅ 认证 API 对接（登录、注册、获取用户信息）
- ✅ 商品 API 对接（商品列表、商品详情）
- ✅ 自动字段适配（后端字段 → 前端字段）

### 待完成
- ⏳ 购物车 API（后端暂无接口，继续使用 Mock）
- ⏳ 订单 API（后端暂无接口，继续使用 Mock）
- ⏳ 地址 API（后端暂无接口，继续使用 Mock）

---

## 🚀 快速开始

### 1. 重启开发服务器

**重要：修改了环境变量后必须重启！**

```bash
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
npm run dev
```

### 2. 查看日志

打开浏览器控制台，应该看到：

```
🔧 认证 API 模式: 真实后端
🔐 RSA 加密工具已加载
📦 商品 API 已加载
📡 API Base URL: https://haonan.online/api/tea-demo/v1
```

---

## 🧪 测试步骤

### 测试 1：登录功能

1. **打开登录页**: `http://localhost:3001/login`

2. **使用测试账号登录**:
   - 管理员：`admin` / `123456`
   - 普通用户：`user` / `123456`

3. **检查结果**:
   - ✅ 登录成功，跳转到首页
   - ✅ Header 显示用户昵称
   - ✅ 控制台无错误

4. **检查 Network（F12 → Network）**:
   ```
   Request URL: https://haonan.online/api/tea-demo/v1/auth/challenge?purpose=login
   Status: 200
   
   Request URL: https://haonan.online/api/tea-demo/v1/auth/login
   Status: 200
   Response: {success: true, message: "登录成功", data: {...}}
   ```

### 测试 2：商品列表

1. **打开点餐页**: `http://localhost:3001/order`

2. **检查商品加载**:
   - ✅ 商品列表正常显示
   - ✅ 显示真实后端的商品数据
   - ✅ 商品图片正常加载

3. **测试分类筛选**:
   - 点击"水果茶"、"芝士茶"等分类
   - 商品列表自动筛选

4. **测试搜索功能**:
   - 输入"葡萄"
   - 显示包含葡萄的商品

5. **检查 Network**:
   ```
   Request URL: https://haonan.online/api/tea-demo/v1/products?page=1&pageSize=12
   Status: 200
   Response: {success: true, data: {list: [...], total: 8}}
   ```

### 测试 3：商品详情

1. **点击任意商品**

2. **检查详情页**:
   - ✅ 商品信息正确显示
   - ✅ 规格选择正常（杯型、配料、甜度）
   - ✅ 价格计算正确

3. **检查 Network**:
   ```
   Request URL: https://haonan.online/api/tea-demo/v1/products/[id]
   Status: 200
   Response: {success: true, data: {...}}
   ```

### 测试 4：购物车（仍使用 Mock）

1. **添加商品到购物车**
   - ✅ 应该正常工作（使用 localStorage Mock）

2. **说明**:
   - 购物车暂时没有后端接口
   - 继续使用 Mock 数据（localStorage）
   - 功能完全正常

### 测试 5：订单（仍使用 Mock）

1. **创建订单**
   - ✅ 应该正常工作（使用 localStorage Mock）

2. **查看订单列表**
   - ✅ 应该正常显示

3. **说明**:
   - 订单暂时没有后端接口
   - 继续使用 Mock 数据
   - 功能完全正常

---

## 🔄 切换 Mock/真实 API

### 方法 1：环境变量（推荐）

**切换到真实 API**:
```env
# .env.development
VITE_USE_MOCK=false
```

**切换到 Mock**:
```env
# .env.development
VITE_USE_MOCK=true
```

**重要：修改后必须重启开发服务器！**

### 方法 2：单独控制某个模块

如果只想某个模块使用真实 API，其他继续 Mock：

```javascript
// src/api/product.js
const USE_MOCK = false  // 商品用真实 API

// src/api/cart.js
const USE_MOCK = true   // 购物车用 Mock

// src/api/order.js
const USE_MOCK = true   // 订单用 Mock
```

---

## 🐛 常见问题

### Q1: 登录失败，提示"账号或密码错误"

**原因**: 
- 账号或密码输入错误
- 或者后端服务暂时不可用

**解决**:
1. 确认账号：`admin` 密码：`123456`
2. 检查网络连接
3. 查看控制台错误信息

### Q2: 商品列表显示"加载中..."一直不显示

**原因**: 
- 后端服务不可用
- 网络请求被拦截

**解决**:
1. 打开 Network 面板，查看请求状态
2. 如果请求失败，切换到 Mock 模式：
   ```env
   VITE_USE_MOCK=true
   ```
3. 重启开发服务器

### Q3: 登录成功但商品列表不显示

**原因**: 
- 商品 API 的 Mock 开关可能还是 `true`

**解决**:
检查 `src/api/product.js` 第一行：
```javascript
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
```

确保读取了环境变量。

### Q4: 控制台报错 "crypto is not defined"

**原因**: 
- RSA 加密需要 HTTPS 环境或 localhost

**解决**:
- 本地开发时使用 `http://localhost:3001`（已支持）
- 不要使用 IP 地址如 `http://192.168.1.100:3001`

### Q5: 图片无法显示

**原因**: 
- 后端返回的图片 URL 可能需要跨域

**解决**:
- 后端图片使用的是 Unsplash CDN，应该可以正常访问
- 如果不行，检查网络连接

---

## 📊 字段映射说明

### 后端 → 前端 字段映射

| 后端字段 | 前端字段 | 说明 |
|---------|---------|------|
| `description` | `desc` | 商品描述 |
| `imageUrl` | `image` | 商品图片 |
| `categoryCode` | `category` | 分类代码 |
| `specs.sizes` | `sizes` | 杯型规格 |
| `specs.toppings` | `toppings` | 配料选项 |
| `specs.sweetness` | `sweetness` | 甜度选项 |

**说明**: 前端自动适配后端字段，无需手动修改其他代码。

---

## 🎯 下一步

### 等待后端提供的接口

1. **购物车接口**
   - `GET /cart` - 获取购物车
   - `POST /cart/items` - 添加商品
   - `PUT /cart/items/:id` - 更新数量
   - `DELETE /cart/items/:id` - 删除商品

2. **订单接口**
   - `POST /orders` - 创建订单
   - `GET /orders` - 订单列表
   - `GET /orders/:id` - 订单详情
   - `PUT /orders/:id/cancel` - 取消订单

3. **地址接口**
   - `GET /addresses` - 地址列表
   - `POST /addresses` - 添加地址
   - `PUT /addresses/:id` - 更新地址
   - `DELETE /addresses/:id` - 删除地址

### 对接步骤

当后端提供新接口时：

1. 更新对应的 `src/api/xxx.js` 文件
2. 将 Mock 函数替换为真实 API 调用
3. 适配响应字段（如需要）
4. 测试功能
5. 完成！

---

## 📞 联系方式

**如果遇到问题：**

1. 查看浏览器控制台错误
2. 查看 Network 面板请求详情
3. 参考 `茶饮业务API对接文档.md`
4. 联系后端开发人员

---

**对接完成！可以开始测试了！** 🎉

记得：
1. ✅ 重启开发服务器
2. ✅ 使用测试账号登录
3. ✅ 查看控制台日志
4. ✅ 检查 Network 面板

Good Luck! 🚀
