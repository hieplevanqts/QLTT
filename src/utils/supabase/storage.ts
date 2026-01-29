
import { supabase } from '@/api/supabaseClient';

/**
 * Upload a file to a Supabase storage bucket
 * @param bucket Name of the bucket (e.g., 'vhv_file')
 * @param file File object to upload
 * @param path Optional custom path (filename will be appended if it doesn't end with it)
 * @returns Object with name, path, and public URL
 */
export async function uploadFile(
  bucket: string,
  file: File,
  path?: string
): Promise<{ name: string; path: string; url: string }> {
  // Construct a unique file name/path
  const timestamp = new Date().getTime();
  const cleanFileName = file.name.replace(/[^\w.-]/g, '_');
  const fileName = `${timestamp}_${cleanFileName}`;
  
  const uploadPath = path ? `${path}/${fileName}` : fileName;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(uploadPath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return {
    name: file.name,
    path: data.path,
    url: publicUrl
  };
}

/**
 * Upload multiple files to a Supabase storage bucket
 */
export async function uploadMultipleFiles(
  bucket: string,
  files: File[],
  path?: string
): Promise<any[]> {
  const uploadPromises = files.map(file => uploadFile(bucket, file, path));
  return Promise.all(uploadPromises);
}
