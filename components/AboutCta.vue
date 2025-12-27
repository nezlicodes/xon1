<template>
  <section
    class="py-20 bg-gradient-to-br from-primary-900 via-primary-900 to-primary-800 text-white"
    :dir="(useI18n().locale.value === 'ar') ? 'rtl' : 'ltr'"
  >
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div v-if="loading" class="animate-pulse">
        <div class="h-12 bg-white/20 rounded w-2/3 mx-auto mb-6"></div>
        <div class="h-6 bg-white/20 rounded w-1/2 mx-auto mb-8"></div>
      </div>

      <div v-else>
        <h2 class="text-4xl md:text-5xl font-bold mb-6">
          {{ section?.title }}
        </h2>
        <p class="text-xl text-primary-100 mb-10">
          {{ section?.content }}
        </p>
        <NuxtLink
          :to="buttonUrl"
          class="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-900 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
        >
          {{ buttonText }}
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
  
  <script setup>
const props = defineProps({
  section: Object,
  loading: Boolean,
});

const getCurrentLocale = () => {
  try {
    const { locale } = useI18n();
    return locale.value;
  } catch {
    return "fr";
  }
};

const buttonText = computed(() => {
  const locale = getCurrentLocale();
  return (
    props.section?.additionalData?.[`button_text_${locale}`] ||
    props.section?.additionalData?.button_text_fr ||
    "Parcourir les Produits"
  );
});

const buttonUrl = computed(() => {
  return props.section?.additionalData?.button_url || "/products";
});
</script>