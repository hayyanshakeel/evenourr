// app/policy/page.tsx

import { PolicyClient } from './PolicyClient'; // Corrected import

export const metadata = {
  title: 'Shipping & Returns',
  description: 'Our shipping, returns, and refund policies.'
};

export default function PolicyPage() {
  // We'll let the client component handle the logic
  return <PolicyClient />;
}