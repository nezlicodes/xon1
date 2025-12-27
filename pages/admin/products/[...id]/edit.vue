<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              Modifier le produit
            </h1>
            <p class="mt-2 text-sm text-gray-600">
              Modifiez les informations du produit. Les champs en anglais sont
              obligatoires.
            </p>
          </div>
          <NuxtLink
            to="/admin/products"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Retour
          </NuxtLink>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loadingProduct" class="flex justify-center items-center h-64">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"
        ></div>
      </div>

      <!-- Form -->
      <form v-else-if="form" @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Language Switcher -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center gap-2 border-b pb-4">
            <button
              v-for="lang in languages"
              :key="lang.code"
              type="button"
              @click="currentLang = lang.code"
              class="px-4 py-2 rounded-lg font-medium transition-colors"
              :class="
                currentLang === lang.code
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              "
            >
              {{ lang.flag }} {{ lang.name }}
              <span v-if="lang.code === 'en'" class="ml-1 text-red-300">*</span>
            </button>
          </div>
        </div>

        <!-- Basic Information -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">
            Informations de base
          </h2>

          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Nom du produit ({{ getCurrentLangName() }})
                <span v-if="currentLang === 'en'" class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name_translations[currentLang]"
                type="text"
                :required="currentLang === 'en'"
                :disabled="loading"
                @input="handleNameInput"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <p v-if="currentLang !== 'en'" class="mt-1 text-xs text-gray-500">
                Optionnel - Le nom en anglais est requis
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Slug (URL)</label
              >
              <input
                v-model="form.slug"
                type="text"
                required
                :disabled="loading"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <p class="mt-1 text-sm text-gray-500">
                URL: /products/{{ form.slug }}
              </p>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div v-if="categoriesEnabled">
                <label class="block text-sm font-medium text-gray-700"
                  >Catégorie</label
                >
                <select
                  v-model="form.category_id"
                  :disabled="loading"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Aucune catégorie</option>
                  <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ getCategoryName(category) }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Référence (SKU)</label
                >
                <input
                  v-model="form.sku"
                  type="text"
                  :disabled="loading"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Description ({{ getCurrentLangName() }})</label
              >
              <ClientOnly>
                <PluginsRichText
                  v-model:content="form.description_translations[currentLang]"
                  :readonly="loading"
                  placeholder="Entrez la description du produit..."
                />
                <template #fallback>
                  <div
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-24 bg-gray-50 flex items-center justify-center text-gray-400 text-sm"
                  >
                    Chargement de l'éditeur...
                  </div>
                </template>
              </ClientOnly>
            </div>
          </div>
        </div>

        <!-- Pricing & Inventory -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">
            Prix et inventaire
          </h2>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Prix (DZD) *</label
              >
              <input
                v-model.number="form.price"
                type="number"
                step="0.01"
                min="0"
                required
                :disabled="loading"
                @input="updateVariantPrices"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Prix comparatif (DZD)</label
              >
              <input
                v-model.number="form.compare_at_price"
                type="number"
                step="0.01"
                min="0"
                :disabled="loading"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Quantité en stock *</label
              >
              <input
                v-model.number="form.quantity"
                type="number"
                min="0"
                required
                :disabled="loading"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        <!-- Media (Images & Videos) -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Médias</h2>

          <!-- Media Type Tabs -->
          <div class="border-b border-gray-200 mb-6">
            <nav class="-mb-px flex space-x-8">
              <button
                type="button"
                @click="activeMediaTab = 'images'"
                :class="[
                  activeMediaTab === 'images'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                ]"
              >
                📸 Images ({{ existingImages.length + imageFiles.length }})
              </button>
              <button
                type="button"
                @click="activeMediaTab = 'videos'"
                :class="[
                  activeMediaTab === 'videos'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                ]"
              >
                🎥 Vidéos ({{ existingVideos.length + videoFiles.length }})
              </button>
            </nav>
          </div>

          <!-- Images Tab -->
          <div v-if="activeMediaTab === 'images'">
            <!-- Existing Images -->
            <div v-if="existingImages.length > 0" class="mb-6">
              <h3 class="text-sm font-medium text-gray-700 mb-3">
                Images actuelles
              </h3>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div
                  v-for="(image, index) in existingImages"
                  :key="image.id"
                  class="relative group"
                >
                  <NuxtImg
                    :src="image.url"
                    class="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    @click="removeExistingImage(index)"
                    class="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <span
                    v-if="image.is_primary"
                    class="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded"
                  >
                    Principale
                  </span>
                </div>
              </div>
            </div>

            <!-- New Images -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ajouter des images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                @change="handleImageUpload"
                :disabled="loading || uploadingMedia"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />

              <!-- Preview new images -->
              <div
                v-if="imageFiles.length > 0"
                class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                <div
                  v-for="(file, index) in imageFiles"
                  :key="index"
                  class="relative group"
                >
                  <NuxtImg
                    :src="getImagePreview(file)"
                    class="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    @click="removeNewImage(index)"
                    class="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Videos Tab -->
          <div v-if="activeMediaTab === 'videos'">
            <!-- Existing Videos -->
            <div v-if="existingVideos.length > 0" class="mb-6">
              <h3 class="text-sm font-medium text-gray-700 mb-3">
                Vidéos actuelles
              </h3>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div
                  v-for="(video, index) in existingVideos"
                  :key="video.id"
                  class="relative group"
                >
                  <video
                    :src="video.url"
                    class="w-full h-32 object-cover rounded-lg"
                    preload="metadata"
                  ></video>
                  <button
                    type="button"
                    @click="removeExistingVideo(index)"
                    class="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition z-10"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div class="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
                    {{ formatVideoDuration(video.duration) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- New Videos -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ajouter des vidéos
              </label>
              <input
                type="file"
                multiple
                accept="video/*"
                @change="handleVideoUpload"
                :disabled="loading || uploadingMedia"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p class="mt-1 text-sm text-gray-500">
                Formats acceptés: MP4, WebM, MOV. Taille maximale: 50MB par vidéo.
              </p>

              <!-- Preview new videos -->
              <div
                v-if="videoFiles.length > 0"
                class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                <div
                  v-for="(video, index) in videoPreviews"
                  :key="index"
                  class="relative group"
                >
                  <video
                    :src="video.url"
                    class="w-full h-32 object-cover rounded-lg"
                    preload="metadata"
                  ></video>
                  <button
                    type="button"
                    @click="removeNewVideo(index)"
                    class="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition z-10"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div class="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
                    {{ formatVideoDuration(video.duration) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Variants -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900">
              Variantes du produit
            </h2>
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="form.has_variants"
                :disabled="loading"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700"
                >Activer les variantes</span
              >
            </label>
          </div>

          <div v-if="form.has_variants" class="space-y-6">
            <!-- Options -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-gray-700">Options</h3>
                <button
                  type="button"
                  @click="addOption"
                  :disabled="loading"
                  class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  + Ajouter une option
                </button>
              </div>

              <div
                v-for="(option, optionIndex) in form.options"
                :key="optionIndex"
                class="mb-6 p-4 border-2 border-gray-200 rounded-lg"
              >
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Nom de l'option ({{ getCurrentLangName() }})
                      <span v-if="currentLang === 'en'" class="text-red-500"
                        >*</span
                      >
                    </label>
                    <input
                      v-model="option.name_translations[currentLang]"
                      type="text"
                      :placeholder="
                        currentLang === 'en'
                          ? 'e.g., Color, Size'
                          : currentLang === 'fr'
                          ? 'ex: Couleur, Taille'
                          : 'مثال: اللون، الحجم'
                      "
                      :required="currentLang === 'en'"
                      :disabled="loading"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <p
                      v-if="currentLang !== 'en'"
                      class="mt-1 text-xs text-gray-500"
                    >
                      Optionnel - Le nom en anglais est requis
                    </p>
                  </div>
                  <button
                    type="button"
                    @click="removeOption(optionIndex)"
                    :disabled="loading"
                    class="ml-4 mt-7 text-red-600 hover:text-red-700"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <label class="block text-sm font-medium text-gray-700">
                      Valeurs
                    </label>
                  </div>

                  <!-- Existing values with full translation support -->
                  <div
                    v-for="(value, valueIndex) in option.values"
                    :key="`value-${optionIndex}-${valueIndex}`"
                    class="p-3 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div class="flex items-start justify-between mb-3">
                      <span class="text-xs font-medium text-gray-700"
                        >Valeur {{ valueIndex + 1 }}</span
                      >
                      <button
                        type="button"
                        @click="removeOptionValue(optionIndex, valueIndex)"
                        :disabled="loading"
                        class="text-red-600 hover:text-red-700"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <!-- Translation fields for each value -->
                    <div class="grid grid-cols-1 gap-3">
                      <div>
                        <label
                          :for="`value-en-${optionIndex}-${valueIndex}`"
                          class="block text-xs text-gray-600 mb-1"
                        >
                          🇬🇧 English *
                        </label>
                        <input
                          :id="`value-en-${optionIndex}-${valueIndex}`"
                          v-model="value.value_translations.en"
                          type="text"
                          required
                          :disabled="loading"
                          @input="regenerateVariantsDebounced"
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label
                          :for="`value-fr-${optionIndex}-${valueIndex}`"
                          class="block text-xs text-gray-600 mb-1"
                        >
                          🇫🇷 Français
                        </label>
                        <input
                          :id="`value-fr-${optionIndex}-${valueIndex}`"
                          v-model="value.value_translations.fr"
                          type="text"
                          :disabled="loading"
                          @input="regenerateVariantsDebounced"
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label
                          :for="`value-ar-${optionIndex}-${valueIndex}`"
                          class="block text-xs text-gray-600 mb-1"
                        >
                          🇩🇿 العربية
                        </label>
                        <input
                          :id="`value-ar-${optionIndex}-${valueIndex}`"
                          v-model="value.value_translations.ar"
                          type="text"
                          :disabled="loading"
                          @input="regenerateVariantsDebounced"
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Add new value input -->
                  <div class="flex gap-2">
                    <input
                      v-model="option.newValue"
                      type="text"
                      :placeholder="
                        currentLang === 'en'
                          ? 'Add new value...'
                          : currentLang === 'fr'
                          ? 'Ajouter nouvelle valeur...'
                          : 'إضافة قيمة جديدة...'
                      "
                      :disabled="loading"
                      @keyup.enter.prevent="addOptionValue(optionIndex)"
                      class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      @click="addOptionValue(optionIndex)"
                      :disabled="loading || !option.newValue"
                      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Duplicate variant error -->
            <div
              v-if="duplicateVariantError"
              class="p-3 bg-red-50 border border-red-200 rounded-md"
            >
              <div class="flex items-start">
                <svg
                  class="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
                <p class="text-sm text-red-700">{{ duplicateVariantError }}</p>
              </div>
            </div>

            <!-- Generate Variants Button -->
            <button
              type="button"
              @click="generateVariants"
              :disabled="loading || form.options.length === 0"
              class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Générer les variantes
            </button>

            <!-- Variants List -->
            <div v-if="form.variants.length > 0" class="mt-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-gray-700">
                  Variantes générées ({{ form.variants.length }})
                </h3>
                <button
                  type="button"
                  @click="showVariants = !showVariants"
                  class="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                >
                  <svg
                    class="w-4 h-4 mr-1 transition-transform"
                    :class="{ 'rotate-180': showVariants }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  {{ showVariants ? "Masquer" : "Afficher" }}
                </button>
              </div>

              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-[2000px]"
                leave-active-class="transition-all duration-300 ease-in"
                leave-from-class="opacity-100 max-h-[2000px]"
                leave-to-class="opacity-0 max-h-0"
              >
                <div v-if="showVariants" class="space-y-4 overflow-hidden">
                  <div
                    v-for="(variant, index) in form.variants"
                    :key="index"
                    class="p-4 border rounded-lg"
                  >
                    <!-- Variant translations -->
                    <div class="space-y-3 mb-4">
                      <div>
                        <label class="block text-xs font-medium text-gray-700"
                          >🇬🇧 Nom (English) *</label
                        >
                        <input
                          v-model="variant.name_translations.en"
                          type="text"
                          required
                          :disabled="loading"
                          @keydown.enter.prevent
                          class="mt-1 block w-full rounded-md border-gray-300 text-sm"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-700"
                          >🇫🇷 Nom (Français)</label
                        >
                        <input
                          v-model="variant.name_translations.fr"
                          type="text"
                          :disabled="loading"
                          @keydown.enter.prevent
                          class="mt-1 block w-full rounded-md border-gray-300 text-sm"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-700"
                          >🇩🇿 Nom (العربية)</label
                        >
                        <input
                          v-model="variant.name_translations.ar"
                          type="text"
                          :disabled="loading"
                          @keydown.enter.prevent
                          class="mt-1 block w-full rounded-md border-gray-300 text-sm"
                        />
                      </div>
                    </div>

                    <!-- Other variant fields -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label class="block text-xs font-medium text-gray-700"
                          >Prix</label
                        >
                        <input
                          v-model.number="variant.price"
                          type="number"
                          step="0.01"
                          :disabled="loading"
                          @keydown.enter.prevent
                          class="mt-1 block w-full rounded-md border-gray-300 text-sm"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-700"
                          >SKU</label
                        >
                        <input
                          v-model="variant.sku"
                          type="text"
                          :disabled="loading"
                          @keydown.enter.prevent
                          class="mt-1 block w-full rounded-md border-gray-300 text-sm"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-700"
                          >Stock</label
                        >
                        <input
                          v-model.number="variant.quantity"
                          type="number"
                          :disabled="loading"
                          @keydown.enter.prevent
                          class="mt-1 block w-full rounded-md border-gray-300 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- Status -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Statut</h2>

          <div class="space-y-4">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="form.is_active"
                :disabled="loading"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">Produit actif</span>
            </label>

            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="form.is_featured"
                :disabled="loading"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700"
                >Produit en vedette</span
              >
            </label>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex items-center justify-end gap-4">
          <NuxtLink
            to="/admin/products"
            class="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Annuler
          </NuxtLink>
          <button
            type="submit"
            :disabled="loading || uploadingMedia"
            class="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {{
              loading ? "Enregistrement..." : "Enregistrer les modifications"
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const route = useRoute();
const router = useRouter();

// Language state - English first as required
const currentLang = ref("en");
const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ar", name: "العربية", flag: "🇩🇿" },
];

const getCurrentLangName = () => {
  return languages.find((l) => l.code === currentLang.value)?.name || "English";
};

const getCategoryName = (category) => {
  if (
    category.name_translations &&
    typeof category.name_translations === "object"
  ) {
    return (
      category.name_translations[currentLang.value] ||
      category.name_translations.en ||
      category.name_translations.fr ||
      ""
    );
  }
  return category.name || "";
};

const formatVideoDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// State
const loadingProduct = ref(true);
const loading = ref(false);
const uploadingMedia = ref(false);
const activeMediaTab = ref('images');
const categories = ref([]);
const categoriesEnabled = ref(true);
const productId = route.params.id[0];

const showVariants = ref(true);
const duplicateVariantError = ref("");

// Form data
const form = ref(null);

// Images
const existingImages = ref([]);
const imagesToDelete = ref([]);
const imageFiles = ref([]);
const imagePreviews = ref([]);

// Videos
const existingVideos = ref([]);
const videosToDelete = ref([]);
const videoFiles = ref([]);
const videoPreviews = ref([]);

// Fetch features config
const fetchFeaturesConfig = async () => {
  try {
    const { data } = await supabase
      .from("features_config")
      .select("categories_enabled")
      .single();

    if (data) {
      categoriesEnabled.value = data.categories_enabled;
    }
  } catch (err) {
    console.error("Error fetching features config:", err);
  }
};

// Fetch categories
const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name_translations, slug")
      .eq("is_active", true)
      .order("display_order");

    if (error) throw error;
    categories.value = data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

// Fetch product with variants and their option values
const fetchProduct = async () => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        images:product_images(*),
        videos:product_videos(*),
        options:product_option_types(
          id,
          name_translations,
          display_order,
          values:product_option_values(id, value_translations, display_order)
        ),
        variants:product_variants(
          id,
          name_translations,
          sku,
          price,
          compare_at_price,
          quantity,
          is_active
        )
      `
      )
      .eq("id", productId)
      .single();

    if (error) throw error;
    if (!data) {
      alert("Produit non trouvé");
      router.push("/admin/products");
      return;
    }

    // Initialize form
    form.value = {
      name_translations: data.name_translations || { en: "", fr: "", ar: "" },
      description_translations: data.description_translations || {
        en: "",
        fr: "",
        ar: "",
      },
      slug: data.slug || "",
      category_id: data.category_id || "",
      sku: data.sku || "",
      price: data.price || 0,
      compare_at_price: data.compare_at_price || null,
      quantity: data.quantity || 0,
      meta_title_translations: data.meta_title_translations || {
        en: "",
        fr: "",
        ar: "",
      },
      meta_description_translations: data.meta_description_translations || {
        en: "",
        fr: "",
        ar: "",
      },
      is_active: data.is_active || false,
      is_featured: data.is_featured || false,
      has_variants: data.has_variants || false,
      options: (data.options || [])
        .sort((a, b) => a.display_order - b.display_order)
        .map((opt) => ({
          id: opt.id,
          name_translations: opt.name_translations || { en: "", fr: "", ar: "" },
          values: (opt.values || [])
            .sort((a, b) => a.display_order - b.display_order)
            .map((val) => ({
              id: val.id,
              value_translations: val.value_translations || {
                en: "",
                fr: "",
                ar: "",
              },
            })),
          newValue: "",
        })),
      variants: (data.variants || []).map((v) => ({
        id: v.id,
        name_translations: v.name_translations || { en: "", fr: "", ar: "" },
        sku: v.sku || "",
        price: parseFloat(v.price) || 0,
        compare_at_price: v.compare_at_price ? parseFloat(v.compare_at_price) : null,
        quantity: parseInt(v.quantity) || 0,
        is_active: v.is_active || true,
      })),
    };

    existingImages.value = data.images || [];
    existingVideos.value = (data.videos || []).sort((a, b) => a.position - b.position);

    console.log("Loaded variants:", form.value.variants.length);
    console.log("Loaded videos:", existingVideos.value.length);
  } catch (error) {
    console.error("Error fetching product:", error);
    alert("Erreur lors du chargement du produit");
  } finally {
    loadingProduct.value = false;
  }
};

// Handle name input
const handleNameInput = () => {
  // Only auto-generate slug from English name if slug is empty
  if (!form.value.slug && form.value.name_translations.en) {
    form.value.slug = slugify(form.value.name_translations.en);
  }
};

// Slugify function
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

// Get video duration
const getVideoDuration = (file) => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(Math.round(video.duration));
    };
    
    video.onerror = () => {
      resolve(0);
    };
    
    video.src = URL.createObjectURL(file);
  });
};

// Image handling
const handleImageUpload = (event) => {
  const files = Array.from(event.target.files);
  imageFiles.value = [...imageFiles.value, ...files];

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviews.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  });
};

const getImagePreview = (file) => {
  const index = imageFiles.value.indexOf(file);
  return imagePreviews.value[index];
};

const removeNewImage = (index) => {
  imageFiles.value.splice(index, 1);
  imagePreviews.value.splice(index, 1);
};

const removeExistingImage = (index) => {
  const image = existingImages.value[index];
  imagesToDelete.value.push(image.id);
  existingImages.value.splice(index, 1);
};

// Video handling
const handleVideoUpload = async (event) => {
  const files = Array.from(event.target.files);
  
  uploadingMedia.value = true;
  
  try {
    for (const file of files) {
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        alert("La taille de la vidéo ne doit pas dépasser 50MB");
        continue;
      }

      // Check file type
      if (!file.type.startsWith('video/')) {
        alert("Seuls les fichiers vidéo sont acceptés");
        continue;
      }

      // Get video duration
      const duration = await getVideoDuration(file);

      const reader = new FileReader();
      await new Promise((resolve) => {
        reader.onload = (e) => {
          videoPreviews.value.push({
            url: e.target.result,
            duration,
            mime_type: file.type,
          });
          resolve();
        };
        reader.readAsDataURL(file);
      });

      videoFiles.value.push(file);
    }
  } catch (error) {
    console.error("Erreur lors du traitement des vidéos:", error);
    alert("Échec du traitement des vidéos. Veuillez réessayer.");
  } finally {
    uploadingMedia.value = false;
  }
};

const removeNewVideo = (index) => {
  videoFiles.value.splice(index, 1);
  videoPreviews.value.splice(index, 1);
};

const removeExistingVideo = (index) => {
  const video = existingVideos.value[index];
  videosToDelete.value.push(video.id);
  existingVideos.value.splice(index, 1);
};

// Upload new images
const uploadImages = async () => {
  if (imageFiles.value.length === 0) return [];

  uploadingMedia.value = true;

  try {
    const uploadPromises = imageFiles.value.map(async (file, index) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("site")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("site").getPublicUrl(filePath);

      return {
        url: publicUrl,
        alt_text_translations: { en: "", fr: "", ar: "" },
        position: existingImages.value.length + index,
        is_primary: existingImages.value.length === 0 && index === 0,
      };
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    throw error;
  } finally {
    uploadingMedia.value = false;
  }
};

// Upload new videos
const uploadVideos = async () => {
  if (videoFiles.value.length === 0) return [];

  uploadingMedia.value = true;

  try {
    const uploadPromises = videoFiles.value.map(async (file, index) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `product-videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("site")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("site").getPublicUrl(filePath);

      const videoData = videoPreviews.value[index];

      return {
        url: publicUrl,
        thumbnail_url: null,
        alt_text_translations: { en: "", fr: "", ar: "" },
        position: existingVideos.value.length + index,
        duration: videoData.duration,
        mime_type: videoData.mime_type,
      };
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    throw error;
  } finally {
    uploadingMedia.value = false;
  }
};

// Variant handling
const addOption = () => {
  form.value.options.unshift({
    name_translations: { en: "", fr: "", ar: "" },
    values: [],
    newValue: "",
  });
};

const removeOption = (index) => {
  form.value.options.splice(index, 1);
  // Regenerate variants after removing option
  if (form.value.has_variants) {
    generateVariants();
  }
};

const updateVariantPrices = () => {
  if (form.value.variants.length > 0) {
    const newPrice = parseFloat(form.value.price) || 0;
    form.value.variants.forEach((variant) => {
      variant.price = newPrice;
    });
  }
};

const addOptionValue = (optionIndex) => {
  const option = form.value.options[optionIndex];
  if (option.newValue.trim()) {
    option.values.push({
      value_translations: {
        en: option.newValue.trim(),
        fr: "",
        ar: "",
      },
    });
    option.newValue = "";
    
    // Regenerate variants after adding value
    if (form.value.has_variants) {
      generateVariants();
    }
  }
};

const removeOptionValue = (optionIndex, valueIndex) => {
  form.value.options[optionIndex].values.splice(valueIndex, 1);
  
  // Regenerate variants after removing value
  if (form.value.has_variants) {
    generateVariants();
  }
};

const regenerateVariantsDebounced = useDebounce(() => {
  if (form.value.has_variants) {
    generateVariants();
  }
}, 300);

const generateVariants = () => {
  const options = form.value.options.filter((opt) => opt.values.length > 0);
  if (options.length === 0) {
    form.value.variants = [];
    return;
  }

  const combinations = cartesianProduct(options.map((opt) => opt.values));

  // Keep existing variant data where possible
  const existingVariantsMap = new Map(
    form.value.variants.map((v) => [v.name_translations.en, v])
  );

  const newVariants = combinations.map((combo) => {
    const nameEn = combo.map((v) => v.value_translations.en).join(" / ");
    const nameFr = combo.map((v) => v.value_translations.fr || v.value_translations.en).join(" / ");
    const nameAr = combo.map((v) => v.value_translations.ar || v.value_translations.en).join(" / ");

    // Check if this variant already exists
    const existingVariant = existingVariantsMap.get(nameEn);

    if (existingVariant) {
      // Preserve existing variant data
      return {
        ...existingVariant,
        name_translations: {
          en: nameEn,
          fr: nameFr,
          ar: nameAr,
        },
      };
    }

    // Create new variant
    return {
      name_translations: {
        en: nameEn,
        fr: nameFr,
        ar: nameAr,
      },
      sku: "",
      price: parseFloat(form.value.price) || 0,
      compare_at_price: null,
      quantity: 0,
      is_active: true,
      options: combo,
    };
  });

  // Check for duplicate names
  const variantNames = newVariants.map((v) =>
    (v.name_translations.en || "").toLowerCase()
  );
  const duplicates = variantNames.filter(
    (name, index) => variantNames.indexOf(name) !== index
  );

  if (duplicates.length > 0) {
    duplicateVariantError.value = `Attention: Des variantes avec des noms identiques ont été détectées. Veuillez modifier les options pour créer des variantes uniques.`;
  } else {
    duplicateVariantError.value = "";
  }

  form.value.variants = newVariants;
  console.log("Generated variants:", form.value.variants.length);
};

const cartesianProduct = (arrays) => {
  return arrays.reduce(
    (acc, array) => {
      return acc.flatMap((x) => array.map((y) => [...x, y]));
    },
    [[]]
  );
};

// Submit form
const handleSubmit = async () => {
  loading.value = true;

  try {
    // Validate variant quantities
    if (form.value.has_variants && form.value.variants.length > 0) {
      for (let i = 0; i < form.value.variants.length; i++) {
        const variant = form.value.variants[i];
        if (!variant.quantity || variant.quantity < 0) {
          alert(`La quantité de la variante "${variant.name_translations.en}" doit être un nombre positif.`);
          loading.value = false;
          return;
        }
        // Ensure quantity is an integer
        variant.quantity = parseInt(variant.quantity) || 0;
        variant.price = parseFloat(variant.price) || 0;
        if (variant.compare_at_price) {
          variant.compare_at_price = parseFloat(variant.compare_at_price);
        }
      }
    }

    // Auto-fill SEO fields from product name and description
    form.value.meta_title_translations = {
      en: form.value.name_translations.en || "",
      fr: form.value.name_translations.fr || "",
      ar: form.value.name_translations.ar || "",
    };

    form.value.meta_description_translations = {
      en: form.value.description_translations.en
        ? form.value.description_translations.en
            .replace(/<[^>]+>/g, "")
            .substring(0, 160)
        : "",
      fr: form.value.description_translations.fr
        ? form.value.description_translations.fr
            .replace(/<[^>]+>/g, "")
            .substring(0, 160)
        : "",
      ar: form.value.description_translations.ar
        ? form.value.description_translations.ar
            .replace(/<[^>]+>/g, "")
            .substring(0, 160)
        : "",
    };

    // 1. Update product
    const { error: productError } = await supabase
      .from("products")
      .update({
        name_translations: form.value.name_translations,
        description_translations: form.value.description_translations,
        slug: form.value.slug,
        category_id: form.value.category_id || null,
        sku: form.value.sku,
        price: parseFloat(form.value.price),
        compare_at_price: form.value.compare_at_price ? parseFloat(form.value.compare_at_price) : null,
        quantity: parseInt(form.value.quantity),
        meta_title_translations: form.value.meta_title_translations,
        meta_description_translations: form.value.meta_description_translations,
        is_active: form.value.is_active,
        is_featured: form.value.is_featured,
        has_variants: form.value.has_variants,
      })
      .eq("id", productId);

    if (productError) throw productError;

    // 2. Handle images
    if (imagesToDelete.value.length > 0) {
      const { error: deleteError } = await supabase
        .from("product_images")
        .delete()
        .in("id", imagesToDelete.value);

      if (deleteError) throw deleteError;
    }

    const newImages = await uploadImages();
    if (newImages.length > 0) {
      const { error: imagesError } = await supabase
        .from("product_images")
        .insert(
          newImages.map((img) => ({
            ...img,
            product_id: productId,
          }))
        );

      if (imagesError) throw imagesError;
    }

    // 3. Handle videos
    if (videosToDelete.value.length > 0) {
      const { error: deleteError } = await supabase
        .from("product_videos")
        .delete()
        .in("id", videosToDelete.value);

      if (deleteError) throw deleteError;
    }

    const newVideos = await uploadVideos();
    if (newVideos.length > 0) {
      const { error: videosError } = await supabase
        .from("product_videos")
        .insert(
          newVideos.map((vid) => ({
            ...vid,
            product_id: productId,
          }))
        );

      if (videosError) throw videosError;
    }

    // 4. Handle variants if enabled
    if (form.value.has_variants) {
      // Delete existing options and variants
      const { error: deleteOptionsError } = await supabase
        .from("product_option_types")
        .delete()
        .eq("product_id", productId);

      if (deleteOptionsError) throw deleteOptionsError;

      const { error: deleteVariantsError } = await supabase
        .from("product_variants")
        .delete()
        .eq("product_id", productId);

      if (deleteVariantsError) throw deleteVariantsError;

      // Insert new options
      if (form.value.options.length > 0) {
        const optionsToInsert = form.value.options.map((opt, index) => ({
          product_id: productId,
          name_translations: opt.name_translations,
          display_order: index,
        }));

        const { data: insertedOptions, error: optionsError } = await supabase
          .from("product_option_types")
          .insert(optionsToInsert)
          .select();

        if (optionsError) throw optionsError;

        // Insert option values
        const valuesToInsert = [];
        form.value.options.forEach((opt, optIndex) => {
          const optionId = insertedOptions[optIndex].id;
          opt.values.forEach((val, valIndex) => {
            valuesToInsert.push({
              option_type_id: optionId,
              value_translations: val.value_translations,
              display_order: valIndex,
            });
          });
        });

        if (valuesToInsert.length > 0) {
          const { error: valuesError } = await supabase
            .from("product_option_values")
            .insert(valuesToInsert);

          if (valuesError) throw valuesError;
        }
      }

      // Insert variants
      if (form.value.variants.length > 0) {
        const variantsToInsert = form.value.variants.map((variant) => ({
          product_id: productId,
          name_translations: variant.name_translations,
          sku: variant.sku || null,
          price: parseFloat(variant.price),
          compare_at_price: variant.compare_at_price ? parseFloat(variant.compare_at_price) : null,
          quantity: parseInt(variant.quantity),
          is_active: variant.is_active,
        }));

        console.log("Inserting variants:", variantsToInsert);

        const { error: variantsError } = await supabase
          .from("product_variants")
          .insert(variantsToInsert);

        if (variantsError) throw variantsError;
      }
    }

    alert("Produit mis à jour avec succès!");
    router.push("/admin/products");
  } catch (error) {
    console.error("Error updating product:", error);
    alert("Erreur lors de la mise à jour du produit: " + error.message);
  } finally {
    loading.value = false;
  }
};

// Initialize
onMounted(async () => {
  await fetchFeaturesConfig();
  if (categoriesEnabled.value) {
    await fetchCategories();
  }
  await fetchProduct();
});
</script>