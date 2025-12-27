// composables/useTechnologyProducts.ts
// Handle the relationship between technologies and products for featured products display

import type { Database } from '~/types/supabase'

type Product = Database['public']['Tables']['products']['Row']
type Technology = Database['public']['Tables']['technologies']['Row']

export interface TechnologyProductFilters {
  /** Limit number of products to fetch */
  limit?: number
  /** Only fetch featured products */
  featuredOnly?: boolean
  /** Only fetch active products */
  activeOnly?: boolean
  /** Category ID to filter by */
  categoryId?: string
  /** Custom product IDs to include */
  productIds?: string[]
}

export interface TechnologyProductResponse {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_at_price?: number
  sku?: string
  quantity: number
  is_featured: boolean
  images?: string[]
  category?: {
    id: string
    name: string
    slug: string
  }
  meta_title?: string
  meta_description?: string
  created_at: string
}

export const useTechnologyProducts = () => {
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
   * Get featured products to display on a technology page
   * This function implements different strategies for selecting products:
   * 1. If specific product IDs are configured, use those
   * 2. Otherwise, get featured products from relevant categories
   * 3. Fall back to general featured products
   */
  const getFeaturedProductsForTechnology = async (
    technologyId: string,
    filters: TechnologyProductFilters = {}
  ): Promise<TechnologyProductResponse[]> => {
    const locale = getCurrentLocale()
    const {
      limit = 8,
      featuredOnly = true,
      activeOnly = true,
      categoryId,
      productIds
    } = filters

    try {
      let query = supabase
        .from('products')
        .select(`
          id,
          name_translations,
          slug,
          description_translations,
          price,
          compare_at_price,
          sku,
          quantity,
          is_featured,
          meta_title_translations,
          meta_description_translations,
          created_at,
          categories (
            id,
            name_translations,
            slug
          )
        `)

      // Apply filters
      if (activeOnly) {
        query = query.eq('is_active', true)
      }

      if (featuredOnly) {
        query = query.eq('is_featured', true)
      }

      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }

      if (productIds && productIds.length > 0) {
        query = query.in('id', productIds)
      }

      // Order by featured first, then by creation date
      query = query
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit)

      const { data: products, error } = await query

      if (error) {
        console.error('Error fetching products for technology:', error)
        throw error
      }

      // Transform data to include localized fields
      return products?.map(product => ({
        id: product.id,
        name: product.name_translations?.[locale] || product.name_translations?.['fr'] || product.name_translations?.['en'] || '',
        slug: product.slug,
        description: product.description_translations?.[locale] || product.description_translations?.['fr'] || product.description_translations?.['en'] || '',
        price: product.price,
        compare_at_price: product.compare_at_price,
        sku: product.sku,
        quantity: product.quantity || 0,
        is_featured: product.is_featured || false,
        meta_title: product.meta_title_translations?.[locale] || product.meta_title_translations?.['fr'] || '',
        meta_description: product.meta_description_translations?.[locale] || product.meta_description_translations?.['fr'] || '',
        created_at: product.created_at,
        category: product.categories ? {
          id: product.categories.id,
          name: product.categories.name_translations?.[locale] || product.categories.name_translations?.['fr'] || '',
          slug: product.categories.slug
        } : undefined
      })) || []

    } catch (error) {
      console.error('Error in getFeaturedProductsForTechnology:', error)
      return []
    }
  }

  /**
   * Get products by category that are relevant to a technology
   * This is useful when you want to show products from specific categories
   * that are related to the technology
   */
  const getProductsByCategory = async (
    categoryIds: string[],
    filters: TechnologyProductFilters = {}
  ): Promise<TechnologyProductResponse[]> => {
    const {
      limit = 8,
      featuredOnly = false,
      activeOnly = true
    } = filters

    if (!categoryIds.length) return []

    try {
      let query = supabase
        .from('products')
        .select(`
          id,
          name_translations,
          slug,
          description_translations,
          price,
          compare_at_price,
          sku,
          quantity,
          is_featured,
          meta_title_translations,
          meta_description_translations,
          created_at,
          categories (
            id,
            name_translations,
            slug
          )
        `)
        .in('category_id', categoryIds)

      if (activeOnly) {
        query = query.eq('is_active', true)
      }

      if (featuredOnly) {
        query = query.eq('is_featured', true)
      }

      query = query
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit)

      const { data: products, error } = await query

      if (error) throw error

      const locale = getCurrentLocale()

      return products?.map(product => ({
        id: product.id,
        name: product.name_translations?.[locale] || product.name_translations?.['fr'] || '',
        slug: product.slug,
        description: product.description_translations?.[locale] || product.description_translations?.['fr'] || '',
        price: product.price,
        compare_at_price: product.compare_at_price,
        sku: product.sku,
        quantity: product.quantity || 0,
        is_featured: product.is_featured || false,
        meta_title: product.meta_title_translations?.[locale] || product.meta_title_translations?.['fr'] || '',
        meta_description: product.meta_description_translations?.[locale] || product.meta_description_translations?.['fr'] || '',
        created_at: product.created_at,
        category: product.categories ? {
          id: product.categories.id,
          name: product.categories.name_translations?.[locale] || product.categories.name_translations?.['fr'] || '',
          slug: product.categories.slug
        } : undefined
      })) || []

    } catch (error) {
      console.error('Error in getProductsByCategory:', error)
      return []
    }
  }

  /**
   * Get all featured products (fallback option)
   */
  const getAllFeaturedProducts = async (limit: number = 8): Promise<TechnologyProductResponse[]> => {
    return getFeaturedProductsForTechnology('', {
      limit,
      featuredOnly: true,
      activeOnly: true
    })
  }

  /**
   * Get specifically selected featured products for a technology from the technology_featured_products table
   * This fetches products that have been manually selected via the admin ProductSelector
   */
  const getSelectedFeaturedProducts = async (
    technologyId: string,
    limit?: number
  ): Promise<TechnologyProductResponse[]> => {
    const locale = getCurrentLocale()

    try {
      let query = supabase
        .from('technology_featured_products')
        .select(`
          display_order,
          products (
            id,
            name_translations,
            slug,
            description_translations,
            price,
            compare_at_price,
            sku,
            quantity,
            is_featured,
            meta_title_translations,
            meta_description_translations,
            created_at,
            categories (
              id,
              name_translations,
              slug
            ),
            images:product_images(url, position)
          )
        `)
        .eq('technology_id', technologyId)
        .order('display_order', { ascending: true })

      if (limit) {
        query = query.limit(limit)
      }

      const { data: featuredProducts, error } = await query

      if (error) {
        console.error('Error fetching selected featured products:', error)
        throw error
      }

      // Transform data to include localized fields
      return featuredProducts?.map(item => {
        const product = item.products
        if (!product) return null
        
        return {
          id: product.id,
          name: product.name_translations?.[locale] || product.name_translations?.['fr'] || product.name_translations?.['en'] || '',
          slug: product.slug,
          description: product.description_translations?.[locale] || product.description_translations?.['fr'] || product.description_translations?.['en'] || '',
          price: product.price,
          compare_at_price: product.compare_at_price,
          sku: product.sku,
          quantity: product.quantity || 0,
          is_featured: product.is_featured || false,
          image: product.images?.sort((a, b) => a.position - b.position)[0]?.url || null,
          meta_title: product.meta_title_translations?.[locale] || product.meta_title_translations?.['fr'] || '',
          meta_description: product.meta_description_translations?.[locale] || product.meta_description_translations?.['fr'] || '',
          created_at: product.created_at,
          category: product.categories ? {
            id: product.categories.id,
            name: product.categories.name_translations?.[locale] || product.categories.name_translations?.['fr'] || '',
            slug: product.categories.slug
          } : undefined
        }
      }).filter(Boolean) || []

    } catch (error) {
      console.error('Error in getSelectedFeaturedProducts:', error)
      return []
    }
  }

  /**
   * Save selected featured products for a technology
   * This handles the technology_featured_products table updates
   */
  const saveSelectedFeaturedProducts = async (
    technologyId: string,
    products: Array<{ id: string, display_order?: number }>
  ) => {
    try {
      // First, remove existing entries for this technology
      await supabase
        .from('technology_featured_products')
        .delete()
        .eq('technology_id', technologyId)

      // Then, insert the new selections
      if (products.length > 0) {
        const insertData = products.map((product, index) => ({
          technology_id: technologyId,
          product_id: product.id,
          display_order: product.display_order || index + 1
        }))

        const { error: insertError } = await supabase
          .from('technology_featured_products')
          .insert(insertData)

        if (insertError) throw insertError
      }

      return { error: null }
    } catch (error) {
      console.error('Error saving selected featured products:', error)
      return { error }
    }
  }

  return {
    getFeaturedProductsForTechnology,
    getProductsByCategory,
    getAllFeaturedProducts,
    getSelectedFeaturedProducts,
    saveSelectedFeaturedProducts
  }
}