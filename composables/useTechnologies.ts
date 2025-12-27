export const useTechnologies = () => {
  const supabase = useSupabaseClient()
  const { locale } = useI18n()

  // Fetch all active technologies
  const fetchTechnologies = async () => {
    const { data, error } = await supabase
      .from('technologies')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    return { data, error }
  }

  // Fetch single technology by slug
  const fetchTechnologyBySlug = async (slug: string) => {
    const { data, error } = await supabase
      .from('technologies')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    return { data, error }
  }

  // Fetch all technology sections for a technology
  const fetchTechnologySections = async (technologyId: string) => {
    const { data, error } = await supabase
      .from('technology_sections')
      .select('*')
      .eq('technology_id', technologyId)
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    return { data, error }
  }

  // Fetch single section by key
  const fetchSectionByKey = async (technologyId: string, sectionKey: string) => {
    const { data, error } = await supabase
      .from('technology_sections')
      .select('*')
      .eq('technology_id', technologyId)
      .eq('section_key', sectionKey)
      .single()

    return { data, error }
  }

  // Create new technology
  const createTechnology = async (technology: any) => {
    const { data, error } = await supabase
      .from('technologies')
      .insert([technology])
      .select()
      .single()

    return { data, error }
  }

  // Update technology
  const updateTechnology = async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('technologies')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  }

  // Delete technology
  const deleteTechnology = async (id: string) => {
    const { error } = await supabase
      .from('technologies')
      .delete()
      .eq('id', id)

    return { error }
  }

  // Create section for technology
  const createSection = async (section: any) => {
    const { data, error } = await supabase
      .from('technology_sections')
      .insert([section])
      .select()
      .single()

    return { data, error }
  }

  // Update section
  const updateSection = async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('technology_sections')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  }

  // Get translated field
  const getTranslation = (translations: any, field: string = 'fr') => {
    if (!translations) return ''
    return translations[locale.value] || translations[field] || translations.fr || translations.en || ''
  }

  return {
    fetchTechnologies,
    fetchTechnologyBySlug,
    fetchTechnologySections,
    fetchSectionByKey,
    createTechnology,
    updateTechnology,
    deleteTechnology,
    createSection,
    updateSection,
    getTranslation
  }
}
