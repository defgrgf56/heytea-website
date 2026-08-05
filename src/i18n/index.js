import { createI18n } from 'vue-i18n'

const messages = {
  'zh-CN': {
    nav: {
      brandStory: '品牌故事',
      products: '产品',
      stores: '门店',
      partnership: '事业合伙'
    },
    hero: {
      logoInspiration: 'logo 灵感',
      logoInspirationDesc: '一杯来自于芝士与茶相遇的"灵感"，开创了喜茶。这一杯芝士茗茶，在我们不断的对原料与制作工艺的探索与尝试中诞生了。',
      origin: '起源',
      originDesc: '2012 年，喜茶在广东江门一条名叫江边里的小巷诞生，原名皇茶 ROYALTEA，因为难以扩张且被大量山寨品牌抄袭，我们潜心升级门店形象，产品品质持续升级。',
      innovation: '开创',
      innovationDesc: '喜茶不仅开创了新茶饮新品类，也成为人气拍照打卡地标，传递出了一种年轻化、积极向上的生活态度。',
      rename: '改名',
      renameDesc: '2016 年，皇茶 ROYALTEA 全面升级为喜茶 HEYTEA。HEYTEA "喜茶" 意为在茶中寻找快乐，不断探索茶的可能性与茶的多样性，通过茶拉近人与人之间的距离。',
      promote: '推动',
      promoteDesc: '经过多年发展，我们逐步推动"新茶饮"成为一个新的品类。从最初的芝士奶盖茶、纯茶、到水果茶、咖啡、冰激凌、面包，不断以灵感推动创新。',
      reimagine: '以灵感重新想象茶',
      reimagineDesc: '我们相信任何与茶有关的产品，都有无限的可能。从一杯茶出发，不断探索各种可能性，这就是"喜茶"。'
    },
    products: {
      promise: '关于产品，我们承诺',
      realMilk: '真奶',
      noCreamer: '无奶精',
      realTea: '真茶',
      noTeaPowder: '无茶精',
      realSugar: '真糖*',
      noSyrup: '从不使用果葡糖浆',
      note: '*除方糖戒奶茶虽无添加如需添加的糖本其类为位居多源，其他奶茶以添加公开天然蔗糖为主。'
    },
    footer: {
      moreInfo: '更多信息',
      icp: '©heytea.com 粤 ICP 备 17016191 号 -2',
      police: '粤公网安备 44030502004869 号',
      company: '深圳美西西餐饮管理有限公司',
      address: '地址：深圳市南山区前海路D009 号海洋金融中心 28 层',
      accessibility: '无障碍声明',
      notice1: '若对方以招募形式要求提供个人财力证明文件（单人/多人互助募资业务）（VMJA9J 2134 修复课）。',
      notice2: '我们提供安全服务于网站运营和用户服务，前提提供您的实名信息、证据信息（customerservice@heytea.com）联系我们，我们过意志提供服务。如实提供服务申请服务支持的人意见及案源。'
    },
    stores: {
      title: '门店查询',
      subtitle: '找到离你最近的喜茶',
      searchPlaceholder: '搜索城市或地址',
      selectCity: '选择城市',
      allCities: '全部',
      totalStores: '门店总数',
      citiesCovered: '覆盖城市',
      noStores: '未找到相关门店',
      businessHours: '营业时间',
      navigate: '导航'
    },
    partnership: {
      title: '喜茶全球合伙人招募',
      subtitle: '与喜茶一起，开启茶饮事业新篇章',
      desc1: '喜茶全球合伙人招募项目已正式宣启，并于多个国际区域开放井然。',
      desc2: '我们诚邀拥有长期视野与本地资源的伙伴，共同推动新中式茶饮走向世界。',
      contactText: '如需加盟咨询，请通过以下方式联系我们',
      cooperationMode: '合作模式',
      storeJoin: '门店加盟',
      storeJoinDesc: '开设喜茶品牌门店，共享品牌价值',
      regionalAgent: '区域代理',
      regionalAgentDesc: '成为区域合作伙伴，拓展市场',
      supplyChain: '供应链合作',
      supplyChainDesc: '优质原料供应商合作机会',
      advantages: '合作优势',
      benefit1: '✓ 知名品牌支持',
      benefit2: '✓ 完善运营体系',
      benefit3: '✓ 专业培训指导',
      benefit4: '✓ 持续产品研发',
      applyTitle: '申请合作',
      applyDesc: '如有合作意向，请联系我们',
      contactNow: '立即咨询',
      countries: {
        australia: '澳大利亚',
        korea: '韩国',
        canada: '加拿大',
        usa: '美国',
        malaysia: '马来西亚',
        japan: '日本',
        singapore: '新加坡',
        uk: '英国'
      }
    },
    login: {
      title: '登录喜茶',
      registerTitle: '注册账号',
      username: '用户名',
      usernamePlaceholder: '请输入用户名',
      email: '邮箱',
      emailPlaceholder: '请输入邮箱地址',
      password: '密码',
      passwordPlaceholder: '请输入密码（至少6位）',
      confirmPassword: '确认密码',
      confirmPasswordPlaceholder: '请再次输入密码',
      loginBtn: '登录',
      registerBtn: '注册',
      loading: '处理中...',
      hasAccount: '已有账号？立即登录',
      noAccount: '还没有账号？立即注册',
      backHome: '← 返回首页',
      passwordNotMatch: '两次输入的密码不一致',
      registerSuccess: '注册成功！请登录',
      registerFailed: '注册失败，请重试',
      loginFailed: '登录失败，请检查用户名和密码',
      networkError: '网络错误，请稍后重试',
      profile: '个人中心',
      logout: '退出登录'
    }
  },
  'en': {
    nav: {
      brandStory: 'Brand Story',
      products: 'Products',
      stores: 'Stores',
      partnership: 'Partnership'
    },
    hero: {
      logoInspiration: 'Logo Inspiration',
      logoInspirationDesc: 'An "inspiration" from the encounter between cheese and tea created HEYTEA. This cup of cheese tea was born from our continuous exploration and experimentation with ingredients and production techniques.',
      origin: 'Origin',
      originDesc: 'In 2012, HEYTEA was born in a small alley called Jiangbianli in Jiangmen, Guangdong, originally named ROYALTEA. Due to difficulty in expansion and being copied by numerous counterfeit brands, we devoted ourselves to upgrading our store image and continuously improving product quality.',
      innovation: 'Innovation',
      innovationDesc: 'HEYTEA not only created a new tea beverage category but also became a popular photo spot, conveying a youthful and positive attitude towards life.',
      rename: 'Rebranding',
      renameDesc: 'In 2016, ROYALTEA was fully upgraded to HEYTEA. HEYTEA means finding joy in tea, constantly exploring the possibilities and diversity of tea, bringing people closer together through tea.',
      promote: 'Promotion',
      promoteDesc: 'After years of development, we gradually promoted "new tea beverages" as a new category. From the initial cheese milk cap tea, pure tea, to fruit tea, coffee, ice cream, and bread, we continue to drive innovation with inspiration.',
      reimagine: 'Reimagine Tea with Inspiration',
      reimagineDesc: 'We believe that any tea-related product has infinite possibilities. Starting from a cup of tea and constantly exploring various possibilities - this is "HEYTEA".'
    },
    products: {
      promise: 'Our Product Promise',
      realMilk: 'Real Milk',
      noCreamer: 'No Creamer',
      realTea: 'Real Tea',
      noTeaPowder: 'No Tea Powder',
      realSugar: 'Real Sugar*',
      noSyrup: 'Never use high fructose corn syrup',
      note: '*Except for sugar-free milk tea, other milk teas are mainly added with natural cane sugar.'
    },
    footer: {
      moreInfo: 'More Information',
      icp: '©heytea.com ICP Registration No. 17016191-2',
      police: 'Public Security Registration No. 44030502004869',
      company: 'Shenzhen Meixixi Catering Management Co., Ltd.',
      address: 'Address: 28th Floor, Ocean Financial Center, D009 Qianhai Road, Nanshan District, Shenzhen',
      accessibility: 'Accessibility Statement',
      notice1: 'If the other party requires you to provide personal financial proof documents in the form of recruitment (single/multi-person mutual fund-raising business) (VMJA9J 2134 repair course).',
      notice2: 'We provide secure services for website operations and user services. The premise is to provide your real-name information and evidence information (customerservice@heytea.com) to contact us, and we will provide services. Provide service application support opinions and case sources as appropriate.'
    },
    stores: {
      title: 'Store Locator',
      subtitle: 'Find the nearest HEYTEA to you',
      searchPlaceholder: 'Search city or address',
      selectCity: 'Select City',
      allCities: 'All',
      totalStores: 'Total Stores',
      citiesCovered: 'Cities Covered',
      noStores: 'No stores found',
      businessHours: 'Business Hours',
      navigate: 'Navigate'
    },
    partnership: {
      title: 'HEYTEA Global Partnership Recruitment',
      subtitle: 'Join HEYTEA and start a new chapter in the tea beverage business',
      desc1: 'The HEYTEA Global Partnership Recruitment program has been officially launched and is now open in multiple international regions.',
      desc2: 'We sincerely invite partners with long-term vision and local resources to jointly promote new-style Chinese tea beverages to the world.',
      contactText: 'For franchise inquiries, please contact us via:',
      cooperationMode: 'Cooperation Models',
      storeJoin: 'Store Franchise',
      storeJoinDesc: 'Open a HEYTEA branded store and share brand value',
      regionalAgent: 'Regional Agent',
      regionalAgentDesc: 'Become a regional partner and expand the market',
      supplyChain: 'Supply Chain Cooperation',
      supplyChainDesc: 'Quality raw material supplier cooperation opportunities',
      advantages: 'Partnership Advantages',
      benefit1: '✓ Well-known brand support',
      benefit2: '✓ Complete operating system',
      benefit3: '✓ Professional training guidance',
      benefit4: '✓ Continuous product development',
      applyTitle: 'Apply for Partnership',
      applyDesc: 'If you are interested in cooperation, please contact us',
      contactNow: 'Contact Now',
      countries: {
        australia: 'Australia',
        korea: 'Korea',
        canada: 'Canada',
        usa: 'USA',
        malaysia: 'Malaysia',
        japan: 'Japan',
        singapore: 'Singapore',
        uk: 'UK'
      }
    },
    login: {
      title: 'Login to HEYTEA',
      registerTitle: 'Create Account',
      username: 'Username',
      usernamePlaceholder: 'Enter your username',
      email: 'Email',
      emailPlaceholder: 'Enter your email address',
      password: 'Password',
      passwordPlaceholder: 'Enter password (at least 6 characters)',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Re-enter password',
      loginBtn: 'Login',
      registerBtn: 'Register',
      loading: 'Processing...',
      hasAccount: 'Already have an account? Login now',
      noAccount: 'Don\'t have an account? Register now',
      backHome: '← Back to Home',
      passwordNotMatch: 'Passwords do not match',
      registerSuccess: 'Registration successful! Please login',
      registerFailed: 'Registration failed, please try again',
      loginFailed: 'Login failed, please check username and password',
      networkError: 'Network error, please try again later',
      profile: 'Profile',
      logout: 'Logout'
    }
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages
})

export default i18n
