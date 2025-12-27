<template>
  <div
    v-if="settings?.contact_visible && settings?.contact_visible == 'true'"
    id="contact"
    class="py-20 mt-20"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
      <!-- Section title -->
      <div class="text-center mb-16">
        <span
          class="inline-block text-sm font-medium tracking-wider uppercase mb-2"
        >
          Contact
        </span>
        <h2 class="text-3xl md:text-4xl font-light mb-3">
          {{ settings.contact_title || "Nous sommes à votre écoute" }}
        </h2>
        <div class="w-16 h-px mx-auto mt-4 mb-2"></div>
      </div>

      <div
        class="rounded-xl border overflow-hidden transition-all duration-500"
      >
        <div class="lg:flex">
          <!-- Contact Info Panel -->
          <div class="lg:w-2/5 xl:w-1/3 p-10 lg:p-12 border-r">
            <h3 class="text-xl font-normal mb-6">
              {{ settings.contact_subtitle || "Informations de contact" }}
            </h3>

            <p class="mb-8 font-light leading-relaxed">
              {{
                settings.contact_description ||
                " Nous sommes à votre écoute. N'hésitez pas à nous contacter pour toute question."
              }}
            </p>

            <div class="space-y-5 mt-8">
              <ContactInfoItem
                v-if="contactPhone"
                :href="`tel:${contactPhone}`"
                :text="contactPhone"
                type="phone"
                label="Appelez-nous"
              />

              <ContactInfoItem
                v-if="contactEmail"
                :href="`mailto:${contactEmail}`"
                :text="contactEmail"
                type="email"
                label="Envoyez-nous un email"
              />

              <ContactInfoItem
                v-if="contactAddress"
                :text="contactAddress"
                type="address"
              />
            </div>

            <!-- Social media -->
            <div class="mt-16">
              <h4 class="text-sm uppercase tracking-wider mb-5 font-medium">
                Suivez-nous
              </h4>
              <div class="flex items-center space-x-3">
                <SocialLink
                  v-if="facebookUrl"
                  :href="facebookUrl"
                  platform="facebook"
                />
                <SocialLink
                  v-if="instagramUrl"
                  :href="instagramUrl"
                  platform="instagram"
                />
                <SocialLink
                  v-if="twitterUrl"
                  :href="twitterUrl"
                  platform="twitter"
                />
              </div>
            </div>
          </div>

          <!-- Form Panel -->
          <div class="lg:w-3/5 xl:w-2/3 p-8 md:p-12">

            <ContactForm :settings="props.settings" @form-submitted="handleFormSubmitted" />

            <!-- Success Message -->
            <transition
              enter-active-class="transition ease-out duration-300"
              enter-from-class="transform scale-95"
              enter-to-class="transform scale-100"
              leave-active-class="transition ease-in duration-200"
              leave-from-class="transform scale-100"
              leave-to-class="transform scale-95"
            >
              <div
                v-if="showSuccess"
                class="mt-6 rounded-lg border p-4"
                role="alert"
                aria-live="polite"
              >
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-normal">
                      Message envoyé avec succès ! Nous vous répondrons dans les
                      plus brefs délais.
                    </p>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Define props to receive settings from parent
const props = defineProps({
  settings: {
    type: Object,
    default: () => ({}),
  },
});

// Computed properties for contact information with cleaner naming
const contactEmail = computed(() => props.settings?.support_email || "");
const contactPhone = computed(() => props.settings?.phone_number || "");
const contactAddress = computed(() => props.settings?.business_address || "");

// Computed properties for social media links
const facebookUrl = computed(() => props.settings?.facebook_url || "");
const instagramUrl = computed(() => props.settings?.instagram_url || "");
const twitterUrl = computed(() => props.settings?.twitter_url || "");

// Success message state
const showSuccess = ref(false);

// Handle form submission success
const handleFormSubmitted = () => {
  showSuccess.value = true;

  // Hide success message after 5 seconds
  setTimeout(() => {
    showSuccess.value = false;
  }, 5000);
};
</script>