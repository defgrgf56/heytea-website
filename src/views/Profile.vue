<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- 左侧菜单 -->
      <aside class="profile-sidebar">
        <div class="user-info">
          <img :src="userAvatar" alt="头像" class="user-avatar" />
          <h3 class="user-name">{{ userName }}</h3>
          <p class="user-email">{{ userEmail }}</p>
        </div>
        
        <nav class="profile-nav">
          <button 
            v-for="item in menuItems" 
            :key="item.key"
            class="nav-item"
            :class="{ 'nav-item--active': activeMenu === item.key }"
            @click="activeMenu = item.key"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-text">{{ t(item.label) }}</span>
          </button>
        </nav>
      </aside>

      <!-- 右侧内容区 -->
      <main class="profile-content">
        <!-- 我的订单 -->
        <div v-if="activeMenu === 'orders'" class="content-section">
          <h2 class="section-title">{{ t('profile.myOrders') }}</h2>
          <div class="orders-list">
            <div v-if="orders.length === 0" class="empty-state">
              <span class="empty-icon">📦</span>
              <p>{{ t('profile.noOrders') }}</p>
              <router-link to="/order" class="btn-primary">{{ t('profile.goOrder') }}</router-link>
            </div>
            <div v-else>
              <div v-for="order in orders" :key="order.id" class="order-card">
                <div class="order-header">
                  <span class="order-number">{{ t('profile.orderNumber') }}: {{ order.id }}</span>
                  <span class="order-status" :class="`status-${order.status}`">
                    {{ t(`order.status.${order.status}`) }}
                  </span>
                </div>
                <div class="order-body">
                  <div v-for="item in order.items" :key="item.id" class="order-item">
                    <img :src="item.image" :alt="item.name" class="item-image" />
                    <div class="item-info">
                      <p class="item-name">{{ item.name }}</p>
                      <p class="item-specs">{{ item.size }} / {{ item.ice }} / {{ item.sugar }}</p>
                    </div>
                    <span class="item-quantity">x{{ item.quantity }}</span>
                    <span class="item-price">¥{{ item.price }}</span>
                  </div>
                </div>
                <div class="order-footer">
                  <span class="order-time">{{ formatDate(order.createdAt) }}</span>
                  <span class="order-total">{{ t('profile.total') }}: ¥{{ order.totalAmount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 个人资料 -->
        <div v-if="activeMenu === 'info'" class="content-section">
          <h2 class="section-title">{{ t('profile.personalInfo') }}</h2>
          <div class="info-form">
            <div class="form-group">
              <label>{{ t('profile.avatar') }}</label>
              <div class="avatar-upload">
                <img :src="editForm.avatar" alt="头像" class="avatar-preview" />
                <button class="btn-upload">{{ t('profile.changeAvatar') }}</button>
              </div>
            </div>
            <div class="form-group">
              <label>{{ t('profile.nickname') }}</label>
              <input v-model="editForm.nickname" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label>{{ t('profile.email') }}</label>
              <input v-model="editForm.email" type="email" class="form-input" />
            </div>
            <div class="form-group">
              <label>{{ t('profile.phone') }}</label>
              <input v-model="editForm.phone" type="tel" class="form-input" placeholder="未设置" />
            </div>
            <button class="btn-save" @click="saveProfile">{{ t('profile.save') }}</button>
          </div>
        </div>

        <!-- 收货地址 -->
        <div v-if="activeMenu === 'address'" class="content-section">
          <h2 class="section-title">{{ t('profile.addresses') }}</h2>
          <div class="address-list">
            <div v-if="addresses.length === 0" class="empty-state">
              <span class="empty-icon">📍</span>
              <p>{{ t('profile.noAddress') }}</p>
            </div>
            <div v-else class="address-cards">
              <div v-for="addr in addresses" :key="addr.id" class="address-card">
                <div class="address-header">
                  <span class="address-name">{{ addr.name }}</span>
                  <span class="address-phone">{{ addr.phone }}</span>
                  <span v-if="addr.isDefault" class="address-default">{{ t('profile.default') }}</span>
                </div>
                <p class="address-detail">{{ addr.address }}</p>
                <div class="address-actions">
                  <button class="btn-text">{{ t('profile.edit') }}</button>
                  <button class="btn-text">{{ t('profile.delete') }}</button>
                  <button v-if="!addr.isDefault" class="btn-text">{{ t('profile.setDefault') }}</button>
                </div>
              </div>
            </div>
            <button class="btn-add">+ {{ t('profile.addAddress') }}</button>
          </div>
        </div>

        <!-- 账号设置 -->
        <div v-if="activeMenu === 'settings'" class="content-section">
          <h2 class="section-title">{{ t('profile.accountSettings') }}</h2>
          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-icon">🔒</span>
                <div class="setting-text">
                  <h4>{{ t('profile.changePassword') }}</h4>
                  <p>{{ t('profile.passwordDesc') }}</p>
                </div>
              </div>
              <button class="btn-secondary" @click="showChangePassword = true">
                {{ t('profile.change') }}
              </button>
            </div>
            
            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-icon">🌐</span>
                <div class="setting-text">
                  <h4>{{ t('profile.language') }}</h4>
                  <p>{{ currentLang }}</p>
                </div>
              </div>
            </div>
            
            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-icon">🗑️</span>
                <div class="setting-text">
                  <h4>{{ t('profile.clearCache') }}</h4>
                  <p>{{ t('profile.cacheDesc') }}</p>
                </div>
              </div>
              <button class="btn-secondary" @click="clearCache">
                {{ t('profile.clear') }}
              </button>
            </div>
            
            <div class="setting-item danger">
              <div class="setting-info">
                <span class="setting-icon">🚪</span>
                <div class="setting-text">
                  <h4>{{ t('profile.logout') }}</h4>
                  <p>{{ t('profile.logoutDesc') }}</p>
                </div>
              </div>
              <button class="btn-danger" @click="handleLogout">
                {{ t('profile.logout') }}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>

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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useOrderStore } from '@/stores/order'
import { storeToRefs } from 'pinia'

const router = useRouter()
const { t, locale } = useI18n()
const userStore = useUserStore()
const orderStore = useOrderStore()

const { userName, userEmail, userAvatar } = storeToRefs(userStore)
const { orders } = storeToRefs(orderStore)

const activeMenu = ref('orders')
const showChangePassword = ref(false)

const menuItems = [
  { key: 'orders', icon: '📦', label: 'profile.myOrders' },
  { key: 'info', icon: '👤', label: 'profile.personalInfo' },
  { key: 'address', icon: '📍', label: 'profile.addresses' },
  { key: 'settings', icon: '⚙️', label: 'profile.accountSettings' }
]

const currentLang = computed(() => locale.value === 'zh-CN' ? '简体中文' : 'English')

const editForm = reactive({
  avatar: userAvatar.value,
  nickname: userName.value,
  email: userEmail.value,
  phone: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const addresses = ref([
  // 示例数据
  // {
  //   id: 1,
  //   name: '张三',
  //   phone: '138****8888',
  //   address: '广东省深圳市南山区科技园南区',
  //   isDefault: true
  // }
])

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 保存资料
function saveProfile() {
  // TODO: 调用 API 更新用户信息
  alert(t('profile.saveSuccess'))
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

onMounted(() => {
  // 加载用户订单
  orderStore.loadOrdersFromStorage()
})
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-top: 70px;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  display: flex;
  gap: 30px;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

// 左侧边栏
.profile-sidebar {
  width: 260px;
  flex-shrink: 0;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
  @media (max-width: 768px) {
    width: 100%;
  }
}

.user-info {
  padding: 30px 20px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
  margin-bottom: 12px;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: #1a1a1a;
}

.user-email {
  font-size: 13px;
  color: #999;
  margin: 0;
}

.profile-nav {
  padding: 10px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 14px 20px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
  font-size: 15px;
  border-left: 3px solid transparent;
  
  &:hover {
    background-color: #f8f8f8;
    color: #1a1a1a;
  }
  
  &--active {
    background-color: #f8f8f8;
    color: #1a1a1a;
    font-weight: 600;
    border-left-color: #1a1a1a;
  }
}

.nav-icon {
  font-size: 18px;
  margin-right: 12px;
  width: 24px;
  text-align: center;
}

.nav-text {
  flex: 1;
}

// 右侧内容区
.profile-content {
  flex: 1;
  min-width: 0;
}

.content-section {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
  @media (max-width: 768px) {
    padding: 20px;
  }
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 24px 0;
  color: #1a1a1a;
}

// 订单列表
.orders-list {
  .order-card {
    background-color: #f8f8f8;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e5e5;
  }
  
  .order-number {
    font-size: 14px;
    color: #666;
  }
  
  .order-status {
    font-size: 13px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 12px;
    
    &.status-pending {
      background-color: #fff3cd;
      color: #856404;
    }
    
    &.status-processing {
      background-color: #cfe2ff;
      color: #084298;
    }
    
    &.status-completed {
      background-color: #d1e7dd;
      color: #0f5132;
    }
    
    &.status-cancelled {
      background-color: #f8d7da;
      color: #842029;
    }
  }
  
  .order-body {
    margin-bottom: 12px;
  }
  
  .order-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    
    .item-image {
      width: 50px;
      height: 50px;
      border-radius: 6px;
      object-fit: cover;
    }
    
    .item-info {
      flex: 1;
      min-width: 0;
      
      .item-name {
        font-size: 14px;
        font-weight: 500;
        margin: 0 0 4px 0;
        color: #1a1a1a;
      }
      
      .item-specs {
        font-size: 12px;
        color: #999;
        margin: 0;
      }
    }
    
    .item-quantity {
      font-size: 14px;
      color: #666;
      margin-right: 16px;
    }
    
    .item-price {
      font-size: 15px;
      font-weight: 600;
      color: #1a1a1a;
    }
  }
  
  .order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid #e5e5e5;
    font-size: 13px;
    
    .order-time {
      color: #999;
    }
    
    .order-total {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
    }
  }
}

// 个人资料表单
.info-form {
  max-width: 600px;
}

.form-group {
  margin-bottom: 24px;
  
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

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 16px;
  
  .avatar-preview {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #f0f0f0;
  }
  
  .btn-upload {
    padding: 8px 16px;
    background-color: #f5f5f5;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    
    &:hover {
      background-color: #e5e5e5;
    }
  }
}

// 地址列表
.address-cards {
  .address-card {
    background-color: #f8f8f8;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .address-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    
    .address-name {
      font-size: 15px;
      font-weight: 600;
      color: #1a1a1a;
    }
    
    .address-phone {
      font-size: 14px;
      color: #666;
    }
    
    .address-default {
      padding: 2px 8px;
      background-color: #1a1a1a;
      color: white;
      font-size: 12px;
      border-radius: 4px;
    }
  }
  
  .address-detail {
    font-size: 14px;
    color: #666;
    margin: 0 0 12px 0;
    line-height: 1.5;
  }
  
  .address-actions {
    display: flex;
    gap: 16px;
    
    .btn-text {
      background: none;
      border: none;
      color: #1a1a1a;
      font-size: 13px;
      cursor: pointer;
      padding: 0;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.btn-add {
  width: 100%;
  padding: 12px;
  margin-top: 16px;
  background-color: #f8f8f8;
  border: 1px dashed #ccc;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f0f0f0;
    border-color: #999;
    color: #333;
  }
}

// 设置列表
.settings-list {
  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #f8f8f8;
    border-radius: 8px;
    margin-bottom: 12px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    &.danger {
      background-color: #fff5f5;
    }
  }
  
  .setting-info {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    
    .setting-icon {
      font-size: 24px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      border-radius: 8px;
    }
    
    .setting-text {
      h4 {
        font-size: 15px;
        font-weight: 600;
        margin: 0 0 4px 0;
        color: #1a1a1a;
      }
      
      p {
        font-size: 13px;
        color: #999;
        margin: 0;
      }
    }
  }
}

// 按钮样式
.btn-primary {
  display: inline-block;
  padding: 10px 24px;
  background-color: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #000;
  }
}

.btn-secondary {
  padding: 8px 16px;
  background-color: white;
  color: #1a1a1a;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f8f8f8;
    border-color: #999;
  }
}

.btn-danger {
  padding: 8px 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #d32f2f;
  }
}

.btn-save {
  padding: 12px 24px;
  background-color: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #000;
  }
}

// 空状态
.empty-state {
  text-align: center;
  padding: 60px 20px;
  
  .empty-icon {
    font-size: 64px;
    display: block;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  p {
    font-size: 15px;
    color: #999;
    margin: 0 0 24px 0;
  }
}

// 弹窗
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
</style>
