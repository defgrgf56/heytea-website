<template>
  <div class="order-detail-page">
    <div class="order-detail-container">
      <!-- 返回按钮 -->
      <button class="back-btn" @click="goBack">
        <span class="back-icon">←</span>
        <span>{{ t('orderDetail.back') }}</span>
      </button>
      
      <!-- 加载中 -->
      <div v-if="loading" class="loading">
        <span class="loading-icon">⏳</span>
        <p>{{ t('orderDetail.loading') }}</p>
      </div>
      
      <!-- 订单不存在 -->
      <div v-else-if="!order" class="not-found">
        <span class="not-found-icon">📦</span>
        <p>{{ t('orderDetail.notFound') }}</p>
        <button class="btn-primary" @click="goToOrders">{{ t('orderDetail.viewAll') }}</button>
      </div>
      
      <!-- 订单详情 -->
      <div v-else class="order-detail">
        <!-- 订单状态卡片 -->
        <div class="status-card">
          <div class="status-icon" :class="`status-icon--${order.status}`">
            {{ getStatusIcon(order.status) }}
          </div>
          <div class="status-info">
            <h2 class="status-title">{{ t(`orders.status.${order.status}`) }}</h2>
            <p class="status-desc">{{ getStatusDesc(order.status) }}</p>
          </div>
        </div>
        
        <!-- 订单信息 -->
        <div class="info-card">
          <h3 class="card-title">{{ t('orderDetail.orderInfo') }}</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">{{ t('orderDetail.orderNo') }}</span>
              <span class="info-value">{{ order.orderNo }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('orderDetail.createTime') }}</span>
              <span class="info-value">{{ formatDateTime(order.createTime) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('orderDetail.status') }}</span>
              <span class="info-value status-badge" :class="`status-badge--${order.status}`">
                {{ t(`orders.status.${order.status}`) }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('orderDetail.updateTime') }}</span>
              <span class="info-value">{{ formatDateTime(order.updateTime) }}</span>
            </div>
          </div>
        </div>
        
        <!-- 商品列表 -->
        <div class="items-card">
          <h3 class="card-title">{{ t('orderDetail.items') }}</h3>
          <div class="items-list">
            <div v-for="item in order.items" :key="item.id" class="item-row">
              <img :src="item.image" :alt="item.name" class="item-image" />
              <div class="item-info">
                <h4 class="item-name">{{ item.name }}</h4>
                <p class="item-specs">{{ item.size }} / {{ item.ice }} / {{ item.sugar }}</p>
                <div v-if="item.toppings && item.toppings.length > 0" class="item-toppings">
                  <span>{{ t('orderDetail.toppings') }}: </span>
                  <span>{{ item.toppings.join(', ') }}</span>
                </div>
              </div>
              <div class="item-quantity">x{{ item.quantity }}</div>
              <div class="item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
            </div>
          </div>
        </div>
        
        <!-- 价格汇总 -->
        <div class="summary-card">
          <h3 class="card-title">{{ t('orderDetail.summary') }}</h3>
          <div class="summary-rows">
            <div class="summary-row">
              <span>{{ t('orderDetail.subtotal') }}</span>
              <span>¥{{ order.totalAmount.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>{{ t('orderDetail.deliveryFee') }}</span>
              <span>¥0.00</span>
            </div>
            <div class="summary-row total">
              <span>{{ t('orderDetail.total') }}</span>
              <span class="total-price">¥{{ order.totalAmount.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="actions-card">
          <button 
            v-if="order.status === 'pending' || order.status === 'confirmed'" 
            class="btn-cancel"
            @click="handleCancel"
          >
            {{ t('orders.cancel') }}
          </button>
          <button class="btn-reorder" @click="handleReorder">
            {{ t('orders.reorder') }}
          </button>
          <button class="btn-contact">
            {{ t('orderDetail.contact') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useOrderStore } from '@/stores/order'
import { useCartStore } from '@/stores/cart'
import toast from '@/utils/toast'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const orderStore = useOrderStore()
const cartStore = useCartStore()

const loading = ref(true)
const order = ref(null)

const orderId = computed(() => parseInt(route.params.id))

onMounted(() => {
  loadOrder()
})

function loadOrder() {
  loading.value = true
  setTimeout(() => {
    order.value = orderStore.getOrderById(orderId.value)
    loading.value = false
  }, 300)
}

function goBack() {
  router.go(-1)
}

function goToOrders() {
  router.push('/orders')
}

function formatDateTime(dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

function getStatusIcon(status) {
  const icons = {
    pending: '⏳',
    confirmed: '✓',
    preparing: '🔥',
    completed: '✅',
    cancelled: '✕'
  }
  return icons[status] || '📦'
}

function getStatusDesc(status) {
  const descs = {
    pending: t('orderDetail.statusDesc.pending'),
    confirmed: t('orderDetail.statusDesc.confirmed'),
    preparing: t('orderDetail.statusDesc.preparing'),
    completed: t('orderDetail.statusDesc.completed'),
    cancelled: t('orderDetail.statusDesc.cancelled')
  }
  return descs[status] || ''
}

async function handleCancel() {
  const confirmed = await toast.confirm(t('orders.confirmCancel'))
  if (confirmed) {
    const success = orderStore.cancelOrder(orderId.value)
    if (success) {
      toast.success(t('orders.cancelSuccess'))
      loadOrder()
    } else {
      toast.error(t('orderDetail.cancelFailed'))
    }
  }
}

function handleReorder() {
  // 将订单商品加入购物车
  order.value.items.forEach(item => {
    cartStore.addItem(item)
  })
  toast.success(t('orders.reorderSuccess'))
  router.push('/order')
}
</script>

<style lang="scss" scoped>
.order-detail-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-top: 70px;
}

.order-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #666;
  font-size: 15px;
  cursor: pointer;
  margin-bottom: 20px;
  padding: 8px 0;
  transition: color 0.3s;
  
  &:hover {
    color: #1a1a1a;
  }
  
  .back-icon {
    font-size: 20px;
  }
}

.loading,
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background-color: white;
  border-radius: 12px;
  
  .loading-icon,
  .not-found-icon {
    font-size: 80px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  p {
    font-size: 16px;
    color: #999;
    margin: 0 0 24px 0;
  }
  
  .btn-primary {
    padding: 12px 32px;
    background-color: #1a1a1a;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: #000;
    }
  }
}

.order-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.status-card {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
  .status-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    flex-shrink: 0;
    
    &--pending {
      background-color: #fff3cd;
    }
    
    &--confirmed {
      background-color: #d1e7dd;
    }
    
    &--preparing {
      background-color: #cfe2ff;
    }
    
    &--completed {
      background-color: #d1e7dd;
    }
    
    &--cancelled {
      background-color: #f8d7da;
    }
  }
  
  .status-info {
    flex: 1;
  }
  
  .status-title {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #1a1a1a;
  }
  
  .status-desc {
    font-size: 14px;
    color: #666;
    margin: 0;
  }
}

.info-card,
.items-card,
.summary-card,
.actions-card {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #1a1a1a;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  
  .info-label {
    font-size: 13px;
    color: #999;
  }
  
  .info-value {
    font-size: 15px;
    color: #1a1a1a;
    font-weight: 500;
  }
  
  .status-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    width: fit-content;
    
    &--pending {
      background-color: #fff3cd;
      color: #856404;
    }
    
    &--confirmed {
      background-color: #d1e7dd;
      color: #0f5132;
    }
    
    &--preparing {
      background-color: #cfe2ff;
      color: #084298;
    }
    
    &--completed {
      background-color: #d1e7dd;
      color: #0f5132;
    }
    
    &--cancelled {
      background-color: #f8d7da;
      color: #842029;
    }
  }
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item-row {
  display: flex;
  gap: 16px;
  padding: 16px;
  background-color: #f8f8f8;
  border-radius: 8px;
  align-items: center;
  
  .item-image {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
  }
  
  .item-info {
    flex: 1;
    min-width: 0;
  }
  
  .item-name {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 6px 0;
    color: #1a1a1a;
  }
  
  .item-specs {
    font-size: 13px;
    color: #999;
    margin: 0 0 4px 0;
  }
  
  .item-toppings {
    font-size: 12px;
    color: #666;
  }
  
  .item-quantity {
    font-size: 15px;
    color: #666;
    margin-right: 16px;
    flex-shrink: 0;
  }
  
  .item-price {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    flex-shrink: 0;
  }
}

.summary-rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  color: #666;
  
  &.total {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    padding-top: 12px;
    margin-top: 12px;
    border-top: 1px solid #f0f0f0;
  }
  
  .total-price {
    color: #1a1a1a;
  }
}

.actions-card {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  
  button {
    flex: 1;
    min-width: 120px;
    padding: 14px 24px;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    
    @media (max-width: 768px) {
      flex-basis: 100%;
    }
  }
  
  .btn-cancel {
    background-color: white;
    color: #f44336;
    border: 1px solid #f44336;
    
    &:hover {
      background-color: #fff5f5;
    }
  }
  
  .btn-reorder {
    background-color: #1a1a1a;
    color: white;
    
    &:hover {
      background-color: #000;
    }
  }
  
  .btn-contact {
    background-color: white;
    color: #666;
    border: 1px solid #ddd;
    
    &:hover {
      background-color: #f8f8f8;
      border-color: #999;
    }
  }
}
</style>
