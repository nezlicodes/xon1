<template>
  <div class="mt-5 max-w-md mx-auto">
    <div class="text-center mb-8">
      <h1 class="font-bold text-3xl my-10 text-mgray-800">
        Créez votre espace créatif
      </h1>
      <p class="text-mgray-600">
        Rejoignez CinqCinq et lancez votre boutique en ligne
      </p>
    </div>

    <form
      @submit.prevent="register"
      class="bg-backgroundColor p-8 rounded-lg shadow-md border border-mgray-100"
    >
      <div class="mb-6">
        <label for="name" class="block text-mgray-700 font-semibold mb-2"
          >Nom complet :</label
        >
        <input
          type="text"
          id="name"
          v-model="newUser.name"
          required
          class="w-full px-4 py-3 border border-mgray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Votre nom complet"
        />
      </div>

      <div class="mb-6">
        <label for="email" class="block text-mgray-700 font-semibold mb-2"
          >Email :</label
        >
        <input
          type="email"
          id="email"
          v-model="newUser.email"
          required
          class="w-full px-4 py-3 border border-mgray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="votre@email.com"
        />
      </div>

      <div class="mb-6">
        <label for="password" class="block text-mgray-700 font-semibold mb-2"
          >Mot de passe :</label
        >
        <input
          type="password"
          id="password"
          v-model="newUser.password"
          required
          minlength="6"
          class="w-full px-4 py-3 border border-mgray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Minimum 6 caractères"
        />
        <p class="text-sm text-mgray-500 mt-1">
          Le mot de passe doit contenir au moins 6 caractères
        </p>
      </div>

      <div class="mb-6">
        <label
          for="confirmPassword"
          class="block text-mgray-700 font-semibold mb-2"
          >Confirmer le mot de passe :</label
        >
        <input
          type="password"
          id="confirmPassword"
          v-model="newUser.confirmPassword"
          required
          class="w-full px-4 py-3 border border-mgray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Confirmez votre mot de passe"
        />
      </div>

      <div class="mb-6">
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-400 hover:bg-blue-500 p-3 rounded-lg text-mgray-800 font-semibold transition duration-200 flex justify-center items-center"
          :class="{ 'opacity-70': loading }"
        >
          <span v-if="loading" class="mr-2">
            <!-- Simple loading spinner -->
            <svg
              class="animate-spin h-5 w-5 text-mgray-800"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
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
          </span>
          <span>Créer mon compte</span>
        </button>
      </div>

      <div
        v-if="newUser.success"
        class="p-4 bg-green-50 border-l-4 border-green-400 rounded mb-6"
      >
        <p class="text-green-700">
          {{ newUser.success }}
        </p>
      </div>

      <div
        v-if="newUser.error"
        class="p-4 bg-red-50 border-l-4 border-red-400 rounded mb-6"
      >
        <p class="text-red-700">{{ newUser.error }}</p>
      </div>

      <div class="mt-6 text-center">
        <p class="text-mgray-600">
          Vous avez déjà un compte?
          <a href="/login" class="text-blue-600 hover:underline font-medium">
            Connectez-vous
          </a>
        </p>
      </div>
    </form>

    <div class="mt-4 text-center">
      <a href="/" class="text-mgray-500 hover:text-mgray-700 text-sm">
        Retour à l'accueil
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const loading = ref(false);

const newUser = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
  error: "",
  success: "",
});

const client = useSupabaseClient();

const register = async () => {
  // Reset messages
  newUser.value.error = "";
  newUser.value.success = "";

  // Validate passwords match
  if (newUser.value.password !== newUser.value.confirmPassword) {
    newUser.value.error = "Les mots de passe ne correspondent pas";
    return;
  }

  // Validate password length
  if (newUser.value.password.length < 6) {
    newUser.value.error = "Le mot de passe doit contenir au moins 6 caractères";
    return;
  }

  loading.value = true;

  try {
    const { data, error } = await client.auth.signUp({
      email: newUser.value.email,
      password: newUser.value.password,
      options: {
        data: {
          full_name: newUser.value.name,
        },
        emailRedirectTo: `${window.location.origin}/verifyEmail`,
      },
    });

    if (error) {
      newUser.value.error = error.message;
      loading.value = false;
    } else {
      loading.value = false;
      newUser.value.success =
        "Compte créé avec succès! Veuillez vérifier votre email pour confirmer votre inscription.";

      // Optionally redirect to verification page after a delay
      setTimeout(() => {
        navigateTo("/verifyEmail");
      }, 3000);
    }
  } catch (error) {
    newUser.value.error = error.message;
    loading.value = false;
  }
};

useHead({
  title: "Inscription | CinqCinq",
  meta: [
    {
      name: "description",
      content: "Créez votre compte CinqCinq et lancez votre boutique en ligne",
    },
  ],
});

definePageMeta({
  pageTransition: {
    name: "page",
  },
});
</script>

<style scoped>
/* Custom focus and hover states with your brand color */
input:focus {
  border-color: #ffc74c;
}

.bg-blue-400 {
  background-color: #ffc74c;
}

.text-blue-600 {
  color: #d4a73b;
}

.focus\:ring-blue-400:focus {
  --tw-ring-color: #ffc74c;
}

.hover\:bg-blue-500:hover {
  background-color: #e6b443;
}
</style>