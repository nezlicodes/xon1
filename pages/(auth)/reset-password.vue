<template>
    <section
      id="update-password"
      class="py-20 bg-gradient-to-br from-primary-50 via-white to-gray-100 flex justify-center items-center min-h-screen"
    >
      <div
        class="max-w-lg w-full bg-white p-10 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        <!-- Decorative background elements -->
        <div
          class="absolute -top-10 -right-10 w-40 h-40 bg-primary-300 rounded-full opacity-20"
        ></div>
        <div
          class="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-400 rounded-full opacity-20"
        ></div>
  
        <h1 class="text-3xl font-bold text-center text-gray-800 mb-2">
          Mise à jour du mot de passe
        </h1>
        <p class="text-gray-600 text-center mb-8">
          Veuillez entrer votre email et définir un nouveau mot de passe.
        </p>
  
        <!-- Form shown until password is updated -->
        <form v-if="!updateSuccess" @submit.prevent="updatePassword">
          <div class="mb-4">
            <label for="email" class="block text-gray-700 font-medium mb-1"
              >Email :</label
            >
            <input
              type="email"
              id="email"
              v-model="userEmail"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all"
            />
          </div>
          <div class="mb-4">
            <label for="new-password" class="block text-gray-700 font-medium mb-1"
              >Nouveau mot de passe :</label
            >
            <input
              type="password"
              id="new-password"
              v-model="newPassword"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all"
            />
            <p class="text-xs text-gray-500 mt-1">
              Minimum 8 caractères, incluant un chiffre et un caractère spécial.
            </p>
          </div>
          <div class="mb-6">
            <label for="confirm-password" class="block text-gray-700 font-medium mb-1"
              >Confirmer le mot de passe :</label
            >
            <input
              type="password"
              id="confirm-password"
              v-model="confirmPassword"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all"
            />
            <p v-if="passwordMismatch" class="text-xs text-primary-500 mt-1">
              Les mots de passe ne correspondent pas.
            </p>
          </div>
          <button
            type="submit"
            :disabled="loading || passwordMismatch "
            class="w-full py-3 bg-primary-500 rounded-lg font-medium hover:bg-primary-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mettre à jour le mot de passe
          </button>
  
          <div v-if="error" class="text-primary-500 mt-4 text-center">
            <p>{{ error }}</p>
          </div>
        </form>
  
        <!-- Success message shown after password update -->
        <div v-if="updateSuccess" class="text-center py-6">
          <div class="mb-6 mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-3">Mot de passe mis à jour</h2>
          <p class="text-gray-600 mb-6">
            Votre mot de passe a été modifié avec succès.
          </p>
          <nuxt-link
            to="/login"
            class="inline-block px-6 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-all duration-300"
          >
            Se connecter
          </nuxt-link>
        </div>
  
        <div v-if="!updateSuccess" class="text-center mt-6">
          <nuxt-link
            to="/login"
            class="text-primary-600 font-semibold hover:underline"
            >Retour à la connexion</nuxt-link
          >
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useSupabaseClient } from '#imports';
  
  const userEmail = ref('');
  const newPassword = ref('');
  const confirmPassword = ref('');
  const error = ref('');
  const loading = ref(false);
  const updateSuccess = ref(false);
  
  const client = useSupabaseClient();
  

  // Check if passwords match
  const passwordMismatch = computed(() => {
    return newPassword.value && confirmPassword.value 
      ? newPassword.value !== confirmPassword.value
      : false;
  });
  
  const updatePassword = async () => {
 
    loading.value = true;
    error.value = '';
    
    try {
      // In a real implementation, you might need to use a token from the URL
      // This example assumes you're using Supabase's updateUser method
      const { error: updateError } = await client.auth.updateUser({
        email: userEmail.value,
        password: newPassword.value
      });
  
      if (updateError) {
        error.value = updateError.message;
      } else {
        updateSuccess.value = true;
      }
    } catch (err) {
      console.error(err);
      error.value = "Une erreur s'est produite. Veuillez réessayer.";
    } finally {
      loading.value = false;
    }
  };
  
  useHead({
    title: "Mise à jour du mot de passe",
  });
  </script>
  
  <style scoped></style>