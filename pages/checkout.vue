<template>
  <div>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-medium tracking-tight text-mgray-900">
          {{ $t("checkout.title") }}
        </h1>
        <p class="mt-2 text-sm text-mgray-600">
          {{ $t("checkout.subtitle") }}
        </p>
      </div>

      <!-- Empty Cart Message -->
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
          Ajoutez des articles avant de passer commande
        </p>
        <div class="mt-6">
          <NuxtLink
            to="/products"
            class="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-contrast1 shadow-sm hover:opacity-95"
          >
            Voir les produits
          </NuxtLink>
        </div>
      </div>

      <!-- Checkout Content -->
      <div v-else>
        <!-- Success Message -->
        <div
          v-if="orderSuccess"
          class="mb-8 rounded-lg bg-green-50 border border-green-200 p-6"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div class="ml-3 flex-1">
              <h3 class="text-lg font-medium text-green-900">
                {{ $t("checkout.success.title") }}
              </h3>
              <div class="mt-2 text-sm text-green-800">
                <p>{{ $t("checkout.success.message") }}</p>
                <p class="mt-2 font-mono text-sm">
                  {{ $t("checkout.success.orderId") }}: {{ orderId }}
                </p>
              </div>
              <div class="mt-4">
                <button
                  @click="returnToHome"
                  class="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Retour à l'accueil
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="formError"
          class="mb-8 rounded-lg bg-red-50 border border-red-200 p-4"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ formError }}</p>
            </div>
          </div>
        </div>

        <!-- Main Checkout Grid -->
        <div
          v-if="!orderSuccess"
          class="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16"
        >
          <!-- Checkout Form - Left Side -->
          <div class="lg:col-span-7">
            <form @submit.prevent="handleSubmit" class="space-y-8">
              <!-- Personal Information -->
              <section>
                <h2 class="text-lg font-medium text-mgray-900 mb-4">
                  {{ $t("checkout.personalInfo") }}
                </h2>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      for="firstName"
                      class="block text-sm font-medium text-mgray-700 mb-1"
                    >
                      {{ $t("checkout.firstName") }}*
                    </label>
                    <input
                      id="firstName"
                      v-model="form.firstName"
                      type="text"
                      required
                      class="block w-full rounded-md border-mgray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      :placeholder="$t('checkout.firstNamePlaceholder')"
                    />
                  </div>

                  <div>
                    <label
                      for="lastName"
                      class="block text-sm font-medium text-mgray-700 mb-1"
                    >
                      {{ $t("checkout.lastName") }}*
                    </label>
                    <input
                      id="lastName"
                      v-model="form.lastName"
                      type="text"
                      required
                      class="block w-full rounded-md border-mgray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      :placeholder="$t('checkout.lastNamePlaceholder')"
                    />
                  </div>

                  <div class="sm:col-span-2">
                    <label
                      for="phoneNumber"
                      class="block text-sm font-medium text-mgray-700 mb-1"
                    >
                      {{ $t("checkout.phoneNumber") }}*
                    </label>
                    <input
                      id="phoneNumber"
                      v-model="form.phoneNumber"
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      class="block w-full rounded-md border-mgray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      :placeholder="$t('checkout.phoneNumberPlaceholder')"
                    />
                    <p class="mt-1 text-xs text-mgray-500">
                      {{ $t("checkout.phoneNumberHint") }}
                    </p>
                  </div>
                </div>
              </section>

              <!-- Shipping Information -->
              <section>
                <h2 class="text-lg font-medium text-mgray-900 mb-4">
                  {{ $t("checkout.shippingInfo") }}
                </h2>
                <div class="grid grid-cols-1 gap-4">
                  <!-- Delivery Type -->
                  <div>
                    <label
                      for="deliveryType"
                      class="block text-sm font-medium text-mgray-700 mb-1"
                    >
                      Type de livraison*
                    </label>
                    <select
                      id="deliveryType"
                      v-model="form.deliveryType"
                      required
                      @change="handleDeliveryTypeChange"
                      class="block w-full rounded-md border-mgray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                      <option :value="null">Sélectionner un type</option>
                      <option value="stopdesk">Stop Desk</option>
                      <option value="home">Livraison à domicile</option>
                    </select>
                  </div>

                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <!-- Wilaya -->
                    <div>
                      <label
                        for="wilaya"
                        class="block text-sm font-medium text-mgray-700 mb-1"
                      >
                        {{ $t("checkout.wilaya") }}*
                      </label>
                      <select
                        id="wilaya"
                        v-model="form.wilayaId"
                        required
                        @change="handleWilayaChange"
                        class="block w-full rounded-md border-mgray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      >
                        <option :value="null">
                          {{ $t("checkout.selectWilaya") }}
                        </option>
                        <option
                          v-for="wilaya in wilayas"
                          :key="wilaya.id"
                          :value="wilaya.id"
                        >
                          {{ wilaya.code }} - {{ wilaya.name }} ({{
                            wilaya.ar_name
                          }})
                        </option>
                      </select>
                    </div>

                    <!-- Commune -->
                    <div>
                      <label
                        for="commune"
                        class="block text-sm font-medium text-mgray-700 mb-1"
                      >
                        {{ $t("checkout.commune") }}*
                      </label>
                      <select
                        id="commune"
                        v-model="form.communeId"
                        required
                        @change="handleCommuneChange"
                        :disabled="!form.wilayaId || loadingCommunes"
                        class="block w-full rounded-md border-mgray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm disabled:bg-mgray-100 disabled:cursor-not-allowed"
                      >
                        <option :value="null">
                          {{
                            loadingCommunes
                              ? $t("checkout.loadingCommunes")
                              : $t("checkout.selectCommune")
                          }}
                        </option>
                        <option
                          v-for="commune in communes"
                          :key="commune.id"
                          :value="commune.id"
                        >
                          {{ commune.name }} ({{ commune.ar_name }})
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Additional Information -->
              <section>
                <h2 class="text-lg font-medium text-mgray-900 mb-4">
                  {{ $t("checkout.additionalInfo") }}
                </h2>
                <div>
                  <label
                    for="message"
                    class="block text-sm font-medium text-mgray-700 mb-1"
                  >
                    {{ $t("checkout.message") }}
                  </label>
                  <textarea
                    id="message"
                    v-model="form.message"
                    rows="3"
                    class="block w-full rounded-md border-mgray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm resize-none"
                    :placeholder="$t('checkout.messagePlaceholder')"
                  ></textarea>
                </div>
              </section>
            </form>
          </div>

          <!-- Order Summary - Right Side -->
          <section
            aria-labelledby="summary-heading"
            class="mt-10 lg:col-span-5 lg:mt-0"
          >
            <div
              class="rounded-lg bg-mgray-50 px-4 py-6 sm:p-6 lg:p-8 sticky top-4"
            >
              <h2
                id="summary-heading"
                class="text-lg font-medium text-mgray-900 mb-4"
              >
                Récapitulatif de la commande
              </h2>

              <!-- Cart Items -->
              <ul
                class="divide-y divide-mgray-200 border-t border-b border-mgray-200 py-4 mb-6"
              >
                <li
                  v-for="item in cartItems"
                  :key="item.id"
                  class="flex py-4 space-x-4"
                >
                  <NuxtImg
                    :src="
                      item.image ||
                      '/images/placeholders/placeholder-product.svg'
                    "
                    :alt="item.name"
                    class="h-16 w-16 flex-shrink-0 rounded-md object-cover"
                  />
                  <div class="flex flex-1 flex-col">
                    <div class="flex justify-between">
                      <h3 class="text-sm font-medium text-mgray-900">
                        {{ item.name }}
                      </h3>
                      <p class="ml-4 text-sm font-medium text-mgray-900">
                        {{ (item.price * item.quantity).toFixed(2) }} DZD
                      </p>
                    </div>
                    <p class="mt-1 text-xs text-mgray-500">
                      {{ item.price.toFixed(2) }} DZD × {{ item.quantity }}
                    </p>
                    <div v-if="item.is_variant && item.options" class="mt-1">
                      <span
                        v-for="(value, name) in item.options"
                        :key="name"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-mgray-200 text-mgray-800 mr-1"
                      >
                        {{ name }}: {{ value }}
                      </span>
                    </div>
                  </div>
                </li>
              </ul>

              <!-- Pricing Breakdown -->
              <dl class="space-y-3">
                <!-- Subtotal -->
                <div class="flex items-center justify-between">
                  <dt class="text-sm text-mgray-600">Sous-total</dt>
                  <dd class="text-sm font-medium text-mgray-900">
                    {{ subtotal.toFixed(2) }} DZD
                  </dd>
                </div>

                <!-- Delivery Fee -->
                <div class="flex items-center justify-between">
                  <dt class="text-sm text-mgray-600">
                    Frais de livraison
                    <span v-if="loadingFee" class="text-xs">(Calcul...)</span>
                  </dt>
                  <dd class="text-sm font-medium text-mgray-900">
                    <span v-if="deliveryFee > 0">
                      {{ deliveryFee.toFixed(2) }} DZD
                    </span>
                    <span v-else-if="!form.wilayaId || !form.communeId || !form.deliveryType" class="text-xs text-mgray-500">
                      À calculer
                    </span>
                    <span v-else>
                      Gratuit
                    </span>
                  </dd>
                </div>

                <!-- Total -->
                <div
                  class="flex items-center justify-between border-t border-mgray-200 pt-3"
                >
                  <dt class="text-base font-medium text-mgray-900">Total</dt>
                  <dd class="text-base font-medium text-mgray-900">
                    {{ totalPrice.toFixed(2) }} DZD
                  </dd>
                </div>
              </dl>

              <!-- Submit Button -->
              <div class="mt-6">
                <button
                  type="submit"
                  @click="handleSubmit"
                  :disabled="submitting || !canSubmit"
                  class="w-full rounded-md border border-transparent bg-primary px-4 py-3 text-base font-medium text-contrast1 shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <svg
                    v-if="submitting"
                    class="animate-spin -ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {{
                    submitting
                      ? $t("checkout.submitting")
                      : $t("checkout.submit")
                  }}
                </button>
              </div>

              <!-- Back to Cart Link -->
              <div class="mt-4 text-center">
                <NuxtLink
                  to="/Cart"
                  class="text-sm font-medium text-primary hover:opacity-80"
                >
                  <span aria-hidden="true">←</span> Retour au panier
                </NuxtLink>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";

// Composables
const router = useRouter();
const {
  wilayas,
  communes,
  fetchWilayas,
  fetchCommunesByWilaya,
  clearCommunes,
} = useLocation();
const { createOrder } = useOrders();
const { getDeliveryFee } = useDeliveryFees();
const { t } = useI18n();

// Cart State
const cartItems = ref([]);

// Form State
const form = reactive({
  firstName: "",
  lastName: "",
  phoneNumber: "",
  deliveryType: null,
  wilayaId: null,
  communeId: null,
  message: "",
});

const submitting = ref(false);
const loadingCommunes = ref(false);
const loadingFee = ref(false);
const orderSuccess = ref(false);
const orderId = ref("");
const formError = ref(null);
const deliveryFee = ref(0);

// Computed
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
});

const totalPrice = computed(() => {
  return subtotal.value + deliveryFee.value;
});

const canSubmit = computed(() => {
  return (
    form.firstName &&
    form.lastName &&
    form.phoneNumber &&
    form.deliveryType &&
    form.wilayaId &&
    form.communeId &&
    cartItems.value.length > 0
  );
});

// Load cart from localStorage
const loadCart = () => {
  if (process.client) {
    const cart = localStorage.getItem("cart");
    cartItems.value = cart ? JSON.parse(cart) : [];
  }
};

// Calculate delivery fee
const calculateDeliveryFee = async () => {
  if (!form.wilayaId || !form.communeId || !form.deliveryType) {
    deliveryFee.value = 0;
    return;
  }

  loadingFee.value = true;
  try {
    const fee = await getDeliveryFee(
      form.wilayaId,
      form.communeId,
      form.deliveryType
    );
    deliveryFee.value = fee || 0;
  } catch (error) {
    console.error("Error calculating delivery fee:", error);
    deliveryFee.value = 0;
  } finally {
    loadingFee.value = false;
  }
};

// Load wilayas
onMounted(async () => {
  loadCart();
  await fetchWilayas();
});

// Handle delivery type change
const handleDeliveryTypeChange = () => {
  if (form.wilayaId && form.communeId) {
    calculateDeliveryFee();
  }
};

// Handle wilaya change
const handleWilayaChange = async () => {
  form.communeId = null;
  deliveryFee.value = 0;
  clearCommunes();

  if (form.wilayaId) {
    loadingCommunes.value = true;
    await fetchCommunesByWilaya(form.wilayaId);
    loadingCommunes.value = false;
  }
};

// Handle commune change
const handleCommuneChange = () => {
  if (form.wilayaId && form.communeId && form.deliveryType) {
    calculateDeliveryFee();
  }
};

// Handle form submission
const handleSubmit = async () => {
  if (!canSubmit.value) {
    formError.value = "Veuillez remplir tous les champs requis";
    return;
  }

  submitting.value = true;
  formError.value = null;

  try {
    // Create order for each cart item
    const orderPromises = cartItems.value.map((item) => {
      const orderData = {
        first_name: form.firstName,
        last_name: form.lastName,
        phone_number: form.phoneNumber,
        product_name: item.name,
        quantity: item.quantity,
        wilaya_id: form.wilayaId,
        commune_id: form.communeId,
        message: form.message || null,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        delivery_type: form.deliveryType,
        delivery_fee: deliveryFee.value,
      };
      return createOrder(orderData);
    });

    const results = await Promise.all(orderPromises);

    if (results.every((result) => result !== null)) {
      orderSuccess.value = true;
      orderId.value = results[0].id; // Show first order ID

      // Clear cart after successful order
      if (process.client) {
        localStorage.removeItem("cart");
        cartItems.value = [];
      }
    } else {
      formError.value = t("checkout.errors.submissionFailed");
    }
  } catch (error) {
    formError.value = t("checkout.errors.unknown");
    console.error("Checkout error:", error);
  } finally {
    submitting.value = false;
  }
};

// Return to home
const returnToHome = () => {
  router.push("/");
};

// SEO
useHead({
  title: t("checkout.title"),
  meta: [{ name: "description", content: t("checkout.subtitle") }],
});
</script>
