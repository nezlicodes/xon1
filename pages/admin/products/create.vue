<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <NuxtLink
      to="/admin/products"
      class="pb-2 pt-5 flex items-center justify-start mb-4 gap-2"
    >
      <Icon
        name="heroicons-outline:arrow-left"
        class="text-sm text-blue-600 hover:text-blue-500"
      />
      <span class="text-sm text-blue-600 hover:text-blue-500"
        >Retour à la liste des produits</span
      >
    </NuxtLink>
    <div class="bg-white rounded-lg shadow p-6">
      <!-- En-tête -->
      <div class="mb-8">
        <h1 class="text-2xl text-gray-900">Créer un nouveau produit</h1>
        <p class="mt-2 text-sm text-gray-600">
          Remplissez les détails du produit ci-dessous. Les champs en anglais
          sont obligatoires.
        </p>
      </div>

      <!-- Language Switcher -->
      <div class="mb-6 border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="lang in languages"
            :key="lang.code"
            @click="currentLang = lang.code"
            type="button"
            :class="[
              currentLang === lang.code
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            ]"
          >
            {{ lang.flag }} {{ lang.name }}
            <span v-if="lang.code === 'en'" class="ml-1 text-red-500">*</span>
          </button>
        </nav>
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Informations de base -->
        <div class="space-y-6">
          <h2 class="text-lg font-medium text-gray-900">
            Informations de base
          </h2>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700"
                >Nom du produit ({{ getCurrentLangName() }})
                <span v-if="currentLang === 'en'" class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="form.name_translations[currentLang]"
                type="text"
                :required="currentLang === 'en'"
                :disabled="loading || uploadingMedia"
                @input="handleNameInput"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                :class="{ 'border-red-300': errors.name }"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">
                {{ errors.name }}
              </p>
              <p v-if="currentLang !== 'en'" class="mt-1 text-xs text-gray-500">
                Optionnel - Le nom en anglais est requis
              </p>
            </div>

            <div>
              <label for="slug" class="block text-sm font-medium text-gray-700"
                >Slug *</label
              >
              <div class="mt-1 flex rounded-md shadow-sm">
                <input
                  id="slug"
                  v-model="form.slug"
                  type="text"
                  required
                  :disabled="loading || uploadingMedia"
                  @input="handleSlugInput"
                  class="block w-full rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  :class="{ 'border-red-300': errors.slug }"
                />
                <span
                  v-if="isCheckingSlug"
                  class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                >
                  <svg
                    class="animate-spin h-4 w-4 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
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
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
                <span
                  v-else-if="isSlugUnique === false"
                  class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-red-50 text-red-500 text-sm"
                >
                  Utilisé
                </span>
                <span
                  v-else-if="isSlugUnique === true"
                  class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-green-50 text-green-500 text-sm"
                >
                  Disponible
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                >
                  Slug
                </span>
              </div>
              <p v-if="errors.slug" class="mt-1 text-sm text-red-600">
                {{ errors.slug }}
              </p>
              <p v-else class="mt-1 text-xs text-gray-500">
                URL unique du produit, générée automatiquement à partir du nom
                en anglais
              </p>
            </div>

            <div v-if="categoryConfig.is_enabled.toString() == 'true'">
              <label
                for="category"
                class="block text-sm font-medium text-gray-700"
                >Catégorie</label
              >
              <select
                id="category"
                v-model="form.category_id"
                :disabled="loading || uploadingMedia"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="" disabled>Sélectionnez une catégorie</option>
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
              <label for="sku" class="block text-sm font-medium text-gray-700"
                >Numéro de ref</label
              >
              <input
                id="sku"
                v-model="form.sku"
                type="text"
                :disabled="loading || uploadingMedia"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label
              for="description"
              class="block text-sm font-medium text-gray-700"
              >Description ({{ getCurrentLangName() }})
              <span
                v-if="currentLang === 'en'"
                class="text-xs text-gray-500 font-normal ml-1"
                >(Optionnel mais recommandé)</span
              >
            </label>
            <ClientOnly>
              <PluginsRichText
                v-model:content="form.description_translations[currentLang]"
                :readonly="loading || uploadingMedia"
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

        <!-- Prix et Inventaire -->
        <div class="space-y-6">
          <h2 class="text-lg font-medium text-gray-900">Prix et Inventaire</h2>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Prix *</label
              >
              <div class="mt-1 relative rounded-md shadow-sm">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <span class="text-gray-500 sm:text-sm">DZD</span>
                </div>
                <input
                  id="price"
                  v-model="form.price"
                  type="number"
                  step="0.01"
                  required
                  :disabled="loading || uploadingMedia"
                  @input="updateVariantPrices"
                  class="pl-12 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  :class="{ 'border-red-300': errors.price }"
                />
              </div>
              <p v-if="errors.price" class="mt-1 text-sm text-red-600">
                {{ errors.price }}
              </p>
            </div>

            <div>
              <label
                for="compare_price"
                class="block text-sm font-medium text-gray-700"
                >Prix comparatif</label
              >
              <div class="mt-1 relative rounded-md shadow-sm">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <span class="text-gray-500 sm:text-sm">DZD</span>
                </div>
                <input
                  id="compare_price"
                  v-model="form.compare_at_price"
                  type="number"
                  step="0.01"
                  :disabled="loading || uploadingMedia"
                  class="pl-12 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label
                for="quantity"
                class="block text-sm font-medium text-gray-700"
                >Quantité *</label
              >
              <input
                id="quantity"
                v-model="form.quantity"
                type="number"
                required
                min="1"
                :disabled="loading || uploadingMedia"
                class="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <!-- Variants -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-medium text-gray-900">Variants</h2>
            <div class="flex items-center">
              <input
                id="has_variants"
                v-model="form.has_variants"
                type="checkbox"
                :disabled="loading || uploadingMedia"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
                @change="toggleVariants"
              />
              <label
                for="has_variants"
                class="ml-2 block text-sm text-gray-900"
              >
                Ce produit a plusieurs variantes
              </label>
            </div>
          </div>

          <div v-if="form.has_variants" class="space-y-8">
            <!-- Option Types -->
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <h3 class="text-sm font-medium text-gray-700">Options</h3>
                <button
                  type="button"
                  @click="addOptionType"
                  :disabled="loading || uploadingMedia"
                  class="py-1 px-3 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ajouter une option
                </button>
              </div>

              <div
                v-if="optionTypes.length === 0"
                class="text-center py-4 text-sm text-gray-500"
              >
                Ajoutez des options comme Couleur, Taille, etc.
              </div>

              <div
                v-for="(optionType, typeIndex) in optionTypes"
                :key="typeIndex"
                class="border border-gray-200 rounded-md p-4 space-y-4"
              >
                <div class="flex items-start justify-between">
                  <div class="w-full max-w-xs space-y-2">
                    <label
                      :for="`optionType-${typeIndex}`"
                      class="block text-xs font-medium text-gray-700"
                    >
                      Nom de l'option ({{ getCurrentLangName() }})
                      <span v-if="currentLang === 'en'" class="text-red-500"
                        >*</span
                      >
                    </label>
                    <input
                      :id="`optionType-${typeIndex}`"
                      v-model="optionType.name_translations[currentLang]"
                      type="text"
                      :placeholder="
                        currentLang === 'en'
                          ? 'e.g., Color, Size, Material'
                          : currentLang === 'fr'
                          ? 'ex: Couleur, Taille, Matériel'
                          : 'مثال: اللون، الحجم، المادة'
                      "
                      :required="currentLang === 'en'"
                      :disabled="loading || uploadingMedia"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <p
                      v-if="currentLang !== 'en'"
                      class="text-xs text-gray-500"
                    >
                      Optionnel - Le nom en anglais est requis
                    </p>
                  </div>
                  <button
                    type="button"
                    @click="removeOptionType(typeIndex)"
                    :disabled="loading || uploadingMedia"
                    class="mt-5 ml-2 p-1 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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

                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <label class="block text-xs font-medium text-gray-700"
                      >Valeurs ({{ getCurrentLangName() }})
                      <span v-if="currentLang === 'en'" class="text-red-500"
                        >*</span
                      ></label
                    >
                    <button
                      type="button"
                      @click="addOptionValue(typeIndex)"
                      :disabled="loading || uploadingMedia"
                      class="py-1 px-2 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      + Valeur
                    </button>
                  </div>

                  <div class="space-y-3">
                    <!-- Liste des valeurs existantes avec édition -->
                    <div
                      v-for="(value, valueIndex) in optionType.values"
                      :key="`${typeIndex}-${valueIndex}`"
                      class="border border-gray-200 rounded-md p-3 bg-gray-50"
                    >
                      <div class="flex items-start justify-between mb-2">
                        <span class="text-xs font-medium text-gray-700"
                          >Valeur {{ valueIndex + 1 }}</span
                        >
                        <button
                          type="button"
                          @click="removeOptionValue(typeIndex, valueIndex)"
                          :disabled="loading || uploadingMedia"
                          class="p-1 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
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

                      <!-- Champs de traduction pour chaque valeur -->
                      <div class="grid grid-cols-1 gap-2">
                        <div>
                          <label
                            :for="`value-en-${typeIndex}-${valueIndex}`"
                            class="block text-xs text-gray-600 mb-1"
                          >
                            🇬🇧 English *
                          </label>
                          <input
                            :id="`value-en-${typeIndex}-${valueIndex}`"
                            v-model="value.value_translations.en"
                            type="text"
                            required
                            :disabled="loading || uploadingMedia"
                            @input="regenerateVariantsDebounced"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label
                            :for="`value-fr-${typeIndex}-${valueIndex}`"
                            class="block text-xs text-gray-600 mb-1"
                          >
                            🇫🇷 Français
                          </label>
                          <input
                            :id="`value-fr-${typeIndex}-${valueIndex}`"
                            v-model="value.value_translations.fr"
                            type="text"
                            :disabled="loading || uploadingMedia"
                            @input="regenerateVariantsDebounced"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label
                            :for="`value-ar-${typeIndex}-${valueIndex}`"
                            class="block text-xs text-gray-600 mb-1"
                          >
                            🇩🇿 العربية
                          </label>
                          <input
                            :id="`value-ar-${typeIndex}-${valueIndex}`"
                            v-model="value.value_translations.ar"
                            type="text"
                            :disabled="loading || uploadingMedia"
                            @input="regenerateVariantsDebounced"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Input pour ajouter une nouvelle valeur -->
                    <div class="flex gap-2">
                      <input
                        v-model="newOptionValues[typeIndex]"
                        type="text"
                        :placeholder="
                          currentLang === 'en'
                            ? 'Add new value...'
                            : currentLang === 'fr'
                            ? 'Ajouter nouvelle valeur...'
                            : 'إضافة قيمة جديدة...'
                        "
                        :disabled="loading || uploadingMedia"
                        class="flex-1 text-xs border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        @keyup.enter.prevent="addOptionValueFromInput(typeIndex)"
                      />
                      <button
                        type="button"
                        @click="addOptionValueFromInput(typeIndex)"
                        :disabled="loading || uploadingMedia || !newOptionValues[typeIndex]?.trim()"
                        class="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>

                  <p v-if="showValueExists" class="text-red-600 text-xs mt-1">
                    Les valeurs des options doivent être uniques.
                  </p>
                </div>
              </div>
            </div>

            <!-- Variants Generation -->
            <div
              v-if="optionTypes.length > 0 && allOptionTypesHaveValues"
              class="space-y-4"
            >
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
                  <p class="text-sm text-red-700">
                    {{ duplicateVariantError }}
                  </p>
                </div>
              </div>

              <div class="flex justify-between items-center">
                <h3 class="text-sm font-medium text-gray-700">
                  Variantes ({{ variants.length }})
                </h3>
                <div class="flex gap-2">
                  <button
                    type="button"
                    @click="showVariantsPanel = !showVariantsPanel"
                    class="py-1 px-3 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="loading || uploadingMedia"
                  >
                    <svg
                      class="w-4 h-4 inline-block mr-1 transition-transform"
                      :class="{ 'rotate-180': showVariantsPanel }"
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
                    {{ showVariantsPanel ? "Masquer" : "Afficher" }}
                  </button>
                  <button
                    v-if="showVariantsPanel"
                    type="button"
                    @click="expandAllVariants"
                    :disabled="loading || uploadingMedia"
                    class="py-1 px-3 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ allExpanded ? "Réduire tout" : "Étendre tout" }}
                  </button>
                </div>
              </div>

              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-[3000px]"
                leave-active-class="transition-all duration-300 ease-in"
                leave-from-class="opacity-100 max-h-[3000px]"
                leave-to-class="opacity-0 max-h-0"
              >
                <div
                  v-if="showVariantsPanel"
                  class="bg-gray-50 rounded-md border border-gray-200 divide-y divide-gray-200 overflow-hidden"
                >
                  <!-- Header -->
                  <div
                    class="px-4 py-3 flex items-center text-xs font-medium text-gray-700"
                  >
                    <div class="flex-1">Variante</div>
                    <div class="w-24 text-center">Prix</div>
                    <div class="w-24 text-center">Stock</div>
                    <div class="w-16 text-center">État</div>
                  </div>

                  <!-- Variant rows -->
                  <div
                    v-for="(variant, index) in variants"
                    :key="index"
                    class="divide-y divide-gray-100"
                  >
                    <!-- Variant summary row -->
                    <div
                      class="px-4 py-3 flex items-center hover:bg-gray-50 cursor-pointer"
                      @click="toggleVariantExpanded(index)"
                    >
                      <div class="flex-1 flex items-center">
                        <button
                          type="button"
                          class="mr-2 text-gray-500"
                          :class="{
                            'transform rotate-90': expandedVariants[index],
                          }"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                        <span class="text-sm">{{
                          formatVariantName(variant)
                        }}</span>
                      </div>
                      <div class="w-24 text-center text-sm">
                        {{ formatPrice(variant.price) }}
                      </div>
                      <div class="w-24 text-center text-sm">
                        {{ variant.quantity }}
                      </div>
                      <div class="w-16 text-center">
                        <span
                          :class="
                            variant.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          "
                          class="px-2 py-1 text-xs rounded-full"
                        >
                          {{ variant.is_active ? "Actif" : "Inactif" }}
                        </span>
                      </div>
                    </div>

                    <!-- Variant detail row (expanded) -->
                    <div
                      v-if="expandedVariants[index]"
                      class="px-4 py-4 bg-gray-50"
                    >
                      <div class="space-y-4 mb-4">
                        <!-- Nom en anglais -->
                        <div>
                          <label
                            :for="`variant-name-en-${index}`"
                            class="block text-xs font-medium text-gray-700"
                          >
                            🇬🇧 Nom (English) *
                          </label>
                          <input
                            :id="`variant-name-en-${index}`"
                            v-model="variant.name_translations.en"
                            type="text"
                            required
                            :disabled="loading || uploadingMedia"
                            @keydown.enter.prevent
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <!-- Nom en français -->
                        <div>
                          <label
                            :for="`variant-name-fr-${index}`"
                            class="block text-xs font-medium text-gray-700"
                          >
                            🇫🇷 Nom (Français)
                          </label>
                          <input
                            :id="`variant-name-fr-${index}`"
                            v-model="variant.name_translations.fr"
                            type="text"
                            :disabled="loading || uploadingMedia"
                            @keydown.enter.prevent
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <!-- Nom en arabe -->
                        <div>
                          <label
                            :for="`variant-name-ar-${index}`"
                            class="block text-xs font-medium text-gray-700"
                          >
                            🇩🇿 Nom (العربية)
                          </label>
                          <input
                            :id="`variant-name-ar-${index}`"
                            v-model="variant.name_translations.ar"
                            type="text"
                            :disabled="loading || uploadingMedia"
                            @keydown.enter.prevent
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <!-- SKU -->
                        <div>
                          <label
                            :for="`variant-sku-${index}`"
                            class="block text-xs font-medium text-gray-700"
                          >
                            SKU
                          </label>
                          <input
                            :id="`variant-sku-${index}`"
                            v-model="variant.sku"
                            type="text"
                            :disabled="loading || uploadingMedia"
                            @keydown.enter.prevent
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label
                            :for="`variant-price-${index}`"
                            class="block text-xs font-medium text-gray-700"
                          >
                            Prix
                          </label>
                          <div class="mt-1 relative rounded-md shadow-sm">
                            <div
                              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                            >
                              <span class="text-gray-500 sm:text-xs">DZD</span>
                            </div>
                            <input
                              :id="`variant-price-${index}`"
                              v-model="variant.price"
                              type="number"
                              step="0.01"
                              :disabled="loading || uploadingMedia"
                              @keydown.enter.prevent
                              class="pl-12 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                              :class="{
                                'border-red-300':
                                  errors[`variant_price_${index}`],
                              }"
                            />
                          </div>
                          <p
                            v-if="errors[`variant_price_${index}`]"
                            class="mt-1 text-xs text-red-600"
                          >
                            {{ errors[`variant_price_${index}`] }}
                          </p>
                        </div>
                        <div>
                          <label
                            :for="`variant-compare-price-${index}`"
                            class="block text-xs font-medium text-gray-700"
                          >
                            Prix comparatif
                          </label>
                          <div class="mt-1 relative rounded-md shadow-sm">
                            <div
                              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                            >
                              <span class="text-gray-500 sm:text-xs">DZD</span>
                            </div>
                            <input
                              :id="`variant-compare-price-${index}`"
                              v-model="variant.compare_at_price"
                              type="number"
                              step="0.01"
                              :disabled="loading || uploadingMedia"
                              @keydown.enter.prevent
                              class="pl-12 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            :for="`variant-quantity-${index}`"
                            class="block text-xs font-medium text-gray-700"
                          >
                            Quantité
                          </label>
                          <input
                            :id="`variant-quantity-${index}`"
                            v-model="variant.quantity"
                            type="number"
                            min="1"
                            :disabled="loading || uploadingMedia"
                            @keydown.enter.prevent
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div class="mt-4 flex items-center">
                        <input
                          :id="`variant-active-${index}`"
                          v-model="variant.is_active"
                          type="checkbox"
                          :disabled="loading || uploadingMedia"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
                        />
                        <label
                          :for="`variant-active-${index}`"
                          class="ml-2 block text-xs text-gray-700"
                        >
                          Cette variante est active
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- Statut -->
        <div class="space-y-6">
          <h2 class="text-lg font-medium text-gray-900">Statut</h2>
          <div class="flex items-center">
            <input
              id="is_active"
              v-model="form.is_active"
              type="checkbox"
              :disabled="loading || uploadingMedia"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
            />
            <label for="is_active" class="ml-2 block text-sm text-gray-900">
              Le produit est actif
            </label>
          </div>
          <div class="flex items-center">
            <input
              id="is_featured"
              v-model="form.is_featured"
              type="checkbox"
              :disabled="loading || uploadingMedia"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
            />
            <label for="is_featured" class="ml-2 block text-sm text-gray-900">
              Le produit est en vedette
            </label>
          </div>
        </div>

        <!-- Media (Images & Videos) -->
        <div class="space-y-6">
          <h2 class="text-lg font-medium text-gray-900">Médias</h2>
          
          <!-- Media Type Tabs -->
          <div class="border-b border-gray-200">
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
                📸 Images ({{ previewImages.length }})
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
                🎥 Vidéos ({{ previewVideos.length }})
              </button>
            </nav>
          </div>

          <!-- Images Tab -->
          <div v-if="activeMediaTab === 'images'" class="space-y-4">
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              <!-- Aperçus des images -->
              <div
                v-for="(image, index) in previewImages"
                :key="'img-' + index"
                class="relative aspect-w-1 aspect-h-1"
              >
                <NuxtImg
                  :src="image.url"
                  class="object-cover rounded-lg w-full h-full"
                  :alt="`Aperçu ${index + 1}`"
                />
                <button
                  @click="removeImage(index)"
                  type="button"
                  :disabled="loading || uploadingMedia"
                  class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Supprimer l'image</span>
                  ×
                </button>
                <div
                  v-if="index === 0"
                  class="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded"
                >
                  Principal
                </div>
              </div>

              <!-- Bouton de téléchargement d'images -->
              <label
                class="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-blue-500 relative aspect-w-1 aspect-h-1"
                :class="{
                  'opacity-50 cursor-not-allowed': loading || uploadingMedia,
                  'hover:border-gray-300': loading || uploadingMedia,
                }"
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  class="hidden"
                  @change="handleImageUpload"
                  :disabled="loading || uploadingMedia"
                />
                <div
                  v-if="uploadingMedia"
                  class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-lg"
                >
                  <svg
                    class="animate-spin h-8 w-8 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
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
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
                <div class="text-center">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <p class="mt-1 text-sm text-gray-600">Ajouter images</p>
                </div>
              </label>
            </div>
            <p class="text-sm text-gray-500">
              Téléchargez les images du produit. La première image sera utilisée comme vignette principale.
              {{ uploadingMedia ? "Chargement en cours..." : "" }}
            </p>
          </div>

          <!-- Videos Tab -->
          <div v-if="activeMediaTab === 'videos'" class="space-y-4">
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              <!-- Aperçus des vidéos -->
              <div
                v-for="(video, index) in previewVideos"
                :key="'vid-' + index"
                class="relative aspect-w-16 aspect-h-9"
              >
                <video
                  :src="video.url"
                  class="object-cover rounded-lg w-full h-full"
                  controls
                  preload="metadata"
                >
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
                <button
                  @click="removeVideo(index)"
                  type="button"
                  :disabled="loading || uploadingMedia"
                  class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                >
                  <span class="sr-only">Supprimer la vidéo</span>
                  ×
                </button>
                <div class="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
                  {{ formatVideoDuration(video.duration) }}
                </div>
              </div>

              <!-- Bouton de téléchargement de vidéos -->
              <label
                class="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-blue-500 relative aspect-w-16 aspect-h-9"
                :class="{
                  'opacity-50 cursor-not-allowed': loading || uploadingMedia,
                  'hover:border-gray-300': loading || uploadingMedia,
                }"
              >
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  class="hidden"
                  @change="handleVideoUpload"
                  :disabled="loading || uploadingMedia"
                />
                <div
                  v-if="uploadingMedia"
                  class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-lg"
                >
                  <svg
                    class="animate-spin h-8 w-8 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
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
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
                <div class="text-center">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <p class="mt-1 text-sm text-gray-600">Ajouter vidéos</p>
                </div>
              </label>
            </div>
            <p class="text-sm text-gray-500">
              Téléchargez les vidéos du produit. Formats acceptés: MP4, WebM, MOV. Taille maximale: 50MB par vidéo.
              {{ uploadingMedia ? "Chargement en cours..." : "" }}
            </p>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex justify-end gap-4">
          <button
            type="button"
            @click="$router.back()"
            :disabled="loading || uploadingMedia"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="
              loading ||
              uploadingMedia ||
              isCheckingSlug ||
              isSlugUnique === false
            "
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              v-if="loading"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
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
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span v-if="loading">Enregistrement...</span>
            <span v-else>Créer le produit</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";

const { showSuccess } = useSuccessSnackbar();
const { showError } = useErrorModal();
const supabase = useSupabaseClient();
const router = useRouter();

// Language support
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
      category.name ||
      ""
    );
  }
  return category.name || "";
};

// State
const loading = ref(false);
const uploadingMedia = ref(false);
const activeMediaTab = ref("images");
const categories = ref([]);
const errors = ref({});
const previewImages = ref([]);
const imageFiles = ref([]);
const previewVideos = ref([]);
const videoFiles = ref([]);
const isSlugUnique = ref(null);
const isCheckingSlug = ref(false);
const slugManuallyEdited = ref(false);
const optionTypes = ref([]);
const newOptionValues = ref({});
const variants = ref([]);
const expandedVariants = ref({});
const showVariantsPanel = ref(false);
const duplicateVariantError = ref("");
const showValueExists = ref(false);

const categoryConfig = ref({
  is_enabled: true,
});

const form = ref({
  name_translations: { en: "", fr: "", ar: "" },
  slug: "",
  category_id: null,
  description_translations: { en: "", fr: "", ar: "" },
  price: "",
  compare_at_price: "",
  sku: "",
  quantity: 1,
  meta_title_translations: { en: "", fr: "", ar: "" },
  meta_description_translations: { en: "", fr: "", ar: "" },
  is_active: true,
  is_featured: false,
  has_variants: false,
});

// Fetch categories on mount
onMounted(async () => {
  const { data } = await supabase
    .from("categories")
    .select("*, products:products(count)")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (data) {
    categories.value = data;
  }
});

// Slug functions
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

const makeSlugUnique = (baseSlug) => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 6);
  return `${baseSlug}-${timestamp}${randomStr}`;
};

const checkSlugUniqueness = useDebounce(async (slug) => {
  if (!slug) return;

  isCheckingSlug.value = true;

  try {
    const { data, error } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;

    isSlugUnique.value = !data;

    if (data) {
      if (!slugManuallyEdited.value) {
        const uniqueSlug = makeSlugUnique(slug);
        form.value.slug = uniqueSlug;
        checkSlugUniqueness(uniqueSlug);
      }
    }
  } catch (error) {
    console.error("Error checking slug uniqueness:", error);
    isSlugUnique.value = null;
  } finally {
    isCheckingSlug.value = false;
  }
}, 500);

// Event handlers for inputs
const handleNameInput = () => {
  if (!slugManuallyEdited.value && form.value.name_translations.en) {
    const newSlug = slugify(form.value.name_translations.en);
    form.value.slug = newSlug;
    checkSlugUniqueness(newSlug);
  }
};

const fetchCategoryConfig = async () => {
  const { data, error } = await supabase
    .from("categories_config")
    .select("*")
    .single();

  if (data) categoryConfig.value = data;
};

const handleSlugInput = () => {
  slugManuallyEdited.value = true;
  checkSlugUniqueness(form.value.slug);
};

// Video helper functions
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

const formatVideoDuration = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Methods
const validateVariants = () => {
  variants.value.forEach((variant, index) => {
    if (errors.value[`variant_price_${index}`]) {
      delete errors.value[`variant_price_${index}`];
    }
  });

  let allValid = true;

  variants.value.forEach((variant, index) => {
    if (!variant.price || parseFloat(variant.price) <= 0) {
      errors.value[`variant_price_${index}`] = "Un prix valide est requis";
      allValid = false;
    }
  });

  return allValid;
};

const validateForm = () => {
  errors.value = {};

  if (!form.value.name_translations.en) {
    errors.value.name = "Le nom du produit en anglais est requis";
  }

  if (!form.value.slug) {
    errors.value.slug = "Le slug est requis";
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.value.slug)) {
    errors.value.slug = "Format de slug invalide";
  } else if (isSlugUnique.value === false) {
    errors.value.slug = "Ce slug est déjà utilisé par un autre produit";
  }

  if (!form.value.price || form.value.price <= 0) {
    errors.value.price = "Un prix valide est requis";
  }

  if (form.value.has_variants && variants.value.length > 0) {
    if (!validateVariants()) {
      showError("Veuillez corriger les erreurs de prix des variantes");
      return false;
    }
  }

  return Object.keys(errors.value).length === 0;
};

const handleImageUpload = async (event) => {
  const files = Array.from(event.target.files);
  if (!files.length) return;

  uploadingMedia.value = true;

  try {
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        showError("La taille de l'image ne doit pas dépasser 5MB");
        continue;
      }

      const reader = new FileReader();
      await new Promise((resolve) => {
        reader.onload = (e) => {
          previewImages.value.push({
            url: e.target.result,
            file,
          });
          resolve();
        };
        reader.readAsDataURL(file);
      });

      imageFiles.value.push(file);
    }
  } catch (error) {
    console.error("Erreur lors du traitement des images:", error);
    showError("Échec du traitement des images. Veuillez réessayer.");
  } finally {
    uploadingMedia.value = false;
  }
};

const handleVideoUpload = async (event) => {
  const files = Array.from(event.target.files);
  if (!files.length) return;

  uploadingMedia.value = true;

  try {
    for (const file of files) {
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        showError("La taille de la vidéo ne doit pas dépasser 50MB");
        continue;
      }

      // Check file type
      if (!file.type.startsWith('video/')) {
        showError("Seuls les fichiers vidéo sont acceptés");
        continue;
      }

      // Get video duration
      const duration = await getVideoDuration(file);

      const reader = new FileReader();
      await new Promise((resolve) => {
        reader.onload = (e) => {
          previewVideos.value.push({
            url: e.target.result,
            file,
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
    showError("Échec du traitement des vidéos. Veuillez réessayer.");
  } finally {
    uploadingMedia.value = false;
  }
};

const removeImage = (index) => {
  previewImages.value.splice(index, 1);
  imageFiles.value.splice(index, 1);
};

const removeVideo = (index) => {
  previewVideos.value.splice(index, 1);
  videoFiles.value.splice(index, 1);
};

const uploadImages = async () => {
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
        position: index,
        is_primary: index === 0,
      };
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    throw error;
  } finally {
    uploadingMedia.value = false;
  }
};

const uploadVideos = async () => {
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

      const videoData = previewVideos.value[index];

      return {
        url: publicUrl,
        thumbnail_url: null, // You can generate thumbnails later if needed
        alt_text_translations: { en: "", fr: "", ar: "" },
        position: index,
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

watch(
  () => form.value.slug,
  (newSlug) => {
    if (newSlug && !isCheckingSlug.value) {
      checkSlugUniqueness(newSlug);
    }
  }
);

const allOptionTypesHaveValues = computed(() => {
  return optionTypes.value.every((type) => type.values.length > 0);
});

const allExpanded = computed(() => {
  return Object.values(expandedVariants.value).every((expanded) => expanded);
});

const toggleVariants = () => {
  if (!form.value.has_variants) {
    optionTypes.value = [];
    variants.value = [];
    expandedVariants.value = {};
  }
};

const updateVariantPrices = () => {
  if (variants.value.length > 0) {
    const newPrice = parseFloat(form.value.price) || 0;
    variants.value.forEach((variant) => {
      variant.price = newPrice;
    });
  }
};

const addOptionType = () => {
  optionTypes.value.unshift({
    name_translations: { en: "", fr: "", ar: "" },
    values: [],
  });
  newOptionValues.value = {
    0: "",
    ...Object.fromEntries(
      Object.entries(newOptionValues.value).map(([k, v]) => [
        parseInt(k) + 1,
        v,
      ])
    ),
  };
};

const removeOptionType = (index) => {
  optionTypes.value.splice(index, 1);

  const updatedNewOptionValues = {};
  for (let i = 0; i < optionTypes.value.length; i++) {
    updatedNewOptionValues[i] = newOptionValues.value[i] || "";
  }
  newOptionValues.value = updatedNewOptionValues;

  if (allOptionTypesHaveValues.value) {
    generateVariants();
  }
};

const addOptionValue = (typeIndex) => {
  const value = newOptionValues.value[typeIndex]?.trim();
  if (value) {
    const valueExists = optionTypes.value[typeIndex].values.some(
      (v) =>
        v.value_translations.en === value ||
        v.value_translations.fr === value ||
        v.value_translations.ar === value
    );

    if (!valueExists) {
      optionTypes.value[typeIndex].values.push({
        value_translations: { en: value, fr: value, ar: value },
      });
      newOptionValues.value[typeIndex] = "";
      showValueExists.value = false;
      if (allOptionTypesHaveValues.value) {
        generateVariants();
      }
    } else {
      showValueExists.value = true;
    }
  }
};

const addOptionValueFromInput = (typeIndex) => {
  addOptionValue(typeIndex);
};

const removeOptionValue = (typeIndex, valueIndex) => {
  optionTypes.value[typeIndex].values.splice(valueIndex, 1);

  if (allOptionTypesHaveValues.value) {
    generateVariants();
  }
};

const generateVariants = () => {
  if (!allOptionTypesHaveValues.value) return;

  const optionValues = optionTypes.value.map((type) =>
    type.values.map(
      (v) => v.value_translations[currentLang.value] || v.value_translations.en
    )
  );

  const cartesianProduct = (arr) => {
    return arr.reduce(
      (acc, val) => {
        return acc.flatMap((x) => val.map((y) => [...x, y]));
      },
      [[]]
    );
  };

  const combinations = cartesianProduct(optionValues);

  const basePrice = parseFloat(form.value.price) || 0;
  const newVariants = combinations.map((combination) => {
    const variantName = combination.join(" / ");

    const options = {};
    combination.forEach((value, index) => {
      const optionName =
        optionTypes.value[index].name_translations[currentLang.value] ||
        optionTypes.value[index].name_translations.en;
      options[optionName] = value;
    });

    const generatedSku = combination
      .map((val) => val.replace(/\s+/g, "-"))
      .join("-")
      .toLowerCase();

    const existingVariant = variants.value.find((v) => {
      return combination.every((val, idx) => {
        const optionName =
          optionTypes.value[idx].name_translations[currentLang.value] ||
          optionTypes.value[idx].name_translations.en;
        return v.options[optionName] === val;
      });
    });

    if (existingVariant) {
      return {
        ...existingVariant,
        options,
      };
    }

    const productName =
      form.value.name_translations.en ||
      form.value.name_translations.fr ||
      "Product";

    return {
      name_translations: {
        en: `${productName} - ${variantName}`,
        fr: `${productName} - ${variantName}`,
        ar: `${productName} - ${variantName}`,
      },
      price: basePrice,
      compare_at_price: form.value.compare_at_price
        ? parseFloat(form.value.compare_at_price)
        : null,
      quantity: 1,
      sku: `${form.value.sku || "SKU"}-${generatedSku}`.substring(0, 20),
      is_active: true,
      is_featured: false,
      options,
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

  variants.value = newVariants;

  newVariants.forEach((_, index) => {
    if (expandedVariants.value[index] === undefined) {
      expandedVariants.value[index] = false;
    }
  });
};

const toggleVariantExpanded = (index) => {
  expandedVariants.value[index] = !expandedVariants.value[index];
};

const expandAllVariants = () => {
  const newState = !allExpanded.value;
  variants.value.forEach((_, index) => {
    expandedVariants.value[index] = newState;
  });
};

const formatVariantName = (variant) => {
  const optionParts = [];
  for (const [optionName, optionValue] of Object.entries(variant.options)) {
    optionParts.push(`${optionValue}`);
  }
  return optionParts.join(" / ");
};

const formatPrice = (price) => {
  return `${parseFloat(price).toFixed(2)} DZD`;
};

watch(
  () => optionTypes.value,
  () => {
    if (allOptionTypesHaveValues.value) {
      generateVariants();
    }
  },
  { deep: true }
);

const handleSubmit = async () => {
  if (!validateForm()) return;

  if (isSlugUnique.value === false || isCheckingSlug.value) {
    showError(
      "Veuillez attendre la vérification du slug ou corriger le slug existant"
    );
    return;
  }

  if (form.value.has_variants && variants.value.length > 0) {
    if (!validateVariants()) {
      showError("Veuillez corriger les prix des variantes");
      return;
    }
  }

  loading.value = true;

  try {
    // Auto-fill SEO fields
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

    // Create product
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        name_translations: form.value.name_translations,
        slug: form.value.slug,
        category_id: form.value.category_id,
        description_translations: form.value.description_translations,
        price: parseFloat(form.value.price),
        compare_at_price: form.value.compare_at_price
          ? parseFloat(form.value.compare_at_price)
          : null,
        sku: form.value.sku,
        quantity: parseInt(form.value.quantity),
        meta_title_translations: form.value.meta_title_translations,
        meta_description_translations: form.value.meta_description_translations,
        is_active: form.value.is_active,
        is_featured: form.value.is_featured,
        has_variants: form.value.has_variants,
      })
      .select()
      .single();

    if (productError) throw productError;

    // Create variants and options if enabled
    if (form.value.has_variants && product) {
      // Create option types
      const optionTypesInserts = optionTypes.value.map((optionType, index) => ({
        product_id: product.id,
        name_translations: optionType.name_translations,
        display_order: index,
      }));

      const { data: createdOptionTypes, error: optionTypesError } =
        await supabase
          .from("product_option_types")
          .insert(optionTypesInserts)
          .select();

      if (optionTypesError) throw optionTypesError;

      // Create option values
      const optionValuesInserts = [];
      createdOptionTypes.forEach((createdType, typeIndex) => {
        const originalType = optionTypes.value[typeIndex];
        originalType.values.forEach((value, valueIndex) => {
          optionValuesInserts.push({
            option_type_id: createdType.id,
            value_translations: value.value_translations,
            display_order: valueIndex,
          });
        });
      });

      const { data: createdOptionValues, error: optionValuesError } =
        await supabase
          .from("product_option_values")
          .insert(optionValuesInserts)
          .select();

      if (optionValuesError) throw optionValuesError;

      // Create variants
      const variantsInserts = variants.value.map((variant) => ({
        product_id: product.id,
        name_translations: variant.name_translations,
        sku: variant.sku,
        price: parseFloat(variant.price),
        compare_at_price: variant.compare_at_price
          ? parseFloat(variant.compare_at_price)
          : null,
        quantity: parseInt(variant.quantity),
        is_active: variant.is_active,
      }));

      const { data: createdVariants, error: variantsError } = await supabase
        .from("product_variants")
        .insert(variantsInserts)
        .select();

      if (variantsError) throw variantsError;

      // Create variant-option relationships
      const variantOptionInserts = [];

      createdVariants.forEach((createdVariant, variantIndex) => {
        const originalVariant = variants.value[variantIndex];

        Object.entries(originalVariant.options).forEach(
          ([optionName, optionValue]) => {
            const matchingTypeIndex = optionTypes.value.findIndex((ot) => {
              return Object.values(ot.name_translations).includes(optionName);
            });

            if (matchingTypeIndex !== -1) {
              const matchingType = createdOptionTypes[matchingTypeIndex];

              const matchingValue = createdOptionValues.find((ov) => {
                const isCorrectType = ov.option_type_id === matchingType.id;
                const isCorrectValue = Object.values(
                  ov.value_translations
                ).includes(optionValue);
                return isCorrectType && isCorrectValue;
              });

              if (matchingValue) {
                variantOptionInserts.push({
                  variant_id: createdVariant.id,
                  option_value_id: matchingValue.id,
                });
              }
            }
          }
        );
      });

      if (variantOptionInserts.length > 0) {
        const { error: junctionError } = await supabase
          .from("product_variant_option_values")
          .insert(variantOptionInserts);

        if (junctionError) throw junctionError;
      }
    }

    // Upload images
    if (imageFiles.value.length > 0) {
      const images = await uploadImages();

      const { error: imagesError } = await supabase
        .from("product_images")
        .insert(
          images.map((image) => ({
            ...image,
            product_id: product.id,
          }))
        );

      if (imagesError) throw imagesError;
    }

    // Upload videos
    if (videoFiles.value.length > 0) {
      const videos = await uploadVideos();

      const { error: videosError } = await supabase
        .from("product_videos")
        .insert(
          videos.map((video) => ({
            ...video,
            product_id: product.id,
          }))
        );

      if (videosError) throw videosError;
    }

    showSuccess("Le produit a été créé avec succès!");
    router.push("/admin/products");
  } catch (error) {
    console.error("Erreur lors de la création du produit:", error);
    showError("Échec de la création du produit. Veuillez réessayer.");
  } finally {
    loading.value = false;
  }
};

useHead({
  title: "Créer un produit",
  meta: [
    {
      name: "description",
      content: "Créer un nouveau produit",
    },
  ],
});
</script>

<style scoped>
.pl-12 {
  padding-left: 3rem !important;
}
</style>