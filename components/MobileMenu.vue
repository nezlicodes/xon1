<template>
  <div
    id="mobile-menu"
    class="lg:hidden transition-all duration-300 relative z-50 min-h-40 bg-white shadow-lg rounded-lg overflow-hidden"
    style="animation: mobileMenuFade 0.3s ease-out"
    role="navigation"
    aria-label="Mobile navigation"
  >
    <div class="px-2 pt-2 pb-3 space-y-1">
      <!-- Loading state -->
      <div v-if="!dataLoaded" class="space-y-2 p-2">
        <div
          v-for="i in 4"
          :key="`mobile-placeholder-${i}`"
          class="h-10 bg-gray-200 animate-pulse rounded"
        ></div>
      </div>

      <!-- Loaded menu items -->
      <template v-else>
        <!-- Featured Categories with Accordion -->
        <div v-if="showCategories && categories.length > 0" class="space-y-1">
          <button
            @click="toggleCategories"
            class="mobile-accordion-button"
            :aria-expanded="isCategoriesOpen"
            type="button"
          >
            <span>{{ $t('categories') || 'Catégories' }}</span>
            <svg
              class="ml-2 h-5 w-5 transition-transform duration-300"
              :class="{ 'rotate-180': isCategoriesOpen }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="isCategoriesOpen"
              class="pl-4 space-y-1"
            >
              <NuxtLink
                v-for="category in categories"
                :key="category.id"
                :to="`/categories/${category.slug}`"
                class="mobile-link"
                :class="{ 'font-semibold text-primary': route.path === `/categories/${category.slug}` }"
                @click="handleLinkClick"
              >
                {{ getCategoryName(category) }}
              </NuxtLink>
            </div>
          </transition>
        </div>

        <!-- Custom Navigation Links -->
        <template v-for="(link, index) in customLinks" :key="`link-${index}`">
          <a
            v-if="link.url.includes('#')"
            :href="link.url"
            @click.prevent="handleScrollLink(link.url)"
            class="mobile-link cursor-pointer"
            :class="{ 'font-semibold text-primary': isActivePath(link.url) }"
          >
            {{ link.label }}
          </a>
          <NuxtLink
            v-else
            :to="link.url"
            class="mobile-link"
            :class="{ 'font-semibold text-primary': isActivePath(link.url) }"
            @click="handleLinkClick"
          >
            {{ link.label }}
          </NuxtLink>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { locale } = useI18n();

const props = defineProps({
  route: {
    type: Object,
    required: true,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  customLinks: {
    type: Array,
    default: () => [],
  },
  showCategories: {
    type: Boolean,
    default: true,
  },
  dataLoaded: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

const isCategoriesOpen = ref(false);

const toggleCategories = () => {
  isCategoriesOpen.value = !isCategoriesOpen.value;
};

// Get category name based on locale
const getCategoryName = (category) => {
  if (!category?.name_translations) return category?.name || '';
  return (
    category.name_translations[locale.value] ||
    category.name_translations.fr ||
    category.name_translations.en ||
    category.name ||
    ''
  );
};

// Check if path is active
const isActivePath = (url) => {
  if (url.startsWith('/#')) {
    return props.route.hash === url.substring(1);
  }
  return props.route.path === url;
};

const handleLinkClick = () => {
  emit('close');
};

// Handle scroll to section for hash links
const handleScrollLink = async (url: string) => {
  const hash = url.includes('#') ? url.split('#')[1] : '';
  if (!hash) return;

  // Close mobile menu first
  emit('close');

  // If we're not on the home page, navigate to home first
  if (props.route.path !== '/') {
    await navigateTo('/#' + hash);
    // Wait a bit for navigation to complete
    setTimeout(() => {
      scrollToElement(hash);
    }, 100);
  } else {
    // Small delay to allow menu to close
    setTimeout(() => {
      scrollToElement(hash);
    }, 150);
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
      behavior: 'smooth'
    });
  }
};
</script>

<style scoped>
.mobile-link {
  @apply block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary;
}

.mobile-accordion-button {
  @apply w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary;
}

@keyframes mobileMenuFade {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
