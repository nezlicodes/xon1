<template>
  <div class="p-3 sm:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-2xl md:text-3xl font-medium text-gray-900">Messages de Contact</h1>
          <p class="mt-1 text-sm text-gray-600">Gérez tous les messages de vos clients</p>
        </div>
        
        <!-- Stats Summary -->
        <div class="flex gap-3">
          <div class="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="text-xs text-blue-600 font-medium">Nouveaux</div>
            <div class="text-lg font-bold text-blue-700">{{ stats.new }}</div>
          </div>
          <div class="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="text-xs text-yellow-600 font-medium">Lus</div>
            <div class="text-lg font-bold text-yellow-700">{{ stats.read }}</div>
          </div>
          <div class="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <div class="text-xs text-green-600 font-medium">Total</div>
            <div class="text-lg font-bold text-green-700">{{ messages.length }}</div>
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
              <option value="new">Nouveau</option>
              <option value="read">Lu</option>
              <option value="replied">Répondu</option>
              <option value="archived">Archivé</option>
            </select>
          </div>

          <!-- Subject Filter -->
          <div>
            <label for="subjectFilter" class="block text-sm font-medium text-gray-700 mb-1">
              Sujet
            </label>
            <select
              id="subjectFilter"
              v-model="filters.subject"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="">Tous les sujets</option>
              <option value="general">Question générale</option>
              <option value="order">Question commande</option>
              <option value="support">Support technique</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <!-- Search -->
          <div>
            <label for="searchFilter" class="block text-sm font-medium text-gray-700 mb-1">
              Rechercher
            </label>
            <input
              id="searchFilter"
              v-model="filters.search"
              type="text"
              placeholder="Nom, email, message..."
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

      <!-- Messages Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- Loading State -->
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p class="mt-2 text-sm text-gray-600">Chargement des messages...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!filteredMessages.length" class="p-8 text-center">
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun message</h3>
          <p class="mt-1 text-sm text-gray-500">
            Aucun message ne correspond à vos critères
          </p>
        </div>

        <!-- Messages List -->
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
                  Sujet
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
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
                v-for="message in filteredMessages"
                :key="message.id"
                class="hover:bg-gray-50 transition-colors"
                :class="{ 'bg-blue-50': message.status === 'new' }"
              >
                <!-- ID -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-mono text-gray-900">
                    {{ message.id.split('-')[0] }}
                  </div>
                </td>

                <!-- Client -->
                <td class="px-6 py-4">
                  <div class="text-sm">
                    <div class="font-medium text-gray-900">{{ message.name }}</div>
                    <div class="text-gray-500">{{ message.email }}</div>
                    <div v-if="message.phone" class="text-gray-500 text-xs">{{ message.phone }}</div>
                  </div>
                </td>

                <!-- Subject -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900">
                    {{ getSubjectLabel(message.subject) }}
                  </span>
                </td>

                <!-- Message Preview -->
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 line-clamp-2 max-w-md">
                    {{ message.message }}
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <select
                    :value="message.status"
                    @change="updateStatus(message.id, $event.target.value)"
                    class="text-xs font-medium rounded-full px-3 py-1 border-0"
                    :class="getStatusClass(message.status)"
                  >
                    <option value="new">Nouveau</option>
                    <option value="read">Lu</option>
                    <option value="replied">Répondu</option>
                    <option value="archived">Archivé</option>
                  </select>
                </td>

                <!-- Date -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(message.created_at) }}
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="openMessage(message)"
                    class="text-primary hover:text-primary/80 mr-3"
                  >
                    Voir
                  </button>
                  <a
                    :href="`mailto:${message.email}`"
                    class="text-green-600 hover:text-green-900"
                  >
                    Répondre
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Message Detail Modal -->
    <div
      v-if="selectedMessage"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      @click.self="closeMessage"
    >
      <div
        class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200"
      >
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div class="flex items-start justify-between">
            <div>
              <h2 class="text-xl font-medium text-gray-900 mb-2">
                Détails du message
              </h2>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-sm text-gray-600">{{ selectedMessage.name }}</span>
                <span class="text-sm text-gray-400">•</span>
                <span class="text-sm text-gray-600">{{ selectedMessage.email }}</span>
                <span v-if="selectedMessage.phone" class="text-sm text-gray-400">•</span>
                <span v-if="selectedMessage.phone" class="text-sm text-gray-600">{{ selectedMessage.phone }}</span>
              </div>
            </div>
            <button
              @click="closeMessage"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6 space-y-6">
          <!-- Info Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
              <p class="text-sm text-gray-900">{{ getSubjectLabel(selectedMessage.subject) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                v-model="selectedMessage.status"
                @change="updateMessageStatus"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="new">Nouveau</option>
                <option value="read">Lu</option>
                <option value="replied">Répondu</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Reçu le</label>
              <p class="text-sm text-gray-900">{{ formatDateLong(selectedMessage.created_at) }}</p>
            </div>
            <div v-if="selectedMessage.replied_at">
              <label class="block text-sm font-medium text-gray-700 mb-1">Répondu le</label>
              <p class="text-sm text-gray-900">{{ formatDateLong(selectedMessage.replied_at) }}</p>
            </div>
          </div>

          <!-- Message -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ selectedMessage.message }}</p>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Notes internes</label>
            <textarea
              v-model="selectedMessage.notes"
              @blur="updateMessageNotes"
              rows="4"
              placeholder="Ajouter des notes internes sur ce message..."
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm resize-none"
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <a
              :href="`mailto:${selectedMessage.email}?subject=Re: ${getSubjectLabel(selectedMessage.subject)}`"
              class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Répondre par email
            </a>
            <a
              v-if="selectedMessage.phone"
              :href="`tel:${selectedMessage.phone}`"
              class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Appeler
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useSupabaseClient } from "#imports";


const supabase = useSupabaseClient();

// State
const messages = ref([]);
const selectedMessage = ref(null);
const loading = ref(true);

// Filters
const filters = reactive({
  status: "",
  subject: "",
  search: "",
});

// Computed
const filteredMessages = computed(() => {
  let filtered = messages.value;

  if (filters.status) {
    filtered = filtered.filter((m) => m.status === filters.status);
  }

  if (filters.subject) {
    filtered = filtered.filter((m) => m.subject === filters.subject);
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(search) ||
        m.email.toLowerCase().includes(search) ||
        m.message.toLowerCase().includes(search)
    );
  }

  return filtered;
});

const stats = computed(() => {
  return {
    new: messages.value.filter((m) => m.status === "new").length,
    read: messages.value.filter((m) => m.status === "read").length,
    replied: messages.value.filter((m) => m.status === "replied").length,
    archived: messages.value.filter((m) => m.status === "archived").length,
  };
});

// Methods
const fetchMessages = async () => {
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    messages.value = data || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
  } finally {
    loading.value = false;
  }
};


const openMessage = async (message) => {
  selectedMessage.value = { ...message };

  // Mark as read if it's new
  if (message.status === "new") {
    await updateStatus(message.id, "read");
  }
};

const closeMessage = () => {
  selectedMessage.value = null;
};

const updateMessageStatus = async () => {
  if (!selectedMessage.value) return;

  const updates = {
    status: selectedMessage.value.status,
  };

  if (selectedMessage.value.status === "replied" && !selectedMessage.value.replied_at) {
    updates.replied_at = new Date().toISOString();
  }

  await updateMessage(selectedMessage.value.id, updates);
};

const updateMessageNotes = async () => {
  if (!selectedMessage.value) return;
  await updateMessage(selectedMessage.value.id, {
    notes: selectedMessage.value.notes,
  });
};

const updateStatus = async (id, status) => {
  const updates = { status };
  if (status === "replied") {
    updates.replied_at = new Date().toISOString();
  }
  await updateMessage(id, updates);
};

const updateMessage = async (id, updates) => {
  try {
    const { error } = await supabase
      .from("contact_messages")
      .update(updates)
      .eq("id", id);

    if (error) throw error;

    // Update local state
    const index = messages.value.findIndex((m) => m.id === id);
    if (index !== -1) {
      messages.value[index] = { ...messages.value[index], ...updates };
    }
  } catch (error) {
    console.error("Error updating message:", error);
  }
};

const getStatusClass = (status) => {
  const classes = {
    new: "bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100",
    read: "bg-yellow-50 text-yellow-700 cursor-pointer hover:bg-yellow-100",
    replied: "bg-green-50 text-green-700 cursor-pointer hover:bg-green-100",
    archived: "bg-gray-50 text-gray-700 cursor-pointer hover:bg-gray-100",
  };
  return classes[status] || classes.new;
};

const resetFilters = () => {
  filters.status = "";
  filters.subject = "";
  filters.search = "";
};

const getSubjectLabel = (subject) => {
  const labels = {
    general: "Question générale",
    order: "Question commande",
    support: "Support technique",
    other: "Autre",
  };
  return labels[subject] || subject;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateLong = (date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Lifecycle
onMounted(() => {
  fetchMessages();
});
</script>
