import { supabase } from '../supabaseClient';

/**
 * Upload a file to Supabase Storage
 * 
 * @param file - The file to upload
 * @param bucket - The storage bucket name (e.g., 'licenses', 'evidence')
 * @param path - The path inside the bucket (e.g., 'merchants/uuid/filename.jpg')
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(
    file: File,
    bucket: string = 'licenses',
    path?: string
): Promise<string> {
    try {
        // Generate a clean filename if path is not provided
        const fileExt = file.name.split('.').pop();
        const fileName = path || `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;

        console.log(`📤 Uploading file to bucket: ${bucket}, path: ${fileName}`);

        const { error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (error) {
            console.error('❌ Supabase storage upload error:', error);
            throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        console.log('✅ File uploaded successfully. Public URL:', publicUrl);
        return publicUrl;
    } catch (error) {
        console.error('❌ Error in uploadFile:', error);
        throw error;
    }
}
