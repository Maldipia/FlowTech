'use client';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

const CATS = [
  { id: 'all',         label: 'All Products', emoji: '' },
  { id: 'raw-food',    label: 'Raw Food',     emoji: '🥩' },
  { id: 'treats',      label: 'Treats',       emoji: '🦴' },
  { id: 'grooming',    label: 'Grooming',     emoji: '🧴' },
  { id: 'supplements', label: 'Supplements',  emoji: '💊' },
  { id: 'accessories', label: 'Accessories',  emoji: '🎀' },
  { id: 'hygiene',     label: 'Hygiene',      emoji: '🧼' },
  { id: 'apparel',     label: 'Apparel',      emoji: '👕' },
  { id: 'others',      label: 'Others',       emoji: '📦' },
];

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('all');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products${cat !== 'all' ? `?category=${cat}` : ''}`)
      .then(r => r.json())
      .then(d => { setProducts(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [cat]);

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Our Products</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-5">Shop</h1>
        {/* Category filter pills */}
        <div className="flex gap-2 flex-wrap">
          {CATS.map(c => {
            const count = c.id === 'all'
              ? products.length
              : null; // don't show count on non-active tabs to avoid stale counts
            return (
              <button key={c.id} onClick={() => setCat(c.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all
                  ${cat === c.id
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                {c.emoji && <span>{c.emoji}</span>}
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
          <Loader2 size={20} className="animate-spin" /> Loading…
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p className="font-medium mb-1">No products in this category yet</p>
          <p className="text-sm">Check back soon or browse other categories.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-5">{products.length} product{products.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={i * 40} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
