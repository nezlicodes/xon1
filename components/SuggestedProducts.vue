<template>
  <section class="py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center mb-10">
        <h3
          class="text-lg text-mgray-800 group-hover:text-mgray-600 transition-colors flex items-center font-medium tracking-wide"
        >
          Vous pourriez aussi aimer
          <span class="ml-2 ">
            <Icon
              name="ph:arrow-right"
              class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </h3>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        aria-label="Chargement des produits suggérés"
      >
        <div v-for="n in 5" :key="n" class="space-y-3 animate-pulse">
          <div class="aspect-square rounded-lg bg-mgray-100"></div>
          <div class="space-y-2">
            <div class="h-3 bg-mgray-100 rounded w-3/4"></div>
            <div class="h-3 bg-mgray-100 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="mt-8 rounded-xl bg-red-50 p-6" role="alert">
        <div class="flex items-center space-x-3">
          <Icon
            name="ph:warning"
            class="w-5 h-5 text-red-500"
            aria-hidden="true"
          />
          <p class="text-red-600 font-medium">
            Erreur lors de la récupération des produits
          </p>
        </div>
      </div>

      <!-- Products Grid -->
      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
      >
        <div
          v-for="product in featuredProducts"
          :key="product.id"
          class="group"
        >
          <!-- Product Card -->
          <NuxtLink
            :to="`/products/${product.slug}`"
            class="block h-full flex flex-col focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 rounded-lg"
          >
            <div
              class="aspect-square rounded-lg overflow-hidden bg-mgray-50 mb-3 relative flex-shrink-0"
            >
              <NuxtImg
                :src="
                  product.images?.[0]?.url ||
                  '/images/placeholders/placeholder-product.svg'
                "
                :alt="product.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <!-- Product Badges -->
              <div class="absolute top-2 right-2 flex flex-col gap-2">
                <div
                  v-if="product.quantity === 0  && !product.has_variants"
                  class="bg-red-500/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium tracking-wide"
                  aria-label="Produit épuisé"
                >
                  Épuisé
                </div>
                <div
                  v-else-if="product.compare_at_price"
                  class="bg-emerald-500/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium tracking-wide"
                  aria-label="Produit en promotion"
                >
                  Promo
                </div>
              </div>
            </div>

            <div class="flex justify-between items-start flex-grow">
              <div>
                <h3
                  class="text-sm text-mgray-800  transition-colors font-medium"
                >
                  {{ product.name }}
                </h3>
                <p class="mt-1 text-xs text-mgray-500 font-light uppercase">
                  {{ product.category?.name }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-mgray-800">
                  {{ product.price.toFixed(2) }} DZD
                </p>
                <p
                  v-if="product.compare_at_price"
                  class="mt-0.5 text-xs text-mgray-400 line-through font-light"
                >
                  {{ product.compare_at_price.toFixed(2) }} DZD
                </p>
              </div>
            </div>
          </NuxtLink>

          <!-- Quick Add Button -->
          <button
            v-if="product.quantity > 0"
            @click="addToCart(product)"
            type="button"
            class="mt-3 w-full py-2 px-3 bg-primary text-contrast1 text-xs font-medium tracking-wide rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            aria-label="Ajouter au panier"
          >
            <span>Ajouter au panier</span>
            <Icon name="ph:plus" class="w-3 h-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>

    <!-- Success Notification -->
    <div
      v-if="showNotification"
      class="fixed bottom-0 inset-x-0 pb-2 sm:pb-5 z-50"
      aria-live="polite"
    >
      <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="rounded-lg bg-green-600 p-2 shadow-lg sm:p-3">
          <div class="flex flex-wrap items-center justify-between">
            <div class="flex w-0 flex-1 items-center">
              <span class="flex rounded-lg bg-green-800 p-2">
                <svg
                  class="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              <p class="ml-3 truncate font-medium text-white">
                <span>Produit ajouté au panier !</span>
              </p>
            </div>
            <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
              <button
                type="button"
                class="-mr-1 flex rounded-md p-2 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-white"
                @click="showNotification = false"
                aria-label="Fermer la notification"
              >
                <svg
                  class="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
  
<script setup>
import { ref, onMounted } from "vue";
import { useSupabaseClient } from "#imports";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  user: {
    type: Object,
    default: null,
  },
});

const supabase = useSupabaseClient();
const loading = ref(true);
const error = ref(null);
const featuredProducts = ref([]);
const showNotification = ref(false);

const fetchFeaturedProducts = async () => {
  try {
    let productsData, err;

    if (props.user) {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(name), images:product_images(url)")
        .eq("is_active", true)
        .eq("user_id", props.user)
        .neq("id", props.id)
        .order("created_at", { ascending: false })
        .limit(5);

      productsData = data;
      err = error;
    } 
    
    if (err) throw err;
    featuredProducts.value = productsData;
  } catch (err) {
    console.error("Error fetching featured products:", err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const addToCart = (product) => {
  // Retrieve existing cart
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  // Check if product is already in cart
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url,
      quantity: 1,
      slug: product.slug,
    });
  }

  // Save cart
  localStorage.setItem("cart", JSON.stringify(cart));

  // Show notification
  showNotification.value = true;
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

onMounted(fetchFeaturedProducts);
</script>
