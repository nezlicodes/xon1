<template>
  <div class="relative" ref="dropdown">
    <button
      @click="toggleDropdown"
      @mouseover="isHovered = true"
      @mouseleave="isHovered = false"
      class="group inline-flex items-center px-3 py-2 text-lg font-medium transition-all duration-200 border-b-2 border-transparent hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
      :class="{ 'font-semibold border-primary': isOpen }"
      :aria-expanded="isOpen"
      :aria-controls="`${id}-menu`"
    >
      <span>{{ title }}</span>
      <svg
        class="ml-2 h-4 w-4 transition-transform duration-300 ease-in-out"
        :class="{ 'rotate-180': isOpen || isHovered }"
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

    <div
      v-if="isOpen"
      :id="`${id}-menu`"
      class="absolute left-0 mt-2 w-64 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 origin-top-left"
      style="animation: dropdownFade 0.2s ease-out"
      role="menu"
    >
      <div class="py-1 bg-background rounded-md" role="none">
        <NuxtLink
          v-for="item in items"
          :key="item.id"
          :to="`${linkPrefix}${item.slug}`"
          class="block px-4 py-2 text-lg transition-all duration-200 hover:pl-6 focus:outline-none"
          role="menuitem"
          @click="close"
        >
          {{ item.name }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  linkPrefix: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close"]);
const dropdown = ref(null);
const isOpen = ref(false);
const isHovered = ref(false);
const id = ref(`dropdown-${Math.random().toString(36).substring(2, 9)}`);

// Toggle dropdown
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// Close dropdown
const close = () => {
  isOpen.value = false;
  emit("close");
};

// Handle clicks outside dropdown
onMounted(() => {
  document.addEventListener("click", (event) => {
    if (
      dropdown.value &&
      !dropdown.value.contains(event.target) &&
      isOpen.value
    ) {
      close();
    }
  });
});

onUnmounted(() => {
  document.removeEventListener("click", close);
});

// Expose methods to parent
defineExpose({
  close,
});
</script>