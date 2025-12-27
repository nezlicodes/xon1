<template>
  <div class="space-y-3">
    <!-- Prévisualisation du composant de contact avec édition en direct -->
    <div class="bg-background text-mgray shadow overflow-hidden relative">
      <!-- Toggle visibility button -->
      <button
        @click="toggleContactVisibility"
        class="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        :title="
          props.formData.contact_visible === 'true'
            ? 'Masquer la section contact'
            : 'Afficher la section contact'
        "
      >
        <Icon
          v-if="props.formData.contact_visible === 'true'"
          class="h-5 w-5 text-gray-700"
          name="heroicons-outline:eye"
        />

        <Icon
          v-else
          class="h-5 w-5 text-gray-700"
          name="heroicons-outline:eye-off"
        />
      </button>

      <!-- Show collapsed placeholder when contact section is hidden -->
      <div
        v-if="props.formData.contact_visible !== 'true'"
        class="flex items-center justify-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg"
      >
        <div class="text-center">
          <Icon
            name="heroicons-outline:mail"
            class="mx-auto h-12 w-12 text-gray-400"
          />

          <h3 class="mt-2 text-sm font-medium text-gray-900">
            Section contact masquée
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Cliquez sur l'icône d'œil pour afficher la section contact
          </p>
        </div>
      </div>

      <!-- Contact section content when visible -->
      <div v-if="props.formData.contact_visible === 'true'" class="relative">
        <div id="contact" class="py-12">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <!-- Section title -->
            <div class="text-center mb-16 relative group">
              <span
                class="inline-block text-sm font-medium tracking-wider uppercase mb-2"
              >
              </span>
              <!-- Titre de section éditable -->
              <div
                class="relative border-2 mt-8 border-transparent rounded-lg transition-all duration-300 hover:border-blue-400 px-4 py-2 inline-block"
              >
                <h2
                  class="text-3xl md:text-4xl font-light mb-3"
                  v-text="
                    props.formData.contact_title ||
                    defaultContactData.contact_title
                  "
                ></h2>
                <button
                  @click="openFieldEditor('contact_title')"
                  class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-110"
                  title="Modifier le titre"
                >
                  <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
                </button>
                <div class="text-xs text-blue-500 opacity-75 mt-1">
                  Cliquez pour modifier le titre
                </div>
              </div>
              <div class="w-16 h-px mx-auto mt-4 mb-2"></div>
            </div>

            <div
              class="rounded-xl border overflow-hidden transition-all duration-500"
            >
              <div class="lg:flex">
                <!-- Contact Info Panel -->
                <div class="lg:w-2/5 xl:w-1/3 p-10 lg:p-12 border-r">
                  <!-- Sous-titre éditable -->
                  <div
                    class="relative border-2 border-transparent rounded-lg transition-all duration-300 hover:border-blue-400 px-4 py-2 mb-6"
                  >
                    <h3
                      class="text-xl font-normal"
                      v-text="
                        props.formData.contact_subtitle ||
                        defaultContactData.contact_subtitle
                      "
                    ></h3>
                    <button
                      @click="openFieldEditor('contact_subtitle')"
                      class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-110"
                      title="Modifier le titre"
                    >
                      <Icon
                        class="w-4 h-4"
                        name="heroicons-outline:pencil-alt"
                      />
                    </button>
                  </div>

                  <!-- Description éditable -->
                  <div
                    class="relative border-2 border-transparent rounded-lg transition-all duration-300 hover:border-blue-400 px-4 py-2 mb-8"
                  >
                    <p
                      class="font-light leading-relaxed"
                      v-text="
                        props.formData.contact_description ||
                        defaultContactData.contact_description
                      "
                    ></p>
                    <button
                      @click="openFieldEditor('contact_description')"
                      class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-110"
                      title="Modifier la description"
                    >
                      <Icon
                        class="w-4 h-4"
                        name="heroicons-outline:pencil-alt"
                      />
                    </button>
                  </div>

                  <div class="space-y-5 mt-8">
                    <!-- Téléphone éditable -->
                    <div
                      class="relative border-2 border-transparent rounded-lg transition-all duration-300 hover:border-blue-400 px-4 py-2"
                    >
                      <div class="flex items-start">
                        <Icon
                          name="heroicons-outline:phone"
                          class="h-5 w-5 mr-3 mt-0.5"
                        />
                        <div>
                          <p
                            class="text-xs font-medium uppercase tracking-wide mb-1"
                          >
                            Appelez-nous
                          </p>
                          <p
                            class="text-sm"
                            v-text="
                              props.formData.phone_number ||
                              defaultContactData.phone_number
                            "
                          ></p>
                        </div>
                      </div>
                      <button
                        @click="openFieldEditor('phone_number')"
                        class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-110"
                        title="Modifier le numéro de téléphone"
                      >
                        <Icon
                          class="w-4 h-4"
                          name="heroicons-outline:pencil-alt"
                        />
                      </button>
                    </div>

                    <!-- Email éditable -->
                    <div
                      class="relative border-2 border-transparent rounded-lg transition-all duration-300 hover:border-blue-400 px-4 py-2"
                    >
                      <div class="flex items-start">
                        <Icon
                          name="heroicons-outline:mail"
                          class="h-5 w-5 mr-3 mt-0.5"
                        />
                        <div>
                          <p
                            class="text-xs font-medium uppercase tracking-wide mb-1"
                          >
                            Envoyez-nous un email
                          </p>
                          <p
                            class="text-sm"
                            v-text="
                              props.formData.contact_email ||
                              defaultContactData.contact_email
                            "
                          ></p>
                        </div>
                      </div>
                      <button
                        @click="openFieldEditor('contact_email')"
                        class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-110"
                        title="Modifier l'adresse email"
                      >
                        <Icon
                          class="w-4 h-4"
                          name="heroicons-outline:pencil-alt"
                        />
                      </button>
                    </div>

                    <!-- Adresse éditable -->
                    <div
                      class="relative border-2 border-transparent rounded-lg transition-all duration-300 hover:border-blue-400 px-4 py-2"
                    >
                      <div class="flex items-start">
                        <Icon
                          name="heroicons-outline:location-marker"
                          class="h-5 w-5 mr-3 mt-0.5"
                        />
                        <div>
                          <p
                            class="text-xs font-medium uppercase tracking-wide mb-1"
                          >
                            Notre adresse
                          </p>
                          <p
                            class="text-sm whitespace-pre-line"
                            v-text="
                              props.formData.contact_address ||
                              defaultContactData.contact_address
                            "
                          ></p>
                        </div>
                      </div>
                      <button
                        @click="openFieldEditor('contact_address')"
                        class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-110"
                        title="Modifier l'adresse"
                      >
                        <Icon
                          class="w-4 h-4"
                          name="heroicons-outline:pencil-alt"
                        />
                      </button>
                    </div>
                  </div>

                  <!-- Social media -->
                  <div class="mt-16">
                    <h4
                      class="text-sm uppercase tracking-wider mb-5 font-medium"
                    >
                      Suivez-nous
                    </h4>

                    <div class="space-y-3">
                      <!-- Facebook URL éditable -->
                      <div
                        class="relative border-2 border-transparent rounded-lg transition-all duration-300 hover:border-blue-400 px-4 py-2"
                      >
                        <div class="flex items-center">
                          <Icon name="mdi:facebook" class="h-5 w-5 mr-3" />
                          <span
                            class="text-sm overflow-hidden text-ellipsis"
                            v-text="props.formData.facebook_url || 'Non défini'"
                          ></span>
                        </div>
                        <button
                          @click="openFieldEditor('facebook_url')"
                          class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-110"
                          title="Modifier l'URL Facebook"
                        >
                          <Icon
                            class="w-4 h-4"
                            name="heroicons-outline:pencil-alt"
                          />
                        </button>
                      </div>

                      <!-- Instagram URL éditable -->
                      <div
                        class="relative border-2 border-transparent rounded-lg transition-all duration-300 hover:border-blue-400 px-4 py-2"
                      >
                        <div class="flex items-center">
                          <Icon name="mdi:instagram" class="h-5 w-5 mr-3" />
                          <span
                            class="text-sm overflow-hidden text-ellipsis"
                            v-text="
                              props.formData.instagram_url || 'Non défini'
                            "
                          ></span>
                        </div>
                        <button
                          @click="openFieldEditor('instagram_url')"
                          class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-110"
                          title="Modifier l'URL Instagram"
                        >
                          <Icon
                            class="w-4 h-4"
                            name="heroicons-outline:pencil-alt"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Form Panel -->
                <div class="lg:w-3/5 xl:w-2/3 p-8 md:p-12">
                  <!-- Prévisualisation du formulaire (non éditable) -->
                  <div class="space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div class="relative">
                        <label class="block text-sm font-medium mb-1"
                          >Prénom</label
                        >
                        <input
                          type="text"
                          class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Votre prénom"
                          disabled
                        />
                      </div>
                      <div class="relative">
                        <label class="block text-sm font-medium mb-1"
                          >Nom</label
                        >
                        <input
                          type="text"
                          class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Votre nom"
                          disabled
                        />
                      </div>
                    </div>
                    <div class="relative">
                      <label class="block text-sm font-medium mb-1"
                        >Email</label
                      >
                      <input
                        type="email"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Votre adresse email"
                        disabled
                      />
                    </div>
                    <div class="relative">
                      <label class="block text-sm font-medium mb-1"
                        >Message</label
                      >
                      <textarea
                        rows="4"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Votre message"
                        disabled
                      ></textarea>
                    </div>
                    <!-- Texte du bouton éditable -->
                    <div
                      class="relative border-2 border-transparent rounded-lg transition-all duration-300 hover:border-blue-400 px-4 py-2 inline-block"
                    >
                      <button
                        type="button"
                        class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        v-text="
                          props.formData.contact_button_text ||
                          defaultContactData.contact_button_text
                        "
                      ></button>
                      <button
                        @click="openFieldEditor('contact_button_text')"
                        class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-110"
                        title="Modifier le texte du bouton"
                      >
                        <Icon
                          class="w-4 h-4"
                          name="heroicons-outline:pencil-alt"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'édition de champ -->
    <div
      v-if="showFieldModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showFieldModal = false"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            Modifier {{ getFieldLabel(currentField) }}
          </h3>
          <button
            @click="showFieldModal = false"
            class="text-gray-400 hover:text-gray-500"
          >
            <Icon name="heroicons-outline:x" class="h-5 w-5" />
          </button>
        </div>

        <input
          v-if="isSimpleTextField(currentField)"
          v-model="tempFieldValue"
          type="text"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          @keyup.enter="saveFieldValue"
          ref="fieldInput"
        />
        <textarea
          v-else
          v-model="tempFieldValue"
          rows="4"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          ref="fieldInput"
        ></textarea>

        <div class="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            @click="showFieldModal = false"
          >
            <Icon name="heroicons-outline:x" class="mr-1.5 h-4 w-4" />
            Annuler
          </button>
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            @click="saveFieldValue"
          >
            <Icon name="heroicons-outline:check" class="mr-1.5 h-4 w-4" />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";

const props = defineProps({
  formData: Object,
});

const emit = defineEmits(["update:formData"]);

// Valeurs par défaut pour la section contact
const defaultContactData = {
  contact_visible: "true",
  contact_title: "Nous sommes à votre écoute",
  contact_subtitle: "Informations de contact",
  contact_description:
    "Nous sommes à votre écoute. N'hésitez pas à nous contacter pour toute question.",
  phone_number: "01 23 45 67 89",
  contact_email: "contact@example.com",
  contact_address: "12 rue de l'Exemple\n75000 Paris\nFrance",

  contact_button_text: "Envoyer",

  facebook_url: "https://facebook.com/",
  instagram_url: "https://instagram.com/",
};

// État des modals
const showFieldModal = ref(false);
const currentField = ref("");
const tempFieldValue = ref("");
const fieldInput = ref(null);

// Fonction pour ouvrir l'éditeur de champ
const openFieldEditor = (field) => {
  currentField.value = field;
  tempFieldValue.value =
    props.formData[field] || defaultContactData[field] || "";
  showFieldModal.value = true;

  // Focus sur le champ d'entrée après l'ouverture du modal
  nextTick(() => {
    if (fieldInput.value) {
      fieldInput.value.focus();
      if (fieldInput.value.select) {
        fieldInput.value.select();
      }
    }
  });
};

// Fonction pour enregistrer la valeur du champ
const saveFieldValue = () => {
  emit("update:formData", {
    ...props.formData,
    [currentField.value]: tempFieldValue.value,
  });
  showFieldModal.value = false;
};

// Fonction pour basculer la visibilité de la section contact
const toggleContactVisibility = () => {
  const newValue = props.formData.contact_visible === "true" ? "false" : "true";
  emit("update:formData", {
    ...props.formData,
    contact_visible: newValue,
  });
};

// Obtenir le libellé du champ
const getFieldLabel = (field) => {
  const labels = {
    contact_title: "le titre principal",
    contact_subtitle: "le titre des informations",
    contact_description: "la description",
    phone_number: "le numéro de téléphone",
    contact_email: "l'adresse email",
    contact_address: "l'adresse",
    contact_button_text: "le texte du bouton",
    facebook_url: "l'URL Facebook",
    instagram_url: "l'URL Instagram",
  };
  return labels[field] || field;
};

// Vérifier si c'est un champ de texte simple
const isSimpleTextField = (field) => {
  const textareaFields = ["contact_description", "contact_address"];
  return !textareaFields.includes(field);
};
</script>

<style scoped>
/* Animation de pulse lente pour les boutons d'action */
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s infinite;
}
</style>