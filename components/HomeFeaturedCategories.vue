<template>
  <section v-if="sectionData.is_active" class="py-16 bg-gray-50" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {{ sectionTitle }}
        </h2>
        <p class="text-lg text-gray-600" v-html="sectionSubtitle"></p>
      </div>

      <div
        v-if="loading"
        class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div v-for="i in 4" :key="i" class="animate-pulse">
          <div class="bg-white rounded-lg h-64"></div>
        </div>
      </div>

      <div
        v-else-if="categories.length > 0"
        class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/categories/${category.slug}`"
          class="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
        >
          <div class="aspect-square overflow-hidden bg-gray-200">
            <NuxtImg
              v-if="category.image_url"
              :src="category.image_url"
              :alt="category.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
             :alt="getCategoryName(category)"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-gray-400"
            >
              <svg
                class="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          </div>

          <div class="p-4">
            <h3
              class="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors"
            >
              {{ getCategoryName(category) }}
            </h3>
            <p
              v-if="getCategoryDescription(category)"
              class="text-sm text-gray-600 mt-2 line-clamp-2"
            >
              {{ getCategoryDescription(category) }}
            </p>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-500">{{ $t("home.categories.empty") }}</p>
      </div>

      <div class="text-center mt-12">
        <NuxtLink
          to="/categories"
          class="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {{ $t("home.categories.viewAll") }}
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
const { fetchCategories } = useCategories();
const supabase = useSupabaseClient();
const { locale } = useI18n();

const categories = ref([]);

const getCategoryName = (cat) => cat?.name_translations?.[locale.value] || cat?.name || ''
const getCategoryDescription = (cat) => cat?.description_translations?.[locale.value] || cat?.description || ''
const loading = ref(true);

// Section data
const sectionData = ref({
  is_active: true,
  content_translations: {
    en: {
      title: "Featured Categories",
      subtitle: "Explore our most popular product categories",
    },
    fr: {
      title: "Catégories populaires",
      subtitle: "Découvrez nos catégories de produits les plus populaires",
    },
    ar: {
      title: "الفئات المميزة",
      subtitle: "استكشف فئات المنتجات الأكثر شعبية",
    },
  },
});

// Computed properties for title and subtitle based on current language
const sectionTitle = computed(() => {
  return (
    sectionData.value.content_translations?.[locale.value]?.title ||
    sectionData.value.content_translations?.fr?.title ||
    "Catégories populaires"
  );
});

const sectionSubtitle = computed(() => {
  return (
    sectionData.value.content_translations?.[locale.value]?.subtitle ||
    sectionData.value.content_translations?.fr?.subtitle ||
    "Découvrez nos catégories de produits les plus populaires"
  );
});

// Load section data
const loadSectionData = async () => {
  try {
    const { data, error } = await supabase
      .from("content_sections")
      .select("*")
      .eq("section_key", "featured_categories")
      .single();

    if (error && error.code !== 'PGRST116') {
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

// Load categories
const loadCategories = async () => {
  loading.value = true;

  const { data } = await fetchCategories({ featured: true, active: true, select: 'id, slug, image_url, name, description, name_translations, description_translations' });

  if (data) {
    categories.value = data;
  }

  loading.value = false;
};

onMounted(async () => {
  await loadSectionData();
  await loadCategories();
});

// Watch locale changes and reload section data
watch(locale, async () => {
  // No need to reload from database, just the computed will react
  // But we can reload if needed for other reasons
});
</script>
