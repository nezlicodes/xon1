// composables/useProducts.ts
// Updated with optimized data fetching

import type { Database } from '~/types/supabase'

type Product = Database['public']['Tables']['products']['Row']

export const useProducts = () => {
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
   * Fetch products with filters and caching
   */
  const fetchProducts = async (filters: {
    categoryId?: string
    featured?: boolean
    active?: boolean
    limit?: number
    offset?: number
  } = {}) => {
    const locale = getCurrentLocale()
    const { categoryId, featured, active = true, limit, offset } = filters

    let query = supabase
      .from('products')
      .select('*, categories(id, name_translations, slug)')
      .eq('is_active', active)
      .order('created_at', { ascending: false })

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    if (featured !== undefined) {
      query = query.eq('is_featured', featured)
    }

    if (limit) {
      query = query.limit(limit)
    }

    if (offset) {
      query = query.range(offset, offset + (limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error

    // Transform data to include localized fields
    return data?.map(product => ({
      ...product,
      name: product.name_translations?.[locale] || product.name_translations?.['fr'] || '',
      description: product.description_translations?.[locale] || product.description_translations?.['fr'] || '',
      category: product.categories ? {
        ...product.categories,
        name: product.categories.name_translations?.[locale] || product.categories.name_translations?.['fr'] || ''
      } : null
    })) || []
  }

  /**
   * Fetch single product by ID or slug
   */
  const fetchProduct = async (idOrSlug: string) => {
    const locale = getCurrentLocale()
    
    let query = supabase
      .from('products')
      .select('*, categories(id, name_translations, slug)')
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
      description: data.description_translations?.[locale] || data.description_translations?.['fr'] || '',
      category: data.categories ? {
        ...data.categories,
        name: data.categories.name_translations?.[locale] || data.categories.name_translations?.['fr'] || ''
      } : null
    }
  }

  /**
   * Create product
   */
  const createProduct = async (product: Partial<Product> & {
    name: string
    slug: string
    price: number
    category_id: string
  }) => {
    const { name, ...rest } = product

    // Create translations object
    const name_translations = {
      en: name,
      fr: name,
      ar: name
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        ...rest,
        name_translations,
        is_active: true
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Update product
   */
  const updateProduct = async (id: string, updates: Partial<Product> & { name?: string }) => {
    const locale = getCurrentLocale()
    const { name, ...rest } = updates

    const updateData: any = { ...rest }

    // Update translations if name is provided
    if (name !== undefined) {
      const { data: current } = await supabase
        .from('products')
        .select('name_translations')
        .eq('id', id)
        .single()

      updateData.name_translations = {
        ...current?.name_translations,
        [locale]: name
      }
    }

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Delete product
   */
  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  /**
   * Search products
   */
  const searchProducts = async (query: string, filters: {
    categoryId?: string
    limit?: number
  } = {}) => {
    const locale = getCurrentLocale()
    const { categoryId, limit = 20 } = filters

    let dbQuery = supabase
      .from('products')
      .select('*, categories(id, name_translations, slug)')
      .eq('is_active', true)
      .limit(limit)

    if (categoryId) {
      dbQuery = dbQuery.eq('category_id', categoryId)
    }

    const { data, error } = await dbQuery

    if (error) throw error

    // Filter by search query (client-side for now)
    const searchLower = query.toLowerCase()
    const filtered = data?.filter(product => {
      const name = product.name_translations?.[locale] || product.name_translations?.['fr'] || ''
      const description = product.description_translations?.[locale] || product.description_translations?.['fr'] || ''
      return name.toLowerCase().includes(searchLower) || description.toLowerCase().includes(searchLower)
    }) || []

    return filtered.map(product => ({
      ...product,
      name: product.name_translations?.[locale] || product.name_translations?.['fr'] || '',
      description: product.description_translations?.[locale] || product.description_translations?.['fr'] || ''
    }))
  }

  return {
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts
  }
}