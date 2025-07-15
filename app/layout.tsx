import 'app/globals.css';
import { CartProvider } from 'components/cart/cart-context';
import { Navbar } from 'components/layout/navbar';
import { WelcomeToast } from 'components/welcome-toast';
import { GeistSans } from 'geist/font/sans';
import { getCart, createCart } from 'lib/shopify';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

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
  if (cartId) {
    try {
      cart = await getCart(cartId);
    } catch (e) {
      console.error('Error fetching cart with existing ID:', e);
      cart = undefined;
    }

    if (!cart) {
      console.log('Existing cart ID is invalid or cart not found, creating a new cart.');
      cookieStore.delete('cartId');
      cartId = undefined;
    }
  }

  if (!cartId) {
    try {
      cart = await createCart();
      if (cart?.id) {
        cookieStore.set('cartId', cart.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });
        console.log('New cart created and ID set in cookie:', cart.id);
      } else {
        console.error('Failed to create new cart, no ID returned.');
      }
    } catch (e) {
      console.error('Error creating cart:', e);
      cart = undefined;
    }
  }

  const cartPromise = Promise.resolve(cart);

  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-white text-black selection:bg-teal-300">
        {/* FIX: Move Navbar inside CartProvider */}
        <CartProvider cartPromise={cartPromise}>
          <Suspense>
            <Navbar /> {/* Navbar is now inside CartProvider */}
          </Suspense>
          <main>
            {children}
            <Toaster closeButton />
            <WelcomeToast />
          </main>
        </CartProvider>
      </body>
    </html>
  );
}