<template>
  <div class="product-detail-page">
    <div v-if="product" class="product-container">
      <!-- 产品图片 -->
      <div class="product-image-section">
        <img :src="getProxyImageUrl(product.image || product.imageUrl)" :alt="product.name" class="product-image" />
        <div v-if="product.isNew" class="product-badge">{{ t('order.new') }}</div>
      </div>

      <!-- 产品信息 -->
      <div class="product-info-section">
        <h1 class="product-name">{{ locale === 'zh-CN' ? product.name : product.nameEn }}</h1>
        <p class="product-desc">{{ locale === 'zh-CN' ? product.desc : product.descEn }}</p>
        <div class="product-price">¥{{ product.price }}</div>

        <!-- 规格选择 -->
        <div class="spec-section">
          <h3 class="spec-title">{{ t('productDetail.size') }}</h3>
          <div class="spec-options">
            <button
              v-for="size in sizes"
              :key="size.id"
              :class="['spec-btn', { active: selectedSize === size.id }]"
              @click="selectedSize = size.id"
            >
              <span class="spec-name">{{ t(`productDetail.sizes.${size.id}`) }}</span>
              <span class="spec-extra">{{ size.extra > 0 ? `+¥${size.extra}` : '' }}</span>
            </button>
          </div>
        </div>

        <!-- 配料选择 -->
        <div class="spec-section">
          <h3 class="spec-title">{{ t('productDetail.toppings') }}</h3>
          <div class="spec-options">
            <button
              v-for="topping in toppings"
              :key="topping.id"
              :class="['spec-btn', { active: selectedToppings.includes(topping.id) }]"
              @click="toggleTopping(topping.id)"
            >
              <span class="spec-name">{{ t(`productDetail.toppingsList.${topping.id}`) }}</span>
              <span class="spec-extra">+¥{{ topping.price }}</span>
            </button>
          </div>
        </div>

        <!-- 甜度选择 -->
        <div class="spec-section">
          <h3 class="spec-title">{{ t('productDetail.sweetness') }}</h3>
          <div class="spec-options">
            <button
              v-for="sweet in sweetness"
              :key="sweet.id"
              :class="['spec-btn', { active: selectedSweetness === sweet.id }]"
              @click="selectedSweetness = sweet.id"
            >
              {{ t(`productDetail.sweetnessList.${sweet.id}`) }}
            </button>
          </div>
        </div>

        <!-- 数量选择 -->
        <div class="quantity-section">
          <span class="quantity-label">{{ t('productDetail.quantity') }}</span>
          <div class="quantity-controls">
            <button class="quantity-btn" @click="decreaseQuantity">-</button>
            <span class="quantity-value">{{ quantity }}</span>
            <button class="quantity-btn" @click="increaseQuantity">+</button>
          </div>
        </div>

        <!-- 总价和加入购物车 -->
        <div class="action-section">
          <div class="total-price">
            <span class="total-label">{{ t('productDetail.totalPrice') }}</span>
            <span class="total-value">¥{{ totalPrice }}</span>
          </div>
          <button class="add-cart-btn" @click="addToCart">
            {{ t('order.addToCart') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else class="loading-state">
      <p>{{ t('productDetail.loading') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import toast from '@/utils/toast'
import { getProxyImageUrl } from '@/utils/image'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const userStore = useUserStore()
const cartStore = useCartStore()
const productStore = useProductStore()
const { isLoggedIn } = storeToRefs(userStore)

const productId = route.params.id  // 直接使用字符串 ID，不要 parseInt
const product = ref(null)
const loading = ref(true)

// 在组件挂载时加载商品详情
onMounted(async () => {
  await loadProductDetail()
})

// 加载商品详情
async function loadProductDetail() {
  loading.value = true
  
  try {
    // 先尝试从 store 中获取（如果从列表页跳转过来）
    const cachedProduct = productStore.getProductById(productId)
    
    if (cachedProduct) {
      product.value = cachedProduct
      loading.value = false
    } else {
      // 如果 store 中没有，从 API 获取
      const response = await productStore.fetchProductDetail(productId)
      if (response.success) {
        product.value = response.data
      } else {
        toast.error(t('productDetail.loadError') || '该商品不存在，请从商品列表选择')
        // 3秒后自动跳转回列表页
        setTimeout(() => {
          router.push('/order')
        }, 2000)
      }
      loading.value = false
    }
  } catch (err) {
    console.error('加载商品详情失败:', err)
    toast.error('该商品不存在，请从商品列表选择')
    // 3秒后自动跳转回列表页
    setTimeout(() => {
      router.push('/order')
    }, 2000)
    loading.value = false
  }
}

// 规格选项
const sizes = [
  { id: 'small', extra: -2 },
  { id: 'medium', extra: 0 },
  { id: 'large', extra: 3 }
]

const toppings = [
  { id: 'pearl', price: 3 },
  { id: 'coconut', price: 3 },
  { id: 'pudding', price: 4 }
]

const sweetness = [
  { id: 'none' },
  { id: 'less' },
  { id: 'normal' },
  { id: 'more' }
]

// 选择状态
const selectedSize = ref('medium')
const selectedToppings = ref([])
const selectedSweetness = ref('normal')
const quantity = ref(1)

// 计算总价
const totalPrice = computed(() => {
  if (!product.value) return 0
  
  let price = product.value.price
  
  // 加上杯型差价
  const size = sizes.find(s => s.id === selectedSize.value)
  if (size) price += size.extra
  
  // 加上配料价格
  selectedToppings.value.forEach(toppingId => {
    const topping = toppings.find(t => t.id === toppingId)
    if (topping) price += topping.price
  })
  
  return price * quantity.value
})

// 切换配料
function toggleTopping(toppingId) {
  const index = selectedToppings.value.indexOf(toppingId)
  if (index > -1) {
    selectedToppings.value.splice(index, 1)
  } else {
    selectedToppings.value.push(toppingId)
  }
}

// 增加数量
function increaseQuantity() {
  quantity.value++
}

// 减少数量
function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// 加入购物车
async function addToCart() {
  if (!isLoggedIn.value) {
    const confirmed = await toast.confirm(t('order.loginRequired'))
    if (confirmed) {
      router.push({
        path: '/login',
        query: { redirect: route.fullPath }
      })
    }
    return
  }
  
  // 构建带规格的商品对象
  const cartItem = {
    ...product.value,
    // 添加用户选择的规格信息
    selectedSize: selectedSize.value,
    selectedToppings: [...selectedToppings.value],
    selectedSweetness: selectedSweetness.value,
    // 使用计算后的总价作为单价（包含规格）
    price: totalPrice.value / quantity.value,
    quantity: quantity.value,
    // 生成唯一ID（基于商品ID和规格组合）
    id: `${product.value.id}-${selectedSize.value}-${selectedToppings.value.sort().join('-')}-${selectedSweetness.value}`
  }
  
  // 添加到购物车
  for (let i = 0; i < quantity.value; i++) {
    cartStore.addItem(cartItem)
  }
  
  toast.success(t('productDetail.addSuccess'))
  
  // 可选：跳转回点餐页或停留在当前页
  // router.push('/order')
}
</script>

<style lang="scss" scoped>
.product-detail-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-top: 70px;
}

.product-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

.product-image-section {
  position: relative;
  background-color: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.product-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
}

.product-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #ff6b00;
  color: white;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
}

.product-info-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-name {
  font-size: 32px;
  font-weight: 600;
  margin: 0;
  color: #1a1a1a;
}

.product-desc {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.product-price {
  font-size: 36px;
  font-weight: 600;
  color: #ff6b00;
}

.spec-section {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.spec-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #1a1a1a;
}

.spec-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.spec-btn {
  padding: 10px 16px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'KaiTi', 'STKaiti', '楷体', 'SimKai', serif;

  &:hover {
    border-color: #1a1a1a;
    background-color: #f8f8f8;
  }

  &.active {
    border-color: #1a1a1a;
    background-color: #1a1a1a;
    color: white;

    .spec-extra {
      color: #ffd700;
    }
  }

  .spec-name {
    font-weight: 500;
  }

  .spec-extra {
    font-size: 12px;
    color: #ff6b00;
  }
}

.quantity-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.quantity-label {
  font-size: 16px;
  font-weight: 600;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.quantity-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: #1a1a1a;
    background-color: #f8f8f8;
  }
}

.quantity-value {
  font-size: 18px;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.action-section {
  display: flex;
  align-items: center;
  gap: 20px;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.total-price {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .total-label {
    font-size: 13px;
    color: #666;
  }

  .total-value {
    font-size: 28px;
    font-weight: 600;
    color: #ff6b00;
  }
}

.add-cart-btn {
  flex: 1;
  padding: 16px;
  background-color: #1a1a1a;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'KaiTi', 'STKaiti', '楷体', 'SimKai', serif;

  &:hover {
    background-color: #000;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

.loading-state {
  text-align: center;
  padding: 80px 20px;
  font-size: 16px;
  color: #999;
}
</style>
