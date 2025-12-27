<template>
  <div class="pt-3 px-4 sm:p-6">
    <!-- En-tête -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl md:text-2xl font-medium text-gray-900">Produits</h1>
        <p class="mt-2 text-sm text-gray-700">
          Gérez vos produits, votre inventaire et vos prix
        </p>
      </div>
      <div class="flex mt-4 sm:mt-0 sm:ml-16 gap-3 sm:flex-none">
        <button
          @click="openConfigModal"
          :disabled="isLoading"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Configurer la section
        </button>
        <AdminProductsConfigModal
          :showConfigModal="showConfigModal"
          :isLoading="isLoading"
          :configData="configData"
          @close="closeConfigModal"
          @save="saveConfig"
        />
        <NuxtLink
          to="/admin/products/create"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Ajouter un produit
        </NuxtLink>
      </div>
    </div>

    <!-- Filtres -->
    <div class="mt-8 flex overflow-x-auto flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <input
          type="search"
          v-model="filters.search"
          placeholder="Rechercher des produits..."
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div class="flex gap-4">
        <select
          v-if="configData.categories_enabled"
          v-model="filters.category"
          class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Toutes les catégories</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>

        <select
          v-model="filters.status"
          class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
          <option value="out_of_stock">En rupture de stock</option>
        </select>

        <select
          v-model="sortBy"
          class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="created_at:desc">Plus récents</option>
          <option value="created_at:asc">Plus anciens</option>
          <option value="name:asc">Nom A-Z</option>
          <option value="name:desc">Nom Z-A</option>
          <option value="price:asc">Prix croissant</option>
          <option value="price:desc">Prix décroissant</option>
        </select>
      </div>
    </div>

    <!-- Tableau -->
    <div class="mt-8 overflow-x-auto flex flex-col overflow-hidden">
      <div class="mx-auto px-1 sm:px-6 lg:px-8 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle overflow-x-auto">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="relative px-7 sm:w-12 sm:px-6">
                    <input
                      type="checkbox"
                      class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      v-model="selectAll"
                      @change="toggleSelectAll"
                    />
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Produit</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Catégorie</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Prix</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Stock</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Statut</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-if="loading" class="animate-pulse">
                  <td colspan="7" class="px-3 py-4 text-center text-sm text-gray-500">
                    Chargement des produits...
                  </td>
                </tr>
                <tr v-else-if="!products.length">
                  <td colspan="7" class="px-3 py-4 text-center text-sm text-gray-500">
                    Aucun produit trouvé
                  </td>
                </tr>
                <tr
                  v-for="product in products"
                  :key="product.id"
                  :class="{ 'bg-gray-50': selectedProducts.includes(product.id) }"
                >
                  <td class="relative px-7 sm:w-12 sm:px-6">
                    <input
                      type="checkbox"
                      class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      :value="product.id"
                      v-model="selectedProducts"
                    />
                  </td>
                  <td class="whitespace-nowrap px-3 py-4">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0">
                        <NuxtImg
                          :src="product.images?.[0]?.url || '/images/placeholders/placeholder-product.svg'"
                          :alt="product.name"
                          class="h-10 w-10 rounded-full object-cover"
                        />
                      </div>
                      <div class="ml-4">
                        <div class="font-medium text-gray-900">{{ product.name }}</div>
                        <div class="text-gray-500">Réf : {{ product.sku }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ product.category?.name }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div>{{ product.price.toFixed(2) }} DZD</div>
                    <div v-if="product.compare_at_price" class="text-xs text-gray-400 line-through">
                      {{ product.compare_at_price.toFixed(2) }} DZD
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      :class="[
                        product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                        'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                      ]"
                    >
                      {{ product.quantity > 0 ? `${product.quantity} en stock` : 'En rupture de stock' }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <button
                      @click="toggleStatus(product)"
                      :class="[
                        product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800',
                        'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                      ]"
                    >
                      {{ product.is_active ? 'Actif' : 'Inactif' }}
                    </button>
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div class="flex justify-end gap-4">
                      <NuxtLink :to="`/products/${product.slug}`" target="_blank" class="text-gray-600 hover:text-gray-900">
                        Voir
                      </NuxtLink>
                      <NuxtLink :to="`/admin/products/${product.id}/edit`" class="text-blue-600 hover:text-blue-900">
                        Modifier
                      </NuxtLink>
                      <button @click="deleteProduct(product)" class="text-red-600 hover:text-red-900">
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions groupées -->
    <div v-if="selectedProducts.length" class="bottom-0 inset-x-0 pb-2 sm:pb-5">
      <div class="rounded-lg bg-blue-600 p-2 shadow-lg sm:p-3">
        <div class="flex flex-wrap items-center justify-between">
          <div class="flex w-0 flex-1 items-center">
            <span class="flex rounded-lg bg-blue-800 p-2">
              <Icon name="heroicons-outline:check" class="h-6 w-6 text-white" />
            </span>
            <p class="ml-3 font-medium text-white truncate">
              <span class="md:hidden">{{ selectedProducts.length }} sélectionné(s)</span>
              <span class="hidden md:inline">{{ selectedProducts.length }} produits sélectionnés</span>
            </p>
          </div>
          <div class="flex gap-3">
            <button
              @click="bulkActivate"
              class="flex items-center justify-center rounded-md border border-transparent bg-blue-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Activer
            </button>
            <button
              @click="bulkDeactivate"
              class="flex items-center justify-center rounded-md border border-transparent bg-blue-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Désactiver
            </button>
            <button
              @click="bulkDelete"
              class="flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="px-1 sm:p-0">
      <div class="flex items-center justify-between border border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-md">
        <div class="flex flex-1 justify-between sm:hidden">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Précédent
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Suivant
          </button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Affichage de <span class="font-medium">{{ startIndex + 1 }}</span> à
              <span class="font-medium">{{ endIndex }}</span> sur
              <span class="font-medium">{{ totalProducts }}</span> résultats
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button @click="prevPage" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                <span class="sr-only">Précédent</span>
                <Icon name="heroicons-outline:chevron-left" class="h-5 w-5" />
              </button>
              <button
                v-for="page in displayedPages"
                :key="page"
                @click="goToPage(page)"
                :disabled="page === '...'"
                :class="[
                  page === currentPage
                    ? 'relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                    : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
                  page === '...' ? 'cursor-default' : ''
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span class="sr-only">Suivant</span>
                <Icon name="heroicons-outline:chevron-right" class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { showConfirmation } = useConfirmationModal()
const { showError } = useErrorModal()
const { showSuccess } = useSuccessSnackbar()
const supabase = useSupabaseClient()

// State
const loading = ref(false)
const products = ref([])
const categories = ref([])
const selectedProducts = ref([])
const selectAll = ref(false)
const totalProducts = ref(0)
const currentPage = ref(1)
const itemsPerPage = 10
const showConfigModal = ref(false)
const configData = ref({
  products_enabled: true,
  categories_enabled: true
})
const isLoading = ref(false)

// Filters
const filters = ref({
  search: '',
  category: '',
  status: ''
})
const sortBy = ref('created_at:desc')

// Config Modal
const openConfigModal = () => {
  showConfigModal.value = true
}

const closeConfigModal = () => {
  showConfigModal.value = false
}

// Fetch features config
const fetchConfig = async () => {
  try {
    const { data, error } = await supabase
      .from('features_config')
      .select('categories_enabled')
      .single()

    if (error && error.code !== 'PGRST116') throw error

    if (data) {
      configData.value = data
    }
  } catch (error) {
    console.error('Error loading config:', error)
    showError('Impossible de charger la configuration')
  }
}

// Save config
const saveConfig = async (formData) => {
  isLoading.value = true
  try {
    const { error } = await supabase
      .from('features_config')
      .update({
        products_enabled: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', configData.value.id)

    if (error) throw error

    await fetchConfig()
    showConfigModal.value = false
    showSuccess('Configuration mise à jour')
  } catch (error) {
    console.error('Error saving config:', error)
    showError('Impossible de sauvegarder la configuration')
  } finally {
    isLoading.value = false
  }
}

// Computed
const startIndex = computed(() => Math.max(0, (currentPage.value - 1) * itemsPerPage))
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, totalProducts.value || itemsPerPage))
const totalPages = computed(() => Math.ceil(totalProducts.value / itemsPerPage))

const displayedPages = computed(() => {
  const delta = 2
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= totalPages.value; i++) {
    if (i === 1 || i === totalPages.value || (i >= currentPage.value - delta && i <= currentPage.value + delta)) {
      range.push(i)
    }
  }

  range.forEach((i) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  })

  return rangeWithDots
})

// Fetch categories
const fetchCategories = async () => {
  if (!configData.value.categories_enabled) return

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name_translations')
      .eq('is_active', true)

    if (error) throw error

    categories.value = data.map(cat => ({
      id: cat.id,
      name: cat.name_translations?.fr || cat.name_translations?.en || ''
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    categories.value = []
  }
}

// Fetch products
const fetchProducts = async () => {
  loading.value = true

  try {
    let query = supabase
      .from('products')
      .select('*, category:categories(name_translations), images:product_images(*)', { count: 'exact' })

    // Apply filters
    if (filters.value.search) {
      query = query.or(
        `name_translations->>fr.ilike.%${filters.value.search}%,sku.ilike.%${filters.value.search}%`
      )
    }

    if (filters.value.category) {
      query = query.eq('category_id', filters.value.category)
    }

    if (filters.value.status) {
      switch (filters.value.status) {
        case 'active':
          query = query.eq('is_active', true)
          break
        case 'inactive':
          query = query.eq('is_active', false)
          break
        case 'out_of_stock':
          query = query.eq('quantity', 0)
          break
      }
    }

    // Apply sorting
    const [field, direction] = sortBy.value.split(':')
    if (field === 'name') {
      query = query.order(`name_translations->fr`, { ascending: direction === 'asc' })
    } else {
      query = query.order(field, { ascending: direction === 'asc' })
    }

    // Pagination
    const start = startIndex.value
    const end = endIndex.value - 1
    query = query.range(start, end)

    const { data, count, error } = await query

    if (error) throw error

    // Transform data to extract translations
    products.value = (data || []).map(product => ({
      ...product,
      name: product.name_translations?.fr || product.name_translations?.en || '',
      category: product.category ? {
        name: product.category.name_translations?.fr || product.category.name_translations?.en || ''
      } : null
    }))

    totalProducts.value = count || 0

    // Adjust currentPage if needed
    const maxPages = Math.ceil(totalProducts.value / itemsPerPage)
    if (currentPage.value > maxPages && maxPages > 0) {
      currentPage.value = maxPages
      await fetchProducts()
      return
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    products.value = []
    totalProducts.value = 0
  } finally {
    loading.value = false
  }
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedProducts.value = products.value.map((p) => p.id)
  } else {
    selectedProducts.value = []
  }
}

const toggleStatus = async (product) => {
  try {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !product.is_active })
      .eq('id', product.id)

    if (error) throw error

    fetchProducts()
    showSuccess('Statut mis à jour')
  } catch (error) {
    console.error('Error toggling product status:', error)
    showError('Erreur lors de la mise à jour du statut')
  }
}

const deleteProduct = async (product) => {
  showConfirmation({
    title: 'Supprimer le produit',
    message: `Êtes-vous sûr de vouloir supprimer "${product.name}" ?`,
    confirmText: 'Supprimer',
    cancelText: 'Annuler',
    onConfirm: async () => {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', product.id)

        if (error) throw error

        fetchProducts()
        showSuccess('Produit supprimé')
      } catch (error) {
        console.error('Error deleting product:', error)
        showError('Erreur lors de la suppression')
      }
    }
  })
}

const bulkActivate = async () => {
  try {
    const { error } = await supabase
      .from('products')
      .update({ is_active: true })
      .in('id', selectedProducts.value)

    if (error) throw error

    selectedProducts.value = []
    fetchProducts()
    showSuccess('Produits activés')
  } catch (error) {
    console.error('Error activating products:', error)
    showError('Erreur lors de l\'activation')
  }
}

const bulkDeactivate = async () => {
  try {
    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .in('id', selectedProducts.value)

    if (error) throw error

    selectedProducts.value = []
    fetchProducts()
    showSuccess('Produits désactivés')
  } catch (error) {
    console.error('Error deactivating products:', error)
    showError('Erreur lors de la désactivation')
  }
}

const bulkDelete = async () => {
  showConfirmation({
    title: 'Supprimer les produits',
    message: `Êtes-vous sûr de vouloir supprimer ${selectedProducts.value.length} produits ?`,
    confirmText: 'Supprimer',
    cancelText: 'Annuler',
    onConfirm: async () => {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .in('id', selectedProducts.value)

        if (error) throw error

        selectedProducts.value = []
        fetchProducts()
        showSuccess('Produits supprimés')
      } catch (error) {
        console.error('Error deleting products:', error)
        showError('Erreur lors de la suppression')
      }
    }
  })
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchProducts()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchProducts()
  }
}

const goToPage = (page) => {
  if (page === '...') return
  currentPage.value = page
  fetchProducts()
}

// Watch filter changes with immediate: false to prevent double fetch on mount
watch([() => filters.value.search, () => filters.value.category, () => filters.value.status, sortBy], () => {
  currentPage.value = 1
  fetchProducts()
}, { deep: true })

// Initial fetch - ensures products are loaded on mount
onMounted(async () => {
  loading.value = true
  try {
    // Load config and categories in parallel
    await Promise.all([
      fetchConfig(),
      fetchCategories()
    ])
    // Then load products
    await fetchProducts()
  } catch (error) {
    console.error('Error during initialization:', error)
    loading.value = false
  }
})

useHead({
  title: 'Liste des produits',
  meta: [
    {
      name: 'description',
      content: 'Gérez vos produits, votre inventaire et vos prix'
    }
  ]
})
</script>