
<template>
  <div class="verify-email-container">
    <h1>Vérifiez votre adresse e-mail</h1>
    <p>
      Nous avons envoyé un e-mail de vérification à votre adresse. Veuillez
      vérifier votre boîte de réception et cliquer sur le lien pour confirmer
      votre adresse e-mail.
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  pageTransition: {
    name: "page",
  },
});
</script>

<style scoped>
.verify-email-container {
  max-width: 600px;
  margin: 50px auto;
  text-align: center;
  font-family: Arial, sans-serif;
}

h1 {
  font-size: 24px;
  color: #333;
}

p {
  font-size: 16px;
  color: #555;
  margin: 10px 0;
}

.resend-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.resend-button:hover {
  background-color: #0056b3;
}
</style>

<script setup lang="ts">
</script>

<style scoped>
</style>