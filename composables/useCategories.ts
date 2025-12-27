// composables/useCategories.ts
// Updated with optimized data fetching

import type { Database } from '~/types/supabase'

type Category = Database['public']['Tables']['categories']['Row']

export const useCategories = () => {
  const supabase = useSupabaseClient<Database>()
  const nuxtApp = useNuxtApp()
  
  // Get current locale safely
  const getCurrentLocale = () => {
    try {
      if (nuxtApp && nuxtApp.$i18n) {
        return nuxtApp.$i18n.locale.value
      }
      return 'fr'
    } catch {
      return 'fr'
    }
  }

  /**
   * Fetch categories with filters and caching
   */
  const fetchCategories = async (filters: {
    featured?: boolean
    active?: boolean
    withProductCount?: boolean
  } = {}) => {
    const locale = getCurrentLocale()
    const { featured, active = true, withProductCount = false } = filters

    let query = supabase
      .from('categories')
      .select(withProductCount ? '*, products(count)' : '*')
      .eq('is_active', active)
      .order('name_translations->fr', { ascending: true })

    if (featured !== undefined) {
      query = query.eq('is_featured', featured)
    }

    const { data, error } = await query

    if (error) throw error

    // Transform data to include localized fields
    return data?.map(category => ({
      ...category,
      name: category.name_translations?.[locale] || category.name_translations?.['fr'] || '',
      description: category.description_translations?.[locale] || category.description_translations?.['fr'] || '',
      product_count: withProductCount && Array.isArray(category.products) ? category.products.length : 0
    })) || []
  }

  /**
   * Fetch single category by ID or slug
   */
  const fetchCategory = async (idOrSlug: string, withProducts = false) => {
    const locale = getCurrentLocale()
    
    let query = supabase
      .from('categories')
      .select(withProducts ? '*, products(*)' : '*')
      .eq('is_active', true)

    // Check if it's a UUID or slug
    if (idOrSlug.includes('-') && idOrSlug.length > 30) {
      query = query.eq('id', idOrSlug)
    } else {
      query = query.eq('slug', idOrSlug)
    }

    const { data, error } = await query.single()

    if (error) throw error

    // Transform data to include localized fields
    return {
      ...data,
      name: data.name_translations?.[locale] || data.name_translations?.['fr'] || '',
      description: data.description_translations?.[locale] || data.description_translations?.['fr'] || ''
    }
  }

  /**
   * Create category
   */
  const createCategory = async (category: {
    name: string
    slug: string
    description?: string
    image?: string
    is_featured?: boolean
  }) => {
    const { name, description, ...rest } = category

    // Create translations object
    const name_translations = {
      en: name,
      fr: name,
      ar: name
    }

    const description_translations = description ? {
      en: description,
      fr: description,
      ar: description
    } : null

    const { data, error } = await supabase
      .from('categories')
      .insert({
        ...rest,
        name_translations,
        description_translations,
        is_active: true
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Update category
   */
  const updateCategory = async (id: string, updates: Partial<Category> & { 
    name?: string
    description?: string 
  }) => {
    const locale = getCurrentLocale()
    const { name, description, ...rest } = updates

    const updateData: any = { ...rest }

    // Update translations if name is provided
    if (name !== undefined) {
      const { data: current } = await supabase
        .from('categories')
        .select('name_translations')
        .eq('id', id)
        .single()

      updateData.name_translations = {
        ...current?.name_translations,
        [locale]: name
      }
    }

    // Update description translations if provided
    if (description !== undefined) {
      const { data: current } = await supabase
        .from('categories')
        .select('description_translations')
        .eq('id', id)
        .single()

      updateData.description_translations = {
        ...current?.description_translations,
        [locale]: description
      }
    }

    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Delete category
   */
  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  /**
   * Toggle featured status
   */
  const toggleFeatured = async (id: string, featured: boolean) => {
    const { data, error } = await supabase
      .from('categories')
      .update({ is_featured: featured })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  return {
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleFeatured
  }
}