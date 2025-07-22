// components/layout/footer.tsx
import LogoSquare from '@/components/logo-square';
import { Suspense } from 'react';

// Very small hard-coded menu for now
// Later you can swap in a DB query
const menu = {
  title: 'Quick links',
  links: [
    { title: 'Home', path: '/' },
    { title: 'All products', path: '/search' },
    { title: 'About', path: '/about' }
  ]
};

export default async function Footer() {
  return (
    <footer className="bg-neutral-100 text-neutral-600">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
          <div>
            <LogoSquare />
            <p className="mt-4 text-sm">
              © {new Date().getFullYear()} {process.env.SITE_NAME || 'My Store'}
            </p>
          </div>

          <Suspense fallback={null}>
            <FooterMenu menu={menu} />
          </Suspense>
        </div>
      </div>
    </footer>
  );
}

// ---------------
// Simple menu
// ---------------
function FooterMenu({ menu }: { menu: { title: string; links: { title: string; path: string }[] } }) {
  return (
    <nav>
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wider">{menu.title}</h3>
      <ul className="space-y-2 text-sm">
        {menu.links.map((link) => (
          <li key={link.path}>
            <a href={link.path} className="hover:text-neutral-900">
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}