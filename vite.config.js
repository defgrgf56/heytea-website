import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,  // 修改为后端允许的端口
    open: true,
    proxy: {
      '/api': {
        target: 'https://haonan.online',
        changeOrigin: true,
        secure: true
      }
    }
  }
})
