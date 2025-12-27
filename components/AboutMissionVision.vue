<template>
  <section class="py-20" :dir="(useI18n().locale.value === 'ar') ? 'rtl' : 'ltr'">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="grid lg:grid-cols-2 gap-12 animate-pulse">
        <div class="h-64"></div>
        <div class="h-64"></div>
      </div>

      <div v-else class="grid lg:grid-cols-2 gap-12">
        <!-- Mission -->
        <div class="group">
          <div class="flex items-start gap-6">
            <!-- Icon -->
            <div class="flex-shrink-0">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary shadow-lg shadow-primary-600/20 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-contrast2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 pt-2">
              <!-- Title -->
              <h3 class="text-3xl font-bold text-gray-900 mb-4">
                {{ mission?.title }}
              </h3>

              <!-- Content with HTML rendering -->
              <div 
                class="text-gray-600 leading-relaxed text-lg prose prose-lg"
                v-html="mission?.content"
              ></div>
            </div>
          </div>
        </div>

        <!-- Vision -->
        <div class="group">
          <div class="flex items-start gap-6">
            <!-- Icon -->
            <div class="flex-shrink-0">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary shadow-lg shadow-primary-600/20 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-contrast2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 pt-2">
              <!-- Title -->
              <h3 class="text-3xl font-bold text-gray-900 mb-4">
                {{ vision?.title }}
              </h3>

              <!-- Content with HTML rendering -->
              <div 
                class="text-gray-600 leading-relaxed text-lg prose prose-lg"
                v-html="vision?.content"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
  
<script setup>
defineProps({
  mission: Object,
  vision: Object,
  loading: Boolean,
});
</script>

<style>
.prose p {
  margin-top: 1em;
  margin-bottom: 1em;
}

.prose strong {
  font-weight: 600;
}

.prose em {
  font-style: italic;
}

.prose ul,
.prose ol {
  margin-top: 1em;
  margin-bottom: 1em;
  padding-left: 1.5em;
}

.prose li {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose blockquote {
  font-style: italic;
  border-left: 4px solid #e5e7eb;
  padding-left: 1em;
  margin: 1.5em 0;
}

.prose a {
  color: inherit;
  text-decoration: underline;
}
</style>
