'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import { Loader2, ShoppingCart, ChevronLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const peso = n => `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

export default function ProductPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selVar, setSelVar] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    fetch(`/api/products?slug=${slug}`)
      .then(r => r.json())
      .then(d => {
        if (d.data) {
          setProduct(d.data);
          const variants = d.data.product_variants?.filter(v => v.is_active) || [];
          setSelVar(variants[0] || null);
        }
        setLoading(false);
      });
  }, [slug]);

  const handleAdd = () => {
    if (!selVar) return;
    addToCart(product, selVar, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] gap-3 text-gray-400">
      <Loader2 size={20} className="animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="text-center py-20 text-gray-400">
      <p className="text-4xl mb-4">😕</p>
      <p className="mb-4">Product not found</p>
      <Link href="/shop" className="text-[#C9A84C] hover:underline text-sm">Back to shop →</Link>
    </div>
  );

  const variants = product.product_variants?.filter(v => v.is_active) || [];
  const images = product.product_images || [];

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      {/* Breadcrumb */}
      <Link href={`/shop/${product.category}`}
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 mb-8 transition-colors">
        <ChevronLeft size={14} /> {product.category}
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-3 flex items-center justify-center">
            {images[activeImg] ? (
              <img src={images[activeImg].image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-8xl">{product.emoji || '🐾'}</span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-[#0A0A0A]' : 'border-transparent'}`}>
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full capitalize">
              {product.category?.replace('-', ' ')}
            </span>
            {product.delivery_type === 'cold_chain' && (
              <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                ❄️ Cold Chain Only
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

          {selVar && (
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">{peso(selVar.retail_price)}</span>
              <span className="text-gray-400 text-sm ml-2">/ {selVar.label}</span>
            </div>
          )}

          <p className="text-gray-500 leading-relaxed mb-6">{product.description}</p>

          {/* Variant selector */}
          {variants.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Size</p>
              <div className="flex gap-2 flex-wrap">
                {variants.map(v => (
                  <button key={v.id} onClick={() => setSelVar(v)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all
                      ${selVar?.id === v.id ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                    {v.label} — {peso(v.retail_price)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quantity</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center hover:border-gray-400 transition-colors text-lg">
                −
              </button>
              <span className="text-lg font-bold w-8 text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)}
                className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center hover:border-gray-400 transition-colors text-lg">
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button onClick={handleAdd} disabled={!selVar}
            className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all
              ${added ? 'bg-green-600 text-white' : 'bg-[#0A0A0A] hover:bg-[#C9A84C] hover:text-black text-white'}
              disabled:opacity-40`}>
            {added ? <><CheckCircle size={18} /> Added to Cart!</> : <><ShoppingCart size={18} /> Add to Cart</>}
          </button>

          {selVar && (
            <p className="text-xs text-gray-400 text-center mt-3">
              Subtotal: <strong>{peso(selVar.retail_price * qty)}</strong> · Shipping calculated at checkout
            </p>
          )}

          {product.delivery_type === 'cold_chain' && (
            <div className="mt-4 bg-blue-50 rounded-xl p-4 text-xs text-blue-700">
              <strong>❄️ Cold Chain Product</strong> — Available for delivery within 70km of Amadeo, Cavite only. Same-day via Lalamove.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
