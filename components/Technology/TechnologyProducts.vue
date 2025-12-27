<template>
  <section
    v-if="section"
    class="py-16 md:py-24"
    :style="{
      backgroundColor: section.background_color || 'rgb(255, 255, 255)',
      color: section.text_color || 'rgb(17, 24, 39)',
    }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          {{ currentTitle }}
        </h2>
        <p class="text-lg opacity-80 max-w-3xl mx-auto">
          {{ currentContent }}
        </p>
      </div>

      <!-- Products Grid -->
      <div
        v-if="products?.length"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <NuxtLink
          v-for="product in products"
          :key="product.id"
          :to="`/products/${product.slug}`"
          class="group"
        >
          <div
            class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <!-- Product Image -->
            <div class="aspect-square overflow-hidden bg-gray-100">
              <NuxtImg
                :src="
                  product.image ||
                  '/images/placeholders/placeholder-product.svg'
                "
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <!-- Product Info -->
            <div class="p-4">
              <h3
                class="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors"
              >
                {{ product.name }}
              </h3>
              <p
                v-html="product.description"
                class="text-sm opacity-70 line-clamp-2 mb-3"
              ></p>
              <div class="flex items-center justify-between">
                <div class="flex flex-col">
                  <span
                    class="text-xl font-bold"
                    :style="{
                      color: section.background_color || 'rgb(59, 130, 246)',
                    }"
                  >
                    {{ formatPrice(product.price) }}
                  </span>
                  <span
                    v-if="
                      product.compare_at_price &&
                      product.compare_at_price > product.price
                    "
                    class="text-sm text-gray-500 line-through"
                  >
                    {{ formatPrice(product.compare_at_price) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  section: Object,
  products: Array,
});

const { locale } = useI18n();
const { getTranslation } = useTechnologies();
const currentTitle = computed(() =>
  getTranslation(props.section?.title_translations)
);
const currentContent = computed(() =>
  getTranslation(props.section?.content_translations)
);

// Format price with currency
const formatPrice = (price) => {
  if (!price) return "0 DZD";
  return (
    new Intl.NumberFormat("fr-DZ", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price) + " DZD"
  );
};
</script>