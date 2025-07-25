"use client";
import { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to add category");
      setName("");
      fetchCategories();
    } catch (err) {
      setError("Failed to add category");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this category?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      fetchCategories();
    } catch (err) {
      setError("Failed to delete category");
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(id: number, name: string) {
    setEditingId(id);
    setEditingName(name);
  }

  async function handleEditSave(id: number) {
    if (!editingName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName }),
      });
      if (!res.ok) throw new Error("Failed to update category");
      setEditingId(null);
      setEditingName("");
      fetchCategories();
    } catch (err) {
      setError("Failed to update category");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="border px-3 py-2 rounded w-full"
          placeholder="New category name"
        />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">Add</button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="bg-white rounded shadow divide-y">
        <div className="flex font-semibold px-4 py-2 text-gray-700">
          <div className="w-1/2">Name</div>
          <div className="w-1/2 text-right">Actions</div>
        </div>
        {loading ? (
          <div className="px-4 py-4 text-gray-500">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="px-4 py-4 text-gray-500">No categories found.</div>
        ) : (
          categories.map(cat => (
            <div key={cat.id} className="flex px-4 py-2 items-center">
              <div className="w-1/2">
                {editingId === cat.id ? (
                  <input
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                ) : (
                  cat.name
                )}
              </div>
              <div className="w-1/2 flex gap-2 justify-end">
                {editingId === cat.id ? (
                  <>
                    <button onClick={() => handleEditSave(cat.id)} className="text-green-600 hover:underline">Save</button>
                    <button onClick={() => { setEditingId(null); setEditingName(""); }} className="text-gray-500 hover:underline">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(cat.id, cat.name)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:underline">Delete</button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
