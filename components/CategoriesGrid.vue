<template>
  <div>
    <!-- Loading State with Refined Skeletons -->
    <div v-if="loading" class="loading-grid">
      <div
        v-for="n in skeletonCount"
        :key="`skeleton-${n}`"
        class="skeleton-card"
      >
        <div class="skeleton-image">
          <div class="skeleton-shimmer"></div>
        </div>
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-subtitle"></div>
        </div>
      </div>
    </div>

    <!-- Categories Grid -->
    <div v-else class="regular-grid">
      <NuxtLink
        v-for="category in categories"
        :key="category.id"
        :to="`/categories/${category.slug}`"
        class="category-card"
      >
        <div class="category-image-wrapper">
          <div class="category-image-container">
            <NuxtImg
              v-if="category.image_url || category.image"
              :src="category.image_url || category.image"
              :alt="category.name"
              class="category-image"
              loading="lazy"
            />
            <div v-else class="category-placeholder">
              <Icon name="ph:shopping-bag" class="placeholder-icon" />
            </div>
          </div>

          <!-- Elegant overlay -->
          <div class="category-overlay">
            <div class="overlay-content">
              <Icon name="ph:arrow-right" class="overlay-arrow" />
            </div>
          </div>
        </div>

        <div class="category-info">
          <h3 class="category-name">{{ category.name }}</h3>
          <p v-if="category.product_count" class="category-count">
            {{ category.product_count }}
            {{ category.product_count > 1 ? "produits" : "produit" }}
          </p>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && categories.length === 0" class="empty-state">
      <div class="empty-icon-wrapper">
        <Icon name="ph:shopping-bag" class="empty-icon" />
      </div>
      <h3 class="empty-title">Collection à venir</h3>
      <p class="empty-subtitle">
        Notre équipe prépare une sélection exceptionnelle
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  categories: any[]
  loading?: boolean
  skeletonCount?: number
}>()

defineEmits<{
  (e: 'category-click', category: any): void
}>()
</script>

<style scoped>
/* ============================================
   REFINED LOADING STATE
   ============================================ */

.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: clamp(1.5rem, 3vw, 2.5rem);
}

.skeleton-card {
  opacity: 1;
}

.skeleton-image {
  position: relative;
  aspect-ratio: 3/4;
  background: linear-gradient(
    135deg,
    rgba(243, 244, 246, 1) 0%,
    rgba(249, 250, 251, 1) 100%
  );
  border-radius: 1.125rem;
  overflow: hidden;
}

.skeleton-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.6) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite ease-in-out;
}

.skeleton-content {
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0 0.5rem;
  text-align: center;
}

.skeleton-title {
  height: 1.25rem;
  width: 70%;
  margin: 0 auto;
  background: rgba(243, 244, 246, 1);
  border-radius: 0.5rem;
}

.skeleton-subtitle {
  height: 1rem;
  width: 40%;
  margin: 0 auto;
  background: rgba(243, 244, 246, 1);
  border-radius: 0.5rem;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* ============================================
   REGULAR CATEGORIES - REFINED GRID
   ============================================ */

.regular-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: clamp(1.5rem, 3vw, 2.5rem);
}

.category-card {
  text-decoration: none;
  display: block;
  opacity: 1;
  transform: translateY(0);
}

.category-image-wrapper {
  position: relative;
  margin-bottom: 1.25rem;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.category-card:hover .category-image-wrapper {
  transform: translateY(-10px);
}

.category-image-container {
  position: relative;
  aspect-ratio: 3/4;
  border-radius: 1.125rem;
  overflow: hidden;
  background: rgba(249, 250, 251, 1);
  border: 1px solid rgba(229, 231, 235, 0.6);
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.category-card:hover .category-image {
  transform: scale(1.1);
}

.category-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: rgba(249, 250, 251, 1);
}

.placeholder-icon {
  width: 3rem;
  height: 3rem;
  color: rgba(209, 213, 219, 1);
}

.category-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.3) 40%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1.125rem;
}

.category-card:hover .category-overlay {
  opacity: 1;
}

.overlay-content {
  width: 3.5rem;
  height: 3.5rem;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(0) rotate(-180deg);
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.category-card:hover .overlay-content {
  transform: scale(1) rotate(0deg);
}

.overlay-arrow {
  width: 1.5rem;
  height: 1.5rem;
  color: rgba(17, 24, 39, 1);
  transition: transform 0.3s ease;
}

.category-card:hover .overlay-arrow {
  transform: translateX(4px);
}

.category-info {
  text-align: center;
  padding: 0 0.5rem;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-card:hover .category-info {
  transform: translateY(-4px);
}

.category-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: rgba(17, 24, 39, 1);
  letter-spacing: -0.01em;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.category-card:hover .category-name {
  color: rgba(75, 85, 99, 1);
}

.category-count {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(107, 114, 128, 1);
}

/* ============================================
   EMPTY STATE
   ============================================ */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  padding: 3rem 1.5rem;
}

.empty-icon-wrapper {
  width: 5rem;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(249, 250, 251, 1);
  border-radius: 50%;
  border: 1px solid rgba(229, 231, 235, 1);
  margin-bottom: 1.5rem;
}

.empty-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: rgba(156, 163, 175, 1);
}

.empty-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: rgba(17, 24, 39, 1);
  letter-spacing: -0.03em;
  margin-bottom: 0.75rem;
}

.empty-subtitle {
  font-size: 1.0625rem;
  color: rgba(107, 114, 128, 1);
  line-height: 1.6;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */

@media (max-width: 768px) {
  .regular-grid,
  .loading-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

@media (max-width: 480px) {
  .regular-grid {
    gap: 1rem;
  }
}

/* ============================================
   ACCESSIBILITY
   ============================================ */

/* Focus states for keyboard navigation */
.category-card:focus-visible {
  outline: 2px solid rgba(59, 130, 246, 1);
  outline-offset: 4px;
  border-radius: 1.125rem;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .category-image-container {
    border-width: 2px;
    border-color: currentColor;
  }
}
</style>