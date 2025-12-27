<template>
  <div class="bg-white shadow overflow-hidden relative">
    <!-- Toggle visibility button -->
    <button
      @click="toggleVisibility"
      class="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all"
      :title="section.is_active ? 'Masquer' : 'Afficher'"
    >
      <Icon
        :name="section.is_active ? 'heroicons-outline:eye' : 'heroicons-outline:eye-off'"
        class="h-5 w-5 text-gray-700"
      />
    </button>

    <!-- Loading State -->
    <div v-if="loading" class="px-6 py-12 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-purple-100 border-t-purple-600"></div>
    </div>

    <!-- Hidden placeholder -->
    <div v-else-if="!section.is_active" class="flex items-center justify-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
      <div class="text-center">
        <Icon name="heroicons-outline:speakerphone" class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Bannière masquée</h3>
        <p class="mt-1 text-sm text-gray-500">Cliquez sur l'icône d'œil pour afficher</p>
      </div>
    </div>

    <!-- Banner Preview (editable) -->
    <div v-else class="relative">
      <!-- Actual banner as it appears on site -->
      <div class="bg-primary text-contrast1 text-center py-4 px-4">
        <div class="relative group inline-block border-2 border-transparent rounded transition-all hover:border-white/50 px-4 py-2 cursor-pointer" @click="openEditor">
          <p class="text-sm font-medium transition-all duration-300 group-hover:ring-2 group-hover:ring-white/30 rounded px-2 py-1" 
             v-text="section.content_translations[editorLanguage].text || 'Click to edit banner text...'" />
          <button
            class="absolute -top-3 -right-2 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full text-white shadow-lg transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100"
          >
            <Icon class="w-4 h-4" name="heroicons-outline:pencil-alt" />
          </button>
          <div class="text-xs text-white/70 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to edit</div>
        </div>
      </div>
    </div>

    <!-- Loading/Saving indicator -->
    <div v-if="saving" class="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
      <Icon name="heroicons-outline:refresh" class="w-4 h-4 animate-spin" />
      <span class="text-sm">Enregistrement...</span>
    </div>

    <!-- Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Modifier la bannière</h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-500">
            <Icon name="heroicons-outline:x" class="h-5 w-5" />
          </button>
        </div>

        <!-- Items editor -->
        <div class="space-y-3">
          <div v-for="(item, idx) in tempItems" :key="idx" class="flex items-center gap-2">
            <input
              v-model="tempItems[idx]"
              type="text"
              class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              :placeholder="`Texte #${idx + 1}`"
            />
            <button class="p-2 text-gray-500 hover:text-gray-700" @click="moveUp(idx)" :disabled="idx === 0" title="Monter">
              <Icon name="heroicons-outline:chevron-up" class="w-5 h-5" />
            </button>
            <button class="p-2 text-gray-500 hover:text-gray-700" @click="moveDown(idx)" :disabled="idx === tempItems.length - 1" title="Descendre">
              <Icon name="heroicons-outline:chevron-down" class="w-5 h-5" />
            </button>
            <button class="p-2 text-red-500 hover:text-red-600" @click="removeItem(idx)" title="Supprimer">
              <Icon name="heroicons-outline:trash" class="w-5 h-5" />
            </button>
          </div>

          <div class="flex justify-between items-center pt-2">
            <button class="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700" @click="addItem">
              <Icon name="heroicons-outline:plus" class="mr-1.5 h-4 w-4" />
              Ajouter un texte
            </button>
            <span class="text-xs text-gray-500">L'ordre est respecté dans le défilement</span>
          </div>

          <!-- Live Preview -->
          <div class="mt-4 border rounded bg-gray-50">
            <div class="bg-primary text-contrast1 text-center py-3 text-sm font-medium relative overflow-hidden group">
              <div class="marquee" :class="isRtl ? 'rtl' : 'ltr'">
                <div class="marquee__inner" :style="{ '--marquee-duration': duration + 's' }">
                  <div class="marquee__track">
                    <span v-for="(it, idx) in previewTrackItems" :key="'a-' + idx" class="marquee__item">{{ it }}</span>
                  </div>
                  <div class="marquee__track" aria-hidden="true">
                    <span v-for="(it, idx) in previewTrackItems" :key="'b-' + idx" class="marquee__item">{{ it }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            @click="showModal = false"
          >
            <Icon name="heroicons-outline:x" class="mr-1.5 h-4 w-4" />
            Annuler
          </button>
          <button
            type="button"
            :disabled="saving"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            @click="saveItems"
          >
            <Icon :name="saving ? 'heroicons-outline:refresh' : 'heroicons-outline:check'" class="mr-1.5 h-4 w-4" :class="{ 'animate-spin': saving }" />
            {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const { showError } = useErrorModal()
const { showSuccess } = useSuccessSnackbar()
const { editorLanguage } = useEditorLanguage()

const SECTION_KEY = 'top_banner'

const loading = ref(true)
const saving = ref(false)
const showModal = ref(false)
const tempItems = ref([])
const textInput = ref(null)

// Marquee preview helpers
const duration = ref(18)
const isRtl = computed(() => (editorLanguage.value === 'ar'))
const previewItems = computed(() => (tempItems.value || []).map(s => (s || '').trim()).filter(s => s.length))
const previewTrackItems = computed(() => {
  const base = previewItems.value
  if (base.length >= 2) return base
  if (base.length === 1) return [base[0], base[0]]
  return []
})

const section = ref({
  id: null,
  section_key: SECTION_KEY,
  is_active: true,
  content_translations: {
    fr: { text: '', items: [] },
    ar: { text: '', items: [] },
    en: { text: '', items: [] }
  }
})

const loadSection = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .eq('section_key', SECTION_KEY)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    if (data) {
      // Migrate to items[] while keeping text for backward compatibility
      const ct = data.content_translations || {}
      const normalize = (t) => ({
        text: t?.text || '',
        items: Array.isArray(t?.items) ? t.items : (t?.text ? [t.text] : [])
      })
      section.value = {
        id: data.id,
        section_key: data.section_key,
        is_active: data.is_active ?? true,
        content_translations: {
          fr: normalize(ct.fr),
          ar: normalize(ct.ar),
          en: normalize(ct.en)
        }
      }
    } else {
      await createDefaultSection()
    }
  } catch (error) {
    console.error('Error loading banner:', error)
    showError('Impossible de charger la bannière')
  } finally {
    loading.value = false
  }
}

const createDefaultSection = async () => {
  try {
    const defaults = {
      fr: { text: 'Profitez de -20% avec le code PROMO', items: ['Profitez de -20% avec le code PROMO'] },
      ar: { text: 'استمتع بخصم 20٪', items: ['استمتع بخصم 20٪'] },
      en: { text: 'Enjoy 20% off with code PROMO', items: ['Enjoy 20% off with code PROMO'] },
    }
    const { data, error } = await supabase
      .from('content_sections')
      .insert({
        section_key: SECTION_KEY,
        is_active: true,
        content_translations: defaults
      })
      .select()
      .single()

    if (error) throw error
    section.value = data
  } catch (error) {
    console.error('Error creating banner:', error)
  }
}

const toggleVisibility = async () => {
  section.value.is_active = !section.value.is_active
  await saveSection()
}

const openEditor = () => {
  const t = section.value.content_translations[editorLanguage.value]
  tempItems.value = Array.isArray(t.items) && t.items.length ? [...t.items] : (t.text ? [t.text] : [''])
  showModal.value = true
  nextTick(() => {
    // focus first input
    if (textInput.value) {
      textInput.value.focus()
    }
  })
}

const saveItems = async () => {
  const cleaned = (tempItems.value || []).map((s) => (s || '').trim()).filter((s) => s.length)
  const lang = editorLanguage.value
  section.value.content_translations[lang].items = cleaned
  // Keep first as legacy text for compatibility
  section.value.content_translations[lang].text = cleaned[0] || ''
  showModal.value = false
  await saveSection()
}

const saveSection = async () => {
  saving.value = true
  try {
    const { error } = await supabase
      .from('content_sections')
      .update({
        is_active: section.value.is_active,
        content_translations: section.value.content_translations,
        updated_at: new Date().toISOString()
      })
      .eq('id', section.value.id)

    if (error) throw error
    showSuccess('Bannière enregistrée')
  } catch (error) {
    console.error('Error saving banner:', error)
    showError('Erreur')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadSection()
})

// Editor list actions
const addItem = () => {
  tempItems.value.push('')
}
const removeItem = (idx) => {
  tempItems.value.splice(idx, 1)
}
const moveUp = (idx) => {
  if (idx <= 0) return
  const arr = tempItems.value
  ;[arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]
}
const moveDown = (idx) => {
  const arr = tempItems.value
  if (idx >= arr.length - 1) return
  ;[arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]]
}
</script>

<style scoped>
/* Minimal marquee styles for preview */
.marquee { position: relative; overflow: hidden; white-space: nowrap; }
.marquee__inner { display: flex; align-items: center; gap: 0; width: max-content; padding-inline: 1rem; will-change: transform; animation-duration: var(--marquee-duration, 18s); animation-timing-function: linear; animation-iteration-count: infinite; }
.marquee__track { flex: 0 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 0; padding-inline: var(--track-gap, 2.5rem); min-width: 100%; }

.ltr .marquee__inner { animation-name: marquee-ltr; }
.rtl .marquee__inner { animation-name: marquee-rtl; }
@keyframes marquee-ltr { 0% { transform: translate3d(0,0,0);} 100% { transform: translate3d(-50%,0,0);} }
@keyframes marquee-rtl { 0% { transform: translate3d(0,0,0);} 100% { transform: translate3d(50%,0,0);} }
/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) { .marquee__inner { animation: none !important; } }
</style>
