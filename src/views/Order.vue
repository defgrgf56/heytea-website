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
      <!-- 搜索框 -->
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          :placeholder="t('order.searchPlaceholder')"
          @input="handleSearch"
        />
        <button v-if="searchQuery" class="clear-btn" @click="clearSearch">✕</button>
      </div>
      
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
          @click="viewDetail(product.id)"
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
              <button class="add-btn" @click.stop="addToCart(product)">
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

    <!-- 购物车浮动按钮（移动端） -->
    <div class="cart-float-mobile" v-if="cartStore.totalItems > 0" @click="toggleCart">
      <span class="cart-icon">🛒</span>
      <span class="cart-count">{{ cartStore.totalItems }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'
import toast from '@/utils/toast'

const router = useRouter()
const { t, locale } = useI18n()
const userStore = useUserStore()
const cartStore = useCartStore()
const { isLoggedIn } = storeToRefs(userStore)

// 分类
const categories = [
  { id: 'all', name: 'order.categories.all' },
  { id: 'tea', name: 'order.categories.tea' },
  { id: 'fruit', name: 'order.categories.fruit' },
  { id: 'cheese', name: 'order.categories.cheese' },
  { id: 'coffee', name: 'order.categories.coffee' }
]

const activeCategory = ref('all')
const searchQuery = ref('')

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

const activeCategory = ref('all')
const searchQuery = ref('')

// 筛选产品
const filteredProducts = computed(() => {
  let result = products
  
  // 按分类筛选
  if (activeCategory.value !== 'all') {
    result = result.filter(p => p.category === activeCategory.value)
  }
  
  // 按搜索关键词筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(p => {
      const name = (locale.value === 'zh-CN' ? p.name : p.nameEn).toLowerCase()
      const desc = (locale.value === 'zh-CN' ? p.desc : p.descEn).toLowerCase()
      return name.includes(query) || desc.includes(query)
    })
  }
  
  return result
})

// 处理搜索
function handleSearch() {
  // 搜索时自动切换到"全部"分类
  if (searchQuery.value.trim()) {
    activeCategory.value = 'all'
  }
}

// 清除搜索
function clearSearch() {
  searchQuery.value = ''
}

// 打开购物车（触发 Header 中的 CartSidebar）
function toggleCart() {
  // 通过事件或直接操作 store 来打开购物车
  // 这里简化处理：在移动端点击浮动按钮时滚动到顶部，用户可以点击 Header 的购物车图标
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 查看详情
function viewDetail(productId) {
  router.push(`/product/${productId}`)
}

// 添加到购物车
async function addToCart(product) {
  // 检查是否已登录
  if (!isLoggedIn.value) {
    const confirmed = await toast.confirm(t('order.loginRequired'))
    if (confirmed) {
      // 跳转到登录页，并保存当前页面路径用于登录后返回
      router.push({
        path: '/login',
        query: { redirect: '/order' }
      })
    }
    return
  }
  
  // 使用 cart store 添加商品
  cartStore.addItem(product)
  toast.success(t('productDetail.addSuccess'))
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

// 搜索框样式
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 600px;
  margin: 0 auto 32px;
  background-color: white;
  border-radius: 28px;
  padding: 12px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:focus-within {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  .search-icon {
    font-size: 20px;
    margin-right: 12px;
    color: #999;
  }

  .search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 15px;
    background: transparent;
    font-family: 'KaiTi', 'STKaiti', '楷体', 'SimKai', serif;

    &::placeholder {
      color: #999;
    }
  }

  .clear-btn {
    width: 24px;
    height: 24px;
    border: none;
    background-color: #e5e5e5;
    border-radius: 50%;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    margin-left: 8px;

    &:hover {
      background-color: #d5d5d5;
    }
  }
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

// 购物车浮动按钮（移动端专用）
.cart-float-mobile {
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

  // 在桌面端隐藏（Header 已有购物车图标）
  @media (min-width: 769px) {
    display: none;
  }

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

  .cart-float-mobile {
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
