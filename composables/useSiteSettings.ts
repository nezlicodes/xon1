// composables/useSiteSettings.ts
// Optimized version with caching and localStorage

const CACHE_KEY = 'xone_site_settings'
const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

export const useSiteSettings = () => {
  const supabase = useSupabaseClient()
  const nuxtApp = useNuxtApp()
  
  // Get current locale with reactivity - safely
  const getCurrentLocale = () => {
    try {
      // Check if we're in a component context
      if (nuxtApp && nuxtApp.$i18n) {
        return nuxtApp.$i18n.locale.value
      }
      return 'fr'
    } catch {
      return 'fr'
    }
  }

  // Raw data from database (with all translations)
  const rawSiteConfig = useState('rawSiteConfig', () => ({
    site_name_translations: { en: '', fr: '', ar: '' },
    site_description_translations: { en: '', fr: '', ar: '' },
    site_logo: '',
    site_logo_no_bg: '',
    site_favicon: '',
    primary_color: '59, 130, 246',
    primary_contrast_color: '255, 255, 255',
    secondary_color: '59, 130, 246',
    secondary_contrast_color: '255, 255, 255',
    body_bg: '255, 255, 255',
    text_color: '17, 24, 39',
    contact_email: '',
    contact_phone: '',
    contact_address_translations: { en: '', fr: '', ar: '' },
    social_links: {},
    floating_whatsapp: '',
    default_meta_title_translations: { en: '', fr: '', ar: '' },
    default_meta_description_translations: { en: '', fr: '', ar: '' }
  }))

  const loading = useState('siteSettingsLoading', () => false)

  // Computed settings that react to language changes
  const siteSettings = computed(() => {
    const currentLocale = getCurrentLocale()
    
    return {
      siteName: rawSiteConfig.value.site_name_translations?.[currentLocale] || rawSiteConfig.value.site_name_translations?.['fr'] || '',
      siteDescription: rawSiteConfig.value.site_description_translations?.[currentLocale] || rawSiteConfig.value.site_description_translations?.['fr'] || '',
      siteLogo: rawSiteConfig.value.site_logo || '',
      siteLogoNoBg: rawSiteConfig.value.site_logo_no_bg || '',
      siteFavicon: rawSiteConfig.value.site_favicon || '',
      primaryColor: rawSiteConfig.value.primary_color || '59, 130, 246',
      primaryContrastColor: rawSiteConfig.value.primary_contrast_color || '255, 255, 255',
      secondaryColor: rawSiteConfig.value.secondary_color || '59, 130, 246',
      secondaryContrastColor: rawSiteConfig.value.secondary_contrast_color || '255, 255, 255',
      bodyBg: rawSiteConfig.value.body_bg || '255, 255, 255',
      textColor: rawSiteConfig.value.text_color || '17, 24, 39',
      contactEmail: rawSiteConfig.value.contact_email || '',
      contactPhone: rawSiteConfig.value.contact_phone || '',
      contactAddress: rawSiteConfig.value.contact_address_translations?.[currentLocale] || rawSiteConfig.value.contact_address_translations?.['fr'] || '',
      socialLinks: rawSiteConfig.value.social_links || {},
      floatingWhatsapp: rawSiteConfig.value.floating_whatsapp || '',
      defaultMetaTitle: rawSiteConfig.value.default_meta_title_translations?.[currentLocale] || rawSiteConfig.value.default_meta_title_translations?.['fr'] || '',
      defaultMetaDescription: rawSiteConfig.value.default_meta_description_translations?.[currentLocale] || rawSiteConfig.value.default_meta_description_translations?.['fr'] || ''
    }
  })

  /**
   * Load cached settings from localStorage
   */
  const loadFromCache = () => {
    if (process.client) {
      try {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const { data, timestamp } = JSON.parse(cached)
          const now = Date.now()
          
          // Check if cache is still valid
          if (now - timestamp < CACHE_DURATION) {
            rawSiteConfig.value = data
            return true
          }
        }
      } catch (error) {
        console.error('Error loading from cache:', error)
      }
    }
    return false
  }

  /**
   * Save settings to localStorage
   */
  const saveToCache = (data: any) => {
    if (process.client) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data,
          timestamp: Date.now()
        }))
      } catch (error) {
        console.error('Error saving to cache:', error)
      }
    }
  }

  /**
   * Fetch site configuration from database with caching
   */
  const fetchSettings = async (force = false) => {
    // Try loading from cache first (if not forcing refresh)
    if (!force && loadFromCache()) {
      // Still fetch in background to update cache (stale-while-revalidate)
      fetchSettingsFromDB()
      return
    }

    loading.value = true
    await fetchSettingsFromDB()
    loading.value = false
  }

  /**
   * Fetch settings from database
   */
  const fetchSettingsFromDB = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .single()

      if (error) throw error

      if (data) {
        const settingsData = {
          site_name_translations: data.site_name_translations || { en: '', fr: '', ar: '' },
          site_description_translations: data.site_description_translations || { en: '', fr: '', ar: '' },
          site_logo: data.site_logo || '',
          site_logo_no_bg: data.site_logo_no_bg || '',
          site_favicon: data.site_favicon || '',
          primary_color: data.primary_color || '59, 130, 246',
          primary_contrast_color: data.primary_contrast_color || '255, 255, 255',
          secondary_color: data.secondary_color || '59, 130, 246',
          secondary_contrast_color: data.secondary_contrast_color || '255, 255, 255',
          body_bg: data.body_bg || '255, 255, 255',
          text_color: data.text_color || '17, 24, 39',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
          contact_address_translations: data.contact_address_translations || { en: '', fr: '', ar: '' },
          social_links: data.social_links || {},
          floating_whatsapp: data.floating_whatsapp || '',
          default_meta_title_translations: data.default_meta_title_translations || { en: '', fr: '', ar: '' },
          default_meta_description_translations: data.default_meta_description_translations || { en: '', fr: '', ar: '' }
        }

        // Update state
        rawSiteConfig.value = settingsData
        
        // Save to cache
        saveToCache(settingsData)
      }
    } catch (error) {
      console.error('Error fetching site settings:', error)
    }
  }

  /**
   * Update site configuration
   */
  const updateSettings = async (updates: any) => {
    const currentLocale = getCurrentLocale()
    loading.value = true
    
    try {
      // Get current data first
      const { data: currentData } = await supabase
        .from('site_config')
        .select('*')
        .single()

      if (!currentData) throw new Error('Site config not found')

      // Prepare update object with proper translation structure
      const updateData: any = {}

      // Handle translation fields
      if (updates.siteName !== undefined) {
        updateData.site_name_translations = {
          ...currentData.site_name_translations,
          [currentLocale]: updates.siteName
        }
      }

      if (updates.siteDescription !== undefined) {
        updateData.site_description_translations = {
          ...currentData.site_description_translations,
          [currentLocale]: updates.siteDescription
        }
      }

      // Handle non-translation fields
      const simpleFields = [
        'siteLogo', 'siteLogoNoBg', 'siteFavicon', 'primaryColor', 'primaryContrastColor',
        'secondaryColor', 'secondaryContrastColor',
        'bodyBg', 'textColor', 'contactEmail', 'contactPhone', 'socialLinks', 'floatingWhatsapp'
      ]

      simpleFields.forEach(field => {
        if (updates[field] !== undefined) {
          // Convert camelCase to snake_case for database
          const dbField = field.replace(/([A-Z])/g, '_$1').toLowerCase()
          updateData[dbField] = updates[field]
        }
      })

      const { error } = await supabase
        .from('site_config')
        .update(updateData)
        .eq('id', currentData.id)

      if (error) throw error

      // Refresh settings and clear cache
      if (process.client) {
        localStorage.removeItem(CACHE_KEY)
      }
      await fetchSettings(true)
      
      return { success: true }
    } catch (error) {
      console.error('Error updating site settings:', error)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear cache manually
   */
  const clearCache = () => {
    if (process.client) {
      localStorage.removeItem(CACHE_KEY)
    }
  }

  return {
    siteSettings,
    rawSiteConfig,
    loading,
    fetchSettings,
    updateSettings,
    clearCache
  }
}