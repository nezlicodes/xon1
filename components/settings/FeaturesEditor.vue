<template>
  <div class="space-y-3">
    <!-- Preview Section -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg relative">
      <!-- Toggle visibility button -->
      <button
        @click="toggleFeaturesVisibility"
        class="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
        :title="
          sectionData.is_active
            ? 'Masquer la section fonctionnalités'
            : 'Afficher la section fonctionnalités'
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

      <!-- Collapsed placeholder when hidden -->
      <div
        v-if="!sectionData.is_active"
        class="flex items-center justify-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg"
      >
        <div class="text-center">
          <Icon
            name="heroicons-outline:sparkles"
            class="mx-auto h-12 w-12 text-gray-400"
          />
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            Section "Fonctionnalités" masquée
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Cliquez sur l'icône d'œil pour afficher cette section
          </p>
        </div>
      </div>

      <!-- Content when visible -->
      <div
        v-if="sectionData.is_active"
        class="relative bg-primary text-contrast1 p-8"
      >
        <div class="max-w-7xl mx-auto">
          <!-- Features Grid -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div
              v-for="(feature, index) in getCurrentFeatures()"
              :key="`feature-${index}`"
              class="relative flex flex-col items-center text-center space-y-3 p-4 rounded-lg border-2 border-transparent transition-all duration-300 hover:border-blue-400"
            >
              <!-- Icon Display (non-editable) -->
              <div
                class="icon-wrapper text-secondary flex items-center justify-center w-16 h-16 rounded-full bg-contrast1/10"
              >
                <Icon :name="feature.icon" class="w-8 h-8" />
              </div>

              <!-- Editable Title -->
              <div class="w-full">
                <h3 class="text-xl font-bold leading-tight mb-1">
                  {{ feature.title }}
                </h3>
              </div>

              <!-- Editable Description -->
              <div class="w-full">
                <p class="text-sm font-medium opacity-80">
                  {{ feature.description }}
                </p>
              </div>

              <!-- Edit Button -->
              <button
                type="button"
                @click="openFeatureEditor(index)"
                class="absolute -top-2 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-110"
                title="Modifier la fonctionnalité"
              >
                <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
              </button>

              <div class="text-xs text-blue-200 opacity-75">
                Cliquez pour modifier
              </div>
            </div>
          </div>
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

    <!-- Feature Edit Modal -->
    <div
      v-if="showFeatureModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showFeatureModal = false"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            Modifier la fonctionnalité #{{ editingFeatureIndex + 1 }}
          </h3>
          <button
            @click="showFeatureModal = false"
            class="text-gray-400 hover:text-gray-500"
          >
            <Icon name="heroicons-outline:x" class="h-5 w-5" />
          </button>
        </div>

        <div class="space-y-4">
          <!-- Icon Preview (non-editable) -->
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div
              class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center"
            >
              <Icon :name="tempFeature.icon" class="w-6 h-6 text-blue-600" />
            </div>
            <div class="text-sm text-gray-600">
              <p class="font-medium">Icône</p>
              <p class="text-xs">{{ tempFeature.icon }}</p>
            </div>
          </div>

          <!-- Title Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Titre
            </label>
            <input
              v-model="tempFeature.title"
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Ex: 100M+"
              ref="titleInput"
            />
          </div>

          <!-- Description Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              v-model="tempFeature.description"
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Ex: produits vendus"
            />
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            @click="showFeatureModal = false"
          >
            <Icon name="heroicons-outline:x" class="mr-1.5 h-4 w-4" />
            Annuler
          </button>
          <button
            type="button"
            :disabled="saving"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            @click="saveFeature"
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

// Default features
const defaultFeatures = [
  {
    icon: "ph:users-three-fill",
    title: "100M+",
    description: "produits vendus",
  },
  {
    icon: "ph:globe-hemisphere-west-fill",
    title: "60+ pays",
    description: "couverts",
  },
  {
    icon: "ph:package-fill",
    title: "Livraison DZ",
    description: "rapide & sécurisée",
  },
  {
    icon: "ph:headset-fill",
    title: "Support 24/7",
    description: "toujours disponible",
  },
];

// State
const loading = ref(true);
const saving = ref(false);
const sectionData = ref({
  section_key: "features",
  section_type: "features",
  is_active: true,
  content_translations: {
    en: { features: [...defaultFeatures] },
    fr: { features: [...defaultFeatures] },
    ar: { features: [...defaultFeatures] },
  },
});

// Modal state
const showFeatureModal = ref(false);
const editingFeatureIndex = ref(-1);
const tempFeature = ref({
  icon: "",
  title: "",
  description: "",
});
const titleInput = ref(null);

// Get current language features
const getCurrentFeatures = () => {
  return (
    sectionData.value.content_translations?.[editorLanguage.value]?.features ||
    defaultFeatures
  );
};

// Load section data
const loadSectionData = async () => {
  loading.value = true;
  try {
    const { data, error } = await fetchSection("features");

    if (error) throw error;

    if (data) {
      sectionData.value = data;
    } else {
      // Create default section if it doesn't exist
      const { data: newSection, error: createError } = await supabase
        .from("content_sections")
        .insert({
          section_key: "features",
          section_type: "features",
          content_translations: {
            en: { features: [...defaultFeatures] },
            fr: { features: [...defaultFeatures] },
            ar: { features: [...defaultFeatures] },
          },
          is_active: true,
          display_order: 3,
        })
        .select()
        .single();

      if (createError) throw createError;
      sectionData.value = newSection;
    }
  } catch (error) {
    console.error("Error loading features section:", error);
    showError(
      "Impossible de charger les données de la section fonctionnalités"
    );
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
          section_key: "features",
          section_type: "features",
          content_translations: sectionData.value.content_translations,
          is_active: sectionData.value.is_active,
          display_order: 3,
        },
        {
          onConflict: "section_key",
        }
      )
      .select()
      .single();

    if (error) throw error;

    sectionData.value = data;
    showSuccess("Section fonctionnalités enregistrée avec succès");
  } catch (error) {
    console.error("Error saving features section:", error);
    showError("Erreur lors de l'enregistrement de la section fonctionnalités");
  } finally {
    saving.value = false;
  }
};

// Toggle section visibility
const toggleFeaturesVisibility = async () => {
  sectionData.value.is_active = !sectionData.value.is_active;
  await saveSectionData();
};

// Open feature editor
const openFeatureEditor = (index) => {
  editingFeatureIndex.value = index;
  const features = getCurrentFeatures();
  tempFeature.value = { ...features[index] };
  showFeatureModal.value = true;

  nextTick(() => {
    if (titleInput.value) {
      titleInput.value.focus();
      if (titleInput.value.select) {
        titleInput.value.select();
      }
    }
  });
};

// Save feature
const saveFeature = async () => {
  if (!sectionData.value.content_translations[editorLanguage.value]) {
    sectionData.value.content_translations[editorLanguage.value] = {
      features: [...defaultFeatures],
    };
  }

  const features = [...getCurrentFeatures()];
  features[editingFeatureIndex.value] = { ...tempFeature.value };
  sectionData.value.content_translations[editorLanguage.value].features =
    features;

  showFeatureModal.value = false;
  await saveSectionData();
};

// Load data on mount
onMounted(async () => {
  await loadSectionData();
});
</script>

<style scoped>
.icon-wrapper {
  backdrop-filter: blur(10px);
}
</style>