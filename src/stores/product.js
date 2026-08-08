import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productApi } from '@/api/product'
import { getProxyImageUrl } from '@/utils/image'

export const useProductStore = defineStore('product', () => {
  // 商品列表
  const products = ref([])
  
  // 加载状态
  const loading = ref(false)
  
  // 错误信息
  const error = ref(null)
  
  // 分页信息
  const pagination = ref({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  })
  
  /**
   * 获取商品列表
   * @param {Object} params - 查询参数
   * @param {string} params.category - 分类（all/tea/fruit/cheese/coffee）
   * @param {string} params.search - 搜索关键词
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   */
  async function fetchProducts(params = {}) {
    loading.value = true
    error.value = null
    
    try {
      const response = await productApi.getProducts(params)
      
      if (response.success) {
        // 转换图片 URL 为代理路径
        products.value = response.data.items.map(product => ({
          ...product,
          image: getProxyImageUrl(product.image || product.imageUrl),
          imageUrl: getProxyImageUrl(product.image || product.imageUrl)
        }))
        
        pagination.value = {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
          totalPages: response.data.totalPages
        }
        
        // 🔍 开发调试：打印实际的商品 ID
        console.log('📦 商品列表加载成功，实际的商品 ID：')
        console.table(products.value.map(p => ({ ID: p.id, 名称: p.name, 价格: p.price })))
        
        // 🎯 开发工具：快速跳转到商品详情
        if (products.value.length > 0) {
          console.log('💡 开发工具：在控制台输入以下命令快速跳转到第一个商品详情页：')
          console.log(`   goToProduct('${products.value[0].id}')`)
          window.goToProduct = (id) => {
            window.location.href = `/product/${id || products.value[0].id}`
          }
        }
      } else {
        error.value = response.message
        products.value = []
      }
      
      return response
    } catch (err) {
      error.value = err.message || '获取商品列表失败'
      products.value = []
      console.error('获取商品列表失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * 根据 ID 获取商品（从已加载的列表中）
   * @param {number} productId - 商品 ID
   */
  function getProductById(productId) {
    return products.value.find(p => p.id === parseInt(productId))
  }
  
  /**
   * 获取商品详情（直接从 API）
   * @param {number} productId - 商品 ID
   */
  async function fetchProductDetail(productId) {
    try {
      const response = await productApi.getProductDetail(productId)
      
      // 转换图片 URL
      if (response.success && response.data) {
        response.data.image = getProxyImageUrl(response.data.image || response.data.imageUrl)
        response.data.imageUrl = getProxyImageUrl(response.data.image || response.data.imageUrl)
      }
      
      return response
    } catch (err) {
      console.error('获取商品详情失败:', err)
      throw err
    }
  }
  
  /**
   * 清空商品列表
   */
  function clearProducts() {
    products.value = []
    pagination.value = {
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 0
    }
    error.value = null
  }
  
  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    getProductById,
    fetchProductDetail,
    clearProducts
  }
})
