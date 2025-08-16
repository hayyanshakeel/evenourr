export type CmsDevice = 'mobile' | 'desktop' | 'responsive';

export type CmsBlockType =
  | 'hero'
  | 'headerSearch'
  | 'header'
  | 'footer'
  | 'products'
  | 'horizontalProducts'
  | 'category'
  | 'carousel'
  | 'banner'
  | 'bannerImage'
  | 'divider'
  | 'spacer'
  | 'text'
  | 'html'
  | 'background'
  | 'blogs'
  | 'dynamicBlog'
  | 'button'
  | 'instagramStory'
  | 'listCard'
  | 'logo'
  | 'menuList'
  | 'story'
  | 'testimonial'
  | 'testimonialSlider'
  | 'webEmbed'
  | 'animatedStack'
  | 'headerView';

export interface CmsBlock<TProps = Record<string, unknown>> {
  id: string;
  type: CmsBlockType;
  props: TProps;
}

export interface CmsLayoutData {
  version: number;
  blocks: CmsBlock[];
}

export interface CmsLayoutDTO {
  id?: number;
  name: string;
  slug: string;
  device: CmsDevice;
  data: CmsLayoutData;
  published?: boolean;
}

export const DEFAULT_LAYOUT: CmsLayoutData = {
  version: 1,
  blocks: [
    {
      id: 'header-1',
      type: 'headerSearch',
      props: {
        placeholder: 'Search our products...',
        showLogo: true
      }
    },
    {
      id: 'hero-1',
      type: 'hero',
      props: {
        title: 'Welcome to Our Amazing Store',
        subtitle: 'Discover incredible products at unbeatable prices',
        cta: 'Shop Now',
        ctaLink: '/search'
      }
    },
    {
      id: 'categories-1',
      type: 'category',
      props: {
        layout: 'grid',
        showImages: true
      }
    },
    {
      id: 'featured-products-1',
      type: 'products',
      props: {
        title: 'Featured Products',
        collection: 'featured',
        limit: 8,
        showPrice: true
      }
    },
    {
      id: 'banner-1',
      type: 'banner',
      props: {
        title: 'Summer Sale',
        subtitle: 'Up to 50% off on selected items',
        height: 'large',
        link: '/sale'
      }
    },
    {
      id: 'new-arrivals-1',
      type: 'horizontalProducts',
      props: {
        title: 'New Arrivals',
        collection: 'new-arrivals',
        limit: 6
      }
    }
  ],
};


