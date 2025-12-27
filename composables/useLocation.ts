export const useLocation = () => {
  const supabase = useSupabaseClient()
  const wilayas = ref([])
  const communes = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * Fetch all wilayas
   */
  const fetchWilayas = async () => {
    if (wilayas.value.length > 0) return // Already loaded

    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('wilayas')
        .select('*')
        .order('code')

      if (fetchError) throw fetchError

      wilayas.value = data || []
    } catch (err) {
      error.value = err.message || 'Failed to fetch wilayas'
      console.error('Error fetching wilayas:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch communes for a specific wilaya
   */
  const fetchCommunesByWilaya = async (wilayaId) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('communes')
        .select('*')
        .eq('wilaya_id', wilayaId)
        .order('name')

      if (fetchError) throw fetchError

      const result = data || []
      communes.value = result
      return result
    } catch (err) {
      error.value = err.message || 'Failed to fetch communes'
      console.error('Error fetching communes:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Get wilaya by ID
   */
  const getWilayaById = (id) => {
    return wilayas.value.find((w) => w.id === id)
  }

  /**
   * Get commune by ID
   */
  const getCommuneById = (id) => {
    return communes.value.find((c) => c.id === id)
  }

  /**
   * Clear communes (useful when wilaya changes)
   */
  const clearCommunes = () => {
    communes.value = []
  }

  return {
    wilayas: readonly(wilayas),
    communes: readonly(communes),
    loading: readonly(loading),
    error: readonly(error),
    fetchWilayas,
    fetchCommunesByWilaya,
    getWilayaById,
    getCommuneById,
    clearCommunes,
  }
}