<template>
  <header class="header" :class="{ 'header--scrolled': isScrolled }">
    <div class="header__container">
      <!-- Logo -->
      <router-link to="/" class="header__logo">
        <img src="/images/logo.webp" alt="HEYTEA 喜茶" />
      </router-link>

      <!-- 导航菜单 -->
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
      </nav>

      <!-- 右侧功能区 -->
      <div class="header__actions">
        <div class="header__language-wrapper">
          <button class="header__language" @click="toggleLanguageMenu">
            <span class="icon-globe">🌐</span>
            <span class="language-text">{{ currentLang }}</span>
          </button>
          
          <!-- 语言下拉菜单 -->
          <transition name="fade">
            <div v-if="isLanguageMenuOpen" class="language-menu">
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
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'

const { locale, t } = useI18n()

const cartStore = useCartStore()
const { cartCount } = storeToRefs(cartStore)

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const isLanguageMenuOpen = ref(false)

const navItems = [
  { name: 'nav.brandStory', path: '/about' },
  { name: 'nav.products', path: '/products' },
  { name: 'nav.stores', path: '/stores' },
  { name: 'nav.partnership', path: '/partnership' }
]

const currentLang = ref('简体中文')

const toggleLanguageMenu = () => {
  isLanguageMenuOpen.value = !isLanguageMenuOpen.value
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
  console.log('打开购物车')
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
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

  &__actions {
    display: flex;
    align-items: center;
    gap: 16px;

    @media (max-width: 768px) {
      display: none;
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
