<template>
  <div>
    <!-- Critical above-the-fold content - loaded immediately -->
    <HomeHero />
    <FeaturedCategories />

    <!-- Non-critical content - lazy loaded with intersection observer -->
    <DeferredLoad min-height="400px" root-margin="200px">
      <AboutUs />
    </DeferredLoad>

    <DeferredLoad min-height="300px" root-margin="200px">
      <FAQ v-if="featureConfig.faqEnabled" />
    </DeferredLoad>

    <DeferredLoad min-height="400px" root-margin="200px">
      <Testimonials v-if="featureConfig.testimonialsEnabled" />
    </DeferredLoad>

    <DeferredLoad min-height="500px" root-margin="200px">
      <HomeContact :settings="siteSettings" />
    </DeferredLoad>
  </div>
</template>

<script setup>
import FeaturedCategories from "~/components/featuredCategories.vue";

// Use optimized homepage data composable
const { featureConfig, fetchHomepageData } = useHomepageData();

// Fetch all homepage data in parallel
fetchHomepageData();

// SEO
const { siteSettings } = useSiteSettings();

useHead(() => ({
  title: siteSettings.value.siteName || "Xone Algeria",
  meta: [
    {
      name: "description",
      content:
        siteSettings.value.defaultMetaDescription ||
        "E-commerce platform in Algeria",
    },
  ],
}));
</script>