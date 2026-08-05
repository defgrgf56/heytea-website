<template>
  <div class="order-page">
    <!-- 顶部 Banner -->
    <div class="order-banner">
      <div class="banner-content">
        <h1 class="banner-title">{{ t('order.title') }}</h1>
        <p class="banner-subtitle">{{ t('order.subtitle') }}</p>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="order-container">
      <!-- 分类标签 -->
      <div class="category-tabs">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="['category-tab', { active: activeCategory === category.id }]"
          @click="activeCategory = category.id"
        >
          {{ t(category.name) }}
        </button>
      </div>

      <!-- 产品列表 -->
      <div class="products-grid">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-card"
        >
          <div class="product-image">
            <img :src="product.image" :alt="product.name" />
            <div class="product-badge" v-if="product.isNew">
              {{ t('order.new') }}
            </div>
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ locale === 'zh-CN' ? product.name : product.nameEn }}</h3>
            <p class="product-desc">{{ locale === 'zh-CN' ? product.desc : product.descEn }}</p>
            <div class="product-footer">
              <span class="product-price">¥{{ product.price }}</span>
              <button class="add-btn" @click="addToCart(product)">
                {{ t('order.addToCart') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredProducts.length === 0" class="empty-state">
        <p>{{ t('order.noProducts') }}</p>
      </div>
    </div>

    <!-- 购物车浮动按钮 -->
    <div class="cart-float" v-if="cartCount > 0" @click="showCart = true">
      <span class="cart-icon">🛒</span>
      <span class="cart-count">{{ cartCount }}</span>
    </div>

    <!-- 购物车侧边栏 -->
    <transition name="slide-left">
      <div v-if="showCart" class="cart-sidebar">
        <div class="cart-overlay" @click="showCart = false"></div>
        <div class="cart-content">
          <div class="cart-header">
            <h2>{{ t('order.myCart') }}</h2>
            <button class="close-btn" @click="showCart = false">✕</button>
          </div>
          <div class="cart-items">
            <div v-for="item in cartItems" :key="item.id" class="cart-item">
              <img :src="item.image" :alt="item.name" class="cart-item-image" />
              <div class="cart-item-info">
                <h4>{{ locale === 'zh-CN' ? item.name : item.nameEn }}</h4>
                <p class="cart-item-price">¥{{ item.price }}</p>
              </div>
              <div class="cart-item-controls">
                <button @click="decreaseQuantity(item)">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="increaseQuantity(item)">+</button>
              </div>
            </div>
          </div>
          <div class="cart-footer">
            <div class="cart-total">
              <span>{{ t('order.total') }}</span>
              <span class="total-price">¥{{ cartTotal }}</span>
            </div>
            <button class="checkout-btn" @click="checkout">
              {{ t('order.checkout') }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// 分类
const categories = [
  { id: 'all', name: 'order.categories.all' },
  { id: 'tea', name: 'order.categories.tea' },
  { id: 'fruit', name: 'order.categories.fruit' },
  { id: 'cheese', name: 'order.categories.cheese' },
  { id: 'coffee', name: 'order.categories.coffee' }
]

const activeCategory = ref('all')

// 产品数据
const products = [
  {
    id: 1,
    name: '芝士莓莓',
    nameEn: 'Cheese Berry',
    desc: '新鲜草莓配芝士奶盖',
    descEn: 'Fresh strawberries with cheese milk foam',
    price: 28,
    category: 'cheese',
    image: '/images/logo.webp',
    isNew: true
  },
  {
    id: 2,
    name: '多肉葡萄',
    nameEn: 'Juicy Grape',
    desc: '满杯葡萄果肉',
    descEn: 'Full cup of grape pulp',
    price: 26,
    category: 'fruit',
    image: '/images/logo.webp',
    isNew: false
  },
  {
    id: 3,
    name: '金凤茶王',
    nameEn: 'Golden Phoenix Tea',
    desc: '经典纯茶系列',
    descEn: 'Classic pure tea series',
    price: 16,
    category: 'tea',
    image: '/images/logo.webp',
    isNew: false
  },
  {
    id: 4,
    name: '芝芝桃桃',
    nameEn: 'Cheese Peach',
    desc: '芝士奶盖配新鲜桃子',
    descEn: 'Cheese milk foam with fresh peaches',
    price: 29,
    category: 'cheese',
    image: '/images/logo.webp',
    isNew: false
  },
  {
    id: 5,
    name: '生打椰椰',
    nameEn: 'Fresh Coconut',
    desc: '新鲜椰子水配椰肉',
    descEn: 'Fresh coconut water with coconut meat',
    price: 25,
    category: 'fruit',
    image: '/images/logo.webp',
    isNew: true
  },
  {
    id: 6,
    name: '厚芋泥波波茶',
    nameEn: 'Taro Boba Tea',
    desc: '浓郁芋泥配珍珠',
    descEn: 'Rich taro with boba pearls',
    price: 27,
    category: 'tea',
    image: '/images/logo.webp',
    isNew: false
  },
  {
    id: 7,
    name: '生椰拿铁',
    nameEn: 'Coconut Latte',
    desc: '咖啡与椰子的完美结合',
    descEn: 'Perfect combination of coffee and coconut',
    price: 24,
    category: 'coffee',
    image: '/images/logo.webp',
    isNew: false
  },
  {
    id: 8,
    name: '厚乳拿铁',
    nameEn: 'Thick Milk Latte',
    desc: '浓郁奶香咖啡',
    descEn: 'Rich milky coffee',
    price: 22,
    category: 'coffee',
    image: '/images/logo.webp',
    isNew: false
  }
]

// 购物车
const cartItems = ref([])
const showCart = ref(false)

// 筛选产品
const filteredProducts = computed(() => {
  if (activeCategory.value === 'all') {
    return products
  }
  return products.filter(p => p.category === activeCategory.value)
})

// 购物车数量
const cartCount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

// 购物车总价
const cartTotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

// 添加到购物车
function addToCart(product) {
  const existingItem = cartItems.value.find(item => item.id === product.id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cartItems.value.push({ ...product, quantity: 1 })
  }
  // 显示添加成功提示
  console.log('已添加到购物车:', product.name)
}

// 增加数量
function increaseQuantity(item) {
  item.quantity++
}

// 减少数量
function decreaseQuantity(item) {
  if (item.quantity > 1) {
    item.quantity--
  } else {
    // 移除商品
    const index = cartItems.value.findIndex(i => i.id === item.id)
    if (index > -1) {
      cartItems.value.splice(index, 1)
    }
  }
}

// 结算
function checkout() {
  if (cartItems.value.length === 0) return
  alert(t('order.checkoutSuccess'))
  cartItems.value = []
  showCart.value = false
}
</script>

<style lang="scss" scoped>
.order-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-top: 70px;
}

.order-banner {
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
}

.banner-content {
  max-width: 1200px;
  margin: 0 auto;
}

.banner-title {
  font-size: 42px;
  font-weight: 600;
  margin-bottom: 16px;
}

.banner-subtitle {
  font-size: 18px;
  opacity: 0.9;
}

.order-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.category-tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
  overflow-x: auto;
  padding-bottom: 10px;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 3px;
  }
}

.category-tab {
  padding: 12px 24px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-family: 'KaiTi', 'STKaiti', '楷体', 'SimKai', serif;

  &:hover {
    border-color: #1a1a1a;
    background-color: #f5f5f5;
  }

  &.active {
    background-color: #1a1a1a;
    color: white;
    border-color: #1a1a1a;
  }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.product-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }
}

.product-image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background-color: #f5f5f5;
  overflow: hidden;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.product-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #ff6b00;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.product-info {
  padding: 20px;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.product-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-price {
  font-size: 20px;
  font-weight: 600;
  color: #ff6b00;
}

.add-btn {
  padding: 8px 20px;
  background-color: #1a1a1a;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'KaiTi', 'STKaiti', '楷体', 'SimKai', serif;

  &:hover {
    background-color: #000;
    transform: scale(1.05);
  }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 16px;
}

// 购物车浮动按钮
.cart-float {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 60px;
  height: 60px;
  background-color: #1a1a1a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 100;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  .cart-icon {
    font-size: 24px;
  }

  .cart-count {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 24px;
    height: 24px;
    background-color: #ff6b00;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
  }
}

// 购物车侧边栏
.cart-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
}

.cart-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.cart-content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 400px;
  background-color: white;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;

  h2 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    border: none;
    background-color: #f5f5f5;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #e5e5e5;
    }
  }
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.cart-item {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.cart-item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.cart-item-info {
  flex: 1;

  h4 {
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 4px 0;
  }
}

.cart-item-price {
  font-size: 14px;
  color: #ff6b00;
  font-weight: 600;
  margin: 0;
}

.cart-item-controls {
  display: flex;
  align-items: center;
  gap: 8px;

  button {
    width: 28px;
    height: 28px;
    border: 1px solid #ddd;
    background-color: white;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;

    &:hover {
      border-color: #1a1a1a;
      background-color: #f5f5f5;
    }
  }

  span {
    min-width: 24px;
    text-align: center;
    font-weight: 600;
  }
}

.cart-footer {
  padding: 24px;
  border-top: 1px solid #f0f0f0;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 16px;

  .total-price {
    font-size: 24px;
    font-weight: 600;
    color: #ff6b00;
  }
}

.checkout-btn {
  width: 100%;
  padding: 14px;
  background-color: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
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

// 动画
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;

  .cart-content {
    transition: transform 0.3s ease;
  }
}

.slide-left-enter-from,
.slide-left-leave-to {
  .cart-overlay {
    opacity: 0;
  }

  .cart-content {
    transform: translateX(100%);
  }
}

@media (max-width: 768px) {
  .banner-title {
    font-size: 32px;
  }

  .banner-subtitle {
    font-size: 16px;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }

  .product-info {
    padding: 12px;
  }

  .product-name {
    font-size: 15px;
  }

  .product-desc {
    font-size: 13px;
  }

  .cart-float {
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;

    .cart-icon {
      font-size: 20px;
    }
  }
}
</style>
