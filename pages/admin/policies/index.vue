<template>
  <div class="pt-3 px-4 sm:p-6">
    <!-- Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl md:text-2xl font-medium text-gray-900">
          Politiques
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          Gérez les politiques de votre site (livraison, retour, confidentialité, conditions)
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:flex-none">
        <button
          @click="openModal()"
          :disabled="isLoading"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ajouter une politique
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="mt-6 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
      <div class="flex-grow max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher une politique..."
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <select
          v-model="filterStatus"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Tous les statuts</option>
          <option value="true">Actifs</option>
          <option value="false">Inactifs</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="mt-8 flex flex-col">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Titre (FR)
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Slug
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Statut
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Langues
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Dernière mise à jour
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-if="isLoading">
                  <td colspan="7" class="px-3 py-8 text-sm text-gray-500 text-center">
                    <div class="flex justify-center">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
                <tr v-else-if="filteredPolicies.length === 0">
                  <td colspan="7" class="px-3 py-8 text-sm text-gray-500 text-center">
                    Aucune politique disponible
                  </td>
                </tr>
                <tr v-else v-for="policy in filteredPolicies" :key="policy.id">
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getPolicyTypeColor(policy.policy_type)">
                      {{ getPolicyTypeLabel(policy.policy_type) }}
                    </span>
                  </td>
                  <td class="px-3 py-4 text-sm text-gray-900 max-w-md">
                    <div class="font-medium truncate">
                      {{ policy.title_translations?.fr || policy.title_translations?.en || 'Sans titre' }}
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-mono text-xs">
                    {{ policy.slug }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      :class="[
                        policy.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800',
                        'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                      ]"
                    >
                      {{ policy.is_active ? "Actif" : "Inactif" }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div class="flex gap-1">
                      <span v-if="policy.title_translations?.fr" class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">FR</span>
                      <span v-if="policy.title_translations?.ar" class="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">AR</span>
                      <span v-if="policy.title_translations?.en" class="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">EN</span>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ formatDate(policy.updated_at) }}
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <NuxtLink
                      :to="`/admin/policies/${policy.id}/edit`"
                      class="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Modifier
                    </NuxtLink>
                    <button
                      @click="openModal(policy)"
                      :disabled="isLoading"
                      class="text-gray-600 hover:text-gray-900 mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Quick Edit
                    </button>
                    <button
                      @click="deletePolicy(policy)"
                      :disabled="isLoading"
                      class="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>

    <!-- Modal -->
    <AdminPoliciesModal
      :show="showModal"
      :isLoading="isLoading"
      :form="form"
      @close="closeModal"
      @save="savePolicy"
    />
  </div>
</template>

<script setup>
const { showConfirmation } = useConfirmationModal();
const { showError } = useErrorModal();
const { showSuccess } = useSuccessSnackbar();
const { fetchAllPolicies } = usePolicies();
const supabase = useSupabaseClient();

// State
const policies = ref([]);
const showModal = ref(false);
const isLoading = ref(false);
const searchQuery = ref('');
const filterStatus = ref('');
const form = ref({
  id: null,
  policy_type: '',
  title_translations: { fr: '', ar: '', en: '' },
  content_translations: { fr: '', ar: '', en: '' },
  slug: '',
  is_active: true,
});

// Policy type options
const policyTypes = [
  { value: 'shipping', label: 'Livraison', color: 'bg-blue-100 text-blue-800' },
  { value: 'return', label: 'Retour', color: 'bg-green-100 text-green-800' },
  { value: 'privacy', label: 'Confidentialité', color: 'bg-purple-100 text-purple-800' },
  { value: 'terms', label: 'Conditions', color: 'bg-yellow-100 text-yellow-800' },
];

// Get policy type label
const getPolicyTypeLabel = (type) => {
  const policy = policyTypes.find(p => p.value === type);
  return policy ? policy.label : type;
};

// Get policy type color
const getPolicyTypeColor = (type) => {
  const policy = policyTypes.find(p => p.value === type);
  return policy ? policy.color : 'bg-gray-100 text-gray-800';
};

// Fetch policies
const fetchPolicies = async () => {
  isLoading.value = true;
  try {
    const data = await fetchAllPolicies();
    policies.value = data;
  } catch (error) {
    console.error("Error fetching policies:", error);
    showError("Impossible de charger les politiques");
  } finally {
    isLoading.value = false;
  }
};

// Filtered policies
const filteredPolicies = computed(() => {
  let filtered = policies.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(policy => {
      const titleFr = policy.title_translations?.fr?.toLowerCase() || '';
      const titleEn = policy.title_translations?.en?.toLowerCase() || '';
      const titleAr = policy.title_translations?.ar?.toLowerCase() || '';
      const type = policy.policy_type?.toLowerCase() || '';
      const slug = policy.slug?.toLowerCase() || '';
      
      return titleFr.includes(query) || 
             titleEn.includes(query) || 
             titleAr.includes(query) ||
             type.includes(query) ||
             slug.includes(query);
    });
  }

  // Filter by status
  if (filterStatus.value !== '') {
    const isActive = filterStatus.value === 'true';
    filtered = filtered.filter(policy => policy.is_active === isActive);
  }

  return filtered;
});

// Format date
const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Open modal
const openModal = (policy = null) => {
  if (policy) {
    form.value = {
      id: policy.id,
      policy_type: policy.policy_type,
      title_translations: { ...policy.title_translations },
      content_translations: { ...policy.content_translations },
      slug: policy.slug,
      is_active: policy.is_active,
    };
  } else {
    form.value = {
      id: null,
      policy_type: '',
      title_translations: { fr: '', ar: '', en: '' },
      content_translations: { fr: '', ar: '', en: '' },
      slug: '',
      is_active: true,
    };
  }
  showModal.value = true;
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  form.value = {
    id: null,
    policy_type: '',
    title_translations: { fr: '', ar: '', en: '' },
    content_translations: { fr: '', ar: '', en: '' },
    slug: '',
    is_active: true,
  };
};

// Save policy
const savePolicy = async (formData) => {
  isLoading.value = true;
  try {
    const policyData = {
      policy_type: formData.policy_type,
      title_translations: formData.title_translations,
      content_translations: formData.content_translations,
      slug: formData.slug,
      is_active: formData.is_active,
      updated_at: new Date().toISOString(),
    };

    if (formData.id) {
      // Update existing policy
      const { error } = await supabase
        .from('policies')
        .update(policyData)
        .eq('id', formData.id);

      if (error) throw error;
      showSuccess('Politique mise à jour avec succès');
    } else {
      // Create new policy
      const { error } = await supabase
        .from('policies')
        .insert(policyData);

      if (error) throw error;
      showSuccess('Politique créée avec succès');
    }

    closeModal();
    await fetchPolicies();
  } catch (error) {
    console.error('Error saving policy:', error);
    showError(error.message || 'Erreur lors de l\'enregistrement de la politique');
  } finally {
    isLoading.value = false;
  }
};

// Delete policy
const deletePolicy = async (policy) => {
  const confirmed = await showConfirmation(
    'Supprimer la politique',
    `Êtes-vous sûr de vouloir supprimer la politique "${policy.title_translations?.fr || policy.policy_type}" ? Cette action est irréversible.`
  );

  if (!confirmed) return;

  isLoading.value = true;
  try {
    const { error } = await supabase
      .from('policies')
      .delete()
      .eq('id', policy.id);

    if (error) throw error;

    showSuccess('Politique supprimée avec succès');
    await fetchPolicies();
  } catch (error) {
    console.error('Error deleting policy:', error);
    showError('Erreur lors de la suppression de la politique');
  } finally {
    isLoading.value = false;
  }
};

// Initialize
onMounted(fetchPolicies);

// Page meta
definePageMeta({
  layout: 'default',
  middleware: ['auth'],
});

useHead({
  title: 'Gestion des Politiques',
});
</script>
