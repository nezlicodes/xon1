<template>
  <section data-aos="fade-up">
    <div class="max-w-7xl mx-auto px-6 my-4">
      <div class="flex justify-end items-end mb-12"></div>

      <!-- Title and Subtitle section -->
      <div class="mb-12 text-center">
        <h2 class="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {{ sectionTitle }}
        </h2>
        <p v-html="sectionSubtitle" class="mt-2 text-lg font-light opacity-80"></p>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        <div
          v-for="n in 5"
          :key="`skeleton-${n}`"
          class="space-y-4 animate-pulse"
        >
          <div class="aspect-square rounded-2xl bg-background/30 shadow-lg"></div>
          <div class="space-y-3 px-1">
            <div class="h-4 bg-background/30 rounded-lg w-3/4"></div>
            <div class="h-4 bg-background/30 rounded-lg w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="mt-10 rounded-2xl bg-red-50 p-8 shadow-lg border border-red-100">
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <Icon name="ph:warning" class="w-6 h-6 text-red-500" />
          </div>
          <p class="text-red-600 font-medium">
            Erreur lors de la récupération des produits
          </p>
        </div>
      </div>

      <!-- Products Display Section -->
      <div v-else>
        <!-- Empty state when no products are available -->
        <div v-if="products.length === 0" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-background/20 mb-6 shadow-lg">
            <Icon name="ph:shopping-bag" class="w-10 h-10" />
          </div>
          <h3 class="text-2xl font-bold mb-3">Aucun produit disponible</h3>
          <p class="mt-2 text-lg opacity-70">Les produits seront bientôt disponibles.</p>
        </div>

        <!-- Products Grid -->
        <div
          v-else
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </div>

      <!-- Success Notification -->
      <Transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showNotification"
          class="fixed bottom-0 inset-x-0 pb-4 sm:pb-6 z-50"
        >
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="rounded-2xl bg-green-600 p-4 shadow-2xl sm:p-5 border border-green-500/20">
              <div class="flex flex-wrap items-center justify-between">
                <div class="flex w-0 flex-1 items-center">
                  <span class="flex rounded-xl bg-green-800 p-2.5 shadow-lg">
                    <svg
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <p class="ml-4 truncate font-semibold text-lg">
                    <span>Produit ajouté au panier !</span>
                  </p>
                </div>
                <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                  <button
                    type="button"
                    class="-mr-1 flex rounded-xl p-2.5 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200"
                    @click="showNotification = false"
                  >
                    <span class="sr-only">Fermer</span>
                    <svg
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup>
import placeholderProducts from "~/utils/placeholders/featured-products";

// Define props to receive settings from parent component
const props = defineProps({
  settings: {
    type: Object,
    default: () => ({}),
  },
  user: {
    type: Object,
    default: null,
  },
});

// State
const loading = ref(true);
const error = ref(null);
const products = ref([]);
const showNotification = ref(false);
const supabase = useSupabaseClient();

// Default settings for when no user is logged in or no settings passed
const defaultSectionData = {
  featured_products_title: "Nos produits populaires",
  featured_products_subtitle:
    "Découvrez notre sélection de produits les plus appréciés",
};

// Computed properties for cleaner template
const sectionTitle = computed(
  () =>
    props.settings?.featured_products_title ||
    defaultSectionData.featured_products_title
);

const sectionSubtitle = computed(
  () =>
    props.settings?.featured_products_subtitle ||
    defaultSectionData.featured_products_subtitle
);

// Fetch products with optimized query
const fetchProducts = async () => {
  try {
    loading.value = true;
    error.value = null;

    if (!props.user) {
      // Show placeholder products for non-logged in users
      products.value = placeholderProducts;
      return;
    }

    // Optimized query - only get fields we need
    const { data, error: fetchError } = await supabase
      .from("products")
      .select(
        `
        id, 
        name, 
        slug, 
        price, 
        compare_at_price, 
        quantity, 
        has_variants,
        category:categories(name), 
        images:product_images(url)
      `
      )
      .eq("is_active", true)
      .eq("is_featured", true)
      .eq("user_id", props.user)
      .order("created_at", { ascending: false })
      .limit(12);

    if (fetchError) throw fetchError;

    products.value = data || [];
  } catch (err) {
    console.error("Error fetching featured products:", err);
    error.value = err.message;
    products.value = placeholderProducts;
  } finally {
    loading.value = false;
  }
};

// Optimized cart handling with debouncing
let notificationTimeout = null;
const handleAddToCart = (product) => {
  // Get existing cart
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  // Check if product already exists
  const existingItemIndex = cart.findIndex((item) => item.id === product.id);

  if (existingItemIndex >= 0) {
    // Update existing item
    cart[existingItemIndex].quantity += 1;
  } else {
    // Add new item with only necessary properties
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url,
      quantity: 1,
      slug: product.slug,
    });
  }

  // Save cart and notify
  localStorage.setItem("cart", JSON.stringify(cart));

  // Show notification with debouncing
  showNotification.value = true;

  // Clear any existing timeout to avoid stacking
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }

  // Set new timeout
  notificationTimeout = setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

// Lifecycle
onMounted(async () => {
  await fetchProducts();
});

// Clean up on component unmount
onBeforeUnmount(() => {
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }
});
</script>