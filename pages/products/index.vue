<template>
  <div class="bg-gradient-to-b from-gray-50 to-white min-h-screen ">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header with Animation -->
      <Transition
        name="header-slide"
        appear
        @before-enter="beforeHeaderEnter"
        @enter="enterHeader"
      >
        <div v-if="isMounted" class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 pb-6 border-b-2 border-gray-200">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight bg-clip-text">
              {{ $t('products.title') || 'Produits' }}
            </h1>
            <p class="mt-2 text-sm text-gray-600 flex items-center gap-2">
              <Icon name="ph:package" class="w-4 h-4 text-primary" />
              <span class="font-medium">{{ products.length }}</span>
              {{ products.length > 1 ? 'produits' : 'produit' }}
            </p>
          </div>

          <!-- Sort dropdown with enhanced design -->
          <div class="flex items-center gap-3">
            <label for="sort" class="text-sm font-semibold text-gray-700 whitespace-nowrap flex items-center gap-2">
              <Icon name="ph:funnel" class="w-4 h-4 text-primary" />
              Trier par:
            </label>
            <select
              id="sort"
              v-model="sortBy"
              class="sort-select block w-48 px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white transition-all duration-300 hover:border-gray-300 cursor-pointer"
            >
              <option value="newest">Plus récents</option>
              <option value="name_asc">Nom (A-Z)</option>
              <option value="name_desc">Nom (Z-A)</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
            </select>
          </div>
        </div>
      </Transition>

      <!-- Main Content -->
      <div class="lg:grid lg:grid-cols-4 lg:gap-8">
        <!-- Filters Sidebar with Animation -->
        <Transition
          name="slide-in-left"
          appear
          @before-enter="beforeSidebarEnter"
          @enter="enterSidebar"
        >
          <aside v-if="isMounted" class="hidden lg:block lg:col-span-1">
            <div class="sticky top-6">
              <div class="filters-card border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-lg">
                <div class="p-6">
                  <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Icon name="ph:sliders-horizontal-bold" class="w-5 h-5 text-primary" />
                      Filtres
                    </h2>
                    <button
                      @click="clearFilters"
                      class="text-sm text-primary hover:text-primary/80 font-semibold transition-colors flex items-center gap-1"
                    >
                      <Icon name="ph:arrow-counter-clockwise" class="w-4 h-4" />
                      Réinitialiser
                    </button>
                  </div>

                  <!-- Categories with enhanced checkboxes -->
                  <div v-if="categoriesEnabled && categories.length > 0" class="mb-8 pb-8 border-b-2 border-gray-100">
                    <h3 class="text-sm font-bold text-gray-900 mb-4 uppercase flex items-center gap-2">
                      <Icon name="ph:tag" class="w-4 h-4 text-primary" />
                      Catégories
                    </h3>
                    <div class="space-y-3">
                      <label
                        v-for="category in categories"
                        :key="category.id"
                        class="filter-checkbox flex items-center cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          v-model="selectedCategories"
                          :value="category.id"
                          class="h-5 w-5 rounded-md border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer transition-all duration-300"
                        />
                        <span class="ml-3 text-sm text-gray-700 group-hover:text-gray-900 font-medium transition-colors">
                          {{ getCategoryName(category.name_translations) }}
                        </span>
                      </label>
                    </div>
                  </div>

                  <!-- Price Range with enhanced inputs -->
                  <div>
                    <h3 class="text-sm font-bold text-gray-900 mb-4 uppercase flex items-center gap-2">
                      <Icon name="ph:currency-circle-dollar" class="w-4 h-4 text-primary" />
                      Prix
                    </h3>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-2">Minimum</label>
                        <div class="relative">
                          <input
                            v-model.number="priceRange.min"
                            type="number"
                            placeholder="0"
                            class="price-input w-full px-4 py-3 pr-14 border-2 border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                          />
                          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">
                            DZD
                          </span>
                        </div>
                      </div>
                      <div class="flex items-center justify-center">
                        <div class="w-8 h-0.5 bg-gray-300 rounded"></div>
                      </div>
                      <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-2">Maximum</label>
                        <div class="relative">
                          <input
                            v-model.number="priceRange.max"
                            type="number"
                            placeholder="10000"
                            class="price-input w-full px-4 py-3 pr-14 border-2 border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                          />
                          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">
                            DZD
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </Transition>

        <!-- Mobile Filters Button -->
        <div class="lg:hidden mb-6">
          <button
            @click="showMobileFilters = !showMobileFilters"
            class="mobile-filters-btn w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm"
          >
            <Icon name="ph:sliders-horizontal-bold" class="w-5 h-5" />
            Filtres
          </button>
        </div>

        <!-- Products Grid -->
        <div class="lg:col-span-3">
          <!-- Loading State -->
          <Transition name="fade">
            <div v-if="loading" class="flex flex-col justify-center items-center h-96">
              <div class="relative">
                <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
                <div class="absolute inset-0 rounded-full border-4 border-primary/10 animate-pulse"></div>
              </div>
              <p class="mt-6 text-gray-600 font-medium animate-pulse">Chargement des produits...</p>
            </div>
          </Transition>

          <!-- Error State -->
          <Transition name="fade-scale">
            <div v-if="error && !loading" class="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
              <Icon name="ph:warning-circle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p class="text-red-800 font-bold text-lg">{{ error }}</p>
            </div>
          </Transition>

          <!-- Empty State -->
          <Transition name="fade-scale">
            <div v-if="displayProducts.length === 0 && !loading && !error" class="text-center py-20">
              <div class="empty-icon inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-6">
                <Icon name="ph:shopping-bag" class="w-12 h-12 text-gray-400" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-3">Aucun produit trouvé</h3>
              <p class="text-gray-600 mb-8 max-w-md mx-auto">
                Essayez d'ajuster vos filtres ou votre recherche pour trouver ce que vous cherchez.
              </p>
              <button
                @click="clearFilters"
                class="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Icon name="ph:arrow-counter-clockwise" class="w-5 h-5" />
                Réinitialiser les filtres
              </button>
            </div>
          </Transition>

          <!-- Products Grid with Stagger Animation -->
          <div v-if="!loading && !error && displayProducts.length > 0">
            <TransitionGroup
              name="product-card"
              tag="div"
              class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              @before-enter="beforeProductEnter"
              @enter="enterProduct"
            >
              <NuxtLink
                v-for="(product, index) in displayProducts"
                :key="product.id"
                :to="`/products/${product.slug}`"
                :data-index="index"
                class="product-card group bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <!-- Image -->
                <div class="relative aspect-square overflow-hidden bg-gray-50">
                  <div class="image-wrapper w-full h-full">
                    <NuxtImg
                      :src="product.image || '/images/placeholders/placeholder-product.svg'"
                      :alt="getProductName(product.name_translations)"
                      class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <!-- Hover Overlay -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <!-- Sale Badge -->
                  <Transition name="badge-slide">
                    <div
                      v-if="product.compare_at_price && product.compare_at_price > product.price"
                      class="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300"
                    >
                      -{{ Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100) }}%
                    </div>
                  </Transition>

                  <!-- Stock Badge -->
                  <div class="absolute top-3 right-3">
                    <Transition name="badge-pop">
                      <span
                        v-if="product.quantity > 0"
                        class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-green-500/90 backdrop-blur-sm text-white shadow-md"
                      >
                        <span class="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"></span>
                        En stock
                      </span>
                      <span
                        v-else
                        class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-500/90 backdrop-blur-sm text-white shadow-md"
                      >
                        Rupture
                      </span>
                    </Transition>
                  </div>

                  <!-- Quick View Button -->
                  <div class="absolute inset-x-0 bottom-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <button class="w-full bg-white text-gray-900 font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg flex items-center justify-center gap-2">
                      <Icon name="ph:eye-bold" class="w-5 h-5" />
                      <span class="text-sm">Aperçu</span>
                    </button>
                  </div>
                </div>

                <!-- Info -->
                <div class="p-4">
                  <!-- Category Tag -->
                  <p v-if="product.category_translations" class="text-xs font-semibold text-primary mb-2 uppercase">
                    {{ getCategoryName(product.category_translations) }}
                  </p>

                  <!-- Title -->
                  <h3 class="font-bold text-gray-900 text-sm mb-3 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors duration-300">
                    {{ getProductName(product.name_translations) }}
                  </h3>
                  
                  <!-- Price -->
                  <div class="flex items-baseline gap-2">
                    <p class="price-current text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                      {{ formatPrice(product.price) }}
                    </p>
                    <p v-if="product.compare_at_price && product.compare_at_price > product.price" class="text-sm text-gray-500 line-through">
                      {{ formatPrice(product.compare_at_price) }}
                    </p>
                  </div>

                  <!-- Bottom accent line -->
                  <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              </NuxtLink>
            </TransitionGroup>

            <!-- Pagination -->
            <Transition name="fade">
              <div v-if="totalPages > 1" class="mt-16 flex justify-center">
                <nav class="pagination-nav inline-flex items-center gap-2 bg-white rounded-xl shadow-lg p-2 border-2 border-gray-200">
                  <button
                    @click="page--"
                    :disabled="page === 1"
                    class="pagination-btn px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-1"
                    :class="page === 1 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-100'"
                  >
                    <Icon name="ph:caret-left-bold" class="w-5 h-5" />
                  </button>
                  
                  <div class="flex items-center gap-1">
                    <button
                      v-for="pageNum in visiblePages"
                      :key="pageNum"
                      @click="page = pageNum"
                      class="pagination-btn w-11 h-11 flex items-center justify-center rounded-lg text-sm font-bold transition-all duration-300"
                      :class="page === pageNum
                        ? 'bg-primary text-white shadow-lg scale-110'
                        : 'text-gray-700 hover:bg-gray-100'"
                    >
                      {{ pageNum }}
                    </button>
                  </div>
                  
                  <button
                    @click="page++"
                    :disabled="page === totalPages"
                    class="pagination-btn px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-1"
                    :class="page === totalPages 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-100'"
                  >
                    <Icon name="ph:caret-right-bold" class="w-5 h-5" />
                  </button>
                </nav>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const { locale } = useI18n();

const currentLocale = computed(() => locale.value);

const getCategoryName = (translations) => {
  if (!translations || typeof translations !== 'object') return '';
  return translations[currentLocale.value] || translations.fr || translations.en || '';
};

const getProductName = (translations) => {
  if (!translations || typeof translations !== 'object') return 'Sans nom';
  return translations[currentLocale.value] || translations.fr || translations.en || 'Sans nom';
};

// State
const loading = ref(true);
const error = ref(null);
const products = ref([]);
const categories = ref([]);
const categoriesEnabled = ref(true);
const showMobileFilters = ref(false);
const isMounted = ref(false);

// Filters
const selectedCategories = ref([]);
const priceRange = ref({ min: null, max: null });
const sortBy = ref('newest');
const page = ref(1);
const perPage = 12;

// Animation hooks
const beforeHeaderEnter = (el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(-20px)';
};

const enterHeader = (el, done) => {
  el.offsetHeight;
  el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  el.style.opacity = '1';
  el.style.transform = 'translateY(0)';
  done();
};

const beforeSidebarEnter = (el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateX(-30px)';
};

const enterSidebar = (el, done) => {
  el.offsetHeight;
  el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s';
  el.style.opacity = '1';
  el.style.transform = 'translateX(0)';
  done();
};

const beforeProductEnter = (el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px) scale(0.95)';
};

const enterProduct = (el, done) => {
  const delay = el.dataset.index * 80;
  el.offsetHeight;
  el.style.transition = `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`;
  el.style.opacity = '1';
  el.style.transform = 'translateY(0) scale(1)';
  done();
};

// Fetch functions
const fetchFeaturesConfig = async () => {
  try {
    const { data } = await supabase
      .from('features_config')
      .select('categories_enabled')
      .single();

    if (data) {
      categoriesEnabled.value = data.categories_enabled;
    }
  } catch (err) {
    console.error('Error fetching features config:', err);
  }
};

const fetchCategories = async () => {
  try {
    const { data, error: err } = await supabase
      .from('categories')
      .select('id, name_translations, slug')
      .eq('is_active', true)
      .order('display_order');

    if (err) throw err;
    categories.value = data || [];
  } catch (err) {
    console.error('Error fetching categories:', err);
  }
};

const fetchProducts = async () => {
  loading.value = true;
  error.value = null;

  try {
    let query = supabase
      .from('products')
      .select(`
        id,
        name_translations,
        description_translations,
        slug,
        price,
        compare_at_price,
        quantity,
        is_active,
        category_id,
        category:categories(name_translations),
        images:product_images(url, position)
      `)
      .eq('is_active', true);

    if (selectedCategories.value.length > 0) {
      query = query.in('category_id', selectedCategories.value);
    }

    if (priceRange.value.min) {
      query = query.gte('price', priceRange.value.min);
    }

    if (priceRange.value.max) {
      query = query.lte('price', priceRange.value.max);
    }

    switch (sortBy.value) {
      case 'name_asc':
        query = query.order('name_translations->fr', { ascending: true });
        break;
      case 'name_desc':
        query = query.order('name_translations->fr', { ascending: false });
        break;
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data, error: err } = await query;

    if (err) throw err;

    products.value = (data || []).map(product => ({
      id: product.id,
      slug: product.slug,
      name_translations: product.name_translations,
      description_translations: product.description_translations,
      price: product.price,
      compare_at_price: product.compare_at_price,
      quantity: product.quantity,
      category_translations: product.category?.name_translations,
      image: product.images?.sort((a, b) => a.position - b.position)[0]?.url || null
    }));
  } catch (err) {
    console.error('Error fetching products:', err);
    error.value = 'Impossible de charger les produits';
    products.value = [];
  } finally {
    loading.value = false;
  }
};

const displayProducts = computed(() => {
  const start = (page.value - 1) * perPage;
  const end = start + perPage;
  return products.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(products.value.length / perPage);
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = page.value;
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i);
    } else if (current >= total - 2) {
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      for (let i = current - 2; i <= current + 2; i++) pages.push(i);
    }
  }
  
  return pages;
});

const formatPrice = (price) => {
  return `${parseFloat(price).toFixed(2)} DZD`;
};

const clearFilters = () => {
  selectedCategories.value = [];
  priceRange.value = { min: null, max: null };
  sortBy.value = 'newest';
  page.value = 1;
};

watch([selectedCategories, priceRange, sortBy], () => {
  page.value = 1;
  fetchProducts();
});

onMounted(async () => {
  await fetchFeaturesConfig();
  if (categoriesEnabled.value) {
    await fetchCategories();
  }
  await fetchProducts();
  
  setTimeout(() => {
    isMounted.value = true;
  }, 100);
});

useHead({
  title: 'Boutique - Produits',
  meta: [
    { name: 'description', content: 'Découvrez notre collection de produits' }
  ]
});
</script>

<style scoped>
/* Product Cards */
.product-card {
  position: relative;
}

.product-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  padding: 2px;
  background: linear-gradient(135deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none;
}

.product-card:hover::before {
  opacity: 1;
}

/* Price animation */
.price-current {
  position: relative;
}

.product-card:hover .price-current {
  animation: price-pop 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes price-pop {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Filters Card */
.filters-card {
  transition: all 0.3s ease;
}

.filters-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Empty icon animation */
.empty-icon {
  animation: float-gentle 3s ease-in-out infinite;
}

@keyframes float-gentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Badge animations */
.badge-slide-enter-active,
.badge-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.badge-slide-enter-from {
  opacity: 0;
  transform: translateX(-20px) scale(0.8);
}

.badge-pop-enter-active,
.badge-pop-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.badge-pop-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.5s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Pagination */
.pagination-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

/* Input focus glow */
.price-input:focus,
.sort-select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Checkbox */
.filter-checkbox input:checked {
  background-color: var(--primary-color, #3b82f6);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>