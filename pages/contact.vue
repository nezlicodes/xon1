<template>
  <div class="min-h-screen pt-10">
    <!-- Contact Section -->
    <HomeContact :settings="siteSettings" />
  </div>
</template>

<script setup>
// SEO Meta tags
const { locale } = useI18n();
const siteSettings = useSiteSettings();

useHead({
  title: computed(() => {
    const contactTitle = siteSettings.value?.contact_title || 'Contact';
    const siteName = siteSettings.siteSettings.value?.siteName || '';
    return siteName ? `${contactTitle} - ${siteName}` : contactTitle;
  }),
  meta: [
    {
      name: 'description',
      content: computed(() => siteSettings.value?.contact_description || 'Contactez-nous pour toute question ou demande d\'information.'),
    },
    {
      property: 'og:title',
      content: computed(() => {
        const contactTitle = siteSettings.value?.contact_title || 'Contact';
        const siteName = siteSettings.siteSettings.value?.siteName || '';
        return siteName ? `${contactTitle} - ${siteName}` : contactTitle;
      }),
    },
    {
      property: 'og:description',
      content: computed(() => siteSettings.value?.contact_description || 'Contactez-nous pour toute question ou demande d\'information.'),
    },
    {
      property: 'og:type',
      content: 'website',
    },
  ],
});
</script>
