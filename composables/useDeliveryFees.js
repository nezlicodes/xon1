// composables/useDeliveryFees.js

export const useDeliveryFees = () => {
  const supabase = useSupabaseClient()
  const loading = ref(false)
  const error = ref(null)

  /**
   * Get all delivery fees with location details
   */
  const getAllDeliveryFees = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('delivery_fees_details')
        .select('*')
        .order('wilaya_name', { ascending: true })
        .order('commune_name', { ascending: true })
        .order('delivery_type', { ascending: true })

      if (fetchError) throw fetchError

      return data || []
    } catch (err) {
      error.value = err.message || 'Failed to fetch delivery fees'
      console.error('Error fetching delivery fees:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Get delivery fee for specific location and type
   */
  const getDeliveryFee = async (wilayaId, communeId, deliveryType) => {
    try {
      // Try commune-specific fee first
      let { data, error: fetchError } = await supabase
        .from('delivery_fees')
        .select('fee')
        .eq('wilaya_id', wilayaId)
        .eq('commune_id', communeId)
        .eq('delivery_type', deliveryType)
        .single()

      if (data) return data.fee

      // If not found, try wilaya-wide fee
      const { data: wilayaData, error: wilayaError } = await supabase
        .from('delivery_fees')
        .select('fee')
        .eq('wilaya_id', wilayaId)
        .is('commune_id', null)
        .eq('delivery_type', deliveryType)
        .single()

      if (wilayaData) return wilayaData.fee

      // Return 0 if no fee found
      return 0
    } catch (err) {
      console.error('Error fetching delivery fee:', err)
      return 0
    }
  }

  /**
   * Create a new delivery fee
   */
  const createDeliveryFee = async (feeData) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: insertError } = await supabase
        .from('delivery_fees')
        .insert([feeData])
        .select()
        .single()

      if (insertError) throw insertError

      return data
    } catch (err) {
      error.value = err.message || 'Failed to create delivery fee'
      console.error('Error creating delivery fee:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Update delivery fee
   */
  const updateDeliveryFee = async (id, feeData) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('delivery_fees')
        .update(feeData)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      return data
    } catch (err) {
      error.value = err.message || 'Failed to update delivery fee'
      console.error('Error updating delivery fee:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete delivery fee
   */
  const deleteDeliveryFee = async (id) => {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('delivery_fees')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      return true
    } catch (err) {
      error.value = err.message || 'Failed to delete delivery fee'
      console.error('Error deleting delivery fee:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Get delivery fees by wilaya
   */
  const getDeliveryFeesByWilaya = async (wilayaId) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('delivery_fees_details')
        .select('*')
        .eq('wilaya_id', wilayaId)
        .order('commune_name', { ascending: true })
        .order('delivery_type', { ascending: true })

      if (fetchError) throw fetchError

      return data || []
    } catch (err) {
      error.value = err.message || 'Failed to fetch delivery fees'
      console.error('Error fetching delivery fees:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    getAllDeliveryFees,
    getDeliveryFee,
    createDeliveryFee,
    updateDeliveryFee,
    deleteDeliveryFee,
    getDeliveryFeesByWilaya,
  }
}
