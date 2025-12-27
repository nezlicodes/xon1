<template>
  <section class="py-20 md:px-20 bg-primary text-contrast1 " :dir="(useI18n().locale.value === 'ar') ? 'rtl' : 'ltr'">
    <div class=" px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="animate-pulse">
        <div class="h-12 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div class="h-6 bg-gray-200 rounded w-full mb-4"></div>
        <div class="h-6 bg-gray-200 rounded w-5/6"></div>
      </div>

      <div v-else>
        <!-- Title -->
        <h2 class="text-4xl font-bold mb-8 text-center">
          {{ section?.title }}
        </h2>

        <!-- Content with HTML rendering -->
        <div
          class="text-lg leading-relaxed w-full mb-16"
          v-html="section?.content"
        ></div>
      </div>
    </div>
  </section>
</template>
  
<script setup>
const props = defineProps({
  section: Object,
  loading: Boolean,
});
</script>

<style>
/* Prose styles for rich text content */
.prose {
  max-width: 65ch;
}

.prose p {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4 {
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  font-weight: bold;
}

.prose ul,
.prose ol {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  padding-left: 1.625em;
}

.prose li {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose strong {
  font-weight: 600;
}

.prose em {
  font-style: italic;
}

.prose blockquote {
  font-style: italic;
  border-left: 4px solid currentColor;
  padding-left: 1em;
  margin: 1.5em 0;
}

.prose code {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.2em 0.4em;
  border-radius: 0.25em;
  font-size: 0.875em;
}

.prose a {
  color: inherit;
  text-decoration: underline;
}

.prose a:hover {
  opacity: 0.8;
}
</style>