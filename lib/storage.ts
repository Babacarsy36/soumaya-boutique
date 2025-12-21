import { supabase } from './supabase';

const BUCKET_NAME = 'products';

/**
 * Upload an image to Supabase Storage
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'folder/image.jpg')
 * @returns The download URL of the uploaded file
 */
export async function uploadImage(file: File, path: string): Promise<string> {
    try {
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(path);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

/**
 * Upload an image with progress tracking (Simulated for Supabase)
 * @param file - The file to upload
 * @param path - The storage path
 * @param onProgress - Callback function that receives progress percentage (0-100)
 * @returns The download URL of the uploaded file
 */
export async function uploadImageWithProgress(
    file: File,
    path: string,
    onProgress: (progress: number) => void
): Promise<string> {
    // Supabase JS client doesn't support fine-grained upload progress easily
    onProgress(10);
    const url = await uploadImage(file, path);
    onProgress(100);
    return url;
}

/**
 * Delete an image from Supabase Storage
 * @param url - The download URL of the image to delete
 */
export async function deleteImage(url: string): Promise<void> {
    try {
        // Try to extract path from URL
        // URL format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split(`/storage/v1/object/public/${BUCKET_NAME}/`);
        
        if (pathParts.length > 1) {
            const path = decodeURIComponent(pathParts[1]);
            const { error } = await supabase.storage
                .from(BUCKET_NAME)
                .remove([path]);
            
            if (error) throw error;
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
}

/**
 * Upload multiple images
 * @param files - Array of files to upload
 * @param folderPath - The folder path in storage
 * @returns Array of download URLs
 */
export async function uploadMultipleImages(
    files: File[],
    folderPath: string
): Promise<string[]> {
    const uploadPromises = files.map((file, index) => {
        const timestamp = Date.now();
        const path = `${folderPath}/${timestamp}_${index}_${file.name}`;
        return uploadImage(file, path);
    });

    return Promise.all(uploadPromises);
}

/**
 * Upload multiple images with progress tracking
 * @param files - Array of files to upload
 * @param folderPath - The folder path in storage
 * @param onProgress - Callback function that receives (fileIndex, progress, totalFiles)
 * @returns Array of download URLs
 */
export async function uploadMultipleImagesWithProgress(
    files: File[],
    folderPath: string,
    onProgress: (fileIndex: number, progress: number, totalFiles: number) => void
): Promise<string[]> {
    const urls: string[] = [];

    // Upload files sequentially to track progress accurately
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const timestamp = Date.now();
        const path = `${folderPath}/${timestamp}_${i}_${file.name}`;

        const url = await uploadImageWithProgress(file, path, (progress) => {
            onProgress(i, progress, files.length);
        });

        urls.push(url);
    }

    return urls;
}
