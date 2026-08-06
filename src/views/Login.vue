<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Logo -->
      <div class="login-header">
        <img src="/images/logo.webp" alt="HEYTEA" class="login-logo" />
        <h1 class="login-title">{{ isRegisterMode ? t('login.registerTitle') : t('login.title') }}</h1>
      </div>

      <!-- 登录/注册表单 -->
      <form class="login-form" @submit.prevent="handleSubmit">
        <!-- 用户名 -->
        <div class="form-group">
          <label class="form-label">{{ t('login.username') }}</label>
          <input
            v-model="formData.username"
            type="text"
            class="form-input"
            :placeholder="t('login.usernamePlaceholder')"
            required
          />
        </div>

        <!-- 邮箱（仅注册时显示） -->
        <div v-if="isRegisterMode" class="form-group">
          <label class="form-label">{{ t('login.email') }}</label>
          <input
            v-model="formData.email"
            type="email"
            class="form-input"
            :placeholder="t('login.emailPlaceholder')"
            required
          />
        </div>

        <!-- 密码 -->
        <div class="form-group">
          <label class="form-label">{{ t('login.password') }}</label>
          <input
            v-model="formData.password"
            type="password"
            class="form-input"
            :placeholder="t('login.passwordPlaceholder')"
            required
            minlength="6"
          />
        </div>

        <!-- 确认密码（仅注册时显示） -->
        <div v-if="isRegisterMode" class="form-group">
          <label class="form-label">{{ t('login.confirmPassword') }}</label>
          <input
            v-model="formData.confirmPassword"
            type="password"
            class="form-input"
            :placeholder="t('login.confirmPasswordPlaceholder')"
            required
            minlength="6"
          />
        </div>

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- 提交按钮 -->
        <button 
          type="submit" 
          class="submit-btn"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">
            {{ isRegisterMode ? t('login.registerBtn') : t('login.loginBtn') }}
          </span>
          <span v-else class="loading">
            {{ t('login.loading') }}
          </span>
        </button>

        <!-- 切换登录/注册 -->
        <div class="form-footer">
          <button 
            type="button" 
            class="toggle-mode-btn"
            @click="toggleMode"
          >
            {{ isRegisterMode ? t('login.hasAccount') : t('login.noAccount') }}
          </button>
        </div>
      </form>

      <!-- 返回首页 -->
      <router-link to="/" class="back-home">
        {{ t('login.backHome') }}
      </router-link>
    </div>

    <!-- 背景装饰 -->
    <div class="login-bg">
      <div class="bg-circle bg-circle-1"></div>
      <div class="bg-circle bg-circle-2"></div>
      <div class="bg-circle bg-circle-3"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import toast from '@/utils/toast'

const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()

// 表单模式：登录 or 注册
const isRegisterMode = ref(false)

// 表单数据
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 加载状态和错误信息
const isLoading = ref(false)
const errorMessage = ref('')

/**
 * 切换登录/注册模式
 */
function toggleMode() {
  isRegisterMode.value = !isRegisterMode.value
  errorMessage.value = ''
  // 清空表单
  formData.email = ''
  formData.confirmPassword = ''
}

/**
 * 表单提交
 */
async function handleSubmit() {
  errorMessage.value = ''
  
  // 注册时验证密码
  if (isRegisterMode.value) {
    if (formData.password !== formData.confirmPassword) {
      errorMessage.value = t('login.passwordNotMatch')
      return
    }
  }

  isLoading.value = true

  try {
    if (isRegisterMode.value) {
      // 注册
      const result = await userStore.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })

      if (result.success) {
        // 注册成功，切换到登录模式
        toast.success(t('login.registerSuccess'))
        isRegisterMode.value = false
        formData.password = ''
        formData.confirmPassword = ''
      } else {
        errorMessage.value = result.message || t('login.registerFailed')
      }
    } else {
      // 登录
      const result = await userStore.login({
        username: formData.username,
        password: formData.password
      })

      if (result.success) {
        // 登录成功，跳转到首页
        router.push('/')
      } else {
        errorMessage.value = result.message || t('login.loginFailed')
      }
    }
  } catch (error) {
    errorMessage.value = error.message || t('login.networkError')
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;
  padding: 40px 20px;
}

.login-container {
  width: 100%;
  max-width: 450px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  padding: 48px 40px;
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 40px 24px;
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-logo {
  height: 60px;
  width: auto;
  margin-bottom: 24px;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  font-family: 'KaiTi', 'STKaiti', '楷体', 'SimKai', serif;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.05);
  }

  &::placeholder {
    color: #999;
  }
}

.error-message {
  padding: 12px 16px;
  background-color: #fff5f5;
  border: 1px solid #ffdddd;
  border-radius: 8px;
  color: #d32f2f;
  font-size: 14px;
  text-align: center;
}

.submit-btn {
  width: 100%;
  height: 48px;
  background-color: #1a1a1a;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'KaiTi', 'STKaiti', '楷体', 'SimKai', serif;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;

  &:hover:not(:disabled) {
    background-color: #000;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .loading {
    display: inline-block;
    animation: pulse 1.5s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.form-footer {
  text-align: center;
  margin-top: 16px;
}

.toggle-mode-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  font-family: 'KaiTi', 'STKaiti', '楷体', 'SimKai', serif;
  transition: color 0.3s ease;

  &:hover {
    color: #1a1a1a;
  }
}

.back-home {
  display: block;
  text-align: center;
  margin-top: 24px;
  color: #666;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #1a1a1a;
  }
}

// 背景装饰
.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.03) 0%, rgba(26, 26, 26, 0.01) 100%);
  animation: float 20s ease-in-out infinite;
}

.bg-circle-1 {
  width: 400px;
  height: 400px;
  top: -200px;
  right: -100px;
  animation-delay: 0s;
}

.bg-circle-2 {
  width: 300px;
  height: 300px;
  bottom: -150px;
  left: -80px;
  animation-delay: 5s;
}

.bg-circle-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 10%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}
</style>
