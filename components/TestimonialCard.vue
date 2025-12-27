<template>
    <div 
      class="testimonial-card group relative h-full"
    >
      <!-- Card Container with Glassmorphism -->
      <div 
        class="relative h-full bg-gradient-to-br from-backgroundColor/80 to-backgroundColor/40 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-foreground/10 hover:border-primary/30 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
      >
        <!-- Animated Gradient Background -->
        <div class="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <!-- Glow Effect -->
        <div class="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 -z-10"></div>
  
        <!-- Content -->
        <div class="relative z-10 h-full flex flex-col">
          <!-- Quote Icon -->
          <div class="mb-6 inline-flex">
            <div class="relative">
              <div class="absolute inset-0 bg-primary/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
              <div class="relative bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl p-4 group-hover:scale-110 transition-transform duration-500">
                <Icon 
                  name="ph:quotes-fill" 
                  class="w-8 h-8 text-primary"
                />
              </div>
            </div>
          </div>
  
          <!-- Rating Stars -->
          <div v-if="displayRating" class="flex items-center space-x-1 mb-6">
            <div
              v-for="i in 5"
              :key="`star-${i}`"
              class="relative"
            >
              <Icon
                name="ph:star-fill"
                class="w-5 h-5 transition-all duration-300"
                :class="
                  i <= testimonial.rating
                    ? 'text-primary drop-shadow-lg scale-100 group-hover:scale-110'
                    : 'text-foreground/10'
                "
                :style="{ transitionDelay: `${i * 30}ms` }"
              />
            </div>
            <span class="ml-2 text-sm font-bold text-foreground/60">{{ testimonial.rating }}.0</span>
          </div>
  
          <!-- Testimonial Content -->
          <blockquote class="flex-1 mb-8">
            <p class="text-lg md:text-xl leading-relaxed text-foreground/80 font-light group-hover:text-foreground transition-colors duration-500">
              "{{ testimonial.content }}"
            </p>
          </blockquote>
  
          <!-- Author Section -->
          <div class="flex items-center space-x-4 pt-6 border-t border-foreground/10">
            <!-- Avatar -->
            <div class="relative flex-shrink-0">
              <div class="absolute inset-0 bg-primary/30 rounded-full blur-md group-hover:blur-lg transition-all duration-500"></div>
              <div 
                class="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center ring-2 ring-primary/30 group-hover:ring-primary/50 group-hover:scale-110 transition-all duration-500"
              >
                <Icon 
                  name="ph:user-fill" 
                  class="w-7 h-7 text-primary"
                />
              </div>
            </div>
  
            <!-- Author Info -->
            <div class="flex-1 min-w-0">
              <h4 class="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 truncate">
                {{ testimonial.customer_name }}
              </h4>
              <p 
                v-if="testimonial.author_title" 
                class="text-sm text-foreground/60 font-medium mt-0.5 truncate"
              >
                {{ testimonial.author_title }}
              </p>
            </div>
  
            <!-- Verified Badge (optional) -->
            <div 
              v-if="testimonial.is_featured"
              class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              title="Client vérifié"
            >
              <Icon 
                name="ph:check-circle-fill" 
                class="w-5 h-5 text-primary"
              />
            </div>
          </div>
        </div>
  
        <!-- Corner Decoration -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:translate-x-12 group-hover:-translate-y-12 transition-transform duration-700"></div>
        <div class="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl translate-y-16 -translate-x-16 group-hover:-translate-x-12 group-hover:translate-y-12 transition-transform duration-700"></div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    testimonial: {
      type: Object,
      required: true,
    },
    displayRating: {
      type: Boolean,
      default: true,
    },
  });
  </script>
  
  <style scoped>
  .testimonial-card {
    /* Ensure smooth GPU acceleration */
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
  
  /* Smooth hover lift effect */
  .testimonial-card:hover {
    transform: translateY(-8px) translateZ(0);
  }
  
  /* Prevent text selection during animations */
  .testimonial-card * {
    user-select: text;
  }
  </style>