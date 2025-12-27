/**
 * Composable for translation helpers
 * Provides utilities for working with i18n in the application
 */
export const useTranslation = () => {
  const { locale, t } = useI18n();

  /**
   * Check if current locale is RTL
   */
  const isRtl = computed(() => locale.value === 'ar');

  /**
   * Get text direction for current locale
   */
  const direction = computed(() => (isRtl.value ? 'rtl' : 'ltr'));

  /**
   * Get translated value from JSONB field
   * Falls back to French if translation not available
   */
  const getTranslation = (
    translations: Record<string, string> | null | undefined,
    fallback: string = ''
  ): string => {
    if (!translations) return fallback;
    return translations[locale.value] || translations['fr'] || translations['en'] || fallback;
  };

  /**
   * Format currency according to locale
   */
  const formatCurrency = (amount: number, currency: string = 'DZD'): string => {
    if (!process.client) return `${amount} ${currency}`;
    
    try {
      return new Intl.NumberFormat(locale.value === 'ar' ? 'ar-DZ' : 'fr-DZ', {
        style: 'currency',
        currency: currency,
      }).format(amount);
    } catch (error) {
      return `${amount} ${currency}`;
    }
  };

  /**
   * Format date according to locale
   */
  const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    if (!process.client) return String(date);
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    };

    try {
      return new Intl.DateTimeFormat(
        locale.value === 'ar' ? 'ar-DZ' : locale.value === 'en' ? 'en-US' : 'fr-DZ',
        defaultOptions
      ).format(dateObj);
    } catch (error) {
      return String(date);
    }
  };

  /**
   * Get appropriate alignment class for current locale
   */
  const alignmentClass = computed(() => (isRtl.value ? 'text-right' : 'text-left'));

  /**
   * Get appropriate margin class for start (left in LTR, right in RTL)
   */
  const marginStartClass = (size: string = '4') => `ms-${size}`;

  /**
   * Get appropriate margin class for end (right in LTR, left in RTL)
   */
  const marginEndClass = (size: string = '4') => `me-${size}`;

  /**
   * Get appropriate padding class for start
   */
  const paddingStartClass = (size: string = '4') => `ps-${size}`;

  /**
   * Get appropriate padding class for end
   */
  const paddingEndClass = (size: string = '4') => `pe-${size}`;

  return {
    locale,
    isRtl,
    direction,
    t,
    getTranslation,
    formatCurrency,
    formatDate,
    alignmentClass,
    marginStartClass,
    marginEndClass,
    paddingStartClass,
    paddingEndClass,
  };
};