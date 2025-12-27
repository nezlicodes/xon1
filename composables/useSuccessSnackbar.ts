// composables/useSuccessSnackbar.ts
import { useState } from '#app'

export const useSuccessSnackbar = () => {
  const isSuccessSnackbarVisible = useState<boolean>('success-snackbar-visible', () => false)
  const successMessage = useState<string>('success-snackbar-message', () => '')
  const successDuration = useState<number>('success-snackbar-duration', () => 3000)
  
  const showSuccess = (message: string, duration: number = 3000) => {
    successMessage.value = message
    successDuration.value = duration
    isSuccessSnackbarVisible.value = true
  }
  
  const hideSuccess = () => {
    isSuccessSnackbarVisible.value = false
  }
  
  return {
    isSuccessSnackbarVisible,
    successMessage,
    successDuration,
    showSuccess,
    hideSuccess
  }
}