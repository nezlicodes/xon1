<template>
  <div class="max-w-7xl pt-6 mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header with mobile-friendly layout -->
    <div class="mb-8">
      <div class="flex items-center">
        <div class="mr-3">
          <div class="p-2 bg-blue-50 rounded-lg">
            <Icon name="heroicons-outline:star" class="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 leading-tight">
            Politiques de retour et d'expédition
          </h1>
          <p class="mt-1 text-sm text-gray-600">
            Gérez les politiques de retour et d'expédition de votre boutique
          </p>
        </div>
      </div>
    </div>

    <!-- State loading with proper centering -->
    <div v-if="loading" class="flex justify-center py-8 md:py-12">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
    </div>

    <div v-else class="relative">
      <!-- Settings form -->
      <form @submit.prevent="saveSettings" class="mt-4 md:mt-8">
        <div class="grid grid-cols-1 gap-4 md:gap-6">
          <div
            v-for="setting in settings"
            :key="setting.key"
            class="bg-white shadow sm:rounded-lg overflow-hidden"
          >
            <div class="px-3 py-4 sm:p-6">
              <div class="space-y-1 mb-3 md:mb-4">
                <label
                  :for="setting.key"
                  class="block text-sm font-medium text-gray-900"
                >
                  {{ setting.label }}
                </label>
                <p
                  v-if="setting.description"
                  class="text-xs md:text-sm text-gray-500"
                >
                  {{ setting.description }}
                </p>
              </div>

              <!-- Text input -->
              <input
                v-if="setting.type === 'text'"
                :id="setting.key"
                v-model="formData[setting.key]"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />

              <ClientOnly v-else-if="setting.type === 'textarea'">
                <PluginsRichText
                  v-model:content="formData[setting.key]"
                  :readonly="loading"
                />
                <template #fallback>
                  <div
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-24 bg-gray-50 flex items-center justify-center text-gray-400 text-sm"
                  >
                    Chargement de l'éditeur...
                  </div>
                </template>
              </ClientOnly>

              <!-- Image upload with mobile-friendly layout -->
              <div v-else-if="setting.type === 'image'" class="mt-1">
                <div
                  class="flex flex-col sm:flex-row sm:items-start sm:space-x-4"
                >
                  <div
                    v-if="formData[setting.key]"
                    class="mb-3 sm:mb-0 flex-shrink-0"
                  >
                    <div
                      v-if="uploadingFiles[setting.key]"
                      class="h-24 w-24 sm:h-32 sm:w-32 flex items-center justify-center bg-gray-100 rounded-lg"
                    >
                      <div
                        class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
                      ></div>
                    </div>
                    <NuxtImg
                      v-else
                      :src="formData[setting.key]"
                      :alt="setting.label"
                      class="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-lg"
                    />
                  </div>
                  <div class="flex-1">
                    <div class="flex flex-wrap gap-2">
                      <label
                        :for="`file-${setting.key}`"
                        class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                        :class="{
                          'opacity-50 cursor-not-allowed':
                            uploadingFiles[setting.key],
                        }"
                      >
                        <span v-if="uploadingFiles[setting.key]"
                          >Téléchargement...</span
                        >
                        <span v-else>Choisir un fichier</span>
                        <input
                          :id="`file-${setting.key}`"
                          type="file"
                          class="hidden"
                          accept="image/*"
                          @change="handleImageUpload($event, setting.key)"
                          :disabled="uploadingFiles[setting.key]"
                        />
                      </label>
                      <button
                        v-if="
                          formData[setting.key] && !uploadingFiles[setting.key]
                        "
                        type="button"
                        @click="removeImage(setting.key)"
                        class="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                      >
                        Supprimer
                      </button>
                    </div>
                    <p class="mt-2 text-xs md:text-sm text-gray-500">
                      Taille recommandée : 1200x630px (PNG, JPG)
                    </p>
                    <p
                      v-if="uploadErrors[setting.key]"
                      class="mt-1 text-sm text-red-600"
                    >
                      {{ uploadErrors[setting.key] }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Boolean switch -->
              <div v-else-if="setting.type === 'boolean'" class="mt-1">
                <!-- Switch styled for better touch target size on mobile -->
                <label class="inline-flex items-center">
                  <div
                    class="relative inline-block w-10 mr-2 align-middle select-none"
                  >
                    <input
                      :id="setting.key"
                      v-model="formData[setting.key]"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div
                      class="h-6 w-10 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300"
                    ></div>
                    <div
                      class="absolute left-0.5 top-0.5 h-5 w-5 bg-white rounded-full shadow transform peer-checked:translate-x-4 transition-transform"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-600">Activé</span>
                </label>
              </div>

              <!-- JSON editor with improved spacing and format -->
              <div v-else-if="setting.type === 'json'" class="mt-1">
                <textarea
                  :id="setting.key"
                  v-model="jsonEditors[setting.key]"
                  rows="6"
                  class="font-mono block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm"
                  @input="handleJsonInput(setting.key)"
                ></textarea>
                <p
                  v-if="jsonErrors[setting.key]"
                  class="mt-1 text-sm text-red-600"
                >
                  {{ jsonErrors[setting.key] }}
                </p>
                <!-- Format button for JSON inputs -->
                <button
                  type="button"
                  @click="formatJson(setting.key)"
                  class="mt-2 text-xs text-blue-600 hover:text-blue-500"
                >
                  Formater JSON
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Save button (sticky on mobile) -->
        <div
          class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:static md:bg-transparent md:border-0 md:flex md:justify-end md:mt-8 z-10"
        >
          <button
            type="submit"
            :disabled="saving || hasErrors || !hasFormChanges"
            class="w-full md:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg
              v-if="saving"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {{ saving ? "Enregistrement..." : "Enregistrer les modifications" }}
          </button>
        </div>
        <!-- Add padding at the bottom for mobile to account for fixed save button -->
        <div class="h-16 md:hidden"></div>
      </form>
    </div>
  </div>
</template>

<script setup>
const user = useSupabaseUser();
const supabase = useSupabaseClient();

// Obtenir des composants utilitaires
const { showSuccess } = useSuccessSnackbar();
const { showError } = useErrorModal();

// État
const loading = ref(true);
const saving = ref(false);
const uploadingFiles = reactive({});
const uploadErrors = reactive({});
const settings = ref([]);
const formData = ref({});
const originalFormData = ref({});
const jsonEditors = ref({});
const jsonErrors = ref({});
const hexColor = ref({});
const rgbColor = ref({});

// Mettre à jour formData (utilisé par SettingsHeaderEditor)
const updateFormData = async (newData) => {
  formData.value = { ...newData };
  await saveSettings();
};

// Vérifier les erreurs JSON
const hasErrors = computed(() => {
  return Object.values(jsonErrors.value).some((error) => error);
});

// Vérifier si le formulaire a été modifié
const hasFormChanges = computed(() => {
  // Pas de changements si les données ne sont pas encore chargées
  if (Object.keys(originalFormData.value).length === 0) return false;

  for (const key in formData.value) {
    // Comparer les valeurs originales avec les valeurs actuelles
    if (typeof formData.value[key] === "object") {
      // Pour les objets (comme JSON), comparer la représentation en chaîne
      if (
        JSON.stringify(formData.value[key]) !==
        JSON.stringify(originalFormData.value[key])
      ) {
        return true;
      }
    } else {
      // Pour les types primitifs, comparer directement
      if (formData.value[key] !== originalFormData.value[key]) {
        return true;
      }
    }
  }
  return false;
});

// Convertir hex en RGB
const hexToRGB = (hex) => {
  // Remove the # if present
  hex = hex.replace("#", "");

  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
};

// Convertir RGB en hex
const rgbToHex = (r, g, b) => {
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
};

// Mettre à jour la couleur lorsque l'entrée hex change
const updateColorFromHex = (event, key) => {
  const hexValue = event.target.value;
  hexColor.value[key] = hexValue;

  // Update RGB values
  const rgb = hexToRGB(hexValue);
  rgbColor.value[key] = rgb;

  // Store RGB as string "r, g, b" in formData
  formData.value[key] = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
};

// Mettre à jour la couleur lorsque les entrées RGB changent
const updateColorFromRGB = (key) => {
  const rgb = rgbColor.value[key];
  if (!rgb) return;

  // Ensure values are numbers and in range
  rgb.r = Math.max(0, Math.min(255, parseInt(rgb.r) || 0));
  rgb.g = Math.max(0, Math.min(255, parseInt(rgb.g) || 0));
  rgb.b = Math.max(0, Math.min(255, parseInt(rgb.b) || 0));

  // Update hex value
  hexColor.value[key] = rgbToHex(rgb.r, rgb.g, rgb.b);

  // Store RGB as string "r, g, b" in formData
  formData.value[key] = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
};

// Format JSON for better readability
const formatJson = (key) => {
  try {
    const parsed = JSON.parse(jsonEditors.value[key]);
    jsonEditors.value[key] = JSON.stringify(parsed, null, 2);
    formData.value[key] = parsed;
    jsonErrors.value[key] = null;
  } catch (error) {
    jsonErrors.value[key] = "Format JSON invalide";
  }
};

const fetchSettings = async () => {
  try {
    const { data, error } = await supabase
      .from("website_settings")
      .select("*")
      .eq("user_id", user.value.id) // Filtrer par l'utilisateur connecté
      .in("key", ["return_policy", "shipping_policy", "policies_visible"]); // Filtrer par les clés spécifiques
    if (error) throw error;

    settings.value = data;

    formData.value = data.reduce((acc, setting) => {
      acc[setting.key] = setting.value;

      if (setting.type === "json") {
        jsonEditors.value[setting.key] = JSON.stringify(
          typeof setting.value === "string"
            ? JSON.parse(setting.value)
            : setting.value,
          null,
          2
        );
      }

      return acc;
    }, {});

    originalFormData.value = JSON.parse(JSON.stringify(formData.value));
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres:", error);
    showError("Impossible de charger les paramètres");
  } finally {
    loading.value = false;
  }
};

// Gérer le téléchargement d'image
const handleImageUpload = async (event, key) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Reset error state
  uploadErrors[key] = null;
  uploadingFiles[key] = true;

  try {
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image must be less than 5MB");
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${key}-${Date.now()}.${fileExt}`;
    const filePath = `settings/${fileName}`;

    // Delete old file if exists
    if (formData.value[key]) {
      const oldFileName = formData.value[key].split("/").pop();
      if (oldFileName) {
        await supabase.storage.from("site").remove([`settings/${oldFileName}`]);
      }
    }

    // Upload new file
    const { error: uploadError } = await supabase.storage
      .from("site")
      .upload(filePath, file, {
        upsert: true,
        cacheControl: "3600",
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("site").getPublicUrl(filePath);

    // Update form data
    formData.value[key] = publicUrl;
  } catch (error) {
    console.error("Upload error:", error);
    uploadErrors[key] = error.message || "Error uploading image";
  } finally {
    uploadingFiles[key] = false;
    // Reset file input
    event.target.value = "";
  }
};

// Supprimer une image
const removeImage = async (key) => {
  if (!formData.value[key]) return;

  uploadingFiles[key] = true;
  uploadErrors[key] = null;

  try {
    const fileName = formData.value[key].split("/").pop();
    if (!fileName) throw new Error("Invalid filename");

    const { error } = await supabase.storage
      .from("site")
      .remove([`settings/${fileName}`]);

    if (error) throw error;

    formData.value[key] = "";
  } catch (error) {
    console.error("Deletion error:", error);
    uploadErrors[key] = "Could not delete image";
  } finally {
    uploadingFiles[key] = false;
  }
};

// Gérer les modifications de l'entrée JSON
const handleJsonInput = (key) => {
  try {
    const parsed = JSON.parse(jsonEditors.value[key]);
    formData.value[key] = parsed;
    jsonErrors.value[key] = null;
  } catch (error) {
    jsonErrors.value[key] = "Format JSON invalide";
  }
};

const saveSettings = async () => {
  try {
    saving.value = true;

    const updates = [];

    for (const setting of settings.value) {
      // Handle form values that may be null or undefined
      let valueToSave = formData.value[setting.key];

      // Convert booleans to strings
      if (typeof valueToSave === "boolean") {
        valueToSave = valueToSave.toString();
      }

      // Convert JSON objects to strings
      if (typeof valueToSave === "object" && valueToSave !== null) {
        valueToSave = JSON.stringify(valueToSave);
      }

      // Use empty string if value is null or undefined
      if (valueToSave === null || valueToSave === undefined) {
        valueToSave = "";
      }

      updates.push({
        user_id: setting.user_id,
        template_id: setting.template_id,
        key: setting.key,
        value: valueToSave,
        type: setting.type,
        category: setting.category,
        label: setting.label,
        description: setting.description,
      });
    }

    const { error } = await supabase.from("website_settings").upsert(updates, {
      onConflict: ["user_id", "key"],
    });

    if (error) throw error;

    showSuccess("Settings saved successfully");
  } catch (error) {
    console.error("Error saving settings:", error.message);
    showError("Failed to save settings");
  } finally {
    saving.value = false;
  }
};

// Initialisation
onMounted(fetchSettings);

useHead({
  title: "Politiques de retour et d'expédition",
  meta: [
    {
      name: "description",
      content: "Gérez la configuration et le contenu de votre site Web",
    },
  ],
});
</script>