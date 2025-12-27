<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Technologies</h1>
            <p class="mt-2 text-sm text-gray-600">
              Manage your technology showcase pages
            </p>
          </div>
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Icon name="heroicons-outline:plus" class="h-5 w-5 mr-2" />
            Create Technology
          </button>
        </div>
      </div>

      <!-- Technologies Grid -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-lg p-6 animate-pulse">
          <div class="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>

      <div v-else-if="technologies.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="tech in technologies"
          :key="tech.id"
          class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
        >
          <!-- Cover Image -->
          <div class="h-48 bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden">
            <NuxtImg
              v-if="tech.cover_image_url"
              :src="tech.cover_image_url"
              :alt="getTranslation(tech.name_translations)"
              class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
              loading="lazy"
            />
            <!-- Logo Overlay -->
            <div v-if="tech.logo_url" class="absolute inset-0 flex items-center justify-center">
              <NuxtImg
                :src="tech.logo_url"
                :alt="getTranslation(tech.name_translations)"
                class="h-20 w-auto object-contain drop-shadow-2xl"
                loading="lazy"
              />
            </div>
            <!-- Status Badge -->
            <div class="absolute top-4 right-4">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  tech.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                ]"
              >
                {{ tech.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ getTranslation(tech.name_translations) }}
            </h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ getTranslation(tech.short_description_translations) }}
            </p>

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <NuxtLink
                :to="`/admin/technologies/${tech.id}/edit`"
                class="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Icon name="heroicons-outline:pencil" class="h-4 w-4 mr-2" />
                Edit
              </NuxtLink>
              <NuxtLink
                :to="`/technologies/${tech.slug}`"
                target="_blank"
                class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
              >
                <Icon name="heroicons-outline:eye" class="h-4 w-4" />
              </NuxtLink>
              <button
                @click="confirmDelete(tech)"
                class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700"
              >
                <Icon name="heroicons-outline:trash" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <Icon name="heroicons-outline:desktop-computer" class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No technologies</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new technology.</p>
        <div class="mt-6">
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Icon name="heroicons-outline:plus" class="h-5 w-5 mr-2" />
            New Technology
          </button>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="showCreateModal = false"
    >
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Create New Technology</h3>
          <form @submit.prevent="createTech">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Name (French)
                </label>
                <input
                  v-model="newTech.name_fr"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Impact Fusion"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  v-model="newTech.slug"
                  type="text"
                  required
                  pattern="[a-z0-9-]+"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., impact-fusion"
                />
                <p class="mt-1 text-xs text-gray-500">Only lowercase letters, numbers, and hyphens</p>
              </div>
            </div>
            <div class="mt-6 flex gap-3">
              <button
                type="button"
                @click="showCreateModal = false"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="creating"
                class="flex-1 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {{ creating ? 'Creating...' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const { fetchTechnologies, createTechnology, deleteTechnology, getTranslation } = useTechnologies()
const { showConfirmation } = useConfirmationModal()
const { showError } = useErrorModal()
const { showSuccess } = useSuccessSnackbar()
const router = useRouter()

const technologies = ref([])
const loading = ref(true)
const creating = ref(false)
const showCreateModal = ref(false)
const newTech = ref({
  name_fr: '',
  slug: ''
})

const loadTechnologies = async () => {
  loading.value = true
  try {
    const { data, error } = await fetchTechnologies()
    if (error) throw error
    technologies.value = data || []
  } catch (error) {
    console.error(error)
    showError('Failed to load technologies')
  } finally {
    loading.value = false
  }
}

const createTech = async () => {
  creating.value = true
  try {
    const { data, error } = await createTechnology({
      slug: newTech.value.slug,
      name_translations: {
        fr: newTech.value.name_fr,
        ar: '',
        en: ''
      },
      short_description_translations: {
        fr: '',
        ar: '',
        en: ''
      },
      is_active: true
    })
    if (error) throw error
    showSuccess('Technology created successfully')
    showCreateModal.value = false
    router.push(`/admin/technologies/${data.id}/edit`)
  } catch (error) {
    console.error(error)
    showError('Failed to create technology')
  } finally {
    creating.value = false
  }
}

const confirmDelete = (tech) => {
  showConfirmation({
    title: 'Delete Technology',
    message: `Are you sure you want to delete "${getTranslation(tech.name_translations)}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    onConfirm: async () => {
      try {
        const { error } = await deleteTechnology(tech.id)
        if (error) throw error
        showSuccess('Technology deleted successfully')
        await loadTechnologies()
      } catch (error) {
        console.error(error)
        showError('Failed to delete technology')
      }
    }
  })
}

onMounted(loadTechnologies)

useHead({
  title: 'Technologies - Admin',
  meta: [
    { name: 'description', content: 'Manage your technology showcase pages' }
  ]
})
</script>