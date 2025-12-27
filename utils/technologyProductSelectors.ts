// utils/technologyProductSelectors.ts
// Smart product selection strategies for technology pages

import type { TechnologyProductFilters, TechnologyProductResponse } from '~/composables/useTechnologyProducts'

/**
 * Configuration for how to select products for each technology
 * This can be stored in database or configuration files
 */
export interface TechnologyProductConfig {
  technologyId: string
  strategy: 'featured' | 'category' | 'specific' | 'mixed'
  options: {
    /** Specific product IDs to show */
    productIds?: string[]
    /** Category IDs to pull products from */
    categoryIds?: string[]
    /** Maximum number of products to show */
    limit?: number
    /** Whether to only show featured products */
    featuredOnly?: boolean
    /** Custom weights for mixing strategies */
    weights?: {
      featured: number
      category: number
      recent: number
    }
  }
}

/**
 * Default product selection strategies
 */
export const productSelectionStrategies = {
  /**
   * Featured products strategy - shows only featured products
   */
  featured: async (
    technologyId: string,
    options: TechnologyProductConfig['options'] = {}
  ): Promise<TechnologyProductResponse[]> => {
    const { getFeaturedProductsForTechnology } = useTechnologyProducts()
    return getFeaturedProductsForTechnology(technologyId, {
      limit: options.limit || 8,
      featuredOnly: true,
      activeOnly: true
    })
  },

  /**
   * Category-based strategy - shows products from specific categories
   */
  category: async (
    technologyId: string,
    options: TechnologyProductConfig['options'] = {}
  ): Promise<TechnologyProductResponse[]> => {
    const { getProductsByCategory } = useTechnologyProducts()
    
    if (!options.categoryIds?.length) {
      console.warn('Category strategy requires categoryIds')
      return []
    }

    return getProductsByCategory(options.categoryIds, {
      limit: options.limit || 8,
      featuredOnly: options.featuredOnly || false,
      activeOnly: true
    })
  },

  /**
   * Specific products strategy - shows manually selected products
   */
  specific: async (
    technologyId: string,
    options: TechnologyProductConfig['options'] = {}
  ): Promise<TechnologyProductResponse[]> => {
    const { getFeaturedProductsForTechnology } = useTechnologyProducts()
    
    if (!options.productIds?.length) {
      console.warn('Specific strategy requires productIds')
      return []
    }

    return getFeaturedProductsForTechnology(technologyId, {
      limit: options.limit || 8,
      productIds: options.productIds,
      activeOnly: true,
      featuredOnly: false
    })
  },

  /**
   * Mixed strategy - combines featured and category-based products
   */
  mixed: async (
    technologyId: string,
    options: TechnologyProductConfig['options'] = {}
  ): Promise<TechnologyProductResponse[]> => {
    const { getFeaturedProductsForTechnology, getProductsByCategory } = useTechnologyProducts()
    const limit = options.limit || 8
    const weights = options.weights || { featured: 0.6, category: 0.4, recent: 0 }

    const featuredLimit = Math.ceil(limit * weights.featured)
    const categoryLimit = Math.ceil(limit * weights.category)

    const [featuredProducts, categoryProducts] = await Promise.all([
      getFeaturedProductsForTechnology(technologyId, {
        limit: featuredLimit,
        featuredOnly: true,
        activeOnly: true
      }),
      options.categoryIds?.length ? getProductsByCategory(options.categoryIds, {
        limit: categoryLimit,
        featuredOnly: false,
        activeOnly: true
      }) : []
    ])

    // Combine and deduplicate
    const combined = [...featuredProducts]
    const existingIds = new Set(featuredProducts.map(p => p.id))

    for (const product of categoryProducts) {
      if (!existingIds.has(product.id) && combined.length < limit) {
        combined.push(product)
      }
    }

    return combined.slice(0, limit)
  }
}

/**
 * Technology-specific product configurations
 * These can be moved to database or admin configuration later
 */
export const technologyProductConfigs: Record<string, TechnologyProductConfig> = {
  // Example configurations for different technologies
  'solar-panels': {
    technologyId: 'solar-panels',
    strategy: 'mixed',
    options: {
      categoryIds: ['renewable-energy', 'solar-equipment'],
      limit: 8,
      featuredOnly: false,
      weights: { featured: 0.5, category: 0.5, recent: 0 }
    }
  },
  
  'wind-energy': {
    technologyId: 'wind-energy',
    strategy: 'category',
    options: {
      categoryIds: ['wind-turbines', 'renewable-energy'],
      limit: 6,
      featuredOnly: false
    }
  },

  'smart-home': {
    technologyId: 'smart-home',
    strategy: 'featured',
    options: {
      limit: 8,
      featuredOnly: true
    }
  }
}

/**
 * Get products for a technology using configured strategy
 */
export const getProductsForTechnology = async (
  technologySlug: string,
  customConfig?: Partial<TechnologyProductConfig>
): Promise<TechnologyProductResponse[]> => {
  // Get configuration (default to featured strategy if not configured)
  const config = technologyProductConfigs[technologySlug] || {
    technologyId: technologySlug,
    strategy: 'featured' as const,
    options: { limit: 8, featuredOnly: true }
  }

  // Apply custom overrides
  if (customConfig) {
    config.strategy = customConfig.strategy || config.strategy
    config.options = { ...config.options, ...customConfig.options }
  }

  // Execute the strategy
  const strategyFunction = productSelectionStrategies[config.strategy]
  if (!strategyFunction) {
    console.warn(`Unknown product selection strategy: ${config.strategy}`)
    return productSelectionStrategies.featured(config.technologyId, config.options)
  }

  try {
    return await strategyFunction(config.technologyId, config.options)
  } catch (error) {
    console.error('Error getting products for technology:', error)
    // Fallback to featured products
    return productSelectionStrategies.featured(config.technologyId, { limit: 8 })
  }
}