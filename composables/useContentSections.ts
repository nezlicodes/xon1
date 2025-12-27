// composables/useContentSections.ts
// Manage dynamic content sections

export const useContentSections = () => {
  const supabase = useSupabaseClient()

  /**
   * Get current locale safely (works in plugins and components)
   */
  const getCurrentLocale = () => {
    try {
      const { locale } = useI18n()
      return locale.value
    } catch {
      return 'fr' // Fallback
    }
  }

  /**
   * Get translation helper
   */
  const getTranslation = (translations: any, fallback: any = {}) => {
    const currentLocale = getCurrentLocale()
    if (!translations) return fallback
    return translations[currentLocale] || translations['fr'] || translations['en'] || fallback
  }

  /**
   * Fetch content section by key
   */
  const fetchSection = async (sectionKey: string) => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('*')
        .eq('section_key', sectionKey)
      //  .eq('is_active', true)
        .single()

      if (error) throw error

      // Transform data to include current locale translations
      const section = {
        ...data,
        content: getTranslation(data.content_translations)
      }

      return { data: section, error: null }
    } catch (error) {
      console.error('Error fetching content section:', error)
      return { data: null, error }
    }
  }

  /**
   * Fetch multiple sections by type
   */
  const fetchSectionsByType = async (sectionType: string) => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('*')
        .eq('section_type', sectionType)
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) throw error

      const sections = data?.map(section => ({
        ...section,
        content: getTranslation(section.content_translations)
      })) || []

      return { data: sections, error: null }
    } catch (error) {
      console.error('Error fetching content sections:', error)
      return { data: [], error }
    }
  }

  /**
   * Fetch all active content sections
   */
  const fetchAllSections = async () => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) throw error

      const sections = data?.map(section => ({
        ...section,
        content: getTranslation(section.content_translations)
      })) || []

      return { data: sections, error: null }
    } catch (error) {
      console.error('Error fetching all content sections:', error)
      return { data: [], error }
    }
  }

  /**
   * Update content section
   */
  const updateSection = async (sectionKey: string, contentUpdates: any) => {
    const currentLocale = getCurrentLocale()
    
    try {
      // Get current section
      const { data: currentSection } = await supabase
        .from('content_sections')
        .select('*')
        .eq('section_key', sectionKey)
        .single()

      if (!currentSection) throw new Error('Section not found')

      // Update translations for current locale
      const updatedTranslations = {
        ...currentSection.content_translations,
        [currentLocale]: {
          ...currentSection.content_translations[currentLocale],
          ...contentUpdates
        }
      }

      const { data, error } = await supabase
        .from('content_sections')
        .update({ content_translations: updatedTranslations })
        .eq('section_key', sectionKey)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error updating content section:', error)
      return { data: null, error }
    }
  }

  /**
   * Create new content section
   */
  const createSection = async (sectionData: any) => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .insert({
          section_key: sectionData.section_key,
          section_type: sectionData.section_type,
          content_translations: sectionData.content_translations || {
            en: {},
            fr: {},
            ar: {}
          },
          is_active: sectionData.is_active ?? true,
          display_order: sectionData.display_order || 0
        })
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error creating content section:', error)
      return { data: null, error }
    }
  }

  /**
   * Delete content section
   */
  const deleteSection = async (sectionKey: string) => {
    try {
      const { error } = await supabase
        .from('content_sections')
        .delete()
        .eq('section_key', sectionKey)

      if (error) throw error

      return { success: true, error: null }
    } catch (error) {
      console.error('Error deleting content section:', error)
      return { success: false, error }
    }
  }

  return {
    fetchSection,
    fetchSectionsByType,
    fetchAllSections,
    updateSection,
    createSection,
    deleteSection,
    getTranslation
  }
}