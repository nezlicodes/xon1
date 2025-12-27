<template>
  <!-- Tableau -->
  <div class="mt-8 flex flex-col">
    <!-- Active state with data -->
    <div
      v-if="props.isEnabled && collections.length > 0"
      class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8"
    >
      <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div
          class="overflow-hidden shadow ring-1 ring-secondary ring-opacity-5 md:rounded-lg"
        >
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Image
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Nom
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Slug
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Produits
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Statut
                </th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="collection in collections" :key="collection.id">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <NuxtImg
                    :src="
                      collection.image_url ||
                      '/images/placeholders/placeholder-collection.svg'
                    "
                    class="h-10 w-10 rounded-full object-cover"
                    :alt="collection.name"
                  />
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                  {{ collection.name }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ collection.slug }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {{ collection.product_count || 0 }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm">
                  <span
                    :class="[
                      collection.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800',
                      'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                    ]"
                  >
                    {{ collection.is_active ? "Actif" : "Inactif" }}
                  </span>
                </td>
                <td
                  class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                >
                  <NuxtLink
                    :to="`/collections/${collection.slug}`"
                    :disabled="isLoading"
                    target="_blank"
                    class="text-gray-600 hover:text-gray-900 mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Voir
                  </NuxtLink>
                  <button
                    @click="openModal(collection)"
                    :disabled="isLoading"
                    class="text-blue-600 hover:text-blue-900 mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Modifier
                  </button>
                  <button
                    @click="deleteCollection(collection)"
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

    <!-- Empty state (when no collections) -->
    <div
      v-else-if="props.isEnabled && collections.length === 0"
      class="mt-10 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow"
    >
      <div class="text-center">
        <div class="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 class="mt-4 text-lg font-medium text-gray-900">
          Aucune collection
        </h3>
        <p class="mt-2 text-sm text-gray-500">
          Vous n'avez pas encore créé de collections. Les collections vous
          permettent d'organiser vos produits.
        </p>
        <div class="mt-6">
          <button
            @click="$emit('openModal', {})"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              class="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            Créer une collection
          </button>
        </div>
      </div>
    </div>

    <!-- Disabled state -->
    <div
      v-else
      class="mt-10 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-sm border border-gray-200"
    >
      <div class="text-center">
        <div class="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h3 class="mt-4 text-lg font-medium text-gray-700">
          Section désactivée
        </h3>
        <p class="mt-2 text-sm text-gray-500">
          Cette section est actuellement désactivée. Contactez l'administrateur
          pour l'activer.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  collections: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits([
  "openModal",
  "deleteCollection",
  "requestActivation",
]);

const openModal = (collection) => {
  emit("openModal", collection);
};

const deleteCollection = (collection) => {
  emit("deleteCollection", collection);
};
</script>
