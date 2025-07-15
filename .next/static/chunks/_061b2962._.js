(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_061b2962._.js", {

"[project]/components/layout/footer-menu.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "FooterMenuItem": (()=>FooterMenuItem),
    "default": (()=>FooterMenu)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-experimental/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-experimental/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function FooterMenuItem({ item }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(pathname === item.path);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FooterMenuItem.useEffect": ()=>{
            setActive(pathname === item.path);
        }
    }["FooterMenuItem.useEffect"], [
        pathname,
        item.path
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: item.path,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm dark:hover:text-neutral-300', {
                'text-black dark:text-neutral-300': active
            }),
            children: item.title
        }, void 0, false, {
            fileName: "[project]/components/layout/footer-menu.tsx",
            lineNumber: 19,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/layout/footer-menu.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
_s(FooterMenuItem, "NYKaqc6Wx6/HR50pW40oywHhOBI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = FooterMenuItem;
function FooterMenu({ menu }) {
    if (!menu.length) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
            children: menu.map((item)=>{
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FooterMenuItem, {
                    item: item
                }, item.title, false, {
                    fileName: "[project]/components/layout/footer-menu.tsx",
                    lineNumber: 41,
                    columnNumber: 18
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/components/layout/footer-menu.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/layout/footer-menu.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c1 = FooterMenu;
var _c, _c1;
__turbopack_context__.k.register(_c, "FooterMenuItem");
__turbopack_context__.k.register(_c1, "FooterMenu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/label.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-experimental/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$price$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/price.tsx [app-client] (ecmascript)");
;
;
;
const Label = ({ title, amount, currencyCode, position = 'bottom' })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('absolute bottom-0 left-0 flex w-full px-4 pb-4 @container/label', {
            'lg:px-20 lg:pb-[35%]': position === 'center'
        }),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center rounded-full border bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "mr-4 line-clamp-2 grow pl-2 leading-none tracking-tight",
                    children: title
                }, void 0, false, {
                    fileName: "[project]/components/label.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$price$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    className: "flex-none rounded-full bg-blue-600 p-2 text-white",
                    amount: amount,
                    currencyCode: currencyCode,
                    currencyCodeClassName: "hidden @[275px]/label:inline"
                }, void 0, false, {
                    fileName: "[project]/components/label.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/label.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/label.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
};
_c = Label;
const __TURBOPACK__default__export__ = Label;
var _c;
__turbopack_context__.k.register(_c, "Label");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/grid/tile.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "GridTileImage": (()=>GridTileImage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-experimental/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/label.tsx [app-client] (ecmascript)");
;
;
;
;
function GridTileImage({ isInteractive = true, active, label, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-blue-600 dark:bg-black', {
            relative: label,
            'border-2 border-blue-600': active,
            'border-neutral-200 dark:border-neutral-800': !active
        }),
        children: [
            props.src ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('relative h-full w-full object-contain', {
                    'transition duration-300 ease-in-out group-hover:scale-105': isInteractive
                }),
                ...props
            }, void 0, false, {
                fileName: "[project]/components/grid/tile.tsx",
                lineNumber: 32,
                columnNumber: 9
            }, this) : null,
            label ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: label.title,
                amount: label.amount,
                currencyCode: label.currencyCode,
                position: label.position
            }, void 0, false, {
                fileName: "[project]/components/grid/tile.tsx",
                lineNumber: 40,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/grid/tile.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_c = GridTileImage;
var _c;
__turbopack_context__.k.register(_c, "GridTileImage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/product/product-context.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ProductProvider": (()=>ProductProvider),
    "useProduct": (()=>useProduct),
    "useUpdateURL": (()=>useUpdateURL)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-experimental/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-experimental/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
'use client';
;
;
const ProductContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function ProductProvider({ children }) {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const getInitialState = ()=>{
        const params = {};
        for (const [key, value] of searchParams.entries()){
            params[key] = value;
        }
        return params;
    };
    const [state, setOptimisticState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOptimistic"])(getInitialState(), {
        "ProductProvider.useOptimistic": (prevState, update)=>({
                ...prevState,
                ...update
            })
    }["ProductProvider.useOptimistic"]);
    const updateOption = (name, value)=>{
        const newState = {
            [name]: value
        };
        setOptimisticState(newState);
        return {
            ...state,
            ...newState
        };
    };
    const updateImage = (index)=>{
        const newState = {
            image: index
        };
        setOptimisticState(newState);
        return {
            ...state,
            ...newState
        };
    };
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductProvider.useMemo[value]": ()=>({
                state,
                updateOption,
                updateImage
            })
    }["ProductProvider.useMemo[value]"], [
        state
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/product/product-context.tsx",
        lineNumber: 60,
        columnNumber: 10
    }, this);
}
_s(ProductProvider, "pfr7dLOWmR3RTPUyKCo7IFU7L7I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOptimistic"]
    ];
});
_c = ProductProvider;
function useProduct() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ProductContext);
    if (context === undefined) {
        throw new Error('useProduct must be used within a ProductProvider');
    }
    return context;
}
_s1(useProduct, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function useUpdateURL() {
    _s2();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    return (state)=>{
        const newParams = new URLSearchParams(window.location.search);
        Object.entries(state).forEach(([key, value])=>{
            newParams.set(key, value);
        });
        router.push(`?${newParams.toString()}`, {
            scroll: false
        });
    };
}
_s2(useUpdateURL, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
var _c;
__turbopack_context__.k.register(_c, "ProductProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/product/gallery.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Gallery": (()=>Gallery)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-experimental/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowLeftIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeftIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ArrowLeftIcon.js [app-client] (ecmascript) <export default as ArrowLeftIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowRightIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRightIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ArrowRightIcon.js [app-client] (ecmascript) <export default as ArrowRightIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$grid$2f$tile$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/grid/tile.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2f$product$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/product/product-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function Gallery({ images }) {
    _s();
    const { state, updateImage } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2f$product$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProduct"])();
    const updateURL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2f$product$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateURL"])();
    const imageIndex = state.image ? parseInt(state.image) : 0;
    const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
    const previousImageIndex = imageIndex === 0 ? images.length - 1 : imageIndex - 1;
    const buttonClassName = 'h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative aspect-square h-full max-h-[550px] w-full overflow-hidden",
                children: [
                    images[imageIndex] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        className: "h-full w-full object-contain",
                        fill: true,
                        sizes: "(min-width: 1024px) 66vw, 100vw",
                        alt: images[imageIndex]?.altText,
                        src: images[imageIndex]?.src,
                        priority: true
                    }, void 0, false, {
                        fileName: "[project]/components/product/gallery.tsx",
                        lineNumber: 23,
                        columnNumber: 11
                    }, this),
                    images.length > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-[15%] flex w-full justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur-sm dark:border-black dark:bg-neutral-900/80",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    formAction: ()=>{
                                        const newState = updateImage(previousImageIndex.toString());
                                        updateURL(newState);
                                    },
                                    "aria-label": "Previous product image",
                                    className: buttonClassName,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowLeftIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeftIcon$3e$__["ArrowLeftIcon"], {
                                        className: "h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/product/gallery.tsx",
                                        lineNumber: 44,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/product/gallery.tsx",
                                    lineNumber: 36,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mx-1 h-6 w-px bg-neutral-500"
                                }, void 0, false, {
                                    fileName: "[project]/components/product/gallery.tsx",
                                    lineNumber: 46,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    formAction: ()=>{
                                        const newState = updateImage(nextImageIndex.toString());
                                        updateURL(newState);
                                    },
                                    "aria-label": "Next product image",
                                    className: buttonClassName,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowRightIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRightIcon$3e$__["ArrowRightIcon"], {
                                        className: "h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/product/gallery.tsx",
                                        lineNumber: 55,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/product/gallery.tsx",
                                    lineNumber: 47,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/product/gallery.tsx",
                            lineNumber: 35,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/product/gallery.tsx",
                        lineNumber: 34,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/product/gallery.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            images.length > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "my-12 flex items-center flex-wrap justify-center gap-2 overflow-auto py-1 lg:mb-0",
                children: images.map((image, index)=>{
                    const isActive = index === imageIndex;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "h-20 w-20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            formAction: ()=>{
                                const newState = updateImage(index.toString());
                                updateURL(newState);
                            },
                            "aria-label": "Select product image",
                            className: "h-full w-full",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$grid$2f$tile$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GridTileImage"], {
                                alt: image.altText,
                                src: image.src,
                                width: 80,
                                height: 80,
                                active: isActive
                            }, void 0, false, {
                                fileName: "[project]/components/product/gallery.tsx",
                                lineNumber: 77,
                                columnNumber: 19
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/product/gallery.tsx",
                            lineNumber: 69,
                            columnNumber: 17
                        }, this)
                    }, image.src, false, {
                        fileName: "[project]/components/product/gallery.tsx",
                        lineNumber: 68,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/product/gallery.tsx",
                lineNumber: 63,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/product/gallery.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_s(Gallery, "S+E4xS8FV7DZmAMZHFia8Agxj0g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2f$product$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProduct"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2f$product$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateURL"]
    ];
});
_c = Gallery;
var _c;
__turbopack_context__.k.register(_c, "Gallery");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/cart/data:3dd932 [app-client] (ecmascript) <text/javascript>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"60e59b8e84b2d28cefd90ce0e2a5c49bb892e8db2b":"addItem"},"components/cart/actions.ts",""] */ __turbopack_context__.s({
    "addItem": (()=>addItem)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var addItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("60e59b8e84b2d28cefd90ce0e2a5c49bb892e8db2b", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "addItem"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHNlcnZlcic7XG5cbmltcG9ydCB7IFRBR1MgfSBmcm9tICdsaWIvY29uc3RhbnRzJztcbmltcG9ydCB7XG4gIGFkZFRvQ2FydCxcbiAgY3JlYXRlQ2FydCxcbiAgZ2V0Q2FydCxcbiAgcmVtb3ZlRnJvbUNhcnQsXG4gIHVwZGF0ZUNhcnRcbn0gZnJvbSAnbGliL3Nob3BpZnknO1xuaW1wb3J0IHsgcmV2YWxpZGF0ZVRhZyB9IGZyb20gJ25leHQvY2FjaGUnO1xuaW1wb3J0IHsgY29va2llcyB9IGZyb20gJ25leHQvaGVhZGVycyc7XG5pbXBvcnQgeyByZWRpcmVjdCB9IGZyb20gJ25leHQvbmF2aWdhdGlvbic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRJdGVtKFxuICBwcmV2U3RhdGU6IGFueSxcbiAgc2VsZWN0ZWRWYXJpYW50SWQ6IHN0cmluZyB8IHVuZGVmaW5lZFxuKSB7XG4gIGlmICghc2VsZWN0ZWRWYXJpYW50SWQpIHtcbiAgICByZXR1cm4gJ0Vycm9yIGFkZGluZyBpdGVtIHRvIGNhcnQnO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBhd2FpdCBhZGRUb0NhcnQoW3sgbWVyY2hhbmRpc2VJZDogc2VsZWN0ZWRWYXJpYW50SWQsIHF1YW50aXR5OiAxIH1dKTtcbiAgICByZXZhbGlkYXRlVGFnKFRBR1MuY2FydCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gJ0Vycm9yIGFkZGluZyBpdGVtIHRvIGNhcnQnO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW1vdmVJdGVtKHByZXZTdGF0ZTogYW55LCBtZXJjaGFuZGlzZUlkOiBzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBjYXJ0ID0gYXdhaXQgZ2V0Q2FydCgpO1xuXG4gICAgaWYgKCFjYXJ0KSB7XG4gICAgICByZXR1cm4gJ0Vycm9yIGZldGNoaW5nIGNhcnQnO1xuICAgIH1cblxuICAgIGNvbnN0IGxpbmVJdGVtID0gY2FydC5saW5lcy5maW5kKFxuICAgICAgKGxpbmUpID0+IGxpbmUubWVyY2hhbmRpc2UuaWQgPT09IG1lcmNoYW5kaXNlSWRcbiAgICApO1xuXG4gICAgaWYgKGxpbmVJdGVtICYmIGxpbmVJdGVtLmlkKSB7XG4gICAgICBhd2FpdCByZW1vdmVGcm9tQ2FydChbbGluZUl0ZW0uaWRdKTtcbiAgICAgIHJldmFsaWRhdGVUYWcoVEFHUy5jYXJ0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdJdGVtIG5vdCBmb3VuZCBpbiBjYXJ0JztcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gJ0Vycm9yIHJlbW92aW5nIGl0ZW0gZnJvbSBjYXJ0JztcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlSXRlbVF1YW50aXR5KFxuICBwcmV2U3RhdGU6IGFueSxcbiAgcGF5bG9hZDoge1xuICAgIG1lcmNoYW5kaXNlSWQ6IHN0cmluZztcbiAgICBxdWFudGl0eTogbnVtYmVyO1xuICB9XG4pIHtcbiAgY29uc3QgeyBtZXJjaGFuZGlzZUlkLCBxdWFudGl0eSB9ID0gcGF5bG9hZDtcblxuICB0cnkge1xuICAgIGNvbnN0IGNhcnQgPSBhd2FpdCBnZXRDYXJ0KCk7XG5cbiAgICBpZiAoIWNhcnQpIHtcbiAgICAgIHJldHVybiAnRXJyb3IgZmV0Y2hpbmcgY2FydCc7XG4gICAgfVxuXG4gICAgY29uc3QgbGluZUl0ZW0gPSBjYXJ0LmxpbmVzLmZpbmQoXG4gICAgICAobGluZSkgPT4gbGluZS5tZXJjaGFuZGlzZS5pZCA9PT0gbWVyY2hhbmRpc2VJZFxuICAgICk7XG5cbiAgICBpZiAobGluZUl0ZW0gJiYgbGluZUl0ZW0uaWQpIHtcbiAgICAgIGlmIChxdWFudGl0eSA9PT0gMCkge1xuICAgICAgICBhd2FpdCByZW1vdmVGcm9tQ2FydChbbGluZUl0ZW0uaWRdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF3YWl0IHVwZGF0ZUNhcnQoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGlkOiBsaW5lSXRlbS5pZCxcbiAgICAgICAgICAgIG1lcmNoYW5kaXNlSWQsXG4gICAgICAgICAgICBxdWFudGl0eVxuICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChxdWFudGl0eSA+IDApIHtcbiAgICAgIC8vIElmIHRoZSBpdGVtIGRvZXNuJ3QgZXhpc3QgaW4gdGhlIGNhcnQgYW5kIHF1YW50aXR5ID4gMCwgYWRkIGl0XG4gICAgICBhd2FpdCBhZGRUb0NhcnQoW3sgbWVyY2hhbmRpc2VJZCwgcXVhbnRpdHkgfV0pO1xuICAgIH1cblxuICAgIHJldmFsaWRhdGVUYWcoVEFHUy5jYXJ0KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgcmV0dXJuICdFcnJvciB1cGRhdGluZyBpdGVtIHF1YW50aXR5JztcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVkaXJlY3RUb0NoZWNrb3V0KCkge1xuICBsZXQgY2FydCA9IGF3YWl0IGdldENhcnQoKTtcbiAgcmVkaXJlY3QoY2FydCEuY2hlY2tvdXRVcmwpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlQ2FydEFuZFNldENvb2tpZSgpIHtcbiAgbGV0IGNhcnQgPSBhd2FpdCBjcmVhdGVDYXJ0KCk7XG4gIChhd2FpdCBjb29raWVzKCkpLnNldCgnY2FydElkJywgY2FydC5pZCEpO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIyUkFjc0IifQ==
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/cart/add-to-cart.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "AddToCart": (()=>AddToCart)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-experimental/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$data$3a$3dd932__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/components/cart/data:3dd932 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2f$product$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/product/product-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-experimental/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$cart$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/cart/cart-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function SubmitButton({ availableForSale, selectedVariantId }) {
    const buttonClasses = // UPDATED STYLES HERE
    'relative flex w-full items-center justify-center rounded-md bg-white p-3 text-center text-sm font-medium text-black';
    const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';
    if (!availableForSale) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            disabled: true,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(buttonClasses, disabledClasses),
            children: "Out Of Stock"
        }, void 0, false, {
            fileName: "[project]/components/cart/add-to-cart.tsx",
            lineNumber: 24,
            columnNumber: 7
        }, this);
    }
    if (!selectedVariantId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            "aria-label": "Please select an option",
            disabled: true,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(buttonClasses, disabledClasses),
            children: "Add To Cart"
        }, void 0, false, {
            fileName: "[project]/components/cart/add-to-cart.tsx",
            lineNumber: 32,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        "aria-label": "Add to cart",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(buttonClasses, {
            'hover:opacity-90': true
        }),
        children: "Add To Cart"
    }, void 0, false, {
        fileName: "[project]/components/cart/add-to-cart.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_c = SubmitButton;
function AddToCart({ product }) {
    _s();
    const { variants } = product;
    const { addCartItem } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$cart$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"])();
    const { state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2f$product$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProduct"])();
    const [message, formAction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActionState"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$data$3a$3dd932__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["addItem"], null);
    const variant = variants.find((variant)=>variant.selectedOptions.every((option)=>option.value === state[option.name.toLowerCase()]));
    const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
    const selectedVariantId = variant?.id || defaultVariantId;
    const addItemAction = formAction.bind(null, selectedVariantId);
    const finalVariant = variants.find((variant)=>variant.id === selectedVariantId);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        action: async ()=>{
            // Optimistic UI update
            if (finalVariant) {
                addCartItem(finalVariant, product);
            }
            // Server action
            await addItemAction();
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SubmitButton, {
                availableForSale: product.availableForSale,
                selectedVariantId: selectedVariantId
            }, void 0, false, {
                fileName: "[project]/components/cart/add-to-cart.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                "aria-live": "polite",
                className: "sr-only",
                role: "status",
                children: message
            }, void 0, false, {
                fileName: "[project]/components/cart/add-to-cart.tsx",
                lineNumber: 87,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/cart/add-to-cart.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_s(AddToCart, "usPnMV/aRgEfJSnM9XDcgpQcaXc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$cart$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2f$product$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProduct"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActionState"]
    ];
});
_c1 = AddToCart;
var _c, _c1;
__turbopack_context__.k.register(_c, "SubmitButton");
__turbopack_context__.k.register(_c1, "AddToCart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/product/variant-selector.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "VariantSelector": (()=>VariantSelector)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-experimental/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2f$product$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/product/product-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function VariantSelector({ options, variants }) {
    _s();
    const { state, updateOption } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2f$product$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProduct"])();
    const updateURL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2f$product$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateURL"])();
    const hasNoOptionsOrJustOneOption = !options.length || options.length === 1 && options[0]?.values.length === 1;
    if (hasNoOptionsOrJustOneOption) {
        return null;
    }
    const combinations = variants.map((variant)=>({
            id: variant.id,
            availableForSale: variant.availableForSale,
            ...variant.selectedOptions.reduce((accumulator, option)=>({
                    ...accumulator,
                    [option.name.toLowerCase()]: option.value
                }), {})
        }));
    return options.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                className: "mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                        className: "mb-4 text-sm uppercase tracking-wide",
                        children: option.name
                    }, void 0, false, {
                        fileName: "[project]/components/product/variant-selector.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                        className: "flex flex-wrap gap-3",
                        children: option.values.map((value)=>{
                            const optionNameLowerCase = option.name.toLowerCase();
                            const optionParams = {
                                ...state,
                                [optionNameLowerCase]: value
                            };
                            const filtered = Object.entries(optionParams).filter(([key, value])=>options.find((option)=>option.name.toLowerCase() === key && option.values.includes(value)));
                            const isAvailableForSale = combinations.find((combination)=>filtered.every(([key, value])=>combination[key] === value && combination.availableForSale));
                            const isActive = state[optionNameLowerCase] === value;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                formAction: ()=>{
                                    const newState = updateOption(optionNameLowerCase, value);
                                    updateURL(newState);
                                },
                                "aria-disabled": !isAvailableForSale,
                                disabled: !isAvailableForSale,
                                title: `${option.name} ${value}${!isAvailableForSale ? ' (Out of Stock)' : ''}`,
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(// UPDATED STYLES HERE
                                'flex min-w-[48px] items-center justify-center rounded-md border-2 bg-transparent px-3 py-2 text-sm', {
                                    'border-white': isActive,
                                    'border-neutral-700 transition duration-300 ease-in-out hover:border-white': !isActive && isAvailableForSale,
                                    'relative z-10 cursor-not-allowed overflow-hidden border-neutral-700 text-neutral-500 ring-neutral-700 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-700 before:transition-transform': !isAvailableForSale
                                }),
                                children: value
                            }, value, false, {
                                fileName: "[project]/components/product/variant-selector.tsx",
                                lineNumber: 59,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/product/variant-selector.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/product/variant-selector.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this)
        }, option.id, false, {
            fileName: "[project]/components/product/variant-selector.tsx",
            lineNumber: 39,
            columnNumber: 5
        }, this));
}
_s(VariantSelector, "66rVOhMvuy7NwSv2oQKxLNmv75o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2f$product$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProduct"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$product$2f$product$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateURL"]
    ];
});
_c = VariantSelector;
var _c;
__turbopack_context__.k.register(_c, "VariantSelector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/node_modules/@heroicons/react/24/outline/esm/ArrowLeftIcon.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-experimental/index.js [app-client] (ecmascript)");
;
function ArrowLeftIcon({ title, titleId, ...props }, svgRef) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])("svg", Object.assign({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: svgRef,
        "aria-labelledby": titleId
    }, props), title ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])("title", {
        id: titleId
    }, title) : null, /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
    }));
}
const ForwardRef = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(ArrowLeftIcon);
const __TURBOPACK__default__export__ = ForwardRef;
}}),
"[project]/node_modules/@heroicons/react/24/outline/esm/ArrowLeftIcon.js [app-client] (ecmascript) <export default as ArrowLeftIcon>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "ArrowLeftIcon": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowLeftIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowLeftIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ArrowLeftIcon.js [app-client] (ecmascript)");
}}),
"[project]/node_modules/@heroicons/react/24/outline/esm/ArrowRightIcon.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-experimental/index.js [app-client] (ecmascript)");
;
function ArrowRightIcon({ title, titleId, ...props }, svgRef) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])("svg", Object.assign({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: svgRef,
        "aria-labelledby": titleId
    }, props), title ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])("title", {
        id: titleId
    }, title) : null, /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
    }));
}
const ForwardRef = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$experimental$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(ArrowRightIcon);
const __TURBOPACK__default__export__ = ForwardRef;
}}),
"[project]/node_modules/@heroicons/react/24/outline/esm/ArrowRightIcon.js [app-client] (ecmascript) <export default as ArrowRightIcon>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "ArrowRightIcon": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowRightIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowRightIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ArrowRightIcon.js [app-client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=_061b2962._.js.map