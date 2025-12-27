<template>
  <footer
    v-if="sectionData.is_active"
    class="relative bg-gradient-to-b from-primary via-primary-900 to-primary-900 text-contrast1 overflow-hidden"
    aria-labelledby="footer-heading"
  >
    <!-- Decorative background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-0 right-0 w-96 h-96 bg-primary-400/5 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/5 rounded-full blur-3xl"
      ></div>
    </div>

    <div
      class="relative mx-auto max-w-7xl px-6 py-12 lg:py-16 lg:px-8"
      aria-live="polite"
    >
      <!-- Main Footer Content -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12"
      >
        <!-- Company Info -->
        <div class="space-y-6 lg:col-span-1">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink
              to="/"
              class="focus:outline-none focus:ring-2 focus:ring-primary-300 rounded-lg"
            >
              <NuxtImg
                v-if="siteSettings?.siteLogo"
                :src="siteSettings?.siteLogo"
                :alt="siteSettings?.siteName"
                class="h-12 w-auto drop-shadow-lg hover:scale-105 transition-transform duration-300"
              />
              <span v-else class="text-2xl font-bold text-contrast1">
                {{ siteSettings?.siteName || "Xone Algeria" }}
              </span>
            </NuxtLink>
          </div>

          <!-- About Text -->
          <p class="text-base leading-relaxed text-contrast1/90 max-w-sm">
            {{ currentContent.about_text || defaultContent.about_text }}
          </p>

          <!-- Social Links -->
          <div v-if="currentContent.show_socials" class="flex space-x-3">
            <a
              v-if="siteSettings?.socialLinks?.facebook"
              :href="siteSettings.socialLinks.facebook"
              class="group relative"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <div
                class="h-11 w-11 rounded-full bg-contrast1/10 backdrop-blur-sm border border-contrast1/20 flex items-center justify-center group-hover:bg-contrast1/20 group-hover:border-contrast1/30 group-hover:scale-110 transition-all duration-300 shadow-lg"
              >
                <svg
                  class="h-5 w-5 text-contrast1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  />
                </svg>
              </div>
            </a>

            <a
              v-if="siteSettings?.socialLinks?.instagram"
              :href="siteSettings.socialLinks.instagram"
              class="group relative"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <div
                class="h-11 w-11 rounded-full bg-contrast1/10 backdrop-blur-sm border border-contrast1/20 flex items-center justify-center group-hover:bg-contrast1/20 group-hover:border-contrast1/30 group-hover:scale-110 transition-all duration-300 shadow-lg"
              >
                <svg
                  class="h-5 w-5 text-contrast1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  />
                </svg>
              </div>
            </a>

            <a
              v-if="siteSettings?.socialLinks?.twitter"
              :href="siteSettings.socialLinks.twitter"
              class="group relative"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <div
                class="h-11 w-11 rounded-full bg-contrast1/10 backdrop-blur-sm border border-contrast1/20 flex items-center justify-center group-hover:bg-contrast1/20 group-hover:border-contrast1/30 group-hover:scale-110 transition-all duration-300 shadow-lg"
              >
                <svg
                  class="h-5 w-5 text-contrast1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                  />
                </svg>
              </div>
            </a>

            <a
              v-if="siteSettings?.socialLinks?.linkedin"
              :href="siteSettings.socialLinks.linkedin"
              class="group relative"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <div
                class="h-11 w-11 rounded-full bg-contrast1/10 backdrop-blur-sm border border-contrast1/20 flex items-center justify-center group-hover:bg-contrast1/20 group-hover:border-contrast1/30 group-hover:scale-110 transition-all duration-300 shadow-lg"
              >
                <svg
                  class="h-5 w-5 text-contrast1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
                  />
                </svg>
              </div>
            </a>

            <!-- TikTok -->
            <a
              v-if="siteSettings?.socialLinks?.tiktok"
              :href="siteSettings.socialLinks.tiktok"
              class="group relative"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <div
                class="h-11 w-11 rounded-full bg-contrast1/10 backdrop-blur-sm border border-contrast1/20 flex items-center justify-center group-hover:bg-contrast1/20 group-hover:border-contrast1/30 group-hover:scale-110 transition-all duration-300 shadow-lg"
              >
                <svg
                  class="h-5 w-5 text-contrast1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.889 2.25h2.667a5.778 5.778 0 0 0 5.778 5.778V10.7a8.445 8.445 0 0 1-4.444-1.333v5.333a6.222 6.222 0 1 1-6.222-6.222 6.11 6.11 0 0 1 2.222.411v2.8a3.555 3.555 0 1 0 2.667 3.422V2.25z" />
                </svg>
              </div>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div v-if="currentContent.show_shop">
          <h3 class="text-lg font-bold mb-4 text-contrast1 flex items-center">
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            {{ currentContent.shop_title || defaultContent.shop_title }}
          </h3>
          <ul role="list" class="space-y-3">
            <li
              v-for="(link, index) in currentContent.shop_links ||
              defaultContent.shop_links"
              :key="`shop-${index}`"
            >
              <NuxtLink
                :to="link.url"
                class="text-base text-contrast1/80 hover:text-contrast1 transition-all flex items-center group"
              >
                <svg
                  class="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span
                  class="group-hover:translate-x-1 transition-transform duration-300"
                  >{{ link.text }}</span
                >
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Technologies Section -->
        <div v-if="currentContent.show_technologies && technologies.length">
          <h3 class="text-lg font-bold mb-4 text-contrast1 flex items-center">
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {{ currentContent.technologies_title || $t("footer.technologies") }}
          </h3>
          <ul role="list" class="space-y-3">
            <li v-for="technology in technologies" :key="technology.id">
              <NuxtLink
                :to="`/technologies/${technology.slug}`"
                class="text-base text-contrast1/80 hover:text-contrast1 transition-all flex items-center group"
              >
                <svg
                  class="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span
                  class="group-hover:translate-x-1 transition-transform duration-300"
                  >{{ getTechnologyName(technology) }}</span
                >
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Policies Section -->
        <div
          v-if="currentContent.show_policies && policies.length"
          aria-label="Policies"
        >
          <h3 class="text-lg font-bold mb-4 text-contrast1 flex items-center">
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {{ currentContent.policies_title || $t("footer.policies") }}
          </h3>
          <ul role="list" class="space-y-3">
            <li v-for="policy in policies" :key="policy.id">
              <NuxtLink
                :to="`/policies/${policy.slug}`"
                class="text-base text-contrast1/80 hover:text-contrast1 transition-all flex items-center group"
              >
                <svg
                  class="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span
                  class="group-hover:translate-x-1 transition-transform duration-300"
                >
                  {{ getPolicyTitle(policy) }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Company Links -->
        <div v-if="currentContent.show_company">
          <h3 class="text-lg font-bold mb-4 text-contrast1 flex items-center">
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            {{ currentContent.company_title || defaultContent.company_title }}
          </h3>
          <ul role="list" class="space-y-3">
            <li
              v-for="(link, index) in currentContent.company_links ||
              defaultContent.company_links"
              :key="`company-${index}`"
            >
              <NuxtLink
                :to="link.url"
                class="text-base text-contrast1/80 hover:text-contrast1 transition-all flex items-center group"
              >
                <svg
                  class="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span
                  class="group-hover:translate-x-1 transition-transform duration-300"
                  >{{ link.text }}</span
                >
              </NuxtLink>
            </li>
          </ul>
        </div>

       
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-contrast1/10 pt-8">
        <div
          class="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <!-- Copyright -->
          <p class="text-sm text-contrast1/70 text-center md:text-left">
            {{
              currentContent.copyright ||
              `© ${new Date().getFullYear()} ${
                settings?.site_name || "Xone Algeria"
              }. ${defaultContent.copyright}`
            }}
          </p>
        </div>

        <p class="text-center">
          Propulsé par <a href="https://cinqcinq.dev">CinqCinq.dev</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const { fetchSection } = useContentSections();
const supabase = useSupabaseClient();
const { siteSettings } = useSiteSettings();
const { locale } = useI18n();

// Technologies state
const technologies = ref([]);
const technologiesLoading = ref(false);

// Policies state
const policies = ref([]);
const policiesLoading = ref(false);

// Reactive locale
const currentLocale = computed(() => locale.value);

// Newsletter email
const newsletterEmail = ref("");

// Default content with enhanced structure
const defaultContent = {
  about_text:
    "Xone Algeria est votre destination privilégiée pour découvrir des produits de qualité exceptionnelle à des prix compétitifs.",
  copyright: "Tous droits réservés.",
  shop_title: "Boutique",
  shop_links: [
    { text: "Tous les Produits", url: "/products" },
    { text: "Catégories", url: "/categories" },
    { text: "Nouveautés", url: "/products?filter=new" },
    { text: "Promotions", url: "/products?filter=sale" },
  ],
  company_title: "Entreprise",
  company_links: [
    { text: "À Propos", url: "/about" },
    { text: "Contact", url: "/contact" },
    { text: "Blog", url: "/blog" },
    { text: "Carrières", url: "/careers" },
  ],
  support_title: "Support",
  support_links: [
    { text: "Centre d'Aide", url: "/help" },
    { text: "Politique de Livraison", url: "/shipping-policy" },
    { text: "Politique de Retour", url: "/return-policy" },
    { text: "Conditions d'Utilisation", url: "/terms" },
  ],
  show_shop: true,
  show_company: true,
  show_support: true,
  show_technologies: true,
  show_policies: true,
  technologies_title: "Technologies",
  policies_title: "Politiques",
  show_newsletter: false,
  newsletter_title: "Restez informé",
  newsletter_description:
    "Abonnez-vous à notre newsletter pour recevoir nos dernières offres",
  show_payment_methods: false,
  show_socials: true,
};

// State
// const settings = ref(null);
const sectionData = ref({
  is_active: true,
  content_translations: {
    fr: { ...defaultContent },
    ar: { ...defaultContent },
    en: { ...defaultContent },
  },
});

// Get current language content
const currentContent = computed(() => {
  return (
    sectionData.value.content_translations?.[currentLocale.value] ||
    defaultContent
  );
});

// Get technology name based on current locale
const getTechnologyName = (technology) => {
  return (
    technology.name_translations?.[currentLocale.value] ||
    technology.name_translations?.en ||
    technology.slug
  );
};

// Get policy title based on current locale
const getPolicyTitle = (policy) => {
  return (
    policy.title_translations?.[currentLocale.value] ||
    policy.title_translations?.en ||
    policy.slug
  );
};

// Fetch technologies
const fetchTechnologies = async () => {
  technologiesLoading.value = true;
  try {
    const { data, error } = await supabase
      .from("technologies")
      .select("id, slug, name_translations, is_active, display_order")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .limit(6); // Limit to 6 technologies for footer

    if (error) throw error;

    technologies.value = data || [];
  } catch (error) {
    console.error("Error fetching technologies:", error);
    technologies.value = [];
  } finally {
    technologiesLoading.value = false;
  }
};

// Fetch policies
const fetchPolicies = async () => {
  policiesLoading.value = true;
  try {
    const { data, error } = await supabase
      .from("policies")
      .select("id, slug, title_translations, is_active, policy_type")
      .eq("is_active", true)
      .order("policy_type", { ascending: true })
      .limit(6);

    if (error) throw error;

    policies.value = data || [];
  } catch (error) {
    console.error("Error fetching policies:", error);
    policies.value = [];
  } finally {
    policiesLoading.value = false;
  }
};

// Newsletter submission handler
const handleNewsletterSubmit = async () => {
  if (!newsletterEmail.value) return;

  try {
    // You could add a Supabase call here to store the email
    newsletterEmail.value = "";
    // Show success message
    alert("Merci pour votre inscription!");
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    alert("Une erreur est survenue. Veuillez réessayer.");
  }
};

/* Deprecated: legacy website_settings fetch. Replaced by useSiteSettings */
const fetchSettings = async () => {
  try {
    let siteSettings;
    if (user) {
      const { data } = await supabase
        .from("website_settings")
        .select("key, value")
        .eq("user_id", user)
        .in("key", [
          "site_name",
          "site_logo",
          "facebook_url",
          "instagram_url",
          "twitter_url",
          "linkedin_url",
          "policies_visible",
        ]);

      siteSettings = data;
    }

    if (siteSettings) {
      settings.value = siteSettings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});
    }
  } catch (error) {
    console.error("Error fetching footer settings:", error);
  }
};

// Load section data
const loadSectionData = async () => {
  try {
    const { data, error } = await fetchSection("footer");

    if (error) throw error;

    if (data) {
      sectionData.value = data;
    }
  } catch (error) {
    console.error("Error loading footer section:", error);
  }
};

onMounted(async () => {
  await Promise.all([loadSectionData(), fetchTechnologies(), fetchPolicies()]);
});
</script>
