<template>
  <div class="max-w-7xl pt-6 mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
          <Icon name="ph:palette-bold" class="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Couleurs du site</h1>
          <p class="mt-1 text-sm text-gray-600">Personnalisez la palette de couleurs de votre site</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="text-center">
        <div class="inline-block relative">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div class="absolute inset-0 rounded-full border-4 border-blue-100 animate-pulse"></div>
        </div>
        <p class="mt-4 text-sm text-gray-600 font-medium">Chargement des couleurs...</p>
      </div>
    </div>

    <div v-else class="space-y-6">
      <!-- Color Settings -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Icon name="ph:swatches-bold" class="w-5 h-5 text-blue-600" />
          Palette de couleurs
        </h2>
        
        <div class="space-y-6">
          <!-- Primary Color -->
          <div class="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
            <label class="block text-sm font-bold text-gray-900 mb-2">Couleur principale</label>
            <p class="text-xs text-gray-600 mb-4">Utilisée pour les boutons, liens et éléments importants</p>
            <div class="flex gap-4 items-start">
              <div class="relative group">
                <input
                  :value="primaryColorHex"
                  @input="updatePrimaryFromHex"
                  type="color"
                  class="h-16 w-16 rounded-xl border-2 border-gray-300 cursor-pointer transition-all group-hover:scale-110 group-hover:shadow-lg"
                  style="padding: 4px;"
                />
                <div class="mt-2 text-xs font-mono text-gray-700 text-center font-bold">{{ primaryColorHex }}</div>
              </div>
              <div class="flex-1">
                <div class="grid grid-cols-3 gap-3">
                  <div>
                    <label class="text-xs text-gray-600 block mb-2 font-semibold">R</label>
                    <input
                      v-model.number="primaryRgb.r"
                      @input="updatePrimaryFromRgb"
                      type="number"
                      min="0"
                      max="255"
                      class="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 block mb-2 font-semibold">G</label>
                    <input
                      v-model.number="primaryRgb.g"
                      @input="updatePrimaryFromRgb"
                      type="number"
                      min="0"
                      max="255"
                      class="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 block mb-2 font-semibold">B</label>
                    <input
                      v-model.number="primaryRgb.b"
                      @input="updatePrimaryFromRgb"
                      type="number"
                      min="0"
                      max="255"
                      class="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium outline-none transition-all"
                    />
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-3 font-mono">RGB: {{ colors.primary_color }}</p>
              </div>
            </div>
          </div>

          <!-- Primary Contrast Color -->
          <div class="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
            <label class="block text-sm font-bold text-gray-900 mb-2">Couleur de contraste principale</label>
            <p class="text-xs text-gray-600 mb-4">Utilisée pour le texte sur la couleur principale</p>
            <div class="flex gap-4 items-start">
              <div class="relative group">
                <input
                  :value="primaryContrastHex"
                  @input="updatePrimaryContrastFromHex"
                  type="color"
                  class="h-16 w-16 rounded-xl border-2 border-gray-300 cursor-pointer transition-all group-hover:scale-110 group-hover:shadow-lg"
                  style="padding: 4px;"
                />
                <div class="mt-2 text-xs font-mono text-gray-700 text-center font-bold">{{ primaryContrastHex }}</div>
              </div>
              <div class="flex-1">
                <div class="grid grid-cols-3 gap-3">
                  <div>
                    <label class="text-xs text-gray-600 block mb-2 font-semibold">R</label>
                    <input
                      v-model.number="primaryContrastRgb.r"
                      @input="updatePrimaryContrastFromRgb"
                      type="number"
                      min="0"
                      max="255"
                      class="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 block mb-2 font-semibold">G</label>
                    <input
                      v-model.number="primaryContrastRgb.g"
                      @input="updatePrimaryContrastFromRgb"
                      type="number"
                      min="0"
                      max="255"
                      class="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 block mb-2 font-semibold">B</label>
                    <input
                      v-model.number="primaryContrastRgb.b"
                      @input="updatePrimaryContrastFromRgb"
                      type="number"
                      min="0"
                      max="255"
                      class="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium outline-none transition-all"
                    />
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-3 font-mono">RGB: {{ colors.primary_contrast_color }}</p>
              </div>
            </div>
          </div>

          <!-- Secondary Color -->
          <div class="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
            <label class="block text-sm font-bold text-gray-900 mb-2">Couleur secondaire</label>
            <p class="text-xs text-gray-600 mb-4">Utilisée pour les boutons secondaires et accents</p>
            <div class="flex gap-4 items-start">
              <div class="relative group">
                <input
                  :value="secondaryColorHex"
                  @input="updateSecondaryFromHex"
                  type="color"
                  class="h-16 w-16 rounded-xl border-2 border-gray-300 cursor-pointer transition-all group-hover:scale-110 group-hover:shadow-lg"
                  style="padding: 4px;"
                />
                <div class="mt-2 text-xs font-mono text-gray-700 text-center font-bold">{{ secondaryColorHex }}</div>
              </div>
              <div class="flex-1">
                <div class="grid grid-cols-3 gap-3">
                  <div>
                    <label class="text-xs text-gray-600 block mb-2 font-semibold">R</label>
                    <input
                      v-model.number="secondaryRgb.r"
                      @input="updateSecondaryFromRgb"
                      type="number"
                      min="0"
                      max="255"
                      class="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 block mb-2 font-semibold">G</label>
                    <input
                      v-model.number="secondaryRgb.g"
                      @input="updateSecondaryFromRgb"
                      type="number"
                      min="0"
                      max="255"
                      class="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 block mb-2 font-semibold">B</label>
                    <input
                      v-model.number="secondaryRgb.b"
                      @input="updateSecondaryFromRgb"
                      type="number"
                      min="0"
                      max="255"
                      class="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium outline-none transition-all"
                    />
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-3 font-mono">RGB: {{ colors.secondary_color }}</p>
              </div>
            </div>
          </div>

          <!-- Secondary Contrast Color -->
          <div class="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
            <label class="block text-sm font-bold text-gray-900 mb-2">Couleur de contraste secondaire</label>
            <p class="text-xs text-gray-600 mb-4">Utilisée pour le texte sur la couleur secondaire</p>
            <div class="flex gap-4 items-start">
              <div class="relative group">
                <input
                  :value="secondaryContrastHex"
                  @input="updateSecondaryContrastFromHex"
                  type="color"
                  class="h-16 w-16 rounded-xl border-2 border-gray-300 cursor-pointer transition-all group-hover:scale-110 group-hover:shadow-lg"
                  style="padding: 4px;"
                />
                <div class="mt-2 text-xs font-mono text-gray-700 text-center font-bold">{{ secondaryContrastHex }}</div>
              </div>
              <div class="flex-1">
                <div class="grid grid-cols-3 gap-3">
                  <div>
                    <label class="text-xs text-gray-600 block mb-2 font-semibold">R</label>
                    <input
                      v-model.number="secondaryContrastRgb.r"
                      @input="updateSecondaryContrastFromRgb"
                      type="number"
                      min="0"
                      max="255"
                      class="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 block mb-2 font-semibold">G</label>
                    <input
                      v-model.number="secondaryContrastRgb.g"
                      @input="updateSecondaryContrastFromRgb"
                      type="number"
                      min="0"
                      max="255"
                      class="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 block mb-2 font-semibold">B</label>
                    <input
                      v-model.number="secondaryContrastRgb.b"
                      @input="updateSecondaryContrastFromRgb"
                      type="number"
                      min="0"
                      max="255"
                      class="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium outline-none transition-all"
                    />
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-3 font-mono">RGB: {{ colors.secondary_contrast_color }}</p>
              </div>
            </div>
          </div>

          <!-- Body Background -->
          <div class="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
            <label class="block text-sm font-bold text-gray-900 mb-2">Couleur de fond du site</label>
            <p class="text-xs text-gray-600 mb-4">Couleur de fond principale de votre site</p>
            <div class="flex gap-4 items-start">
              <div class="relative group">
                <input
                  :value="bodyBgHex"
                  @input="updateBodyBgFromHex"
                  type="color"
                  class="h-16 w-16 rounded-xl border-2 border-gray-300 cursor-pointer transition-all group-hover:scale-110 group-hover:shadow-lg"
                  style="padding: 4px;"
                />
                <div class="mt-2 text-xs font-mono text-gray-700 text-center font-bold">{{ bodyBgHex }}</div>
              </div>
              <div class="flex-1">
                <div class="grid grid-cols-3 gap-3">
                  <div>
                    <label class="text-xs text-gray-600 block mb-2 font-semibold">R</label>
                    <input
                      v-model.number="bodyBgRgb.r"
                      @input="updateBodyBgFromRgb"
                      type="number"
                      min="0"
                      max="255"
                      class="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 block mb-2 font-semibold">G</label>
                    <input
                      v-model.number="bodyBgRgb.g"
                      @input="updateBodyBgFromRgb"
                      type="number"
                      min="0"
                      max="255"
                      class="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 block mb-2 font-semibold">B</label>
                    <input
                      v-model.number="bodyBgRgb.b"
                      @input="updateBodyBgFromRgb"
                      type="number"
                      min="0"
                      max="255"
                      class="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium outline-none transition-all"
                    />
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-3 font-mono">RGB: {{ colors.body_bg }}</p>
              </div>
            </div>
          </div>

          <!-- Text Color -->
          <div class="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
            <label class="block text-sm font-bold text-gray-900 mb-2">Couleur du texte</label>
            <p class="text-xs text-gray-600 mb-4">Couleur principale du texte sur votre site</p>
            <div class="flex gap-4 items-start">
              <div class="relative group">
                <input
                  :value="textColorHex"
                  @input="updateTextColorFromHex"
                  type="color"
                  class="h-16 w-16 rounded-xl border-2 border-gray-300 cursor-pointer transition-all group-hover:scale-110 group-hover:shadow-lg"
                  style="padding: 4px;"
                />
                <div class="mt-2 text-xs font-mono text-gray-700 text-center font-bold">{{ textColorHex }}</div>
              </div>
              <div class="flex-1">
                <div class="grid grid-cols-3 gap-3">
                  <div>
                    <label class="text-xs text-gray-600 block mb-2 font-semibold">R</label>
                    <input
                      v-model.number="textColorRgb.r"
                      @input="updateTextColorFromRgb"
                      type="number"
                      min="0"
                      max="255"
                      class="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 block mb-2 font-semibold">G</label>
                    <input
                      v-model.number="textColorRgb.g"
                      @input="updateTextColorFromRgb"
                      type="number"
                      min="0"
                      max="255"
                      class="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label class="text-xs text-gray-600 block mb-2 font-semibold">B</label>
                    <input
                      v-model.number="textColorRgb.b"
                      @input="updateTextColorFromRgb"
                      type="number"
                      min="0"
                      max="255"
                      class="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium outline-none transition-all"
                    />
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-3 font-mono">RGB: {{ colors.text_color }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Icon name="ph:eye-bold" class="w-5 h-5 text-blue-600" />
          Aperçu en direct
        </h2>
        
        <!-- Button Previews -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div class="space-y-3">
            <h3 class="text-sm font-semibold text-gray-700">Bouton principal</h3>
            <button
              type="button"
              class="px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              :style="{
                backgroundColor: primaryColorHex,
                color: primaryContrastHex
              }"
            >
              Action principale
            </button>
          </div>

          <div class="space-y-3">
            <h3 class="text-sm font-semibold text-gray-700">Bouton secondaire</h3>
            <button
              type="button"
              class="px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              :style="{
                backgroundColor: secondaryColorHex,
                color: secondaryContrastHex
              }"
            >
              Action secondaire
            </button>
          </div>
        </div>

        <!-- Page Preview -->
        <div class="mb-6">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">Aperçu de page</h3>
          <div
            class="rounded-xl p-8 border-2 border-gray-200 shadow-inner"
            :style="{
              backgroundColor: bodyBgHex,
              color: textColorHex
            }"
          >
            <h4 class="text-2xl font-bold mb-3">Titre de la page</h4>
            <p class="text-sm mb-6 leading-relaxed">
              Voici un exemple de texte qui apparaîtra sur votre site avec les couleurs sélectionnées. 
              Cela vous permet de visualiser le rendu final avant d'enregistrer vos modifications.
            </p>
            <div class="flex flex-wrap gap-3">
              <button
                class="px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                :style="{
                  backgroundColor: primaryColorHex,
                  color: primaryContrastHex
                }"
              >
                Bouton principal
              </button>
              <button
                class="px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                :style="{
                  backgroundColor: secondaryColorHex,
                  color: secondaryContrastHex
                }"
              >
                Bouton secondaire
              </button>
            </div>
          </div>
        </div>

        <!-- Color Swatches -->
        <div>
          <h3 class="text-sm font-semibold text-gray-700 mb-4">Palette complète</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
              <div
                class="w-14 h-14 rounded-lg shadow-md border-2 border-gray-200 flex-shrink-0 group-hover:scale-110 transition-transform"
                :style="{ backgroundColor: primaryColorHex }"
              ></div>
              <div class="min-w-0">
                <p class="text-xs font-bold text-gray-900 truncate">Principale</p>
                <p class="text-xs font-mono text-gray-600 truncate">{{ primaryColorHex }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
              <div
                class="w-14 h-14 rounded-lg shadow-md border-2 border-gray-200 flex-shrink-0 group-hover:scale-110 transition-transform"
                :style="{ backgroundColor: primaryContrastHex }"
              ></div>
              <div class="min-w-0">
                <p class="text-xs font-bold text-gray-900 truncate">Contraste 1</p>
                <p class="text-xs font-mono text-gray-600 truncate">{{ primaryContrastHex }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
              <div
                class="w-14 h-14 rounded-lg shadow-md border-2 border-gray-200 flex-shrink-0 group-hover:scale-110 transition-transform"
                :style="{ backgroundColor: secondaryColorHex }"
              ></div>
              <div class="min-w-0">
                <p class="text-xs font-bold text-gray-900 truncate">Secondaire</p>
                <p class="text-xs font-mono text-gray-600 truncate">{{ secondaryColorHex }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
              <div
                class="w-14 h-14 rounded-lg shadow-md border-2 border-gray-200 flex-shrink-0 group-hover:scale-110 transition-transform"
                :style="{ backgroundColor: secondaryContrastHex }"
              ></div>
              <div class="min-w-0">
                <p class="text-xs font-bold text-gray-900 truncate">Contraste 2</p>
                <p class="text-xs font-mono text-gray-600 truncate">{{ secondaryContrastHex }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
              <div
                class="w-14 h-14 rounded-lg shadow-md border-2 border-gray-200 flex-shrink-0 group-hover:scale-110 transition-transform"
                :style="{ backgroundColor: bodyBgHex }"
              ></div>
              <div class="min-w-0">
                <p class="text-xs font-bold text-gray-900 truncate">Fond</p>
                <p class="text-xs font-mono text-gray-600 truncate">{{ bodyBgHex }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
              <div
                class="w-14 h-14 rounded-lg shadow-md border-2 border-gray-200 flex items-center justify-center bg-white flex-shrink-0 group-hover:scale-110 transition-transform"
              >
                <span class="text-2xl font-bold" :style="{ color: textColorHex }">Aa</span>
              </div>
              <div class="min-w-0">
                <p class="text-xs font-bold text-gray-900 truncate">Texte</p>
                <p class="text-xs font-mono text-gray-600 truncate">{{ textColorHex }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 sticky bottom-4">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div v-if="hasChanges" class="flex items-center text-sm text-amber-600">
            <Icon name="ph:warning-bold" class="w-5 h-5 mr-2" />
            <span class="font-semibold">Modifications non enregistrées</span>
          </div>
          <div v-else class="flex items-center text-sm text-green-600">
            <Icon name="ph:check-circle-bold" class="w-5 h-5 mr-2" />
            <span class="font-semibold">Tout est enregistré</span>
          </div>
          
          <div class="flex gap-3">
            <button
              v-if="hasChanges"
              @click="loadColors"
              :disabled="saving"
              class="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-all border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="ph:x-bold" class="w-4 h-4 mr-2" />
              Annuler
            </button>
            <button
              @click="saveColors"
              :disabled="saving || !hasChanges"
              :class="[
                'inline-flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg',
                saving || !hasChanges
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl transform hover:scale-105'
              ]"
            >
              <Icon
                :name="saving ? 'ph:spinner-bold' : 'ph:check-bold'"
                class="w-4 h-4 mr-2"
                :class="{ 'animate-spin': saving }"
              />
              {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const { showError } = useErrorModal()
const { showSuccess } = useSuccessSnackbar()

const loading = ref(true)
const saving = ref(false)

const colors = ref({
  id: null,
  primary_color: '59, 130, 246',
  primary_contrast_color: '255, 255, 255',
  secondary_color: '236, 72, 153',
  secondary_contrast_color: '255, 255, 255',
  body_bg: '255, 255, 255',
  text_color: '17, 24, 39'
})

const originalColors = ref(null)

const primaryRgb = ref({ r: 59, g: 130, b: 246 })
const primaryContrastRgb = ref({ r: 255, g: 255, b: 255 })
const secondaryRgb = ref({ r: 236, g: 72, b: 153 })
const secondaryContrastRgb = ref({ r: 255, g: 255, b: 255 })
const bodyBgRgb = ref({ r: 255, g: 255, b: 255 })
const textColorRgb = ref({ r: 17, g: 24, b: 39 })

const rgbToHex = (r, g, b) => {
  r = Math.max(0, Math.min(255, Math.round(r)))
  g = Math.max(0, Math.min(255, Math.round(g)))
  b = Math.max(0, Math.min(255, Math.round(b)))
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
}

const hexToRgb = (hex) => {
  hex = hex.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return { r, g, b }
}

const rgbStringToObject = (rgbString) => {
  const [r, g, b] = rgbString.split(',').map(c => parseInt(c.trim()))
  return { r: r || 0, g: g || 0, b: b || 0 }
}

const primaryColorHex = computed(() => rgbToHex(primaryRgb.value.r, primaryRgb.value.g, primaryRgb.value.b))
const primaryContrastHex = computed(() => rgbToHex(primaryContrastRgb.value.r, primaryContrastRgb.value.g, primaryContrastRgb.value.b))
const secondaryColorHex = computed(() => rgbToHex(secondaryRgb.value.r, secondaryRgb.value.g, secondaryRgb.value.b))
const secondaryContrastHex = computed(() => rgbToHex(secondaryContrastRgb.value.r, secondaryContrastRgb.value.g, secondaryContrastRgb.value.b))
const bodyBgHex = computed(() => rgbToHex(bodyBgRgb.value.r, bodyBgRgb.value.g, bodyBgRgb.value.b))
const textColorHex = computed(() => rgbToHex(textColorRgb.value.r, textColorRgb.value.g, textColorRgb.value.b))

const hasChanges = computed(() => {
  if (!originalColors.value) return false
  return JSON.stringify(colors.value) !== JSON.stringify(originalColors.value)
})

const updatePrimaryFromHex = (e) => {
  const rgb = hexToRgb(e.target.value)
  primaryRgb.value = rgb
  colors.value.primary_color = `${rgb.r}, ${rgb.g}, ${rgb.b}`
}

const updatePrimaryFromRgb = () => {
  colors.value.primary_color = `${primaryRgb.value.r}, ${primaryRgb.value.g}, ${primaryRgb.value.b}`
}

const updatePrimaryContrastFromHex = (e) => {
  const rgb = hexToRgb(e.target.value)
  primaryContrastRgb.value = rgb
  colors.value.primary_contrast_color = `${rgb.r}, ${rgb.g}, ${rgb.b}`
}

const updatePrimaryContrastFromRgb = () => {
  colors.value.primary_contrast_color = `${primaryContrastRgb.value.r}, ${primaryContrastRgb.value.g}, ${primaryContrastRgb.value.b}`
}

const updateSecondaryFromHex = (e) => {
  const rgb = hexToRgb(e.target.value)
  secondaryRgb.value = rgb
  colors.value.secondary_color = `${rgb.r}, ${rgb.g}, ${rgb.b}`
}

const updateSecondaryFromRgb = () => {
  colors.value.secondary_color = `${secondaryRgb.value.r}, ${secondaryRgb.value.g}, ${secondaryRgb.value.b}`
}

const updateSecondaryContrastFromHex = (e) => {
  const rgb = hexToRgb(e.target.value)
  secondaryContrastRgb.value = rgb
  colors.value.secondary_contrast_color = `${rgb.r}, ${rgb.g}, ${rgb.b}`
}

const updateSecondaryContrastFromRgb = () => {
  colors.value.secondary_contrast_color = `${secondaryContrastRgb.value.r}, ${secondaryContrastRgb.value.g}, ${secondaryContrastRgb.value.b}`
}

const updateBodyBgFromHex = (e) => {
  const rgb = hexToRgb(e.target.value)
  bodyBgRgb.value = rgb
  colors.value.body_bg = `${rgb.r}, ${rgb.g}, ${rgb.b}`
}

const updateBodyBgFromRgb = () => {
  colors.value.body_bg = `${bodyBgRgb.value.r}, ${bodyBgRgb.value.g}, ${bodyBgRgb.value.b}`
}

const updateTextColorFromHex = (e) => {
  const rgb = hexToRgb(e.target.value)
  textColorRgb.value = rgb
  colors.value.text_color = `${rgb.r}, ${rgb.g}, ${rgb.b}`
}

const updateTextColorFromRgb = () => {
  colors.value.text_color = `${textColorRgb.value.r}, ${textColorRgb.value.g}, ${textColorRgb.value.b}`
}

const loadColors = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('id, primary_color, primary_contrast_color, secondary_color, secondary_contrast_color, body_bg, text_color')
      .single()

    if (error) throw error

    if (data) {
      colors.value = {
        id: data.id,
        primary_color: data.primary_color || '59, 130, 246',
        primary_contrast_color: data.primary_contrast_color || '255, 255, 255',
        secondary_color: data.secondary_color || '236, 72, 153',
        secondary_contrast_color: data.secondary_contrast_color || '255, 255, 255',
        body_bg: data.body_bg || '255, 255, 255',
        text_color: data.text_color || '17, 24, 39'
      }

      primaryRgb.value = rgbStringToObject(colors.value.primary_color)
      primaryContrastRgb.value = rgbStringToObject(colors.value.primary_contrast_color)
      secondaryRgb.value = rgbStringToObject(colors.value.secondary_color)
      secondaryContrastRgb.value = rgbStringToObject(colors.value.secondary_contrast_color)
      bodyBgRgb.value = rgbStringToObject(colors.value.body_bg)
      textColorRgb.value = rgbStringToObject(colors.value.text_color)

      originalColors.value = JSON.parse(JSON.stringify(colors.value))
    }
  } catch (error) {
    console.error('Error:', error)
    showError('Impossible de charger les couleurs')
  } finally {
    loading.value = false
  }
}

const saveColors = async () => {
  saving.value = true
  try {
    const { error } = await supabase
      .from('site_config')
      .update({
        primary_color: colors.value.primary_color,
        primary_contrast_color: colors.value.primary_contrast_color,
        secondary_color: colors.value.secondary_color,
        secondary_contrast_color: colors.value.secondary_contrast_color,
        body_bg: colors.value.body_bg,
        text_color: colors.value.text_color,
        updated_at: new Date().toISOString()
      })
      .eq('id', colors.value.id)

    if (error) throw error

    originalColors.value = JSON.parse(JSON.stringify(colors.value))
    showSuccess('Couleurs enregistrées')
  } catch (error) {
    console.error('Error:', error)
    showError('Erreur lors de l\'enregistrement')
  } finally {
    saving.value = false
  }
}

onMounted(() => loadColors())

useHead({
  title: 'Couleurs du site',
  meta: [{ name: 'description', content: 'Gérez la palette de couleurs' }]
})
</script>