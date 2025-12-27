<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Featured Products</h3>
      <button
        @click="openModal"
        class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
      >
        <Icon name="heroicons-outline:plus" class="w-4 h-4" />
        Add Products
      </button>
    </div>

    <!-- Selected Products List -->
    <div v-if="selectedProducts.length > 0" class="space-y-4">
      <div
        v-for="(product, index) in selectedProducts"
        :key="product.id"
        class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center gap-4">
          <!-- Product Image -->
          <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            <Icon name="heroicons-outline:cube" class="w-8 h-8 text-gray-400" />
          </div>

          <!-- Product Info -->
          <div>
            <h4 class="font-medium text-gray-900">{{ getProductName(product) }}</h4>
            <p class="text-sm text-gray-500">{{ formatPrice(product.price) }}</p>
            <span v-if="product.is_featured" class="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full mt-1">
              Featured Product
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Move Up -->
          <button
            @click="moveProduct(index, 'up')"
            :disabled="index === 0"
            class="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="heroicons-outline:chevron-up" class="w-4 h-4" />
          </button>

          <!-- Move Down -->
          <button
            @click="moveProduct(index, 'down')"
            :disabled="index === selectedProducts.length - 1"
            class="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="heroicons-outline:chevron-down" class="w-4 h-4" />
          </button>

          <!-- Remove -->
          <button
            @click="removeProduct(index)"
            class="p-2 text-red-400 hover:text-red-600"
          >
            <Icon name="heroicons-outline:x" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <Icon name="heroicons-outline:cube" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-500 mb-4">No products selected for this technology</p>
      <button
        @click="openModal"
        class="text-primary hover:text-primary/80 font-medium"
      >
        Select products to feature
      </button>
    </div>

    <!-- Product Selection Modal -->
    <div
      v-if="showProductModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="closeModal"
    >
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden" @click.stop>
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Select Products</h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <Icon name="heroicons-outline:x" class="w-6 h-6" />
          </button>
        </div>

        <div class="p-6" v-if="showProductModal">
          <!-- Search and Filters Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search by name, SKU, or slug..."
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  @input="onSearchInput"
                  @keyup="onSearchInput"
                  @paste="onSearchInput"
                />
                <Icon name="heroicons-outline:search" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                
                <!-- Clear search button -->
                <button
                  v-if="searchQuery"
                  @click="clearSearch"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Icon name="heroicons-outline:x" class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Category Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
              <select
                v-model="selectedCategory"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              >
                <option value="">All Categories</option>
                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ getCategoryName(category) }}
                </option>
              </select>
            </div>
          </div>

          <!-- Results Info -->
          <div class="flex items-center justify-between mb-4 text-sm text-gray-600">
            <span>{{ filteredProducts.length }} product(s) available</span>
            <span v-if="selectedProducts.length > 0" class="text-primary font-medium">
              {{ selectedProducts.length }} selected
            </span>
          </div>

          <!-- Loading state -->
          <div v-if="loading" class="flex items-center justify-center py-8">
            <div class="text-center">
              <Icon name="heroicons-outline:refresh" class="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
              <p class="text-gray-500">Loading products...</p>
            </div>
          </div>

          <!-- No results -->
          <div v-else-if="filteredProducts.length === 0" class="text-center py-8">
            <Icon name="heroicons-outline:search" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 mb-2">No products found</p>
            <p class="text-sm text-gray-400">Try adjusting your search or category filter</p>
          </div>

          <!-- Products Grid Container with sticky footer -->
          <div v-else class="flex flex-col h-96">
            <!-- Products Grid - Scrollable -->
            <div class="flex-1 overflow-y-auto pr-2">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div
                  v-for="product in filteredProducts"
                  :key="product.id"
                  class="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-all duration-200"
                  :class="{
                    'ring-2 ring-primary bg-primary/5 border-primary': isProductSelected(product.id)
                  }"
                  @click="toggleProduct(product)"
                >
                  <!-- Product Image -->
                  <div class="relative w-full h-20 bg-gray-100 rounded-lg overflow-hidden mb-2 flex items-center justify-center">
                    <NuxtImg
                      v-if="product.images?.length > 0"
                      :src="product.images.sort((a, b) => a.position - b.position)[0]?.url"
                      :alt="getProductName(product)"
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <Icon v-else name="heroicons-outline:cube" class="w-6 h-6 text-gray-400" />
                    
                    <!-- Selection indicator -->
                    <div 
                      v-if="isProductSelected(product.id)"
                      class="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                    >
                      <Icon name="heroicons-outline:check" class="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <!-- Product Info -->
                  <div>
                    <h4 class="font-medium text-gray-900 mb-1 text-sm line-clamp-2 leading-tight">
                      {{ getProductName(product) }}
                    </h4>
                    <p class="text-xs text-gray-500 mb-2">{{ formatPrice(product.price) }}</p>
                    
                    <div class="flex items-center justify-between">
                      <span v-if="product.is_featured" class="inline-block px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                        Featured
                      </span>
                      <span v-if="product.sku" class="text-xs text-gray-400">
                        {{ product.sku }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sticky Footer with Actions -->
            <div class="border-t border-gray-200 bg-gray-50 p-4 mt-4 rounded-b-lg">
              <div class="flex justify-between items-center">
                <div class="text-sm text-gray-600">
                  <span class="font-medium">{{ selectedProducts.length }}</span> products selected
                </div>
                <div class="flex gap-3">
                  <button
                    @click="closeModal"
                    class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    @click="saveSelection"
                    class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    :disabled="selectedProducts.length === 0"
                    :class="{ 'opacity-50 cursor-not-allowed': selectedProducts.length === 0 }"
                  >
                    Save Selection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  technologyId: {
    type: String,
    required: true
  },
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const { locale } = useI18n()
const supabase = useSupabaseClient()

// State
const selectedProducts = ref([...props.modelValue])
const showProductModal = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const products = ref([])
const categories = ref([])
const loading = ref(false)

// Load data
const loadProducts = async () => {
  loading.value = true
  try {
    console.log('Loading products...')
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name_translations,
        slug,
        price,
        sku,
        is_featured,
        is_active,
        categories (
          id,
          name_translations
        ),
        images:product_images(url, position)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    
    products.value = data || []
    console.log('Products loaded:', products.value.length, 'products')
    
    // Debug first few products
    if (products.value.length > 0) {
      console.log('Sample products:', products.value.slice(0, 3).map(p => ({
        id: p.id,
        name: getProductName(p),
        slug: p.slug,
        sku: p.sku
      })))
    }
  } catch (error) {
    console.error('Error loading products:', error)
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name_translations, slug')
      .eq('is_active', true)
      .order('name_translations->fr')

    if (error) throw error
    categories.value = data || []
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

// Computed
const filteredProducts = computed(() => {
  console.log('🔍 Filtering products...', {
    totalProducts: products.value.length,
    searchQuery: searchQuery.value,
    selectedCategory: selectedCategory.value
  })
  
  let filtered = [...products.value]

  // Filter by search query
  if (searchQuery.value && searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    console.log('🔎 Applying search filter:', query)
    
    filtered = filtered.filter(product => {
      const productName = getProductName(product).toLowerCase()
      const productSlug = product.slug?.toLowerCase() || ''
      const productSku = product.sku?.toLowerCase() || ''
      
      const matches = productName.includes(query) || 
                     productSlug.includes(query) || 
                     productSku.includes(query)
      
      if (matches) {
        console.log('✅ Match found:', productName)
      }
      
      return matches
    })
    
    console.log('🎯 Search results:', filtered.length, 'products found')
  }

  // Filter by category
  if (selectedCategory.value) {
    console.log('📂 Applying category filter:', selectedCategory.value)
    filtered = filtered.filter(product => 
      product.categories?.id === selectedCategory.value
    )
  }

  console.log('✨ Final filtered results:', filtered.length)
  return filtered
})

// Methods
const getProductName = (product) => {
  return product.name_translations?.[locale.value] || 
         product.name_translations?.fr || 
         product.name_translations?.en || 
         'Unnamed Product'
}

const getCategoryName = (category) => {
  return category.name_translations?.[locale.value] || 
         category.name_translations?.fr || 
         category.name_translations?.en || 
         'Unnamed Category'
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price) + ' DZD'
}

const isProductSelected = (productId) => {
  return selectedProducts.value.some(p => p.id === productId)
}

const toggleProduct = (product) => {
  const index = selectedProducts.value.findIndex(p => p.id === product.id)
  if (index >= 0) {
    selectedProducts.value.splice(index, 1)
  } else {
    selectedProducts.value.push(product)
  }
}

const removeProduct = async (index) => {
  selectedProducts.value.splice(index, 1)
  
  // Save to database immediately
  try {
    const { saveSelectedFeaturedProducts } = useTechnologyProducts()
    const productsToSave = selectedProducts.value.map((product, idx) => ({
      id: product.id,
      display_order: idx + 1
    }))
    
    await saveSelectedFeaturedProducts(props.technologyId, productsToSave)
    emit('update:modelValue', selectedProducts.value)
  } catch (error) {
    console.error('Error saving after product removal:', error)
  }
}

const moveProduct = async (index, direction) => {
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex >= 0 && newIndex < selectedProducts.value.length) {
    const item = selectedProducts.value.splice(index, 1)[0]
    selectedProducts.value.splice(newIndex, 0, item)
    
    // Save to database immediately
    try {
      const { saveSelectedFeaturedProducts } = useTechnologyProducts()
      const productsToSave = selectedProducts.value.map((product, idx) => ({
        id: product.id,
        display_order: idx + 1
      }))
      
      await saveSelectedFeaturedProducts(props.technologyId, productsToSave)
      emit('update:modelValue', selectedProducts.value)
    } catch (error) {
      console.error('Error saving after product move:', error)
    }
  }
}

const saveSelection = async () => {
  try {
    // Save to database
    const { saveSelectedFeaturedProducts } = useTechnologyProducts()
    const productsToSave = selectedProducts.value.map((product, index) => ({
      id: product.id,
      display_order: index + 1
    }))
    
    const { error } = await saveSelectedFeaturedProducts(props.technologyId, productsToSave)
    
    if (error) {
      console.error('Error saving featured products:', error)
      // You might want to show an error message to the user here
      return
    }
    
    console.log('Featured products saved successfully')
    emit('update:modelValue', selectedProducts.value)
    showProductModal.value = false
  } catch (error) {
    console.error('Error in saveSelection:', error)
  }
}

// Search functions
const onSearchInput = (event) => {
  console.log('🎯 Search input event triggered!')
  console.log('Event target value:', event.target.value)
  console.log('searchQuery.value:', searchQuery.value)
  console.log('Total products:', products.value.length)
  
  // Force reactivity update
  nextTick(() => {
    console.log('Filtered products after nextTick:', filteredProducts.value.length)
  })
}

const clearSearch = () => {
  searchQuery.value = ''
  console.log('🧹 Search cleared')
}

const openModal = async () => {
  console.log('🚀 Opening product selection modal...')
  showProductModal.value = true
  
  // Load products and categories when modal opens
  if (products.value.length === 0 || categories.value.length === 0) {
    console.log('📦 Loading products and categories...')
    await Promise.all([
      loadProducts(),
      loadCategories()
    ])
  } else {
    console.log('✅ Data already loaded:', products.value.length, 'products,', categories.value.length, 'categories')
  }
}

const closeModal = () => {
  showProductModal.value = false
  searchQuery.value = ''
  selectedCategory.value = ''
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  selectedProducts.value = [...newValue]
}, { deep: true })

// Watch search query for debugging
watch(searchQuery, (newQuery, oldQuery) => {
  console.log('🔍 Search query changed:', {
    from: oldQuery,
    to: newQuery,
    productsCount: products.value.length
  })
}, { immediate: true })

// Load existing selected products for this technology
const loadExistingSelections = async () => {
  try {
    const { getSelectedFeaturedProducts } = useTechnologyProducts()
    const existingProducts = await getSelectedFeaturedProducts(props.technologyId)
    selectedProducts.value = existingProducts
    console.log('Loaded existing selections:', existingProducts.length, 'products')
  } catch (error) {
    console.error('Error loading existing selections:', error)
  }
}

// Initialize - Load existing selections on mount
onMounted(() => {
  console.log('📋 ProductSelector component mounted for technology:', props.technologyId)
  loadExistingSelections()
})
</script>