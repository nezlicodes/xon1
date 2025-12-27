/**
 * Global language state for the website editor
 * This composable manages the selected language across all editor components
 */

import { ref, readonly } from 'vue'

const editorLanguage = ref<'fr' | 'ar' | 'en'>('en')

export const useEditorLanguage = () => {
  const setLanguage = (lang: 'fr' | 'ar' | 'en') => {
    editorLanguage.value = lang
  }

  return {
    editorLanguage: readonly(editorLanguage),
    setLanguage,
  }
}
