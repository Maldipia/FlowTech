'use client';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

const CAT_META = {
  'raw-food':    { label: 'Raw Food',    emoji: '🥩', desc: 'BARF-compliant blends. Zero fillers, zero preservatives. Produced fresh in Amadeo.', cold: true },
  'treats':      { label: 'Treats',      emoji: '🦴', desc: 'Natural chews and treats for your dogs and cats. No artificial additives.' },
  'grooming':    { label: 'Grooming',    emoji: '🧴', desc: 'pH-balanced shampoos and conditioners. Dermatologist-tested, safe for all breeds.' },
  'supplements': { label: 'Supplements', emoji: '💊', desc: 'Vet-grade vitamins, probiotics, and omega oils for daily nutrition support.' },
  'accessories': { label: 'Accessories', emoji: '🎀', desc: 'Pet accessories for everyday use — collars, leashes, bowls, beds, and more.' },
  'hygiene':     { label: 'Hygiene',     emoji: '🧼', desc: 'Dental care, ear cleaners, paw balms, and hygiene essentials for your pets.' },
  'apparel':     { label: 'Apparel',     emoji: '👕', desc: 'Supero-branded apparel and merchandise for Boss Amos.' },
  'others':      { label: 'Others',      emoji: '📦', desc: 'Other Supero products and special collections.' },
};

const OTHER_CATS = Object.entries(CAT_META).map(([id, m]) => ({ id, ...m }));

export default function CategoryPage({ params }) {
  const { category } = params;
  const meta = CAT_META[category];
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
      <h1 className="text-2xl font-bold mb-3">Category not found</h1>
      <Link href="/shop" className="text-[#C9A84C] hover:underline text-sm">← Browse all products</Link>
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
      <div className="flex items-start gap-4 mb-8">
        <span className="text-5xl">{meta.emoji}</span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{meta.label}</h1>
          <p className="text-gray-500 max-w-lg">{meta.desc}</p>
          {meta.cold && (
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mt-3">
              ❄️ Cold chain — Metro Manila & Cavite only (70km from Amadeo)
            </div>
          )}
        </div>
      </div>

      {/* Other categories */}
      <div className="flex gap-2 flex-wrap mb-10 pb-8 border-b border-gray-100">
        <Link href="/shop" className="flex items-center gap-1.5 border border-gray-200 text-gray-500 hover:border-gray-400 text-xs font-semibold px-3.5 py-2 rounded-full transition-colors">
          All Products
        </Link>
        {OTHER_CATS.filter(c => c.id !== category).map(c => (
          <Link key={c.id} href={`/shop/${c.id}`}
            className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:border-gray-400 text-xs font-semibold px-3.5 py-2 rounded-full transition-colors">
            {c.emoji} {c.label}
          </Link>
        ))}
      </div>

      {/* Products */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 size={20} className="animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">{meta.emoji}</p>
          <p className="font-medium mb-2">No {meta.label} products yet</p>
          <p className="text-sm mb-6">We're adding products soon. Check back later!</p>
          <Link href="/shop" className="text-[#C9A84C] hover:underline text-sm">Browse all products →</Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-5">{products.length} product{products.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 40} />)}
          </div>
        </>
      )}
    </div>
  );
}
