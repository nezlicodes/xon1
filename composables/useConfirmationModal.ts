// composables/useConfirmationModal.ts
import { useState } from '#app'

export const useConfirmationModal = () => {
  const isConfirmationModalVisible = useState<boolean>('confirmation-modal-visible', () => false)
  const confirmationMessage = useState<string>('confirmation-modal-message', () => '')
  const confirmationTitle = useState<string>('confirmation-modal-title', () => 'Confirmation')
  const confirmText = useState<string>('confirmation-modal-confirm-text', () => 'Confirm')
  const cancelText = useState<string>('confirmation-modal-cancel-text', () => 'Cancel')
  const confirmCallback = useState<(() => void) | null>('confirmation-modal-callback', () => null)

  const showConfirmation = (options: {
    message: string,
    title?: string,
    confirmText?: string,
    cancelText?: string,
    onConfirm: () => void
  }) => {
    confirmationMessage.value = options.message
    if (options.title) confirmationTitle.value = options.title
    if (options.confirmText) confirmText.value = options.confirmText
    if (options.cancelText) cancelText.value = options.cancelText
    confirmCallback.value = options.onConfirm
    isConfirmationModalVisible.value = true
  }

  const handleConfirm = () => {
    if (confirmCallback.value) {
      confirmCallback.value()
    }
    hideConfirmation()
  }

  const hideConfirmation = () => {
    isConfirmationModalVisible.value = false
    // Reset values
    confirmationTitle.value = 'Confirmation'
    confirmText.value = 'Confirm'
    cancelText.value = 'Cancel'
    confirmCallback.value = null
  }

  return {
    isConfirmationModalVisible,
    confirmationMessage,
    confirmationTitle,
    confirmText,
    cancelText,
    showConfirmation,
    hideConfirmation,
    handleConfirm
  }
}