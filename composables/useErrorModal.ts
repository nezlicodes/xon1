// composables/useErrorModal.ts
import { useState } from '#app'

export const useErrorModal = () => {
  const isErrorModalVisible = useState<boolean>('error-modal-visible', () => false)
  const errorMessage = useState<string>('error-modal-message', () => '')

  const showError = (message: string) => {
    errorMessage.value = message
    isErrorModalVisible.value = true
  }

  const hideError = () => {
    isErrorModalVisible.value = false
  }

  return {
    isErrorModalVisible,
    errorMessage,
    showError,
    hideError
  }
}