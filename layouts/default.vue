<template>
  <div
    :class="[
      user && route.path.includes('admin')
        ? 'bg-gray-100 playati text-black'
        : 'playati',
    ]"
  >
    <Sidebar
      v-if="user && route.path.includes('admin')"
      @sidebar-state="updateSidebarState"
    ></Sidebar>
    <Appbar v-if="!route.path.includes('admin')"></Appbar>

    <div
      class="min-h-screen transition-all duration-150 overflow-x-hidden"
      dir="ltr"
      :class="[
        user && route.path.includes('admin')
          ? ['pt-6 sm:pt-0 sm:pl-16', sidebarExpanded ? 'sm:pl-64' : 'sm:pl-16']
          : '',
      ]"
    >
      <div>
        <slot></slot>
      </div>
    </div>

    <Footer v-if="!route.path.includes('admin')"></Footer>

    <!-- Floating WhatsApp Button on non-admin pages -->
    <FloatingWhatsapp v-if="!route.path.includes('admin')" />

    <ErrorModal
      :is-visible="isErrorModalVisible"
      :error-message="errorMessage"
      @close="hideError"
    ></ErrorModal>

    <ConfirmationModal
      :is-visible="isConfirmationModalVisible"
      :title="confirmationTitle"
      :message="confirmationMessage"
      :confirm-text="confirmText"
      :cancel-text="cancelText"
      @confirm="handleConfirm"
      @cancel="hideConfirmation"
    ></ConfirmationModal>

    <SuccessSnackbar
      :is-visible="isSuccessSnackbarVisible"
      :message="successMessage"
      :duration="successDuration"
      @close="hideSuccess"
    ></SuccessSnackbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const { isErrorModalVisible, errorMessage, hideError } = useErrorModal();
const {
  isConfirmationModalVisible,
  confirmationMessage,
  confirmationTitle,
  confirmText,
  cancelText,
  hideConfirmation,
  handleConfirm,
} = useConfirmationModal();
const {
  isSuccessSnackbarVisible,
  successMessage,
  successDuration,
  hideSuccess,
} = useSuccessSnackbar();

// RTL support
const { isRtl } = useTranslation();

const user = useSupabaseUser();
const route = useRoute();

// Track sidebar state
const sidebarExpanded = ref(true);

// Update sidebar state from Sidebar component
const updateSidebarState = (isExpanded: boolean) => {
  sidebarExpanded.value = isExpanded;
};
</script>