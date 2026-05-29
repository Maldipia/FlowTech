'use client';
import { useCart } from './CartProvider';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

const peso = n => `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

export default function CartSidebar() {
  const { cart, cartOpen, setCartOpen, updateQty, removeItem, cartTotal } = useCart();

  return (
    <>
      {cartOpen && (
        <div onClick={() => setCartOpen(false)}
          className="fixed inset-0 bg-black/60 z-50 animate-[fadeIn_.2s_ease]" />
      )}
      <div className={`fixed right-0 top-0 bottom-0 w-96 max-w-[95vw] bg-white z-50 flex flex-col
        shadow-2xl transition-transform duration-300 ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-900">Your Cart
            {cart.length > 0 && <span className="ml-2 text-sm font-normal text-gray-400">({cart.length} items)</span>}
          </h2>
          <button onClick={() => setCartOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag size={40} className="text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium mb-1">Your cart is empty</p>
              <p className="text-sm text-gray-400 mb-6">Add products to get started</p>
              <button onClick={() => setCartOpen(false)}
                className="bg-[#0A0A0A] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
                Shop Now
              </button>
            </div>
          ) : cart.map(item => (
            <div key={item.key} className="flex gap-3 bg-gray-50 rounded-2xl p-4">
              <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {item.product.emoji || '🐾'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">{item.product.name}</p>
                <p className="text-xs text-gray-400 mb-2">{item.variant.label} · {peso(item.variant.retail_price)}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.key, -1)}
                    className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:border-gray-400 transition-colors">
                    <Minus size={12} />
                  </button>
                  <span className="text-sm font-bold min-w-[20px] text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.key, 1)}
                    className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:border-gray-400 transition-colors">
                    <Plus size={12} />
                  </button>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-sm text-gray-900">{peso(item.variant.retail_price * item.qty)}</p>
                <button onClick={() => removeItem(item.key)}
                  className="text-xs text-gray-400 hover:text-red-500 mt-1 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-100 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Subtotal</span>
              <span className="font-bold text-xl text-gray-900">{peso(cartTotal)}</span>
            </div>
            <p className="text-xs text-gray-400">Shipping calculated at checkout</p>
            <Link href="/checkout" onClick={() => setCartOpen(false)}
              className="block w-full bg-[#0A0A0A] text-white text-center py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors">
              Proceed to Checkout →
            </Link>
            <button onClick={() => setCartOpen(false)}
              className="block w-full text-center text-sm text-gray-400 hover:text-gray-700 transition-colors">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
