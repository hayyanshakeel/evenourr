import { getHomepageHeroContent } from '@/lib/contentful';
import { Asset } from 'contentful';

export async function Hero() {
  const heroContent = await getHomepageHeroContent();

  if (!heroContent) {
    return null;
  }

  const heroAsset = heroContent.fields.heroAsset as Asset;
  
  // Safely access nested properties
  const file = heroAsset?.fields?.file;
  const assetUrl = typeof file?.url === 'string' ? file.url : undefined;
  const assetContentType = file?.contentType;

  const isVideo = typeof assetContentType === 'string' && assetContentType.startsWith('video');

  return (
    <section className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-black">
      {isVideo && assetUrl ? (
        <video
          key={assetUrl} // Now assetUrl is guaranteed to be a string when used
          className="absolute left-0 top-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src={`https:${assetUrl}`}
        />
      ) : null}
    </section>
  );
}