import { ReactNode } from 'react';

export default function CmsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full">
      {/* Keep styles inside the route layout to avoid conflicting with root <html> element classes */}
      <style
        // Static CSS string to avoid hydration drift
        dangerouslySetInnerHTML={{
          __html: `
            /* Keep styles minimal to avoid conflicting with Tailwind utilities */
            *, *::before, *::after { box-sizing: border-box; }
            html, body { height: 100%; font-family: system-ui; background: #000; color: #e5e7eb; }

            /* Only hide obvious cart elements, don't block everything */
            .cart, #cart, .side-cart, .shopping-cart, .cart-drawer, .cart-sidebar,
            .cart-overlay, .cart-modal, .cart-panel, .minicart, .mini-cart {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              pointer-events: none !important;
            }
          `
        }}
      />
      <div id="cms-root" className="h-full">
        {children}
      </div>
    </div>
  );
}