import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductStore = defineStore('product', () => {
  // 状态
  const products = ref([])
  const categories = ref([
    { id: 'all', name: '全部', slug: 'all' },
    { id: 'cheese', name: '芝士茶', slug: 'cheese' },
    { id: 'fruit', name: '水果茶', slug: 'fruit' },
    { id: 'pure', name: '纯茶', slug: 'pure' },
    { id: 'ice', name: '冰淇淋', slug: 'ice' }
  ])
  const loading = ref(false)

  // 模拟产品数据
  const mockProducts = [
    {
      id: 1,
      name: '多肉葡萄',
      description: '满满的葡萄果肉，每一口都是葡萄香',
      price: 32,
      image: '/images/products/product-1.png',
      category: 'fruit',
      isNew: true,
      isHot: true
    },
    {
      id: 2,
      name: '芝芝莓莓',
      description: '新鲜草莓搭配浓郁芝士奶盖',
      price: 30,
      image: '/images/products/product-2.png',
      category: 'cheese',
      isNew: false,
      isHot: true
    },
    {
      id: 3,
      name: '金凤茶王',
      description: '精选凤凰单丛，纯粹茶香',
      price: 22,
      image: '/images/products/product-3.png',
      category: 'pure',
      isNew: false,
      isHot: false
    },
    {
      id: 4,
      name: '芝芝桃桃',
      description: '鲜甜水蜜桃配芝士奶盖',
      price: 29,
      image: '/images/products/product-4.png',
      category: 'cheese',
      isNew: true,
      isHot: false
    },
    {
      id: 5,
      name: '满杯红柚',
      description: '清爽红柚，维C满满',
      price: 28,
      image: '/images/products/product-5.png',
      category: 'fruit',
      isNew: false,
      isHot: true
    },
    {
      id: 6,
      name: '冰淇淋红茶',
      description: '红茶遇上香草冰淇淋',
      price: 26,
      image: '/images/products/product-6.png',
      category: 'ice',
      isNew: false,
      isHot: false
    },
    {
      id: 7,
      name: '烤黑糖波波牛乳',
      description: '香浓牛乳配Q弹波波',
      price: 24,
      image: '/images/products/product-7.png',
      category: 'cheese',
      isNew: false,
      isHot: true
    },
    {
      id: 8,
      name: '芒芒甘露',
      description: '芒果西米露，夏日必选',
      price: 31,
      image: '/images/products/product-8.png',
      category: 'fruit',
      isNew: true,
      isHot: false
    }
  ]

  // 计算属性
  const featuredProducts = computed(() => {
    return products.value.filter(p => p.isHot).slice(0, 4)
  })

  const newProducts = computed(() => {
    return products.value.filter(p => p.isNew).slice(0, 4)
  })

  // 方法
  const fetchProducts = async () => {
    loading.value = true
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      products.value = mockProducts
    } catch (error) {
      console.error('获取产品失败:', error)
    } finally {
      loading.value = false
    }
  }

  const getProductById = (id) => {
    return products.value.find(p => p.id === parseInt(id))
  }

  const getProductsByCategory = (categorySlug) => {
    if (categorySlug === 'all') {
      return products.value
    }
    return products.value.filter(p => p.category === categorySlug)
  }

  const getFeaturedProducts = () => {
    return featuredProducts.value
  }

  const getNewProducts = () => {
    return newProducts.value
  }

  return {
    products,
    categories,
    loading,
    featuredProducts,
    newProducts,
    fetchProducts,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    getNewProducts
  }
})
