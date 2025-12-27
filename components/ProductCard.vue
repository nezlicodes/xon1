<template>
  <NuxtLink
    :to="`/products/${product.slug}`"
    class="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
  >
    <!-- Product Image -->
    <div class="aspect-square overflow-hidden bg-gray-100 relative">
      <NuxtImg
        v-if="primaryImage"
        :src="primaryImage.url"
        :alt="primaryImage.alt_text || product.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
        <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
      </div>

      <!-- Featured Badge -->
      <div v-if="product.is_featured" class="absolute top-2 left-2">
        <span class="bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded-full">
          {{ $t('products.featured') }}
        </span>
      </div>

      <!-- Out of Stock Badge -->
      <div v-if="product.quantity === 0" class="absolute top-2 right-2">
        <span class="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {{ $t('products.outOfStock') }}
        </span>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <!-- Category -->
      <p v-if="product.category" class="text-xs text-gray-500 mb-1">
        {{ product.category.name }}
      </p>

      <!-- Product Name -->
      <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
        {{ product.name }}
      </h3>

      <!-- Price -->
      <div class="flex items-baseline gap-2">
        <span class="text-2xl font-bold text-purple-600">
          {{ formatPrice(product.price) }}
        </span>
        <span v-if="product.compare_at_price && product.compare_at_price > product.price" class="text-sm text-gray-500 line-through">
          {{ formatPrice(product.compare_at_price) }}
        </span>
      </div>

      <!-- Discount Percentage -->
      <div v-if="discountPercentage > 0" class="mt-2">
        <span class="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
          -{{ discountPercentage }}%
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const { locale, setLocale, locales } = useI18n()

const primaryImage = computed(() => {
  return props.product.images?.find(img => img.is_primary) || props.product.images?.[0]
})

const discountPercentage = computed(() => {
  if (props.product.compare_at_price && props.product.compare_at_price > props.product.price) {
    return Math.round(((props.product.compare_at_price - props.product.price) / props.product.compare_at_price) * 100)
  }
  return 0
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 0
  }).format(price)
}
</script>