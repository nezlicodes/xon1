<template>
  <div class="space-y-3">
    <!-- Language Tabs -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div class="flex items-center gap-2 mb-2">
        <Icon
          name="heroicons-outline:translate"
          class="w-5 h-5 text-blue-600"
        />
        <label class="text-sm font-medium text-gray-700">
          Langue d'édition
        </label>
      </div>
    </div>

    <!-- Prévisualisation de la section Témoignages avec édition en direct -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg relative">
      <!-- Toggle visibility button -->
      <button
        @click="toggleTestimonialsVisibility"
        class="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        :title="
          sectionData.is_active
            ? 'Masquer la section témoignages'
            : 'Afficher la section témoignages'
        "
      >
        <Icon
          v-if="sectionData.is_active"
          class="h-5 w-5 text-gray-700"
          name="heroicons-outline:eye"
        />
        <Icon
          v-else
          class="h-5 w-5 text-gray-700"
          name="heroicons-outline:eye-off"
        />
      </button>

      <!-- Show collapsed placeholder when section is hidden -->
      <div
        v-if="!sectionData.is_active"
        class="flex items-center justify-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg"
      >
        <div class="text-center">
          <Icon
            name="heroicons-outline:information-circle"
            class="mx-auto h-12 w-12 text-gray-400"
          />
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            Section "Témoignages" masquée
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Cliquez sur l'icône d'œil pour afficher cette section
          </p>
        </div>
      </div>

      <!-- Content when visible -->
      <div
        v-if="sectionData.is_active"
        class="relative bg-primary text-contrast1 p-6"
      >
        <!-- Titre et sous-titre -->
        <div class="mt-12 mb-8 text-center">
          <!-- Titre éditable avec bouton d'édition toujours visible -->
          <div
            class="relative border-2 border-transparent rounded-lg transition-all duration-300 hover:border-blue-400 px-4 py-2"
          >
            <h2
              class="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3"
            >
              {{ getCurrentContent().title || defaultContent.title }}
            </h2>
            <button
              type="button"
              @click="openFieldEditor('title')"
              class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-110"
              title="Modifier le titre"
            >
              <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
            </button>
            <div class="text-xs text-blue-200 opacity-75 mt-1 text-center">
              Cliquez pour modifier le titre
            </div>
          </div>

          <!-- Sous-titre éditable -->
          <div
            class="relative border-2 border-transparent rounded-lg transition-all duration-300 hover:border-blue-400 px-4 py-2 mt-2"
          >
            <p
              class="text-base md:text-lg text-foreground/60 max-w-2xl mx-auto"
            >
              {{ getCurrentContent().subtitle || defaultContent.subtitle }}
            </p>
            <button
              type="button"
              @click="openFieldEditor('subtitle')"
              class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-110"
              title="Modifier le sous-titre"
            >
              <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
            </button>
            <div class="text-xs text-blue-200 opacity-75 mt-1 text-center">
              Cliquez pour modifier le sous-titre
            </div>
          </div>
        </div>

        <!-- Aperçu simplifié des témoignages (non éditable) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div
            v-for="n in 3"
            :key="`testimonial-preview-${n}`"
            class="bg-contrast1 text-mgray rounded-xl p-6 shadow-sm border flex flex-col"
          >
            <div class="flex-grow">
              <div class="flex justify-center mb-6">
                <blockquote class="relative">
                  <svg
                    class="absolute top-0 left-0 transform -translate-x-6 -translate-y-8 h-16 w-16 text-gray-200 opacity-75"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18C6.15392 12.6333 5.52552 12.86 4.76621 12.86C3.84979 12.86 3.09047 12.5533 2.48825 11.94C1.91222 11.3267 1.62421 10.4467 1.62421 9.31999C1.62421 8.21332 1.96459 7.16665 2.64535 6.17999C3.35231 5.16665 4.33418 4.31999 5.59098 3.63999L6.4943 5.08799C5.81354 5.53332 5.26369 6.01332 4.84476 6.51999C4.45201 7.00799 4.19017 7.53332 4.05926 8.09999C4.29491 7.96665 4.56983 7.89999 4.88402 7.89999C5.61716 7.89999 6.21938 8.12665 6.68997 8.57999C7.16055 9.01332 7.39762 9.59999 7.39762 10.3ZM14.6242 10.3C14.6242 11.0733 14.3755 11.7 13.878 12.18C13.3805 12.6333 12.7521 12.86 11.9928 12.86C11.0764 12.86 10.3171 12.5533 9.71484 11.94C9.13881 11.3267 8.85079 10.4467 8.85079 9.31999C8.85079 8.21332 9.19117 7.16665 9.87194 6.17999C10.5789 5.16665 11.5608 4.31999 12.8176 3.63999L13.7209 5.08799C13.0401 5.53332 12.4903 6.01332 12.0714 6.51999C11.6786 7.00799 11.4168 7.53332 11.2858 8.09999C11.5215 7.96665 11.7964 7.89999 12.1106 7.89999C12.8437 7.89999 13.446 8.12665 13.9166 8.57999C14.3872 9.01332 14.6242 9.59999 14.6242 10.3Z"
                      fill="currentColor"
                    />
                  </svg>
                  <p class="relative z-10 text-mgray italic">
                    "Exemple de témoignage client. Ceci est une représentation
                    de ce à quoi ressemblera la section."
                  </p>
                </blockquote>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-gray-100">
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div class="ml-4">
                  <h4 class="text-mgray font-medium">Nom du client</h4>
                  <p class="text-mgray text-sm">Titre / Entreprise</p>
                </div>
                <div class="ml-auto flex">
                  <template v-for="i in 5" :key="`star-${i}`">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="w-4 h-4"
                      :class="i <= 5 ? 'text-yellow-400' : 'text-gray-200'"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lien vers la page de gestion des témoignages -->
        <div class="mt-8 text-center">
          <NuxtLink
            to="/admin/testimonials"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Icon name="heroicons-outline:document-text" class="w-5 h-5 mr-2" />
            Gérer tous les témoignages
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Loading/Saving indicator -->
    <div
      v-if="loading || saving"
      class="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50"
    >
      <Icon name="heroicons-outline:refresh" class="w-4 h-4 animate-spin" />
      <span class="text-sm">{{
        loading ? "Chargement..." : "Enregistrement..."
      }}</span>
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
          v-if="currentField === 'title'"
          v-model="tempFieldValue"
          type="text"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          @keyup.enter="saveFieldValue"
          ref="fieldInput"
        />

        <ClientOnly v-else-if="currentField === 'subtitle'">
          <textarea
            v-model="tempFieldValue"
            rows="3"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            ref="fieldInput"
          />
          <template #fallback>
            <div
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-24 bg-gray-50 flex items-center justify-center text-gray-400 text-sm"
            >
              Chargement de l'éditeur...
            </div>
          </template>
        </ClientOnly>

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
            :disabled="saving"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            @click="saveFieldValue"
          >
            <Icon
              :name="
                saving ? 'heroicons-outline:refresh' : 'heroicons-outline:check'
              "
              class="mr-1.5 h-4 w-4"
              :class="{ 'animate-spin': saving }"
            />
            {{ saving ? "Enregistrement..." : "Enregistrer" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { fetchSection } = useContentSections();
const supabase = useSupabaseClient();
const { showError } = useErrorModal();
const { showSuccess } = useSuccessSnackbar();

// Language management
const { editorLanguage } = useEditorLanguage();

// Default content
const defaultContent = {
  title: "Ce Que Disent Nos Clients",
  subtitle: "Découvrez les expériences de nos clients satisfaits",
};

// State
const loading = ref(true);
const saving = ref(false);
const sectionData = ref({
  section_key: "testimonials",
  section_type: "hero",
  is_active: true,
  content_translations: {
    en: { ...defaultContent },
    fr: { ...defaultContent },
    ar: { ...defaultContent },
  },
});

// Modal state
const showFieldModal = ref(false);
const currentField = ref("");
const tempFieldValue = ref("");
const fieldInput = ref(null);

// Get current language content
const getCurrentContent = () => {
  return (
    sectionData.value.content_translations?.[editorLanguage.value] ||
    defaultContent
  );
};

// Load section data
const loadSectionData = async () => {
  loading.value = true;
  try {
    const { data, error } = await fetchSection("testimonials");

    if (error) throw error;

    if (data) {
      sectionData.value = data;
      // Ensure all languages have content
    } else {
      // Create default section if it doesn't exist
      const { data: newSection, error: createError } = await supabase
        .from("content_sections")
        .insert({
          section_key: "testimonials",
          section_type: "hero",
          content_translations: {
            en: { ...defaultContent },
            fr: { ...defaultContent },
            ar: { ...defaultContent },
          },
          is_active: true,
          display_order: 4,
        })
        .select()
        .single();

      if (createError) throw createError;
      sectionData.value = newSection;
    }
  } catch (error) {
    console.error("Error loading testimonials section:", error);
    showError("Impossible de charger les données de la section témoignages");
  } finally {
    loading.value = false;
  }
};

// Save section data
const saveSectionData = async () => {
  saving.value = true;
  try {
    const { data, error } = await supabase
      .from("content_sections")
      .upsert(
        {
          section_key: "testimonials",
          section_type: "hero",
          content_translations: sectionData.value.content_translations,
          is_active: sectionData.value.is_active,
          display_order: 4,
        },
        {
          onConflict: "section_key",
        }
      )
      .select()
      .single();

    if (error) throw error;

    sectionData.value = data;
    showSuccess("Section témoignages enregistrée avec succès");
  } catch (error) {
    console.error("Error saving testimonials section:", error);
    showError("Erreur lors de l'enregistrement de la section témoignages");
  } finally {
    saving.value = false;
  }
};

// Toggle section visibility
const toggleTestimonialsVisibility = async () => {
  sectionData.value.is_active = !sectionData.value.is_active;
  await saveSectionData();
};

// Open field editor
const openFieldEditor = (field) => {
  currentField.value = field;
  tempFieldValue.value = getCurrentContent()[field] || defaultContent[field];
  showFieldModal.value = true;

  nextTick(() => {
    if (fieldInput.value) {
      fieldInput.value.focus();
      if (fieldInput.value.select) {
        fieldInput.value.select();
      }
    }
  });
};

// Save field value
const saveFieldValue = async () => {
  if (!sectionData.value.content_translations[editorLanguage.value]) {
    sectionData.value.content_translations[editorLanguage.value] = {};
  }

  sectionData.value.content_translations[editorLanguage.value][
    currentField.value
  ] = tempFieldValue.value;
  showFieldModal.value = false;
  await saveSectionData();
};

// Get field label
const getFieldLabel = (field) => {
  const labels = {
    title: "le titre",
    subtitle: "le sous-titre",
  };
  return labels[field] || field;
};

// Load data on mount
onMounted(async () => {
  await loadSectionData();
});
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