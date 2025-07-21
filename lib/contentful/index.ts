import { createClient, type Asset, type Entry, type EntryFieldTypes } from 'contentful';

export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// CORRECT: Interface for a hero with a single asset (video or image)
export interface HomepageHero {
  contentTypeId: "homepageHero",
  fields: {
    heroAsset: EntryFieldTypes.AssetLink,
  }
}

// CORRECT: Interface for a promo section with a single unisex link
export interface PromoSection {
  contentTypeId: "promoSection",
  fields: {
    title: EntryFieldTypes.Text,
    image: EntryFieldTypes.AssetLink,
    shopLink: EntryFieldTypes.Text,
    order: EntryFieldTypes.Number,
  }
}

// CORRECT: Fetches the hero content
export async function getHomepageHeroContent() {
  try {
    const entries = await contentfulClient.getEntries<HomepageHero>({
      content_type: 'homepageHero',
      limit: 1
    });
    return entries.items[0] || null;
  } catch (error) {
    console.error('Error fetching homepage hero content:', error);
    return null;
  }
}

// CORRECT: Fetches the promo sections
export async function getHomepagePromoSections() {
  try {
    const entries = await contentfulClient.getEntries<PromoSection>({
      content_type: 'promoSection',
      order: ['fields.order']
    });
    return entries.items || [];
  } catch (error) {
    console.error('Error fetching homepage promo sections:', error);
    return [];
  }
}

// --- No changes needed below this line ---

// Function to get active coupons
export async function getActiveCoupons() {
  try {
    const entries = await contentfulClient.getEntries<Coupon>({
      content_type: 'coupon',
      'fields.expiryDate[gte]': new Date().toISOString() as any
    });
    return entries.items;
  } catch (error) {
    console.error('Error fetching active coupons:', error);
    return [];
  }
}

// Interface for Coupon content type
export interface Coupon {
  contentTypeId: "coupon",
  fields: {
    title: EntryFieldTypes.Text,
    couponCode: EntryFieldTypes.Text,
    description: EntryFieldTypes.Text,
    discountValue: EntryFieldTypes.Number,
    discountType: EntryFieldTypes.Text,
    expiryDate: EntryFieldTypes.Date,
  }
}