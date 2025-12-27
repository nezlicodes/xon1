// composables/useAboutUs.ts
// About Us page management

export const useAboutUs = () => {
    const supabase = useSupabaseClient()

    /**
     * Get current locale safely
     */
    const getCurrentLocale = () => {
        try {
            const { locale } = useI18n()
            return locale.value
        } catch {
            return 'fr'
        }
    }

    /**
     * Get translation helper
     */
    const getTranslation = (translations: any, fallback = '') => {
        const currentLocale = getCurrentLocale()
        if (!translations) return fallback
        return translations[currentLocale] || translations['fr'] || translations['en'] || fallback
    }

    /**
     * Fetch all about us sections
     */
    const fetchAboutSections = async () => {
        try {
            const { data, error } = await supabase
                .from('about_us_sections')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true })

            if (error) throw error

            // Transform data to include current locale translations
            const sections = data?.map(section => ({
                ...section,
                title: getTranslation(section.title_translations),
                content: getTranslation(section.content_translations),
                // Parse additional_data for easy access
                additionalData: section.additional_data || {}
            })) || []

            return { data: sections, error: null }
        } catch (error) {
            console.error('Error fetching about sections:', error)
            return { data: [], error }
        }
    }

    /**
     * Fetch single section by key
     */
    const fetchSectionByKey = async (sectionKey: string) => {
        try {
            const { data, error } = await supabase
                .from('about_us_sections')
                .select('*')
                .eq('section_key', sectionKey)
                .eq('is_active', true)
                .single()

            if (error) throw error

            const section = {
                ...data,
                title: getTranslation(data.title_translations),
                content: getTranslation(data.content_translations),
                additionalData: data.additional_data || {}
            }

            return { data: section, error: null }
        } catch (error) {
            console.error('Error fetching section:', error)
            return { data: null, error }
        }
    }

    /**
     * Update section (admin)
     */
    const updateSection = async (sectionKey: string, updates: any) => {
        const currentLocale = getCurrentLocale()

        try {
            const { data: currentSection } = await supabase
                .from('about_us_sections')
                .select('*')
                .eq('section_key', sectionKey)
                .single()

            if (!currentSection) throw new Error('Section not found')

            const updateData: any = {}

            // Handle translations
            if (updates.title !== undefined) {
                updateData.title_translations = {
                    ...currentSection.title_translations,
                    [currentLocale]: updates.title
                }
            }

            if (updates.content !== undefined) {
                updateData.content_translations = {
                    ...currentSection.content_translations,
                    [currentLocale]: updates.content
                }
            }

            // Handle other fields
            if (updates.image_url !== undefined) {
                updateData.image_url = updates.image_url
            }

            if (updates.additional_data !== undefined) {
                updateData.additional_data = updates.additional_data
            }

            const { data, error } = await supabase
                .from('about_us_sections')
                .update(updateData)
                .eq('section_key', sectionKey)
                .select()
                .single()

            if (error) throw error

            return { data, error: null }
        } catch (error) {
            console.error('Error updating section:', error)
            return { data: null, error }
        }
    }

    return {
        fetchAboutSections,
        fetchSectionByKey,
        updateSection,
        getTranslation
    }
}