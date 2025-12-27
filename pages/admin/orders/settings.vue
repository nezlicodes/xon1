<template>
  <div class="p-3 sm:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-2xl md:text-3xl font-medium text-gray-900">Frais de livraison</h1>
          <p class="mt-1 text-sm text-gray-600">Gérez les frais de livraison par wilaya et commune</p>
        </div>
        
        <button
          @click="openAddModal"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Icon name="ph:plus-bold" class="w-5 h-5" />
          Ajouter un tarif
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Wilaya Filter -->
          <div>
            <label for="wilayaFilter" class="block text-sm font-medium text-gray-700 mb-1">
              Wilaya
            </label>
            <select
              id="wilayaFilter"
              v-model="filters.wilayaId"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="">Toutes les wilayas</option>
              <option v-for="wilaya in locationWilayas" :key="wilaya.id" :value="wilaya.id">
                {{ wilaya.name }}
              </option>
            </select>
          </div>

          <!-- Delivery Type Filter -->
          <div>
            <label for="typeFilter" class="block text-sm font-medium text-gray-700 mb-1">
              Type de livraison
            </label>
            <select
              id="typeFilter"
              v-model="filters.deliveryType"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="">Tous les types</option>
              <option value="stopdesk">Stop Desk</option>
              <option value="home">Domicile</option>
            </select>
          </div>

          <!-- Reset Button -->
          <div class="flex items-end">
            <button
              @click="resetFilters"
              class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <!-- Delivery Fees Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- Loading State -->
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p class="mt-2 text-sm text-gray-600">Chargement des tarifs...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!filteredFees.length" class="p-8 text-center">
          <Icon name="ph:currency-circle-dollar-bold" class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun tarif</h3>
          <p class="mt-1 text-sm text-gray-500">
            Commencez par ajouter un tarif de livraison
          </p>
        </div>

        <!-- Fees List -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wilaya
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commune
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarif
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="fee in filteredFees"
                :key="fee.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <!-- Wilaya -->
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ fee.wilaya_name }}</div>
                </td>

                <!-- Commune -->
                <td class="px-6 py-4">
                  <div v-if="fee.commune_name" class="text-sm text-gray-900">
                    {{ fee.commune_name }}
                  </div>
                  <div v-else class="text-sm text-gray-500 italic">
                    Toute la wilaya
                  </div>
                </td>

                <!-- Delivery Type -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="fee.delivery_type === 'stopdesk' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'"
                  >
                    {{ fee.delivery_type === 'stopdesk' ? 'Stop Desk' : 'Domicile' }}
                  </span>
                </td>

                <!-- Fee -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ fee.fee.toFixed(2) }} DZD
                  </div>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="openEditModal(fee)"
                    class="text-primary hover:text-primary/80 mr-3"
                  >
                    Modifier
                  </button>
                  <button
                    @click="handleDelete(fee.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">
              {{ editingFee ? 'Modifier le tarif' : 'Ajouter un tarif' }}
            </h2>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <Icon name="ph:x-bold" class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
            <!-- Wilaya Selection -->
            <div>
              <label for="wilaya" class="block text-sm font-medium text-gray-700 mb-1">
                Wilaya <span class="text-red-500">*</span>
              </label>
              <select
                id="wilaya"
                v-model="form.wilayaId"
                @change="onWilayaChange"
                required
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="">Sélectionner une wilaya</option>
                <option v-for="wilaya in locationWilayas" :key="wilaya.id" :value="wilaya.id">
                  {{ wilaya.name }}
                </option>
              </select>
            </div>

            <!-- Commune Selection -->
            <div>
              <label for="commune" class="block text-sm font-medium text-gray-700 mb-1">
                Commune
              </label>
              <select
                id="commune"
                v-model="form.communeId"
                :disabled="!form.wilayaId || !locationCommunes.length"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm disabled:bg-gray-100"
              >
                <option value="">Toute la wilaya</option>
                <option v-for="commune in locationCommunes" :key="commune.id" :value="commune.id">
                  {{ commune.name }}
                </option>
              </select>
              <p class="mt-1 text-xs text-gray-500">
                Laissez vide pour appliquer à toute la wilaya
              </p>
            </div>

            <!-- Delivery Type -->
            <div>
              <label for="deliveryType" class="block text-sm font-medium text-gray-700 mb-1">
                Type de livraison <span class="text-red-500">*</span>
              </label>
              <select
                id="deliveryType"
                v-model="form.deliveryType"
                required
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="">Sélectionner un type</option>
                <option value="stopdesk">Stop Desk</option>
                <option value="home">Domicile</option>
              </select>
            </div>

            <!-- Fee -->
            <div>
              <label for="fee" class="block text-sm font-medium text-gray-700 mb-1">
                Tarif (DZD) <span class="text-red-500">*</span>
              </label>
              <input
                id="fee"
                v-model.number="form.fee"
                type="number"
                step="0.01"
                min="0"
                required
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="0.00"
              />
            </div>

            <!-- Error Message -->
            <div v-if="formError" class="rounded-md bg-red-50 p-3">
              <div class="flex">
                <Icon name="ph:warning-circle-bold" class="h-5 w-5 text-red-400" />
                <div class="ml-3">
                  <p class="text-sm text-red-800">{{ formError }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {{ editingFee ? 'Modifier' : 'Ajouter' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'

// Composables
const { getAllDeliveryFees, createDeliveryFee, updateDeliveryFee, deleteDeliveryFee, loading } = useDeliveryFees()
const { wilayas: locationWilayas, communes: locationCommunes, fetchWilayas, fetchCommunesByWilaya } = useLocation()
const { showConfirmation } = useConfirmationModal()

// State
const deliveryFees = ref([])
const showModal = ref(false)
const editingFee = ref(null)
const formError = ref('')

// Filters
const filters = reactive({
  wilayaId: '',
  deliveryType: '',
})

// Form
const form = reactive({
  wilayaId: '',
  communeId: '',
  deliveryType: '',
  fee: 0,
})

// Computed
const filteredFees = computed(() => {
  let result = deliveryFees.value

  if (filters.wilayaId) {
    result = result.filter(f => f.wilaya_id === parseInt(filters.wilayaId))
  }

  if (filters.deliveryType) {
    result = result.filter(f => f.delivery_type === filters.deliveryType)
  }

  return result
})

// Functions
const loadData = async () => {
  const [feesData] = await Promise.all([
    getAllDeliveryFees(),
    fetchWilayas()
  ])

  if (feesData) deliveryFees.value = feesData
}

const onWilayaChange = async () => {
  form.communeId = ''
  if (form.wilayaId) {
    await fetchCommunesByWilaya(form.wilayaId)
  }
}

const openAddModal = () => {
  editingFee.value = null
  form.wilayaId = ''
  form.communeId = ''
  form.deliveryType = ''
  form.fee = 0
  formError.value = ''
  showModal.value = true
}

const openEditModal = (fee) => {
  editingFee.value = fee
  form.wilayaId = fee.wilaya_id
  form.communeId = fee.commune_id || ''
  form.deliveryType = fee.delivery_type
  form.fee = fee.fee
  formError.value = ''
  
  // Load communes for the wilaya
  if (fee.wilaya_id) {
    onWilayaChange()
  }
  
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingFee.value = null
  formError.value = ''
}

const handleSubmit = async () => {
  formError.value = ''

  const feeData = {
    wilaya_id: parseInt(form.wilayaId),
    commune_id: form.communeId ? parseInt(form.communeId) : null,
    delivery_type: form.deliveryType,
    fee: parseFloat(form.fee),
  }

  let result
  if (editingFee.value) {
    result = await updateDeliveryFee(editingFee.value.id, feeData)
  } else {
    result = await createDeliveryFee(feeData)
  }

  if (result) {
    closeModal()
    await loadData()
  } else {
    formError.value = 'Une erreur est survenue. Vérifiez que cette combinaison n\'existe pas déjà.'
  }
}

const handleDelete = async (id) => {
  showConfirmation({
    title: 'Supprimer le tarif',
    message: 'Êtes-vous sûr de vouloir supprimer ce tarif de livraison ?',
    confirmText: 'Supprimer',
    cancelText: 'Annuler',
    onConfirm: async () => {
      const result = await deleteDeliveryFee(id)
      if (result) {
        await loadData()
      }
    },
  })
}

const resetFilters = () => {
  filters.wilayaId = ''
  filters.deliveryType = ''
}

// Load data on mount
onMounted(() => {
  loadData()
})
</script>
