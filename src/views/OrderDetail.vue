<template>
  <div class="order-detail-page">
    <div v-if="loading" class="loading-state">
      <p>{{ t('orderDetail.loading') || '加载中...' }}</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button class="btn-back" @click="goBack">{{ t('orderDetail.back') || '返回' }}</button>
    </div>

    <div v-else-if="order" class="order-container">
      <!-- 待确认提示横幅 -->
      <div v-if="order.status === 'pending'" class="pending-notice">
        <div class="notice-icon">⏳</div>
        <div class="notice-content">
          <h3>订单已提交，等待商家确认</h3>
          <p>您的订单已成功提交！商家将在后台确认订单后开始制作，请耐心等待。</p>
        </div>
      </div>
      
      <!-- 订单状态跟踪 -->
      <div class="status-tracker">
        <h2 class="section-title">{{ t('orderDetail.orderStatus') || '订单状态' }}</h2>
        <div class="status-timeline">
          <div
            v-for="(step, index) in orderStatusSteps"
            :key="step.status"
            :class="['status-step', {
              active: index <= currentStepIndex,
              current: index === currentStepIndex
            }]"
          >
            <div class="step-icon">
              <span v-if="index < currentStepIndex">✓</span>
              <span v-else-if="index === currentStepIndex">{{ index + 1 }}</span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="step-info">
              <div class="step-name">{{ t(`orderDetail.status.${step.status}`) || step.label }}</div>
              <div v-if="step.time" class="step-time">{{ formatTime(step.time) }}</div>
            </div>
            <div v-if="index < orderStatusSteps.length - 1" class="step-line"></div>
          </div>
        </div>
      </div>

      <!-- 订单信息 -->
      <div class="order-info-section">
        <div class="info-row">
          <span class="label">{{ t('orderDetail.orderNo') || '订单号' }}</span>
          <span class="value">{{ order.orderNo }}</span>
        </div>
        <div class="info-row">
          <span class="label">{{ t('orderDetail.createTime') || '下单时间' }}</span>
          <span class="value">{{ formatDateTime(order.createTime) }}</span>
        </div>
        <div class="info-row">
          <span class="label">{{ t('orderDetail.orderStatus') || '订单状态' }}</span>
          <span :class="['value', 'status', `status-${order.status}`]">
            {{ getStatusText(order.status) }}
          </span>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="items-section">
        <h2 class="section-title">{{ t('orderDetail.items') || '订单商品' }}</h2>
        <div class="items-list">
          <div v-for="item in order.items" :key="item.id" class="item-card">
            <img :src="item.image || item.imageUrl" :alt="item.name" class="item-image" />
            <div class="item-info">
              <h3 class="item-name">{{ item.name }}</h3>
              <p v-if="item.selectedSize" class="item-spec">
                {{ t('productDetail.size') }}: {{ t(`productDetail.sizes.${item.selectedSize}`) }}
              </p>
              <p v-if="item.selectedToppings && item.selectedToppings.length" class="item-spec">
                {{ t('productDetail.toppings') }}: 
                {{ item.selectedToppings.map(id => t(`productDetail.toppingsList.${id}`)).join('、') }}
              </p>
              <p v-if="item.selectedSweetness" class="item-spec">
                {{ t('productDetail.sweetness') }}: {{ t(`productDetail.sweetnessList.${item.selectedSweetness}`) }}
              </p>
              <div class="item-price-info">
                <span class="price">¥{{ item.price }}</span>
                <span class="quantity">× {{ item.quantity }}</span>
              </div>
            </div>
            <div class="item-total">
              ¥{{ (item.price * item.quantity).toFixed(2) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 收货地址 -->
      <div class="address-section">
        <h2 class="section-title">{{ t('orderDetail.address') || '收货地址' }}</h2>
        <div class="address-card">
          <div class="address-header">
            <span class="name">{{ order.address.name }}</span>
            <span class="phone">{{ order.address.phone }}</span>
          </div>
          <p class="address-detail">
            {{ order.address.province }} {{ order.address.city }} 
            {{ order.address.district }} {{ order.address.detail }}
          </p>
        </div>
      </div>

      <!-- 费用明细 -->
      <div class="cost-section">
        <h2 class="section-title">{{ t('orderDetail.cost') || '费用明细' }}</h2>
        <div class="cost-list">
          <div class="cost-row">
            <span>{{ t('orderDetail.itemsTotal') || '商品小计' }}</span>
            <span>¥{{ itemsTotal }}</span>
          </div>
          <div class="cost-row">
            <span>{{ t('orderDetail.deliveryFee') || '配送费' }}</span>
            <span>¥{{ order.deliveryFee || 5 }}</span>
          </div>
          <div class="cost-row total">
            <span>{{ t('orderDetail.totalAmount') || '订单总计' }}</span>
            <span class="total-amount">¥{{ order.totalAmount }}</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="actions">
        <button class="btn-secondary" @click="goBack">
          {{ t('orderDetail.back') || '返回' }}
        </button>
        
        <!-- 待支付订单：显示"去支付"按钮 -->
        <button 
          v-if="order?.status === 'pending'" 
          class="btn-pay" 
          @click="goToPayment"
        >
          {{ t('orderDetail.pay') || '去支付' }}
        </button>
        
        <button 
          v-if="canCancel" 
          class="btn-cancel" 
          @click="handleCancelOrder"
          :disabled="isCancelling"
        >
          {{ isCancelling ? t('orderDetail.cancelling') : t('orderDetail.cancel') || '取消订单' }}
        </button>
        
        <button 
          v-if="canReorder" 
          class="btn-primary" 
          @click="handleReorder"
          :disabled="isReordering"
        >
          {{ isReordering ? t('orderDetail.reordering') : t('orderDetail.reorder') || '再来一单' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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

const orderId = route.params.id
const order = ref(null)
const loading = ref(true)
const error = ref(null)
const isCancelling = ref(false)
const isReordering = ref(false)

// 订单状态步骤定义
const statusStepMap = {
  pending: { index: 0, label: '待支付' },
  confirmed: { index: 1, label: '已确认' },
  preparing: { index: 2, label: '制作中' },
  delivering: { index: 3, label: '配送中' },
  completed: { index: 4, label: '已完成' },
  cancelled: { index: -1, label: '已取消' }
}

// 当前订单状态对应的步骤索引
const currentStepIndex = computed(() => {
  if (!order.value) return 0
  const statusInfo = statusStepMap[order.value.status]
  return statusInfo ? statusInfo.index : 0
})

// 订单状态步骤列表
const orderStatusSteps = computed(() => {
  if (!order.value) return []
  
  // 如果订单已取消，只显示取消状态
  if (order.value.status === 'cancelled') {
    return [
      { status: 'cancelled', label: '已取消', time: order.value.updateTime }
    ]
  }
  
  // 正常流程
  return [
    { status: 'pending', label: '待支付', time: order.value.createTime },
    { status: 'confirmed', label: '已确认', time: order.value.confirmedTime },
    { status: 'preparing', label: '制作中', time: order.value.preparingTime },
    { status: 'delivering', label: '配送中', time: order.value.deliveringTime },
    { status: 'completed', label: '已完成', time: order.value.completedTime }
  ]
})

// 计算商品小计
const itemsTotal = computed(() => {
  if (!order.value?.items) return '0.00'
  const total = order.value.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity)
  }, 0)
  return total.toFixed(2)
})

// 是否可以取消订单（待支付和已确认状态）
const canCancel = computed(() => {
  return order.value && ['pending', 'confirmed'].includes(order.value.status)
})

// 是否可以再来一单（除了待支付状态）
const canReorder = computed(() => {
  return order.value && order.value.status !== 'pending'
})

// 加载订单详情
onMounted(async () => {
  await loadOrderDetail()
})

async function loadOrderDetail() {
  loading.value = true
  error.value = null
  
  try {
    const response = await orderStore.fetchOrderDetail(orderId)
    
    if (response) {
      order.value = response
    } else {
      error.value = t('orderDetail.notFound') || '订单不存在'
    }
  } catch (err) {
    console.error('加载订单详情失败:', err)
    error.value = err.message || t('orderDetail.loadError') || '加载失败'
  } finally {
    loading.value = false
  }
}

// 取消订单
async function handleCancelOrder() {
  const confirmed = await toast.confirm(
    t('orderDetail.cancelConfirm') || '确定要取消这个订单吗？'
  )
  
  if (!confirmed) return
  
  isCancelling.value = true
  
  try {
    await orderStore.cancelOrder(orderId)
    toast.success(t('orderDetail.cancelSuccess') || '订单已取消')
    
    // 重新加载订单详情
    await loadOrderDetail()
  } catch (err) {
    console.error('取消订单失败:', err)
    toast.error(err.message || t('orderDetail.cancelError') || '取消失败')
  } finally {
    isCancelling.value = false
  }
}

// 再来一单
async function handleReorder() {
  isReordering.value = true
  
  try {
    // 将订单商品添加到购物车
    for (const item of order.value.items) {
      await cartStore.addItem({
        ...item,
        quantity: item.quantity
      })
    }
    
    toast.success(t('orderDetail.reorderSuccess') || '商品已添加到购物车')
    
    // 跳转到购物车或结算页
    router.push('/checkout')
  } catch (err) {
    console.error('再来一单失败:', err)
    toast.error(err.message || t('orderDetail.reorderError') || '操作失败')
  } finally {
    isReordering.value = false
  }
}

// 返回
function goBack() {
  router.back()
}

// 去支付
function goToPayment() {
  router.push(`/payment/${orderId}`)
}

// 获取状态文本
function getStatusText(status) {
  const statusMap = {
    pending: '待支付',
    confirmed: '已确认',
    preparing: '制作中',
    delivering: '配送中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

// 格式化时间
function formatTime(time) {
  if (!time) return ''
  const date = new Date(time)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// 格式化日期时间
function formatDateTime(time) {
  if (!time) return ''
  const date = new Date(time)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}
</script>

<style lang="scss" scoped>
.order-detail-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 70px 0 40px;
}

.order-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #1a1a1a;
}

/* 订单状态跟踪 */
.status-tracker {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.status-timeline {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-top: 24px;
}

.status-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  
  &.active {
    .step-icon {
      background-color: #1a1a1a;
      color: white;
      border-color: #1a1a1a;
    }
    
    .step-name {
      color: #1a1a1a;
      font-weight: 600;
    }
    
    .step-line {
      background-color: #1a1a1a;
    }
  }
  
  &.current {
    .step-icon {
      background-color: #ff6b00;
      border-color: #ff6b00;
      animation: pulse 2s infinite;
    }
    
    .step-name {
      color: #ff6b00;
    }
  }
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  border: 2px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  color: #999;
  transition: all 0.3s;
  z-index: 2;
}

.step-info {
  margin-top: 12px;
  text-align: center;
}

.step-name {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
  transition: all 0.3s;
}

.step-time {
  font-size: 12px;
  color: #999;
}

.step-line {
  position: absolute;
  top: 20px;
  left: 50%;
  right: -50%;
  height: 2px;
  background-color: #ddd;
  transition: background-color 0.3s;
  z-index: 1;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* 订单信息 */
.order-info-section {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  .label {
    font-size: 14px;
    color: #666;
  }
  
  .value {
    font-size: 14px;
    color: #1a1a1a;
    font-weight: 500;
    
    &.status {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 13px;
      
      &.status-pending {
        background-color: #fff3e0;
        color: #ff6b00;
      }
      
      &.status-confirmed {
        background-color: #e3f2fd;
        color: #2196f3;
      }
      
      &.status-preparing {
        background-color: #f3e5f5;
        color: #9c27b0;
      }
      
      &.status-delivering {
        background-color: #e1f5fe;
        color: #03a9f4;
      }
      
      &.status-completed {
        background-color: #e8f5e9;
        color: #4caf50;
      }
      
      &.status-cancelled {
        background-color: #ffebee;
        color: #f44336;
      }
    }
  }
}

/* 商品列表 */
.items-section {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background-color: #f8f8f8;
  border-radius: 8px;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1a1a1a;
}

.item-spec {
  font-size: 13px;
  color: #666;
  margin: 4px 0;
}

.item-price-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  
  .price {
    font-size: 15px;
    color: #ff6b00;
    font-weight: 600;
  }
  
  .quantity {
    font-size: 14px;
    color: #999;
  }
}

.item-total {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  align-self: center;
}

/* 收货地址 */
.address-section {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.address-card {
  background-color: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
}

.address-header {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
  
  .name {
    font-size: 15px;
    font-weight: 600;
    color: #1a1a1a;
  }
  
  .phone {
    font-size: 15px;
    color: #666;
  }
}

.address-detail {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* 费用明细 */
.cost-section {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.cost-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cost-row {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  color: #666;
  
  &.total {
    margin-top: 8px;
    padding-top: 16px;
    border-top: 2px solid #f0f0f0;
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    
    .total-amount {
      color: #ff6b00;
      font-size: 24px;
    }
  }
}

/* 操作按钮 */
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
  
  .btn-secondary {
    background-color: white;
    color: #666;
    border: 1px solid #ddd;
    
    &:hover:not(:disabled) {
      border-color: #999;
      background-color: #f8f8f8;
    }
  }
  
  .btn-pay {
    background-color: #ff6b00;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #ff5500;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);
    }
  }
  
  .btn-cancel {
    background-color: #ffebee;
    color: #f44336;
    
    &:hover:not(:disabled) {
      background-color: #ffcdd2;
    }
  }
  
  .btn-primary {
    background-color: #1a1a1a;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #000;
    }
  }
}

/* 加载和错误状态 */
.loading-state,
.error-state {
  text-align: center;
  padding: 80px 20px;
  
  p {
    font-size: 16px;
    color: #999;
    margin-bottom: 20px;
  }
  
  .btn-back {
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

@media (max-width: 768px) {
  .status-timeline {
    flex-wrap: wrap;
    gap: 24px;
  }
  
  .status-step {
    flex: 1 1 40%;
    
    .step-line {
      display: none;
    }
  }
  
  .item-card {
    flex-direction: column;
  }
  
  .item-image {
    width: 100%;
    height: 200px;
  }
}
</style>
