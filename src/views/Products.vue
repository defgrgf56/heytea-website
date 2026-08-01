<template>
  <div class="products">
    <!-- 图片内容区域 -->
    <div class="products__banner">
      <div class="banner__content">
        <div class="banner__text-content">
          <h1 class="banner__title">{{ t('products.promise') }}</h1>
          <div class="banner__features">
            <div class="banner__feature">
              <div class="feature__icon">✓</div>
              <div class="feature__text">
                <strong>{{ t('products.realMilk') }}</strong>
                <span>{{ t('products.noCreamer') }}</span>
              </div>
            </div>
            <div class="banner__feature">
              <div class="feature__icon">✓</div>
              <div class="feature__text">
                <strong>{{ t('products.realTea') }}</strong>
                <span>{{ t('products.noTeaPowder') }}</span>
              </div>
            </div>
            <div class="banner__feature">
              <div class="feature__icon">✓</div>
              <div class="feature__text">
                <strong>{{ t('products.realSugar') }}</strong>
                <span>{{ t('products.noSyrup') }}</span>
              </div>
            </div>
          </div>
          <p class="banner__note">{{ t('products.note') }}</p>
        </div>
        <div class="banner__illustration">
          <img src="/images/tupian/833414805b4557f755be7932bb1a87ce.png" alt="休闲喝茶" />
        </div>
      </div>
    </div>

    <!-- 第二张图片区域 -->
    <div class="products__image-section">
      <img :src="productImages.image1" alt="产品展示" />
    </div>

    <!-- 第三张图片区域 -->
    <div class="products__image-section">
      <img :src="productImages.image2" alt="产品特色" />
    </div>

    <!-- 第四张图片区域 -->
    <div class="products__image-section">
      <img :src="productImages.image3" alt="产品详情" />
    </div>

    <!-- 第五张图片区域 -->
    <div class="products__image-section products__image-section--original">
      <img :src="productImages.image4" alt="产品介绍" />
    </div>

    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import Footer from '@/components/Footer.vue'

const { t, locale } = useI18n()

// 根据语言动态切换图片
const productImages = computed(() => {
  const isEnglish = locale.value === 'en'
  return {
    image1: isEnglish ? '/images/tupian/1.1.png' : '/images/tupian/1.png',
    image2: '/images/tupian/2.png',
    image3: isEnglish ? '/images/tupian/3.1.png' : '/images/tupian/3.png',
    image4: isEnglish ? '/images/tupian/4.1.png' : '/images/tupian/4.png'
  }
})
</script>

<style lang="scss" scoped>
.products {
  padding-top: 70px;

  &__banner {
    background-color: #ffffff;
    padding: 80px 40px 60px;
    
    @media (max-width: 768px) {
      padding: 60px 20px 40px;
    }
  }

  &__image-section {
    width: 100%;
    max-width: 1584px;
    margin: 0 auto 50px;
    padding: 0 40px;
    margin-left: -50px;
    
    @media (max-width: 768px) {
      padding: 0 20px;
      margin-bottom: 30px;
      margin-left: auto;
    }
    
    img {
      width: 110%;
      max-width: 110%;
      height: auto;
      display: block;
      border-radius: 8px;
      
      @media (max-width: 768px) {
        width: 100%;
        max-width: 100%;
      }
    }

    // 最后一张图片 - 原始尺寸
    &--original {
      text-align: left;
      padding-left: 170px;
      margin-top: -30px;

      @media (max-width: 768px) {
        padding-left: 20px;
        margin-top: 0;
      }

      img {
        width: auto;
        max-width: 100%;
        display: inline-block;
        transform: scale(0.85);
        transform-origin: left center;
      }
    }
  }
}

.banner__content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: flex-start;
}

.banner__text-content {
  width: 65%;
  padding-right: 40px;
  
  @media (max-width: 768px) {
    width: 100%;
    padding-right: 0;
  }
}

.banner__title {
  font-size: 42px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 30px;
  }
}

.banner__features {
  display: flex;
  gap: 100px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
  }
}

.banner__feature {
  display: flex;
  align-items: center;
  gap: 12px;
}

.feature__icon {
  width: 38px;
  height: 38px;
  border: 2px solid #1a1a1a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #1a1a1a;
  flex-shrink: 0;
}

.feature__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  
  strong {
    font-size: 22px;
    font-weight: 600;
    color: #1a1a1a;
  }
  
  span {
    font-size: 16px;
    color: #666;
  }
}

.banner__note {
  font-size: 14px;
  color: #999;
  line-height: 1.6;
  max-width: 100%;
  margin-bottom: 0;
}

.banner__illustration {
  position: absolute;
  right: 0;
  top: -30%;
  width: 390px;
  
  @media (max-width: 1024px) {
    width: 325px;
    top: -20%;
  }
  
  @media (max-width: 768px) {
    position: static;
    width: 260px;
    margin: 30px auto 0;
    top: 0;
  }
  
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
}
</style>
