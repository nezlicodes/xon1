<template>
  <div class="bg-white shadow overflow-hidden relative rounded-lg">
    <!-- Toggle visibility button -->
    <button
      @click="toggleVisibility"
      class="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all"
      :title="section.is_active ? 'Hide Navigation' : 'Show Navigation'"
    >
      <Icon
        :name="section.is_active ? 'heroicons-outline:eye' : 'heroicons-outline:eye-off'"
        class="h-5 w-5 text-gray-700"
      />
    </button>

    <!-- Loading State -->
    <div v-if="loading" class="px-6 py-12 flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-100 border-t-blue-600"></div>
    </div>

    <!-- Hidden placeholder -->
    <div v-else-if="!section.is_active" class="flex items-center justify-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg m-6">
      <div class="text-center">
        <Icon name="heroicons-outline:menu" class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Navigation Hidden</h3>
        <p class="mt-1 text-sm text-gray-500">Click the eye icon to show</p>
      </div>
    </div>

    <!-- Navigation Bar Preview (inline editable) -->
    <div v-else class="relative">
      <!-- Actual navigation bar as it appears on site -->
      <nav class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16 gap-4 lg:gap-8">
            
            <!-- Logo Section -->
            <div class="flex-shrink-0 group relative">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Icon name="heroicons-outline:home" class="w-6 h-6 text-gray-400" />
                </div>
                <span class="text-xl font-bold text-gray-900 hidden sm:block">Site Name</span>
              </div>
              <div class="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
                Logo area (configured in site settings)
              </div>
            </div>

            <!-- Navigation Links (editable) -->
            <div class="hidden lg:flex items-center space-x-1">
              <!-- Featured Categories placeholder -->
              <div v-if="currentContent.show_featured_categories" class="flex items-center space-x-1 mr-4">
                <div class="px-3 py-2 text-sm text-gray-500 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                  Featured Categories
                </div>
              </div>

              <!-- Custom Navigation Links -->
              <div 
                v-for="(link, index) in visibleLinks" 
                :key="index"
                class="relative group"
              >
                <div 
                  class="nav-link px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary rounded-md cursor-pointer transition-all duration-300 group-hover:bg-gray-50"
                  @click="editLink(index)"
                >
                  {{ link.label || 'Click to edit' }}
                  <button class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-blue-600 hover:bg-blue-700 p-1 rounded-full text-white shadow-lg transition-all transform hover:scale-110">
                    <Icon name="heroicons-outline:pencil" class="w-3 h-3" />
                  </button>
                </div>
                <div class="absolute top-full left-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-500 bg-white px-2 py-1 rounded shadow whitespace-nowrap z-10">
                  {{ link.url || 'No URL set' }}
                </div>
              </div>

              <!-- Add Link Button -->
              <button
                @click="addLink"
                class="ml-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-all flex items-center gap-1"
              >
                <Icon name="heroicons-outline:plus" class="w-4 h-4" />
                Add Link
              </button>
            </div>

            <!-- Right side icons -->
            <div class="flex items-center space-x-2 lg:space-x-4">
              <div class="p-2 text-gray-400 bg-gray-50 rounded-lg">
                <Icon name="heroicons-outline:shopping-cart" class="w-5 h-5" />
              </div>
              <div class="p-2 text-gray-400 bg-gray-50 rounded-lg">
                <Icon name="heroicons-outline:translate" class="w-5 h-5" />
              </div>
              <div class="p-2 text-gray-400 bg-gray-50 rounded-lg lg:hidden">
                <Icon name="heroicons-outline:menu" class="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Settings Controls -->
      <div class="absolute bottom-4 left-4 space-y-2 z-20">
        <div v-if="showSettings" class="bg-white rounded-lg shadow-xl p-4 min-w-[250px] space-y-3">
          <h4 class="text-sm font-medium text-gray-700">Navigation Settings</h4>
          
          <label class="flex items-center">
            <input
              v-model="currentContent.show_featured_categories"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              @change="saveSection"
            />
            <span class="ml-2 text-sm text-gray-700">Show Featured Categories</span>
          </label>
          
          <label class="flex items-center">
            <input
              v-model="currentContent.show_categories_dropdown"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              @change="saveSection"
            />
            <span class="ml-2 text-sm text-gray-700">Show Categories Dropdown</span>
          </label>
        </div>
        
        <button
          @click="showSettings = !showSettings"
          class="bg-white/90 backdrop-blur-sm hover:bg-white px-3 py-2 rounded-lg text-gray-700 text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-lg"
        >
          <Icon name="heroicons-outline:cog" class="w-4 h-4" />
          Settings
        </button>
      </div>
    </div>

    <!-- Loading/Saving indicator -->
    <div v-if="saving" class="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
      <Icon name="heroicons-outline:refresh" class="w-4 h-4 animate-spin" />
      <span class="text-sm">Saving...</span>
    </div>

    <!-- Edit Link Modal -->
    <div v-if="editingLink !== null" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeEditModal">
      <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Edit Navigation Link</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Label</label>
            <input
              v-model="editData.label"
              type="text"
              placeholder="e.g., Products, About Us"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">URL</label>
            <input
              v-model="editData.url"
              type="text"
              placeholder="e.g., /products, /about"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label class="flex items-center">
              <input
                v-model="editData.visible"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">Visible in navigation</span>
            </label>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="removeLink(editingLink)"
            class="px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
          <button
            @click="closeEditModal"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="saveLink"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
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

const SECTION_KEY = 'header_nav'

const loading = ref(true)
const saving = ref(false)
const showSettings = ref(false)
const editingLink = ref(null)
const editData = ref({})

// Default content
const defaultContent = {
  links: [
    { label: "Produits", url: "/products", visible: true, type: "link" },
    { label: "À Propos", url: "/about", visible: true, type: "link" },
    { label: "Contact", url: "/contact", visible: true, type: "link" },
  ],
  show_featured_categories: true,
  show_categories_dropdown: false,
}

const section = ref({
  id: null,
  section_key: SECTION_KEY,
  section_type: 'navigation',
  is_active: true,
  content_translations: {
    fr: { ...defaultContent },
    ar: { ...defaultContent },
    en: { ...defaultContent }
  }
})

// Get current language content
const currentContent = computed({
  get() {
    return section.value.content_translations?.[editorLanguage.value] || defaultContent
  },
  set(value) {
    if (!section.value.content_translations) {
      section.value.content_translations = {}
    }
    section.value.content_translations[editorLanguage.value] = value
  }
})

// Get visible links
const visibleLinks = computed(() => {
  return (currentContent.value.links || defaultContent.links).filter(link => link.visible !== false)
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
      section.value = {
        id: data.id,
        section_key: data.section_key,
        is_active: data.is_active ?? true,
        content_translations: data.content_translations || {
          fr: { ...defaultContent },
          ar: { ...defaultContent },
          en: { ...defaultContent }
        }
      }
    } else {
      await createDefaultSection()
    }
  } catch (error) {
    console.error('Error loading appbar settings:', error)
    showError('Impossible de charger les paramètres de navigation')
  } finally {
    loading.value = false
  }
}

const createDefaultSection = async () => {
  try {
    const { data, error } = await supabase
      .from('content_sections')
      .insert({
        section_key: SECTION_KEY,
        section_type: 'navigation',
        is_active: true,
        content_translations: {
          fr: { ...defaultContent },
          ar: { ...defaultContent },
          en: { ...defaultContent }
        }
      })
      .select()
      .single()

    if (error) throw error
    section.value = data
  } catch (error) {
    console.error('Error creating appbar settings:', error)
  }
}

const saveSection = async () => {
  if (saving.value) return
  
  saving.value = true
  try {
    if (section.value.id) {
      // Update existing section
      const { error } = await supabase
        .from('content_sections')
        .update({
          section_key: SECTION_KEY,
          section_type: 'navigation',
          is_active: section.value.is_active,
          content_translations: section.value.content_translations
        })
        .eq('id', section.value.id)

      if (error) throw error
    } else {
      // Create new section
      const { data, error } = await supabase
        .from('content_sections')
        .insert({
          section_key: SECTION_KEY,
          section_type: 'navigation',
          is_active: section.value.is_active,
          content_translations: section.value.content_translations
        })
        .select()
        .single()

      if (error) throw error
      if (data) section.value.id = data.id
    }
    
    // Show success briefly
    showSuccess('Navigation updated successfully')
  } catch (error) {
    console.error('Error saving appbar settings:', error)
    showError('Error saving navigation')
  } finally {
    saving.value = false
  }
}

const toggleVisibility = async () => {
  section.value.is_active = !section.value.is_active
  await saveSection()
}

const editLink = (index) => {
  editingLink.value = index
  editData.value = JSON.parse(JSON.stringify(currentContent.value.links[index]))
}

const addLink = () => {
  if (!currentContent.value.links) currentContent.value.links = []
  const newLink = { label: "New Link", url: "", visible: true, type: "link" }
  currentContent.value.links.push(newLink)
  // Immediately edit the new link
  editLink(currentContent.value.links.length - 1)
}

const removeLink = (index) => {
  currentContent.value.links.splice(index, 1)
  closeEditModal()
  saveSection()
}

const saveLink = async () => {
  if (editingLink.value !== null) {
    currentContent.value.links[editingLink.value] = { ...editData.value }
    await saveSection()
    closeEditModal()
  }
}

const closeEditModal = () => {
  editingLink.value = null
  editData.value = {}
}

// Load data on mount
onMounted(loadSection)
</script>