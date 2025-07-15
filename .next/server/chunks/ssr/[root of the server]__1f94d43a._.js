module.exports = {

"[externals]/next/dist/compiled/next-server/app-page-experimental.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-experimental.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-experimental.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-experimental.runtime.dev.js"));

module.exports = mod;
}}),
"[project]/components/cart/cart-context.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "CartProvider": (()=>CartProvider),
    "useCart": (()=>useCart)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const CartContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function calculateItemCost(quantity, price) {
    return (Number(price) * quantity).toString();
}
function updateCartItem(item, updateType) {
    if (updateType === 'delete') return null;
    const newQuantity = updateType === 'plus' ? item.quantity + 1 : item.quantity - 1;
    if (newQuantity === 0) return null;
    const singleItemAmount = Number(item.cost.totalAmount.amount) / item.quantity;
    const newTotalAmount = calculateItemCost(newQuantity, singleItemAmount.toString());
    return {
        ...item,
        quantity: newQuantity,
        cost: {
            ...item.cost,
            totalAmount: {
                ...item.cost.totalAmount,
                amount: newTotalAmount
            }
        }
    };
}
function createOrUpdateCartItem(existingItem, variant, product) {
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    const totalAmount = calculateItemCost(quantity, variant.price.amount);
    return {
        id: existingItem?.id,
        quantity,
        cost: {
            totalAmount: {
                amount: totalAmount,
                currencyCode: variant.price.currencyCode
            }
        },
        merchandise: {
            id: variant.id,
            title: variant.title,
            selectedOptions: variant.selectedOptions,
            product: {
                id: product.id,
                handle: product.handle,
                title: product.title,
                featuredImage: product.featuredImage
            }
        }
    };
}
function updateCartTotals(lines) {
    const totalQuantity = lines.reduce((sum, item)=>sum + item.quantity, 0);
    const totalAmount = lines.reduce((sum, item)=>sum + Number(item.cost.totalAmount.amount), 0);
    const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? 'USD';
    return {
        totalQuantity,
        cost: {
            subtotalAmount: {
                amount: totalAmount.toString(),
                currencyCode
            },
            totalAmount: {
                amount: totalAmount.toString(),
                currencyCode
            },
            totalTaxAmount: {
                amount: '0',
                currencyCode
            }
        }
    };
}
function createEmptyCart() {
    return {
        id: undefined,
        checkoutUrl: '',
        totalQuantity: 0,
        lines: [],
        cost: {
            subtotalAmount: {
                amount: '0',
                currencyCode: 'USD'
            },
            totalAmount: {
                amount: '0',
                currencyCode: 'USD'
            },
            totalTaxAmount: {
                amount: '0',
                currencyCode: 'USD'
            }
        }
    };
}
function cartReducer(state, action) {
    const currentCart = state || createEmptyCart();
    switch(action.type){
        case 'UPDATE_ITEM':
            {
                const { merchandiseId, updateType } = action.payload;
                const updatedLines = currentCart.lines.map((item)=>item.merchandise.id === merchandiseId ? updateCartItem(item, updateType) : item).filter(Boolean);
                if (updatedLines.length === 0) {
                    return {
                        ...currentCart,
                        lines: [],
                        totalQuantity: 0,
                        cost: {
                            ...currentCart.cost,
                            totalAmount: {
                                ...currentCart.cost.totalAmount,
                                amount: '0'
                            }
                        }
                    };
                }
                return {
                    ...currentCart,
                    ...updateCartTotals(updatedLines),
                    lines: updatedLines
                };
            }
        case 'ADD_ITEM':
            {
                const { variant, product } = action.payload;
                const existingItem = currentCart.lines.find((item)=>item.merchandise.id === variant.id);
                const updatedItem = createOrUpdateCartItem(existingItem, variant, product);
                const updatedLines = existingItem ? currentCart.lines.map((item)=>item.merchandise.id === variant.id ? updatedItem : item) : [
                    ...currentCart.lines,
                    updatedItem
                ];
                return {
                    ...currentCart,
                    ...updateCartTotals(updatedLines),
                    lines: updatedLines
                };
            }
        default:
            return currentCart;
    }
}
function CartProvider({ children, cartPromise }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CartContext.Provider, {
        value: {
            cartPromise
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/components/cart/cart-context.tsx",
        lineNumber: 201,
        columnNumber: 5
    }, this);
}
function useCart() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    const initialCart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["use"])(context.cartPromise);
    const [optimisticCart, updateOptimisticCart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOptimistic"])(initialCart, cartReducer);
    const updateCartItem = (merchandiseId, updateType)=>{
        updateOptimisticCart({
            type: 'UPDATE_ITEM',
            payload: {
                merchandiseId,
                updateType
            }
        });
    };
    const addCartItem = (variant, product)=>{
        updateOptimisticCart({
            type: 'ADD_ITEM',
            payload: {
                variant,
                product
            }
        });
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            cart: optimisticCart,
            updateCartItem,
            addCartItem
        }), [
        optimisticCart
    ]);
}
}}),
"[project]/components/loading-dots.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
;
;
const dots = 'mx-[1px] inline-block h-1 w-1 animate-blink rounded-md';
const LoadingDots = ({ className })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "mx-2 inline-flex items-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(dots, className)
            }, void 0, false, {
                fileName: "[project]/components/loading-dots.tsx",
                lineNumber: 8,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(dots, 'animation-delay-[200ms]', className)
            }, void 0, false, {
                fileName: "[project]/components/loading-dots.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(dots, 'animation-delay-[400ms]', className)
            }, void 0, false, {
                fileName: "[project]/components/loading-dots.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/loading-dots.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = LoadingDots;
}}),
"[project]/components/price.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
;
;
const Price = ({ amount, className, currencyCode = 'USD', currencyCodeClassName })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        suppressHydrationWarning: true,
        className: className,
        children: [
            `${new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: currencyCode,
                currencyDisplay: 'narrowSymbol'
            }).format(parseFloat(amount))}`,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])('ml-1 inline', currencyCodeClassName),
                children: `${currencyCode}`
            }, void 0, false, {
                fileName: "[project]/components/price.tsx",
                lineNumber: 20,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/price.tsx",
        lineNumber: 14,
        columnNumber: 3
    }, this);
const __TURBOPACK__default__export__ = Price;
}}),
"[project]/lib/constants.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
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
"[project]/lib/utils.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
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
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/components/cart/data:617f27 [app-ssr] (ecmascript) <text/javascript>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"00171a1cf2992ee2660cbf5245783c4f277a97959a":"createCartAndSetCookie"},"components/cart/actions.ts",""] */ __turbopack_context__.s({
    "createCartAndSetCookie": (()=>createCartAndSetCookie)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
"use turbopack no side effects";
;
var createCartAndSetCookie = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("00171a1cf2992ee2660cbf5245783c4f277a97959a", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "createCartAndSetCookie"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcic7XG5cbmltcG9ydCB7IFRBR1MgfSBmcm9tICdsaWIvY29uc3RhbnRzJztcbmltcG9ydCB7XG4gIGFkZFRvQ2FydCxcbiAgY3JlYXRlQ2FydCxcbiAgZ2V0Q2FydCxcbiAgcmVtb3ZlRnJvbUNhcnQsXG4gIHVwZGF0ZUNhcnRcbn0gZnJvbSAnbGliL3Nob3BpZnknO1xuaW1wb3J0IHsgcmV2YWxpZGF0ZVRhZyB9IGZyb20gJ25leHQvY2FjaGUnO1xuaW1wb3J0IHsgY29va2llcyB9IGZyb20gJ25leHQvaGVhZGVycyc7XG5pbXBvcnQgeyByZWRpcmVjdCB9IGZyb20gJ25leHQvbmF2aWdhdGlvbic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRJdGVtKFxuICBwcmV2U3RhdGU6IGFueSxcbiAgc2VsZWN0ZWRWYXJpYW50SWQ6IHN0cmluZyB8IHVuZGVmaW5lZFxuKSB7XG4gIGlmICghc2VsZWN0ZWRWYXJpYW50SWQpIHtcbiAgICByZXR1cm4gJ0Vycm9yIGFkZGluZyBpdGVtIHRvIGNhcnQnO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBhd2FpdCBhZGRUb0NhcnQoW3sgbWVyY2hhbmRpc2VJZDogc2VsZWN0ZWRWYXJpYW50SWQsIHF1YW50aXR5OiAxIH1dKTtcbiAgICByZXZhbGlkYXRlVGFnKFRBR1MuY2FydCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gJ0Vycm9yIGFkZGluZyBpdGVtIHRvIGNhcnQnO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVJdGVtKHByZXZTdGF0ZTogYW55LCBtZXJjaGFuZGlzZUlkOiBzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBjYXJ0ID0gYXdhaXQgZ2V0Q2FydCgpO1xuXG4gICAgaWYgKCFjYXJ0KSB7XG4gICAgICByZXR1cm4gJ0Vycm9yIGZldGNoaW5nIGNhcnQnO1xuICAgIH1cblxuICAgIGNvbnN0IGxpbmVJdGVtID0gY2FydC5saW5lcy5maW5kKFxuICAgICAgKGxpbmUpID0+IGxpbmUubWVyY2hhbmRpc2UuaWQgPT09IG1lcmNoYW5kaXNlSWRcbiAgICApO1xuXG4gICAgaWYgKGxpbmVJdGVtICYmIGxpbmVJdGVtLmlkKSB7XG4gICAgICBhd2FpdCByZW1vdmVGcm9tQ2FydChbbGluZUl0ZW0uaWRdKTtcbiAgICAgIHJldmFsaWRhdGVUYWcoVEFHUy5jYXJ0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdJdGVtIG5vdCBmb3VuZCBpbiBjYXJ0JztcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gJ0Vycm9yIHJlbW92aW5nIGl0ZW0gZnJvbSBjYXJ0JztcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlSXRlbVF1YW50aXR5KFxuICBwcmV2U3RhdGU6IGFueSxcbiAgcGF5bG9hZDoge1xuICAgIG1lcmNoYW5kaXNlSWQ6IHN0cmluZztcbiAgICBxdWFudGl0eTogbnVtYmVyO1xuICB9XG4pIHtcbiAgY29uc3QgeyBtZXJjaGFuZGlzZUlkLCBxdWFudGl0eSB9ID0gcGF5bG9hZDtcblxuICB0cnkge1xuICAgIGNvbnN0IGNhcnQgPSBhd2FpdCBnZXRDYXJ0KCk7XG5cbiAgICBpZiAoIWNhcnQpIHtcbiAgICAgIHJldHVybiAnRXJyb3IgZmV0Y2hpbmcgY2FydCc7XG4gICAgfVxuXG4gICAgY29uc3QgbGluZUl0ZW0gPSBjYXJ0LmxpbmVzLmZpbmQoXG4gICAgICAobGluZSkgPT4gbGluZS5tZXJjaGFuZGlzZS5pZCA9PT0gbWVyY2hhbmRpc2VJZFxuICAgICk7XG5cbiAgICBpZiAobGluZUl0ZW0gJiYgbGluZUl0ZW0uaWQpIHtcbiAgICAgIGlmIChxdWFudGl0eSA9PT0gMCkge1xuICAgICAgICBhd2FpdCByZW1vdmVGcm9tQ2FydChbbGluZUl0ZW0uaWRdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF3YWl0IHVwZGF0ZUNhcnQoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiBsaW5lSXRlbS5pZCxcbiAgICAgICAgICAgIG1lcmNoYW5kaXNlSWQsXG4gICAgICAgICAgICBxdWFudGl0eVxuICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChxdWFudGl0eSA+IDApIHtcbiAgICAgIC8vIElmIHRoZSBpdGVtIGRvZXNuJ3QgZXhpc3QgaW4gdGhlIGNhcnQgYW5kIHF1YW50aXR5ID4gMCwgYWRkIGl0XG4gICAgICBhd2FpdCBhZGRUb0NhcnQoW3sgbWVyY2hhbmRpc2VJZCwgcXVhbnRpdHkgfV0pO1xuICAgIH1cblxuICAgIHJldmFsaWRhdGVUYWcoVEFHUy5jYXJ0KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgcmV0dXJuICdFcnJvciB1cGRhdGluZyBpdGVtIHF1YW50aXR5JztcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVkaXJlY3RUb0NoZWNrb3V0KCkge1xuICBsZXQgY2FydCA9IGF3YWl0IGdldENhcnQoKTtcbiAgcmVkaXJlY3QoY2FydCEuY2hlY2tvdXRVcmwpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlQ2FydEFuZFNldENvb2tpZSgpIHtcbiAgbGV0IGNhcnQgPSBhd2FpdCBjcmVhdGVDYXJ0KCk7XG4gIChhd2FpdCBjb29raWVzKCkpLnNldCgnY2FydElkJywgY2FydC5pZCEpO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIwU0FzR3NCIn0=
}}),
"[project]/components/cart/data:828780 [app-ssr] (ecmascript) <text/javascript>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"00596753521983bca10378e1e40eceea5d8910a3d5":"redirectToCheckout"},"components/cart/actions.ts",""] */ __turbopack_context__.s({
    "redirectToCheckout": (()=>redirectToCheckout)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
"use turbopack no side effects";
;
var redirectToCheckout = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("00596753521983bca10378e1e40eceea5d8910a3d5", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "redirectToCheckout"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcic7XG5cbmltcG9ydCB7IFRBR1MgfSBmcm9tICdsaWIvY29uc3RhbnRzJztcbmltcG9ydCB7XG4gIGFkZFRvQ2FydCxcbiAgY3JlYXRlQ2FydCxcbiAgZ2V0Q2FydCxcbiAgcmVtb3ZlRnJvbUNhcnQsXG4gIHVwZGF0ZUNhcnRcbn0gZnJvbSAnbGliL3Nob3BpZnknO1xuaW1wb3J0IHsgcmV2YWxpZGF0ZVRhZyB9IGZyb20gJ25leHQvY2FjaGUnO1xuaW1wb3J0IHsgY29va2llcyB9IGZyb20gJ25leHQvaGVhZGVycyc7XG5pbXBvcnQgeyByZWRpcmVjdCB9IGZyb20gJ25leHQvbmF2aWdhdGlvbic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRJdGVtKFxuICBwcmV2U3RhdGU6IGFueSxcbiAgc2VsZWN0ZWRWYXJpYW50SWQ6IHN0cmluZyB8IHVuZGVmaW5lZFxuKSB7XG4gIGlmICghc2VsZWN0ZWRWYXJpYW50SWQpIHtcbiAgICByZXR1cm4gJ0Vycm9yIGFkZGluZyBpdGVtIHRvIGNhcnQnO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBhd2FpdCBhZGRUb0NhcnQoW3sgbWVyY2hhbmRpc2VJZDogc2VsZWN0ZWRWYXJpYW50SWQsIHF1YW50aXR5OiAxIH1dKTtcbiAgICByZXZhbGlkYXRlVGFnKFRBR1MuY2FydCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gJ0Vycm9yIGFkZGluZyBpdGVtIHRvIGNhcnQnO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVJdGVtKHByZXZTdGF0ZTogYW55LCBtZXJjaGFuZGlzZUlkOiBzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBjYXJ0ID0gYXdhaXQgZ2V0Q2FydCgpO1xuXG4gICAgaWYgKCFjYXJ0KSB7XG4gICAgICByZXR1cm4gJ0Vycm9yIGZldGNoaW5nIGNhcnQnO1xuICAgIH1cblxuICAgIGNvbnN0IGxpbmVJdGVtID0gY2FydC5saW5lcy5maW5kKFxuICAgICAgKGxpbmUpID0+IGxpbmUubWVyY2hhbmRpc2UuaWQgPT09IG1lcmNoYW5kaXNlSWRcbiAgICApO1xuXG4gICAgaWYgKGxpbmVJdGVtICYmIGxpbmVJdGVtLmlkKSB7XG4gICAgICBhd2FpdCByZW1vdmVGcm9tQ2FydChbbGluZUl0ZW0uaWRdKTtcbiAgICAgIHJldmFsaWRhdGVUYWcoVEFHUy5jYXJ0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdJdGVtIG5vdCBmb3VuZCBpbiBjYXJ0JztcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gJ0Vycm9yIHJlbW92aW5nIGl0ZW0gZnJvbSBjYXJ0JztcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlSXRlbVF1YW50aXR5KFxuICBwcmV2U3RhdGU6IGFueSxcbiAgcGF5bG9hZDoge1xuICAgIG1lcmNoYW5kaXNlSWQ6IHN0cmluZztcbiAgICBxdWFudGl0eTogbnVtYmVyO1xuICB9XG4pIHtcbiAgY29uc3QgeyBtZXJjaGFuZGlzZUlkLCBxdWFudGl0eSB9ID0gcGF5bG9hZDtcblxuICB0cnkge1xuICAgIGNvbnN0IGNhcnQgPSBhd2FpdCBnZXRDYXJ0KCk7XG5cbiAgICBpZiAoIWNhcnQpIHtcbiAgICAgIHJldHVybiAnRXJyb3IgZmV0Y2hpbmcgY2FydCc7XG4gICAgfVxuXG4gICAgY29uc3QgbGluZUl0ZW0gPSBjYXJ0LmxpbmVzLmZpbmQoXG4gICAgICAobGluZSkgPT4gbGluZS5tZXJjaGFuZGlzZS5pZCA9PT0gbWVyY2hhbmRpc2VJZFxuICAgICk7XG5cbiAgICBpZiAobGluZUl0ZW0gJiYgbGluZUl0ZW0uaWQpIHtcbiAgICAgIGlmIChxdWFudGl0eSA9PT0gMCkge1xuICAgICAgICBhd2FpdCByZW1vdmVGcm9tQ2FydChbbGluZUl0ZW0uaWRdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF3YWl0IHVwZGF0ZUNhcnQoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiBsaW5lSXRlbS5pZCxcbiAgICAgICAgICAgIG1lcmNoYW5kaXNlSWQsXG4gICAgICAgICAgICBxdWFudGl0eVxuICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChxdWFudGl0eSA+IDApIHtcbiAgICAgIC8vIElmIHRoZSBpdGVtIGRvZXNuJ3QgZXhpc3QgaW4gdGhlIGNhcnQgYW5kIHF1YW50aXR5ID4gMCwgYWRkIGl0XG4gICAgICBhd2FpdCBhZGRUb0NhcnQoW3sgbWVyY2hhbmRpc2VJZCwgcXVhbnRpdHkgfV0pO1xuICAgIH1cblxuICAgIHJldmFsaWRhdGVUYWcoVEFHUy5jYXJ0KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgcmV0dXJuICdFcnJvciB1cGRhdGluZyBpdGVtIHF1YW50aXR5JztcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVkaXJlY3RUb0NoZWNrb3V0KCkge1xuICBsZXQgY2FydCA9IGF3YWl0IGdldENhcnQoKTtcbiAgcmVkaXJlY3QoY2FydCEuY2hlY2tvdXRVcmwpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlQ2FydEFuZFNldENvb2tpZSgpIHtcbiAgbGV0IGNhcnQgPSBhd2FpdCBjcmVhdGVDYXJ0KCk7XG4gIChhd2FpdCBjb29raWVzKCkpLnNldCgnY2FydElkJywgY2FydC5pZCEpO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJzU0FpR3NCIn0=
}}),
"[project]/components/cart/data:601fc5 [app-ssr] (ecmascript) <text/javascript>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"601a84af23637f7b20c08b059b3abea5795b7a731c":"removeItem"},"components/cart/actions.ts",""] */ __turbopack_context__.s({
    "removeItem": (()=>removeItem)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
"use turbopack no side effects";
;
var removeItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("601a84af23637f7b20c08b059b3abea5795b7a731c", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "removeItem"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcic7XG5cbmltcG9ydCB7IFRBR1MgfSBmcm9tICdsaWIvY29uc3RhbnRzJztcbmltcG9ydCB7XG4gIGFkZFRvQ2FydCxcbiAgY3JlYXRlQ2FydCxcbiAgZ2V0Q2FydCxcbiAgcmVtb3ZlRnJvbUNhcnQsXG4gIHVwZGF0ZUNhcnRcbn0gZnJvbSAnbGliL3Nob3BpZnknO1xuaW1wb3J0IHsgcmV2YWxpZGF0ZVRhZyB9IGZyb20gJ25leHQvY2FjaGUnO1xuaW1wb3J0IHsgY29va2llcyB9IGZyb20gJ25leHQvaGVhZGVycyc7XG5pbXBvcnQgeyByZWRpcmVjdCB9IGZyb20gJ25leHQvbmF2aWdhdGlvbic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRJdGVtKFxuICBwcmV2U3RhdGU6IGFueSxcbiAgc2VsZWN0ZWRWYXJpYW50SWQ6IHN0cmluZyB8IHVuZGVmaW5lZFxuKSB7XG4gIGlmICghc2VsZWN0ZWRWYXJpYW50SWQpIHtcbiAgICByZXR1cm4gJ0Vycm9yIGFkZGluZyBpdGVtIHRvIGNhcnQnO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBhd2FpdCBhZGRUb0NhcnQoW3sgbWVyY2hhbmRpc2VJZDogc2VsZWN0ZWRWYXJpYW50SWQsIHF1YW50aXR5OiAxIH1dKTtcbiAgICByZXZhbGlkYXRlVGFnKFRBR1MuY2FydCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gJ0Vycm9yIGFkZGluZyBpdGVtIHRvIGNhcnQnO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVJdGVtKHByZXZTdGF0ZTogYW55LCBtZXJjaGFuZGlzZUlkOiBzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBjYXJ0ID0gYXdhaXQgZ2V0Q2FydCgpO1xuXG4gICAgaWYgKCFjYXJ0KSB7XG4gICAgICByZXR1cm4gJ0Vycm9yIGZldGNoaW5nIGNhcnQnO1xuICAgIH1cblxuICAgIGNvbnN0IGxpbmVJdGVtID0gY2FydC5saW5lcy5maW5kKFxuICAgICAgKGxpbmUpID0+IGxpbmUubWVyY2hhbmRpc2UuaWQgPT09IG1lcmNoYW5kaXNlSWRcbiAgICApO1xuXG4gICAgaWYgKGxpbmVJdGVtICYmIGxpbmVJdGVtLmlkKSB7XG4gICAgICBhd2FpdCByZW1vdmVGcm9tQ2FydChbbGluZUl0ZW0uaWRdKTtcbiAgICAgIHJldmFsaWRhdGVUYWcoVEFHUy5jYXJ0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdJdGVtIG5vdCBmb3VuZCBpbiBjYXJ0JztcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gJ0Vycm9yIHJlbW92aW5nIGl0ZW0gZnJvbSBjYXJ0JztcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlSXRlbVF1YW50aXR5KFxuICBwcmV2U3RhdGU6IGFueSxcbiAgcGF5bG9hZDoge1xuICAgIG1lcmNoYW5kaXNlSWQ6IHN0cmluZztcbiAgICBxdWFudGl0eTogbnVtYmVyO1xuICB9XG4pIHtcbiAgY29uc3QgeyBtZXJjaGFuZGlzZUlkLCBxdWFudGl0eSB9ID0gcGF5bG9hZDtcblxuICB0cnkge1xuICAgIGNvbnN0IGNhcnQgPSBhd2FpdCBnZXRDYXJ0KCk7XG5cbiAgICBpZiAoIWNhcnQpIHtcbiAgICAgIHJldHVybiAnRXJyb3IgZmV0Y2hpbmcgY2FydCc7XG4gICAgfVxuXG4gICAgY29uc3QgbGluZUl0ZW0gPSBjYXJ0LmxpbmVzLmZpbmQoXG4gICAgICAobGluZSkgPT4gbGluZS5tZXJjaGFuZGlzZS5pZCA9PT0gbWVyY2hhbmRpc2VJZFxuICAgICk7XG5cbiAgICBpZiAobGluZUl0ZW0gJiYgbGluZUl0ZW0uaWQpIHtcbiAgICAgIGlmIChxdWFudGl0eSA9PT0gMCkge1xuICAgICAgICBhd2FpdCByZW1vdmVGcm9tQ2FydChbbGluZUl0ZW0uaWRdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF3YWl0IHVwZGF0ZUNhcnQoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiBsaW5lSXRlbS5pZCxcbiAgICAgICAgICAgIG1lcmNoYW5kaXNlSWQsXG4gICAgICAgICAgICBxdWFudGl0eVxuICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChxdWFudGl0eSA+IDApIHtcbiAgICAgIC8vIElmIHRoZSBpdGVtIGRvZXNuJ3QgZXhpc3QgaW4gdGhlIGNhcnQgYW5kIHF1YW50aXR5ID4gMCwgYWRkIGl0XG4gICAgICBhd2FpdCBhZGRUb0NhcnQoW3sgbWVyY2hhbmRpc2VJZCwgcXVhbnRpdHkgfV0pO1xuICAgIH1cblxuICAgIHJldmFsaWRhdGVUYWcoVEFHUy5jYXJ0KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgcmV0dXJuICdFcnJvciB1cGRhdGluZyBpdGVtIHF1YW50aXR5JztcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVkaXJlY3RUb0NoZWNrb3V0KCkge1xuICBsZXQgY2FydCA9IGF3YWl0IGdldENhcnQoKTtcbiAgcmVkaXJlY3QoY2FydCEuY2hlY2tvdXRVcmwpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlQ2FydEFuZFNldENvb2tpZSgpIHtcbiAgbGV0IGNhcnQgPSBhd2FpdCBjcmVhdGVDYXJ0KCk7XG4gIChhd2FpdCBjb29raWVzKCkpLnNldCgnY2FydElkJywgY2FydC5pZCEpO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI4UkE4QnNCIn0=
}}),
"[project]/components/cart/delete-item-button.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "DeleteItemButton": (()=>DeleteItemButton)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$XMarkIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XMarkIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/XMarkIcon.js [app-ssr] (ecmascript) <export default as XMarkIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$data$3a$601fc5__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/components/cart/data:601fc5 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function DeleteItemButton({ item, optimisticUpdate }) {
    const [message, formAction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useActionState"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$data$3a$601fc5__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["removeItem"], null);
    const merchandiseId = item.merchandise.id;
    const removeItemAction = formAction.bind(null, merchandiseId);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        action: async ()=>{
            optimisticUpdate(merchandiseId, 'delete');
            removeItemAction();
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "submit",
                "aria-label": "Remove cart item",
                className: "flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$XMarkIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XMarkIcon$3e$__["XMarkIcon"], {
                    className: "mx-[1px] h-4 w-4 text-white dark:text-black"
                }, void 0, false, {
                    fileName: "[project]/components/cart/delete-item-button.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/cart/delete-item-button.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                "aria-live": "polite",
                className: "sr-only",
                role: "status",
                children: message
            }, void 0, false, {
                fileName: "[project]/components/cart/delete-item-button.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/cart/delete-item-button.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
}}),
"[project]/components/cart/data:42d2f4 [app-ssr] (ecmascript) <text/javascript>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"60397a6b5b7c68f963bfe4a25c95cf92f2c325630b":"updateItemQuantity"},"components/cart/actions.ts",""] */ __turbopack_context__.s({
    "updateItemQuantity": (()=>updateItemQuantity)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
"use turbopack no side effects";
;
var updateItemQuantity = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("60397a6b5b7c68f963bfe4a25c95cf92f2c325630b", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "updateItemQuantity"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcic7XG5cbmltcG9ydCB7IFRBR1MgfSBmcm9tICdsaWIvY29uc3RhbnRzJztcbmltcG9ydCB7XG4gIGFkZFRvQ2FydCxcbiAgY3JlYXRlQ2FydCxcbiAgZ2V0Q2FydCxcbiAgcmVtb3ZlRnJvbUNhcnQsXG4gIHVwZGF0ZUNhcnRcbn0gZnJvbSAnbGliL3Nob3BpZnknO1xuaW1wb3J0IHsgcmV2YWxpZGF0ZVRhZyB9IGZyb20gJ25leHQvY2FjaGUnO1xuaW1wb3J0IHsgY29va2llcyB9IGZyb20gJ25leHQvaGVhZGVycyc7XG5pbXBvcnQgeyByZWRpcmVjdCB9IGZyb20gJ25leHQvbmF2aWdhdGlvbic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRJdGVtKFxuICBwcmV2U3RhdGU6IGFueSxcbiAgc2VsZWN0ZWRWYXJpYW50SWQ6IHN0cmluZyB8IHVuZGVmaW5lZFxuKSB7XG4gIGlmICghc2VsZWN0ZWRWYXJpYW50SWQpIHtcbiAgICByZXR1cm4gJ0Vycm9yIGFkZGluZyBpdGVtIHRvIGNhcnQnO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBhd2FpdCBhZGRUb0NhcnQoW3sgbWVyY2hhbmRpc2VJZDogc2VsZWN0ZWRWYXJpYW50SWQsIHF1YW50aXR5OiAxIH1dKTtcbiAgICByZXZhbGlkYXRlVGFnKFRBR1MuY2FydCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gJ0Vycm9yIGFkZGluZyBpdGVtIHRvIGNhcnQnO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVJdGVtKHByZXZTdGF0ZTogYW55LCBtZXJjaGFuZGlzZUlkOiBzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBjYXJ0ID0gYXdhaXQgZ2V0Q2FydCgpO1xuXG4gICAgaWYgKCFjYXJ0KSB7XG4gICAgICByZXR1cm4gJ0Vycm9yIGZldGNoaW5nIGNhcnQnO1xuICAgIH1cblxuICAgIGNvbnN0IGxpbmVJdGVtID0gY2FydC5saW5lcy5maW5kKFxuICAgICAgKGxpbmUpID0+IGxpbmUubWVyY2hhbmRpc2UuaWQgPT09IG1lcmNoYW5kaXNlSWRcbiAgICApO1xuXG4gICAgaWYgKGxpbmVJdGVtICYmIGxpbmVJdGVtLmlkKSB7XG4gICAgICBhd2FpdCByZW1vdmVGcm9tQ2FydChbbGluZUl0ZW0uaWRdKTtcbiAgICAgIHJldmFsaWRhdGVUYWcoVEFHUy5jYXJ0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdJdGVtIG5vdCBmb3VuZCBpbiBjYXJ0JztcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gJ0Vycm9yIHJlbW92aW5nIGl0ZW0gZnJvbSBjYXJ0JztcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlSXRlbVF1YW50aXR5KFxuICBwcmV2U3RhdGU6IGFueSxcbiAgcGF5bG9hZDoge1xuICAgIG1lcmNoYW5kaXNlSWQ6IHN0cmluZztcbiAgICBxdWFudGl0eTogbnVtYmVyO1xuICB9XG4pIHtcbiAgY29uc3QgeyBtZXJjaGFuZGlzZUlkLCBxdWFudGl0eSB9ID0gcGF5bG9hZDtcblxuICB0cnkge1xuICAgIGNvbnN0IGNhcnQgPSBhd2FpdCBnZXRDYXJ0KCk7XG5cbiAgICBpZiAoIWNhcnQpIHtcbiAgICAgIHJldHVybiAnRXJyb3IgZmV0Y2hpbmcgY2FydCc7XG4gICAgfVxuXG4gICAgY29uc3QgbGluZUl0ZW0gPSBjYXJ0LmxpbmVzLmZpbmQoXG4gICAgICAobGluZSkgPT4gbGluZS5tZXJjaGFuZGlzZS5pZCA9PT0gbWVyY2hhbmRpc2VJZFxuICAgICk7XG5cbiAgICBpZiAobGluZUl0ZW0gJiYgbGluZUl0ZW0uaWQpIHtcbiAgICAgIGlmIChxdWFudGl0eSA9PT0gMCkge1xuICAgICAgICBhd2FpdCByZW1vdmVGcm9tQ2FydChbbGluZUl0ZW0uaWRdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF3YWl0IHVwZGF0ZUNhcnQoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiBsaW5lSXRlbS5pZCxcbiAgICAgICAgICAgIG1lcmNoYW5kaXNlSWQsXG4gICAgICAgICAgICBxdWFudGl0eVxuICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChxdWFudGl0eSA+IDApIHtcbiAgICAgIC8vIElmIHRoZSBpdGVtIGRvZXNuJ3QgZXhpc3QgaW4gdGhlIGNhcnQgYW5kIHF1YW50aXR5ID4gMCwgYWRkIGl0XG4gICAgICBhd2FpdCBhZGRUb0NhcnQoW3sgbWVyY2hhbmRpc2VJZCwgcXVhbnRpdHkgfV0pO1xuICAgIH1cblxuICAgIHJldmFsaWRhdGVUYWcoVEFHUy5jYXJ0KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgcmV0dXJuICdFcnJvciB1cGRhdGluZyBpdGVtIHF1YW50aXR5JztcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVkaXJlY3RUb0NoZWNrb3V0KCkge1xuICBsZXQgY2FydCA9IGF3YWl0IGdldENhcnQoKTtcbiAgcmVkaXJlY3QoY2FydCEuY2hlY2tvdXRVcmwpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlQ2FydEFuZFNldENvb2tpZSgpIHtcbiAgbGV0IGNhcnQgPSBhd2FpdCBjcmVhdGVDYXJ0KCk7XG4gIChhd2FpdCBjb29raWVzKCkpLnNldCgnY2FydElkJywgY2FydC5pZCEpO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJzU0FxRHNCIn0=
}}),
"[project]/components/cart/edit-item-quantity-button.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "EditItemQuantityButton": (()=>EditItemQuantityButton)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$MinusIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MinusIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/MinusIcon.js [app-ssr] (ecmascript) <export default as MinusIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$PlusIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/PlusIcon.js [app-ssr] (ecmascript) <export default as PlusIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$data$3a$42d2f4__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/components/cart/data:42d2f4 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function SubmitButton({ type }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "submit",
        "aria-label": type === 'plus' ? 'Increase item quantity' : 'Reduce item quantity',
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])('ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80', {
            'ml-auto': type === 'minus'
        }),
        children: type === 'plus' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$PlusIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusIcon$3e$__["PlusIcon"], {
            className: "h-4 w-4 dark:text-neutral-500"
        }, void 0, false, {
            fileName: "[project]/components/cart/edit-item-quantity-button.tsx",
            lineNumber: 24,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$MinusIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MinusIcon$3e$__["MinusIcon"], {
            className: "h-4 w-4 dark:text-neutral-500"
        }, void 0, false, {
            fileName: "[project]/components/cart/edit-item-quantity-button.tsx",
            lineNumber: 26,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/cart/edit-item-quantity-button.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
function EditItemQuantityButton({ item, type, optimisticUpdate }) {
    const [message, formAction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useActionState"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$data$3a$42d2f4__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["updateItemQuantity"], null);
    const payload = {
        merchandiseId: item.merchandise.id,
        quantity: type === 'plus' ? item.quantity + 1 : item.quantity - 1
    };
    const updateItemQuantityAction = formAction.bind(null, payload);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        action: async ()=>{
            optimisticUpdate(payload.merchandiseId, type);
            updateItemQuantityAction();
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SubmitButton, {
                type: type
            }, void 0, false, {
                fileName: "[project]/components/cart/edit-item-quantity-button.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                "aria-live": "polite",
                className: "sr-only",
                role: "status",
                children: message
            }, void 0, false, {
                fileName: "[project]/components/cart/edit-item-quantity-button.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/cart/edit-item-quantity-button.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
}}),
"[project]/components/cart/open-cart.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>OpenCart)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ShoppingCartIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCartIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ShoppingCartIcon.js [app-ssr] (ecmascript) <export default as ShoppingCartIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
;
;
;
function OpenCart({ className, quantity }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ShoppingCartIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCartIcon$3e$__["ShoppingCartIcon"], {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])('h-4 transition-all ease-in-out hover:scale-110', className)
            }, void 0, false, {
                fileName: "[project]/components/cart/open-cart.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            quantity ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded-sm bg-blue-600 text-[11px] font-medium text-white",
                children: quantity
            }, void 0, false, {
                fileName: "[project]/components/cart/open-cart.tsx",
                lineNumber: 18,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/cart/open-cart.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
}}),
"[project]/components/cart/modal.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>CartModal)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$dialog$2f$dialog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@headlessui/react/dist/components/dialog/dialog.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$transition$2f$transition$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@headlessui/react/dist/components/transition/transition.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ShoppingCartIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCartIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ShoppingCartIcon.js [app-ssr] (ecmascript) <export default as ShoppingCartIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$XMarkIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XMarkIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/XMarkIcon.js [app-ssr] (ecmascript) <export default as XMarkIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$loading$2d$dots$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/loading-dots.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$price$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/price.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$data$3a$617f27__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/components/cart/data:617f27 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$data$3a$828780__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/components/cart/data:828780 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$cart$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/cart/cart-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$delete$2d$item$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/cart/delete-item-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$edit$2d$item$2d$quantity$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/cart/edit-item-quantity-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$open$2d$cart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/cart/open-cart.tsx [app-ssr] (ecmascript)");
'use client';
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
;
;
function CartModal() {
    const { cart, updateCartItem } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$cart$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCart"])();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const quantityRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(cart?.totalQuantity);
    const openCart = ()=>setIsOpen(true);
    const closeCart = ()=>setIsOpen(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!cart) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$data$3a$617f27__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["createCartAndSetCookie"])();
        }
    }, [
        cart
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (cart?.totalQuantity && cart?.totalQuantity !== quantityRef.current && cart?.totalQuantity > 0) {
            if (!isOpen) {
                setIsOpen(true);
            }
            quantityRef.current = cart?.totalQuantity;
        }
    }, [
        isOpen,
        cart?.totalQuantity,
        quantityRef
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                "aria-label": "Open cart",
                onClick: openCart,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$open$2d$cart$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    quantity: cart?.totalQuantity
                }, void 0, false, {
                    fileName: "[project]/components/cart/modal.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/cart/modal.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$transition$2f$transition$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Transition"], {
                show: isOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$dialog$2f$dialog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
                    onClose: closeCart,
                    className: "relative z-50",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$transition$2f$transition$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Transition"].Child, {
                            as: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"],
                            enter: "transition-all ease-in-out duration-300",
                            enterFrom: "opacity-0 backdrop-blur-none",
                            enterTo: "opacity-100 backdrop-blur-[.5px]",
                            leave: "transition-all ease-in-out duration-200",
                            leaveFrom: "opacity-100 backdrop-blur-[.5px]",
                            leaveTo: "opacity-0 backdrop-blur-none",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fixed inset-0 bg-black/30",
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/components/cart/modal.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/cart/modal.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$transition$2f$transition$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Transition"].Child, {
                            as: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"],
                            enter: "transition-all ease-in-out duration-300",
                            enterFrom: "translate-x-full",
                            enterTo: "translate-x-0",
                            leave: "transition-all ease-in-out duration-200",
                            leaveFrom: "translate-x-0",
                            leaveTo: "translate-x-full",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$dialog$2f$dialog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"].Panel, {
                                className: "fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl md:w-[390px] dark:border-neutral-700 dark:bg-black/80 dark:text-white",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-lg font-semibold",
                                                children: "My Cart"
                                            }, void 0, false, {
                                                fileName: "[project]/components/cart/modal.tsx",
                                                lineNumber: 79,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                "aria-label": "Close cart",
                                                onClick: closeCart,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CloseCart, {}, void 0, false, {
                                                    fileName: "[project]/components/cart/modal.tsx",
                                                    lineNumber: 81,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/cart/modal.tsx",
                                                lineNumber: 80,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/cart/modal.tsx",
                                        lineNumber: 78,
                                        columnNumber: 15
                                    }, this),
                                    !cart || cart.lines.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-20 flex w-full flex-col items-center justify-center overflow-hidden",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ShoppingCartIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCartIcon$3e$__["ShoppingCartIcon"], {
                                                className: "h-16"
                                            }, void 0, false, {
                                                fileName: "[project]/components/cart/modal.tsx",
                                                lineNumber: 87,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-6 text-center text-2xl font-bold",
                                                children: "Your cart is empty."
                                            }, void 0, false, {
                                                fileName: "[project]/components/cart/modal.tsx",
                                                lineNumber: 88,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/cart/modal.tsx",
                                        lineNumber: 86,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex h-full flex-col justify-between overflow-hidden p-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "grow overflow-auto py-4",
                                                children: cart.lines.sort((a, b)=>a.merchandise.product.title.localeCompare(b.merchandise.product.title)).map((item, i)=>{
                                                    const merchandiseSearchParams = {};
                                                    item.merchandise.selectedOptions.forEach(({ name, value })=>{
                                                        if (value !== __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_OPTION"]) {
                                                            merchandiseSearchParams[name.toLowerCase()] = value;
                                                        }
                                                    });
                                                    const merchandiseUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createUrl"])(`/product/${item.merchandise.product.handle}`, new URLSearchParams(merchandiseSearchParams));
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        className: "flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative flex w-full flex-row justify-between px-1 py-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "absolute z-40 -ml-1 -mt-2",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$delete$2d$item$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DeleteItemButton"], {
                                                                        item: item,
                                                                        optimisticUpdate: updateCartItem
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/cart/modal.tsx",
                                                                        lineNumber: 126,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/cart/modal.tsx",
                                                                    lineNumber: 125,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-row",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "relative h-16 w-16 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                                className: "h-full w-full object-cover",
                                                                                width: 64,
                                                                                height: 64,
                                                                                alt: item.merchandise.product.featuredImage.altText || item.merchandise.product.title,
                                                                                src: item.merchandise.product.featuredImage.url
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/cart/modal.tsx",
                                                                                lineNumber: 133,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/cart/modal.tsx",
                                                                            lineNumber: 132,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                            href: merchandiseUrl,
                                                                            onClick: closeCart,
                                                                            className: "z-30 ml-2 flex flex-row space-x-4",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex flex-1 flex-col text-base",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "leading-tight",
                                                                                        children: item.merchandise.product.title
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/cart/modal.tsx",
                                                                                        lineNumber: 153,
                                                                                        columnNumber: 37
                                                                                    }, this),
                                                                                    item.merchandise.title !== __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_OPTION"] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-sm text-neutral-500 dark:text-neutral-400",
                                                                                        children: item.merchandise.title
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/cart/modal.tsx",
                                                                                        lineNumber: 158,
                                                                                        columnNumber: 39
                                                                                    }, this) : null
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/cart/modal.tsx",
                                                                                lineNumber: 152,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/cart/modal.tsx",
                                                                            lineNumber: 147,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/cart/modal.tsx",
                                                                    lineNumber: 131,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex h-16 flex-col justify-between",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$price$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                            className: "flex justify-end space-y-2 text-right text-sm",
                                                                            amount: item.cost.totalAmount.amount,
                                                                            currencyCode: item.cost.totalAmount.currencyCode
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/cart/modal.tsx",
                                                                            lineNumber: 166,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$edit$2d$item$2d$quantity$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EditItemQuantityButton"], {
                                                                                    item: item,
                                                                                    type: "minus",
                                                                                    optimisticUpdate: updateCartItem
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/cart/modal.tsx",
                                                                                    lineNumber: 174,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "w-6 text-center",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "w-full text-sm",
                                                                                        children: item.quantity
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/cart/modal.tsx",
                                                                                        lineNumber: 180,
                                                                                        columnNumber: 37
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/cart/modal.tsx",
                                                                                    lineNumber: 179,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$edit$2d$item$2d$quantity$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EditItemQuantityButton"], {
                                                                                    item: item,
                                                                                    type: "plus",
                                                                                    optimisticUpdate: updateCartItem
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/cart/modal.tsx",
                                                                                    lineNumber: 184,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/cart/modal.tsx",
                                                                            lineNumber: 173,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/cart/modal.tsx",
                                                                    lineNumber: 165,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/cart/modal.tsx",
                                                            lineNumber: 124,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, i, false, {
                                                        fileName: "[project]/components/cart/modal.tsx",
                                                        lineNumber: 120,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/components/cart/modal.tsx",
                                                lineNumber: 94,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "py-4 text-sm text-neutral-500 dark:text-neutral-400",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: "Taxes"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/cart/modal.tsx",
                                                                lineNumber: 198,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$price$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                className: "text-right text-base text-black dark:text-white",
                                                                amount: cart.cost.totalTaxAmount.amount,
                                                                currencyCode: cart.cost.totalTaxAmount.currencyCode
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/cart/modal.tsx",
                                                                lineNumber: 199,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/cart/modal.tsx",
                                                        lineNumber: 197,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: "Shipping"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/cart/modal.tsx",
                                                                lineNumber: 206,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-right",
                                                                children: "Calculated at checkout"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/cart/modal.tsx",
                                                                lineNumber: 207,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/cart/modal.tsx",
                                                        lineNumber: 205,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: "Total"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/cart/modal.tsx",
                                                                lineNumber: 210,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$price$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                className: "text-right text-base text-black dark:text-white",
                                                                amount: cart.cost.totalAmount.amount,
                                                                currencyCode: cart.cost.totalAmount.currencyCode
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/cart/modal.tsx",
                                                                lineNumber: 211,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/cart/modal.tsx",
                                                        lineNumber: 209,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/cart/modal.tsx",
                                                lineNumber: 196,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                                action: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$data$3a$828780__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["redirectToCheckout"],
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckoutButton, {}, void 0, false, {
                                                    fileName: "[project]/components/cart/modal.tsx",
                                                    lineNumber: 219,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/cart/modal.tsx",
                                                lineNumber: 218,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/cart/modal.tsx",
                                        lineNumber: 93,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/cart/modal.tsx",
                                lineNumber: 77,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/cart/modal.tsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/cart/modal.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/cart/modal.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function CloseCart({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$XMarkIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XMarkIcon$3e$__["XMarkIcon"], {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])('h-6 transition-all ease-in-out hover:scale-110', className)
        }, void 0, false, {
            fileName: "[project]/components/cart/modal.tsx",
            lineNumber: 234,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/cart/modal.tsx",
        lineNumber: 233,
        columnNumber: 5
    }, this);
}
function CheckoutButton() {
    const { pending } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFormStatus"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: "block w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white opacity-90 hover:opacity-100",
        type: "submit",
        disabled: pending,
        children: pending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$loading$2d$dots$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            className: "bg-white"
        }, void 0, false, {
            fileName: "[project]/components/cart/modal.tsx",
            lineNumber: 253,
            columnNumber: 18
        }, this) : 'Proceed to Checkout'
    }, void 0, false, {
        fileName: "[project]/components/cart/modal.tsx",
        lineNumber: 248,
        columnNumber: 5
    }, this);
}
}}),
"[project]/components/layout/navbar/search.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "SearchSkeleton": (()=>SearchSkeleton),
    "default": (()=>Search)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$MagnifyingGlassIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MagnifyingGlassIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/MagnifyingGlassIcon.js [app-ssr] (ecmascript) <export default as MagnifyingGlassIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$form$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/form.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function Search() {
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$form$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        action: "/search",
        className: "w-max-[550px] relative w-full lg:w-80 xl:w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "text",
                name: "q",
                placeholder: "Search for products...",
                autoComplete: "off",
                defaultValue: searchParams?.get('q') || '',
                className: "text-md w-full rounded-lg border bg-white px-4 py-2 text-black placeholder:text-neutral-500 md:text-sm dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
            }, searchParams?.get('q'), false, {
                fileName: "[project]/components/layout/navbar/search.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-0 top-0 mr-3 flex h-full items-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$MagnifyingGlassIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MagnifyingGlassIcon$3e$__["MagnifyingGlassIcon"], {
                    className: "h-4"
                }, void 0, false, {
                    fileName: "[project]/components/layout/navbar/search.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/layout/navbar/search.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/layout/navbar/search.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
function SearchSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        className: "w-max-[550px] relative w-full lg:w-80 xl:w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                placeholder: "Search for products...",
                className: "w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
            }, void 0, false, {
                fileName: "[project]/components/layout/navbar/search.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-0 top-0 mr-3 flex h-full items-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$MagnifyingGlassIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MagnifyingGlassIcon$3e$__["MagnifyingGlassIcon"], {
                    className: "h-4"
                }, void 0, false, {
                    fileName: "[project]/components/layout/navbar/search.tsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/layout/navbar/search.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/layout/navbar/search.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
}}),
"[project]/components/layout/navbar/mobile-menu.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>MobileMenu)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$dialog$2f$dialog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@headlessui/react/dist/components/dialog/dialog.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$transition$2f$transition$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@headlessui/react/dist/components/transition/transition.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$Bars3Icon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bars3Icon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/Bars3Icon.js [app-ssr] (ecmascript) <export default as Bars3Icon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$XMarkIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XMarkIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/XMarkIcon.js [app-ssr] (ecmascript) <export default as XMarkIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$navbar$2f$search$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/navbar/search.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function MobileMenu({ menu }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const openMobileMenu = ()=>setIsOpen(true);
    const closeMobileMenu = ()=>setIsOpen(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleResize = ()=>{
            if (window.innerWidth > 768) {
                setIsOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return ()=>window.removeEventListener('resize', handleResize);
    }, [
        isOpen
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setIsOpen(false);
    }, [
        pathname,
        searchParams
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: openMobileMenu,
                "aria-label": "Open mobile menu",
                className: "flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors md:hidden dark:border-neutral-700 dark:text-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$Bars3Icon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bars3Icon$3e$__["Bars3Icon"], {
                    className: "h-4"
                }, void 0, false, {
                    fileName: "[project]/components/layout/navbar/mobile-menu.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/layout/navbar/mobile-menu.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$transition$2f$transition$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Transition"], {
                show: isOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$dialog$2f$dialog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
                    onClose: closeMobileMenu,
                    className: "relative z-50",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$transition$2f$transition$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Transition"].Child, {
                            as: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"],
                            enter: "transition-all ease-in-out duration-300",
                            enterFrom: "opacity-0 backdrop-blur-none",
                            enterTo: "opacity-100 backdrop-blur-[.5px]",
                            leave: "transition-all ease-in-out duration-200",
                            leaveFrom: "opacity-100 backdrop-blur-[.5px]",
                            leaveTo: "opacity-0 backdrop-blur-none",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fixed inset-0 bg-black/30",
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/components/layout/navbar/mobile-menu.tsx",
                                lineNumber: 53,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/layout/navbar/mobile-menu.tsx",
                            lineNumber: 44,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$transition$2f$transition$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Transition"].Child, {
                            as: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"],
                            enter: "transition-all ease-in-out duration-300",
                            enterFrom: "translate-x-[-100%]",
                            enterTo: "translate-x-0",
                            leave: "transition-all ease-in-out duration-200",
                            leaveFrom: "translate-x-0",
                            leaveTo: "translate-x-[-100%]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$headlessui$2f$react$2f$dist$2f$components$2f$dialog$2f$dialog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"].Panel, {
                                className: "fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col bg-white pb-6 dark:bg-black",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white",
                                            onClick: closeMobileMenu,
                                            "aria-label": "Close mobile menu",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$XMarkIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XMarkIcon$3e$__["XMarkIcon"], {
                                                className: "h-6"
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/navbar/mobile-menu.tsx",
                                                lineNumber: 71,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/navbar/mobile-menu.tsx",
                                            lineNumber: 66,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-4 w-full",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
                                                fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$navbar$2f$search$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SearchSkeleton"], {}, void 0, false, {
                                                    fileName: "[project]/components/layout/navbar/mobile-menu.tsx",
                                                    lineNumber: 75,
                                                    columnNumber: 39
                                                }, void 0),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$navbar$2f$search$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                    fileName: "[project]/components/layout/navbar/mobile-menu.tsx",
                                                    lineNumber: 76,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/navbar/mobile-menu.tsx",
                                                lineNumber: 75,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/navbar/mobile-menu.tsx",
                                            lineNumber: 74,
                                            columnNumber: 17
                                        }, this),
                                        menu.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "flex w-full flex-col",
                                            children: menu.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "py-2 text-xl text-black transition-colors hover:text-neutral-500 dark:text-white",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: item.path,
                                                        prefetch: true,
                                                        onClick: closeMobileMenu,
                                                        children: item.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/layout/navbar/mobile-menu.tsx",
                                                        lineNumber: 86,
                                                        columnNumber: 25
                                                    }, this)
                                                }, item.title, false, {
                                                    fileName: "[project]/components/layout/navbar/mobile-menu.tsx",
                                                    lineNumber: 82,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/navbar/mobile-menu.tsx",
                                            lineNumber: 80,
                                            columnNumber: 19
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/layout/navbar/mobile-menu.tsx",
                                    lineNumber: 65,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/layout/navbar/mobile-menu.tsx",
                                lineNumber: 64,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/layout/navbar/mobile-menu.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/layout/navbar/mobile-menu.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/layout/navbar/mobile-menu.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}}),
"[project]/components/welcome-toast.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "WelcomeToast": (()=>WelcomeToast)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
function WelcomeToast() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // ignore if screen height is too small
        if (window.innerHeight < 650) return;
        if (!document.cookie.includes('welcome-toast=2')) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"])('🛍️ Welcome to Next.js Commerce!', {
                id: 'welcome-toast',
                duration: Infinity,
                onDismiss: ()=>{
                    document.cookie = 'welcome-toast=2; max-age=31536000; path=/';
                },
                description: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        "This is a high-performance, SSR storefront powered by Shopify, Next.js, and Vercel.",
                        ' ',
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "https://vercel.com/templates/next.js/nextjs-commerce",
                            className: "text-blue-600 hover:underline",
                            target: "_blank",
                            children: "Deploy your own"
                        }, void 0, false, {
                            fileName: "[project]/components/welcome-toast.tsx",
                            lineNumber: 20,
                            columnNumber: 13
                        }, this),
                        "."
                    ]
                }, void 0, true)
            });
        }
    }, []);
    return null;
}
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__1f94d43a._.js.map