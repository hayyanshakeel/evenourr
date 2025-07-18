// FILE: lib/shopify/queries/shop.ts

export const getShopMetafieldsQuery = /* GraphQL */ `
  query getShopMetafields($namespace: String!, $key: String!) {
    shop {
      metafield(namespace: $namespace, key: $key) {
        value
      }
    }
  }
`;