// Contentful TypeScript types

export interface ContentfulImage {
  fields: {
    title: string;
    file: {
      url: string;
      details: {
        size: number;
        image: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

export interface BlogPost {
  title: string;
  slug: string;
  content: any; // Rich text content
  excerpt?: string;
  featuredImage?: ContentfulImage;
  publishDate: string;
  author?: string;
  tags?: string[];
}

export interface HeroSection {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: ContentfulImage;
  ctaText?: string;
  ctaLink?: string;
}

export interface FAQ {
  question: string;
  answer: any; // Rich text content
  category?: string;
}

export interface LandingPage {
  title: string;
  slug: string;
  heroSection?: HeroSection;
  content: any; // Rich text content
  seoTitle?: string;
  seoDescription?: string;
}

export interface ProductEnhancement {
  productHandle: string;
  additionalDescription?: any; // Rich text content
  features?: string[];
  specifications?: any; // Rich text content
  gallery?: ContentfulImage[];
}

// Generic Contentful entry type
export interface ContentfulEntry<T = any> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    contentType: {
      sys: {
        id: string;
      };
    };
  };
  fields: T;
}

// Response types for different content types
export type BlogPostEntry = ContentfulEntry<BlogPost>;
export type HeroSectionEntry = ContentfulEntry<HeroSection>;
export type FAQEntry = ContentfulEntry<FAQ>;
export type LandingPageEntry = ContentfulEntry<LandingPage>;
export type ProductEnhancementEntry = ContentfulEntry<ProductEnhancement>;
