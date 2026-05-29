'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Package, LogOut, ShoppingBag, ChevronDown } from 'lucide-react';

const peso = n => `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

const STATUS_STYLES = {
  pending:          { bg: 'bg-amber-50',  text: 'text-amber-700' },
  confirmed:        { bg: 'bg-blue-50',   text: 'text-blue-700' },
  preparing:        { bg: 'bg-purple-50', text: 'text-purple-700' },
  out_for_delivery: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
  delivered:        { bg: 'bg-green-50',  text: 'text-green-700' },
  cancelled:        { bg: 'bg-gray-100',  text: 'text-gray-500' },
};

export default function AccountDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetch('/api/account/me')
      .then(r => { if (r.status === 401) { router.push('/account/login'); return null; } return r.json(); })
      .then(d => {
        if (!d) return;
        setUser(d.user);
        // Fetch orders for this user
        return fetch(`/api/orders?email=${encodeURIComponent(d.user.email)}`);
      })
      .then(r => r?.json())
      .then(d => { if (d) setOrders(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  const logout = async () => {
    await fetch('/api/account/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] gap-3 text-gray-400">
      <Loader2 size={20} className="animate-spin" /> Loading your account…
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">My Account</p>
          <h1 className="text-2xl font-bold text-gray-900">Hi, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>
          {user?.account_number && (
            <div className="inline-flex items-center gap-2 bg-[#FBF7EE] text-[#C9A84C] text-xs font-bold px-3 py-1.5 rounded-full mt-2">
              ACC: {user.account_number}
            </div>
          )}
        </div>
        <button onClick={logout}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-xl transition-colors">
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: orders.length },
          { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length },
          { label: 'Pending', value: orders.filter(o => ['pending','confirmed','preparing','out_for_delivery'].includes(o.status)).length },
        ].map(s => (
          <div key={s.label} className="bg-gray-50 rounded-2xl p-5 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">{s.value}</div>
            <div className="text-xs text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Order History</h2>
          <Link href="/shop" className="text-xs text-[#C9A84C] hover:underline">Shop again →</Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl">
            <ShoppingBag size={36} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium mb-2">No orders yet</p>
            <p className="text-sm text-gray-400 mb-6">Your order history will appear here</p>
            <Link href="/shop"
              className="bg-[#0A0A0A] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => {
              const s = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
              const isOpen = expanded === order.id;
              return (
                <div key={order.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpanded(isOpen ? null : order.id)}>
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package size={16} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-sm text-gray-900">{order.order_number}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.text}`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {' · '}{order.courier?.toUpperCase()}
                        {' · '}{order.order_items?.length || 0} item(s)
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 flex items-center gap-3">
                      <span className="font-bold text-gray-900">{peso(order.total_amount)}</span>
                      <ChevronDown size={15} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  {isOpen && order.order_items?.length > 0 && (
                    <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 space-y-2">
                      {order.order_items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.product_name} — {item.variant_label} × {item.qty}</span>
                          <span className="font-medium text-gray-900">{peso(item.final_price * item.qty)}</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-2 mt-2 space-y-1 text-xs text-gray-500">
                        <div className="flex justify-between">
                          <span>Shipping ({order.courier})</span>
                          <span>{peso(order.shipping_fee)}</span>
                        </div>
                        {order.total_discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount applied</span>
                            <span>-{peso(order.total_discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-gray-900 text-sm pt-1">
                          <span>Total</span>
                          <span>{peso(order.total_amount)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 pt-1">
                        Delivery to: {order.delivery_address}, {order.delivery_city}, {order.delivery_province}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
