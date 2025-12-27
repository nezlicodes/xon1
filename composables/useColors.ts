/**
 * Color Management Composable
 * 
 * Provides reusable functions for managing colors throughout the application
 */

export const useColors = () => {
  const supabase = useSupabaseClient();
  const colors = ref([]);
  const loading = ref(false);
  const error = ref(null);

  /**
   * Fetch all colors from database
   * @param {Object} options - Query options
   * @param {boolean} options.activeOnly - Fetch only active colors
   * @param {string} options.orderBy - Column to order by
   * @param {boolean} options.ascending - Sort order
   */
  const fetchColors = async (options = {}) => {
    const { activeOnly = false, orderBy = 'created_at', ascending = false } = options;

    loading.value = true;
    error.value = null;

    try {
      let query = supabase
        .from('colors')
        .select('*');

      if (activeOnly) {
        query = query.eq('is_active', true);
      }

      query = query.order(orderBy, { ascending });

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      colors.value = data || [];
      return data;
    } catch (err) {
      console.error('Error fetching colors:', err);
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch a single color by ID
   * @param {string} id - Color ID
   */
  const fetchColorById = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from('colors')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      return data;
    } catch (err) {
      console.error('Error fetching color:', err);
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create a new color
   * @param {Object} colorData - Color data
   * @param {string} colorData.name - Color name
   * @param {string} colorData.hex_code - Hex color code
   * @param {boolean} colorData.is_active - Active status
   */
  const createColor = async (colorData) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: createError } = await supabase
        .from('colors')
        .insert({
          name: colorData.name,
          hex_code: colorData.hex_code.toUpperCase(),
          is_active: colorData.is_active !== undefined ? colorData.is_active : true
        })
        .select()
        .single();

      if (createError) throw createError;

      // Add to local array if exists
      if (colors.value) {
        colors.value.unshift(data);
      }

      return data;
    } catch (err) {
      console.error('Error creating color:', err);
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update an existing color
   * @param {string} id - Color ID
   * @param {Object} updates - Fields to update
   */
  const updateColor = async (id, updates) => {
    loading.value = true;
    error.value = null;

    try {
      const updateData = { ...updates };
      if (updateData.hex_code) {
        updateData.hex_code = updateData.hex_code.toUpperCase();
      }
      updateData.updated_at = new Date().toISOString();

      const { data, error: updateError } = await supabase
        .from('colors')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update in local array if exists
      if (colors.value) {
        const index = colors.value.findIndex(c => c.id === id);
        if (index !== -1) {
          colors.value[index] = data;
        }
      }

      return data;
    } catch (err) {
      console.error('Error updating color:', err);
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete a color
   * @param {string} id - Color ID
   */
  const deleteColor = async (id) => {
    loading.value = true;
    error.value = null;

    try {
      const { error: deleteError } = await supabase
        .from('colors')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Remove from local array if exists
      if (colors.value) {
        colors.value = colors.value.filter(c => c.id !== id);
      }

      return true;
    } catch (err) {
      console.error('Error deleting color:', err);
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Toggle color active status
   * @param {string} id - Color ID
   * @param {boolean} currentStatus - Current active status
   */
  const toggleColorStatus = async (id, currentStatus) => {
    return await updateColor(id, { is_active: !currentStatus });
  };

  /**
   * Validate hex code format
   * @param {string} hexCode - Hex code to validate
   */
  const isValidHexCode = (hexCode) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexCode);
  };

  /**
   * Convert hex to RGB
   * @param {string} hex - Hex color code
   */
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  /**
   * Lighten a color
   * @param {string} hex - Hex color code
   * @param {number} percent - Percentage to lighten (0-100)
   */
  const lightenColor = (hex, percent) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1).toUpperCase();
  };

  /**
   * Darken a color
   * @param {string} hex - Hex color code
   * @param {number} percent - Percentage to darken (0-100)
   */
  const darkenColor = (hex, percent) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R > 0 ? R : 0) * 0x10000 +
      (G > 0 ? G : 0) * 0x100 +
      (B > 0 ? B : 0))
      .toString(16).slice(1).toUpperCase();
  };

  /**
   * Generate color variants (lighter and darker)
   * @param {string} hex - Base hex color code
   */
  const generateColorVariants = (hex) => {
    return {
      original: hex,
      lighter20: lightenColor(hex, 20),
      lighter40: lightenColor(hex, 40),
      darker20: darkenColor(hex, 20),
      darker40: darkenColor(hex, 40)
    };
  };

  /**
   * Get contrasting text color (black or white) for a background color
   * @param {string} hex - Background hex color code
   */
  const getContrastColor = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return '#000000';
    
    // Calculate relative luminance
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    
    // Return black for light backgrounds, white for dark
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  /**
   * Search colors by name or hex code
   * @param {string} query - Search query
   */
  const searchColors = (query) => {
    if (!query || !colors.value) return colors.value;
    
    const lowerQuery = query.toLowerCase();
    return colors.value.filter(color =>
      color.name.toLowerCase().includes(lowerQuery) ||
      color.hex_code.toLowerCase().includes(lowerQuery)
    );
  };

  /**
   * Filter colors by active status
   * @param {boolean|null} isActive - Filter by active status (null for all)
   */
  const filterByStatus = (isActive) => {
    if (isActive === null || !colors.value) return colors.value;
    return colors.value.filter(color => color.is_active === isActive);
  };

  return {
    // State
    colors,
    loading,
    error,

    // Methods
    fetchColors,
    fetchColorById,
    createColor,
    updateColor,
    deleteColor,
    toggleColorStatus,

    // Utilities
    isValidHexCode,
    hexToRgb,
    lightenColor,
    darkenColor,
    generateColorVariants,
    getContrastColor,
    searchColors,
    filterByStatus
  };
};
