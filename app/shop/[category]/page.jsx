'use client';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

const CAT_LABELS = {
  'raw-food':     { label: 'Raw Food',    emoji: '🥩', desc: 'BARF-compliant blends. Zero fillers, zero preservatives. Produced fresh in Amadeo.' },
  'grooming':     { label: 'Grooming',    emoji: '🧴', desc: 'pH-balanced shampoos and conditioners. Dermatologist-tested, safe for all breeds.' },
  'supplements':  { label: 'Supplements', emoji: '💊', desc: 'Vet-grade vitamins, probiotics, and omega oils for daily nutrition support.' },
};

export default function CategoryPage({ params }) {
  const { category } = params;
  const meta = CAT_LABELS[category];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?category=${category}`)
      .then(r => r.json())
      .then(d => { setProducts(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [category]);

  if (!meta) return (
    <div className="max-w-4xl mx-auto px-5 py-20 text-center">
      <p className="text-4xl mb-4">🐾</p>
      <h1 className="text-2xl font-bold mb-2">Category not found</h1>
      <Link href="/shop" className="text-[#C9A84C] hover:underline text-sm">Browse all products →</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
        <Link href="/shop" className="hover:text-gray-700 transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{meta.label}</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-10">
        <span className="text-5xl">{meta.emoji}</span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{meta.label}</h1>
          <p className="text-gray-500 max-w-lg">{meta.desc}</p>
          {category === 'raw-food' && (
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mt-3">
              ❄️ Cold chain — Metro Manila & Cavite only (70km from Amadeo)
            </div>
          )}
        </div>
      </div>

      {/* Other categories */}
      <div className="flex gap-2 mb-8">
        {Object.entries(CAT_LABELS).filter(([k]) => k !== category).map(([k, v]) => (
          <Link key={k} href={`/shop/${k}`}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-gray-400 text-sm px-4 py-2 rounded-full transition-colors">
            <span>{v.emoji}</span>{v.label}
          </Link>
        ))}
        <Link href="/shop" className="flex items-center gap-2 border border-gray-200 text-gray-500 hover:border-gray-400 text-sm px-4 py-2 rounded-full transition-colors">
          All Products
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 size={20} className="animate-spin" /> Loading…
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p>No products in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 40} />)}
        </div>
      )}
    </div>
  );
}
