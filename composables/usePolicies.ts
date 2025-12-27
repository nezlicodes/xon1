/**
 * Composable for managing policies
 * Provides utilities for fetching and managing policy documents
 */
export const usePolicies = () => {
  const supabase = useSupabaseClient();
  const { locale, getTranslation } = useTranslation();

  /**
   * Fetch a specific policy by type
   * @param policyType - The type of policy (e.g., 'shipping', 'return', 'privacy', 'terms')
   * @returns Policy data with translations
   */
  const fetchPolicy = async (policyType: string) => {
    try {
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .eq('policy_type', policyType)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        console.error(`Error fetching ${policyType} policy:`, error);
        return null;
      }

      return data;
    } catch (error) {
      console.error(`Error fetching ${policyType} policy:`, error);
      return null;
    }
  };

  /**
   * Fetch a specific policy by slug
   * @param slug - The URL slug of the policy
   * @returns Policy data with translations
   */
  const fetchPolicyBySlug = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error(`Error fetching policy by slug ${slug}:`, error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error(`Error fetching policy by slug ${slug}:`, error);
      return { data: null, error };
    }
  };

  /**
   * Fetch sections for a specific policy
   * @param policyId - The UUID of the policy
   * @returns Array of policy sections ordered by display_order
   */
  const fetchPolicySections = async (policyId: string) => {
    try {
      const { data, error } = await supabase
        .from('policy_sections')
        .select('*')
        .eq('policy_id', policyId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error(`Error fetching sections for policy ${policyId}:`, error);
        return { data: [], error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error(`Error fetching sections for policy ${policyId}:`, error);
      return { data: [], error };
    }
  };

 /**
  * Fetch single policy section by key
  * @param policyId - Policy UUID
  * @param sectionKey - Unique section key
  */
 const fetchPolicySectionByKey = async (policyId: string, sectionKey: string) => {
   try {
     const { data, error } = await supabase
       .from('policy_sections')
       .select('*')
       .eq('policy_id', policyId)
       .eq('section_key', sectionKey)
       .single();
     return { data, error };
   } catch (error) {
     return { data: null, error } as any;
   }
 };

  /**
   * Update a policy section
   * @param sectionId - Section UUID
   * @param updates - Fields to update
   * @returns Success status
   */
  const updatePolicySection = async (sectionId: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('policy_sections')
        .update(updates)
        .eq('id', sectionId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating policy section:', error);
      return { success: false, error };
    }
  };

  /**
   * Create a new policy section
   * @param sectionData - Section data
   * @returns Created section
   */
  const createPolicySection = async (sectionData: any) => {
    try {
      const { data, error } = await supabase
        .from('policy_sections')
        .insert(sectionData)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating policy section:', error);
      return { success: false, error };
    }
  };

  /**
   * Delete a policy section
   * @param sectionId - Section UUID
   * @returns Success status
   */
  const deletePolicySection = async (sectionId: string) => {
    try {
      const { error } = await supabase
        .from('policy_sections')
        .delete()
        .eq('id', sectionId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting policy section:', error);
      return { success: false, error };
    }
  };

  /**
   * Fetch all active policies
   * @returns Array of all active policies
   */
  const fetchAllPolicies = async () => {
    try {
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .eq('is_active', true)
        .order('policy_type', { ascending: true });

      if (error) {
        console.error('Error fetching policies:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching policies:', error);
      return [];
    }
  };

  /**
   * Create or update a policy
   * @param policyType - The type of policy
   * @param titleTranslations - Title translations object
   * @param contentTranslations - Content translations object
   * @param slug - URL slug for the policy
   * @param isActive - Whether the policy is active
   * @returns Success status and created/updated policy
   */
  const upsertPolicy = async (
    policyType: string,
    titleTranslations: Record<string, string>,
    contentTranslations: Record<string, string>,
    slug: string,
    isActive: boolean = true
  ) => {
    try {
      // Check if policy already exists
      const { data: existing } = await supabase
        .from('policies')
        .select('id')
        .eq('policy_type', policyType)
        .single();

      const policyData = {
        policy_type: policyType,
        title_translations: titleTranslations,
        content_translations: contentTranslations,
        slug,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      };

      if (existing) {
        // Update existing policy
        const { data, error } = await supabase
          .from('policies')
          .update(policyData)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return { success: true, data };
      } else {
        // Create new policy
        const { data, error } = await supabase
          .from('policies')
          .insert(policyData)
          .select()
          .single();

        if (error) throw error;
        return { success: true, data };
      }
    } catch (error) {
      console.error('Error upserting policy:', error);
      return { success: false, error };
    }
  };

  /**
   * Delete a policy
   * @param policyType - The type of policy to delete
   * @returns Success status
   */
  const deletePolicy = async (policyType: string) => {
    try {
      const { error } = await supabase
        .from('policies')
        .delete()
        .eq('policy_type', policyType);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting policy:', error);
      return { success: false, error };
    }
  };

  /**
   * Get translated title for a policy
   * @param policy - Policy object with title_translations
   * @param fallback - Fallback title if translation not found
   * @returns Translated title
   */
  const getPolicyTitle = (policy: any, fallback: string = '') => {
    if (!policy?.title_translations) return fallback;
    return getTranslation(policy.title_translations, fallback);
  };

  /**
   * Get translated content for a policy
   * @param policy - Policy object with content_translations
   * @param fallback - Fallback content if translation not found
   * @returns Translated content
   */
  const getPolicyContent = (policy: any, fallback: string = '') => {
    if (!policy?.content_translations) return fallback;
    return getTranslation(policy.content_translations, fallback);
  };

  return {
    fetchPolicy,
    fetchPolicyBySlug,
    fetchAllPolicies,
    fetchPolicySections,
    fetchPolicySectionByKey,
    upsertPolicy,
    updatePolicySection,
    createPolicySection,
    deletePolicySection,
    deletePolicy,
    getPolicyTitle,
    getPolicyContent,
    getTranslation,
  };
};
