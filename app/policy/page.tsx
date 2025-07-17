// FILE: app/policy/page.tsx

import { PolicyClient } from './PolicyClient'; // Note the capital 'P' and 'C'

export const metadata = {
  title: 'Shipping & Returns',
  description: 'Our shipping, returns, and refund policies.'
};

export default function PolicyPage() {
  return <PolicyClient />;
}