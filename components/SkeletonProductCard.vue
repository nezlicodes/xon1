<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
    <!-- Image Skeleton -->
    <div class="relative w-full h-56 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    
    <div class="p-4 space-y-3">
      <!-- Title -->
      <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
      
      <!-- Description -->
      <div class="space-y-2">
        <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-full"></div>
        <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-4/5"></div>
      </div>
      
      <!-- Price and Button -->
      <div class="flex items-center justify-between pt-2">
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
        <div class="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-28"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
