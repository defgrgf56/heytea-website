<template>
  <section class="hero-section">
    <!-- 主内容区域 -->
    <div class="hero-main">
      <div class="hero-container">
        <!-- 左侧菜单 -->
        <div class="hero-menu">
          <div 
            v-for="(item, index) in menuItems" 
            :key="index"
            class="hero-menu__item"
            :class="{ 'active': activeIndex === index }"
            @click="scrollToSection(index)"
          >
            {{ item.title }}
          </div>
        </div>

        <!-- 右侧内容区 -->
        <div class="hero-content">
          <div class="hero-content__wrapper">
            <div 
              v-for="(item, index) in menuItems" 
              :key="index"
              :ref="el => sectionRefs[index] = el"
              class="hero-section-item"
              :data-index="index"
            >
              <div class="hero-content__inner">
                <div class="hero-content__text">
                  <!-- Logo灵感区块 -->
                  <div v-if="item.content === 'logoInspiration'" class="content-layout">
                    <div class="content-layout__text">
                      <h2>LOGO</h2>
                      <h3>{{ t('hero.logoInspiration') }}</h3>
                      <p>{{ t('hero.logoInspirationDesc') }}</p>
                    </div>
                    <div class="content-layout__image content-layout__image--logo">
                      <img src="/images/tupian/image.png" :alt="t('hero.logoInspiration')" />
                    </div>
                  </div>

                  <!-- 起源区块 -->
                  <div v-else-if="item.content === 'origin'" class="content-layout">
                    <div class="content-layout__text">
                      <h2>{{ t('hero.origin') }}</h2>
                      <p>{{ t('hero.originDesc') }}</p>
                    </div>
                    <div class="content-layout__image content-layout__image--origin">
                      <img src="/images/tupian/image copy.png" :alt="t('hero.origin')" />
                    </div>
                  </div>

                  <!-- 开创区块 -->
                  <div v-else-if="item.content === 'innovation'">
                    <h2>{{ t('hero.innovation') }}</h2>
                    <p>{{ t('hero.innovationDesc') }}</p>
                  </div>

                  <!-- 改名区块 -->
                  <div v-else-if="item.content === 'rename'">
                    <h2>{{ t('hero.rename') }}</h2>
                    <p>{{ t('hero.renameDesc') }}</p>
                  </div>

                  <!-- 推动区块 -->
                  <div v-else-if="item.content === 'promote'">
                    <h2>{{ t('hero.promote') }}</h2>
                    <p>{{ t('hero.promoteDesc') }}</p>
                  </div>

                  <!-- 以灵感重新想象茶区块 -->
                  <div v-else-if="item.content === 'reimagine'">
                    <h2>{{ t('hero.reimagine') }}</h2>
                    <p>{{ t('hero.reimagineDesc') }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚区域 - 独立横跨整个宽度 -->
    <div class="hero-footer">
      <Footer />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUpdate, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Footer from './Footer.vue'

const { t } = useI18n()

const activeIndex = ref(0)
const sectionRefs = ref([])
const isScrolling = ref(false)

// 在更新之前清空 refs 数组
onBeforeUpdate(() => {
  sectionRefs.value = []
})

const menuItems = computed(() => [
  {
    title: t('hero.logoInspiration'),
    content: 'logoInspiration'
  },
  {
    title: t('hero.origin'),
    content: 'origin'
  },
  {
    title: t('hero.innovation'),
    content: 'innovation'
  },
  {
    title: t('hero.rename'),
    content: 'rename'
  },
  {
    title: t('hero.promote'),
    content: 'promote'
  },
  {
    title: t('hero.reimagine'),
    content: 'reimagine'
  }
])

// 滚动到指定区域
const scrollToSection = (index) => {
  if (!sectionRefs.value[index]) return
  
  isScrolling.value = true
  activeIndex.value = index
  
  const section = sectionRefs.value[index]
  const offsetTop = section.getBoundingClientRect().top + window.pageYOffset
  
  window.scrollTo({
    top: offsetTop - 70, // 减去header高度
    behavior: 'smooth'
  })
  
  // 平滑滚动结束后重置标志
  setTimeout(() => {
    isScrolling.value = false
  }, 1000)
}

// 处理滚动事件，更新激活的菜单项
const handleScroll = () => {
  if (isScrolling.value) return
  
  const scrollTop = window.pageYOffset + 200 // 增加偏移量，让切换更灵敏
  
  // 找到当前可见的区域
  for (let i = sectionRefs.value.length - 1; i >= 0; i--) {
    const section = sectionRefs.value[i]
    if (section) {
      const rect = section.getBoundingClientRect()
      const offsetTop = rect.top + window.pageYOffset
      
      // 如果区域在视口中间或以上，就激活对应菜单
      if (offsetTop <= scrollTop) {
        activeIndex.value = i
        break
      }
    }
  }
  
  // 特殊处理：如果滚动到接近底部，确保最后一个菜单被激活
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  if (window.pageYOffset + windowHeight >= documentHeight - 100) {
    activeIndex.value = menuItems.length - 1
  }
}

onMounted(() => {
  // 监听页面滚动
  window.addEventListener('scroll', handleScroll)
  // 初始化时滚动到顶部
  window.scrollTo(0, 0)
})

onUnmounted(() => {
  // 移除滚动监听
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.hero-section {
  width: 100%;
  margin-top: 70px;
  background-color: #ffffff;
}

// 主内容区域
.hero-main {
  width: 100%;
  min-height: calc(100vh - 70px);
}

.hero-container {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  min-height: calc(100vh - 70px);
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

// 左侧菜单
.hero-menu {
  width: 240px;
  padding: 80px 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  flex-shrink: 0;
  position: sticky;
  top: 70px;
  align-self: flex-start;
  max-height: calc(100vh - 70px);
  overflow-y: auto;
  
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    padding: 40px 20px;
    gap: 24px;
    height: auto;
    position: static;
  }

  &__item {
    font-size: 15px;
    color: #999;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 8px 0;
    position: relative;
    white-space: nowrap;

    &:hover {
      color: #333;
    }

    &.active {
      color: #1a1a1a;
      font-weight: 500;

      &::before {
        content: '';
        position: absolute;
        left: -40px;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 20px;
        background-color: #1a1a1a;
        
        @media (max-width: 768px) {
          display: none;
        }
      }
    }
  }
}

// 右侧内容区
.hero-content {
  flex: 1;
  
  @media (max-width: 768px) {
    width: 100%;
  }
}

.hero-content__wrapper {
  // 内容包装器
}

.hero-section-item {
  min-height: calc(100vh - 70px);
  padding: 80px 80px 80px 120px;
  display: flex;
  align-items: center;
  
  @media (max-width: 1024px) {
    padding: 60px 40px;
  }
  
  @media (max-width: 768px) {
    padding: 40px 20px;
    min-height: auto;
  }

  &:last-child {
    min-height: auto;
    padding-bottom: 80px;
  }
}

.hero-content__inner {
  max-width: 800px;
  width: 100%;
}

.hero-content__text {
  color: #666;
  line-height: 2;
  
  h2 {
    font-size: 36px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 20px;
    
    @media (max-width: 768px) {
      font-size: 28px;
    }
  }

  h3 {
    font-size: 28px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 24px;
    
    @media (max-width: 768px) {
      font-size: 24px;
    }
  }

  p {
    font-size: 16px;
    line-height: 2;
    color: #666;
    margin-bottom: 20px;
    text-align: justify;
    
    @media (max-width: 768px) {
      font-size: 15px;
      line-height: 1.8;
    }
  }
}

// 内容布局
.content-layout {
  display: flex;
  align-items: flex-start;
  gap: 60px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
  }

  &__text {
    flex: 1;

    p {
      max-width: 450px;
    }
  }

  &__image {
    flex: 0 0 auto;
    max-width: 500px;

    @media (max-width: 768px) {
      max-width: 100%;
      margin-top: 0 !important;
      margin-right: 0 !important;
    }

    img {
      width: 100%;
      height: auto;
      border-radius: 8px;
    }

    // Logo灵感图片位置
    &--logo {
      margin-top: -150px;

      @media (max-width: 768px) {
        margin-top: 0;
      }
    }

    // 起源图片位置
    &--origin {
      margin-top: -400px;
      margin-right: -150px;

      @media (max-width: 768px) {
        margin-top: 0;
        margin-right: 0;
      }
    }
  }
}

// 页脚区域 - 独立横跨整个宽度
.hero-footer {
  width: 100%;
  background-color: #ffffff;
}
</style>
