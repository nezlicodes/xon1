<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
    <!-- Image Skeleton -->
    <div class="relative h-44 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>

    <!-- Content -->
    <div class="p-5 space-y-3">
      <!-- Title -->
      <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
      
      <!-- Description -->
      <div class="space-y-2">
        <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-full"></div>
        <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-3/4"></div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-2">
        <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-24"></div>
        <div class="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
