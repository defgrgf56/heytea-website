# 喜茶官网 Vue3 实现

这是一个使用 Vue3 + Vite 实现的喜茶官网前端项目，包含完整的页面布局和交互功能。

## 📋 项目结构

```
喜茶/
├── src/
│   ├── assets/              # 静态资源
│   ├── components/          # 公共组件
│   │   ├── Header.vue      # 顶部导航栏
│   │   ├── Footer.vue      # 页脚
│   │   ├── HeroSlider.vue  # 首页轮播
│   │   └── ProductCard.vue # 产品卡片
│   ├── views/              # 页面视图
│   │   ├── Home.vue        # 首页
│   │   ├── Products.vue    # 产品列表页
│   │   ├── ProductDetail.vue # 产品详情页
│   │   ├── Stores.vue      # 门店查询页
│   │   └── About.vue       # 关于我们页
│   ├── stores/             # Pinia 状态管理
│   │   ├── cart.js         # 购物车状态
│   │   └── product.js      # 产品状态
│   ├── router/             # 路由配置
│   │   └── index.js
│   ├── styles/             # 全局样式
│   │   └── global.scss
│   ├── App.vue             # 根组件
│   └── main.js             # 入口文件
├── index.html
├── vite.config.js          # Vite 配置
├── package.json
└── README.md
```

## 🎨 页面布局分析

### 1. 整体布局

采用经典的 **Header + Content + Footer** 三段式布局：

- **Header（固定顶部）**：包含 Logo、导航菜单、搜索、登录、购物车
- **Content（主内容区）**：各页面的主要内容
- **Footer（底部）**：品牌信息、快速链接、联系方式

### 2. 首页布局

```
├── Hero 轮播区（全屏）
├── 人气推荐（产品网格）
├── 新品上市（产品网格）
├── 品牌故事（图文混排）
└── 门店查询（搜索框）
```

### 3. 产品页布局

```
├── Hero 标题区
├── 分类筛选（横向标签）
└── 产品网格（响应式布局）
```

### 4. 产品详情页布局

```
├── 左侧：产品大图
└── 右侧：
    ├── 产品信息
    ├── 规格选择（温度、甜度）
    ├── 数量选择
    └── 操作按钮
```

### 5. 门店查询页布局

```
├── 左侧边栏：
│   ├── 搜索框
│   ├── 城市筛选
│   └── 统计信息
└── 右侧：门店卡片列表
```

## 🚀 技术栈

- **框架**：Vue 3 (Composition API)
- **构建工具**：Vite
- **状态管理**：Pinia
- **路由**：Vue Router 4
- **轮播组件**：Swiper
- **样式**：SCSS
- **HTTP 客户端**：Axios

## 🎯 核心功能

### 1. 响应式设计
- 桌面端、平板、移动端完美适配
- 断点：768px (移动端)、1024px (平板)、1440px (桌面端)

### 2. 交互特性
- 平滑的页面过渡动画
- 鼠标悬停效果
- 滚动时 Header 样式变化
- 产品卡片的 Hover 放大效果

### 3. 状态管理
- 购物车管理（添加、删除、更新数量）
- 产品数据管理
- 分类筛选

### 4. 路由配置
- 页面懒加载
- 滚动位置恢复
- 平滑的页面切换

## 📦 安装和运行

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 🎨 设计特点

### 1. 色彩系统
- **主色**：橙色 (#ff6b00) - 代表活力和热情
- **辅助色**：渐变色的使用（橙色渐变、紫色渐变）
- **中性色**：黑白灰的合理搭配

### 2. 排版
- **标题层级**：清晰的视觉层次
- **字体大小**：从 13px 到 72px 的完整体系
- **行高**：1.5 - 2.0 的舒适阅读体验

### 3. 间距系统
- **xs**: 8px
- **sm**: 16px
- **md**: 24px
- **lg**: 32px
- **xl**: 48px

### 4. 圆角规范
- **小圆角**: 8px (按钮、输入框)
- **中圆角**: 12-16px (卡片)
- **大圆角**: 24px (大型容器)
- **圆形**: 50% (头像、圆形按钮)

### 5. 阴影层次
- **sm**: 轻微阴影 (0 2px 8px)
- **md**: 标准阴影 (0 4px 16px)
- **lg**: 强阴影 (0 8px 32px)

## 🔧 Vue3 实现要点

### 1. Composition API
使用 `<script setup>` 语法，代码更简洁：

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

onMounted(() => {
  console.log('组件已挂载')
})
</script>
```

### 2. 组件化设计
- 可复用的 ProductCard 组件
- 独立的 Header/Footer 组件
- 业务组件与展示组件分离

### 3. 响应式数据
使用 Pinia 进行全局状态管理：

```javascript
export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const cartCount = computed(() => items.value.length)
  
  const addItem = (product) => {
    items.value.push(product)
  }
  
  return { items, cartCount, addItem }
})
```

### 4. 路由懒加载
提升首屏加载性能：

```javascript
{
  path: '/products',
  component: () => import('../views/Products.vue')
}
```

## 📱 响应式设计

### 移动端优化
- 汉堡菜单
- 堆叠式布局
- 触摸友好的按钮尺寸
- 优化的图片加载

### 平板适配
- 灵活的网格布局
- 适中的间距
- 平衡的视觉比例

## 🎯 可扩展功能

### 待实现功能
- [ ] 用户登录/注册
- [ ] 会员系统
- [ ] 订单管理
- [ ] 支付集成
- [ ] 地图 API 集成
- [ ] 实时库存查询
- [ ] 优惠券系统
- [ ] 评价系统
- [ ] 小程序同步

### API 集成
项目使用模拟数据，实际应用中需要：
1. 配置后端 API 地址
2. 实现 axios 拦截器
3. 添加 token 认证
4. 错误处理

## 📝 注意事项

1. **图片资源**：需要添加实际的产品图片到 `/public/images/` 目录
2. **Logo**：需要提供喜茶 Logo 图片
3. **环境变量**：生产环境需要配置实际的 API 地址
4. **浏览器兼容**：建议使用现代浏览器，支持 ES6+

## 📄 License

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

---

**注意**：此项目仅用于学习和演示目的，所有品牌资产归喜茶所有。
