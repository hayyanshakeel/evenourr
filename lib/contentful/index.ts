import { createClient, type Asset, type Entry, type EntryFieldTypes } from 'contentful';

export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// FINAL INTERFACE FOR HERO
export interface HomepageHero {
  contentTypeId: "homepageHero",
  fields: {
    heroAsset: EntryFieldTypes.AssetLink,
    heroText: EntryFieldTypes.Text,
  }
}

// FINAL INTERFACE FOR PROMO SECTION
export interface PromoSection {
  contentTypeId: "promoSection",
  fields: {
    title: EntryFieldTypes.Text,
    image: EntryFieldTypes.AssetLink,
    shopLink: EntryFieldTypes.Text, // This should be the only link field
    order: EntryFieldTypes.Number,
  }
}

// Fetches the hero content
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

// Fetches the promo sections
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