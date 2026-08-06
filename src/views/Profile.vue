<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- 用户信息卡片 -->
      <div class="profile-card">
        <div class="profile-header">
          <img :src="userAvatar" alt="头像" class="profile-avatar" />
          <div class="profile-info">
            <h2 class="profile-name">{{ userName }}</h2>
            <p class="profile-email">{{ userEmail }}</p>
          </div>
        </div>
      </div>

      <!-- 菜单列表 -->
      <div class="menu-section">
        <h3 class="section-title">{{ t('profile.myAccount') }}</h3>
        <div class="menu-list">
          <router-link to="/orders" class="menu-item">
            <span class="menu-icon">📦</span>
            <span class="menu-text">{{ t('profile.myOrders') }}</span>
            <span class="menu-arrow">›</span>
          </router-link>
          
          <div class="menu-item" @click="showEditProfile = true">
            <span class="menu-icon">👤</span>
            <span class="menu-text">{{ t('profile.editProfile') }}</span>
            <span class="menu-arrow">›</span>
          </div>
          
          <div class="menu-item" @click="showChangePassword = true">
            <span class="menu-icon">🔒</span>
            <span class="menu-text">{{ t('profile.changePassword') }}</span>
            <span class="menu-arrow">›</span>
          </div>
        </div>
      </div>

      <div class="menu-section">
        <h3 class="section-title">{{ t('profile.settings') }}</h3>
        <div class="menu-list">
          <div class="menu-item">
            <span class="menu-icon">🌐</span>
            <span class="menu-text">{{ t('profile.language') }}</span>
            <span class="menu-value">{{ currentLang }}</span>
          </div>
          
          <div class="menu-item" @click="clearCache">
            <span class="menu-icon">🗑️</span>
            <span class="menu-text">{{ t('profile.clearCache') }}</span>
            <span class="menu-arrow">›</span>
          </div>
        </div>
      </div>

      <!-- 退出登录按钮 -->
      <button class="logout-btn" @click="handleLogout">
        {{ t('profile.logout') }}
      </button>
    </div>

    <!-- 编辑资料弹窗 -->
    <transition name="fade">
      <div v-if="showEditProfile" class="modal-overlay" @click="showEditProfile = false">
        <div class="modal-content" @click.stop>
          <h3>{{ t('profile.editProfile') }}</h3>
          <div class="form-group">
            <label>{{ t('profile.nickname') }}</label>
            <input v-model="editForm.nickname" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label>{{ t('profile.email') }}</label>
            <input v-model="editForm.email" type="email" class="form-input" />
          </div>
          <div class="modal-actions">
            <button class="btn-cancel" @click="showEditProfile = false">
              {{ t('profile.cancel') }}
            </button>
            <button class="btn-save" @click="saveProfile">
              {{ t('profile.save') }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 修改密码弹窗 -->
    <transition name="fade">
      <div v-if="showChangePassword" class="modal-overlay" @click="showChangePassword = false">
        <div class="modal-content" @click.stop>
          <h3>{{ t('profile.changePassword') }}</h3>
          <div class="form-group">
            <label>{{ t('profile.oldPassword') }}</label>
            <input v-model="passwordForm.oldPassword" type="password" class="form-input" />
          </div>
          <div class="form-group">
            <label>{{ t('profile.newPassword') }}</label>
            <input v-model="passwordForm.newPassword" type="password" class="form-input" />
          </div>
          <div class="form-group">
            <label>{{ t('profile.confirmPassword') }}</label>
            <input v-model="passwordForm.confirmPassword" type="password" class="form-input" />
          </div>
          <div class="modal-actions">
            <button class="btn-cancel" @click="showChangePassword = false">
              {{ t('profile.cancel') }}
            </button>
            <button class="btn-save" @click="changePassword">
              {{ t('profile.save') }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const router = useRouter()
const { t, locale } = useI18n()
const userStore = useUserStore()

const showEditProfile = ref(false)
const showChangePassword = ref(false)

// 安全地获取用户信息的计算属性
const userName = computed(() => userStore.user?.username || '')
const userEmail = computed(() => userStore.user?.email || '')
const userAvatar = computed(() => userStore.user?.avatar || '/images/default-avatar.png')

const currentLang = computed(() => locale.value === 'zh-CN' ? '简体中文' : 'English')

const editForm = reactive({
  nickname: '',
  email: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 监听用户数据变化，更新表单
watch(() => userStore.user, (user) => {
  if (user) {
    editForm.nickname = user.username || ''
    editForm.email = user.email || ''
  }
}, { immediate: true, deep: true })

// 保存资料
function saveProfile() {
  // TODO: 调用 API 更新用户信息
  alert(t('profile.saveSuccess'))
  showEditProfile.value = false
}

// 修改密码
function changePassword() {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert(t('profile.passwordNotMatch'))
    return
  }
  // TODO: 调用 API 修改密码
  alert(t('profile.changePasswordSuccess'))
  showChangePassword.value = false
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

// 清除缓存
function clearCache() {
  if (confirm(t('profile.confirmClearCache'))) {
    localStorage.removeItem('heytea_orders')
    alert(t('profile.clearCacheSuccess'))
  }
}

// 退出登录
async function handleLogout() {
  if (confirm(t('profile.confirmLogout'))) {
    await userStore.logout()
    router.push('/')
  }
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-top: 70px;
}

.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px 20px;
}

.profile-card {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1a1a1a;
}

.profile-email {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.menu-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #999;
  margin: 0 0 12px 0;
  padding: 0 4px;
}

.menu-list {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  text-decoration: none;
  color: #1a1a1a;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8f8f8;
  }

  .menu-icon {
    font-size: 20px;
    margin-right: 12px;
  }

  .menu-text {
    flex: 1;
    font-size: 15px;
  }

  .menu-value {
    font-size: 14px;
    color: #999;
    margin-right: 8px;
  }

  .menu-arrow {
    font-size: 20px;
    color: #ccc;
  }
}

.logout-btn {
  width: 100%;
  padding: 14px;
  background-color: white;
  color: #f44336;
  border: 1px solid #f44336;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'KaiTi', 'STKaiti', '楷体', 'SimKai', serif;

  &:hover {
    background-color: #fff5f5;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background-color: white;
  border-radius: 16px;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

  h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 24px 0;
  }
}

.form-group {
  margin-bottom: 20px;

  label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    color: #333;
  }

  .form-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 15px;
    font-family: 'KaiTi', 'STKaiti', '楷体', 'SimKai', serif;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: #1a1a1a;
    }
  }
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;

  button {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'KaiTi', 'STKaiti', '楷体', 'SimKai', serif;
  }

  .btn-cancel {
    background-color: #f5f5f5;
    color: #666;

    &:hover {
      background-color: #e5e5e5;
    }
  }

  .btn-save {
    background-color: #1a1a1a;
    color: white;

    &:hover {
      background-color: #000;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .profile-avatar {
    width: 60px;
    height: 60px;
  }

  .profile-name {
    font-size: 20px;
  }
}
</style>
