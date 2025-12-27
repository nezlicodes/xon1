<template>
  <section
    id="contact"
    class="py-20 bg-gradient-to-br from-primary-50 via-white to-gray-100 flex justify-center items-center min-h-screen"
  >
    <div
      class="max-w-4xl w-full bg-white p-10 rounded-3xl shadow-2xl relative overflow-hidden"
    >
      <!-- Decorative background elements -->
      <div
        class="absolute -top-10 -right-10 w-40 h-40 bg-primary-300 rounded-full opacity-20"
      ></div>
      <div
        class="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-400 rounded-full opacity-20"
      ></div>

      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
        Contactez-nous
      </h1>
      <p class="text-gray-600 text-center mb-8">
        Une question, un problème ou une suggestion ? N'hésitez pas à nous écrire !
      </p>

      <form
        name="contact"
        data-netlify="true"
        method="POST"
        id="order"
        data-netlify-honeypot="bot-field"
        action="https://submit-form.com/nt2PP8EL"
        class="space-y-6"
      >
        <div class="mb-4">
          <label for="username" class="block text-gray-700 font-medium mb-1"
            >Nom et prénom :</label
          >
          <input
            type="text"
            id="username"
            name="username"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all"
            placeholder="Votre nom complet"
          />
        </div>
        <div class="mb-4">
          <label for="email" class="block text-gray-700 font-medium mb-1"
            >Email :</label
          >
          <input
            type="email"
            id="email"
            name="email"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all"
            placeholder="Votre adresse email"
          />
        </div>
        <div class="mb-6">
          <label for="message" class="block text-gray-700 font-medium mb-1"
            >Message :</label
          >
          <textarea
            id="message"
            name="message"
            rows="4"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all"
            placeholder="Votre message..."
          ></textarea>
        </div>

        <button
          type="submit"
          class="w-full py-3 bg-primary-500 rounded-lg font-medium hover:bg-primary-600 transition-all duration-300"
        >
          Envoyer
        </button>
      </form>

      <div class="mt-8 border-t border-gray-200 pt-6">
        <p class="text-center text-gray-700 mb-4">
          Ou contactez-nous directement :
        </p>
        <div class="flex items-center justify-center gap-4 mb-4">
          <a
            href="tel:0781006753"
            class="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <span
              class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center"
            >
              <Icon name="fa6-solid:phone" class="text-sm text-primary-600" />
            </span>
            <span class="font-medium">0781006753</span>
          </a>
        </div>
        <div class="flex justify-center gap-4">
          <a
            href="https://www.instagram.com/arti.mojo/"
            target="_blank"
            class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center hover:bg-primary-200 transition-all"
          >
            <Icon
              name="fa6-brands:instagram"
              class="text-lg text-primary-600"
            />
          </a>
          <a
            href="https://www.facebook.com/artimojo/"
            target="_blank"
            class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center hover:bg-primary-200 transition-all"
          >
            <Icon name="fa6-brands:facebook" class="text-lg text-primary-600" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>