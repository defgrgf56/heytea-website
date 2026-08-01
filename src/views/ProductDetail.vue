<template>
  <div class="product-detail" v-if="product">
    <div class="container">
      <div class="product-detail__content">
        <!-- 产品图片 -->
        <div class="product-detail__image">
          <img :src="product.image" :alt="product.name" />
        </div>

        <!-- 产品信息 -->
        <div class="product-detail__info">
          <div class="badges">
            <span v-if="product.isNew" class="badge badge--new">NEW</span>
            <span v-if="product.isHot" class="badge badge--hot">HOT</span>
          </div>

          <h1 class="product-name">{{ product.name }}</h1>
          <p class="product-desc">{{ product.description }}</p>

          <div class="product-price">
            <span class="currency">¥</span>
            <span class="value">{{ product.price }}</span>
          </div>

          <!-- 规格选择 -->
          <div class="options">
            <div class="option-group">
              <h4>温度</h4>
              <div class="option-buttons">
                <button 
                  v-for="temp in temperatures" 
                  :key="temp"
                  :class="['option-btn', { active: selectedTemp === temp }]"
                  @click="selectedTemp = temp"
                >
                  {{ temp }}
                </button>
              </div>
            </div>

            <div class="option-group">
              <h4>甜度</h4>
              <div class="option-buttons">
                <button 
                  v-for="sweet in sweetness" 
                  :key="sweet"
                  :class="['option-btn', { active: selectedSweet === sweet }]"
                  @click="selectedSweet = sweet"
                >
                  {{ sweet }}
                </button>
              </div>
            </div>
          </div>

          <!-- 数量选择 -->
          <div class="quantity">
            <h4>数量</h4>
            <div class="quantity-control">
              <button class="quantity-btn" @click="decreaseQuantity">-</button>
              <span class="quantity-value">{{ quantity }}</span>
              <button class="quantity-btn" @click="increaseQuantity">+</button>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="actions">
            <button class="btn-add-cart" @click="addToCart">
              加入购物车
            </button>
            <button class="btn-buy-now" @click="buyNow">
              立即购买
            </button>
          </div>
        </div>
      </div>

      <!-- 推荐产品 -->
      <section class="recommendations">
        <h2 class="section-title">你可能也喜欢</h2>
        <div class="products-grid">
          <ProductCard 
            v-for="item in recommendedProducts" 
            :key="item.id"
            :product="item"
          />
        </div>
      </section>
    </div>
  </div>

  <div v-else class="product-detail product-detail--loading">
    <div class="loading"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()

const product = ref(null)
const selectedTemp = ref('冷')
const selectedSweet = ref('标准糖')
const quantity = ref(1)

const temperatures = ['冷', '热', '温', '去冰']
const sweetness = ['无糖', '三分糖', '五分糖', '标准糖']

const recommendedProducts = computed(() => {
  if (!product.value) return []
  return productStore.products
    .filter(p => p.id !== product.value.id && p.category === product.value.category)
    .slice(0, 4)
})

const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  const cartItem = {
    ...product.value,
    selectedTemp: selectedTemp.value,
    selectedSweet: selectedSweet.value,
    quantity: quantity.value
  }
  
  for (let i = 0; i < quantity.value; i++) {
    cartStore.addItem(product.value)
  }
  
  alert(`已添加 ${quantity.value} 杯到购物车`)
}

const buyNow = () => {
  addToCart()
  router.push('/checkout')
}

onMounted(async () => {
  await productStore.fetchProducts()
  const productId = parseInt(route.params.id)
  product.value = productStore.getProductById(productId)
  
  if (!product.value) {
    router.push('/products')
  }
})
</script>

<style lang="scss" scoped>
.product-detail {
  padding-top: 100px;
  padding-bottom: 80px;
  min-height: 100vh;

  &--loading {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    margin-bottom: 80px;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }

  &__image {
    position: sticky;
    top: 100px;
    height: fit-content;
    
    img {
      width: 100%;
      border-radius: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
  }

  &__info {
    padding: 20px 0;
  }
}

.badges {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.badge {
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 20px;
  color: white;

  &--new {
    background-color: #ff6b00;
  }

  &--hot {
    background-color: #e63946;
  }
}

.product-name {
  font-size: 42px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
}

.product-desc {
  font-size: 18px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 32px;
}

.product-price {
  display: flex;
  align-items: baseline;
  color: #ff6b00;
  margin-bottom: 40px;

  .currency {
    font-size: 24px;
    font-weight: 700;
    margin-right: 4px;
  }

  .value {
    font-size: 48px;
    font-weight: 700;
  }
}

.options {
  margin-bottom: 32px;
}

.option-group {
  margin-bottom: 24px;

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 12px;
  }
}

.option-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.option-btn {
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  border: 2px solid #e0e0e0;
  background-color: white;
  color: #666;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff6b00;
    color: #ff6b00;
  }

  &.active {
    background-color: #ff6b00;
    border-color: #ff6b00;
    color: white;
  }
}

.quantity {
  margin-bottom: 40px;

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 12px;
  }
}

.quantity-control {
  display: inline-flex;
  align-items: center;
  gap: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 8px 16px;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 700;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background-color: #ff6b00;
    color: white;
  }
}

.quantity-value {
  font-size: 18px;
  font-weight: 600;
  min-width: 32px;
  text-align: center;
}

.actions {
  display: flex;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  button {
    flex: 1;
    padding: 18px 40px;
    font-size: 18px;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
}

.btn-add-cart {
  background-color: white;
  color: #ff6b00;
  border: 2px solid #ff6b00 !important;

  &:hover {
    background-color: #fff5f0;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(255, 107, 0, 0.2);
  }
}

.btn-buy-now {
  background-color: #ff6b00;
  color: white;

  &:hover {
    background-color: #ff8533;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(255, 107, 0, 0.4);
  }
}

.recommendations {
  margin-top: 80px;
  padding-top: 80px;
  border-top: 1px solid #e0e0e0;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 48px;
  color: #1a1a1a;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
}
</style>
