// lib/shopify/queries/localization.ts

export const getLocalizationQuery = /* GraphQL */ `
  query getLocalization {
    localization {
      availableCountries {
        isoCode
        name
        currency {
          isoCode
        }
      }
    }
  }
`;
