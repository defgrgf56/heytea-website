<template>
  <header class="header" :class="{ 'header--scrolled': isScrolled }">
    <div class="header__container">
      <!-- Logo -->
      <router-link to="/" class="header__logo">
        <img src="/images/logo.webp" alt="HEYTEA 喜茶" />
      </router-link>

      <!-- 导航菜单 + 登录/用户 -->
      <nav class="header__nav">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path"
          class="header__nav-item"
          active-class="header__nav-item--active"
        >
          {{ t(item.name) }}
        </router-link>
        
        <!-- 用户菜单（已登录） -->
        <div v-if="isLoggedIn" class="header__user-wrapper">
          <button class="header__user" @click="toggleUserMenu">
            <img :src="userAvatar" alt="用户头像" class="user-avatar" />
            <span class="user-name">{{ userName }}</span>
          </button>
          
          <!-- 用户下拉菜单 -->
          <transition name="fade">
            <div v-if="isUserMenuOpen" class="user-menu" @click.stop>
              <div class="user-menu__info">
                <img :src="userAvatar" alt="用户头像" class="user-menu__avatar" />
                <div class="user-menu__details">
                  <div class="user-menu__name">{{ userName }}</div>
                  <div class="user-menu__email">{{ userEmail }}</div>
                </div>
              </div>
              <div class="user-menu__divider"></div>
              <button class="user-menu__item" @click="handleProfile">
                <span class="icon">👤</span>
                <span>{{ t('login.profile') }}</span>
              </button>
              <button class="user-menu__item" @click="handleLogout">
                <span class="icon">🚪</span>
                <span>{{ t('login.logout') }}</span>
              </button>
            </div>
          </transition>
        </div>

        <!-- 登录按钮（未登录） -->
        <router-link v-else to="/login" class="header__nav-item header__login-link">
          {{ t('login.loginBtn') }}
        </router-link>
      </nav>

      <!-- 右侧功能区（购物车 + 语言切换） -->
      <div class="header__actions">
        <!-- 购物车图标 -->
        <button class="header__cart" @click="toggleCart">
          <span class="icon-cart">🛒</span>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </button>
        
        <div class="header__language-wrapper">
          <button class="header__language" @click="toggleLanguageMenu">
            <span class="icon-globe">🌐</span>
            <span class="language-text">{{ currentLang }}</span>
          </button>
          
          <!-- 语言下拉菜单 -->
          <transition name="fade">
            <div v-if="isLanguageMenuOpen" class="language-menu" @click.stop>
              <button 
                class="language-menu__item" 
                :class="{ 'language-menu__item--active': currentLang === '简体中文' }"
                @click="selectLanguage('简体中文')"
              >
                简体中文
              </button>
              <button 
                class="language-menu__item"
                :class="{ 'language-menu__item--active': currentLang === 'English' }"
                @click="selectLanguage('English')"
              >
                English
              </button>
            </div>
          </transition>
        </div>
      </div>

      <!-- 移动端菜单按钮 -->
      <button class="header__menu-toggle" @click="toggleMobileMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- 移动端菜单 -->
    <transition name="slide">
      <div v-if="isMobileMenuOpen" class="header__mobile-menu">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path"
          class="header__mobile-menu-item"
          @click="closeMobileMenu"
        >
          {{ t(item.name) }}
        </router-link>
      </div>
    </transition>
    
    <!-- 购物车侧边栏 -->
    <CartSidebar :is-open="isCartOpen" @close="isCartOpen = false" />
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import CartSidebar from './CartSidebar.vue'

const router = useRouter()
const { locale, t } = useI18n()

const cartStore = useCartStore()
const { cartCount } = storeToRefs(cartStore)

const userStore = useUserStore()
const { isLoggedIn, userName, userAvatar } = storeToRefs(userStore)

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const isLanguageMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const isCartOpen = ref(false)

const navItems = [
  { name: 'nav.order', path: '/order' },
  { name: 'nav.brandStory', path: '/about' },
  { name: 'nav.products', path: '/products' },
  { name: 'nav.stores', path: '/stores' },
  { name: 'nav.partnership', path: '/partnership' }
]

const currentLang = ref('简体中文')

// 用户邮箱（从 store 获取）
const userEmail = computed(() => userStore.user?.email || '')

const toggleLanguageMenu = (e) => {
  e.stopPropagation()
  isLanguageMenuOpen.value = !isLanguageMenuOpen.value
  isUserMenuOpen.value = false
}

const toggleUserMenu = (e) => {
  e.stopPropagation()
  isUserMenuOpen.value = !isUserMenuOpen.value
  isLanguageMenuOpen.value = false
}

const selectLanguage = (lang) => {
  if (lang === 'English') {
    locale.value = 'en'
    currentLang.value = 'English'
  } else {
    locale.value = 'zh-CN'
    currentLang.value = '简体中文'
  }
  isLanguageMenuOpen.value = false
  console.log('切换语言:', lang, locale.value)
}

const handleProfile = () => {
  isUserMenuOpen.value = false
  router.push('/profile')
}

const handleLogout = async () => {
  isUserMenuOpen.value = false
  await userStore.logout()
  router.push('/')
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleSearch = () => {
  console.log('打开搜索')
}

const handleLogin = () => {
  console.log('打开登录')
}

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// 点击页面其他地方关闭菜单
const handleClickOutside = (e) => {
  // 检查点击是否在用户菜单或语言菜单区域内
  const target = e.target
  const isUserMenuClick = target.closest('.header__user-wrapper')
  const isLanguageMenuClick = target.closest('.header__language-wrapper')
  
  // 如果点击在菜单区域外，关闭菜单
  if (!isUserMenuClick && !isLanguageMenuClick) {
    isUserMenuOpen.value = false
    isLanguageMenuOpen.value = false
  }
}

// 保存路由守卫的清理函数
let removeRouterGuard = null

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
  // 恢复用户登录状态
  userStore.restoreUserFromStorage()
  
  // 监听路由变化，关闭所有菜单
  removeRouterGuard = router.afterEach(() => {
    isUserMenuOpen.value = false
    isLanguageMenuOpen.value = false
    isMobileMenuOpen.value = false
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
  // 清理路由守卫
  if (removeRouterGuard) {
    removeRouterGuard()
  }
})
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #ffffff;
  transition: all 0.3s ease;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.08);

  &--scrolled {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }

  &__container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 60px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    @media (max-width: 768px) {
      padding: 0 20px;
    }
  }

  &__logo {
    height: 48px;
    display: flex;
    align-items: center;
    
    img {
      height: 100%;
      width: auto;
      object-fit: contain;
    }
  }

  &__nav {
    display: flex;
    gap: 60px;
    margin-left: auto;
    margin-right: 40px;
    align-items: center;
    
    @media (max-width: 1024px) {
      gap: 40px;
      margin-right: 20px;
    }
    
    @media (max-width: 768px) {
      display: none;
    }
  }

  &__nav-item {
    color: #1a1a1a;
    text-decoration: none;
    font-size: 16px;
    font-weight: 400;
    transition: all 0.3s ease;
    position: relative;
    padding: 8px 0;
    white-space: nowrap;

    &:hover {
      color: #000;
      font-weight: 500;
    }

    &--active {
      color: #000;
      font-weight: 500;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background-color: #1a1a1a;
      }
    }
  }

  // 登录链接样式（作为导航项）
  &__login-link {
    color: #1a1a1a;
    font-weight: 500;
    
    &:hover {
      color: #000;
      font-weight: 600;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 20px;

    @media (max-width: 768px) {
      display: none;
    }
  }
  
  // 购物车按钮
  &__cart {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: #f5f5f5;
    }
    
    .icon-cart {
      font-size: 20px;
    }
    
    .cart-badge {
      position: absolute;
      top: 4px;
      right: 4px;
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      background-color: #f44336;
      color: white;
      font-size: 11px;
      font-weight: 600;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }
  }

  // 移除独立的登录按钮样式，改用导航项样式
  // &__login-btn { ... } 已删除

  &__user-wrapper {
    position: relative;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 20px;
    transition: all 0.3s ease;

    &:hover {
      background-color: #f5f5f5;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #f0f0f0;
    }

    .user-name {
      font-size: 14px;
      font-weight: 500;
      color: #1a1a1a;
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .user-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    min-width: 240px;
    z-index: 100;

    &__info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background-color: #f8f8f8;
    }

    &__avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #ffffff;
    }

    &__details {
      flex: 1;
      min-width: 0;
    }

    &__name {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__email {
      font-size: 13px;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-top: 2px;
    }

    &__divider {
      height: 1px;
      background-color: #f0f0f0;
      margin: 4px 0;
    }

    &__item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 12px 16px;
      background: none;
      border: none;
      text-align: left;
      font-size: 14px;
      color: #1a1a1a;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: #f5f5f5;
      }

      .icon {
        font-size: 18px;
        width: 20px;
        text-align: center;
      }
    }
  }

  &__language-wrapper {
    position: relative;
  }

  &__language {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    color: #1a1a1a;
    font-size: 14px;
    padding: 8px 12px;
    border-radius: 20px;
    transition: all 0.3s ease;

    &:hover {
      background-color: #f5f5f5;
    }

    .icon-globe {
      font-size: 16px;
    }

    .language-text {
      font-weight: 400;
    }
  }

  .language-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    min-width: 140px;
    z-index: 100;

    &__item {
      display: block;
      width: 100%;
      padding: 12px 20px;
      background: none;
      border: none;
      text-align: left;
      font-size: 14px;
      color: #1a1a1a;
      cursor: pointer;
      transition: all 0.2s ease;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background-color: #f5f5f5;
      }

      &--active {
        color: #000;
        font-weight: 600;
        background-color: #f8f8f8;
      }
    }
  }

  &__menu-toggle {
    display: none;
    flex-direction: column;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;

    @media (max-width: 768px) {
      display: flex;
    }

    span {
      width: 24px;
      height: 2px;
      background-color: #333;
      transition: all 0.3s ease;
    }
  }

  &__mobile-menu {
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    background-color: white;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    padding: 20px;

    @media (min-width: 769px) {
      display: none;
    }
  }

  &__mobile-menu-item {
    display: block;
    padding: 16px;
    color: #333;
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      color: #ff6b00;
      background-color: #fff5f0;
    }
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

// 图标样式 (可以替换为实际的图标库)
.icon-search::before {
  content: '🔍';
}

.icon-cart::before {
  content: '🛒';
}
</style>
