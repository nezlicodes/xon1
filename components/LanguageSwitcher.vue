<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
      :class="{ 'flex-row-reverse': isRtl }"
    >
      <Icon name="mdi:translate" class="w-5 h-5" />
      <span class="text-sm font-medium">{{ currentLocaleName }}</span>
      <Icon
        name="mdi:chevron-down"
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50"
        :class="isRtl ? 'left-0' : 'right-0'"
      >
        <div class="py-1" role="menu">
          <button
            v-for="locale in availableLocales"
            :key="locale.code"
            @click="switchLocale(locale.code)"
            class="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
            :class="[
              currentLocale === locale.code
                ? 'bg-primary-50 text-primary-600 font-medium'
                : 'text-gray-700',
              locale.dir === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'
            ]"
            role="menuitem"
          >
            <span class="flex-1" :class="locale.dir === 'rtl' ? 'text-right' : 'text-left'">
              {{ locale.name }}
            </span>
            <Icon
              v-if="currentLocale === locale.code"
              name="mdi:check"
              class="w-5 h-5 text-primary-600"
            />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n();
const dropdownRef = ref(null);
const isOpen = ref(false);

const currentLocale = computed(() => locale.value);
const isRtl = computed(() => locale.value === 'ar');

const availableLocales = computed(() => {
  return locales.value.filter((l: any) => l.code !== locale.value);
});

const currentLocaleName = computed(() => {
  const current = locales.value.find((l: any) => l.code === locale.value);
  return current?.name || '';
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const switchLocale = async (localeCode: string) => {
  await setLocale(localeCode);
  isOpen.value = false;
  
  // Force page reload to apply RTL/LTR changes
  if (process.client) {
    window.location.reload();
  }
};

// Close dropdown when clicking outside
onMounted(() => {
  if (process.client) {
    document.addEventListener('click', handleClickOutside);
  }
});

onUnmounted(() => {
  if (process.client) {
    document.removeEventListener('click', handleClickOutside);
  }
});

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};
</script>