import { getHomepageHeroContent } from '@/lib/contentful';
import { Asset } from 'contentful';
import Image from 'next/image';

export async function Hero() {
  const heroContent = await getHomepageHeroContent();

  if (!heroContent) {
    return null;
  }

  const heroAsset = heroContent.fields.heroAsset as Asset;
  const heroText = heroContent.fields.heroText as string;
  const file = heroAsset?.fields?.file;
  const assetUrl = typeof file?.url === 'string' ? file.url : undefined;
  const assetContentType = file?.contentType as string | undefined;

  const isVideo = assetContentType?.startsWith('video');
  const isImage = assetContentType?.startsWith('image');

  return (
    <section className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-black">
      {isVideo && assetUrl ? (
        <video
          key={assetUrl}
          className="absolute left-0 top-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src={`https:${assetUrl}`}
        />
      ) : isImage && assetUrl ? (
        <Image
          src={`https:${assetUrl}`}
          alt={(heroAsset.fields.title as string) || 'Homepage hero image'}
          className="absolute left-0 top-0 h-full w-full object-cover"
          fill
          priority
        />
      ) : null}
      
      {heroText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl font-bold uppercase tracking-widest text-white md:text-6xl">
            {heroText}
          </h1>
        </div>
      )}
    </section>
  );
}