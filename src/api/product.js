import { api } from './index'

// 🎭 Mock 模式开关（从环境变量读取）
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// 虚拟商品数据库
const mockProducts = [
  {
    id: 1,
    name: '芝士莓莓',
    nameEn: 'Cheese Berry',
    desc: '新鲜草莓配芝士奶盖',
    descEn: 'Fresh strawberries with cheese milk foam',
    price: 28,
    category: 'cheese',
    image: '/images/logo.webp',
    isNew: true,
    stock: 100,
    sales: 1234,
    rating: 4.8,
    sizes: ['小杯', '中杯', '大杯'],
    toppings: ['珍珠', '椰果', '芋圆', '红豆'],
    sweetness: ['标准糖', '少糖', '无糖']
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
    isNew: false,
    stock: 100,
    sales: 2156,
    rating: 4.9,
    sizes: ['小杯', '中杯', '大杯'],
    toppings: ['珍珠', '椰果', '芋圆', '红豆'],
    sweetness: ['标准糖', '少糖', '无糖']
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
    isNew: false,
    stock: 100,
    sales: 3421,
    rating: 4.7,
    sizes: ['小杯', '中杯', '大杯'],
    toppings: ['珍珠', '椰果', '芋圆', '红豆'],
    sweetness: ['标准糖', '少糖', '无糖']
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
    isNew: false,
    stock: 100,
    sales: 1876,
    rating: 4.8,
    sizes: ['小杯', '中杯', '大杯'],
    toppings: ['珍珠', '椰果', '芋圆', '红豆'],
    sweetness: ['标准糖', '少糖', '无糖']
  },
  {
    id: 5,
    name: '生打椰椰',
    nameEn: 'Fresh Coconut',
    desc: '新鲜椰子水配椰肉',
    descEn: 'Fresh coconut water with coconut meat',
    price: 27,
    category: 'fruit',
    image: '/images/logo.webp',
    isNew: false,
    stock: 100,
    sales: 1654,
    rating: 4.6,
    sizes: ['小杯', '中杯', '大杯'],
    toppings: ['珍珠', '椰果', '芋圆', '红豆'],
    sweetness: ['标准糖', '少糖', '无糖']
  },
  {
    id: 6,
    name: '厚乳拿铁',
    nameEn: 'Thick Milk Latte',
    desc: '浓郁咖啡配厚乳',
    descEn: 'Rich coffee with thick milk',
    price: 25,
    category: 'coffee',
    image: '/images/logo.webp',
    isNew: true,
    stock: 100,
    sales: 987,
    rating: 4.5,
    sizes: ['小杯', '中杯', '大杯'],
    toppings: ['珍珠', '椰果', '芋圆', '红豆'],
    sweetness: ['标准糖', '少糖', '无糖']
  },
  {
    id: 7,
    name: '烤黑糖波波鲜奶',
    nameEn: 'Roasted Brown Sugar Boba Milk',
    desc: '烤制黑糖配珍珠和鲜奶',
    descEn: 'Roasted brown sugar with boba and fresh milk',
    price: 24,
    category: 'tea',
    image: '/images/logo.webp',
    isNew: false,
    stock: 100,
    sales: 2543,
    rating: 4.9,
    sizes: ['小杯', '中杯', '大杯'],
    toppings: ['珍珠', '椰果', '芋圆', '红豆'],
    sweetness: ['标准糖', '少糖', '无糖']
  },
  {
    id: 8,
    name: '满杯红柚',
    nameEn: 'Full Cup Grapefruit',
    desc: '满满的新鲜红柚果肉',
    descEn: 'Full of fresh grapefruit pulp',
    price: 27,
    category: 'fruit',
    image: '/images/logo.webp',
    isNew: false,
    stock: 100,
    sales: 1432,
    rating: 4.7,
    sizes: ['小杯', '中杯', '大杯'],
    toppings: ['珍珠', '椰果', '芋圆', '红豆'],
    sweetness: ['标准糖', '少糖', '无糖']
  }
]

/**
 * 模拟网络延迟
 */
function mockDelay(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Mock 获取商品列表
 */
async function mockGetProducts(params = {}) {
  await mockDelay()
  
  const { category, search, page = 1, pageSize = 20 } = params
  
  // 过滤商品
  let filteredProducts = [...mockProducts]
  
  // 按分类过滤
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category === category)
  }
  
  // 按搜索关键词过滤
  if (search) {
    const searchLower = search.toLowerCase()
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.nameEn.toLowerCase().includes(searchLower) ||
      p.desc.toLowerCase().includes(searchLower) ||
      p.descEn.toLowerCase().includes(searchLower)
    )
  }
  
  // 分页
  const total = filteredProducts.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const items = filteredProducts.slice(start, end)
  
  return {
    success: true,
    data: {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    },
    message: '获取商品列表成功'
  }
}

/**
 * Mock 获取商品详情
 */
async function mockGetProductDetail(productId) {
  await mockDelay()
  
  const product = mockProducts.find(p => p.id === parseInt(productId))
  
  if (product) {
    return {
      success: true,
      data: product,
      message: '获取商品详情成功'
    }
  } else {
    return {
      success: false,
      data: null,
      message: '商品不存在'
    }
  }
}

/**
 * 商品相关 API
 */
export const productApi = {
  /**
   * 获取商品列表
   * @param {Object} params - 查询参数
   * @param {string} params.category - 分类（all/tea/fruit/cheese/coffee）
   * @param {string} params.search - 搜索关键词
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @returns {Promise<Object>}
   */
  async getProducts(params) {
    if (USE_MOCK) {
      return mockGetProducts(params)
    }
    
    // 真实 API 调用 - 适配后端参数
    const backendParams = {
      page: params.page || 1,
      pageSize: params.pageSize || 12,
      keyword: params.search, // 搜索关键词
      categoryCode: params.category === 'all' ? undefined : params.category // 分类编码
    }
    
    const queryString = new URLSearchParams(
      Object.entries(backendParams).filter(([_, v]) => v !== undefined)
    ).toString()
    
    // ⚠️ 注意：响应拦截器已经自动解包了 data，这里直接得到业务数据
    const responseData = await api.get(`/products?${queryString}`)
    
    console.log('📦 商品列表原始响应:', responseData)
    
    // 🔍 调试：打印第一个商品的完整数据
    if (responseData.list && responseData.list.length > 0) {
      console.log('🔍 第一个商品的原始数据:', responseData.list[0])
      console.log('🔍 第一个商品的 ID:', responseData.list[0].id)
      console.log('🔍 第一个商品的 _id:', responseData.list[0]._id)
    }
    
    if (!responseData || !responseData.list) {
      console.error('❌ 商品列表数据格式错误:', responseData)
      return {
        success: false,
        data: {
          items: [],
          total: 0,
          page: 1,
          pageSize: 12,
          totalPages: 0
        },
        message: '商品数据格式错误'
      }
    }
    
    // 适配响应格式
    const mappedItems = responseData.list.map(product => {
      console.log(`🔍 映射商品: ${product.name}, ID 字段:`, {
        id: product.id,
        _id: product._id,
        productId: product.productId
      })
      
      return {
        id: product.id || product._id || product.productId,  // 尝试多个可能的 ID 字段
        name: product.name,
        nameEn: product.nameEn,
        desc: product.description || product.desc,
        descEn: product.descriptionEn || product.descEn,
        price: product.price,
        category: product.categoryCode,
        image: product.imageUrl || product.image,
        isNew: product.isNew,
        isHot: product.isHot,
        stock: product.stock,
        status: product.status,
        // 规格信息（详情页可能需要）
        sizes: product.specs?.sizes || ['小杯', '中杯', '大杯'],
        toppings: product.specs?.toppings || ['珍珠', '椰果', '芋圆', '红豆'],
        sweetness: product.specs?.sweetness || ['标准糖', '少糖', '无糖']
      }
    })
    
    console.log('✅ 映射后的商品列表:', mappedItems)
    
    return {
      success: true,
      data: {
        items: mappedItems,
        total: responseData.total,
        page: responseData.page,
        pageSize: responseData.pageSize,
        totalPages: Math.ceil(responseData.total / responseData.pageSize)
      },
      message: '获取商品列表成功'
    }
  },

  /**
   * 获取商品详情
   * @param {number} productId - 商品 ID
   * @returns {Promise<Object>}
   */
  async getProductDetail(productId) {
    if (USE_MOCK) {
      return mockGetProductDetail(productId)
    }
    
    console.log('🔍 准备请求商品详情，ID:', productId, '类型:', typeof productId)
    
    // ⚠️ 注意：响应拦截器已经自动解包了 data，这里直接得到商品对象
    const product = await api.get(`/products/${productId}`)
    
    console.log('📦 商品详情原始响应:', product)
    
    if (!product) {
      return {
        success: false,
        data: null,
        message: '商品不存在'
      }
    }
    
    // 适配响应格式
    return {
      success: true,
      data: {
        id: product.id,
        name: product.name,
        nameEn: product.nameEn,
        desc: product.description || product.desc,
        descEn: product.descriptionEn || product.descEn,
        price: product.price,
        category: product.categoryCode,
        image: product.imageUrl || product.image,
        isNew: product.isNew,
        isHot: product.isHot,
        stock: product.stock,
        status: product.status,
        // 规格信息（从 specs 字段提取）
        sizes: product.specs?.sizes || [
          { code: 'small', name: '小杯', nameEn: 'Small', extraPrice: -2 },
          { code: 'medium', name: '中杯', nameEn: 'Medium', extraPrice: 0 },
          { code: 'large', name: '大杯', nameEn: 'Large', extraPrice: 3 }
        ],
        toppings: product.specs?.toppings || [
          { code: 'pearl', name: '珍珠', nameEn: 'Pearl', price: 3 },
          { code: 'coconut', name: '椰果', nameEn: 'Coconut Jelly', price: 3 },
          { code: 'pudding', name: '布丁', nameEn: 'Pudding', price: 4 }
        ],
        sweetness: product.specs?.sweetness || [
          { code: 'none', name: '无糖', nameEn: 'No Sugar' },
          { code: 'less', name: '少糖', nameEn: 'Less Sugar' },
          { code: 'normal', name: '标准糖', nameEn: 'Normal Sugar' }
        ]
      },
      message: '获取商品详情成功'
    }
  }
}

// 开发工具：在控制台查看所有商品
window.showMockProducts = function() {
  console.log('📦 当前商品列表:')
  console.table(mockProducts.map(p => ({
    ID: p.id,
    名称: p.name,
    价格: p.price,
    分类: p.category,
    销量: p.sales,
    评分: p.rating
  })))
}

console.log('📦 商品 API 已加载 (Mock 模式)')
console.log(`💡 开发工具: window.showMockProducts() - 查看所有商品`)
