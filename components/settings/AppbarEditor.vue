<template>
  <header class="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
    <!-- Top Banner -->
    <TopBanner v-if="!hideBanner" />

    <nav aria-label="Main navigation">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Single Row: Logo, Navigation Links, Icons -->
        <div class="flex items-center justify-between h-16 gap-4 lg:gap-8">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <NuxtLink
              to="/"
              class="flex items-center space-x-3 group"
              aria-label="Home"
            >
              <Logo
                :src="
                  siteSettings.siteLogo ||
                  '/images/placeholders/placeholder-logo.svg'
                "
                :alt="siteSettings.siteName || 'Logo'"
                class="w-10 h-10"
              />
              <span class="text-xl font-bold text-gray-900 hidden sm:block">
                {{ siteSettings.siteName || "Accueil" }}
              </span>
            </NuxtLink>
          </div>

          <!-- Desktop Navigation Links -->
          <div v-if="dataLoaded" class="hidden lg:flex items-center space-x-1">
            <!-- Featured Categories Links (if enabled) -->
            <template v-if="featuredCategories.length > 0">
              <NuxtLink
                v-for="category in featuredCategories"
                :key="category.id"
                :to="`/categories/${category.slug}`"
                class="nav-link"
                :class="{
                  'active-link': route.path === `/categories/${category.slug}`,
                }"
              >
                {{ getCategoryName(category) }}
              </NuxtLink>
            </template>

            <!-- Custom Navigation Links -->
            <NuxtLink
              v-for="(link, index) in visibleLinks"
              :key="`link-${index}`"
              :to="link.url"
              class="nav-link"
              :class="{ 'active-link': isActivePath(link.url) }"
            >
              {{ link.label }}
            </NuxtLink>
          </div>

          <!-- Loading state placeholder for desktop nav -->
          <div v-else class="hidden lg:flex items-center space-x-2">
            <div
              v-for="i in 4"
              :key="`nav-placeholder-${i}`"
              class="w-20 h-8 bg-gray-200 animate-pulse rounded"
            ></div>
          </div>

          <!-- Right side icons -->
          <div class="flex items-center space-x-2 lg:space-x-4">
            <!-- Cart -->
            <NuxtLink
              to="/cart"
              class="relative group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Shopping cart"
            >
              <svg
                class="w-6 h-6 text-gray-700 group-hover:text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span
                v-if="cartCount > 0"
                class="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full px-1.5"
              >
                {{ cartCount }}
              </span>
            </NuxtLink>

            <!-- Language Switcher -->
            <lang-switcher></lang-switcher>

            <!-- Mobile menu button -->
            <button
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              :aria-expanded="isMobileMenuOpen"
              aria-controls="mobile-menu"
              aria-label="Main menu"
              type="button"
            >
              <svg
                v-if="!isMobileMenuOpen"
                class="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                v-else
                class="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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

      <!-- Mobile menu -->
      <transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <MobileMenu
          v-if="isMobileMenuOpen"
          :route="route"
          :categories="featuredCategories"
          :custom-links="visibleLinks"
          :data-loaded="dataLoaded"
          @close="closeMobileMenu"
        />
      </transition>
    </nav>
  </header>
</template>

<script lang="ts" setup>
const { fetchSection } = useContentSections();
const supabase = useSupabaseClient();
const route = useRoute();
const { siteSettings } = useSiteSettings();
const { locale } = useI18n();

// Reactive locale
const currentLocale = computed(() => locale.value);

const props = defineProps({
  hideBanner: {
    type: Boolean,
    default: false,
  },
});

// Default content
const defaultContent = {
  links: [
    { label: "Produits", url: "/products", visible: true, type: "link" },
    { label: "À Propos", url: "/about", visible: true, type: "link" },
    { label: "Contact", url: "/contact", visible: true, type: "link" },
  ],
  show_featured_categories: true,
  show_categories_dropdown: false,
};

// State
const categories = ref([]);
const isMobileMenuOpen = ref(false);
const dataLoaded = ref(false);
const sectionData = ref({
  is_active: true,
  content_translations: {
    fr: { ...defaultContent },
    ar: { ...defaultContent },
    en: { ...defaultContent },
  },
});

// Get current language content
const currentContent = computed(() => {
  return (
    sectionData.value.content_translations?.[currentLocale.value] ||
    defaultContent
  );
});

// Get visible links
const visibleLinks = computed(() => {
  return (currentContent.value.links || defaultContent.links).filter(
    (link) => link.visible
  );
});

// Close functions
const closeMobileMenu = () => (isMobileMenuOpen.value = false);

// Computed
const cartCount = computed(() => {
  if (!process.client) return 0;
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  return cart.reduce((total, item) => total + item.quantity, 0);
});

// Filter only featured categories - FIXED
const featuredCategories = computed(() => {
  return categories.value.filter((cat) => cat.is_featured && cat.is_active);
});



// Get category name based on locale
const getCategoryName = (category) => {
  if (!category.name_translations) return category.name || "";
  return (
    category.name_translations[currentLocale.value] ||
    category.name_translations.fr ||
    category.name_translations.en ||
    category.name ||
    ""
  );
};

// Check if path is active
const isActivePath = (url) => {
  if (url.startsWith("/#")) {
    return route.hash === url.substring(1);
  }
  return route.path === url;
};

// Load section data
const loadSectionData = async () => {
  try {
    const { data, error } = await fetchSection("navbar");

    if (error) throw error;

    if (data) {
      sectionData.value = data;
    }
  } catch (error) {
    console.error("Error loading navbar section:", error);
  }
};

// Fetch categories - FIXED
const loadCategories = async () => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select(
        "id, name_translations, slug, is_featured, is_active, display_order"
      )
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      return;
    }

    if (data) {
      categories.value = data;
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

// Fetch all data
const fetchData = async () => {
  try {
    dataLoaded.value = false;
    await Promise.all([loadSectionData(), loadCategories()]);
  } catch (error) {
    console.error("Error fetching navbar data:", error);
  } finally {
    dataLoaded.value = true;
  }
};

// Handle storage events for cart changes
const handleStorageChange = (e) => {
  if (e.key === "cart") {
    // Force recomputation
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  }
};

// Watch for cart updates from other tabs/windows
if (process.client) {
  watch(
    () => cartCount.value,
    () => {
      // Trigger reactivity
    }
  );
}

onMounted(async () => {
  await fetchData();

  if (process.client) {
    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom cart update events
    window.addEventListener("cartUpdated", () => {
      // Force recomputation
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    });
  }
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener("cartUpdated", () => {});
  }
});
</script>

<style scoped>
.nav-link {
  @apply px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors;
}

.active-link {
  @apply text-primary bg-gray-50;
}
</style>