<template>
  <div>
    <Head>
      <Title>{{ collection?.name ? collection.name : "Collection" }}</Title>
      <Meta
        name="description"
        :content="
          collection?.description_meta ||
          'Découvrez nos produits dans cette collection.'
        "
      />
    </Head>
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
      ></div>
    </div>

    <div
      v-else-if="error"
      class="min-h-screen flex items-center justify-center"
    >
      <div class="text-center">
        <h3 class="text-lg font-medium text-mgray-900">
          Collection introuvable
        </h3>
        <p class="mt-1 text-mgray-500">
          La collection que vous recherchez n'existe pas.
        </p>
        <NuxtLink
          to="/collections"
          class="mt-6 inline-flex items-center text-primary hover:opacity-80"
        >
          Voir toutes les collections
        </NuxtLink>
      </div>
    </div>

    <div v-else>
      <!-- En-tête de la collection -->
      <div class="relative py-36 bg-mgray-100 overflow-hidden">
        <!-- Background image with overlay -->
        <div class="absolute inset-0">
          <NuxtImg
            :src="
              collection.image_url ||
              '/images/placeholders/placeholder-collection.jpg'
            "
            alt=""
            class="w-full h-full object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 mix-blend-multiply"
          ></div>
        </div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h1
              class="text-4xl font-bold tracking-tight text-white drop-shadow-sm"
            >
              {{ collection.name }}
            </h1>
            <p
              v-html="collection.description"
              class="mt-4 max-w-xl mx-auto text-base text-mgray-100 drop-shadow"
            ></p>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Filtres et Tri -->
        <div
          class="flex items-center justify-between pb-6 border-b border-mgray-200"
        >
          <div class="flex items-center">
            <select
              v-model="sortBy"
              class="rounded-md border-mgray-300 py-1.5 text-base focus:outline-none sm:text-sm"
            >
              <option value="name:asc">Nom (A-Z)</option>
              <option value="name:desc">Nom (Z-A)</option>
              <option value="price:asc">Prix : croissant</option>
              <option value="price:desc">Prix : décroissant</option>
              <option value="created_at:desc">Plus récents</option>
            </select>
          </div>

          <div class="flex items-center space-x-4">
            <p class="text-sm text-mgray-500">
              Affichage de
              <span class="font-medium">{{ products.length }}</span> produits
            </p>
          </div>
        </div>

        <!-- Grille des produits -->
        <div
          v-if="products.length > 0"
          class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-2"
        >
          <div v-for="product in products" :key="product.id" class="group">
            <!-- Product Card -->
            <NuxtLink :to="`/products/${product.slug}`">
              <div
                class="aspect-square rounded-lg overflow-hidden bg-mgray-100 mb-3 relative"
              >
                <NuxtImg
                  :src="
                    product.images?.[0]?.url ||
                    '/images/placeholders/placeholder-product.svg'
                  "
                  :alt="product.name"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <!-- Product Badges -->
                <div class="absolute top-2 right-2">
                  <div
                    v-if="product.quantity === 0 && !product.has_variants"
                    class="bg-red-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-light tracking-wide"
                  >
                    Épuisé
                  </div>
                  <div
                    v-else-if="product.compare_at_price"
                    class="bg-emerald-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-light tracking-wide"
                  >
                    Promo
                  </div>
                </div>
              </div>

              <div class="flex justify-between items-start">
                <div>
                  <h3
                    class="text-sm text-mgray-900 group-hover:text-mgray-600 transition-colors font-display tracking-tight"
                  >
                    {{ product.name }}
                  </h3>
                  <p
                    class="mt-0.5 text-xs text-mgray-500 font-light tracking-wide uppercase"
                  >
                    {{ product.collection?.name }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-mgray-900 tracking-tight">
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
              class="mt-2 w-full py-1.5 px-3 bg-secondary text-contrast2 text-xs font-medium tracking-wide rounded-full hover:opacity-80 transition-colors flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span>Ajouter au panier</span>
              <Icon name="ph:plus" class="w-3 h-3" />
            </button>
          </div>
        </div>

        <!-- État vide -->
        <div v-else class="mt-12 text-center">
          <svg
            class="mx-auto h-12 w-12 text-mgray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 12H4"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-mgray-900">Aucun produit</h3>
          <p class="mt-1 text-sm text-mgray-500">
            Aucun produit trouvé dans cette collection.
          </p>
        </div>

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
          class="mt-12 flex items-center justify-center"
        >
          <nav
            class="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              :disabled="currentPage === 1"
              @click="currentPage--"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-mgray-400 ring-1 ring-inset ring-mgray-300 hover:bg-mgray-50 focus:z-20 focus:outline-offset-0"
            >
              <span class="sr-only">Précédent</span>
              <svg
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              :class="[
                currentPage === page
                  ? 'relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-contrast1 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                  : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-mgray-900 ring-1 ring-inset ring-mgray-300 hover:bg-mgray-50 focus:z-20 focus:outline-offset-0',
              ]"
            >
              {{ page }}
            </button>
            <button
              :disabled="currentPage === totalPages"
              @click="currentPage++"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-mgray-400 ring-1 ring-inset ring-mgray-300 hover:bg-mgray-50 focus:z-20 focus:outline-offset-0"
            >
              <span class="sr-only">Suivant</span>
              <svg
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useSupabaseClient } from "#imports";
import { useRoute } from "vue-router";
import { defaultCategories } from "~/utils/placeholders/products";

const config = useRuntimeConfig();
const user = config.public.user;
const supabase = useSupabaseClient();
const route = useRoute();

// État
const loading = ref(true);
const error = ref(null);
const collection = ref(null);
const products = ref([]);
const currentPage = ref(1);
const itemsPerPage = 12;
const totalPages = ref(1);
const sortBy = ref("created_at:desc");

// Récupérer la collection et ses produits
const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    let collectionData, collectionError;
    if (user) {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("slug", route.params.slug)
        .eq("user_id", user)
        .single();

      collectionData = data;
      collectionError = error;
    } else {
      collectionData = defaultCategories;
    }
    // Récupérer la collection

    if (collectionError) throw collectionError;
    if (!collectionData) {
      error.value = "Collection introuvable";
      return;
    }

    collection.value = collectionData;

    // Calculer la pagination
    const from = (currentPage.value - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    // Analyser le paramètre de tri
    const [field, direction] = sortBy.value.split(":");

    // Récupérer les produits avec pagination
    const {
      data: productsData,
      count,
      error: productsError,
    } = await supabase
      .from("products")
      .select("*, images:product_images(url)", { count: "exact" })
      .eq("collection_id", collectionData.id)
      .eq("is_active", true)
      .eq("user_id", user)
      .order(field, { ascending: direction === "asc" })
      .range(from, to);

    if (productsError) throw productsError;

    products.value = productsData || [];
    totalPages.value = Math.ceil(count / itemsPerPage);
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des données de la collection:",
      err
    );
    error.value = "Impossible de charger la collection";
  } finally {
    loading.value = false;
  }
};

// Observer les changements de route, page ou tri
watch([() => route.params.slug, currentPage, sortBy], fetchData, {
  immediate: true,
});

definePageMeta({
  pageTransition: {
    name: "page",
  },
});
</script>