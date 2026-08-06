import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import i18n from './i18n'
import App from './App.vue'
import './styles/global.scss'
import { useUserStore } from './stores/user'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// 恢复登录状态
const userStore = useUserStore()
userStore.restoreUserFromStorage()

console.log('🔐 用户登录状态已恢复:', userStore.isLoggedIn)

app.mount('#app')
