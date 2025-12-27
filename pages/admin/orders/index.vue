<template>
  <div class="p-3 sm:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-2xl md:text-3xl font-medium text-gray-900">Commandes</h1>
          <p class="mt-1 text-sm text-gray-600">Gérez toutes vos commandes clients</p>
        </div>
        
        <!-- Stats Summary -->
        <div class="flex gap-3">
          <div class="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="text-xs text-yellow-600 font-medium">En attente</div>
            <div class="text-lg font-bold text-yellow-700">{{ stats.pending }}</div>
          </div>
          <div class="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <div class="text-xs text-green-600 font-medium">Confirmées</div>
            <div class="text-lg font-bold text-green-700">{{ stats.confirmed }}</div>
          </div>
          <div class="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="text-xs text-blue-600 font-medium">Total</div>
            <div class="text-lg font-bold text-blue-700">{{ stats.total }}</div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Status Filter -->
          <div>
            <label for="statusFilter" class="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              id="statusFilter"
              v-model="filters.status"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>

          <!-- Search by Phone -->
          <div>
            <label for="phoneSearch" class="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              id="phoneSearch"
              v-model="filters.phone"
              type="text"
              placeholder="0555123456"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>

          <!-- Search by Name -->
          <div>
            <label for="nameSearch" class="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              id="nameSearch"
              v-model="filters.name"
              type="text"
              placeholder="Nom du client"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
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

      <!-- Orders Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- Loading State -->
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p class="mt-2 text-sm text-gray-600">Chargement des commandes...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!filteredOrders.length" class="p-8 text-center">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune commande</h3>
          <p class="mt-1 text-sm text-gray-500">
            Aucune commande ne correspond à vos critères
          </p>
        </div>

        <!-- Orders List -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Livraison
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="order in paginatedOrders"
                :key="order.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <!-- ID -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-mono text-gray-900">
                    {{ order.id.split('-')[0] }}
                  </div>
                </td>

                <!-- Client -->
                <td class="px-6 py-4">
                  <div class="text-sm">
                    <div class="font-medium text-gray-900">
                      {{ order.first_name }} {{ order.last_name }}
                    </div>
                    <div class="text-gray-500">{{ order.phone_number }}</div>
                  </div>
                </td>

                <!-- Product -->
                <td class="px-6 py-4">
                  <div class="text-sm">
                    <div class="font-medium text-gray-900">{{ order.product_name }}</div>
                    <div class="text-gray-500">Qté: {{ order.quantity }}</div>
                  </div>
                </td>

                <!-- Delivery Location -->
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">
                    {{ order.wilaya_name }}
                  </div>
                  <div class="text-xs text-gray-500">{{ order.commune_name }}</div>
                </td>

                <!-- Total -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ order.total_price ? order.total_price.toFixed(2) : (order.unit_price * order.quantity).toFixed(2) }} DZD
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <select
                    :value="order.status"
                    @change="updateOrderStatus(order.id, $event.target.value)"
                    class="text-xs font-medium rounded-full px-3 py-1 border-0"
                    :class="getStatusClass(order.status)"
                  >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmée</option>
                    <option value="shipped">Expédiée</option>
                    <option value="delivered">Livrée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                </td>

                <!-- Date -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.created_at) }}
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="viewOrderDetails(order)"
                    class="text-primary hover:text-primary/80 mr-3"
                  >
                    Voir
                  </button>
                  <button
                    @click="deleteOrder(order.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredOrders.length > ordersPerPage" class="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Affichage <span class="font-medium">{{ (currentPage - 1) * ordersPerPage + 1 }}</span> à
                <span class="font-medium">{{ Math.min(currentPage * ordersPerPage, filteredOrders.length) }}</span> sur
                <span class="font-medium">{{ filteredOrders.length }}</span> commandes
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon name="ph:caret-left-bold" class="h-5 w-5" />
                </button>
                <button
                  v-for="page in displayedPages"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === currentPage
                      ? 'z-10 bg-primary border-primary text-white'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon name="ph:caret-right-bold" class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <Teleport to="body">
      <div
        v-if="selectedOrder"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        @click.self="selectedOrder = null"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Détails de la commande</h2>
            <button
              @click="selectedOrder = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <Icon name="ph:x-bold" class="h-6 w-6" />
            </button>
          </div>

          <div class="p-6 space-y-6">
            <!-- Order Info -->
            <div>
              <h3 class="text-sm font-medium text-gray-900 mb-3">Informations de commande</h3>
              <dl class="grid grid-cols-2 gap-4">
                <div>
                  <dt class="text-xs text-gray-500">ID de commande</dt>
                  <dd class="text-sm font-mono text-gray-900 mt-1">{{ selectedOrder.id }}</dd>
                </div>
                <div>
                  <dt class="text-xs text-gray-500">Date</dt>
                  <dd class="text-sm text-gray-900 mt-1">{{ formatDate(selectedOrder.created_at) }}</dd>
                </div>
                <div>
                  <dt class="text-xs text-gray-500">Statut</dt>
                  <dd class="mt-1">
                    <span class="text-xs font-medium rounded-full px-3 py-1" :class="getStatusClass(selectedOrder.status)">
                      {{ getStatusLabel(selectedOrder.status) }}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <!-- Customer Info -->
            <div>
              <h3 class="text-sm font-medium text-gray-900 mb-3">Informations client</h3>
              <dl class="space-y-2">
                <div>
                  <dt class="text-xs text-gray-500">Nom complet</dt>
                  <dd class="text-sm text-gray-900 mt-1">{{ selectedOrder.first_name }} {{ selectedOrder.last_name }}</dd>
                </div>
                <div>
                  <dt class="text-xs text-gray-500">Téléphone</dt>
                  <dd class="text-sm text-gray-900 mt-1">{{ selectedOrder.phone_number }}</dd>
                </div>
              </dl>
            </div>

            <!-- Product Info -->
            <div>
              <h3 class="text-sm font-medium text-gray-900 mb-3">Produit</h3>
              <dl class="space-y-2">
                <div>
                  <dt class="text-xs text-gray-500">Nom du produit</dt>
                  <dd class="text-sm text-gray-900 mt-1">{{ selectedOrder.product_name }}</dd>
                </div>
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <dt class="text-xs text-gray-500">Quantité</dt>
                    <dd class="text-sm text-gray-900 mt-1">{{ selectedOrder.quantity }}</dd>
                  </div>
                  <div>
                    <dt class="text-xs text-gray-500">Prix unitaire</dt>
                    <dd class="text-sm text-gray-900 mt-1">{{ selectedOrder.unit_price ? selectedOrder.unit_price.toFixed(2) : 'N/A' }} DZD</dd>
                  </div>
                  <div>
                    <dt class="text-xs text-gray-500">Total</dt>
                    <dd class="text-sm font-medium text-gray-900 mt-1">
                      {{ selectedOrder.total_price ? selectedOrder.total_price.toFixed(2) : (selectedOrder.unit_price * selectedOrder.quantity).toFixed(2) }} DZD
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            <!-- Shipping Info -->
            <div>
              <h3 class="text-sm font-medium text-gray-900 mb-3">Adresse de livraison</h3>
              <dl class="space-y-2">
                <div>
                  <dt class="text-xs text-gray-500">Wilaya</dt>
                  <dd class="text-sm text-gray-900 mt-1">{{ selectedOrder.wilaya_name }} ({{ selectedOrder.wilaya_name_ar }})</dd>
                </div>
                <div>
                  <dt class="text-xs text-gray-500">Commune</dt>
                  <dd class="text-sm text-gray-900 mt-1">{{ selectedOrder.commune_name }} ({{ selectedOrder.commune_name_ar }})</dd>
                </div>
              </dl>
            </div>

            <!-- Message -->
            <div v-if="selectedOrder.message">
              <h3 class="text-sm font-medium text-gray-900 mb-3">Message du client</h3>
              <p class="text-sm text-gray-700 bg-gray-50 rounded-lg p-4">{{ selectedOrder.message }}</p>
            </div>
          </div>

          <div class="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
            <button
              @click="selectedOrder = null"
              class="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Composables
const { getAllOrders, updateOrderStatus: updateStatus, deleteOrder: removeOrder, getPendingOrdersCount } = useOrders()
const { showConfirmation } = useConfirmationModal()

// State
const orders = ref([])
const loading = ref(true)
const selectedOrder = ref(null)
const currentPage = ref(1)
const ordersPerPage = 10

// Filters
const filters = reactive({
  status: '',
  phone: '',
  name: '',
})

// Stats
const stats = computed(() => {
  return {
    total: orders.value.length,
    pending: orders.value.filter(o => o.status === 'pending').length,
    confirmed: orders.value.filter(o => o.status === 'confirmed').length,
    shipped: orders.value.filter(o => o.status === 'shipped').length,
    delivered: orders.value.filter(o => o.status === 'delivered').length,
  }
})

// Filtered orders
const filteredOrders = computed(() => {
  let result = orders.value

  if (filters.status) {
    result = result.filter(o => o.status === filters.status)
  }

  if (filters.phone) {
    result = result.filter(o => o.phone_number.includes(filters.phone))
  }

  if (filters.name) {
    const searchTerm = filters.name.toLowerCase()
    result = result.filter(o =>
      o.first_name.toLowerCase().includes(searchTerm) ||
      o.last_name.toLowerCase().includes(searchTerm)
    )
  }

  return result
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredOrders.value.length / ordersPerPage))

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * ordersPerPage
  const end = start + ordersPerPage
  return filteredOrders.value.slice(start, end)
})

const displayedPages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }

  return pages.filter(p => p !== '...' || pages.indexOf(p) === pages.lastIndexOf(p))
})

// Functions
const loadOrders = async () => {
  loading.value = true
  const result = await getAllOrders()
  if (result) {
    orders.value = result
  }
  loading.value = false
}

const updateOrderStatus = async (orderId, newStatus) => {
  const result = await updateStatus(orderId, newStatus)
  if (result) {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = newStatus
    }
  }
}

const deleteOrder = async (orderId) => {
  showConfirmation({
    title: 'Supprimer la commande',
    message: 'Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.',
    confirmText: 'Supprimer',
    cancelText: 'Annuler',
    onConfirm: async () => {
      const result = await removeOrder(orderId)
      if (result) {
        orders.value = orders.value.filter(o => o.id !== orderId)
      }
    },
  })
}

const viewOrderDetails = (order) => {
  selectedOrder.value = order
}

const resetFilters = () => {
  filters.status = ''
  filters.phone = ''
  filters.name = ''
  currentPage.value = 1
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-800 border border-blue-200',
    shipped: 'bg-purple-100 text-purple-800 border border-purple-200',
    delivered: 'bg-green-100 text-green-800 border border-green-200',
    cancelled: 'bg-red-100 text-red-800 border border-red-200',
  }
  return classes[status] || classes.pending
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
  }
  return labels[status] || status
}

// Load orders on mount
onMounted(() => {
  loadOrders()
})
</script>