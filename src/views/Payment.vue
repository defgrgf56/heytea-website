<template>
  <div class="payment-page">
    <div v-if="loading" class="loading-state">
      <p>{{ t('payment.loading') || '加载中...' }}</p>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-icon">❌</div>
      <h2>{{ t('payment.failed') || '支付失败' }}</h2>
      <p class="error-message">{{ error }}</p>
      <div class="actions">
        <button class="btn-secondary" @click="goBack">{{ t('payment.back') || '返回' }}</button>
        <button class="btn-primary" @click="retryPayment">{{ t('payment.retry') || '重试' }}</button>
      </div>
    </div>

    <div v-else-if="order" class="payment-container">
      <!-- 支付方式选择 -->
      <div class="payment-section">
        <h2 class="section-title">{{ t('payment.selectMethod') || '选择支付方式' }}</h2>
        
        <div class="payment-methods">
          <div
            :class="['payment-method', { selected: selectedMethod === 'mock_wechat' }]"
            @click="selectedMethod = 'mock_wechat'"
          >
            <div class="method-icon">💚</div>
            <div class="method-info">
              <h3>{{ t('payment.wechat') || '微信支付' }}</h3>
              <p>{{ t('payment.wechatDesc') || '推荐使用' }}</p>
            </div>
            <div v-if="selectedMethod === 'mock_wechat'" class="check-icon">✓</div>
          </div>

          <div
            :class="['payment-method', { selected: selectedMethod === 'mock_alipay' }]"
            @click="selectedMethod = 'mock_alipay'"
          >
            <div class="method-icon">💙</div>
            <div class="method-info">
              <h3>{{ t('payment.alipay') || '支付宝' }}</h3>
              <p>{{ t('payment.alipayDesc') || '安全快捷' }}</p>
            </div>
            <div v-if="selectedMethod === 'mock_alipay'" class="check-icon">✓</div>
          </div>
        </div>
      </div>

      <!-- 订单信息 -->
      <div class="order-summary">
        <h2 class="section-title">{{ t('payment.orderInfo') || '订单信息' }}</h2>
        
        <div class="summary-item">
          <span class="label">{{ t('payment.orderNo') || '订单号' }}</span>
          <span class="value">{{ order.orderNo }}</span>
        </div>
        
        <div class="summary-item">
          <span class="label">{{ t('payment.items') || '商品数量' }}</span>
          <span class="value">{{ order.items?.length || 0 }} {{ t('payment.itemsUnit') || '件' }}</span>
        </div>
        
        <div class="summary-item total">
          <span class="label">{{ t('payment.amount') || '支付金额' }}</span>
          <span class="value amount">¥{{ order.totalAmount || order.goodsAmount || 0 }}</span>
        </div>
      </div>

      <!-- 支付提示 -->
      <div class="payment-notice">
        <p>{{ t('payment.notice') || '这是教学演示支付，点击"确认支付"即可完成订单' }}</p>
      </div>

      <!-- 操作按钮 -->
      <div class="actions">
        <button class="btn-cancel" @click="cancelPayment" :disabled="isPaying">
          {{ t('payment.cancelBtn') || '取消支付' }}
        </button>
        <button class="btn-pay" @click="confirmPayment" :disabled="isPaying">
          {{ isPaying ? t('payment.paying') : t('payment.confirmPay') || '确认支付' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useOrderStore } from '@/stores/order'
import toast from '@/utils/toast'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const orderStore = useOrderStore()

const orderId = route.params.id
const order = ref(null)
const loading = ref(true)
const error = ref(null)
const selectedMethod = ref('mock_wechat')
const isPaying = ref(false)

onMounted(async () => {
  await loadOrder()
})

// 加载订单信息
async function loadOrder() {
  loading.value = true
  error.value = null
  
  try {
    const response = await orderStore.fetchOrderDetail(orderId)
    
    if (!response) {
      error.value = t('payment.orderNotFound') || '订单不存在'
      return
    }
    
    // 检查订单状态
    if (response.status !== 'pending') {
      error.value = t('payment.invalidStatus') || '订单状态不正确，无法支付'
      return
    }
    
    order.value = response
    // 使用订单的支付方式作为默认选项
    if (response.payMethod) {
      selectedMethod.value = response.payMethod
    }
  } catch (err) {
    console.error('加载订单失败:', err)
    error.value = err.message || t('payment.loadError') || '加载订单失败'
  } finally {
    loading.value = false
  }
}

// 确认支付（模拟支付）
async function confirmPayment() {
  isPaying.value = true
  
  try {
    console.log('💳 开始模拟支付...')
    console.log('📦 订单ID:', orderId)
    console.log('💰 支付方式:', selectedMethod.value)
    console.log('💵 支付金额:', order.value.totalAmount || order.value.goodsAmount)
    
    // 模拟支付延迟（模拟真实支付过程）
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('✅ 模拟支付完成')
    
    // 🎓 教学项目说明：
    // 在真实项目中，支付流程应该是：
    // 1. 前端调用支付接口，获取支付URL/参数
    // 2. 跳转到支付平台（微信/支付宝）
    // 3. 用户在支付平台完成支付
    // 4. 支付平台回调后端，后端验证并更新订单状态
    // 5. 前端轮询或WebSocket获取最新订单状态
    
    // 📝 当前教学项目的处理方式：
    // - 前端只负责"模拟支付"，不更新订单状态
    // - 订单保持 pending 状态
    // - 后台管理员看到订单后，手动"确认"（模拟接收到支付平台的回调）
    // - 这样可以完整演示前后台协作流程
    
    // 显示成功提示（教学项目：模拟支付成功）
    toast.success(
      '支付成功！订单已提交，等待商家确认后开始制作', 
      2500
    )
    
    // 延迟跳转到订单详情页
    setTimeout(() => {
      router.push(`/order/${orderId}`)
    }, 2000)
    
  } catch (err) {
    console.error('❌ 支付失败:', err)
    error.value = err.message || t('payment.payError') || '支付失败，请重试'
  } finally {
    isPaying.value = false
  }
}

// 重试支付
async function retryPayment() {
  error.value = null
  await loadOrder()
}

// 取消支付
async function cancelPayment() {
  const confirmed = await toast.confirm(
    t('payment.cancelConfirm') || '确定要取消支付吗？订单将保持待支付状态'
  )
  
  if (confirmed) {
    router.push(`/order/${orderId}`)
  }
}

// 返回
function goBack() {
  router.back()
}
</script>

<style lang="scss" scoped>
.payment-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 70px 0 40px;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 80px 20px;
  
  p {
    font-size: 16px;
    color: #999;
  }
}

.error-state {
  .error-icon {
    font-size: 64px;
    margin-bottom: 20px;
  }
  
  h2 {
    font-size: 24px;
    color: #f44336;
    margin: 0 0 16px 0;
  }
  
  .error-message {
    color: #666;
    font-size: 14px;
    margin-bottom: 32px;
  }
}

.payment-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
}

.payment-section,
.order-summary {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #1a1a1a;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px solid #ddd;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  
  &:hover {
    border-color: #999;
    background-color: #f8f8f8;
  }
  
  &.selected {
    border-color: #1a1a1a;
    background-color: #f8f8f8;
  }
  
  .method-icon {
    font-size: 32px;
    flex-shrink: 0;
  }
  
  .method-info {
    flex: 1;
    
    h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #1a1a1a;
    }
    
    p {
      font-size: 13px;
      color: #999;
      margin: 0;
    }
  }
  
  .check-icon {
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

.summary-item {
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
  }
  
  &.total {
    margin-top: 8px;
    padding-top: 16px;
    border-top: 2px solid #f0f0f0;
    
    .label {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
    }
    
    .amount {
      font-size: 28px;
      font-weight: 600;
      color: #ff6b00;
    }
  }
}

.payment-notice {
  background-color: #fff3e0;
  border: 1px solid #ffb74d;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  
  p {
    margin: 0;
    font-size: 14px;
    color: #e65100;
    line-height: 1.6;
    text-align: center;
  }
}

.actions {
  display: flex;
  gap: 16px;
  
  button {
    flex: 1;
    padding: 16px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  .btn-secondary,
  .btn-cancel {
    background-color: white;
    color: #666;
    border: 1px solid #ddd;
    
    &:hover:not(:disabled) {
      border-color: #999;
      background-color: #f8f8f8;
    }
  }
  
  .btn-primary {
    background-color: #1a1a1a;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #000;
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
}

@media (max-width: 768px) {
  .payment-container {
    padding: 0 16px;
  }
  
  .payment-section,
  .order-summary {
    padding: 16px;
  }
  
  .payment-method {
    padding: 12px;
    
    .method-icon {
      font-size: 24px;
    }
    
    .method-info h3 {
      font-size: 14px;
    }
  }
}
</style>
