module.exports = {

"[project]/lib/constants.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "DEFAULT_OPTION": (()=>DEFAULT_OPTION),
    "HIDDEN_PRODUCT_TAG": (()=>HIDDEN_PRODUCT_TAG),
    "SHOPIFY_GRAPHQL_API_ENDPOINT": (()=>SHOPIFY_GRAPHQL_API_ENDPOINT),
    "TAGS": (()=>TAGS),
    "defaultSort": (()=>defaultSort),
    "sorting": (()=>sorting)
});
const defaultSort = {
    title: 'Relevance',
    slug: null,
    sortKey: 'RELEVANCE',
    reverse: false
};
const sorting = [
    defaultSort,
    {
        title: 'Trending',
        slug: 'trending-desc',
        sortKey: 'BEST_SELLING',
        reverse: false
    },
    {
        title: 'Latest arrivals',
        slug: 'latest-desc',
        sortKey: 'CREATED_AT',
        reverse: true
    },
    {
        title: 'Price: Low to high',
        slug: 'price-asc',
        sortKey: 'PRICE',
        reverse: false
    },
    {
        title: 'Price: High to low',
        slug: 'price-desc',
        sortKey: 'PRICE',
        reverse: true
    }
];
const TAGS = {
    collections: 'collections',
    products: 'products',
    cart: 'cart'
};
const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';
const DEFAULT_OPTION = 'Default Title';
const SHOPIFY_GRAPHQL_API_ENDPOINT = '/api/2023-01/graphql.json';
}}),
"[externals]/next/dist/server/app-render/clean-async-snapshot.external.js [external] (next/dist/server/app-render/clean-async-snapshot.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/clean-async-snapshot.external.js", () => require("next/dist/server/app-render/clean-async-snapshot.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}}),
"[project]/lib/type-guards.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "isObject": (()=>isObject),
    "isShopifyError": (()=>isShopifyError)
});
const isObject = (object)=>{
    return typeof object === 'object' && object !== null && !Array.isArray(object);
};
const isShopifyError = (error)=>{
    if (!isObject(error)) return false;
    if (error instanceof Error) return true;
    return findError(error);
};
function findError(error) {
    if (Object.prototype.toString.call(error) === '[object Error]') {
        return true;
    }
    const prototype = Object.getPrototypeOf(error);
    return prototype === null ? false : findError(prototype);
}
}}),
"[project]/lib/utils.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "baseUrl": (()=>baseUrl),
    "createUrl": (()=>createUrl),
    "ensureStartsWith": (()=>ensureStartsWith),
    "validateEnvironmentVariables": (()=>validateEnvironmentVariables)
});
const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000';
const createUrl = (pathname, params)=>{
    const paramsString = params.toString();
    const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;
    return `${pathname}${queryString}`;
};
const ensureStartsWith = (stringToCheck, startsWith)=>stringToCheck.startsWith(startsWith) ? stringToCheck : `${startsWith}${stringToCheck}`;
const validateEnvironmentVariables = ()=>{
    const requiredEnvironmentVariables = [
        'SHOPIFY_STORE_DOMAIN',
        'SHOPIFY_STOREFRONT_ACCESS_TOKEN'
    ];
    const missingEnvironmentVariables = [];
    requiredEnvironmentVariables.forEach((envVar)=>{
        if (!process.env[envVar]) {
            missingEnvironmentVariables.push(envVar);
        }
    });
    if (missingEnvironmentVariables.length) {
        throw new Error(`The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/shopify#configure-environment-variables\n\n${missingEnvironmentVariables.join('\n')}\n`);
    }
    if (process.env.SHOPIFY_STORE_DOMAIN?.includes('[') || process.env.SHOPIFY_STORE_DOMAIN?.includes(']')) {
        throw new Error('Your `SHOPIFY_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them.');
    }
};
}}),
"[project]/lib/shopify/fragments/image.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
const imageFragment = /* GraphQL */ `
  fragment image on Image {
    url
    altText
    width
    height
  }
`;
const __TURBOPACK__default__export__ = imageFragment;
}}),
"[project]/lib/shopify/fragments/seo.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
const seoFragment = /* GraphQL */ `
  fragment seo on SEO {
    description
    title
  }
`;
const __TURBOPACK__default__export__ = seoFragment;
}}),
"[project]/lib/shopify/fragments/product.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$image$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/shopify/fragments/image.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$seo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/shopify/fragments/seo.ts [app-rsc] (ecmascript)");
;
;
const productFragment = /* GraphQL */ `
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
    seo {
      ...seo
    }
    tags
    updatedAt
    details: metafield(namespace: "custom", key: "details") {
      value
    }
    shipping: metafield(namespace: "custom", key: "shipping") {
      value
    }
  }
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$image$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$seo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}
`;
const __TURBOPACK__default__export__ = productFragment;
}}),
"[project]/lib/shopify/fragments/cart.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$product$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/shopify/fragments/product.ts [app-rsc] (ecmascript)");
;
const cartFragment = /* GraphQL */ `
  fragment cart on Cart {
    id
    checkoutUrl
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              product {
                ...product
              }
            }
          }
        }
      }
    }
    totalQuantity
  }
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$product$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}
`;
const __TURBOPACK__default__export__ = cartFragment;
}}),
"[project]/lib/shopify/mutations/cart.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "addToCartMutation": (()=>addToCartMutation),
    "createCartMutation": (()=>createCartMutation),
    "editCartItemsMutation": (()=>editCartItemsMutation),
    "removeFromCartMutation": (()=>removeFromCartMutation)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$cart$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/shopify/fragments/cart.ts [app-rsc] (ecmascript)");
;
const addToCartMutation = /* GraphQL */ `
  mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...cart
      }
    }
  }
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$cart$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}
`;
const createCartMutation = /* GraphQL */ `
  mutation createCart($lineItems: [CartLineInput!]) {
    cartCreate(input: { lines: $lineItems }) {
      cart {
        ...cart
      }
    }
  }
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$cart$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}
`;
const editCartItemsMutation = /* GraphQL */ `
  mutation editCartItems($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...cart
      }
    }
  }
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$cart$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}
`;
const removeFromCartMutation = /* GraphQL */ `
  mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...cart
      }
    }
  }
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$cart$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}
`;
}}),
"[project]/lib/shopify/queries/cart.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getCartQuery": (()=>getCartQuery)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$cart$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/shopify/fragments/cart.ts [app-rsc] (ecmascript)");
;
const getCartQuery = /* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...cart
    }
  }
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$cart$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}
`;
}}),
"[project]/lib/shopify/queries/collection.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getCollectionProductsQuery": (()=>getCollectionProductsQuery),
    "getCollectionQuery": (()=>getCollectionQuery),
    "getCollectionsQuery": (()=>getCollectionsQuery)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$product$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/shopify/fragments/product.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$seo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/shopify/fragments/seo.ts [app-rsc] (ecmascript)");
;
;
const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    handle
    title
    description
    seo {
      ...seo
    }
    updatedAt
  }
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$seo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}
`;
const getCollectionQuery = /* GraphQL */ `
  query getCollection($handle: String!) {
    collection(handle: $handle) {
      ...collection
    }
  }
  ${collectionFragment}
`;
const getCollectionsQuery = /* GraphQL */ `
  query getCollections {
    collections(first: 100, sortKey: TITLE) {
      edges {
        node {
          ...collection
        }
      }
    }
  }
  ${collectionFragment}
`;
const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      products(sortKey: $sortKey, reverse: $reverse, first: 100) {
        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$product$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}
`;
}}),
"[project]/lib/shopify/queries/menu.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getMenuQuery": (()=>getMenuQuery)
});
const getMenuQuery = /* GraphQL */ `
  query getMenu($handle: String!) {
    menu(handle: $handle) {
      items {
        title
        url
      }
    }
  }
`;
}}),
"[project]/lib/shopify/queries/page.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getPageQuery": (()=>getPageQuery),
    "getPagesQuery": (()=>getPagesQuery)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$seo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/shopify/fragments/seo.ts [app-rsc] (ecmascript)");
;
const pageFragment = /* GraphQL */ `
  fragment page on Page {
    ... on Page {
      id
      title
      handle
      body
      bodySummary
      seo {
        ...seo
      }
      createdAt
      updatedAt
    }
  }
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$seo$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}
`;
const getPageQuery = /* GraphQL */ `
  query getPage($handle: String!) {
    pageByHandle(handle: $handle) {
      ...page
    }
  }
  ${pageFragment}
`;
const getPagesQuery = /* GraphQL */ `
  query getPages {
    pages(first: 100) {
      edges {
        node {
          ...page
        }
      }
    }
  }
  ${pageFragment}
`;
}}),
"[project]/lib/shopify/queries/product.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getProductQuery": (()=>getProductQuery),
    "getProductRecommendationsQuery": (()=>getProductRecommendationsQuery),
    "getProductsQuery": (()=>getProductsQuery)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$product$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/shopify/fragments/product.ts [app-rsc] (ecmascript)");
;
const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...product
    }
  }
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$product$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}
`;
const getProductsQuery = /* GraphQL */ `
  query getProducts($sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(sortKey: $sortKey, reverse: $reverse, query: $query, first: 100) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$product$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}
`;
const getProductRecommendationsQuery = /* GraphQL */ `
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...product
    }
  }
  ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$fragments$2f$product$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]}
`;
}}),
"[project]/lib/shopify/index.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"80706778df43ed3f012fc66df89855d5f434a561e3":"$$RSC_SERVER_CACHE_2","c009aecab8e0b4c29eb54a366eaeb0211ff6baef59":"$$RSC_SERVER_CACHE_1","c0898d7588d469477bff18d305943dd768d2b4681b":"$$RSC_SERVER_CACHE_3","c08f1ff71fcfcee51346fac3d0254bfdb24c98dbe9":"$$RSC_SERVER_CACHE_4","c0bd8e92288cd14eaf312ac2e9bdb514c83e7d97c0":"$$RSC_SERVER_CACHE_0","c0d55552321ce1658bab7229e59e9c7bf30763b4b1":"$$RSC_SERVER_CACHE_6","c0f81a7e0b54bfb4a858201be0abb30040bca7df32":"$$RSC_SERVER_CACHE_5"},"",""] */ __turbopack_context__.s({
    "$$RSC_SERVER_CACHE_0": (()=>$$RSC_SERVER_CACHE_0),
    "$$RSC_SERVER_CACHE_1": (()=>$$RSC_SERVER_CACHE_1),
    "$$RSC_SERVER_CACHE_2": (()=>$$RSC_SERVER_CACHE_2),
    "$$RSC_SERVER_CACHE_3": (()=>$$RSC_SERVER_CACHE_3),
    "$$RSC_SERVER_CACHE_4": (()=>$$RSC_SERVER_CACHE_4),
    "$$RSC_SERVER_CACHE_5": (()=>$$RSC_SERVER_CACHE_5),
    "$$RSC_SERVER_CACHE_6": (()=>$$RSC_SERVER_CACHE_6),
    "addToCart": (()=>addToCart),
    "createCart": (()=>createCart),
    "getCart": (()=>getCart),
    "getCollection": (()=>getCollection),
    "getCollectionProducts": (()=>getCollectionProducts),
    "getCollections": (()=>getCollections),
    "getMenu": (()=>getMenu),
    "getPage": (()=>getPage),
    "getPages": (()=>getPages),
    "getProduct": (()=>getProduct),
    "getProductRecommendations": (()=>getProductRecommendations),
    "getProducts": (()=>getProducts),
    "removeFromCart": (()=>removeFromCart),
    "revalidate": (()=>revalidate),
    "shopifyFetch": (()=>shopifyFetch),
    "updateCart": (()=>updateCart)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$cache$2d$wrapper$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/cache-wrapper.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$type$2d$guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/type-guards.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$mutations$2f$cart$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/shopify/mutations/cart.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$queries$2f$cart$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/shopify/queries/cart.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$queries$2f$collection$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/shopify/queries/collection.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$queries$2f$menu$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/shopify/queries/menu.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$queries$2f$page$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/shopify/queries/page.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$queries$2f$product$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/shopify/queries/product.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const domain = process.env.SHOPIFY_STORE_DOMAIN ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureStartsWith"])(process.env.SHOPIFY_STORE_DOMAIN, 'https://') : '';
const endpoint = `${domain}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SHOPIFY_GRAPHQL_API_ENDPOINT"]}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
async function shopifyFetch({ headers, query, variables }) {
    try {
        const result = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': key,
                ...headers
            },
            body: JSON.stringify({
                ...query && {
                    query
                },
                ...variables && {
                    variables
                }
            })
        });
        const body = await result.json();
        if (body.errors) {
            throw body.errors[0];
        }
        return {
            status: result.status,
            body
        };
    } catch (e) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$type$2d$guards$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isShopifyError"])(e)) {
            throw {
                cause: e.cause?.toString() || 'unknown',
                status: e.status || 500,
                message: e.message,
                query
            };
        }
        throw {
            error: e,
            query
        };
    }
}
const removeEdgesAndNodes = (array)=>{
    return array.edges.map((edge)=>edge?.node);
};
const reshapeCart = (cart)=>{
    if (!cart.cost?.totalTaxAmount) {
        cart.cost.totalTaxAmount = {
            amount: '0.0',
            currencyCode: cart.cost.totalAmount.currencyCode
        };
    }
    return {
        ...cart,
        lines: removeEdgesAndNodes(cart.lines)
    };
};
const reshapeCollection = (collection)=>{
    if (!collection) {
        return undefined;
    }
    return {
        ...collection,
        path: `/search/${collection.handle}`
    };
};
const reshapeCollections = (collections)=>{
    const reshapedCollections = [];
    for (const collection of collections){
        if (collection) {
            const reshapedCollection = reshapeCollection(collection);
            if (reshapedCollection) {
                reshapedCollections.push(reshapedCollection);
            }
        }
    }
    return reshapedCollections;
};
const reshapeImages = (images, productTitle)=>{
    const flattened = removeEdgesAndNodes(images);
    return flattened.map((image)=>{
        const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
        return {
            ...image,
            altText: image.altText || `${productTitle} - ${filename}`
        };
    });
};
const reshapeProduct = (product, filterHiddenProducts = true)=>{
    if (!product || filterHiddenProducts && product.tags.includes(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["HIDDEN_PRODUCT_TAG"])) {
        return undefined;
    }
    const { images, variants, ...rest } = product;
    return {
        ...rest,
        images: reshapeImages(images, product.title),
        variants: removeEdgesAndNodes(variants)
    };
};
const reshapeProducts = (products)=>{
    const reshapedProducts = [];
    for (const product of products){
        if (product) {
            const reshapedProduct = reshapeProduct(product);
            if (reshapedProduct) {
                reshapedProducts.push(reshapedProduct);
            }
        }
    }
    return reshapedProducts;
};
async function createCart() {
    const res = await shopifyFetch({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$mutations$2f$cart$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createCartMutation"]
    });
    return reshapeCart(res.body.data.cartCreate.cart);
}
async function addToCart(lines) {
    const cartId = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])()).get('cartId')?.value;
    const res = await shopifyFetch({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$mutations$2f$cart$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addToCartMutation"],
        variables: {
            cartId,
            lines
        }
    });
    return reshapeCart(res.body.data.cartLinesAdd.cart);
}
async function removeFromCart(lineIds) {
    const cartId = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])()).get('cartId')?.value;
    const res = await shopifyFetch({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$mutations$2f$cart$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["removeFromCartMutation"],
        variables: {
            cartId,
            lineIds
        }
    });
    return reshapeCart(res.body.data.cartLinesRemove.cart);
}
async function updateCart(lines) {
    const cartId = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])()).get('cartId')?.value;
    const res = await shopifyFetch({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$mutations$2f$cart$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["editCartItemsMutation"],
        variables: {
            cartId,
            lines
        }
    });
    return reshapeCart(res.body.data.cartLinesUpdate.cart);
}
async function getCart() {
    const cartId = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])()).get('cartId')?.value;
    if (!cartId) {
        return undefined;
    }
    const res = await shopifyFetch({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$queries$2f$cart$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCartQuery"],
        variables: {
            cartId
        }
    });
    // Old carts becomes `null` when you checkout.
    if (!res.body.data.cart) {
        return undefined;
    }
    return reshapeCart(res.body.data.cart);
}
var $$RSC_SERVER_CACHE_0 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$cache$2d$wrapper$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])("default", "c0bd8e92288cd14eaf312ac2e9bdb514c83e7d97c0", 0, async function getCollection(handle) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cacheTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TAGS"].collections);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cacheLife"])('days');
    const res = await shopifyFetch({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$queries$2f$collection$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollectionQuery"],
        variables: {
            handle
        }
    });
    return reshapeCollection(res.body.data.collection);
});
Object["defineProperty"]($$RSC_SERVER_CACHE_0, "name", {
    value: "getCollection",
    writable: false
});
var getCollection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])($$RSC_SERVER_CACHE_0, "c0bd8e92288cd14eaf312ac2e9bdb514c83e7d97c0", null);
var $$RSC_SERVER_CACHE_1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$cache$2d$wrapper$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])("default", "c009aecab8e0b4c29eb54a366eaeb0211ff6baef59", 0, async function getCollectionProducts({ collection, reverse, sortKey }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cacheTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TAGS"].collections, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TAGS"].products);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cacheLife"])('days');
    const res = await shopifyFetch({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$queries$2f$collection$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollectionProductsQuery"],
        variables: {
            handle: collection,
            reverse,
            sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey
        }
    });
    if (!res.body.data.collection) {
        console.log(`No collection found for \`${collection}\``);
        return [];
    }
    return reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products));
});
Object["defineProperty"]($$RSC_SERVER_CACHE_1, "name", {
    value: "getCollectionProducts",
    writable: false
});
var getCollectionProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])($$RSC_SERVER_CACHE_1, "c009aecab8e0b4c29eb54a366eaeb0211ff6baef59", null);
var $$RSC_SERVER_CACHE_2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$cache$2d$wrapper$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])("default", "80706778df43ed3f012fc66df89855d5f434a561e3", 0, async function getCollections() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cacheTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TAGS"].collections);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cacheLife"])('days');
    const res = await shopifyFetch({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$queries$2f$collection$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCollectionsQuery"]
    });
    const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
    const collections = [
        {
            handle: '',
            title: 'All',
            description: 'All products',
            seo: {
                title: 'All',
                description: 'All products'
            },
            path: '/search',
            updatedAt: new Date().toISOString()
        },
        // Filter out the `hidden` collections.
        // Collections that start with `hidden-*` need to be hidden on the search page.
        ...reshapeCollections(shopifyCollections).filter((collection)=>!collection.handle.startsWith('hidden'))
    ];
    return collections;
});
Object["defineProperty"]($$RSC_SERVER_CACHE_2, "name", {
    value: "getCollections",
    writable: false
});
var getCollections = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])($$RSC_SERVER_CACHE_2, "80706778df43ed3f012fc66df89855d5f434a561e3", null);
var $$RSC_SERVER_CACHE_3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$cache$2d$wrapper$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])("default", "c0898d7588d469477bff18d305943dd768d2b4681b", 0, async function getMenu(handle) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cacheTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TAGS"].collections);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cacheLife"])('days');
    const res = await shopifyFetch({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$queries$2f$menu$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMenuQuery"],
        variables: {
            handle
        }
    });
    return res.body?.data?.menu?.items.map((item)=>({
            title: item.title,
            path: item.url.replace(domain, '').replace('/collections', '/search').replace('/pages', '')
        })) || [];
});
Object["defineProperty"]($$RSC_SERVER_CACHE_3, "name", {
    value: "getMenu",
    writable: false
});
var getMenu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])($$RSC_SERVER_CACHE_3, "c0898d7588d469477bff18d305943dd768d2b4681b", null);
async function getPage(handle) {
    const res = await shopifyFetch({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$queries$2f$page$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPageQuery"],
        variables: {
            handle
        }
    });
    return res.body.data.pageByHandle;
}
async function getPages() {
    const res = await shopifyFetch({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$queries$2f$page$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPagesQuery"]
    });
    return removeEdgesAndNodes(res.body.data.pages);
}
var $$RSC_SERVER_CACHE_4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$cache$2d$wrapper$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])("default", "c08f1ff71fcfcee51346fac3d0254bfdb24c98dbe9", 0, async function getProduct(handle) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cacheTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TAGS"].products);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cacheLife"])('days');
    const res = await shopifyFetch({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$queries$2f$product$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProductQuery"],
        variables: {
            handle
        }
    });
    return reshapeProduct(res.body.data.product, false);
});
Object["defineProperty"]($$RSC_SERVER_CACHE_4, "name", {
    value: "getProduct",
    writable: false
});
var getProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])($$RSC_SERVER_CACHE_4, "c08f1ff71fcfcee51346fac3d0254bfdb24c98dbe9", null);
var $$RSC_SERVER_CACHE_5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$cache$2d$wrapper$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])("default", "c0f81a7e0b54bfb4a858201be0abb30040bca7df32", 0, async function getProductRecommendations(productId) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cacheTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TAGS"].products);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cacheLife"])('days');
    const res = await shopifyFetch({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$queries$2f$product$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProductRecommendationsQuery"],
        variables: {
            productId
        }
    });
    return reshapeProducts(res.body.data.productRecommendations);
});
Object["defineProperty"]($$RSC_SERVER_CACHE_5, "name", {
    value: "getProductRecommendations",
    writable: false
});
var getProductRecommendations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])($$RSC_SERVER_CACHE_5, "c0f81a7e0b54bfb4a858201be0abb30040bca7df32", null);
var $$RSC_SERVER_CACHE_6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$cache$2d$wrapper$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cache"])("default", "c0d55552321ce1658bab7229e59e9c7bf30763b4b1", 0, async function getProducts({ query, reverse, sortKey }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cacheTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TAGS"].products);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unstable_cacheLife"])('days');
    const res = await shopifyFetch({
        query: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$queries$2f$product$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProductsQuery"],
        variables: {
            query,
            reverse,
            sortKey
        }
    });
    return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
});
Object["defineProperty"]($$RSC_SERVER_CACHE_6, "name", {
    value: "getProducts",
    writable: false
});
var getProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])($$RSC_SERVER_CACHE_6, "c0d55552321ce1658bab7229e59e9c7bf30763b4b1", null);
async function revalidate(req) {
    // We always need to respond with a 200 status code to Shopify,
    // otherwise it will continue to retry the request.
    const collectionWebhooks = [
        'collections/create',
        'collections/delete',
        'collections/update'
    ];
    const productWebhooks = [
        'products/create',
        'products/delete',
        'products/update'
    ];
    const topic = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["headers"])()).get('x-shopify-topic') || 'unknown';
    const secret = req.nextUrl.searchParams.get('secret');
    const isCollectionUpdate = collectionWebhooks.includes(topic);
    const isProductUpdate = productWebhooks.includes(topic);
    if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
        console.error('Invalid revalidation secret.');
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextResponse"].json({
            status: 401
        });
    }
    if (!isCollectionUpdate && !isProductUpdate) {
        // We don't need to revalidate anything for any other topics.
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextResponse"].json({
            status: 200
        });
    }
    if (isCollectionUpdate) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TAGS"].collections);
    }
    if (isProductUpdate) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TAGS"].products);
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextResponse"].json({
        status: 200,
        revalidated: true,
        now: Date.now()
    });
}
}}),
"[project]/components/cart/actions.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"004805876bb58604ff64624750e7862460de88842a":"createCartAndSetCookie","00c4a2d579c9bde4ba7b89fd6b576f2d7363f1af8e":"redirectToCheckout","60e59b8e84b2d28cefd90ce0e2a5c49bb892e8db2b":"addItem","60e9a403375c1e58807ea7ac2121e2fbd083f7711d":"removeItem","60ea095587e9a931401a141693a2f45b19b70d0b08":"updateItemQuantity"},"",""] */ __turbopack_context__.s({
    "addItem": (()=>addItem),
    "createCartAndSetCookie": (()=>createCartAndSetCookie),
    "redirectToCheckout": (()=>redirectToCheckout),
    "removeItem": (()=>removeItem),
    "updateItemQuantity": (()=>updateItemQuantity)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/shopify/index.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
async function addItem(prevState, selectedVariantId) {
    if (!selectedVariantId) {
        return 'Error adding item to cart';
    }
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addToCart"])([
            {
                merchandiseId: selectedVariantId,
                quantity: 1
            }
        ]);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TAGS"].cart);
    } catch (e) {
        return 'Error adding item to cart';
    }
}
async function removeItem(prevState, merchandiseId) {
    try {
        const cart = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCart"])();
        if (!cart) {
            return 'Error fetching cart';
        }
        const lineItem = cart.lines.find((line)=>line.merchandise.id === merchandiseId);
        if (lineItem && lineItem.id) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["removeFromCart"])([
                lineItem.id
            ]);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TAGS"].cart);
        } else {
            return 'Item not found in cart';
        }
    } catch (e) {
        return 'Error removing item from cart';
    }
}
async function updateItemQuantity(prevState, payload) {
    const { merchandiseId, quantity } = payload;
    try {
        const cart = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCart"])();
        if (!cart) {
            return 'Error fetching cart';
        }
        const lineItem = cart.lines.find((line)=>line.merchandise.id === merchandiseId);
        if (lineItem && lineItem.id) {
            if (quantity === 0) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["removeFromCart"])([
                    lineItem.id
                ]);
            } else {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateCart"])([
                    {
                        id: lineItem.id,
                        merchandiseId,
                        quantity
                    }
                ]);
            }
        } else if (quantity > 0) {
            // If the item doesn't exist in the cart and quantity > 0, add it
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addToCart"])([
                {
                    merchandiseId,
                    quantity
                }
            ]);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidateTag"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TAGS"].cart);
    } catch (e) {
        console.error(e);
        return 'Error updating item quantity';
    }
}
async function redirectToCheckout() {
    let cart = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCart"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])(cart.checkoutUrl);
}
async function createCartAndSetCookie() {
    let cart = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$shopify$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createCart"])();
    (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])()).set('cartId', cart.id);
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    addItem,
    removeItem,
    updateItemQuantity,
    redirectToCheckout,
    createCartAndSetCookie
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addItem, "60e59b8e84b2d28cefd90ce0e2a5c49bb892e8db2b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(removeItem, "60e9a403375c1e58807ea7ac2121e2fbd083f7711d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateItemQuantity, "60ea095587e9a931401a141693a2f45b19b70d0b08", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(redirectToCheckout, "00c4a2d579c9bde4ba7b89fd6b576f2d7363f1af8e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createCartAndSetCookie, "004805876bb58604ff64624750e7862460de88842a", null);
}}),
"[project]/.next-internal/server/app/_not-found/page/actions.js { ACTIONS_MODULE0 => \"[project]/components/cart/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
;
}}),
"[project]/.next-internal/server/app/_not-found/page/actions.js { ACTIONS_MODULE0 => \"[project]/components/cart/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/cart/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$_not$2d$found$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$components$2f$cart$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/_not-found/page/actions.js { ACTIONS_MODULE0 => "[project]/components/cart/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/_not-found/page/actions.js { ACTIONS_MODULE0 => \"[project]/components/cart/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "60e59b8e84b2d28cefd90ce0e2a5c49bb892e8db2b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addItem"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/cart/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$_not$2d$found$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$components$2f$cart$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/_not-found/page/actions.js { ACTIONS_MODULE0 => "[project]/components/cart/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/_not-found/page/actions.js { ACTIONS_MODULE0 => \"[project]/components/cart/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "60e59b8e84b2d28cefd90ce0e2a5c49bb892e8db2b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$_not$2d$found$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$components$2f$cart$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["60e59b8e84b2d28cefd90ce0e2a5c49bb892e8db2b"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$_not$2d$found$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$components$2f$cart$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/_not-found/page/actions.js { ACTIONS_MODULE0 => "[project]/components/cart/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$_not$2d$found$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$components$2f$cart$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/_not-found/page/actions.js { ACTIONS_MODULE0 => "[project]/components/cart/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
}}),
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}}),
"[project]/app/opengraph-image--metadata.js [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/app/opengraph-image--metadata.js [app-rsc] (ecmascript)"));
}}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/app/error.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/app/error.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__78ffc92b._.js.map