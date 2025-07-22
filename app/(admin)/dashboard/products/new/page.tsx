'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [inventory, setInventory] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        price: Number(price) * 100,
        inventory: Number(inventory),
      }),
    });
    router.push('/dashboard/products');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-8">
      <h1 className="text-2xl font-bold">New Product</h1>
      <input placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="number" placeholder="Price (₹)" required value={price} onChange={(e) => setPrice(e.target.value)} />
      <input type="number" placeholder="Inventory" required value={inventory} onChange={(e) => setInventory(e.target.value)} />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
    </form>
  );
}