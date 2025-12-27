<template>
  <div class="grid grid-cols-1 relative bg-gray-50 min-h-screen">
    <div class="pb-20">
      <div class="max-w-7xl mx-auto">
        <!-- Header with Language Selector -->
        <div
          class="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200 px-3 sm:px-6 py-4 mb-8"
        >
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 class="text-2xl font-medium text-gray-800">
                Éditeur - Page À propos
              </h1>
              <p class="text-sm text-gray-500 mt-1">
                Modifiez le contenu de votre page À propos en temps réel
              </p>
            </div>

            <!-- Global Language Selector -->
            <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <div class="flex items-center gap-2">
                <Icon
                  name="heroicons-outline:translate"
                  class="w-5 h-5 text-blue-600"
                />
                <span class="text-sm font-medium text-gray-700">Langue:</span>
              </div>
              <div class="flex gap-2">
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  @click="setLanguage(lang.code)"
                  type="button"
                  :class="[
                    'px-4 py-2 rounded-md text-sm font-medium transition-all',
                    editorLanguage === lang.code
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500 ring-offset-2'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300',
                  ]"
                >
                  {{ lang.flag }} {{ lang.name }}
                </button>
              </div>
            </div>
          </div>

          <!-- Language Info Banner -->
          <div
            class="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2"
          >
            <Icon
              name="heroicons-outline:information-circle"
              class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
            />
            <div class="text-sm text-blue-800">
              <p class="font-medium">
                Vous modifiez actuellement la version
                <strong>{{
                  languages.find((l) => l.code === editorLanguage)?.name
                }}</strong>
              </p>
              <p class="text-blue-600 mt-1">
                Les modifications sont enregistrées automatiquement.
              </p>
            </div>
          </div>
        </div>

        <!-- Editor Components -->
        <div class="space-y-6 px-3 sm:px-6">
          <SettingsAboutHeroEditor />
          <SettingsAboutFeaturesEditor />
          <SettingsAboutStoryEditor />
          <SettingsAboutMissionVisionEditor />
          <SettingsAboutValuesEditor />
          <SettingsAboutCertificationsEditor />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { editorLanguage, setLanguage } = useEditorLanguage();

const languages = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ar", name: "العربية", flag: "🇩🇿" },
  { code: "en", name: "English", flag: "🇬🇧" },
];

useHead({
  title: "Éditeur - Page À propos",
  meta: [
    { name: "description", content: "Gérez le contenu de votre page À propos" },
  ],
});
</script>