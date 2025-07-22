import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadImage(fileUri: string) {
  const res = await cloudinary.uploader.upload(fileUri, {
    folder: 'eveeeee/products',
  });
  return { publicId: res.public_id, url: res.secure_url };
}

export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}