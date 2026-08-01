<template>
  <section class="stores-section">
    <!-- 主内容区域 -->
    <div class="stores-main">
      <div class="stores-container">
        <!-- 左侧菜单 -->
        <div class="stores-menu">
          <div 
            v-for="(item, index) in menuItems" 
            :key="index"
            class="stores-menu__item"
            :class="{ 'active': activeIndex === index }"
            @click="switchSection(index)"
          >
            {{ item.title }}
          </div>
        </div>

        <!-- 右侧内容区 - 独立滚动 -->
        <div class="stores-content">
          <!-- HEYTEA 页面 -->
          <div v-show="activeIndex === 0" class="stores-page">
            <div class="page-content">
              <div class="image-section">
                <img src="/images/tupian/m-1.png" alt="HEYTEA" />
              </div>
              <div class="image-section">
                <img src="/images/tupian/m-1.png" alt="HEYTEA" />
              </div>
              <div class="image-section">
                <img src="/images/tupian/m-1.png" alt="HEYTEA" />
              </div>
            </div>
          </div>

          <!-- HEYTEA LAB 页面 -->
          <div v-show="activeIndex === 1" class="stores-page">
            <div class="page-content">
              <h2>HEYTEA LAB</h2>
              <p>这里是HEYTEA LAB的介绍内容...</p>
              <p>可以添加更多内容来测试滚动效果...</p>
            </div>
          </div>

          <!-- HEYTEA TEABAR 页面 -->
          <div v-show="activeIndex === 2" class="stores-page">
            <div class="page-content">
              <h2>HEYTEA TEABAR</h2>
              <p>这里是HEYTEA TEABAR的介绍内容...</p>
              <p>可以添加更多内容来测试滚动效果...</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚区域 - 独立横跨整个宽度 -->
    <div class="stores-footer">
      <Footer />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import Footer from '@/components/Footer.vue'

const activeIndex = ref(0)

const menuItems = [
  { title: 'heytea' },
  { title: 'heytea lab' },
  { title: 'heytea teabar' }
]

// 切换显示的页面
const switchSection = (index) => {
  activeIndex.value = index
}
</script>

<style lang="scss" scoped>
.stores-section {
  width: 100%;
  margin-top: 70px;
  background-color: #ffffff;
}

// 主内容区域
.stores-main {
  width: 100%;
  min-height: calc(100vh - 70px);
}

.stores-container {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  min-height: calc(100vh - 70px);
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

// 左侧菜单 - 固定不滚动
.stores-menu {
  width: 240px;
  padding: 120px 40px 80px 80px;
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
    font-size: 18px;
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
        left: -80px;
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
.stores-content {
  flex: 1;
  
  @media (max-width: 768px) {
    width: 100%;
  }
}

// 每个页面
.stores-page {
  width: 100%;
  min-height: calc(100vh - 70px);
  
  &:last-child {
    min-height: auto;
  }
}

// 页面内容
.page-content {
  padding: 80px 80px 80px 120px;
  
  @media (max-width: 1024px) {
    padding: 60px 40px;
  }
  
  @media (max-width: 768px) {
    padding: 40px 20px;
  }

  h2 {
    font-size: 36px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 20px;
    
    @media (max-width: 768px) {
      font-size: 28px;
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

// 图片区域
.image-section {
  width: 100%;
  margin-bottom: 40px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
  }
}

// 页脚区域 - 独立横跨整个宽度
.stores-footer {
  width: 100%;
  background-color: #ffffff;
}
</style>
