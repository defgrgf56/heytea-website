# 快速开始指南

## 前置要求

确保你的系统已安装：
- Node.js (v16.0 或更高版本)
- npm 或 yarn

检查版本：
```bash
node --version
npm --version
```

## 安装步骤

### 1. 安装依赖

在项目根目录运行：

```bash
npm install
```

或使用 yarn：

```bash
yarn install
```

### 2. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动，浏览器会自动打开。

### 3. 开发

现在你可以开始编辑代码了！修改后浏览器会自动刷新。

## 项目命令

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## 目录说明

```
src/
├── components/     # 可复用组件
├── views/         # 页面组件
├── stores/        # 状态管理
├── router/        # 路由配置
├── styles/        # 全局样式
└── assets/        # 静态资源
```

## 开发流程

### 1. 创建新页面

1. 在 `src/views/` 创建新的 `.vue` 文件
2. 在 `src/router/index.js` 添加路由配置

示例：
```javascript
{
  path: '/my-page',
  name: 'MyPage',
  component: () => import('../views/MyPage.vue')
}
```

### 2. 创建新组件

1. 在 `src/components/` 创建新的 `.vue` 文件
2. 在需要的地方导入使用

示例：
```vue
<script setup>
import MyComponent from '@/components/MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

### 3. 添加状态管理

1. 在 `src/stores/` 创建新的 store 文件
2. 使用 Pinia 定义 store

示例：
```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMyStore = defineStore('my-store', () => {
  const data = ref([])
  
  const fetchData = async () => {
    // 获取数据逻辑
  }
  
  return { data, fetchData }
})
```

## 常见问题

### Q: 端口被占用怎么办？

A: 修改 `vite.config.js` 中的端口配置：
```javascript
server: {
  port: 3001  // 改为其他端口
}
```

### Q: 如何添加图片？

A: 将图片放在 `public/images/` 目录下，然后使用：
```vue
<img src="/images/your-image.jpg" alt="description" />
```

### Q: 如何使用 SCSS 变量？

A: 在 `src/styles/global.scss` 中定义变量，然后在组件中导入使用。

### Q: 如何调试？

A: 使用浏览器开发者工具 (F12)，或者安装 Vue DevTools 扩展。

## 部署

### 构建生产版本

```bash
npm run build
```

构建结果在 `dist/` 目录。

### 部署到服务器

将 `dist/` 目录的内容上传到你的服务器或静态托管服务（如 Vercel、Netlify）。

## 技术支持

如有问题，请查看：
- [Vue 3 文档](https://cn.vuejs.org/)
- [Vite 文档](https://cn.vitejs.dev/)
- [Pinia 文档](https://pinia.vuejs.org/zh/)
- [Vue Router 文档](https://router.vuejs.org/zh/)

---

祝你开发愉快！ 🎉
