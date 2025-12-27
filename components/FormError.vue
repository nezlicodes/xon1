<template>
  <p :id="id" class="mt-1.5 text-xs text-red-500 flex items-center">
    <svg class="w-3 h-3 mr-1" viewBox="0 0 16 16" fill="currentColor">
      <path
        fill-rule="evenodd"
        d="M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 118 0a8 8 0 010 16z"
        clip-rule="evenodd"
        opacity="0.2"
      />
      <path d="M7.5 3h1v7h-1V3zm0 8h1v2h-1v-2z" />
    </svg>
    {{ message }}
  </p>
</template>
    
    <script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});
</script>
    
<style scoped>
/* Custom select styling with arrow */
select {
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* Focus styles with animations */
input:focus,
select:focus,
textarea:focus {
  animation: focusAnimation 0.3s forwards;
}

@keyframes focusAnimation {
  0% {
    background-color: rgba(255, 255, 255, 0.7);
  }
  100% {
    background-color: rgba(255, 255, 255, 1);
  }
}
</style>