<!-- AdminNavbar.vue -->
<template>
  <div>
    <!-- Fixed header navigation bar - Updated to match sidebar gray colors -->
    <nav
      class="fixed top-0 left-0 right-0 bg-gray-200 py-3 px-4 z-50 shadow-lg border-b-2 border-gray-700"
    >
      <div class="flex items-center justify-between">
        <!-- Logo with same styling as sidebar -->
        <NuxtLink to="/admin" class="home flex items-center">
          <span class="font-medium text-gray-700 text-xl">CinqCinq</span>
        </NuxtLink>

        <!-- Mobile menu button with updated styling -->
        <button
          @click="toggleMenu"
          class="p-2 bg-blue-600 text-sm rounded-md hover:bg-blue-400 transition-all duration-150 ease-in text-white"
          aria-label="Toggle menu"
        >
          <Icon v-if="isMenuOpen" name="heroicons-outline:x" class="w-5 h-5" />
          <Icon v-else name="heroicons-outline:menu" class="w-5 h-5" />
        </button>
      </div>
    </nav>

    <!-- Menu overlay for backdrop effect -->
    <div
      v-if="isMenuOpen"
      class="fixed inset-0 bg-gray-700 bg-opacity-50 z-40 transition-opacity duration-300"
      @click="isMenuOpen = false"
    ></div>

    <!-- Dropdown menu with updated styling to match sidebar -->
    <div
      class="fixed top-16 left-0 right-0 bg-gray-200 shadow-lg z-40 transform transition-all duration-300 overflow-hidden"
      :class="
        isMenuOpen
          ? 'translate-y-0 opacity-100 max-h-screen'
          : '-translate-y-full opacity-0 max-h-0'
      "
    >
      <div class="p-4 space-y-2">
        <!-- Ma boutique with submenu - Matching sidebar structure -->
        <div v-if="user && user.email">
          <NuxtLink
            to="/admin"
            class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-200 hover:bg-blue-400 transition-all duration-150 ease-in"
            @click="closeMenu"
          >
            <Icon name="heroicons-outline:cog" />
            <span class="ml-3 text-sm">Paramètres</span>
          </NuxtLink>
          <button
            @click="toggleBoutiqueSubmenu"
            class="w-full flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-200 hover:bg-blue-400 transition-all duration-150 ease-in"
          >
            <Icon name="heroicons-outline:shopping-cart" />
            <span class="text-sm ml-3 flex-1 text-left">Ma boutique</span>
            <Icon
              :name="
                isBoutiqueSubmenuOpen
                  ? 'heroicons-outline:chevron-down'
                  : 'heroicons-outline:chevron-right'
              "
              class="w-4 h-4"
            />
          </button>
          <!-- Boutique Submenu -->
          <div v-if="isBoutiqueSubmenuOpen" class="ml-6 mt-1 space-y-1">
            <NuxtLink
              to="/admin/website"
              class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-200 hover:bg-blue-400 transition-all duration-150 ease-in"
              @click="closeMenu"
            >
              <Icon name="heroicons-outline:home" class="w-4 h-4" />
              <span class="ml-3 text-sm">Accueil</span>
            </NuxtLink>

            <NuxtLink
              to="/admin/website/settings"
              class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-200 hover:bg-blue-400 transition-all duration-150 ease-in"
              @click="closeMenu"
            >
              <Icon name="heroicons-outline:cog" class="h-4 w-4" />
              <span class="ml-3 text-sm">Général</span>
            </NuxtLink>

            <NuxtLink
              to="/admin/website/policies"
              class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-200 hover:bg-blue-400 transition-all duration-150 ease-in"
              @click="closeMenu"
            >
              <Icon name="heroicons-outline:star" class="w-4 h-4" />
              <span
                class="ml-3 text-sm text-nowrap overflow-hidden text-ellipsis"
                >Politique de livraison et de retour</span
              >
            </NuxtLink>
          </div>
        </div>

        <NuxtLink
          to="/admin/policies"
          class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-200 hover:bg-blue-400 transition-all duration-150 ease-in"
          @click="closeMenu"
        >
          <Icon name="heroicons-outline:document-text" />
          <span class="ml-3 text-sm">Politiques</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/products"
          class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-200 hover:bg-blue-400 transition-all duration-150 ease-in"
          @click="closeMenu"
        >
          <Icon name="heroicons-outline:tag" />
          <span class="ml-3 text-sm">Produits</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/categories"
          class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-200 hover:bg-blue-400 transition-all duration-150 ease-in"
          @click="closeMenu"
        >
          <Icon name="heroicons-outline:folder" />
          <span class="ml-3 text-sm">Catégories</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/collections"
          class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-200 hover:bg-blue-400 transition-all duration-150 ease-in"
          @click="closeMenu"
        >
          <Icon name="heroicons-outline:circle-stack" />
          <span class="ml-3 text-sm">Collections</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/testimonials"
          class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-200 hover:bg-blue-400 transition-all duration-150 ease-in"
          @click="closeMenu"
        >
          <Icon name="heroicons-outline:chat-bubble-left-right" />
          <span class="ml-3 text-sm">Témoignages</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/faq"
          class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-200 hover:bg-blue-400 transition-all duration-150 ease-in"
          @click="closeMenu"
        >
          <Icon name="heroicons-outline:question-mark-circle" />
          <span class="ml-3 text-sm">FAQ</span>
        </NuxtLink>
        <NuxtLink
          to="/"
          target="_blank"
          class="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-gray-200 hover:bg-blue-400 transition-all duration-150 ease-in"
          @click="closeMenu"
        >
          <Icon name="heroicons-outline:eye" />
          <span class="ml-3 text-sm">Ma boutique</span>
        </NuxtLink>

        <!-- User section with sign out button -->
        <div v-if="user" class="pt-2 border-t border-gray-700 mt-2">
          <div class="px-3 py-2">
            <span class="text-sm text-gray-700 truncate">{{ user.email }}</span>
          </div>
          <button
            @click="handleSignOut"
            class="w-full px-3 py-2 mt-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-all duration-150 ease-in"
          >
            <div class="flex items-center justify-center">
              <Icon name="heroicons-outline:logout" class="mr-2" />
              <span>Déconnexion</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Spacer div to prevent content from hiding behind the navbar -->
    <div class="h-12"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useSupabaseClient, useSupabaseUser } from "#imports";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const isMenuOpen = ref(false);
const isBoutiqueSubmenuOpen = ref(true);

// Toggle menu and handle body scroll locking
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;

  // Lock/unlock body scroll when menu is open/closed
  if (isMenuOpen.value) {
    document.body.classList.add("overflow-hidden");
  } else {
    document.body.classList.remove("overflow-hidden");
  }
};

// Toggle Ma boutique submenu
const toggleBoutiqueSubmenu = () => {
  isBoutiqueSubmenuOpen.value = !isBoutiqueSubmenuOpen.value;
};

// Close menu on route change
const closeMenu = () => {
  if (isMenuOpen.value) {
    isMenuOpen.value = false;
    document.body.classList.remove("overflow-hidden");
  }
};

// Sign out handler
const handleSignOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Close menu
    closeMenu();

    // Redirect to home page
    return navigateTo("/");
  } catch (error) {
    console.error("Error signing out:", error.message);
  }
};

// Close menu when pressing escape key
const handleEscKey = (event) => {
  if (event.key === "Escape" && isMenuOpen.value) {
    closeMenu();
  }
};

// Lifecycle hooks
onMounted(() => {
  window.addEventListener("keydown", handleEscKey);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleEscKey);
  document.body.classList.remove("overflow-hidden");
});
</script>

<style lang="pcss" scoped>
.router-link-active.router-link-exact-active:not(.home) {
  @apply font-medium bg-blue-700 text-white;
}

a {
  @apply text-sm;
}
</style>