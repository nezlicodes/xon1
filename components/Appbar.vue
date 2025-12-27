<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out"
    @mouseenter="headerHovered = true"
    @mouseleave="headerHovered = false"
    :class="{
      // Transparent page states
      'bg-white/10 backdrop-blur-md  hover:bg-white/95 hover:backdrop-blur-xl hover:border-gray-200/50':
        isTransparentPage && !isScrolled,
      'bg-white  ': isTransparentPage && isScrolled,
      // Regular page state
      'bg-white shadow-sm  ': !isTransparentPage,
    }"
  >
    <!-- Top Banner -->
    <TopBanner v-if="!hideBanner" />

    <nav aria-label="Main navigation">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <!-- Single Row: Logo, Navigation Links, Icons -->
        <div class="flex items-center justify-between h-16 gap-4 lg:gap-8">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <NuxtLink
              :to="localePath('/')"
              class="flex items-center space-x-3 group"
              aria-label="Home"
            >
              <Logo
                :src="displayLogoSrc"
                :alt="siteSettings.siteName || 'Logo'"
                class="w-20 w-auto px-2 transition-opacity duration-300"
              />
              <span
                class="text-xl font-bold hidden sm:block transition-colors duration-500 ease-in-out"
                :class="
                  isTransparentPage && !isScrolled
                    ? 'text-white'
                    : 'text-gray-900'
                "
              >
                {{ siteSettings.siteName || "Accueil" }}
              </span>
            </NuxtLink>
          </div>

          <!-- Desktop Navigation Links -->
          <div v-if="dataLoaded" class="hidden lg:flex items-center space-x-1">
            <!-- Featured Categories: show dropdown if too many -->
            <template v-if="!showCategoriesDropdown">
              <NuxtLink
                v-for="category in featuredCategories"
                :key="category.id"
                :to="localePath(`/categories/${category.slug}`)"
                class="nav-link transition-colors duration-500"
                :class="{
                  'active-link':
                    route.path === `/categories/${category.slug}` &&
                    (!isTransparentPage || isScrolled),
                  'nav-link-white-text': isTransparentPage && !isScrolled,
                }"
              >
                {{ getCategoryName(category) }}
              </NuxtLink>
            </template>
            <template v-else>
              <div
                class="relative"
                @mouseenter="openCategories"
                @mouseleave="scheduleClose"
              >
                <button
                  type="button"
                  class="nav-link transition-colors duration-500 flex items-center gap-2"
                  :class="{
                    'nav-link-white-text': isTransparentPage && !isScrolled,
                  }"
                  @click="isCategoriesOpen = !isCategoriesOpen"
                >
                  {{ $t("common.categories") || "Categories" }}
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.207l3.71-3.977a.75.75 0 111.08 1.04l-4.24 4.54a.75.75 0 01-1.08 0l-4.24-4.54a.75.75 0 01.02-1.06z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <div
                  v-show="isCategoriesOpen"
                  class="absolute mt-1 min-w-[12rem] rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                  @mouseenter="openCategories"
                  @mouseleave="scheduleClose"
                >
                  <div class="py-1">
                    <NuxtLink
                      v-for="category in featuredCategories"
                      :to="localePath(`/categories/${category.slug}`)"
                      :key="`dd-${category.id}`"
                      class="block px-4 py-2 font-bold text-gray-700 hover:bg-gray-100"
                    >
                      {{ getCategoryName(category) }}
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </template>

            <!-- Custom Navigation Links -->
            <template
              v-for="(link, index) in visibleLinks"
              :key="`link-${index}`"
            >
              <a
                v-if="link.url.includes('#')"
                :href="link.url"
                @click.prevent="handleScrollToSection(link.url)"
                class="nav-link transition-colors duration-500 cursor-pointer"
                :class="{
                  'active-link':
                    isActivePath(link.url) &&
                    (!isTransparentPage || isScrolled),
                  'nav-link-white-text': isTransparentPage && !isScrolled,
                }"
              >
                {{ link.label }}
              </a>
              <NuxtLink
                v-else
                :to="localePath(link.url)"
                class="nav-link transition-colors duration-500"
                :class="{
                  'active-link':
                    isActivePath(link.url) &&
                    (!isTransparentPage || isScrolled),
                  'nav-link-white-text': isTransparentPage && !isScrolled,
                }"
              >
                {{ link.label }}
              </NuxtLink>
            </template>
          </div>

          <!-- Loading state placeholder for desktop nav -->
          <div v-else class="hidden lg:flex items-center space-x-2">
            <div
              v-for="i in 5"
              :key="`nav-placeholder-${i}`"
              class="w-20 h-8 bg-gray-200 animate-pulse rounded"
            ></div>
          </div>

          <!-- Right side icons -->
          <div class="flex items-center space-x-2 lg:space-x-4">
            <!-- Cart -->
            <NuxtLink
              :to="localePath('/cart')"
              class="relative group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Shopping cart"
            >
              <svg
                class="w-6 h-6 transition-colors duration-500"
                :class="
                  isTransparentPage && !isScrolled
                    ? 'text-white/90 group-hover:text-gray-900'
                    : 'text-gray-700 group-hover:text-primary'
                "
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
            <lang-switcher
              :transparent="isTransparentPage && !isScrolled && !headerHovered"
            ></lang-switcher>

            <!-- Mobile menu button -->
            <button
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="lg:hidden p-2 rounded-lg transition-all duration-500"
              :class="
                isTransparentPage && !isScrolled
                  ? 'hover:bg-white/20 text-white/90'
                  : 'hover:bg-gray-100 text-gray-700'
              "
              :aria-expanded="isMobileMenuOpen"
              aria-controls="mobile-menu"
              aria-label="Main menu"
              type="button"
            >
              <svg
                v-if="!isMobileMenuOpen"
                class="w-6 h-6 transition-colors duration-500"
                :class="
                  isTransparentPage && !isScrolled
                    ? 'text-white/90'
                    : 'text-gray-700'
                "
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
                class="w-6 h-6 transition-colors duration-500"
                :class="
                  isTransparentPage && !isScrolled
                    ? 'text-white/90'
                    : 'text-gray-700'
                "
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
          :show-categories="true"
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
const localePath = useLocalePath();
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

// Featured categories - ALWAYS returned, no filtering by show_featured_categories
const featuredCategories = computed(() => {
  return categories.value;
});

const showCategoriesDropdown = computed(
  () => (featuredCategories.value?.length || 0) > 3
);
const isCategoriesOpen = ref(false);
let closeTimer: any = null;
const openCategories = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
  isCategoriesOpen.value = true;
};
const scheduleClose = () => {
  if (closeTimer) clearTimeout(closeTimer);
  closeTimer = setTimeout(() => {
    isCategoriesOpen.value = false;
    closeTimer = null;
  }, 150);
};

// Get category name based on locale
const getCategoryName = (category) => {
  if (!category?.name_translations) return category?.name || "";
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

// Handle scroll to section for hash links
const handleScrollToSection = async (url: string) => {
  const hash = url.includes("#") ? url.split("#")[1] : "";
  if (!hash) return;

  // If we're not on the home page, navigate to home first
  if (route.path !== "/") {
    await navigateTo("/#" + hash);
    // Wait a bit for navigation to complete
    setTimeout(() => {
      scrollToElement(hash);
    }, 100);
  } else {
    scrollToElement(hash);
  }
};

// Scroll to element with smooth behavior
const scrollToElement = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const headerOffset = 100; // Account for fixed header height
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
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

// Fetch categories - ALWAYS fetch featured categories
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
      console.error("❌ Error fetching categories:", error);
      return;
    }

    if (data) {
      categories.value = data;
    }
  } catch (error) {
    console.error("❌ Exception fetching categories:", error);
  }
};

// Fetch all data
const fetchData = async () => {
  dataLoaded.value = false;
  try {
    await Promise.all([loadSectionData(), loadCategories()]);
  } catch (error) {
    console.error("Error fetching navbar data:", error);
  } finally {
    dataLoaded.value = true;
  }
};

// Computed property to check if current page should have transparent navbar
const isTransparentPage = computed(() => {
  return (
    route.path === "/" ||
    route.path.startsWith("/technologies/") ||
    route.path.startsWith("/categories/")
  );
});

// Scroll state management
const isScrolled = ref(false);

// Handle scroll events
const handleScroll = () => {
  if (process.client) {
    isScrolled.value = window.scrollY > 50;
  }
};

// Handle storage events for cart changes
const handleStorageChange = (e) => {
  if (e.key === "cart") {
    // Trigger reactivity
    const _ = cartCount.value;
  }
};

const headerHovered = ref(false);
const displayLogoSrc = computed(() => {
  const noBg = siteSettings.value.siteLogoNoBg;
  const regular =
    siteSettings.value.siteLogo || "/images/placeholders/placeholder-logo.svg";
  // Before scroll and when not hovered: use no-bg if available
  if (!isScrolled.value && !headerHovered.value && noBg) return noBg;
  // Otherwise show regular
  return regular;
});

onMounted(async () => {
  await fetchData();

  if (process.client) {
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("scroll", handleScroll);
    // Initialize scroll state
    handleScroll();
  }
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener("scroll", handleScroll);
  }
});
</script>

<style scoped>
.nav-link {
  padding: 1rem 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: rgb(55 65 81);
  border-radius: 0.5rem;
  transition: all 0.5s ease-in-out;
}

.nav-link:hover {
  color: rgb(var(--color-primary) / 1);
  background-color: rgb(249 250 251);
}

.nav-link-white-text {
  color: rgba(255, 255, 255, 0.9);
}

.nav-link-white-text:hover {
  color: rgba(255, 255, 255, 1);
  background-color: rgba(255, 255, 255, 0.1);
}

.active-link {
  color: rgb(var(--color-primary) / 1);
  background-color: rgb(249 250 251);
}

/* Enhanced glassmorphism effect on header hover */
header:hover .nav-link-white-text {
  color: rgb(55 65 81);
}

header:hover .nav-link-white-text:hover {
  color: rgb(var(--color-primary) / 1);
  background-color: rgb(249 250 251);
}

/* Logo hover effect for transparent mode */
header:hover .transition-colors {
  color: rgb(17 24 39);
}

/* Enhanced backdrop blur support */
@supports (backdrop-filter: blur(16px)) {
  .backdrop-blur-md {
    backdrop-filter: blur(16px);
  }
  .backdrop-blur-xl {
    backdrop-filter: blur(24px);
  }
}

/* Fallback for browsers without backdrop-filter */
@supports not (backdrop-filter: blur(16px)) {
  header.bg-white\/10 {
    background-color: rgba(255, 255, 255, 0.85);
  }
  header:hover.bg-white\/95 {
    background-color: rgba(255, 255, 255, 0.98);
  }
}

/* Smooth shadow transition */
header {
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  transition: all 0.5s ease-in-out, box-shadow 0.3s ease-in-out;
}

header:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Mobile menu button transparent theme support */
header:hover button {
  color: rgb(55 65 81);
}

header:hover button:hover {
  background-color: rgb(243 244 246);
}

/* Cart icon and language switcher transparent support */
header:hover .group svg {
  color: rgb(55 65 81);
}

header:hover .group:hover svg {
  color: rgb(var(--color-primary) / 1);
}

/* Enhanced mobile responsiveness for transparent mode */
@media (max-width: 1024px) {
  .nav-link-white-text {
    color: rgba(255, 255, 255, 0.95);
  }
}

/* Ensure proper z-index stacking */
header {
  position: fixed;
  z-index: 9999;
}

/* Subtle border animation */
header.bg-white\/10 {
  border-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.2)
    )
    1;
}

header:hover.bg-white\/95 {
  border-image: linear-gradient(
      90deg,
      rgba(229, 231, 235, 0.5),
      rgba(229, 231, 235, 0.3),
      rgba(229, 231, 235, 0.5)
    )
    1;
}
</style>