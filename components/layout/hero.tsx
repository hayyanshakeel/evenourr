import { getHomepageHeroContent } from '@/lib/contentful';
import { Asset } from 'contentful';
import Image from 'next/image';
import Link from 'next/link';

export async function Hero() {
  const heroContent = await getHomepageHeroContent();

  if (!heroContent) {
    // You can return a default hero or null if no content is found
    return null;
  }

  const { title, subtitle, heroImage, buttonText, buttonLink } = heroContent.fields;
  const imageUrl = (heroImage as Asset)?.fields?.file?.url;

  return (
    <section className="relative mb-4 h-[60vh] w-full bg-cover bg-center text-white">
      {imageUrl && (
        <Image
          src={`https:${imageUrl}`}
          alt={title || 'Homepage Hero Image'}
          className="object-cover"
          fill
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-6xl">{title}</h1>
        <p className="mb-8 max-w-2xl text-lg md:text-xl">{subtitle}</p>
        {buttonText && buttonLink && (
          <Link
            href={`/product/${buttonLink}`}
            className="rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold transition hover:bg-blue-700"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}
