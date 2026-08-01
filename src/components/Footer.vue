<template>
  <footer class="footer">
    <div class="footer__container">
      <!-- Logo -->
      <div class="footer__logo">
        <img src="/images/logo-text.webp" alt="HEYTEA" />
      </div>

      <!-- 更多信息语言切换 -->
      <div class="footer__region">
        <span class="footer__region-text">{{ t('footer.moreInfo') }}</span>
        <img src="/images/global.webp" alt="全球" class="footer__region-icon" />
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="footer__bottom">
      <div class="footer__info">
        <p class="footer__text">
          {{ t('footer.icp') }}
        </p>
        <p class="footer__text">
          {{ t('footer.police') }}
        </p>
        <p class="footer__text">
          {{ t('footer.company') }}
        </p>
        <p class="footer__text">
          {{ t('footer.address') }}
        </p>
      </div>

      <div class="footer__notice">
        <p class="footer__text">{{ t('footer.accessibility') }}</p>
        <p class="footer__text">
          {{ t('footer.notice1') }}
        </p>
        <p class="footer__text">
          {{ t('footer.notice2') }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.footer {
  background-color: #ffffff;
  padding: 20px 0 30px;

  &__container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 14px;
    }
  }

  &__logo {
    img {
      height: 22px;
      width: auto;

      @media (max-width: 768px) {
        height: 18px;
      }
    }
  }

  &__region {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.7;
    }
  }

  &__region-text {
    font-size: 12px;
    color: #666;
  }

  &__region-icon {
    width: 20px;
    height: 20px;
  }

  &__bottom {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 40px;
  }

  &__info {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px 150px;
    margin-bottom: 14px;
    text-align: center;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 5px;
    }

    .footer__text {
      white-space: nowrap;
      font-size: 13px;
      
      @media (max-width: 768px) {
        font-size: 10px;
      }
    }
  }

  &__notice {
    margin-top: 10px;
    text-align: center;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;

    .footer__text {
      margin-bottom: 6px;
      text-align: center;
    }
  }

  &__text {
    font-size: 11px;
    color: #999;
    line-height: 1.6;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 10px;
    }
  }
}
</style>
