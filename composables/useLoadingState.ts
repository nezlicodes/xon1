/**
 * Composable for managing loading states across the app
 */
export const useLoadingState = () => {
  const globalLoading = useState('globalLoading', () => false)
  const loadingOperations = useState<Set<string>>('loadingOperations', () => new Set())

  const startLoading = (operation?: string) => {
    if (operation) {
      loadingOperations.value.add(operation)
    }
    globalLoading.value = true
  }

  const stopLoading = (operation?: string) => {
    if (operation) {
      loadingOperations.value.delete(operation)
    }
    
    // Only set global loading to false if no operations are pending
    if (loadingOperations.value.size === 0) {
      globalLoading.value = false
    }
  }

  const isLoading = (operation?: string) => {
    if (operation) {
      return loadingOperations.value.has(operation)
    }
    return globalLoading.value
  }

  return {
    globalLoading,
    startLoading,
    stopLoading,
    isLoading
  }
}