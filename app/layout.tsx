import 'app/globals.css';
import { CartProvider } from 'components/cart/cart-context';
import { Navbar } from 'components/layout/navbar';
import { WelcomeToast } from 'components/welcome-toast';
import { GeistSans } from 'geist/font/sans';
import { getCart } from 'lib/shopify';
import { ReactNode, Suspense } from 'react';
import { Toaster } from 'sonner';
import { cookies } from 'next/headers';
import { baseUrl } from 'lib/utils';

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  }
};

export default async function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  let cartId = cookieStore.get('cartId')?.value;
  let cart;

  // We will only try to fetch a cart if the cartId cookie already exists.
  if (cartId) {
    cart = await getCart(cartId);
  }

  // The logic to CREATE a cart and SET the cookie has been removed from this file.
  // It now correctly lives inside the `addItem` Server Action, which is the proper
  // place for it. This resolves the error.

  const cartPromise = Promise.resolve(cart);

  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-white text-black selection:bg-teal-300">
        <CartProvider cartPromise={cartPromise}>
          <Suspense>
            <Navbar />
          </Suspense>
          <main>
            <Suspense>
              {children}
            </Suspense>
            <Toaster closeButton />
            <WelcomeToast />
          </main>
        </CartProvider>
      </body>
    </html>
  );
}