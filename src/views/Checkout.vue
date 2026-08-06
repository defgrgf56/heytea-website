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
        <div v-if="selectedAddress" class="address-card">
          <div v-if="selectedAddress.isDefault" class="default-badge">{{ t('address.default') }}</div>
          <p class="address-name">{{ selectedAddress.name }} {{ selectedAddress.phone }}</p>
          <p class="address-detail">
            {{ selectedAddress.province }} {{ selectedAddress.city }} {{ selectedAddress.district }} {{ selectedAddress.detail }}
          </p>
          <button class="btn-change" @click="showAddressSelector = true">{{ t('checkout.changeAddress') }}</button>
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
          :disabled="!selectedAddress || isSubmitting"
        >
          {{ isSubmitting ? t('checkout.submitting') : t('checkout.submit') }}
        </button>
      </div>
    </div>
    
    <!-- 地址选择弹窗 -->
    <teleport to="body">
      <transition name="fade">
        <div v-if="showAddressSelector" class="modal-overlay" @click="showAddressSelector = false">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3>{{ t('checkout.selectAddress') }}</h3>
              <button class="close-btn" @click="showAddressSelector = false">×</button>
            </div>
            <div class="modal-body">
              <div v-if="allAddresses.length === 0" class="empty-state">
                <p>{{ t('address.empty') }}</p>
                <button class="btn-primary" @click="goToProfileAndClose">{{ t('checkout.addAddress') }}</button>
              </div>
              <div v-else class="address-list">
                <div
                  v-for="address in allAddresses"
                  :key="address.id"
                  :class="['address-item', { selected: selectedAddress?.id === address.id }]"
                  @click="selectAddress(address)"
                >
                  <div v-if="address.isDefault" class="default-badge">{{ t('address.default') }}</div>
                  <div class="address-content">
                    <p class="address-name">{{ address.name }} {{ address.phone }}</p>
                    <p class="address-detail">
                      {{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}
                    </p>
                  </div>
                  <div v-if="selectedAddress?.id === address.id" class="check-icon">✓</div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" @click="goToProfileAndClose">{{ t('checkout.manageAddresses') }}</button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
const allAddresses = computed(() => addressStore.addresses)
const defaultAddress = computed(() => addressStore.defaultAddress)

const deliveryFee = ref(5)
const isSubmitting = ref(false)
const showAddressSelector = ref(false)
const selectedAddress = ref(null)

// 初始化时设置默认地址
onMounted(() => {
  if (defaultAddress.value) {
    selectedAddress.value = defaultAddress.value
  }
})

function goBack() {
  router.back()
}

function goToProfile() {
  router.push('/profile')
}

function goToProfileAndClose() {
  showAddressSelector.value = false
  router.push('/profile')
}

function selectAddress(address) {
  selectedAddress.value = address
  showAddressSelector.value = false
}

async function submitOrder() {
  if (!selectedAddress.value) {
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
      address: selectedAddress.value
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
  
  .default-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background-color: #ff6b00;
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .address-name {
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 8px 0;
  }
  
  .address-detail {
    font-size: 14px;
    color: #666;
    margin: 0 0 12px 0;
    line-height: 1.6;
    padding-right: 80px;
  }
  
  .btn-change {
    position: absolute;
    bottom: 16px;
    right: 16px;
    padding: 8px 20px;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      border-color: #1a1a1a;
      background-color: #f8f8f8;
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

/* 地址选择弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
  
  .close-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    font-size: 32px;
    line-height: 1;
    color: #999;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      color: #333;
    }
  }
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  
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

.address-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.address-item {
  background-color: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  border: 2px solid transparent;
  
  &:hover {
    background-color: #f0f0f0;
  }
  
  &.selected {
    border-color: #1a1a1a;
    background-color: #fff;
  }
  
  .default-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background-color: #ff6b00;
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .address-content {
    padding-right: 40px;
  }
  
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
  
  .check-icon {
    position: absolute;
    bottom: 16px;
    right: 16px;
    width: 24px;
    height: 24px;
    background-color: #1a1a1a;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
  }
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: center;
  
  .btn-secondary {
    padding: 10px 24px;
    background-color: white;
    color: #666;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      border-color: #999;
      background-color: #f8f8f8;
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
