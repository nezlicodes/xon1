/**
 * Composable for handling media uploads to Supabase Storage
 */
export const useMediaUpload = () => {
  const supabase = useSupabaseClient();
  const config = useRuntimeConfig();

  /**
   * Upload a file to Supabase Storage
   * @param file - File to upload
   * @param folder - Folder path (e.g., 'policies', 'products')
   * @returns Object with success status, URL, and error
   */
  const uploadFile = async (file: File, folder: string = 'policies', bucket: string = 'site') => {
    try {
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 10MB');
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only images are allowed (JPEG, PNG, GIF, WebP, SVG)');
      }

      // Generate unique filename with extension based on MIME type
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const mimeToExt: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'image/svg+xml': 'svg'
      };
      const inferredExt = mimeToExt[file.type] || (file.name.split('.').pop() || 'bin');
      const fileName = `${timestamp}-${randomString}.${inferredExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket) // bucket name provided by caller
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return {
        success: true,
        url: urlData.publicUrl,
        path: filePath,
        error: null
      };
    } catch (error: any) {
      console.error('Upload error:', error);
      return {
        success: false,
        url: null,
        path: null,
        error: error.message || 'Failed to upload file'
      };
    }
  };

  /**
   * Upload multiple files
   * @param files - Array of files to upload
   * @param folder - Folder path
   * @returns Array of upload results
   */
  const uploadMultiple = async (files: File[], folder: string = 'policies') => {
    const results = await Promise.all(
      files.map(file => uploadFile(file, folder))
    );
    return results;
  };

  /**
   * Delete a file from Supabase Storage
   * @param path - File path to delete
   * @returns Success status
   */
  const deleteFile = async (path: string) => {
    try {
      const { error } = await supabase.storage
        .from('site')
        .remove([path]);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Get file URL from path
   * @param path - File path in storage
   * @returns Public URL
   */
  const getFileUrl = (path: string) => {
    const { data } = supabase.storage
      .from('site')
      .getPublicUrl(path);
    return data.publicUrl;
  };

  /**
   * Compress image before upload (client-side)
   * @param file - Image file
   * @param maxWidth - Maximum width
   * @param quality - JPEG quality (0-1)
   * @returns Compressed file
   */
  const compressImage = async (file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> => {
    // Only attempt compression for raster images we can safely process
    const compressibleTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!compressibleTypes.includes(file.type)) {
      return file; // Skip compression for GIF, SVG, etc.
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Choose output MIME: keep original where possible to avoid surprises
          let outputType = 'image/jpeg';
          if (file.type === 'image/png') outputType = 'image/png';
          else if (file.type === 'image/webp') outputType = 'image/webp';
          else outputType = 'image/jpeg'; // jpg/jpeg

          // Note: quality is used by JPEG/WEBP; PNG ignores quality but resizing still helps
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              const nameWithoutExt = file.name.replace(/\.[^.]+$/, '');
              const extMap: Record<string, string> = { 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
              const newExt = extMap[outputType] || 'jpg';
              const compressedFile = new File([blob], `${nameWithoutExt}.${newExt}`, {
                type: outputType,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            },
            outputType,
            quality
          );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  return {
    uploadFile,
    uploadMultiple,
    deleteFile,
    getFileUrl,
    compressImage
  };
};
