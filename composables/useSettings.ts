export const useSettings = () => {
  const config = useRuntimeConfig();
  const user = config.public.user;
  const settings = ref(null)
  const supabase = useSupabaseClient()

  const fetchSettings = async () => {
    let siteSettings;
    return;
  }

  return {
    settings,
    fetchSettings
  }
}