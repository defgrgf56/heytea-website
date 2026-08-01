<template>
  <div class="product-card" @click="goToDetail">
    <div class="product-card__image">
      <img :src="product.image" :alt="product.name" />
      <div v-if="product.isNew" class="product-card__badge">NEW</div>
      <div v-if="product.isHot" class="product-card__badge product-card__badge--hot">HOT</div>
    </div>

    <div class="product-card__content">
      <h3 class="product-card__name">{{ product.name }}</h3>
      <p class="product-card__desc">{{ product.description }}</p>
      
      <div class="product-card__footer">
        <div class="product-card__price">
          <span class="product-card__price-currency">¥</span>
          <span class="product-card__price-value">{{ product.price }}</span>
        </div>
        
        <button 
          class="product-card__add-btn" 
          @click.stop="addToCart"
        >
          <span class="icon-plus">+</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const cartStore = useCartStore()

const goToDetail = () => {
  router.push(`/product/${props.product.id}`)
}

const addToCart = () => {
  cartStore.addItem(props.product)
  // 可以添加提示动画
  console.log('已加入购物车:', props.product.name)
}
</script>

<style lang="scss" scoped>
.product-card {
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);

    .product-card__image img {
      transform: scale(1.1);
    }
  }

  &__image {
    position: relative;
    width: 100%;
    padding-top: 100%; // 1:1 比例
    overflow: hidden;
    background-color: #f5f5f5;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
  }

  &__badge {
    position: absolute;
    top: 16px;
    right: 16px;
    padding: 6px 12px;
    background-color: #ff6b00;
    color: white;
    font-size: 12px;
    font-weight: 700;
    border-radius: 20px;
    z-index: 2;

    &--hot {
      background-color: #e63946;
    }
  }

  &__content {
    padding: 20px;
  }

  &__name {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__desc {
    font-size: 14px;
    color: #999;
    margin-bottom: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.5;
    min-height: 42px;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__price {
    display: flex;
    align-items: baseline;
    color: #ff6b00;
    font-weight: 700;

    &-currency {
      font-size: 16px;
      margin-right: 2px;
    }

    &-value {
      font-size: 28px;
    }
  }

  &__add-btn {
    width: 40px;
    height: 40px;
    background-color: #ff6b00;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(255, 107, 0, 0.3);

    &:hover {
      background-color: #ff8533;
      transform: rotate(90deg) scale(1.1);
      box-shadow: 0 4px 12px rgba(255, 107, 0, 0.4);
    }

    &:active {
      transform: rotate(90deg) scale(0.95);
    }

    .icon-plus {
      font-weight: 700;
    }
  }
}
</style>
