import { createClient, type Asset, type EntryFieldTypes } from 'contentful';

export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// Interface for our Homepage content type
export interface HomepageHero {
  contentTypeId: "homepageHero",
  fields: {
    title: EntryFieldTypes.Text,
    subtitle: EntryFieldTypes.Text,
    heroImage: EntryFieldTypes.AssetLink,
    buttonText: EntryFieldTypes.Text,
    buttonLink: EntryFieldTypes.Text, // This will be a product handle
  }
}

// Interface for our Coupon content type
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

// Function to get the homepage hero content
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
