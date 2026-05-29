'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/components/CartProvider';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, ChevronDown } from 'lucide-react';

const peso = n => `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

const COURIERS = [
  { id: 'lalamove', label: 'Lalamove', desc: 'Same-day delivery (Metro Manila & Cavite)', icon: '⚡' },
  { id: 'jnt', label: 'J&T Express', desc: '3-5 business days (Nationwide)', icon: '📦' },
  { id: 'lbc', label: 'LBC', desc: '3-7 business days (Nationwide)', icon: '🚚' },
];

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '', email: '', mobile: '',
    address: '', city: '', province: '',
    courier: '', account_number: '', notes: ''
  });
  const [shippingFee, setShippingFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (form.courier === 'lalamove') setShippingFee(80);
    else if (form.courier === 'jnt') setShippingFee(100);
    else if (form.courier === 'lbc') setShippingFee(120);
    else setShippingFee(0);
  }, [form.courier]);

  const totalWeight = cart.reduce((s, i) => s + (i.variant.weight_grams || 500) * i.qty, 0);
  const totalAmount = cartTotal + shippingFee;

  const submit = async () => {
    if (!form.name || !form.email || !form.mobile || !form.address || !form.city || !form.province || !form.courier) {
      setError('Please fill in all required fields.'); return;
    }
    if (cart.length === 0) { setError('Your cart is empty.'); return; }

    setLoading(true); setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name,
          customer_email: form.email,
          customer_mobile: form.mobile,
          delivery_address: form.address,
          delivery_city: form.city,
          delivery_province: form.province,
          courier: form.courier,
          shipping_fee: shippingFee,
          account_number: form.account_number || null,
          notes: form.notes,
          payment_method: 'cod',
          items: cart.map(i => ({
            variant_id: i.variant.id,
            product_name: i.product.name,
            qty: i.qty,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        clearCart();
        setSuccess(data.order_number);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="max-w-lg mx-auto px-5 py-20 text-center">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={28} className="text-green-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
      <p className="text-gray-500 mb-4">Your order number is:</p>
      <div className="bg-gray-50 rounded-2xl py-4 px-6 text-2xl font-bold text-gray-900 mb-6">{success}</div>
      <p className="text-sm text-gray-400 mb-8">We'll confirm your order via SMS/email. Cash on Delivery upon receipt.</p>
      <button onClick={() => router.push('/shop')}
        className="bg-[#0A0A0A] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors">
        Continue Shopping
      </button>
    </div>
  );

  if (cart.length === 0) return (
    <div className="max-w-lg mx-auto px-5 py-20 text-center">
      <p className="text-4xl mb-4">🛒</p>
      <h2 className="text-xl font-bold mb-2">Cart is empty</h2>
      <button onClick={() => router.push('/shop')} className="text-[#C9A84C] hover:underline text-sm">Browse products →</button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-5 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery info */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-4">Delivery Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[['name','Full Name *'],['email','Email Address *'],['mobile','Mobile Number *']].map(([k,l]) => (
                <div key={k} className={k === 'email' ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">{l}</label>
                  <input value={form[k]} onChange={e => set(k, e.target.value)} type={k === 'email' ? 'email' : 'text'}
                    placeholder={k === 'mobile' ? '09XX XXX XXXX' : ''}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 transition-colors" />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Street Address *</label>
                <input value={form.address} onChange={e => set('address', e.target.value)}
                  placeholder="House/Unit No., Street, Barangay"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">City/Municipality *</label>
                <input value={form.city} onChange={e => set('city', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Province *</label>
                <input value={form.province} onChange={e => set('province', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 transition-colors" />
              </div>
            </div>
          </div>

          {/* Courier */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-4">Shipping Method *</h2>
            <div className="space-y-3">
              {COURIERS.map(c => (
                <button key={c.id} onClick={() => set('courier', c.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all
                    ${form.courier === c.id ? 'border-[#0A0A0A] bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}>
                  <span className="text-2xl">{c.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900">{c.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{c.desc}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-gray-900">
                      {c.id === 'lalamove' ? peso(80) : c.id === 'jnt' ? peso(100) : peso(120)}
                    </div>
                    <div className="text-xs text-gray-400">est. fee</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Account + notes */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-gray-900">Other Details</h2>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Account Number (optional)</label>
              <input value={form.account_number} onChange={e => set('account_number', e.target.value)}
                placeholder="ACC-XXXX — enter for member discounts"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Order Notes (optional)</label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
                placeholder="Special instructions, landmark, etc."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:border-gray-400 transition-colors" />
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-20">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cart.map(item => (
                <div key={item.key} className="flex justify-between text-sm">
                  <div className="text-gray-600 flex-1 min-w-0 pr-2">
                    <span className="font-medium">{item.product.name}</span>
                    <span className="text-gray-400"> × {item.qty}</span>
                    <div className="text-xs text-gray-400">{item.variant.label}</div>
                  </div>
                  <span className="font-semibold text-gray-900 flex-shrink-0">
                    {peso(item.variant.retail_price * item.qty)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{peso(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping ({form.courier || '—'})</span>
                <span className="font-medium">{shippingFee > 0 ? peso(shippingFee) : '—'}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-[#C9A84C] text-lg">{peso(totalAmount)}</span>
              </div>
            </div>
            <div className="mt-4 bg-gray-50 rounded-xl p-3 text-xs text-gray-500 text-center">
              💵 Cash on Delivery (COD)
            </div>

            {error && <p className="mt-3 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <button onClick={submit} disabled={loading}
              className="mt-4 w-full bg-[#0A0A0A] text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Place Order — COD'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
