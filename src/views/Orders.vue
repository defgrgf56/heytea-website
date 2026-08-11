<template>
  <div class="orders-page">
    <div class="orders-header">
      <h1>{{ t('orders.title') }}</h1>
    </div>

    <div class="orders-container">
      <!-- 订单列表 -->
      <div v-if="orders.length > 0" class="orders-list">
        <div 
          v-for="order in orders" 
          :key="order.id"
          class="order-card"
          @click="viewOrderDetail(order.id)"
        >
          <div class="order-header">
            <div class="order-info">
              <span class="order-no">{{ t('orders.orderNo') }}: {{ order.orderNo }}</span>
              <span :class="['order-status', `status-${order.status}`]">
                {{ t(`orders.status.${order.status}`) }}
              </span>
            </div>
            <span class="order-time">{{ formatTime(order.createTime) }}</span>
          </div>
          
          <div class="order-items">
            <div 
              v-for="item in order.items" 
              :key="item.id"
              class="order-item"
            >
              <img :src="getProxyImageUrl(item.image)" :alt="item.name" />
              <div class="item-info">
                <p class="item-name">{{ locale === 'zh-CN' ? item.name : item.nameEn }}</p>
                <p class="item-quantity">x{{ item.quantity }}</p>
              </div>
              <span class="item-price">¥{{ item.price }}</span>
            </div>
          </div>
          
          <div class="order-footer">
            <div class="order-total">
              <span>{{ t('orders.total') }}</span>
              <span class="total-amount">¥{{ order.totalAmount }}</span>
            </div>
            <div class="order-actions">
              <!-- 待支付订单：显示"去支付"和"取消订单" -->
              <template v-if="order.status === 'pending'">
                <button 
                  class="btn-pay"
                  @click.stop="goToPayment(order.id)"
                >
                  {{ t('orders.pay') || '去支付' }}
                </button>
                <button 
                  class="btn-cancel"
                  @click.stop="cancelOrder(order.id)"
                >
                  {{ t('orders.cancel') }}
                </button>
              </template>
              
              <!-- 已确认订单：可以取消 -->
              <template v-else-if="order.status === 'confirmed'">
                <button 
                  class="btn-cancel"
                  @click.stop="cancelOrder(order.id)"
                >
                  {{ t('orders.cancel') }}
                </button>
              </template>
              
              <!-- 所有订单都可以"再来一单" -->
              <button 
                class="btn-reorder"
                @click.stop="reorder(order.id)"
              >
                {{ t('orders.reorder') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <p class="empty-icon">📦</p>
        <p class="empty-text">{{ t('orders.empty') }}</p>
        <router-link to="/order" class="btn-go-order">
          {{ t('orders.goOrder') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useOrderStore } from '@/stores/order'
import toast from '@/utils/toast'
import { getProxyImageUrl } from '@/utils/image'

const router = useRouter()
const { t, locale } = useI18n()
const orderStore = useOrderStore()

const orders = computed(() => orderStore.orders)

// 🔄 页面加载时从服务器获取订单列表
onMounted(async () => {
  console.log('📋 订单列表页加载，开始获取订单...')
  try {
    await orderStore.fetchOrders()
    console.log(`✅ 订单列表加载完成: ${orders.value.length} 个订单`)
  } catch (err) {
    console.error('❌ 加载订单列表失败:', err)
    toast.error('加载订单列表失败，请稍后重试')
  }
})

// 格式化时间
function formatTime(isoTime) {
  const date = new Date(isoTime)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 查看订单详情
function viewOrderDetail(orderId) {
  router.push(`/order/${orderId}`)
}

// 去支付
function goToPayment(orderId) {
  router.push(`/payment/${orderId}`)
}

// 取消订单
async function cancelOrder(orderId) {
  const confirmed = await toast.confirm(t('orders.confirmCancel'))
  if (confirmed) {
    const success = orderStore.cancelOrder(orderId)
    if (success) {
      toast.success(t('orders.cancelSuccess'))
    }
  }
}

// 重新下单
function reorder(orderId) {
  const newOrder = orderStore.reorder(orderId)
  if (newOrder) {
    toast.success(t('orders.reorderSuccess'))
  }
}
</script>

<style lang="scss" scoped>
.orders-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-top: 70px;
}

.orders-header {
  background-color: white;
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  h1 {
    font-size: 28px;
    font-weight: 600;
    margin: 0;
  }
}

.orders-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px 20px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.order-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-no {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.order-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;

  &.status-pending {
    background-color: #fff3e0;
    color: #ff9800;
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

.order-time {
  font-size: 13px;
  color: #999;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    object-fit: cover;
  }

  .item-info {
    flex: 1;

    .item-name {
      font-size: 14px;
      font-weight: 500;
      margin: 0 0 4px 0;
    }

    .item-quantity {
      font-size: 13px;
      color: #666;
      margin: 0;
    }
  }

  .item-price {
    font-size: 14px;
    font-weight: 600;
    color: #ff6b00;
  }
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.order-total {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;

  .total-amount {
    font-size: 18px;
    font-weight: 600;
    color: #ff6b00;
  }
}

.order-actions {
  display: flex;
  gap: 8px;

  button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'KaiTi', 'STKaiti', '楷体', 'SimKai', serif;
  }

  .btn-pay {
    background-color: #ff6b00;
    color: white;

    &:hover {
      background-color: #ff5500;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(255, 107, 0, 0.3);
    }
  }

  .btn-cancel {
    background-color: #fff;
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
}

.empty-state {
  text-align: center;
  padding: 80px 20px;

  .empty-icon {
    font-size: 80px;
    margin-bottom: 20px;
  }

  .empty-text {
    font-size: 16px;
    color: #999;
    margin-bottom: 30px;
  }

  .btn-go-order {
    display: inline-block;
    padding: 12px 32px;
    background-color: #1a1a1a;
    color: white;
    text-decoration: none;
    border-radius: 24px;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      background-color: #000;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  }
}

@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .order-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .order-actions {
    justify-content: stretch;

    button {
      flex: 1;
    }
  }
}
</style>
