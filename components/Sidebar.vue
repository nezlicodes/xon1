<template>
  <div>
    <!-- Desktop Sidebar -->
    <aside
      dir="ltr"
      class="fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 shadow-xl transition-all duration-300 hidden sm:block"
      :class="[isExpanded ? 'w-64' : 'w-20']"
    >
      <div class="flex flex-col h-full">
        <!-- Logo and Toggle -->
        <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-gradient-to-r from-primary to-primary/90">
          <NuxtLink to="/admin" class="flex items-center home">
            <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary font-bold">
              <span v-if="isExpanded">C5</span>
              <span v-else>A</span>
            </div>
            <span v-if="isExpanded" class="ml-3 font-bold text-white text-lg">CinqCinq</span>
          </NuxtLink>

          <button
            @click="toggleSidebar"
            class="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-300 text-white"
            aria-label="Toggle sidebar"
          >
            <Icon
              :name="isExpanded ? 'ph:caret-left-bold' : 'ph:caret-right-bold'"
              class="w-5 h-5"
            />
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-4 px-2">
          <div class="space-y-1">
            <!-- Ma boutique with submenu -->
            <div v-if="user && user.email">
              <button
                @click="toggleBoutiqueSubmenu"
                class="nav-button w-full flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-300 group"
                :class="{ 'justify-center': !isExpanded }"
              >
                <Icon name="ph:storefront-bold" class="w-5 h-5" />
                <span v-if="isExpanded" class="ml-3 flex-1 text-left font-medium">Ma boutique</span>
                <Icon
                  v-if="isExpanded"
                  :name="isBoutiqueSubmenuOpen ? 'ph:caret-down-bold' : 'ph:caret-right-bold'"
                  class="w-4 h-4 transition-transform duration-300"
                />
              </button>

              <!-- Boutique Submenu -->
              <Transition
                name="submenu"
                @before-enter="beforeSubmenuEnter"
                @enter="enterSubmenu"
                @leave="leaveSubmenu"
              >
                <div v-if="isExpanded && isBoutiqueSubmenuOpen" class="ml-4 mt-1 space-y-1 pl-4 border-l-2 border-gray-200">
                  <NuxtLink
                    to="/admin"
                    class="submenu-link flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-primary/10 hover:text-primary transition-all duration-300 text-sm"
                  >
                    <Icon name="ph:house-bold" class="w-4 h-4" />
                    <span class="ml-3">Accueil</span>
                  </NuxtLink>

                  <NuxtLink
                    to="/admin/website/general"
                    class="submenu-link flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-primary/10 hover:text-primary transition-all duration-300 text-sm"
                  >
                    <Icon name="ph:gear-bold" class="w-4 h-4" />
                    <span class="ml-3">Général</span>
                  </NuxtLink>

                  <NuxtLink
                    to="/admin/website/colors"
                    class="submenu-link flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-primary/10 hover:text-primary transition-all duration-300 text-sm"
                  >
                    <Icon name="ph:palette-bold" class="w-4 h-4" />
                    <span class="ml-3">Couleurs</span>
                  </NuxtLink>

                  <NuxtLink
                    to="/admin/website/edit-about"
                    class="submenu-link flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-primary/10 hover:text-primary transition-all duration-300 text-sm"
                  >
                    <Icon name="ph:info-bold" class="w-4 h-4" />
                    <span class="ml-3">À propos</span>
                  </NuxtLink>
                  <NuxtLink
                    to="/admin/technologies"
                    class="submenu-link flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-primary/10 hover:text-primary transition-all duration-300 text-sm"
                  >
                    <Icon name="ph:info-bold" class="w-4 h-4" />
                    <span class="ml-3">Technologies</span>
                  </NuxtLink>
                </div>
              </Transition>
            </div>

            <!-- Orders with submenu and badge -->
            <div>
              <button
                @click="toggleOrdersSubmenu"
                class="nav-button w-full flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-300 group relative"
                :class="{ 'justify-center': !isExpanded }"
              >
                <Icon name="ph:shopping-cart-bold" class="w-5 h-5" />
                <span v-if="isExpanded" class="ml-3 flex-1 text-left font-medium">Commandes</span>
                
                <!-- Notification Badge -->
                <span
                  v-if="pendingOrdersCount > 0"
                  class="absolute flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full"
                  :class="isExpanded ? 'right-8' : 'top-1 right-1'"
                >
                  {{ pendingOrdersCount > 99 ? '99+' : pendingOrdersCount }}
                </span>
                
                <Icon
                  v-if="isExpanded"
                  :name="isOrdersSubmenuOpen ? 'ph:caret-down-bold' : 'ph:caret-right-bold'"
                  class="w-4 h-4 transition-transform duration-300"
                />
              </button>

              <!-- Orders Submenu -->
              <Transition
                name="submenu"
                @before-enter="beforeSubmenuEnter"
                @enter="enterSubmenu"
                @leave="leaveSubmenu"
              >
                <div v-if="isExpanded && isOrdersSubmenuOpen" class="ml-4 mt-1 space-y-1 pl-4 border-l-2 border-gray-200">
                  <NuxtLink
                    to="/admin/orders"
                    class="submenu-link flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-primary/10 hover:text-primary transition-all duration-300 text-sm relative"
                  >
                    <Icon name="ph:list-bold" class="w-4 h-4" />
                    <span class="ml-3">Commandes</span>
                    <!-- Badge in submenu -->
                    <span
                      v-if="pendingOrdersCount > 0"
                      class="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full"
                    >
                      {{ pendingOrdersCount > 99 ? '99+' : pendingOrdersCount }}
                    </span>
                  </NuxtLink>

                  <NuxtLink
                    to="/admin/orders/settings"
                    class="submenu-link flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-primary/10 hover:text-primary transition-all duration-300 text-sm"
                  >
                    <Icon name="ph:gear-bold" class="w-4 h-4" />
                    <span class="ml-3">Paramètres</span>
                  </NuxtLink>
                </div>
              </Transition>
            </div>

            <!-- Other Menu Items -->
            <NuxtLink
              to="/admin/products"
              class="nav-button flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-300"
              :class="{ 'justify-center': !isExpanded }"
            >
              <Icon name="ph:tag-bold" class="w-5 h-5" />
              <span v-if="isExpanded" class="ml-3 font-medium">Produits</span>
            </NuxtLink>


            <NuxtLink
              to="/admin/categories"
              class="nav-button flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-300"
              :class="{ 'justify-center': !isExpanded }"
            >
              <Icon name="ph:folder-bold" class="w-5 h-5" />
              <span v-if="isExpanded" class="ml-3 font-medium">Catégories</span>
            </NuxtLink>

            <NuxtLink
              to="/admin/gallery"
              class="nav-button flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-300"
              :class="{ 'justify-center': !isExpanded }"
            >
              <Icon name="ph:images-bold" class="w-5 h-5" />
              <span v-if="isExpanded" class="ml-3 font-medium">Galerie</span>
            </NuxtLink>


            <NuxtLink
              to="/admin/policies"
              class="nav-button flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-300"
              :class="{ 'justify-center': !isExpanded }"
            >
              <Icon name="ph:file-text-bold" class="w-5 h-5" />
              <span v-if="isExpanded" class="ml-3 font-medium">Politiques</span>
            </NuxtLink>

            <NuxtLink
              to="/admin/faq"
              class="nav-button flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-300"
              :class="{ 'justify-center': !isExpanded }"
            >
              <Icon name="ph:question-bold" class="w-5 h-5" />
              <span v-if="isExpanded" class="ml-3 font-medium">FAQ</span>
            </NuxtLink>

            <NuxtLink
              to="/admin/testimonials"
              class="nav-button flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-300"
              :class="{ 'justify-center': !isExpanded }"
            >
              <Icon name="ph:chat-circle-dots-bold" class="w-5 h-5" />
              <span v-if="isExpanded" class="ml-3 font-medium">Témoignages</span>
            </NuxtLink>

            <NuxtLink
              to="/admin/contact"
              class="nav-button flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-300 relative"
              :class="{ 'justify-center': !isExpanded }"
            >
              <Icon name="ph:envelope-bold" class="w-5 h-5" />
              <span v-if="isExpanded" class="ml-3 font-medium">Messages</span>
              <!-- Notification Badge -->
              <span
                v-if="newMessagesCount > 0"
                class="absolute flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full"
                :class="isExpanded ? 'right-3' : 'top-1 right-1'"
              >
                {{ newMessagesCount > 99 ? '99+' : newMessagesCount }}
              </span>
            </NuxtLink>

            <NuxtLink
              to="/admin/support"
              class="nav-button flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-300"
              :class="{ 'justify-center': !isExpanded }"
            >
              <Icon name="ph:lifebuoy-bold" class="w-5 h-5" />
              <span v-if="isExpanded" class="ml-3 font-medium">Aide</span>
            </NuxtLink>

            <NuxtLink
              to="/"
              target="_blank"
              class="nav-button flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-300"
              :class="{ 'justify-center': !isExpanded }"
            >
              <Icon name="ph:eye-bold" class="w-5 h-5" />
              <span v-if="isExpanded" class="ml-3 font-medium">Ma boutique</span>
            </NuxtLink>
          </div>
        </nav>

        <!-- User Section -->
        <div v-if="user" class="border-t border-gray-200 p-4">
          <div v-if="isExpanded" class="space-y-3">
            <div class="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
              <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                {{ user.email.charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm text-gray-700 truncate flex-1">{{ user.email }}</span>
            </div>
            <button
              @click="handleSignOut"
              class="w-full px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Icon name="ph:sign-out-bold" class="w-4 h-4" />
              Déconnexion
            </button>
          </div>
          <div v-else class="flex justify-center">
            <button
              @click="handleSignOut"
              class="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
              title="Déconnexion"
            >
              <Icon name="ph:sign-out-bold" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Mobile Navbar -->
    <AdminNavbar class="sm:hidden" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useSupabaseClient, useSupabaseUser } from "#imports";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const isExpanded = ref(true);
const isBoutiqueSubmenuOpen = ref(true);
const isOrdersSubmenuOpen = ref(true);
const pendingOrdersCount = ref(0);
const newMessagesCount = ref(0);

const emit = defineEmits(["sidebar-state"]);

// Get pending orders count
const { getPendingOrdersCount } = useOrders();

const loadPendingOrdersCount = async () => {
  pendingOrdersCount.value = await getPendingOrdersCount();
};

// Get new messages count
const loadNewMessagesCount = async () => {
  try {
    const { count, error } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');
    
    if (error) throw error;
    newMessagesCount.value = count || 0;
  } catch (error) {
    console.error('Error fetching new messages count:', error);
  }
};

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
  if (!isExpanded.value) {
    isBoutiqueSubmenuOpen.value = false;
    isOrdersSubmenuOpen.value = false;
  }
  emit("sidebar-state", isExpanded.value);
};

const toggleBoutiqueSubmenu = () => {
  if (isExpanded.value) {
    isBoutiqueSubmenuOpen.value = !isBoutiqueSubmenuOpen.value;
  } else {
    isExpanded.value = true;
    isBoutiqueSubmenuOpen.value = true;
    emit("sidebar-state", isExpanded.value);
  }
};

const toggleOrdersSubmenu = () => {
  if (isExpanded.value) {
    isOrdersSubmenuOpen.value = !isOrdersSubmenuOpen.value;
  } else {
    isExpanded.value = true;
    isOrdersSubmenuOpen.value = true;
    emit("sidebar-state", isExpanded.value);
  }
};

// Submenu animation hooks
const beforeSubmenuEnter = (el) => {
  el.style.opacity = '0';
  el.style.maxHeight = '0';
};

const enterSubmenu = (el, done) => {
  el.offsetHeight;
  el.style.transition = 'opacity 0.3s ease, max-height 0.3s ease';
  el.style.opacity = '1';
  el.style.maxHeight = el.scrollHeight + 'px';
  done();
};

const leaveSubmenu = (el, done) => {
  el.style.transition = 'opacity 0.3s ease, max-height 0.3s ease';
  el.style.opacity = '0';
  el.style.maxHeight = '0';
  done();
};

watch(isExpanded, (newValue) => {
  emit("sidebar-state", newValue);
});

const handleSignOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return navigateTo("/");
  } catch (error) {
    console.error("Error signing out:", error.message);
  }
};

onMounted(() => {
  emit("sidebar-state", isExpanded.value);
  loadPendingOrdersCount();
  loadNewMessagesCount();
  
  // Refresh counts every 30 seconds
  setInterval(() => {
    loadPendingOrdersCount();
    loadNewMessagesCount();
  }, 30000);
});
</script>

<style scoped>
/* Active link styling */
.router-link-active.router-link-exact-active:not(.home) {
  @apply bg-primary text-white font-semibold shadow-lg;
}

.router-link-active.router-link-exact-active:not(.home) .submenu-link {
  @apply bg-primary/20 text-primary font-semibold;
}

/* Hover effects */
.nav-button:hover {
  transform: translateX(2px);
}

.submenu-link:hover {
  transform: translateX(2px);
}

/* Submenu transitions */
.submenu-enter-active,
.submenu-leave-active {
  overflow: hidden;
}
</style>
