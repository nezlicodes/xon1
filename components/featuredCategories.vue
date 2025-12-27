<template>
  <section
    :dir="locale === 'ar' ? 'rtl' : 'ltr'"
    v-if="sectionData.is_active"
    class="py-16 bg-gradient-to-b from-gray-50 to-white"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header with Animation -->
      <Transition
        name="section-header"
        appear
        @before-enter="beforeHeaderEnter"
        @enter="enterHeader"
      >
        <div v-if="isMounted" class="text-center mb-12">
          <h2
            class="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
          >
            {{ sectionTitle }}
          </h2>
          <p
            class="text-lg text-gray-600 max-w-2xl mx-auto"
            v-html="sectionSubtitle"
          ></p>
        </div>
      </Transition>

      <!-- Loading State with Enhanced Shimmer -->
      <div v-if="loading" class="space-y-12">
        <div v-for="i in 2" :key="i" class="shimmer-wrapper">
          <div
            class="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-48 mb-6 shimmer-effect"
          ></div>
          <div
            class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            <div v-for="j in 4" :key="j" class="product-card-skeleton">
              <div
                class="aspect-square bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-t-xl shimmer-effect"
              ></div>
              <div class="p-4 space-y-3">
                <div
                  class="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded shimmer-effect"
                ></div>
                <div
                  class="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 shimmer-effect"
                ></div>
                <div
                  class="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2 shimmer-effect"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories with Products -->
      <div v-else-if="categoriesWithProducts.length > 0" class="space-y-16">
        <div
          v-for="(categoryData, categoryIndex) in categoriesWithProducts"
          :key="categoryData.category.id"
          :ref="(el) => setCategoryRef(el, categoryIndex)"
          class="category-section"
          :class="{ 'category-visible': visibleCategories.has(categoryIndex) }"
        >
          <!-- Category Header with Slide In -->
          <div
            class="category-header flex items-center justify-between mb-8 pb-4 border-b-2 border-gray-200"
          >
            <div class="category-header-content">
              <h3
                class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-1"
              >
                {{ getCategoryName(categoryData.category.name_translations) }}
              </h3>
              <p
                v-if="
                  getCategoryDescription(
                    categoryData.category.description_translations
                  )
                "
                class="text-gray-600 mt-1 text-sm md:text-base"
              >
                {{
                  getCategoryDescription(
                    categoryData.category.description_translations
                  )
                }}
              </p>
            </div>
            <NuxtLink
              :to="`/categories/${categoryData.category.slug}`"
              class="view-all-link group text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-2 whitespace-nowrap transition-all duration-300"
            >
              {{ $t('home.viewAll') }}
              <Icon
                name="ph:arrow-right-bold"
                class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
              />
            </NuxtLink>
          </div>

          <!-- Products Grid with Stagger Animation -->
          <TransitionGroup
            v-if="categoryData.products.length > 0"
            name="product-card"
            tag="div"
            class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            @before-enter="beforeProductEnter"
            @enter="enterProduct"
          >
            <NuxtLink
              v-for="(product, productIndex) in categoryData.products"
              :key="product.id"
              :to="`/products/${product.slug}`"
              :data-index="productIndex"
              class="product-card group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all duration-500 shadow-sm hover:shadow-2xl transform hover:-translate-y-2"
            >
              <!-- Product Image Container -->
              <div class="relative aspect-square overflow-hidden bg-gray-100">
                <!-- Image with Zoom Effect -->
                <div class="image-wrapper w-full h-full overflow-hidden">
                  <NuxtImg
                    :src="
                      product.image ||
                      '/images/placeholders/placeholder-product.svg'
                    "
                    :alt="getProductName(product.name_translations)"
                    class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <!-- Hover Overlay with Gradient -->
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                ></div>

                <!-- Quick Actions (visible on hover) -->
                <div
                  class="absolute inset-x-0 bottom-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                >
                  <button
                    class="w-full bg-white text-gray-900 font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                  >
                    <Icon name="ph:eye-bold" class="w-5 h-5" />
                    <span class="text-sm">Voir le produit</span>
                  </button>
                </div>

                <!-- Badges Container -->
                <div class="absolute top-3 right-3 flex flex-col gap-2">
                  <!-- Discount Badge with Slide In -->
                  <Transition name="badge-slide">
                    <span
                      v-if="
                        product.compare_at_price &&
                        product.compare_at_price > product.price
                      "
                      class="discount-badge inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300"
                    >
                      -{{
                        calculateDiscount(
                          product.price,
                          product.compare_at_price
                        )
                      }}%
                    </span>
                  </Transition>
                </div>

                <!-- Stock Badge - FIXED -->
                <div class="absolute top-3 left-3">
                  <Transition name="badge-slide-left">
                    <template
                      v-if="product.quantity > 0 || product.has_variants"
                    >
                      <span
                        class="stock-badge inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-green-500/90 backdrop-blur-sm text-white shadow-md"
                      >
                        <span
                          class="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"
                        ></span>
                        En stock
                      </span>
                    </template>
                    <template v-else>
                      <span
                        class="stock-badge inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-500/90 backdrop-blur-sm text-white shadow-md"
                      >
                        Épuisé
                      </span>
                    </template>
                  </Transition>
                </div>

                <!-- Wishlist Button -->
                <button
                  class="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg"
                >
                  <Icon
                    name="ph:heart"
                    class="w-5 h-5 text-gray-700 hover:text-red-500 transition-colors duration-300"
                  />
                </button>
              </div>

              <!-- Product Info -->
              <div class="p-4 relative">
                <!-- Product Name -->
                <h4
                  class="font-semibold text-gray-900 text-sm mb-2.5 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors duration-300"
                >
                  {{ getProductName(product.name_translations) }}
                </h4>

                <!-- Price Section with Highlight Effect -->
                <div class="flex items-baseline gap-2 mb-1">
                  <p
                    class="price-current text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-300"
                  >
                    {{ formatPrice(product.price) }}
                  </p>
                  <p
                    v-if="
                      product.compare_at_price &&
                      product.compare_at_price > product.price
                    "
                    class="price-compare text-sm text-gray-500 line-through"
                  >
                    {{ formatPrice(product.compare_at_price) }}
                  </p>
                </div>

                <!-- Savings Display -->
                <p
                  v-if="
                    product.compare_at_price &&
                    product.compare_at_price > product.price
                  "
                  class="text-xs text-green-600 font-medium"
                >
                  Économisez
                  {{ formatPrice(product.compare_at_price - product.price) }}
                </p>

                <!-- Bottom Accent Line -->
                <div
                  class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"
                ></div>
              </div>
            </NuxtLink>
          </TransitionGroup>

          <!-- Empty State for Category -->
          <Transition name="fade">
            <div
              v-if="categoryData.products.length === 0"
              class="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200"
            >
              <div
                class="empty-state-icon w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <Icon name="ph:package" class="w-8 h-8 text-gray-400" />
              </div>
              <p class="text-gray-500 text-lg">
                Aucun produit dans cette catégorie
              </p>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div
          class="empty-state-icon w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center"
        >
          <Icon name="ph:shopping-bag" class="w-10 h-10 text-gray-400" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          Aucune catégorie en vedette
        </h3>
        <p class="text-gray-500">
          Les catégories apparaîtront ici une fois configurées
        </p>
      </div>
    </div>
  </section>
</template>

<!-- Script and styles remain the same -->
<script setup>
const supabase = useSupabaseClient();
const { locale } = useI18n();

const currentLocale = computed(() => locale.value);

const sectionData = ref({
  is_active: true,
  content_translations: {
    en: {
      title: $t("home.categories.title"),
      subtitle: $t("home.categories.subtitle"),
    },
    fr: {
      title: $t("home.categories.title"),
      subtitle: $t("home.categories.subtitle"),
    },
    ar: {
      title: $t("home.categories.title"),
      subtitle: $t("home.categories.subtitle"),
    },
  },
});

const sectionTitle = computed(() => {
  return (
    sectionData.value.content_translations?.[currentLocale.value]?.title ||
    sectionData.value.content_translations?.fr?.title ||
    "Catégories en vedette"
  );
});

const sectionSubtitle = computed(() => {
  return (
    sectionData.value.content_translations?.[currentLocale.value]?.subtitle ||
    sectionData.value.content_translations?.fr?.subtitle ||
    "Découvrez nos collections populaires"
  );
});

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

const getCategoryName = (translations) => {
  return getTranslation(translations);
};

const getCategoryDescription = (translations) => {
  const desc = getTranslation(translations);
  return desc.replace(/<[^>]*>/g, "").substring(0, 100);
};

const getProductName = (translations) => {
  return getTranslation(translations);
};

const categoriesWithProducts = ref([]);
const loading = ref(true);
const isMounted = ref(false);
const visibleCategories = ref(new Set());
const categoryRefs = ref([]);

const setCategoryRef = (el, index) => {
  if (el) {
    categoryRefs.value[index] = el;
  }
};

const beforeHeaderEnter = (el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(-20px)";
};

const enterHeader = (el, done) => {
  el.offsetHeight;
  el.style.transition =
    "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
  el.style.opacity = "1";
  el.style.transform = "translateY(0)";
  done();
};

const beforeProductEnter = (el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(30px) scale(0.95)";
};

const enterProduct = (el, done) => {
  const delay = el.dataset.index * 100;
  el.offsetHeight;
  el.style.transition = `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`;
  el.style.opacity = "1";
  el.style.transform = "translateY(0) scale(1)";
  done();
};

const setupIntersectionObserver = () => {
  if (typeof window === "undefined") return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = categoryRefs.value.indexOf(entry.target);
          if (index !== -1) {
            setTimeout(() => {
              visibleCategories.value.add(index);
            }, index * 150);
          }
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "50px",
    }
  );

  categoryRefs.value.forEach((ref) => {
    if (ref) observer.observe(ref);
  });

  return observer;
};

const loadSectionData = async () => {
  try {
    const { data, error } = await supabase
      .from("content_sections")
      .select("*")
      .eq("section_key", "featured_categories")
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error loading section:", error);
      return;
    }

    if (data) {
      sectionData.value = data;
    }
  } catch (error) {
    console.error("Error loading featured categories section:", error);
  }
};

const fetchFeaturedCategories = async () => {
  loading.value = true;

  try {
    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select(
        "id, name_translations, description_translations, slug, image_url"
      )
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("display_order");

    if (categoriesError) throw categoriesError;

    if (!categories || categories.length === 0) {
      categoriesWithProducts.value = [];
      loading.value = false;
      return;
    }

    const categoriesData = await Promise.all(
      categories.map(async (category) => {
        const { data: products, error: productsError } = await supabase
          .from("products")
          .select(
            `
            id,
            name_translations,
            description_translations,
            slug,
            price,
            compare_at_price,
            quantity,
            has_variants,
            images:product_images(url, position)
          `
          )
          .eq("category_id", category.id)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(4);

        if (productsError) {
          console.error(
            "Error fetching products for category:",
            category.id,
            productsError
          );
          return {
            category,
            products: [],
          };
        }

        const processedProducts = (products || []).map((product) => ({
          ...product,
          image:
            product.images?.sort((a, b) => a.position - b.position)[0]?.url ||
            null,
        }));

        return {
          category,
          products: processedProducts,
        };
      })
    );

    categoriesWithProducts.value = categoriesData.filter(
      (categoryData) => categoryData.products.length > 0
    );
  } catch (error) {
    console.error("Error fetching featured categories:", error);
    categoriesWithProducts.value = [];
  } finally {
    loading.value = false;
  }
};

const formatPrice = (price) => {
  return `${parseFloat(price).toFixed(2)} DZD`;
};

const calculateDiscount = (price, comparePrice) => {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
};

onMounted(async () => {
  await loadSectionData();
  await fetchFeaturedCategories();

  setTimeout(() => {
    isMounted.value = true;
  }, 100);

  await nextTick();
  setupIntersectionObserver();
});
</script>

<style scoped>
/* (All styles remain the same as before) */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.shimmer-effect {
  animation: shimmer 2s infinite linear;
  background-size: 1000px 100%;
}

.product-card-skeleton {
  @apply bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm;
}

.category-section {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-section.category-visible {
  opacity: 1;
  transform: translateY(0);
}

.category-header {
  opacity: 0;
  transform: translateX(-30px);
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s,
    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
}

.category-visible .category-header {
  opacity: 1;
  transform: translateX(0);
}

.product-card {
  position: relative;
  will-change: transform, box-shadow;
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
}

.product-card:hover::before {
  opacity: 1;
}

.badge-slide-enter-active,
.badge-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.badge-slide-enter-from {
  opacity: 0;
  transform: translateX(20px) scale(0.8);
}

.badge-slide-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.8);
}

.badge-slide-left-enter-active,
.badge-slide-left-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.badge-slide-left-enter-from {
  opacity: 0;
  transform: translateX(-20px) scale(0.8);
}

.badge-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-20px) scale(0.8);
}

.price-current {
  position: relative;
  display: inline-block;
}

.product-card:hover .price-current {
  animation: price-pop 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes price-pop {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.view-all-link {
  position: relative;
}

.view-all-link::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: currentColor;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.view-all-link:hover::after {
  width: 100%;
}

.empty-state-icon {
  animation: float-gentle 3s ease-in-out infinite;
}

@keyframes float-gentle {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.discount-badge {
  animation: badge-pulse 2s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%,
  100% {
    box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.3);
  }
  50% {
    box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.4);
  }
}

.stock-badge {
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
}

@media (max-width: 640px) {
  .product-card {
    @apply hover:shadow-lg;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .category-section,
  .category-header {
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>