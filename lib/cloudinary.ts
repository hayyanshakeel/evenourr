// lib/cloudinary.ts

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadToCloudinary(file: File): Promise<string | null> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const results = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    tags: ['nextjs-server-actions-upload-sneakers'],
                    folder: 'jsevenour'
                },
                function (error, result) {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(result);
                }
            ).end(buffer);
        });

        // The result type needs to be asserted to access its properties
        const uploadResult = results as { secure_url: string };
        return uploadResult.secure_url;

    } catch (error) {
        console.error('Cloudinary upload failed:', error);
        return null;
    }
}