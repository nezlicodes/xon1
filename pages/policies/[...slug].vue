<template>
  <div class="min-h-screen mt-36" :dir="currentLocale === 'ar' ? 'rtl' : 'ltr'">
    <section v-if="policy" class="py-10">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-3xl md:text-4xl font-bold mb-3">
          {{ getTranslation(policy.title_translations) }}
        </h1>
       <!--  <p
          v-if="
            policy.short_description_translations &&
            getTranslation(policy.short_description_translations)
          "
          v-html="getTranslation(policy.short_description_translations)"
          class="text-lg text-gray-600 mb-6"
        ></p> -->
        
        <!-- Rich content from simple_content_translations -->
        <div
          v-if="
            policy.simple_content_translations &&
            getTranslation(policy.simple_content_translations)
          "
          v-html="getTranslation(policy.simple_content_translations)"
          class="prose prose-lg max-w-none mt-8"
        ></div>
      </div>
    </section>

    <section v-else class="py-16">
      <div class="max-w-4xl mx-auto px-4 text-center text-gray-500">
        Loading policy...
      </div>
    </section>
  </div>
</template>

<script setup>
const route = useRoute();
const { locale } = useI18n();
const { fetchPolicyBySlug, getTranslation } = usePolicies();

const policy = ref(null);
const loading = ref(true);
const currentLocale = computed(() => locale.value);

const loadData = async () => {
  loading.value = true;
  const slug = Array.isArray(route.params.slug)
    ? route.params.slug[0]
    : route.params.slug;
  try {
    const { data, error } = await fetchPolicyBySlug(slug);
    if (error) throw error;
    policy.value = data;
  } catch (err) {
    console.error("Error loading policy:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);

// SEO
useHead(() => ({
  title: policy.value
    ? getTranslation(
        policy.value.meta_title_translations || policy.value.title_translations
      )
    : "Policy",
  meta: [
    {
      name: "description",
      content: policy.value
        ? getTranslation(
            policy.value.meta_description_translations ||
              policy.value.short_description_translations
          )
        : "Policy information",
    },
    {
      property: "og:title",
      content: policy.value
        ? getTranslation(policy.value.title_translations)
        : "Policy",
    },
    {
      property: "og:description",
      content: policy.value
        ? getTranslation(policy.value.short_description_translations)
        : "Policy information",
    },
  ],
}));
</script>
