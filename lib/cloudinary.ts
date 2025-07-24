import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary
 * @param file - The File object (from form data)
 * @returns The secure URL of the uploaded image
 */
export async function uploadToCloudinary(file: File): Promise<string | null> {
  try {
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'jsevenour',
          resource_type: 'image', // Make sure it's set to 'image'
          public_id: `${Date.now()}-${file.name}` // Unique name for each upload
        },
        (error, result) => {
          if (error || !result) {
            console.error('Cloudinary upload error:', error);
            reject(error);
            return;
          }

          resolve(result.secure_url); // Return the secure URL
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    return null;
  }
}