// Handle video upload
const handleVideoUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  uploadError.value = null
  uploadingMedia.value = true

  try {
    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      throw new Error('La vidéo doit faire moins de 50 Mo')
    }

    // Check file type
    if (!file.type.startsWith('video/')) {
      throw new Error('Seuls les fichiers vidéo sont acceptés')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `hero-${Date.now()}.${fileExt}`
    const filePath = `hero/${fileName}`

    // Delete old video if exists
    const oldVideo = getCurrentContent().background_video
    if (oldVideo && oldVideo.includes('supabase')) {
      const oldFileName = oldVideo.split('/').pop()
      if (oldFileName) {
        await supabase.storage.from('site').remove([`hero/${oldFileName}`])
      }
    }

    // Upload new file
    const { error: uploadError } = await supabase.storage
      .from('site')
      .upload(filePath, file, {
        upsert: true,
        cacheControl: '3600',
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('site')
      .getPublicUrl(filePath)

    console.log('🎥 Video uploaded to:', publicUrl)
    console.log('📝 Current language:', editorLanguage.value)
    console.log('📦 Before update:', JSON.parse(JSON.stringify(heroData.value.content_translations)))

    // Update content
    if (!heroData.value.content_translations[editorLanguage.value]) {
      heroData.value.content_translations[editorLanguage.value] = {}
    }
    heroData.value.content_translations[editorLanguage.value].background_video = publicUrl
    
    // Clear image when video is uploaded
    heroData.value.content_translations[editorLanguage.value].background_image = ''
    
    console.log('📦 After update:', JSON.parse(JSON.stringify(heroData.value.content_translations)))
    console.log('💾 Calling saveHeroData...')
    
    await saveHeroData()
    
    console.log('✅ Video save complete!')
  } catch (error) {
    console.error('❌ Upload error:', error)
    uploadError.value = error.message || 'Erreur lors du téléchargement de la vidéo'
  } finally {
    uploadingMedia.value = false
    event.target.value = ''
  }
}
