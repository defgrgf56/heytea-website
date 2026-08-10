<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- 用户信息卡片 -->
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar-container">
            <img :src="userAvatar" alt="头像" class="profile-avatar" />
            <div class="avatar-overlay" @click="triggerAvatarUpload">
              <span class="camera-icon">📷</span>
              <span class="change-text">更换</span>
            </div>
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleAvatarChange"
            />
          </div>
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
          
          <div class="menu-item" @click="showAddressList = true">
            <span class="menu-icon">📍</span>
            <span class="menu-text">{{ t('profile.addresses') }}</span>
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
    
    <!-- 地址列表弹窗 -->
    <transition name="fade">
      <div v-if="showAddressList" class="modal-overlay" @click="showAddressList = false">
        <div class="modal-content modal-content--wide" @click.stop>
          <div class="modal-header">
            <h3>{{ t('profile.addresses') }}</h3>
            <button class="btn-add-address" @click="openAddressForm()">
              + {{ t('address.addNew') }}
            </button>
          </div>
          
          <div v-if="addresses.length === 0" class="empty-address">
            <span class="empty-icon">📍</span>
            <p>{{ t('address.empty') }}</p>
          </div>
          
          <div v-else class="address-list">
            <div v-for="addr in addresses" :key="addr.id" class="address-card">
              <div class="address-header">
                <span class="address-name">{{ addr.name }}</span>
                <span class="address-phone">{{ addr.phone }}</span>
                <span v-if="addr.isDefault" class="address-default">{{ t('address.default') }}</span>
              </div>
              <p class="address-detail">{{ addr.address }}</p>
              <div class="address-actions">
                <button class="btn-text" @click="openAddressForm(addr)">{{ t('address.edit') }}</button>
                <button class="btn-text" @click="deleteAddress(addr.id)">{{ t('address.delete') }}</button>
                <button v-if="!addr.isDefault" class="btn-text" @click="setDefaultAddress(addr.id)">
                  {{ t('address.setDefault') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- 地址表单弹窗 -->
    <transition name="fade">
      <div v-if="showAddressForm" class="modal-overlay" @click="showAddressForm = false">
        <div class="modal-content" @click.stop>
          <h3>{{ editingAddressId ? t('address.edit') : t('address.addNew') }}</h3>
          <div class="form-group">
            <label>{{ t('address.name') }} *</label>
            <input v-model="addressForm.name" type="text" class="form-input" :placeholder="t('address.namePlaceholder')" />
          </div>
          <div class="form-group">
            <label>{{ t('address.phone') }} *</label>
            <input v-model="addressForm.phone" type="tel" class="form-input" :placeholder="t('address.phonePlaceholder')" />
          </div>
          <div class="form-group">
            <label>{{ t('address.region') }}</label>
            <div class="region-input" @click="openRegionPicker">
              <span :class="['region-text', { placeholder: !addressForm.province }]">
                {{ regionDisplayText }}
              </span>
              <span class="region-arrow">›</span>
            </div>
          </div>
          <div class="form-group">
            <label>{{ t('address.detail') }} *</label>
            <textarea v-model="addressForm.detail" class="form-textarea" rows="3" :placeholder="t('address.detailPlaceholder')"></textarea>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="addressForm.isDefault" type="checkbox" />
              <span>{{ t('address.setAsDefault') }}</span>
            </label>
          </div>
          <div class="modal-actions">
            <button class="btn-cancel" @click="showAddressForm = false">
              {{ t('profile.cancel') }}
            </button>
            <button class="btn-save" @click="saveAddress">
              {{ t('profile.save') }}
            </button>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- 省市区选择器弹窗 -->
    <transition name="fade">
      <div v-if="showRegionPicker" class="region-picker-overlay" @click="showRegionPicker = false">
        <div class="region-picker" @click.stop>
          <div class="region-picker-header">
            <button v-if="regionPickerStep !== 'province'" class="back-btn" @click="goBackRegionPicker">
              ‹
            </button>
            <span class="region-picker-title">
              {{ regionPickerStep === 'province' ? '选择省份' : regionPickerStep === 'city' ? '选择城市' : '选择区县' }}
            </span>
            <button class="close-btn" @click="showRegionPicker = false">✕</button>
          </div>
          
          <div class="region-picker-body">
            <!-- 省份列表 -->
            <div v-if="regionPickerStep === 'province'" class="region-list">
              <div
                v-for="province in provinces"
                :key="province"
                class="region-item"
                @click="selectProvince(province)"
              >
                {{ province }}
              </div>
            </div>
            
            <!-- 城市列表 -->
            <div v-if="regionPickerStep === 'city'" class="region-list">
              <div
                v-for="city in cities"
                :key="city"
                class="region-item"
                @click="selectCity(city)"
              >
                {{ city }}
              </div>
            </div>
            
            <!-- 区县列表 -->
            <div v-if="regionPickerStep === 'district'" class="region-list">
              <div
                v-for="district in districts"
                :key="district"
                class="region-item"
                @click="selectDistrict(district)"
              >
                {{ district }}
              </div>
            </div>
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
import { useAddressStore } from '@/stores/address'
import { getProvinces, getCities, getDistricts } from '@/utils/regions'
import toast from '@/utils/toast'

const router = useRouter()
const { t, locale } = useI18n()
const userStore = useUserStore()
const addressStore = useAddressStore()

const showEditProfile = ref(false)
const showChangePassword = ref(false)
const showAddressList = ref(false)
const showAddressForm = ref(false)
const editingAddressId = ref(null)
const showRegionPicker = ref(false)
const regionPickerStep = ref('province') // 'province', 'city', 'district'
const avatarInput = ref(null) // 头像上传 input 引用

// 安全地获取用户信息的计算属性
const userName = computed(() => userStore.user?.nickname || userStore.user?.username || '')
const userEmail = computed(() => userStore.user?.email || '')
const userAvatar = computed(() => {
  // 优先从 localStorage 读取头像
  if (userStore.user) {
    const userId = userStore.user.id || userStore.user.username
    const savedAvatar = localStorage.getItem(`avatar_${userId}`)
    if (savedAvatar) {
      return savedAvatar
    }
  }
  // 如果没有保存的头像，使用用户对象中的头像或默认头像
  return userStore.user?.avatar || '/images/default-avatar.png'
})

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

const addressForm = reactive({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
})

// 省市区数据
const provinces = computed(() => getProvinces())
const cities = computed(() => {
  return addressForm.province ? getCities(addressForm.province) : []
})
const districts = computed(() => {
  return addressForm.province && addressForm.city 
    ? getDistricts(addressForm.province, addressForm.city) 
    : []
})

// 地址列表
const addresses = computed(() => addressStore.addresses)

// 监听用户数据变化，更新表单
watch(() => userStore.user, (user) => {
  if (user) {
    editForm.nickname = user.nickname || user.username || ''
    editForm.email = user.email || ''
  }
}, { immediate: true, deep: true })

// 保存资料
async function saveProfile() {
  const loadingId = toast.loading('正在保存...')
  
  try {
    // 调用 updateProfile 接口
    const { authApi } = await import('@/api')
    const updateResult = await authApi.updateProfile({
      nickname: editForm.nickname,
      email: editForm.email
    })
    
    console.log('✅ 用户资料更新成功:', updateResult)
    
    // 更新本地 store 和 localStorage
    if (userStore.user) {
      userStore.user.nickname = editForm.nickname
      userStore.user.email = editForm.email
      localStorage.setItem('user', JSON.stringify(userStore.user))
    }
    
    toast.dismiss(loadingId)
    toast.success(t('profile.saveSuccess'))
    showEditProfile.value = false
  } catch (error) {
    console.error('❌ 保存资料失败:', error)
    toast.dismiss(loadingId)
    toast.error(error.message || '保存失败，请重试')
  }
}

// 修改密码
async function changePassword() {
  // 验证密码
  if (!passwordForm.oldPassword) {
    toast.error('请输入旧密码')
    return
  }
  
  if (!passwordForm.newPassword) {
    toast.error('请输入新密码')
    return
  }
  
  if (passwordForm.newPassword.length < 6) {
    toast.error('新密码长度不能少于 6 位')
    return
  }
  
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.error(t('profile.passwordNotMatch'))
    return
  }
  
  const loadingId = toast.loading('正在修改密码...')
  
  try {
    // 调用修改密码接口（使用 RSA 加密）
    const { authApi } = await import('@/api')
    await authApi.changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })
    
    console.log('✅ 密码修改成功')
    
    toast.dismiss(loadingId)
    toast.success(t('profile.changePasswordSuccess'))
    
    // 清空表单
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    showChangePassword.value = false
    
    // 密码修改成功后，旧 Token 失效，需要重新登录
    setTimeout(async () => {
      await userStore.logout()
      router.push('/login')
      toast.info('请使用新密码重新登录')
    }, 1500)
  } catch (error) {
    console.error('❌ 修改密码失败:', error)
    toast.dismiss(loadingId)
    toast.error(error.message || '修改密码失败，请重试')
  }
}

// 清除缓存
async function clearCache() {
  const confirmed = await toast.confirm(t('profile.confirmClearCache'))
  if (confirmed) {
    localStorage.removeItem('heytea_orders')
    toast.success(t('profile.clearCacheSuccess'))
  }
}

// 退出登录
async function handleLogout() {
  const confirmed = await toast.confirm(t('profile.confirmLogout'))
  if (confirmed) {
    await userStore.logout()
    router.push('/')
  }
}

// 地址管理
function openAddressForm(address = null) {
  if (address) {
    editingAddressId.value = address.id
    addressForm.name = address.name
    addressForm.phone = address.phone
    addressForm.province = address.province || ''
    addressForm.city = address.city || ''
    addressForm.district = address.district || ''
    addressForm.detail = address.detail
    addressForm.isDefault = address.isDefault
  } else {
    editingAddressId.value = null
    resetAddressForm()
  }
  showAddressForm.value = true
}

function resetAddressForm() {
  addressForm.name = ''
  addressForm.phone = ''
  addressForm.province = ''
  addressForm.city = ''
  addressForm.district = ''
  addressForm.detail = ''
  addressForm.isDefault = false
}

function saveAddress() {
  if (!addressForm.name || !addressForm.phone || !addressForm.detail) {
    toast.error(t('address.fillRequired'))
    return
  }
  
  const addressData = {
    name: addressForm.name,
    phone: addressForm.phone,
    province: addressForm.province,
    city: addressForm.city,
    district: addressForm.district,
    detail: addressForm.detail,
    address: `${addressForm.province}${addressForm.city}${addressForm.district}${addressForm.detail}`,
    isDefault: addressForm.isDefault
  }
  
  if (editingAddressId.value) {
    addressStore.updateAddress(editingAddressId.value, addressData)
    toast.success(t('address.updateSuccess'))
  } else {
    addressStore.addAddress(addressData)
    toast.success(t('address.addSuccess'))
  }
  
  showAddressForm.value = false
  resetAddressForm()
}

async function deleteAddress(id) {
  const confirmed = await toast.confirm(t('address.confirmDelete'))
  if (confirmed) {
    addressStore.deleteAddress(id)
    toast.success(t('address.deleteSuccess'))
  }
}

function setDefaultAddress(id) {
  addressStore.setDefaultAddress(id)
  toast.success(t('address.setDefaultSuccess'))
}

// 省市区选择器
function openRegionPicker() {
  regionPickerStep.value = 'province'
  showRegionPicker.value = true
}

function selectProvince(province) {
  addressForm.province = province
  addressForm.city = ''
  addressForm.district = ''
  regionPickerStep.value = 'city'
}

function selectCity(city) {
  addressForm.city = city
  addressForm.district = ''
  regionPickerStep.value = 'district'
}

function selectDistrict(district) {
  addressForm.district = district
  showRegionPicker.value = false
}

function goBackRegionPicker() {
  if (regionPickerStep.value === 'district') {
    regionPickerStep.value = 'city'
  } else if (regionPickerStep.value === 'city') {
    regionPickerStep.value = 'province'
  }
}

const regionDisplayText = computed(() => {
  const parts = []
  if (addressForm.province) parts.push(addressForm.province)
  if (addressForm.city) parts.push(addressForm.city)
  if (addressForm.district) parts.push(addressForm.district)
  return parts.length > 0 ? parts.join(' / ') : t('address.region')
})

// 头像上传功能
function triggerAvatarUpload() {
  avatarInput.value?.click()
}

async function handleAvatarChange(event) {
  const file = event.target.files[0]
  if (!file) return
  
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    toast.error('请选择图片文件')
    return
  }
  
  // 检查文件大小（限制 2MB）
  if (file.size > 2 * 1024 * 1024) {
    toast.error('图片大小不能超过 2MB')
    return
  }
  
  const loadingId = toast.loading('正在上传头像...')
  
  try {
    // 方案1：尝试上传到服务器（普通用户接口）
    try {
      const { uploadApi } = await import('@/api')
      const uploadResult = await uploadApi.uploadUserImage(file)
      
      console.log('✅ 图片上传成功，URL:', uploadResult.url)
      
      // 更新用户头像到服务器
      const { authApi } = await import('@/api')
      await authApi.updateProfile({
        avatar: uploadResult.url
      })
      
      console.log('✅ 用户资料更新成功')
      
      // 更新本地 store 和 localStorage
      if (userStore.user) {
        userStore.user.avatar = uploadResult.url
        localStorage.setItem('user', JSON.stringify(userStore.user))
        
        // 清除本地 Base64 头像（如果有）
        const userId = userStore.user.id || userStore.user.username
        localStorage.removeItem(`avatar_${userId}`)
      }
      
      toast.dismiss(loadingId)
      toast.success('头像更新成功')
    } catch (uploadError) {
      console.warn('⚠️ 服务器上传失败，使用本地存储:', uploadError.message)
      
      // 方案2：服务器上传失败，使用 Base64 本地存储作为后备
      const compressedBase64 = await compressImage(file, 200, 200, 0.7)
      
      if (userStore.user) {
        userStore.user.avatar = compressedBase64
        
        const userId = userStore.user.id || userStore.user.username
        
        try {
          localStorage.setItem(`avatar_${userId}`, compressedBase64)
          
          const userCopy = { ...userStore.user }
          delete userCopy.avatar
          localStorage.setItem('user', JSON.stringify(userCopy))
          
          toast.dismiss(loadingId)
          toast.success('头像已保存到本地（仅当前设备可见）')
        } catch (storageError) {
          toast.dismiss(loadingId)
          toast.error('头像太大，请选择更小的图片')
        }
      }
    }
  } catch (error) {
    console.error('❌ 头像处理失败:', error)
    toast.dismiss(loadingId)
    toast.error(error.message || '头像处理失败，请重试')
  }
  
  // 清空 input，允许重复选择同一文件
  event.target.value = ''
}

/**
 * 压缩图片
 * @param {File} file - 原始图片文件
 * @param {number} maxWidth - 最大宽度
 * @param {number} maxHeight - 最大高度
 * @param {number} quality - 压缩质量 (0-1)
 * @returns {Promise<string>} Base64 字符串
 */
function compressImage(file, maxWidth = 200, maxHeight = 200, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        // 创建 canvas
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // 计算缩放比例
        let width = img.width
        let height = img.height
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        // 设置 canvas 尺寸
        canvas.width = width
        canvas.height = height
        
        // 绘制图片
        ctx.drawImage(img, 0, 0, width, height)
        
        // 转换为 Base64（JPEG 格式，质量 0.7）
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
        
        console.log('✅ 图片压缩完成')
        console.log('原始大小:', (file.size / 1024).toFixed(2), 'KB')
        console.log('压缩后大小:', (compressedBase64.length / 1024).toFixed(2), 'KB')
        
        resolve(compressedBase64)
      }
      
      img.onerror = () => {
        reject(new Error('图片加载失败'))
      }
      
      img.src = e.target.result
    }
    
    reader.onerror = () => {
      reject(new Error('图片读取失败'))
    }
    
    reader.readAsDataURL(file)
  })
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

.avatar-container {
  position: relative;
  width: 80px;
  height: 80px;
  cursor: pointer;
  
  &:hover .avatar-overlay {
    opacity: 1;
  }
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
  transition: all 0.3s ease;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  .camera-icon {
    font-size: 24px;
    margin-bottom: 4px;
  }
  
  .change-text {
    font-size: 12px;
    color: white;
    font-weight: 500;
  }
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

// 地址管理样式
.modal-content--wide {
  max-width: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    margin: 0;
  }
  
  .btn-add-address {
    padding: 8px 16px;
    background-color: #1a1a1a;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: #000;
    }
  }
}

.empty-address {
  text-align: center;
  padding: 40px 20px;
  
  .empty-icon {
    font-size: 60px;
    display: block;
    margin-bottom: 12px;
    opacity: 0.3;
  }
  
  p {
    color: #999;
    margin: 0;
  }
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.address-card {
  padding: 16px;
  background-color: #f8f8f8;
  border-radius: 8px;
  
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

.region-select {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.region-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
  
  &:hover {
    border-color: #1a1a1a;
    background-color: #f8f8f8;
  }
  
  .region-text {
    flex: 1;
    font-size: 15px;
    color: #1a1a1a;
    
    &.placeholder {
      color: #999;
    }
  }
  
  .region-arrow {
    font-size: 20px;
    color: #999;
  }
}

// 省市区选择器
.region-picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.region-picker {
  background-color: white;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    max-height: 85vh;
  }
}

.region-picker-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  
  .back-btn,
  .close-btn {
    position: absolute;
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    font-size: 24px;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
    
    &:hover {
      color: #1a1a1a;
    }
  }
  
  .back-btn {
    left: 16px;
  }
  
  .close-btn {
    right: 16px;
  }
  
  .region-picker-title {
    font-size: 18px;
    font-weight: 600;
  }
}

.region-picker-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  min-height: 0;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f5f5f5;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
    
    &:hover {
      background: #ccc;
    }
  }
}

.region-list {
  display: flex;
  flex-direction: column;
  min-height: min-content;
}

.region-item {
  padding: 14px 24px;
  font-size: 15px;
  color: #1a1a1a;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f8f8f8;
  }
  
  &:active {
    background-color: #f0f0f0;
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  font-family: 'KaiTi', 'STKaiti', '楷体', 'SimKai', serif;
  resize: vertical;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #1a1a1a;
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
  
  span {
    font-size: 14px;
    color: #333;
  }
}

@media (max-width: 768px) {
  .avatar-container {
    width: 60px;
    height: 60px;
  }
  
  .profile-avatar {
    width: 60px;
    height: 60px;
  }
  
  .avatar-overlay {
    width: 60px;
    height: 60px;
    
    .camera-icon {
      font-size: 20px;
    }
    
    .change-text {
      font-size: 10px;
    }
  }

  .profile-name {
    font-size: 20px;
  }
  
  .modal-content--wide {
    max-width: 100%;
  }
}
</style>
