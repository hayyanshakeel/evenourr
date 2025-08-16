import { CmsBlock, CmsBlockType } from '@/lib/cms/schema';

export function generateBlockId(type: CmsBlockType): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getDefaultProps(type: CmsBlockType): Record<string, any> {
  switch (type) {
    case 'hero':
      return {
        title: 'Your Hero Title',
        subtitle: 'A compelling subtitle that draws users in',
        cta: 'Get Started',
        ctaLink: '#'
      };
    case 'headerSearch':
      return {
        placeholder: 'Search products...',
        showLogo: true
      };
    case 'products':
      return {
        title: 'Featured Products',
        collection: 'featured',
        limit: 8,
        showPrice: true
      };
    case 'horizontalProducts':
      return {
        title: 'New Arrivals',
        collection: 'new-arrivals',
        limit: 6
      };
    case 'category':
      return {
        layout: 'grid',
        showImages: true
      };
    case 'banner':
      return {
        title: 'Special Offer',
        subtitle: 'Limited time only',
        height: 'medium',
        link: '#'
      };
    case 'text':
      return {
        content: '<p>Add your text content here...</p>',
        alignment: 'left',
        size: 'medium'
      };
    case 'divider':
      return {
        style: 'solid',
        color: '#e5e7eb'
      };
    case 'spacer':
      return {
        height: 'medium'
      };
    case 'html':
      return {
        html: '<div><p>Custom HTML content</p></div>'
      };
    default:
      return {};
  }
}

export function createBlock(type: CmsBlockType, customProps: Record<string, any> = {}): CmsBlock {
  return {
    id: generateBlockId(type),
    type,
    props: { ...getDefaultProps(type), ...customProps }
  };
}
