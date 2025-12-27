<template>
  <div>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8  pt-40">
      <h1 class="text-3xl font-medium tracking-tight text-mgray-900">
        Panier
      </h1>

      <div v-if="!cartItems.length" class="mt-12 text-center">
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
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-mgray-900">
          Votre panier est vide
        </h3>
        <p class="mt-1 text-sm text-mgray-500">
          Commencez à ajouter des articles à votre panier !
        </p>
        <div class="mt-6">
          <NuxtLink
            to="/products"
            class="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-contrast1 shadow-sm hover:opacity-95 focus:outline-none"
          >
            Continuer vos achats
          </NuxtLink>
        </div>
      </div>

      <div v-else class="mt-12">
        <div
          class="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16"
        >
          <!-- Articles du panier -->
          <section aria-labelledby="cart-heading" class="lg:col-span-7">
            <h2 id="cart-heading" class="sr-only">
              Articles dans votre panier
            </h2>

            <ul
              role="list"
              class="divide-y divide-mgray-200 border-t border-b border-mgray-200"
            >
              <li
                v-for="item in cartItems"
                :key="item.id"
                class="flex py-6 sm:py-8"
              >
                <div class="flex-shrink-0">
                  <NuxtImg
                    :src="item.image || '/images/placeholders/placeholder-product.svg'"
                    :alt="item.name"
                    class="h-24 w-24 rounded-lg object-cover object-center sm:h-32 sm:w-32"
                  />
                </div>

                <div class="ml-4 flex flex-1 flex-col sm:ml-6">
                  <div>
                    <div class="flex justify-between">
                      <div>
                        <h3 class="text-sm">
                          <NuxtLink
                            :to="'/products/' + item.slug"
                            class="font-medium text-mgray-700 hover:text-mgray-800"
                          >
                            {{ item.name }}
                          </NuxtLink>
                        </h3>
                        <!-- Affichage des options de variante -->
                        <div v-if="item.is_variant" class="mt-1">
                          <div v-if="item.variant_name" class="text-sm text-mgray-500">
                            {{ formatVariantName(item) }}
                          </div>
                          <div v-if="item.options" class="mt-1 flex flex-wrap gap-1">
                            <span 
                              v-for="(value, name) in item.options" 
                              :key="name"
                              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-mgray-100 text-mgray-800"
                            >
                              {{ name }}: {{ value }}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p class="ml-4 text-sm font-medium text-mgray-900">
                        {{ (item.price * item.quantity).toFixed(2) }} DZD
                      </p>
                    </div>
                    <p class="mt-1 text-sm text-mgray-500">
                      {{ item.price.toFixed(2) }} DZD l'unité
                    </p>
                  </div>

                  <div class="mt-4 flex flex-1 items-end justify-between">
                    <div class="flex items-center space-x-2">
                      <label :for="'quantity-' + item.id" class="sr-only"
                        >Quantité</label
                      >
                      <button
                        @click="updateQuantity(item.id, item.quantity - 1)"
                        class="rounded-md px-2 py-1 text-mgray-600 hover:bg-mgray-100"
                        :disabled="item.quantity <= 1"
                      >
                        -
                      </button>
                      <input
                        :id="'quantity-' + item.id"
                        v-model.number="item.quantity"
                        type="number"
                        min="1"
                        class="w-16 rounded-md border-mgray-300 text-center text-sm"
                        @change="updateQuantity(item.id, item.quantity)"
                      />
                      <button
                        @click="updateQuantity(item.id, item.quantity + 1)"
                        class="rounded-md px-2 py-1 text-mgray-600 hover:bg-mgray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      @click="removeItem(item.id, item.is_variant)"
                      class="text-sm font-medium text-primary hover:opacity-80"
                    >
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </section>

          <!-- Récapitulatif de la commande -->
          <section
            aria-labelledby="summary-heading"
            class="mt-16 rounded-lg bg-mgray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2 id="summary-heading" class="text-lg font-medium text-mgray-900">
              Récapitulatif de la commande
            </h2>

            <dl class="mt-6 space-y-4">
              <div class="flex items-center justify-between">
                <dt class="text-sm text-mgray-600">Sous-total</dt>
                <dd class="text-sm font-medium text-mgray-900">
                  {{ subtotal.toFixed(2) }} DZD
                </dd>
              </div>
              <div
                class="flex items-center justify-between border-t border-mgray-200 pt-4"
              >
                <dt class="text-base font-medium text-mgray-900">Total</dt>
                <dd class="text-base font-medium text-mgray-900">
                  {{ subtotal.toFixed(2) }} DZD
                </dd>
              </div>
            </dl>

            <div class="mt-6">
              <button
                type="button"
                class="w-full rounded-md border border-transparent bg-primary px-4 py-3 text-base font-medium text-contrast1 shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 transition-all duration-300"
                @click="proceedToCheckout"
              >
                Passer la commande
              </button>
            </div>

            <div class="mt-6 text-center text-sm text-mgray-500">
              <p>
                ou
                <NuxtLink
                  to="/products"
                  class="font-medium text-primary hover:opacity-80"
                >
                  Continuer vos achats
                  <span aria-hidden="true"> →</span>
                </NuxtLink>
              </p>
            </div>
          </section>
        </div>

        <!-- Bouton vider le panier -->
        <div class="mt-8">
          <button
            type="button"
            class="text-sm font-medium text-red-600 hover:text-red-500"
            @click="clearCart"
          >
            Vider le panier
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const { showConfirmation } = useConfirmationModal();

const router = useRouter();
const cartItems = ref([]);

// Calculer le sous-total
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
});

// Formater le nom de la variante pour l'affichage
const formatVariantName = (item) => {
  if (!item.options) return item.variant_name || '';
  
  return Object.values(item.options).join(' / ');
};

// Charger le panier depuis localStorage
const loadCart = () => {
  if (process.client) {
    const cart = localStorage.getItem("cart");
    cartItems.value = cart ? JSON.parse(cart) : [];
  }
};

// Mettre à jour le panier dans localStorage
const updateLocalStorage = () => {
  localStorage.setItem("cart", JSON.stringify(cartItems.value));
};

// Mettre à jour la quantité
const updateQuantity = (itemId, newQuantity) => {
  if (newQuantity < 1) return;

  const item = cartItems.value.find((item) => item.id === itemId);
  if (item) {
    item.quantity = newQuantity;
    updateLocalStorage();
  }
};

// Supprimer un article
const removeItem = (itemId, isVariant) => {
  cartItems.value = cartItems.value.filter((item) => {
    // Pour les variantes, vérifier id et is_variant
    if (isVariant) {
      return !(item.id === itemId && item.is_variant);
    }
    // Pour les produits simples, vérifier seulement id
    return item.id !== itemId;
  });
  updateLocalStorage();
};

// Vider le panier
const clearCart = () => {
  showConfirmation({
    title: "Vider le panier",
    message: "Êtes-vous sûr de vouloir vider votre panier ?",
    confirmText: "Vider le panier",
    cancelText: "Annuler",
    onConfirm: async () => {
      cartItems.value = [];
      updateLocalStorage();
    },
  });
};

// Passer à la commande
const proceedToCheckout = () => {
  // Sauvegarder l'état du panier si nécessaire
  router.push("/checkout");
};

// Initialisation
onMounted(() => {
  loadCart();
});

useHead({
  title: "Panier",
  meta: [
    {
      name: "description",
      content: "Votre panier d'achat",
    },
  ],
});

definePageMeta({
  pageTransition: {
    name: "page",
  },
});
</script>