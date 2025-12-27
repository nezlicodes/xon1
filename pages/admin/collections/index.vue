<template>
  <div class="pt-3 px-4 sm:p-6">
    <!-- En-tête -->
    <AdminCollectionsHeader
      :isLoading="isLoading"
      :showConfigModal="showConfigModal"
      :configData="configData"
      :isEnabled="configData?.is_enabled"
      @openConfigModal="openConfigModal()"
      @saveConfig="saveConfig"
      @closeConfigModal="closeConfigModal"
      @openModal="openModal()"
    />

    <!-- List -->
    <AdminCollectionsList
      :collections="collections"
      :isLoading="isLoading"
      :isEnabled="configData?.is_enabled"
      @openModal="openModal"
      @deleteCollection="deleteCollection"
    />
    <!-- Modal -->

    <AdminCollectionsModal
      :showModal="showModal"
      :isLoading="isLoading"
      :imageLoading="imageLoading"
      :form="form"
      @close="showModal = false"
      @save="saveCollection"
      @handleImageUpload="handleImageUpload"
      @checkSlug="checkSlugUniqueness"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
const { showConfirmation } = useConfirmationModal();
const { showError } = useErrorModal();
const { showSuccess } = useSuccessSnackbar();

const user = useSupabaseUser();
const supabase = useSupabaseClient();

// State
const collections = ref([]);
const showModal = ref(false);
const configData = ref(null);
const showConfigModal = ref(false);
const isLoading = ref(false);
const imageLoading = ref(false);
const form = ref({
  name: "",
  slug: "",
  description: "",
  image_url: "",
  is_active: true,
});

const fetchConfig = async () => {
  try {
    if (user?.value) {
      const { data, error } = await supabase
        .from("collections_config")
        .select("*")
        .eq("user_id", user.value.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 est l'erreur "no rows returned"
        throw error;
      }

      if (data) {
        configData.value = data;
      } else {
        // Création d'une configuration par défaut si elle n'existe pas
        const { data: newConfig, error: insertError } = await supabase
          .from("collections_config")
          .insert({
            user_id: user.value.id,
            title: "Collections",
            is_enabled: true,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        configData.value = newConfig;
      }
    }
  } catch (error) {
    console.error(
      "Erreur lors du chargement de la configuration des collections:",
      error
    );
    showError("Impossible de charger la configuration des collections");
  }
};

// Open the configuration modal
const openConfigModal = () => {
  if (configData.value) {
    showConfigModal.value = true;
  }
};

const closeConfigModal = () => {
  showConfigModal.value = false;
};

// Save the configuration
const saveConfig = async (formData) => {
  isLoading.value = true;
  try {
    const { error } = await supabase
      .from("collections_config")
      .update({
        title: formData.title,
        is_enabled: formData.is_enabled,
        updated_at: new Date(),
      })
      .eq("user_id", user.value.id);

    if (error) throw error;

    // Refresh the configuration data
    await fetchConfig();
    showConfigModal.value = false;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la configuration:", error);
    showError("Impossible de sauvegarder la configuration");
  } finally {
    isLoading.value = false;
  }
};

// Fetch collections
const fetchCollections = async () => {
  isLoading.value = true;

  try {
    let collectionsValue;
    if (user?.value) {
      const { data, error } = await supabase
        .from("collections")
        .select("*, products:products(count)")
        .eq("user_id", user.value.id)
        .order("name");

      if (error) throw error;

      collectionsValue = data;
    }
    // Transform the data to get product count
    collections.value = collectionsValue.map((collection) => ({
      ...collection,
      product_count: collection.products?.[0]?.count || 0,
    }));
  } catch (error) {
    console.error("Error fetching collections:", error);
    showError("Failed to load collections");
  } finally {
    isLoading.value = false;
  }
};

// Handle image upload
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  imageLoading.value = true;
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `collections/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("site")
      .upload(filePath, file, {
        upsert: true,
        cacheControl: "3600",
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("site").getPublicUrl(filePath);

    form.value.image_url = publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    showError("Failed to upload image");
  } finally {
    imageLoading.value = false;
  }
};

// Check if slug is unique
const checkSlugUniqueness = async ({ slug, callback }) => {
  try {
    // Don't check uniqueness against the same collection
    const query = supabase
      .from("collections")
      .select("id")
      .eq("slug", slug)
      .eq("user_id", user.value.id);

    if (form.value.id) {
      query.neq("id", form.value.id);
    }

    const { data, error } = await query.maybeSingle();

    if (error) throw error;

    // Call the callback with whether the slug is unique (true) or not (false)
    callback(!data);
  } catch (error) {
    console.error("Error checking slug uniqueness:", error);
    showError("Failed to check slug availability");
    callback(null); // Pass null to indicate an error occurred
  }
};

// Open modal for create/edit
const openModal = (collection = null) => {
  if (collection) {
    form.value = { ...collection };
  } else {
    form.value = {
      name: "",
      slug: "",
      description: "",
      description_meta: "",
      image_url: "",
      is_active: true,
    };
  }
  showModal.value = true;
};

// watch for config.is_enabled changes if it's enabled fetch collections else return
watch(
  () => configData.value?.is_enabled,
  (newValue) => {
    if (newValue) {
      fetchCollections();
    } else {
      collections.value = [];
    }
  }
);

const convertHtmlToText = (html) => {
  let text = html.replace(/<[^>]*>/g, ""); // Remove HTML tags
  return text;
};

// Save collection
const saveCollection = async () => {
  isLoading.value = true;
  try {
    const { error } = form.value.id
      ? await supabase
          .from("collections")
          .update({
            name: form.value.name,
            slug: form.value.slug,
            user_id: user.value.id,
            description: form.value.description,
            image_url: form.value.image_url,
            is_active: form.value.is_active,
            description_meta: convertHtmlToText(form.value.description),
          })
          .eq("id", form.value.id)
      : await supabase.from("collections").insert({
          user_id: user.value.id,
          name: form.value.name,
          slug: form.value.slug,
          description: form.value.description,
          description_meta: convertHtmlToText(form.value.description),
          image_url: form.value.image_url,
          is_active: form.value.is_active,
        });

    if (error) throw error;

    showModal.value = false;
    fetchCollections();
    showSuccess(
      form.value.id
        ? "Collection mise à jour avec succès"
        : "Collection créée avec succès"
    );
  } catch (error) {
    console.error("Error saving collection:", error);
    if (error.code === "23505") {
      showError(
        "Cette collection existe déjà. Veuillez utiliser un slug différent."
      );
    } else {
      showError("Failed to save collection");
    }
  } finally {
    isLoading.value = false;
  }
};

// Delete collection
const deleteCollection = async (collection) => {
  showConfirmation({
    title: "Supprimer la collection",
    message: "Êtes-vous sûr de vouloir supprimer cette collection?",
    confirmText: "Supprimer",
    cancelText: "Annuler",
    onConfirm: async () => {
      isLoading.value = true;
      try {
        const { error } = await supabase
          .from("collections")
          .delete()
          .eq("id", collection.id);

        if (error) throw error;

        fetchCollections();
        showSuccess("Collection supprimée avec succès");
      } catch (error) {
        if (error.code === "23503") {
          showError(
            "Impossible de supprimer cette collection car elle est utilisée par un ou plusieurs produits"
          );
        } else {
          console.error("Error deleting collection:", error);
          showError("Failed to delete collection");
        }
      } finally {
        isLoading.value = false;
      }
    },
  });
};

// Initial fetch
onMounted(async () => {
  await fetchConfig();

  if (configData.value?.is_enabled) {
    await fetchCollections();
  } else {
    return;
  }
});

useHead({
  title: "Liste des collections",
  meta: [
    {
      name: "description",
      content: "Gérez vos collections de produits",
    },
  ],
});
</script>