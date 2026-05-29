'use client';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

const CATS = [
  { id: 'all', label: 'All Products' },
  { id: 'raw-food', label: 'Raw Food' },
  { id: 'grooming', label: 'Grooming' },
  { id: 'supplements', label: 'Supplements' },
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
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Our Products</p>
          <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors
                ${cat === c.id ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
          <Loader2 size={20} className="animate-spin" /> Loading products…
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-4xl mb-3">📦</p>
          <p>No products found. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={i * 40} />
          ))}
        </div>
      )}
    </div>
  );
}
