'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from './CartProvider';

const peso = n => `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

export default function ProductCard({ product, delay = 0 }) {
  const { addToCart } = useCart();
  const variants = product.product_variants?.filter(v => v.is_active) || [];
  const [selVar, setSelVar] = useState(variants[0] || null);
  const primaryImage = product.product_images?.find(i => i.is_primary)?.image_url;

  const handleAdd = (e) => {
    e.preventDefault();
    if (selVar) addToCart(product, selVar);
  };

  const deliveryBadge = product.delivery_type === 'cold_chain'
    ? { label: '❄️ Cold Chain', bg: 'bg-blue-50', text: 'text-blue-700' }
    : null;

  return (
    <div className="afui card-hover bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col" style={{ '--d': `${delay}ms` }}>
      {/* Image */}
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
          {primaryImage ? (
            <img src={primaryImage} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl">{product.emoji || '🐾'}</span>
          )}
          {deliveryBadge && (
            <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-lg ${deliveryBadge.bg} ${deliveryBadge.text}`}>
              {deliveryBadge.label}
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-bold text-gray-900 text-sm leading-snug hover:text-[#C9A84C] transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          {product.description && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.description}</p>
          )}
        </div>

        {/* Variants */}
        {variants.length > 1 && (
          <div className="flex gap-1.5 flex-wrap">
            {variants.map(v => (
              <button key={v.id} onClick={() => setSelVar(v)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors font-medium
                  ${selVar?.id === v.id ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                {v.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <div>
            <div className="font-bold text-gray-900">{selVar ? peso(selVar.retail_price) : '—'}</div>
            {selVar && <div className="text-xs text-gray-400">{selVar.label}</div>}
          </div>
          <button onClick={handleAdd} disabled={!selVar}
            className="bg-[#0A0A0A] hover:bg-[#C9A84C] text-white hover:text-black p-2.5 rounded-xl transition-colors disabled:opacity-40 btn-transition">
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
