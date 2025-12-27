<template>
  <div
    class="bg-white min-h-screen"
    :dir="currentLocale === 'ar' ? 'rtl' : 'ltr'"
  >
    <Head>
      <Title>{{
        getCategoryName() || $t("categoriesPage.titleFallback")
      }}</Title>
      <Meta
        name="description"
        :content="
          getCategoryDescription() || $t('categoriesPage.descriptionFallback')
        "
      />
    </Head>

    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
      ></div>
    </div>

    <!-- Error State -->
    <div
      v-if="error && !loading"
      class="min-h-screen flex items-center justify-center"
    >
      <div class="text-center">
        <h3 class="text-xl font-bold text-gray-900 mb-2">
          {{ $t("categoriesPage.notFoundTitle") }}
        </h3>
        <p class="text-gray-600 mb-6">
          {{ $t("categoriesPage.notFoundDesc") }}
        </p>
        <NuxtLink
          :to="localePath('/products')"
          class="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
        >
          {{ $t("categoriesPage.viewAllProducts") }}
        </NuxtLink>
      </div>
    </div>

    <div v-if="!loading && !error">
      <!-- Hero Section -->
      <div
        class="relative min-h-[80vh] lg:min-h-[85vh] flex items-center bg-gray-900 overflow-hidden"
      >
        <!-- Background - Image or Video with Parallax -->
        <div class="absolute inset-0 parallax-bg" ref="parallaxElement">
          <!-- Video Background -->
          <video
            v-if="category.video_url"
            :src="category.video_url"
            autoplay
            loop
            muted
            playsinline
            class="w-full h-[110%] object-cover transform transition-transform duration-100 ease-out"
            ref="videoElement"
          ></video>

          <!-- Image Background (fallback or when no video) -->
          <img
            v-else
            :src="
              category.image_url ||
              '/images/placeholders/placeholder-category.jpg'
            "
            alt=""
            class="w-full h-[110%] object-cover transform transition-transform duration-100 ease-out"
            ref="imageElement"
          />

          <div
            class="absolute inset-0 bg-gradient-to-br from-black/70 via-black/30 to-black/60"
          ></div>
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"
          ></div>
        </div>

        <!-- Content -->
        <div class="relative w-full">
          <div
            class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
            ref="contentElement"
          >
            <!-- Breadcrumb -->
            <nav
              class="flex items-center gap-2 text-sm mb-6 text-white/80 overflow-x-auto pb-2"
            >
              <NuxtLink
                :to="localePath('/')"
                class="hover:text-white whitespace-nowrap"
                >{{ $t("categoriesPage.breadcrumb.home") }}</NuxtLink
              >
              <span>/</span>
              <NuxtLink
                :to="localePath('/products')"
                class="hover:text-white whitespace-nowrap"
                >{{ $t("categoriesPage.breadcrumb.products") }}</NuxtLink
              >
              <span>/</span>
              <span class="text-white font-medium truncate">{{
                getCategoryName()
              }}</span>
            </nav>

            <!-- Title -->
            <h1
              class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
            >
              {{ getCategoryName() }}
            </h1>

            <!-- Description -->
            <p
              v-if="getCategoryDescription()"
              v-html="getCategoryDescription()"
              class="max-w-2xl text-base sm:text-lg text-white/95 mb-6"
            ></p>

            <!-- Product count -->
            <div
              class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20"
            >
              <span class="font-semibold"
                >{{ filteredProducts.length }}
                {{ $t("categoriesPage.products") }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Main Content -->
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Filters Sidebar -->
          <div class="lg:w-80 flex-shrink-0">
            <div
              class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-4"
            >
              <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="font-bold text-gray-900 text-xl">
                    {{ $t("categoriesPage.filters") }}
                  </h2>
                  <button
                    @click="clearFilters"
                    class="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Réinitialiser
                  </button>
                </div>

                <!-- Categories List -->
                <div class="mb-6">
                  <h3 class="text-sm font-bold text-gray-900 mb-4 uppercase">
                    {{
                      $t("categoriesPage.breadcrumb.categories") || "Catégories"
                    }}
                  </h3>
                  <div class="flex flex-col gap-2 max-h-64 overflow-auto pr-1">
                    <NuxtLink
                      v-for="cat in allCategories"
                      :key="cat.id"
                      :to="localePath(`/categories/${cat.slug}`)"
                      class="px-3 py-2 rounded-lg text-sm font-medium border transition-colors"
                      :class="
                        route.params.slug === cat.slug
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      "
                    >
                      {{ getTranslation(cat.name_translations) }}
                    </NuxtLink>
                  </div>
                </div>

                <!-- Price Range -->
                <div class="mb-6">
                  <h3 class="text-sm font-bold text-gray-900 mb-4 uppercase">
                    {{ $t("categoriesPage.price") }}
                  </h3>
                  <div class="flex items-center gap-3">
                    <div class="relative flex-1">
                      <input
                        v-model.number="priceRange.min"
                        type="number"
                        :placeholder="$t('categoriesPage.min')"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                      <span
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
                        >DZD</span
                      >
                    </div>
                    <div class="w-3 h-0.5 bg-gray-300 rounded"></div>
                    <div class="relative flex-1">
                      <input
                        v-model.number="priceRange.max"
                        type="number"
                        :placeholder="$t('categoriesPage.max')"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                      <span
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
                        >DZD</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Clear Button -->
                <button
                  @click="clearFilters"
                  class="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-bold transition-colors"
                >
                  {{ $t("categoriesPage.clearFilters") }}
                </button>
              </div>
            </div>
          </div>

          <!-- Products Section -->
          <div class="flex-1">
            <!-- Header -->
            <div
              class="flex items-center justify-between mb-8 pb-4 border-b-2 border-gray-200"
            >
              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-1">
                  {{ $t("categoriesPage.allProducts") }}
                </h2>
                <p class="text-gray-600">
                  {{ filteredProducts.length }}
                  {{
                    filteredProducts.length > 1
                      ? $t("categoriesPage.resultsPlural")
                      : $t("categoriesPage.resultSingular")
                  }}
                </p>
              </div>
            </div>

            <!-- Products Grid - Same as Featured Products -->
            <div
              v-if="paginatedProducts.length > 0"
              class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              <NuxtLink
                v-for="product in paginatedProducts"
                :key="product.id"
                :to="localePath(`/products/${product.slug}`)"
                class="product-card group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <!-- Product Image -->
                <div class="relative aspect-square overflow-hidden bg-gray-100">
                  <div class="w-full h-full overflow-hidden">
                    <img
                      :src="
                        product.images?.[0]?.url ||
                        '/images/placeholders/placeholder-product.svg'
                      "
                      :alt="getProductName(product.name_translations)"
                      class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <!-- Hover Overlay -->
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  ></div>

                  <!-- Quick View Button -->
                  <div
                    class="absolute inset-x-0 bottom-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                  >
                    <button
                      class="w-full bg-white text-gray-900 font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                    >
                      <span class="text-sm">{{
                        $t("categoriesPage.viewProduct")
                      }}</span>
                    </button>
                  </div>

                  <!-- Discount Badge -->
                  <div class="absolute top-3 right-3">
                    <span
                      v-if="
                        product.compare_at_price &&
                        product.compare_at_price > product.price
                      "
                      class="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                    >
                      -{{
                        Math.round(
                          ((product.compare_at_price - product.price) /
                            product.compare_at_price) *
                            100
                        )
                      }}%
                    </span>
                  </div>

                  <!-- Stock Badge -->
                  <div class="absolute top-3 left-3">
                    <span
                      v-if="product.quantity > 0 || product.has_variants"
                      class="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-green-500/90 backdrop-blur-sm text-white shadow-md"
                    >
                      <span
                        class="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"
                      ></span>
                      {{ $t("categoriesPage.inStock") }}
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-500/90 backdrop-blur-sm text-white shadow-md"
                    >
                      {{ $t("categoriesPage.outOfStock") }}
                    </span>
                  </div>
                </div>

                <!-- Product Info -->
                <div class="p-4 relative">
                  <!-- Name -->
                  <h4
                    class="font-semibold text-gray-900 text-sm mb-2.5 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors duration-300"
                  >
                    {{ getProductName(product.name_translations) }}
                  </h4>

                  <!-- Price -->
                  <div class="flex items-baseline gap-2 mb-1">
                    <p
                      class="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-300"
                    >
                      {{ product.price.toFixed(2) }} DZD
                    </p>
                    <p
                      v-if="
                        product.compare_at_price &&
                        product.compare_at_price > product.price
                      "
                      class="text-sm text-gray-500 line-through"
                    >
                      {{ product.compare_at_price.toFixed(2) }} DZD
                    </p>
                  </div>

                  <!-- Savings -->
                  <p
                    v-if="
                      product.compare_at_price &&
                      product.compare_at_price > product.price
                    "
                    class="text-xs text-green-600 font-medium"
                  >
                    Économisez
                    {{ (product.compare_at_price - product.price).toFixed(2) }}
                    DZD
                  </p>

                  <!-- Bottom accent -->
                  <div
                    class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  ></div>
                </div>
              </NuxtLink>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-20">
              <div
                class="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <span class="text-4xl">📦</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                {{ $t("categoriesPage.emptyTitle") }}
              </h3>
              <p class="text-gray-600 mb-6">
                {{ $t("categoriesPage.emptyDesc") }}
              </p>
              <button
                @click="clearFilters"
                class="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
              >
                Réinitialiser les filtres
              </button>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="mt-12 flex justify-center">
              <nav
                class="inline-flex items-center gap-2 bg-white rounded-xl shadow-lg p-2 border border-gray-200"
              >
                <button
                  :disabled="currentPage === 1"
                  @click="currentPage--"
                  class="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ←
                </button>

                <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300',
                    currentPage === page
                      ? 'bg-primary text-white shadow-lg scale-110'
                      : 'text-gray-700 hover:bg-gray-100',
                  ]"
                >
                  {{ page }}
                </button>

                <button
                  :disabled="currentPage === totalPages"
                  @click="currentPage++"
                  class="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useSupabaseClient } from "#imports";
import { useRoute } from "vue-router";

const supabase = useSupabaseClient();
const route = useRoute();
const { locale } = useI18n();
const localePath = useLocalePath();

const currentLocale = computed(() => locale.value);

const getTranslation = (translations) => {
  if (!translations || typeof translations !== "object") return "";
  return (
    translations[currentLocale.value] ||
    translations.fr ||
    translations.en ||
    translations.ar ||
    ""
  );
};

const getCategoryName = () => {
  return getTranslation(category.value?.name_translations);
};

const getCategoryDescription = () => {
  return getTranslation(category.value?.description_translations);
};

const getProductName = (translations) => {
  return getTranslation(translations);
};

const loading = ref(true);
const error = ref(null);
const category = ref(null);
const products = ref([]);
const allCategories = ref([]);

// Template refs for parallax
const parallaxElement = ref(null);
const contentElement = ref(null);
const imageElement = ref(null);
const videoElement = ref(null);
const currentPage = ref(1);
const itemsPerPage = 12;
const sortBy = ref("created_at:desc");
const priceRange = ref({ min: null, max: null });

const filteredProducts = computed(() => {
  let filtered = [...products.value];

  if (priceRange.value.min !== null && priceRange.value.min !== "") {
    filtered = filtered.filter(
      (product) => product.price >= priceRange.value.min
    );
  }

  if (priceRange.value.max !== null && priceRange.value.max !== "") {
    filtered = filtered.filter(
      (product) => product.price <= priceRange.value.max
    );
  }

  return filtered;
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage);
});

const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Fetch current category
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", route.params.slug)
      .eq("is_active", true)
      .single();

    if (categoryError) throw categoryError;
    if (!categoryData) {
      error.value = "Catégorie introuvable";
      return;
    }

    category.value = categoryData;

    // Fetch all categories for filter list
    const { data: cats, error: catsError } = await supabase
      .from("categories")
      .select("id, slug, name_translations")
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (catsError) throw catsError;
    allCategories.value = cats || [];

    const [field, direction] = sortBy.value.split(":");
    let orderField = field;
    if (field === "name") {
      orderField = `name_translations->>fr`;
    }

    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("*, images:product_images(url, position)")
      .eq("category_id", categoryData.id)
      .eq("is_active", true)
      .order(orderField, { ascending: direction === "asc" });

    if (productsError) throw productsError;

    products.value = (productsData || []).map((product) => ({
      ...product,
      images: product.images?.sort((a, b) => a.position - b.position),
    }));
  } catch (err) {
    console.error("Error:", err);
    error.value = "Impossible de charger la catégorie";
  } finally {
    loading.value = false;
  }
};

const clearFilters = () => {
  priceRange.value = { min: null, max: null };
  currentPage.value = 1;
};

watch(
  [() => route.params.slug, sortBy],
  () => {
    currentPage.value = 1;
    fetchData();
  },
  { immediate: true }
);

watch(
  [priceRange],
  () => {
    currentPage.value = 1;
  },
  { deep: true }
);

// Parallax scroll handler
const handleScroll = () => {
  if (!process.client) return;

  const scrolled = window.pageYOffset;
  const parallaxSpeed = 0.4;
  const contentSpeed = 0.2;

  // Apply parallax to background
  if (imageElement.value) {
    imageElement.value.style.transform = `translateY(${
      scrolled * parallaxSpeed
    }px) scale(1.05)`;
  }
  if (videoElement.value) {
    videoElement.value.style.transform = `translateY(${
      scrolled * parallaxSpeed
    }px) scale(1.05)`;
  }

  // Apply subtle parallax to content
  if (contentElement.value) {
    contentElement.value.style.transform = `translateY(${
      scrolled * contentSpeed
    }px)`;
  }
};

onMounted(() => {
  if (process.client) {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call
  }
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener("scroll", handleScroll);
  }
});

definePageMeta({
  pageTransition: {
    name: "page",
  },
});
</script>

<style scoped>
.product-card {
  position: relative;
}

.product-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  padding: 2px;
  background: linear-gradient(
    135deg,
    transparent,
    rgba(59, 130, 246, 0.1),
    transparent
  );
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

/* Parallax container */
.parallax-bg {
  will-change: transform;
}

/* Performance optimizations */
.parallax-bg * {
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

/* Smooth transitions for parallax */
.transform {
  transition: transform 0.1s ease-out;
}

/* Enhanced gradients */
.bg-gradient-to-br {
  background: linear-gradient(
    to bottom right,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

.bg-gradient-to-t {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.6) 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.2) 100%
  );
}

/* Mobile optimizations - disable parallax on mobile */
@media (max-width: 768px) {
  .parallax-bg {
    transform: none !important;
  }

  .parallax-bg * {
    transform: none !important;
  }
}
</style>
