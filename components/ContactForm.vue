<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="form-group">
        <label for="name" class="block text-sm mb-1.5">
          Nom complet
        </label>
        <input
          id="name"
          type="text"
          v-model="formData.name"
          :class="getInputClass('name')"
          class="block w-full rounded-lg border py-3 px-4 shadow-sm transition-all duration-300 placeholder:text-sm focus:outline-none focus:ring-2"
          placeholder="Votre nom"
          required
          aria-describedby="nameError"
        />
        <FormError
          v-if="errors.name"
          :message="errors.name"
          id="nameError"
        />
      </div>
      <div class="form-group">
        <label for="email" class="block text-sm mb-1.5">
          Email
        </label>
        <input
          id="email"
          type="email"
          v-model="formData.email"
          :class="getInputClass('email')"
          class="block w-full rounded-lg border  py-3 px-4 shadow-sm transition-all duration-300 placeholder:text-sm focus:outline-none focus:ring-2"
          placeholder="votre@email.com"
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
      <div class="form-group">
        <label for="phone" class="block text-sm mb-1.5">
          Téléphone <span class="text-xs">(Optionnel)</span>
        </label>
        <input
          id="phone"
          type="tel"
          v-model="formData.phone"
          :class="getInputClass('phone')"
          class="block w-full rounded-lg border  py-3 px-4 shadow-sm transition-all duration-300 placeholder:text-sm focus:outline-none focus:ring-2"
          placeholder="+33 6 12 34 56 78"
          aria-describedby="phoneError"
        />
        <FormError
          v-if="errors.phone"
          :message="errors.phone"
          id="phoneError"
        />
      </div>
      <div class="form-group">
        <label for="subject" class="block text-sm mb-1.5">
          Sujet
        </label>
        <select
          id="subject"
          v-model="formData.subject"
          :class="getInputClass('subject')"
          class="block w-full rounded-lg border  py-3 px-4 shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 appearance-none"
          required
          aria-describedby="subjectError"
        >
          <option value="" disabled>Sélectionnez un sujet</option>
          <option value="general">Question générale</option>
          <option value="order">Question sur une commande</option>
          <option value="support">Support technique</option>
          <option value="other">Autre</option>
        </select>
        <FormError
          v-if="errors.subject"
          :message="errors.subject"
          id="subjectError"
        />
      </div>
    </div>

    <div class="form-group">
      <label for="message" class="block text-sm mb-1.5">
        Message
      </label>
      <textarea
        id="message"
        v-model="formData.message"
        rows="4"
        :class="getInputClass('message')"
        class="block w-full rounded-lg border  py-3 px-4 shadow-sm transition-all duration-300 placeholder:text-sm focus:outline-none focus:ring-2"
        placeholder="Comment pouvons-nous vous aider ?"
        required
        aria-describedby="messageError"
      ></textarea>
      <FormError
        v-if="errors.message"
        :message="errors.message"
        id="messageError"
      />
    </div>

    <div class="form-group">
      <button
        type="submit"
        :disabled="isSubmitting"
        class="relative w-full md:w-auto rounded-lg px-6 py-3 overflow-hidden group border  focus:ring-2 focus:outline-none transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-md hover:scale-[1.02]"
        :class="isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'"
        aria-live="polite"
      >
        <span
          v-if="isSubmitting"
          class="flex items-center justify-center relative"
        >
          <svg
            class="animate-spin h-4 w-4 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span class="relative text-sm font-medium">Envoi en cours...</span>
        </span>
        <span
          v-else
          class="relative text-sm font-medium"
          >{{ settings.contact_button_text || 'Envoyer le message' }}</span
        >
      </button>
    </div>
  </form>
</template>
  
<script setup>
import { ref, reactive, defineEmits } from "vue";
import { useSupabaseClient } from "#imports";

const supabase = useSupabaseClient();
const emit = defineEmits(["form-submitted"]);

const props = defineProps({
  settings: {
    type: Object,
    default: () => ({}),
  },
});

const formData = reactive({
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
});

const errors = reactive({
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
});

const isSubmitting = ref(false);

const showError = (message) => {
  console.error(message);
  alert(message);
};

const getInputClass = (field) => {
  return {
    " focus:ring-primary/50": !errors[field],
    " focus:ring-primary/80 shadow-md": errors[field],
  };
};

const validateForm = () => {
  let isValid = true;

  Object.keys(errors).forEach((key) => (errors[key] = ""));

  if (!formData.name.trim()) {
    errors.name = "Le nom est requis";
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    errors.email = "L'email est requis";
    isValid = false;
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Email invalide";
    isValid = false;
  }

  if (formData.phone.trim() && !/^[0-9+\s-]{8,}$/.test(formData.phone)) {
    errors.phone = "Numéro de téléphone invalide";
    isValid = false;
  }

  if (!formData.subject) {
    errors.subject = "Le sujet est requis";
    isValid = false;
  }

  if (!formData.message.trim()) {
    errors.message = "Le message est requis";
    isValid = false;
  } else if (formData.message.length < 10) {
    errors.message = "Le message doit contenir au moins 10 caractères";
    isValid = false;
  }

  return isValid;
};

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

    Object.keys(formData).forEach((key) => (formData[key] = ""));

    emit("form-submitted");
  } catch (error) {
    console.error("Error submitting form:", error);
    showError("Une erreur est survenue. Veuillez réessayer plus tard.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>