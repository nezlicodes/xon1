<template>
  <div class="p-3 sm:p-6">
    <div class="max-w-6xl mx-auto flex justify-between items-center mb-8">
      <h1 class="text-xl md:text-2xl font-medium text-gray-900">Bienvenue</h1>
      <NuxtLink
        to="/"
        class="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path
            fill-rule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clip-rule="evenodd"
          />
        </svg>
        Visualiser votre boutique
      </NuxtLink>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto">
      <!-- Card -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <!-- Theme Preview -->
        <div class="p-6">
          <div class="flex flex-col lg:flex-row gap-6">
            <!-- Desktop Preview -->
            <div
              class="flex-1 border border-gray-200 rounded-lg overflow-hidden shadow-sm"
            >
              <NuxtImg
                src="/images/preview.png"
                alt="Desktop Theme Preview"
                class="w-full h-auto"
              />
            </div>
          </div>
        </div>

        <!-- Theme Info -->
        <div class="p-6 border-t border-gray-200">
          <div class="flex justify-between items-center">
            <!-- Theme Thumbnail -->
            <div class="mr-4 flex-shrink-0">
              <!-- Color Options -->
            </div>

            <!-- Actions -->
            <div class="flex items-center">
              <NuxtLink
                to="/admin/website/edit"
                class="px-4 py-2 bg-blue-800 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Customiser
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No additional script needed for this static UI
</script>
