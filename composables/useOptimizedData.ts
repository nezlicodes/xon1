/**
 * Composable for optimized data fetching with caching and loading states
 */
export const useOptimizedData = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    cacheTime?: number // in milliseconds
    staleTime?: number // in milliseconds
    refetchOnMount?: boolean
    initialData?: T
  } = {}
) => {
  const {
    cacheTime = 1000 * 60 * 30, // 30 minutes
    staleTime = 1000 * 60 * 5,  // 5 minutes
    refetchOnMount = false,
    initialData
  } = options

  const data = useState<T | null>(key, () => initialData || null)
  const loading = useState(`${key}_loading`, () => false)
  const error = useState<Error | null>(`${key}_error`, () => null)
  const lastFetched = useState<number>(`${key}_lastFetched`, () => 0)

  /**
   * Check if data is stale
   */
  const isStale = computed(() => {
    if (!lastFetched.value) return true
    return Date.now() - lastFetched.value > staleTime
  })

  /**
   * Check if cache is valid
   */
  const isCacheValid = computed(() => {
    if (!lastFetched.value) return false
    return Date.now() - lastFetched.value < cacheTime
  })

  /**
   * Fetch data
   */
  const fetch = async (force = false) => {
    // Return cached data if valid and not forcing
    if (!force && isCacheValid.value && data.value) {
      // Refetch in background if stale
      if (isStale.value) {
        fetchInBackground()
      }
      return data.value
    }

    loading.value = true
    error.value = null

    try {
      const result = await fetcher()
      data.value = result
      lastFetched.value = Date.now()
      return result
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch in background without setting loading state
   */
  const fetchInBackground = async () => {
    try {
      const result = await fetcher()
      data.value = result
      lastFetched.value = Date.now()
    } catch (e) {
      console.error('Background fetch failed:', e)
    }
  }

  /**
   * Invalidate cache
   */
  const invalidate = () => {
    lastFetched.value = 0
  }

  /**
   * Refresh data
   */
  const refresh = () => fetch(true)

  // Auto-fetch on mount if needed
  if (refetchOnMount) {
    onMounted(() => fetch())
  }

  return {
    data: computed(() => data.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isStale,
    isCacheValid,
    fetch,
    refresh,
    invalidate
  }
}