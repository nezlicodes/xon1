<template>
  <section
    id="contact"
    class="relative py-24 bg-gradient-to-br from-backgroundColor via-backgroundColor to-backgroundColor/80 overflow-hidden"
  >
    <!-- Decorative background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section title -->
      <div class="text-center mb-12 md:mb-16 space-y-4" data-aos="fade-up">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
          <Icon name="ph:envelope-fill" class="w-4 h-4 text-primary" />
          <span class="text-sm font-semibold text-primary">{{ $t('contact.sectionLabel') }}</span>
        </div>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
          {{ settings.contact_title || $t('contact.title') }}
        </h2>
        <p class="text-base md:text-lg text-foreground/60 max-w-2xl mx-auto">
          {{ settings.contact_description || $t('contact.description') }}
        </p>
      </div>

      <div
        class="bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-foreground/10 transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <div class="lg:flex">
          <!-- Contact Info Panel -->
          <div
            class="lg:w-2/5 xl:w-1/3 p-8 lg:p-10 bg-gradient-to-br from-primary/5 to-primary/10 border-r border-foreground/10"
          >
            <h3 class="text-xl font-bold text-foreground mb-6">
              {{ settings.contact_subtitle || $t('contact.subtitle') }}
            </h3>

            <p class="mb-8 leading-relaxed text-foreground/70">
              {{
                settings.contact_description || $t('contact.description')
              }}
            </p>

            <div class="space-y-5 mt-8">
              <ContactInfoItem
                v-if="contactPhone"
                :href="`tel:${contactPhone}`"
                :text="contactPhone"
                type="phone"
                :label="$t('contact.info.callUs')"
              />

              <ContactInfoItem
                v-if="contactEmail"
                :href="`mailto:${contactEmail}`"
                :text="contactEmail"
                type="email"
                :label="$t('contact.info.emailUs')"
              />

              <ContactInfoItem
                v-if="contactAddress"
                :text="contactAddress"
                type="address"
                :label="$t('contact.info.visitUs')"
              />
            </div>

            <!-- Social media -->
            <div class="mt-16" v-if="facebookUrl || instagramUrl || twitterUrl">
              <h4 class="text-sm uppercase tracking-wider mb-5 font-semibold text-foreground">
                {{ $t('contact.social.followUs') }}
              </h4>
              <div class="flex items-center space-x-3 rtl:space-x-reverse">
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
          <div class="lg:w-3/5 xl:w-2/3 p-8 lg:p-10">
            <!-- Contact Form -->
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Name Field -->
                <div class="form-group">
                  <label
                    for="name"
                    class="block text-sm mb-2 font-semibold text-foreground"
                  >
                    {{ $t('contact.form.name') }}
                  </label>
                  <input
                    id="name"
                    type="text"
                    v-model="formData.name"
                    :class="getInputClass('name')"
                    class="block w-full rounded-lg border border-foreground/10 bg-background/30 text-foreground py-3 px-4 transition-all duration-300 placeholder:text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:border-primary/50"
                    :placeholder="$t('contact.form.namePlaceholder')"
                    required
                    aria-describedby="nameError"
                  />
                  <FormError
                    v-if="errors.name"
                    :message="errors.name"
                    id="nameError"
                  />
                </div>

                <!-- Email Field -->
                <div class="form-group">
                  <label
                    for="email"
                    class="block text-sm mb-2 font-semibold text-foreground"
                  >
                    {{ $t('contact.form.email') }}
                  </label>
                  <input
                    id="email"
                    type="email"
                    v-model="formData.email"
                    :class="getInputClass('email')"
                    class="block w-full rounded-lg border border-foreground/10 bg-background/30 text-foreground py-3 px-4 transition-all duration-300 placeholder:text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:border-primary/50"
                    :placeholder="$t('contact.form.emailPlaceholder')"
                    required
                    aria-describedby="emailError"
                  />
                  <FormError
                    v-if="errors.email"
                    :message="errors.email"
                    id="emailError"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Phone Field -->
                <div class="form-group">
                  <label
                    for="phone"
                    class="block text-sm mb-2 font-semibold text-foreground"
                  >
                    {{ $t('contact.form.phone') }}
                    <span class="text-xs text-foreground/60"
                      >({{ $t('contact.form.phoneOptional') }})</span
                    >
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    v-model="formData.phone"
                    :class="getInputClass('phone')"
                    class="block w-full rounded-lg border border-foreground/10 bg-background/30 text-foreground py-3 px-4 transition-all duration-300 placeholder:text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:border-primary/50"
                    :placeholder="$t('contact.form.phonePlaceholder')"
                    aria-describedby="phoneError"
                  />
                  <FormError
                    v-if="errors.phone"
                    :message="errors.phone"
                    id="phoneError"
                  />
                </div>

                <!-- Subject Field -->
                <div class="form-group">
                  <label
                    for="subject"
                    class="block text-sm mb-2 font-semibold text-foreground"
                  >
                    {{ $t('contact.form.subject') }}
                  </label>
                  <select
                    id="subject"
                    v-model="formData.subject"
                    :class="getInputClass('subject')"
                    class="block w-full rounded-lg border border-foreground/10 bg-background/30 text-foreground py-3 px-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:border-primary/50 appearance-none cursor-pointer"
                    required
                    aria-describedby="subjectError"
                  >
                    <option value="" disabled>
                      {{ $t('contact.form.subjectPlaceholder') }}
                    </option>
                    <option value="general">{{ $t('contact.form.subjectGeneral') }}</option>
                    <option value="order">{{ $t('contact.form.subjectOrder') }}</option>
                    <option value="support">{{ $t('contact.form.subjectSupport') }}</option>
                    <option value="other">{{ $t('contact.form.subjectOther') }}</option>
                  </select>
                  <FormError
                    v-if="errors.subject"
                    :message="errors.subject"
                    id="subjectError"
                  />
                </div>
              </div>

              <!-- Message Field -->
              <div class="form-group">
                <label
                  for="message"
                  class="block text-sm mb-2 font-semibold text-foreground"
                >
                  {{ $t('contact.form.message') }}
                </label>
                <textarea
                  id="message"
                  v-model="formData.message"
                  rows="4"
                  :class="getInputClass('message')"
                  class="block w-full rounded-lg border border-foreground/10 bg-background/30 text-foreground py-3 px-4 transition-all duration-300 placeholder:text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:border-primary/50 resize-none"
                  :placeholder="$t('contact.form.messagePlaceholder')"
                  required
                  aria-describedby="messageError"
                ></textarea>
                <FormError
                  v-if="errors.message"
                  :message="errors.message"
                  id="messageError"
                />
              </div>

              <!-- Submit Button -->
              <div class="form-group">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="relative w-full md:w-auto rounded-lg px-8 py-3.5 overflow-hidden group bg-primary text-contrast1 font-semibold focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  :class="isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'"
                  aria-live="polite"
                >
                  <span
                    v-if="isSubmitting"
                    class="flex items-center justify-center relative"
                  >
                    <Icon name="ph:circle-notch" class="w-4 h-4 mr-2 animate-spin" />
                    <span class="relative">{{ $t('contact.form.submitting') }}</span>
                  </span>
                  <span v-else class="relative flex items-center justify-center gap-2">
                    <span>{{ settings.contact_button_text || $t('contact.form.submit') }}</span>
                    <Icon name="ph:paper-plane-tilt-fill" class="w-4 h-4" />
                  </span>
                </button>
              </div>
            </form>

            <!-- Success Message -->
            <transition
              enter-active-class="transition ease-out duration-300"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition ease-in duration-200"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div
                v-if="showSuccess"
                class="mt-6 rounded-lg border border-green-500/20 bg-green-500/10 p-4"
                role="alert"
                aria-live="polite"
              >
                <div class="flex items-center gap-3">
                  <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Icon name="ph:check-circle-fill" class="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 class="text-sm font-semibold text-foreground">
                      {{ $t('contact.success.title') }}
                    </h3>
                    <p class="text-sm text-foreground/70 mt-1">
                      {{ $t('contact.success.message') }}
                    </p>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useSupabaseClient } from "#imports";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const supabase = useSupabaseClient();

// Define props to receive settings from parent
const props = defineProps({
  settings: {
    type: Object,
    default: () => ({}),
  },
});

// Computed properties for contact information
const contactEmail = computed(() => props.settings?.support_email || "");
const contactPhone = computed(() => props.settings?.phone_number || "");
const contactAddress = computed(() => props.settings?.business_address || "");

// Computed properties for social media links
const facebookUrl = computed(() => props.settings?.facebook_url || "");
const instagramUrl = computed(() => props.settings?.instagram_url || "");
const twitterUrl = computed(() => props.settings?.twitter_url || "");

// Form data
const formData = reactive({
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
});

// Form errors
const errors = reactive({
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
});

// Form state
const isSubmitting = ref(false);
const showSuccess = ref(false);

// Get input class based on error state
const getInputClass = (field) => {
  return {
    "focus:ring-primary/50": !errors[field],
    "border-red-500/50 focus:ring-red-500/50 focus:border-red-500": errors[field],
  };
};

// Validate form
const validateForm = () => {
  let isValid = true;

  // Reset errors
  Object.keys(errors).forEach((key) => (errors[key] = ""));

  // Name validation
  if (!formData.name.trim()) {
    errors.name = t('contact.form.nameRequired');
    isValid = false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    errors.email = t('contact.form.emailRequired');
    isValid = false;
  } else if (!emailRegex.test(formData.email)) {
    errors.email = t('contact.form.emailInvalid');
    isValid = false;
  }

  // Phone validation (optional)
  if (formData.phone.trim() && !/^[0-9+\s-]{8,}$/.test(formData.phone)) {
    errors.phone = t('contact.form.phoneInvalid');
    isValid = false;
  }

  // Subject validation
  if (!formData.subject) {
    errors.subject = t('contact.form.subjectRequired');
    isValid = false;
  }

  // Message validation
  if (!formData.message.trim()) {
    errors.message = t('contact.form.messageRequired');
    isValid = false;
  } else if (formData.message.length < 10) {
    errors.message = t('contact.form.messageMinLength');
    isValid = false;
  }

  return isValid;
};

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    const { error } = await supabase.from("contact_messages").insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
      },
    ]);

    if (error) throw error;

    // Reset form
    Object.keys(formData).forEach((key) => (formData[key] = ""));

    // Show success message
    showSuccess.value = true;

    // Hide success message after 5 seconds
    setTimeout(() => {
      showSuccess.value = false;
    }, 5000);
  } catch (error) {
    console.error("Error submitting form:", error);
    alert(t('contact.form.emailRequired')); // Fallback error message
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Custom select arrow */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* RTL support for select arrow */
[dir="rtl"] select {
  background-position: left 0.5rem center;
  padding-right: 1rem;
  padding-left: 2.5rem;
}

/* Remove default focus outlines, we use custom ones */
input:focus,
textarea:focus,
select:focus {
  outline: none;
}
</style>
