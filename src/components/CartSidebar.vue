<template>
  <teleport to="body">
    <!-- 遮罩层 -->
    <transition name="fade">
      <div v-if="isOpen" class="cart-overlay" @click="close"></div>
    </transition>
    
    <!-- 侧边栏 -->
    <transition name="slide">
      <div v-if="isOpen" class="cart-sidebar">
        <div class="cart-header">
          <h3>{{ t('order.myCart') }}</h3>
          <button class="close-btn" @click="close">×</button>
        </div>
        
        <div class="cart-body">
          <!-- 空购物车 -->
          <div v-if="cartItems.length === 0" class="empty-cart">
            <span class="empty-icon">🛒</span>
            <p>{{ t('cart.empty') }}</p>
            <button class="btn-primary" @click="goToOrder">{{ t('cart.goShopping') }}</button>
          </div>
          
          <!-- 购物车商品列表 -->
          <div v-else class="cart-items">
            <div v-for="item in cartItems" :key="item.id" class="cart-item">
              <img :src="item.image" :alt="item.name" class="item-image" />
              <div class="item-info">
                <h4 class="item-name">{{ item.name }}</h4>
                <p class="item-specs">{{ item.size }} / {{ item.ice }} / {{ item.sugar }}</p>
                <div class="item-footer">
                  <span class="item-price">¥{{ item.price }}</span>
                  <div class="quantity-control">
                    <button @click="decreaseQuantity(item)" class="qty-btn">-</button>
                    <span class="qty-value">{{ item.quantity }}</span>
                    <button @click="increaseQuantity(item)" class="qty-btn">+</button>
                  </div>
                </div>
              </div>
              <button class="remove-btn" @click="removeItem(item)" title="删除">
                <span>×</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 底部操作栏 -->
        <div v-if="cartItems.length > 0" class="cart-footer">
          <div class="cart-summary">
            <div class="summary-row">
              <span>{{ t('cart.subtotal') }}</span>
              <span class="price">¥{{ totalPrice }}</span>
            </div>
            <div class="summary-row total">
              <span>{{ t('order.total') }}</span>
              <span class="price">¥{{ totalPrice }}</span>
            </div>
          </div>
          <div class="cart-actions">
            <button class="btn-clear" @click="clearCart">{{ t('cart.clear') }}</button>
            <button class="btn-checkout" @click="checkout">
              {{ t('order.checkout') }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import toast from '@/utils/toast'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const router = useRouter()
const { t } = useI18n()
const cartStore = useCartStore()
const userStore = useUserStore()

const cartItems = computed(() => cartStore.items)
const totalPrice = computed(() => cartStore.totalPrice)

function close() {
  emit('close')
}

function goToOrder() {
  close()
  router.push('/order')
}

function increaseQuantity(item) {
  cartStore.updateQuantity(item.id, item.quantity + 1)
}

function decreaseQuantity(item) {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.id, item.quantity - 1)
  } else {
    removeItem(item)
  }
}

function removeItem(item) {
  cartStore.removeItem(item.id)
  toast.success(t('cart.removed'))
}

async function clearCart() {
  const confirmed = await toast.confirm(t('cart.confirmClear'))
  if (confirmed) {
    cartStore.clearCart()
    toast.success(t('cart.cleared'))
  }
}

function checkout() {
  if (!userStore.isLoggedIn) {
    toast.warning(t('order.loginRequired'))
    close()
    router.push('/login')
    return
  }
  
  close()
  router.push('/checkout')
}
</script>

<style lang="scss" scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
}

.cart-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 420px;
  max-width: 90vw;
  background-color: white;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  
  h3 {
    font-size: 20px;
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

.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  
  .empty-icon {
    font-size: 80px;
    opacity: 0.3;
    margin-bottom: 16px;
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

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background-color: #f8f8f8;
  border-radius: 8px;
  position: relative;
  
  .item-image {
    width: 80px;
    height: 80px;
    border-radius: 6px;
    object-fit: cover;
    flex-shrink: 0;
  }
  
  .item-info {
    flex: 1;
    min-width: 0;
  }
  
  .item-name {
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 6px 0;
    color: #1a1a1a;
  }
  
  .item-specs {
    font-size: 12px;
    color: #999;
    margin: 0 0 8px 0;
  }
  
  .item-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .item-price {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
  }
  
  .quantity-control {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: white;
    border-radius: 6px;
    padding: 4px;
    
    .qty-btn {
      width: 24px;
      height: 24px;
      border: none;
      background-color: #f0f0f0;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: #e0e0e0;
      }
      
      &:active {
        transform: scale(0.95);
      }
    }
    
    .qty-value {
      min-width: 24px;
      text-align: center;
      font-size: 14px;
      font-weight: 500;
    }
  }
  
  .remove-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    border: none;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 50%;
    font-size: 20px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: all 0.2s;
    
    &:hover {
      background-color: #f44336;
    }
  }
  
  &:hover .remove-btn {
    opacity: 1;
  }
}

.cart-footer {
  border-top: 1px solid #f0f0f0;
  padding: 20px;
  background-color: white;
}

.cart-summary {
  margin-bottom: 16px;
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    color: #666;
    
    &.total {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #f0f0f0;
    }
    
    .price {
      color: #1a1a1a;
      font-weight: 600;
    }
  }
}

.cart-actions {
  display: flex;
  gap: 12px;
  
  button {
    flex: 1;
    padding: 14px;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .btn-clear {
    background-color: white;
    color: #666;
    border: 1px solid #ddd;
    
    &:hover {
      background-color: #f8f8f8;
      border-color: #999;
    }
  }
  
  .btn-checkout {
    background-color: #1a1a1a;
    color: white;
    
    &:hover {
      background-color: #000;
    }
  }
}

// 动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
