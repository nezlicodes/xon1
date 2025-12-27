<template>
  <div class="pt-3 px-4 sm:p-6">
    <!-- En-tête -->
    <AdminCategoriesHeader
      :isLoading="isLoading"
      :showConfigModal="showConfigModal"
      :configData="configData"
      @openConfigModal="openConfigModal"
      @closeConfigModal="closeConfigModal"
      @saveConfig="saveConfig"
      @openModal="openModal"
    />

    <!-- Tableau -->
    <AdminCategoriesList
      :categories="categories"
      :isLoading="isLoading"
      :isEnabled="configData?.categories_enabled"
      @openModal="openModal"
      @deleteCategory="deleteCategory"
    />
    
    <!-- Modal -->
    <AdminCategoriesModal
      :showModal="showModal"
      :isLoading="isLoading"
      :imageLoading="imageLoading"
      :videoLoading="videoLoading"
      :form="form"
      @close="closeModal"
      @save="saveCategory"
      @handleImageUpload="handleImageUpload"
      @handleVideoUpload="handleVideoUpload"
      @checkSlug="checkSlugUniqueness"
    />
  </div>
</template>

<script setup>
const { showConfirmation } = useConfirmationModal();
const { showError } = useErrorModal();
const { showSuccess } = useSuccessSnackbar();

const supabase = useSupabaseClient();

// State
const categories = ref([]);
const showModal = ref(false);
const isLoading = ref(false);
const imageLoading = ref(false);
const videoLoading = ref(false);
const showConfigModal = ref(false);
const configData = ref(null);
const form = ref({
  id: null,
  name_translations: { fr: '', ar: '', en: '' },
  slug: '',
  description_translations: { fr: '', ar: '', en: '' },
  image_url: '',
  video_url: '',
  media_type: 'image',
  is_active: true,
  is_featured: false,
});

// Fetch categories
const fetchCategories = async () => {
  isLoading.value = true;

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*, products:products(count)")
      .order("name_translations->>'fr'");

    if (error) throw error;

    // Transform the data to get product count and translations
    categories.value = data.map((category) => ({
      ...category,
      name: category.name_translations?.fr || category.name_translations?.en || category.name_translations?.ar || '',
      description: category.description_translations?.fr || category.description_translations?.en || '',
      product_count: category.products?.[0]?.count || 0,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    showError("Failed to load categories");
  } finally {
    isLoading.value = false;
  }
};

// Configuration management
const saveConfig = async (formData) => {
  isLoading.value = true;
  try {
    const { error } = await supabase
      .from("features_config")
      .update({
        categories_enabled: formData.categories_enabled,
        updated_at: new Date(),
      })
      .eq('id', configData.value.id);

    if (error) throw error;

    await fetchConfig();
    showConfigModal.value = false;
    showSuccess('Configuration mise à jour');
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la configuration:", error);
    showError("Impossible de sauvegarder la configuration");
  } finally {
    isLoading.value = false;
  }
};

const openConfigModal = () => {
  if (configData.value) {
    showConfigModal.value = true;
  }
};

const closeConfigModal = () => {
  showConfigModal.value = false;
};

const fetchConfig = async () => {
  try {
    const { data, error } = await supabase
      .from("features_config")
      .select("*")
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (data) {
      configData.value = data;
    } else {
      const { data: newConfig, error: insertError } = await supabase
        .from("features_config")
        .insert({
          categories_enabled: true,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      configData.value = newConfig;
    }
  } catch (error) {
    console.error(
      "Erreur lors du chargement de la configuration des catégories:",
      error
    );
    showError("Impossible de charger la configuration des catégories");
  }
};

// Helper function to get video duration
const getVideoDuration = (file) => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(Math.round(video.duration));
    };
    
    video.onerror = () => {
      resolve(0);
    };
    
    video.src = URL.createObjectURL(file);
  });
};

// Image upload
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  imageLoading.value = true;
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `categories/${fileName}`;

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

// Video upload
const handleVideoUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Check file size (50MB limit)
  if (file.size > 50 * 1024 * 1024) {
    showError("La taille de la vidéo ne doit pas dépasser 50MB");
    return;
  }

  // Check file type
  if (!file.type.startsWith('video/')) {
    showError("Seuls les fichiers vidéo sont acceptés");
    return;
  }

  videoLoading.value = true;
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `categories/${fileName}`;

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

    form.value.video_url = publicUrl;
  } catch (error) {
    console.error("Error uploading video:", error);
    showError("Échec du téléchargement de la vidéo");
  } finally {
    videoLoading.value = false;
  }
};

// Slug uniqueness check
const checkSlugUniqueness = async ({ slug, callback }) => {
  try {
    const query = supabase
      .from("categories")
      .select("id")
      .eq("slug", slug);

    if (form.value.id) {
      query.neq("id", form.value.id);
    }

    const { data, error } = await query.maybeSingle();

    if (error) throw error;

    callback(!data);
  } catch (error) {
    console.error("Error checking slug uniqueness:", error);
    showError("Failed to check slug availability");
    callback(null);
  }
};

// Modal management
const openModal = (category = null) => {
  if (category) {
    // Editing - ensure translations exist
    form.value = {
      id: category.id,
      name_translations: category.name_translations || { fr: '', ar: '', en: '' },
      slug: category.slug || '',
      description_translations: category.description_translations || { fr: '', ar: '', en: '' },
      image_url: category.image_url || '',
      video_url: category.video_url || '',
      media_type: category.video_url ? 'video' : 'image',
      is_active: category.is_active ?? true,
      is_featured: category.is_featured ?? false,
    };
  } else {
    // Creating new
    form.value = {
      id: null,
      name_translations: { fr: '', ar: '', en: '' },
      slug: '',
      description_translations: { fr: '', ar: '', en: '' },
      image_url: '',
      video_url: '',
      media_type: 'image',
      is_active: true,
      is_featured: false,
    };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

// Save category
const saveCategory = async () => {
  isLoading.value = true;
  try {
    const categoryData = {
      name_translations: form.value.name_translations,
      slug: form.value.slug,
      description_translations: form.value.description_translations,
      image_url: form.value.media_type === 'image' ? form.value.image_url : null,
      video_url: form.value.media_type === 'video' ? form.value.video_url : null,
      is_active: form.value.is_active,
      is_featured: form.value.is_featured
    };

    const { error } = form.value.id
      ? await supabase
          .from("categories")
          .update(categoryData)
          .eq("id", form.value.id)
      : await supabase.from("categories").insert(categoryData);

    if (error) throw error;

    showModal.value = false;
    await fetchCategories();
    showSuccess(
      form.value.id
        ? "Catégorie mise à jour avec succès"
        : "Catégorie créée avec succès"
    );
  } catch (error) {
    console.error("Error saving category:", error);
    if (error.code === "23505") {
      showError(
        "Cette catégorie existe déjà. Veuillez utiliser un slug différent."
      );
    } else {
      showError("Failed to save category");
    }
  } finally {
    isLoading.value = false;
  }
};

// Delete category
const deleteCategory = async (category) => {
  showConfirmation({
    title: "Supprimer la catégorie",
    message: "Êtes-vous sûr de vouloir supprimer cette catégorie?",
    confirmText: "Supprimer",
    cancelText: "Annuler",
    onConfirm: async () => {
      isLoading.value = true;
      try {
        const { error } = await supabase
          .from("categories")
          .delete()
          .eq("id", category.id);

        if (error) throw error;

        await fetchCategories();
        showSuccess("Catégorie supprimée avec succès");
      } catch (error) {
        if (error.code === "23503") {
          showError(
            "Impossible de supprimer cette catégorie car elle est utilisée par un ou plusieurs produits"
          );
        } else {
          console.error("Error deleting category:", error);
          showError("Failed to delete category");
        }
      } finally {
        isLoading.value = false;
      }
    },
  });
};

// Watch for config changes
watch(
  () => configData.value?.categories_enabled,
  (newValue) => {
    if (newValue) {
      fetchCategories();
    } else {
      categories.value = [];
    }
  }
);

// Initial fetch
onMounted(async () => {
  await fetchConfig();
  if (configData.value?.categories_enabled) {
    await fetchCategories();
  }
});

useHead({
  title: "Liste des catégories",
  meta: [
    {
      name: "description",
      content: "Gérez vos catégories de produits",
    },
  ],
});
</script>
