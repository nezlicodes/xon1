<template>
  <div class="pt-3 px-4 sm:p-6 space-y-6 max-w-5xl">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div class="sm:flex-auto">
        <h1 class="text-xl md:text-2xl font-semibold text-gray-900">Edit Policy</h1>
        <p class="mt-2 text-sm text-gray-600">Update the policy title and content using a simple rich-text editor.</p>
      </div>
      <NuxtLink to="/admin/policies" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
        ← Back
      </NuxtLink>
    </div>

    <!-- Language Selector -->
    <div class="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
      <Icon name="heroicons-outline:translate" class="w-5 h-5 text-primary" />
      <div class="flex gap-2">
        <button v-for="lang in languages" :key="lang.code" @click="setLanguage(lang.code)"
          :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200', editorLanguage === lang.code ? 'bg-primary text-contrast1 shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200']">
          {{ lang.flag }} {{ lang.name }}
        </button>
      </div>
    </div>

    <!-- Simple Title + RichText -->
    <div v-if="loaded" class="space-y-4 bg-white rounded-xl shadow p-4 sm:p-6">
      <div class="grid grid-cols-1 gap-4">
        <label class="block text-sm font-medium text-gray-700">Title ({{ currentLangName }})</label>
        <input
          v-model="localTitle"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter policy title"
        />
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">Content ({{ currentLangName }})</label>
        <PluginsRichText v-model:content="localContent" />
      </div>

      <div class="flex items-center justify-end gap-3 pt-2">
        <button @click="reset" type="button" class="px-4 py-2 border rounded-md text-sm">Reset</button>
        <button @click="save" :disabled="saving" type="button" class="px-4 py-2 bg-primary text-contrast1 rounded-md text-sm hover:bg-primary-600 disabled:opacity-60">
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </div>

    <div v-else class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const supabase = useSupabaseClient()
const { showError } = useErrorModal()
const { showSuccess } = useSuccessSnackbar()
const { editorLanguage, setLanguage } = useEditorLanguage()

const policyId = computed(() => Array.isArray(route.params.id) ? route.params.id[0] : route.params.id)

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇩🇿' },
]

const currentLangName = computed(() => ({ fr: 'Français', en: 'English', ar: 'العربية' })[editorLanguage.value])

const loaded = ref(false)
const saving = ref(false)
const policy = ref(null)

// Local fields for current language only
const localTitle = ref('')
const localContent = ref('')

const applyFromPolicy = () => {
  const t = policy.value?.title_translations || {}
  const simple = policy.value?.simple_content_translations || {}
  const short = policy.value?.short_description_translations || {}
  const lang = editorLanguage.value
  localTitle.value = t[lang] || ''
  // Prefer simple_content if present; otherwise fall back to short_description
  const fromSimple = (simple && typeof simple === 'object') ? (simple[lang] || '') : ''
  const fromShort = (short && typeof short === 'object') ? (short[lang] || '') : ''
  localContent.value = fromSimple && fromSimple.trim() !== '' ? fromSimple : fromShort
}

const loadPolicy = async () => {
  loaded.value = false
  try {
    const { data, error } = await supabase.from('policies').select('*').eq('id', policyId.value).single()
    if (error) throw error
    policy.value = data
    applyFromPolicy()
  } catch (e) {
    console.error(e)
    showError('Unable to load policy')
  } finally {
    loaded.value = true
  }
}

const reset = () => applyFromPolicy()

const save = async () => {
  if (!policy.value) return
  saving.value = true
  try {
    const newTitles = { ...(policy.value.title_translations || {}) }
    const newContents = { ...(policy.value.simple_content_translations || {}) }
    newTitles[editorLanguage.value] = localTitle.value
    newContents[editorLanguage.value] = localContent.value

    const updates = {
      title_translations: newTitles,
      simple_content_translations: newContents,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase.from('policies').update(updates).eq('id', policyId.value).select('*').single()
    if (error) throw error
    policy.value = data
    showSuccess('Policy saved')
  } catch (e) {
    console.error(e)
    showError('Failed to save policy')
  } finally {
    saving.value = false
  }
}

onMounted(loadPolicy)
watch(() => editorLanguage.value, () => {
  if (policy.value) applyFromPolicy()
})

definePageMeta({ layout: 'default', middleware: ['auth'] })
useHead({ title: 'Edit Policy' })
</script>
