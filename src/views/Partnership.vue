<template>
  <section class="partnership-section">
    <!-- 主内容区域 -->
    <div class="partnership-main">
      <div class="partnership-container">
        <!-- 左侧内容 -->
        <div class="partnership-left">
          <!-- 标题和图标 -->
          <div class="partnership-header">
            <h1 class="partnership-title">{{ t('partnership.title') }}</h1>
            <div class="partnership-icon">
              <img src="/images/tupian/s-1.png" alt="合伙人" />
            </div>
          </div>

          <!-- 描述文字 -->
          <div class="partnership-description">
            <p>{{ t('partnership.desc1') }}</p>
            <p>{{ t('partnership.desc2') }}</p>
          </div>

          <!-- 国家列表 -->
          <div class="partnership-countries">
            <div 
              v-for="(country, index) in countries" 
              :key="index"
              class="country-item"
              :class="{ 'active': activeCountry === index }"
              @click="selectCountry(index)"
            >
              {{ country }}
            </div>
          </div>
        </div>

        <!-- 右侧空白区域 -->
        <div class="partnership-right">
          <div v-if="activeCountry !== null" class="contact-info">
            <p class="contact-text">{{ t('partnership.contactText') }}</p>
            <p class="contact-email">{{ countryInfo[activeCountry].email }}</p>
            
            <!-- 按钮组 -->
            <div v-if="countryInfo[activeCountry].buttons.length > 0" class="button-group">
              <a 
                v-for="(button, index) in countryInfo[activeCountry].buttons"
                :key="index"
                :href="button.link"
                class="apply-button"
              >
                {{ button.text }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚区域 - 独立横跨整个宽度 -->
    <div class="partnership-footer">
      <Footer />
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Footer from '@/components/Footer.vue'

const { t, locale } = useI18n()

const activeCountry = ref(null)

const countries = computed(() => [
  t('partnership.countries.australia'),
  t('partnership.countries.korea'),
  t('partnership.countries.canada'),
  t('partnership.countries.usa'),
  t('partnership.countries.malaysia'),
  t('partnership.countries.japan'),
  t('partnership.countries.singapore'),
  t('partnership.countries.uk')
])

const countryInfo = {
  0: { // 澳大利亚
    email: 'franchising-au@heytea.com',
    buttons: []
  },
  1: { // 韩国
    email: 'franchising-kr@heytea.com',
    buttons: [
      { text: '立即申请', link: '#' },
      { text: 'English Form', link: '#' },
      { text: '지원하기', link: '#' }
    ]
  },
  2: { // 加拿大
    email: 'franchising-ca@heytea.com',
    buttons: []
  },
  3: { // 美国
    email: 'franchising-us@heytea.com',
    buttons: []
  },
  4: { // 马来西亚
    email: 'franchising-my@heytea.com',
    buttons: []
  },
  5: { // 日本
    email: 'franchising-jp@heytea.com',
    buttons: []
  },
  6: { // 新加坡
    email: 'franchising-sg@heytea.com',
    buttons: []
  },
  7: { // 英国
    email: 'franchising-uk@heytea.com',
    buttons: []
  }
}

// 选择国家
const selectCountry = (index) => {
  activeCountry.value = index
}
</script>

<style lang="scss" scoped>
.partnership-section {
  width: 100%;
  margin-top: 70px;
  background-color: #ffffff;
}

// 主内容区域
.partnership-main {
  width: 100%;
  min-height: calc(100vh - 70px);
  padding: 0 40px 0 150px;
  
  @media (max-width: 768px) {
    padding: 0 20px;
  }
}

.partnership-container {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  gap: 100px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
  }
}

// 左侧内容
.partnership-left {
  flex: 0 0 auto;
  max-width: 600px;
  padding: 60px 0 80px 0;
  
  @media (max-width: 768px) {
    padding: 80px 0 60px;
  }
}

// 标题和图标
.partnership-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 60px;
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 30px;
  }
}

.partnership-title {
  font-size: 56px;
  font-weight: 400;
  color: #1a1a1a;
  line-height: 1.4;
  flex: 1;
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
}

.partnership-icon {
  flex-shrink: 0;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: -450px;
  top: -80px;
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    position: static;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

// 描述文字
.partnership-description {
  margin-bottom: 80px;
  
  @media (max-width: 768px) {
    margin-bottom: 60px;
  }
  
  p {
    font-size: 18px;
    line-height: 2;
    color: #666;
    margin-bottom: 10px;
    
    @media (max-width: 768px) {
      font-size: 15px;
      line-height: 1.8;
    }
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

// 国家列表
.partnership-countries {
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  @media (max-width: 768px) {
    margin-top: 0;
  }
}

.country-item {
  font-size: 18px;
  color: #666;
  line-height: 1.8;
  cursor: pointer;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 15px;
  }
  
  &:hover {
    color: #333;
  }
  
  &.active {
    color: #1a1a1a;
    font-weight: 500;
  }
}

// 右侧空白区域
.partnership-right {
  flex: 1;
  display: flex;
  align-items: flex-start;
  padding-top: 350px;
  position: relative;
  left: -200px;
  
  @media (max-width: 768px) {
    padding-top: 0;
    left: 0;
  }
}

// 联系信息
.contact-info {
  width: 100%;
}

.contact-text {
  font-size: 16px;
  color: #666;
  line-height: 2;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 15px;
  }
}

.contact-email {
  font-size: 20px;
  color: #1a1a1a;
  font-weight: 500;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
}

// 按钮组
.button-group {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.apply-button {
  padding: 12px 30px;
  border: 1px solid #1a1a1a;
  border-radius: 4px;
  font-size: 14px;
  color: #1a1a1a;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
  
  &:hover {
    background-color: #1a1a1a;
    color: #ffffff;
  }
  
  @media (max-width: 768px) {
    font-size: 13px;
    padding: 10px 24px;
  }
}

// 页脚区域 - 独立横跨整个宽度
.partnership-footer {
  width: 100%;
  background-color: #ffffff;
}
</style>
