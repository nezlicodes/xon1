<template>
  <div class="max-w-7xl pt-6 mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header with improved design -->
    <div class="mb-8">
      <div class="flex items-center">
        <div class="mr-3">
          <div class="p-2 bg-blue-50 rounded-lg">
            <Icon name="heroicons-outline:cog" class="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 leading-tight">
            Paramètres du site
          </h1>
          <p class="mt-1 text-sm text-gray-600">
            Gérez la configuration et le contenu de votre site Web
          </p>
        </div>
      </div>
    </div>

    <!-- State loading with improved animation -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="flex flex-col items-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"
        ></div>
        <p class="mt-4 text-sm text-gray-600">Chargement des paramètres...</p>
      </div>
    </div>

    <div v-else class="relative">
      <!-- Improved settings navigation with pill-style design -->
      <div
        class="bg-gray-50 rounded-xl p-1.5 border border-gray-200 overflow-x-auto hide-scrollbar mb-6"
      >
        <nav class="flex space-x-1 min-w-max">
          <button
            v-for="section in sections"
            :key="section"
            @click="currentSection = section"
            class="whitespace-nowrap px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200"
            :class="[
              currentSection === section
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:bg-white/50 hover:text-gray-900',
            ]"
          >
            <div class="flex items-center">
              <!-- Section icon based on section name -->
              <span v-if="section === 'general'" class="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              <span v-else-if="section === 'appearance'" class="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              <span v-else-if="section === 'content'" class="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              <span v-else-if="section === 'seo'" class="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              {{ formatSection(section) }}
            </div>
          </button>
        </nav>
      </div>

      <!-- Visual divider between categories with optional instructions -->
      <div
        v-if="currentSection && currentSettings.length > 0"
        class="mb-6 flex items-center"
      >
        <h2 class="text-lg font-medium text-gray-900">
          {{ formatSection(currentSection) }}
        </h2>
      </div>

      <!-- Settings form with card design -->
      <form @submit.prevent="saveSettings" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            v-for="setting in currentSettings"
            :key="setting.key"
            class="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl border border-gray-200 overflow-hidden"
          >
            <div class="px-5 py-5">
              <div class="space-y-1 mb-4">
                <div class="flex justify-between items-start">
                  <label
                    :for="setting.key"
                    class="block text-base font-medium text-gray-900"
                  >
                    {{ setting.label }}
                  </label>
                  <!-- Add tooltip for more info -->
                </div>
                <p v-if="setting.description" class="text-sm text-gray-500">
                  {{ setting.description }}
                </p>
              </div>

              <!-- Text input with improved visual design -->
              <div v-if="setting.type === 'text'" class="relative rounded-md">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M13.293 3.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-9 9a1 1 0 01-.39.242l-3 1a1 1 0 01-1.266-1.265l1-3a1 1 0 01.242-.391l9-9zM14 4l2 2-9 9-3 1 1-3 9-9z"
                      clip-rule="evenodd"
                    />
                    <path
                      d="M12.146 6.354l-1.5-1.5a1 1 0 10-1.414 1.414l1.5 1.5a1 1 0 101.414-1.414z"
                    />
                  </svg>
                </div>
                <input
                  :id="setting.key"
                  v-model="formData[setting.key]"
                  type="text"
                  class="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  :placeholder="setting.label"
                />
              </div>

              <!-- Textarea with improved visual design -->
              <div
                v-else-if="setting.type === 'textarea'"
                class="relative rounded-md"
              >
                <textarea
                  :id="setting.key"
                  v-model="formData[setting.key]"
                  rows="4"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  :placeholder="setting.label"
                ></textarea>
              </div>

              <!-- Image upload with improved visual design -->
              <div v-else-if="setting.type === 'image'" class="mt-1">
                <div
                  class="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4"
                >
                  <div
                    class="w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div
                      v-if="uploadingFiles[setting.key]"
                      class="h-32 w-full sm:w-32 flex items-center justify-center"
                    >
                      <div
                        class="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"
                      ></div>
                    </div>
                    <div
                      v-else-if="formData[setting.key]"
                      class="relative h-32 w-full sm:w-32"
                    >
                      <NuxtImg
                        :src="formData[setting.key]"
                        :alt="setting.label"
                        class="h-32 w-full sm:w-32 object-cover"
                      />
                      <button
                        type="button"
                        @click="removeImage(setting.key)"
                        class="absolute top-1 right-1 bg-red-100 text-red-600 rounded-full p-1 shadow-sm hover:bg-red-200 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                    <div
                      v-else
                      class="flex items-center justify-center h-32 w-full sm:w-32 bg-gray-50"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-12 w-12 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.5"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="flex flex-wrap gap-2">
                      <label
                        :for="`file-${setting.key}`"
                        class="inline-flex items-center px-4 py-2 border border-blue-500 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                        :class="{
                          'opacity-50 cursor-not-allowed':
                            uploadingFiles[setting.key],
                        }"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
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
                    </div>
                    <p class="mt-2 text-xs text-gray-500">
                      <span class="font-medium">Formats acceptés:</span> PNG,
                      JPG
                    </p>
                    <p class="text-xs text-gray-500">
                      <span class="font-medium">Taille recommandée:</span>
                      1200x630px
                    </p>
                    <p
                      v-if="uploadErrors[setting.key]"
                      class="mt-2 text-sm text-red-600 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      {{ uploadErrors[setting.key] }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Boolean switch with improved design -->
              <div v-else-if="setting.type === 'boolean'" class="mt-2">
                <label class="inline-flex items-center">
                  <div class="relative inline-flex items-center">
                    <input
                      :id="setting.key"
                      v-model="formData[setting.key]"
                      type="checkbox"
                      class="sr-only"
                    />
                    <div
                      class="w-12 h-6 bg-gray-200 rounded-full shadow-inner transition-colors"
                      :class="{ 'bg-blue-600': formData[setting.key] }"
                    ></div>
                    <div
                      class="absolute left-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 shadow transform transition-transform"
                      :class="{ 'translate-x-6': formData[setting.key] }"
                    ></div>
                  </div>
                  <span
                    class="ml-3 text-sm font-medium transition-colors"
                    :class="
                      formData[setting.key] ? 'text-blue-600' : 'text-gray-500'
                    "
                  >
                    {{ formData[setting.key] ? "Activé" : "Désactivé" }}
                  </span>
                </label>
              </div>

              <!-- Color picker with improved design -->
              <div v-else-if="setting.type === 'color'" class="mt-2">
                <div class="flex gap-4">
                  <div class="relative">
                    <input
                      :id="setting.key"
                      :value="hexColor[setting.key] || '#000000'"
                      @input="updateColorFromHex($event, setting.key)"
                      type="color"
                      class="h-12 w-40 rounded border border-gray-300"
                    />
                    <div class="mt-1 text-xs font-mono text-gray-600">
                      {{ hexColor[setting.key] || "#000000" }}
                    </div>
                  </div>
                  <div class="space-y-2">
                    <div class="grid grid-cols-3 gap-2">
                      <div class="relative">
                        <input
                          v-model="rgbColor[setting.key].r"
                          type="number"
                          min="0"
                          max="255"
                          @input="updateColorFromRGB(setting.key)"
                          class="pl-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div class="relative">
                        <input
                          v-model="rgbColor[setting.key].g"
                          type="number"
                          min="0"
                          max="255"
                          @input="updateColorFromRGB(setting.key)"
                          class="pl-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div class="relative">
                        <input
                          v-model="rgbColor[setting.key].b"
                          type="number"
                          min="0"
                          max="255"
                          @input="updateColorFromRGB(setting.key)"
                          class="pl-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- JSON editor with improved design -->
              <div v-else-if="setting.type === 'json'" class="mt-2">
                <div class="relative">
                  <div class="absolute top-0 right-0 p-2 flex space-x-1">
                    <button
                      type="button"
                      @click="formatJson(setting.key)"
                      class="p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                      title="Formater JSON"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div
                    class="rounded-lg overflow-hidden border border-gray-300 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500"
                  >
                    <textarea
                      :id="setting.key"
                      v-model="jsonEditors[setting.key]"
                      rows="6"
                      class="font-mono block w-full border-0 p-3 text-xs sm:text-sm focus:ring-0"
                      :class="{ 'bg-red-50': jsonErrors[setting.key] }"
                      @input="handleJsonInput(setting.key)"
                    ></textarea>
                  </div>
                </div>
                <div
                  class="mt-2 flex items-center"
                  :class="
                    jsonErrors[setting.key] ? 'text-red-600' : 'text-gray-500'
                  "
                >
                  <svg
                    v-if="jsonErrors[setting.key]"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="text-xs">{{
                    jsonErrors[setting.key]
                      ? jsonErrors[setting.key]
                      : "JSON valide"
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Save button redesigned with animation and status feedback -->
        <div>
          <div class="w-full border bg-white px-4 sm:px-6">
            <div
              class="py-1 bg-white/80 backdrop-blur-sm border-t border-gray-200 md:py-6"
            >
              <div class="flex items-center justify-between">
                <div class="hidden sm:block">
                  <div
                    v-if="hasFormChanges"
                    class="flex items-center text-sm text-blue-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      />
                    </svg>
                    Modifications non enregistrées
                  </div>
                </div>
                <div class="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                  <button
                    type="button"
                    class="inline-flex justify-center items-center px-4 py-2 w-full sm:w-auto border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    @click="fetchSettings"
                    :disabled="saving"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    :disabled="saving || hasErrors || !hasFormChanges"
                    class="inline-flex justify-center items-center px-6 py-2 w-full sm:w-auto border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                    :class="[
                      saving
                        ? 'bg-blue-500'
                        : hasErrors
                        ? 'bg-gray-400 cursor-not-allowed'
                        : !hasFormChanges
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700',
                    ]"
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
                    <svg
                      v-else-if="hasFormChanges && !hasErrors && !saving"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    {{
                      saving
                        ? "Enregistrement..."
                        : "Enregistrer les modifications"
                    }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Success notification popup -->
        <div
          v-if="showSuccessNotification"
          class="fixed bottom-4 right-4 z-50 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center"
        >
          <Icon name="heroicons-outline:check" class="h-6 w-6 mr-2" />
          Paramètres enregistrés avec succès!
        </div>
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
const currentSection = ref("");
const hexColor = ref({});
const rgbColor = ref({});

// Obtenir les sections uniques des paramètres
const sections = computed(() => {
  let sets = [...new Set(settings.value.map((s) => s.category))];

  if (!currentSection.value) {
    currentSection.value = sets[0];
  }
  return sets;
});

const currentSettings = computed(() => {
  return settings.value
    .filter((s) => s.category === currentSection.value)
    .sort((a, b) =>
      a.label.localeCompare(b.label, "fr", { sensitivity: "base" })
    );
});

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

// Formater le nom de la section pour l'affichage
const formatSection = (section) => {
  if (section === "Accueil") {
    return "Accueil";
  }

  return section
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

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

const fetchSettings = async () => {
  try {
    const { data, error } = await supabase
      .from("website_settings")
      .select("*")
      .eq("user_id", user.value.id)
      .in("key", [
        "primary_color",
        "primary_contrast_color",
        "site_name",
        "site_description",
        "site_favicon",
        "site_logo",
        "body_bg",
        "text_color",
      ])
      .order("category", { ascending: true });

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

      // Initialiser les valeurs de couleur
      if (setting.type === "color") {
        // Vérifier plusieurs formats possibles pour les couleurs
        const rgbMatch = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(setting.value);
        const commaMatch = /^(\d+),\s*(\d+),\s*(\d+)$/.exec(setting.value);
        const hexMatch = /^#?([0-9A-Fa-f]{6})$/.exec(setting.value);

        let r, g, b;

        if (rgbMatch) {
          // Format rgb(r,g,b)
          r = parseInt(rgbMatch[1]);
          g = parseInt(rgbMatch[2]);
          b = parseInt(rgbMatch[3]);
          acc[setting.key] = `${r}, ${g}, ${b}`;
        } else if (commaMatch) {
          // Format r, g, b
          r = parseInt(commaMatch[1]);
          g = parseInt(commaMatch[2]);
          b = parseInt(commaMatch[3]);
          // Déjà au bon format
        } else if (hexMatch) {
          // Format hex
          const hex = hexMatch[1];
          r = parseInt(hex.substring(0, 2), 16);
          g = parseInt(hex.substring(2, 4), 16);
          b = parseInt(hex.substring(4, 6), 16);
          acc[setting.key] = `${r}, ${g}, ${b}`;
        } else {
          // Valeur par défaut si format inconnu
          r = 0;
          g = 0;
          b = 0;
          acc[setting.key] = "0, 0, 0";
        }

        // Mettre à jour rgbColor et hexColor
        rgbColor.value[setting.key] = { r, g, b };
        hexColor.value[setting.key] = rgbToHex(r, g, b);
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
  title: "Paramètres du site",
  meta: [
    {
      name: "description",
      content: "Gérez la configuration et le contenu de votre site Web",
    },
  ],
});
</script>