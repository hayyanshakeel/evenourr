// app/(admin)/dashboard/coupons/new/page.tsx
'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCouponPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [type, setType] = useState<'fixed' | 'percent'>('fixed');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [minCart, setMinCart] = useState('');
  const [maxUses, setMaxUses] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!code || !value) {
      alert('Code and Value are required!');
      return;
    }

    const res = await fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code.trim(),
        type,
        value: Number(value),
        description,
        minCart: Number(minCart) || 0,
        maxUses: Number(maxUses) || 1,
      }),
    });

    if (res.ok) {
      router.push('/dashboard/coupons'); // Redirect to the coupons list page
    } else {
      alert(await res.text());
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-8">
      <h1 className="text-2xl font-bold">New Coupon</h1>
      <input placeholder="Code" required value={code} onChange={(e) => setCode(e.target.value)} />
      <select value={type} onChange={(e) => setType(e.target.value as 'fixed' | 'percent')} required>
        <option value="fixed">₹ Fixed</option>
        <option value="percent">% Percent</option>
      </select>
      <input type="number" placeholder="Value (₹ or %)" required value={value} onChange={(e) => setValue(e.target.value)} />
      <input type="number" placeholder="Min Cart (₹)" value={minCart} onChange={(e) => setMinCart(e.target.value)} />
      <input type="number" placeholder="Max Uses" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
    </form>
  );
}