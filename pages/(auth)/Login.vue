<template>
  <div class="mt-5 max-w-md mx-auto">
    <div class="text-center mb-8">
      <h1 class="font-bold text-3xl my-10 text-mgray-800">
        Connectez-vous à votre espace créatif
      </h1>
      <p class="text-mgray-600">
        Accédez à votre boutique en ligne et gérez vos produits
      </p>
    </div>

    <form
      @submit.prevent="login"
      class="bg-backgroundColor p-8 rounded-lg shadow-md border border-mgray-100"
    >
      <div class="mb-6">
        <label for="email" class="block text-mgray-700 font-semibold mb-2"
          >Email :</label
        >
        <input
          type="email"
          id="email"
          v-model="defaultUser.email"
          required
          class="w-full px-4 py-3 border border-mgray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="votre@email.com"
        />
      </div>

      <div class="mb-6">
        <div class="flex justify-between">
          <label for="password" class="block text-mgray-700 font-semibold mb-2"
            >Mot de passe :</label
          >
          <a
            href="/forgot-password"
            class="text-sm text-blue-600 hover:underline"
            >Mot de passe oublié?</a
          >
        </div>
        <input
          type="password"
          id="password"
          v-model="defaultUser.password"
          required
          class="w-full px-4 py-3 border border-mgray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Votre mot de passe"
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
          <span>Se connecter</span>
        </button>
      </div>

      <div
        v-if="defaultUser.error && errorCode === 'email_not_confirmed'"
        class="p-4 bg-red-50 border-l-4 border-red-400 rounded mb-6"
      >
        <p class="text-red-700">
          Il semblerait que votre email n'ait pas été confirmé.
          <span
            role="button"
            @click="resendConfirmationEmail"
            class="text-blue-600 hover:underline cursor-pointer font-medium"
            >Cliquez ici pour renvoyer le lien</span
          >
        </p>
      </div>

      <div
        v-if="defaultUser.error && errorCode !== 'email_not_confirmed'"
        class="p-4 bg-red-50 border-l-4 border-red-400 rounded mb-6"
      >
        <p class="text-red-700">{{ defaultUser.error }}</p>
      </div>

      <div class="mt-6 text-center">
        <p class="text-mgray-600">
          Pas encore de compte?
          <a
            href="https://cinqcinq.dev/register"
            class="text-blue-600 hover:underline font-medium"
          >
            Créez votre espace en ligne
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

const defaultUser = ref({
  email: "",
  password: "",
  error: "",
});

const client = useSupabaseClient();
const user = useSupabaseUser();
const errorCode = ref(null);

const login = async () => {
  loading.value = true;
  try {
    const res = await client.auth.signInWithPassword({
      email: defaultUser.value?.email,
      password: defaultUser.value?.password,
    });
    user.value = res.data.user;

    if (res.error) {
      if (res.error.code === "email_not_confirmed") {
        errorCode.value = "email_not_confirmed";
      }
      defaultUser.value.error = res.error.message;
      loading.value = false;
    } else {
      loading.value = false;
      return navigateTo("/admin");
    }
  } catch (error) {
    if (error.code === "email_not_confirmed") {
      errorCode.value = "email_not_confirmed";
    }
    defaultUser.value.error = error.message;
    loading.value = false;
  }
};

const resendConfirmationEmail = async () => {
  loading.value = true;
  try {
    const { error } = await client.auth.resend({
      type: "signup",
      email: defaultUser.value?.email,
      options: {
        emailRedirectTo: `${window.location.origin}/verifyEmail`,
      },
    });
    if (error) {
      defaultUser.value.error = error.message;
      loading.value = false;
    } else {
      loading.value = false;
      return navigateTo("/verifyEmail");
    }
  } catch (error) {
    defaultUser.value.error = error.message;
    loading.value = false;
  }
};

useHead({
  title: "Connexion | CinqCinq",
  meta: [
    {
      name: "description",
      content: "Connectez-vous à votre espace créatif CinqCinq",
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
</style>