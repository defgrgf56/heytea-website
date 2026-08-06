<template>
  <div class="checkout-page">
    <div class="checkout-container">
      <h1 class="page-title">{{ t('checkout.title') }}</h1>
      
      <!-- 订单商品 -->
      <div class="section">
        <h2 class="section-title">{{ t('checkout.orderItems') }}</h2>
        <div class="items-list">
          <div v-for="item in cartItems" :key="item.id" class="item">
            <img :src="item.image" :alt="item.name" class="item-image" />
            <div class="item-info">
              <h3 class="item-name">{{ item.name }}</h3>
              <p class="item-price">¥{{ item.price }} × {{ item.quantity }}</p>
            </div>
            <span class="item-total">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 收货地址 -->
      <div class="section">
        <h2 class="section-title">{{ t('checkout.deliveryAddress') }}</h2>
        <div v-if="defaultAddress" class="address-card">
          <p class="address-name">{{ defaultAddress.name }} {{ defaultAddress.phone }}</p>
          <p class="address-detail">
            {{ defaultAddress.province }} {{ defaultAddress.city }} {{ defaultAddress.district }} {{ defaultAddress.detail }}
          </p>
          <button class="btn-change" @click="goToProfile">{{ t('checkout.changeAddress') }}</button>
        </div>
        <div v-else class="no-address">
          <p>{{ t('checkout.noAddress') }}</p>
          <button class="btn-primary" @click="goToProfile">{{ t('checkout.addAddress') }}</button>
        </div>
      </div>
      
      <!-- 订单摘要 -->
      <div class="section summary">
        <h2 class="section-title">{{ t('checkout.orderSummary') }}</h2>
        <div class="summary-row">
          <span>{{ t('checkout.subtotal') }}</span>
          <span>¥{{ totalPrice }}</span>
        </div>
        <div class="summary-row">
          <span>{{ t('checkout.deliveryFee') }}</span>
          <span>¥{{ deliveryFee }}</span>
        </div>
        <div class="summary-row total">
          <span>{{ t('checkout.total') }}</span>
          <span class="total-price">¥{{ (parseFloat(totalPrice) + deliveryFee).toFixed(2) }}</span>
        </div>
      </div>
      
      <!-- 提交订单 -->
      <div class="actions">
        <button class="btn-back" @click="goBack">{{ t('checkout.back') }}</button>
        <button 
          class="btn-submit" 
          @click="submitOrder"
          :disabled="!defaultAddress || isSubmitting"
        >
          {{ isSubmitting ? t('checkout.submitting') : t('checkout.submit') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import { useAddressStore } from '@/stores/address'
import toast from '@/utils/toast'

const router = useRouter()
const { t } = useI18n()
const cartStore = useCartStore()
const orderStore = useOrderStore()
const addressStore = useAddressStore()

const cartItems = computed(() => cartStore.items)
const totalPrice = computed(() => cartStore.totalPrice)
const defaultAddress = computed(() => addressStore.defaultAddress)

const deliveryFee = ref(5)
const isSubmitting = ref(false)

function goBack() {
  router.back()
}

function goToProfile() {
  router.push('/profile')
}

async function submitOrder() {
  if (!defaultAddress.value) {
    toast.warning(t('checkout.selectAddress'))
    return
  }
  
  if (cartItems.value.length === 0) {
    toast.warning(t('checkout.emptyCart'))
    return
  }
  
  isSubmitting.value = true
  
  try {
    // 创建订单
    const order = orderStore.createOrder({
      items: cartItems.value,
      totalAmount: parseFloat(totalPrice.value) + deliveryFee.value,
      address: defaultAddress.value
    })
    
    // 清空购物车
    cartStore.clearCart()
    
    // 显示成功消息
    toast.success(t('checkout.success'))
    
    // 跳转到订单详情页
    router.push(`/order/${order.id}`)
  } catch (error) {
    toast.error(t('checkout.failed'))
    console.error('提交订单失败:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.checkout-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 70px 0 40px;
}

.checkout-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 32px 0;
  text-align: center;
}

.section {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
  &.summary {
    background-color: #f8f8f8;
  }
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background-color: #f8f8f8;
  border-radius: 8px;
  
  .item-image {
    width: 60px;
    height: 60px;
    border-radius: 6px;
    object-fit: cover;
  }
  
  .item-info {
    flex: 1;
  }
  
  .item-name {
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 4px 0;
  }
  
  .item-price {
    font-size: 13px;
    color: #666;
    margin: 0;
  }
  
  .item-total {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
  }
}

.address-card {
  background-color: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
  position: relative;
  
  .address-name {
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 8px 0;
  }
  
  .address-detail {
    font-size: 14px;
    color: #666;
    margin: 0;
    line-height: 1.6;
  }
  
  .btn-change {
    position: absolute;
    top: 16px;
    right: 16px;
    padding: 6px 16px;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      border-color: #1a1a1a;
    }
  }
}

.no-address {
  text-align: center;
  padding: 32px;
  
  p {
    font-size: 14px;
    color: #999;
    margin: 0 0 16px 0;
  }
  
  .btn-primary {
    padding: 10px 24px;
    background-color: #1a1a1a;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: #000;
    }
  }
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 15px;
  
  &.total {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 2px solid #ddd;
    font-size: 18px;
    font-weight: 600;
    
    .total-price {
      color: #ff6b00;
      font-size: 24px;
    }
  }
}

.actions {
  display: flex;
  gap: 16px;
  margin-top: 32px;
  
  button {
    flex: 1;
    padding: 16px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  .btn-back {
    background-color: white;
    color: #666;
    border: 1px solid #ddd;
    
    &:hover:not(:disabled) {
      border-color: #999;
    }
  }
  
  .btn-submit {
    background-color: #1a1a1a;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #000;
    }
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }
  
  .section {
    padding: 16px;
  }
  
  .item {
    .item-image {
      width: 50px;
      height: 50px;
    }
  }
}
</style>
