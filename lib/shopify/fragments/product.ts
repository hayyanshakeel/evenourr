// FILE: lib/shopify/fragments/product.ts

import { imageFragment } from './image';
import { seoFragment } from './seo';

export const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          # FIX: Add the image for each variant to the query
          image {
            ...image
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    collections(first: 1) {
      edges {
        node {
          handle
        }
      }
    }
    seo {
      ...seo
    }
    tags
  }
  ${imageFragment}
  ${seoFragment}
`;