// composables/useOrders.js

export const useOrders = () => {
  const supabase = useSupabaseClient()
  const loading = ref(false)
  const error = ref(null)

  /**
   * Create a new order
   */
  const createOrder = async (orderData) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: insertError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single()

      if (insertError) throw insertError

      return data
    } catch (err) {
      error.value = err.message || 'Failed to create order'
      console.error('Error creating order:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Get order by ID with full details
   */
  const getOrderDetails = async (orderId) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('order_details')
        .select('*')
        .eq('id', orderId)
        .single()

      if (fetchError) throw fetchError

      return data
    } catch (err) {
      error.value = err.message || 'Failed to fetch order details'
      console.error('Error fetching order details:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Get orders by phone number
   */
  const getOrdersByPhone = async (phoneNumber) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('order_details')
        .select('*')
        .eq('phone_number', phoneNumber)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      return data || []
    } catch (err) {
      error.value = err.message || 'Failed to fetch orders'
      console.error('Error fetching orders:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Get all orders (admin function)
   */
  const getAllOrders = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('order_details')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      return data || []
    } catch (err) {
      error.value = err.message || 'Failed to fetch all orders'
      console.error('Error fetching all orders:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Get pending orders count (for notification badge)
   */
  const getPendingOrdersCount = async () => {
    try {
      const { count, error: countError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      if (countError) throw countError

      return count || 0
    } catch (err) {
      console.error('Error fetching pending orders count:', err)
      return 0
    }
  }

  /**
   * Update order status (admin function)
   */
  const updateOrderStatus = async (orderId, status) => {
    loading.value = true
    error.value = null

    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      if (updateError) throw updateError

      return true
    } catch (err) {
      error.value = err.message || 'Failed to update order status'
      console.error('Error updating order status:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete order (admin function)
   */
  const deleteOrder = async (orderId) => {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId)

      if (deleteError) throw deleteError

      return true
    } catch (err) {
      error.value = err.message || 'Failed to delete order'
      console.error('Error deleting order:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    createOrder,
    getOrderDetails,
    getOrdersByPhone,
    getAllOrders,
    getPendingOrdersCount,
    updateOrderStatus,
    deleteOrder,
  }
}