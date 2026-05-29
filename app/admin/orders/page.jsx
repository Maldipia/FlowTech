'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, RefreshCw, ChevronDown } from 'lucide-react';

const STATUS_COLORS = {
  pending:          { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  confirmed:        { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  preparing:        { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  out_for_delivery: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  delivered:        { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  cancelled:        { bg: 'bg-gray-100',  text: 'text-gray-500',   dot: 'bg-gray-400' },
};
const STATUSES = ['pending','confirmed','preparing','out_for_delivery','delivered','cancelled'];
const peso = n => `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/orders?status=${filter}`);
    if (res.status === 401) { router.push('/admin/login'); return; }
    const { data } = await res.json();
    setOrders(data || []);
    setLoading(false);
  }, [filter, router]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    await fetch('/api/admin/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    setOrders(o => o.map(ord => ord.id === id ? { ...ord, status } : ord));
    setUpdating(null);
  };

  const counts = STATUSES.reduce((a, s) => ({ ...a, [s]: orders.filter(o => o.status === s).length }), {});

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>

          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        </div>
        <button onClick={fetchOrders} className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:text-gray-700 transition-colors">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${filter === 'all' ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
          All ({orders.length})
        </button>
        {STATUSES.map(s => {
          const c = STATUS_COLORS[s];
          return (
            <button key={s} onClick={() => setFilter(filter === s ? 'all' : s)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold border-2 transition-colors ${c.bg} ${c.text} ${filter === s ? 'border-current' : 'border-transparent'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
              {s.replace(/_/g,' ')} ({counts[s] || 0})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 gap-3">
          <Loader2 size={18} className="animate-spin" /> Loading orders…
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📋</p><p>No orders found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map(order => {
            const c = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
            const isOpen = expanded === order.id;
            return (
              <div key={order.id} className="border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors">
                <div className="flex items-center gap-4 px-5 py-4 cursor-pointer" onClick={() => setExpanded(isOpen ? null : order.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-0.5">
                      <span className="font-bold text-sm text-gray-900">{order.order_number}</span>
                      <span className="text-xs text-gray-400">{order.customer_name}</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {order.courier?.toUpperCase()} · {order.delivery_city}, {order.delivery_province} · {new Date(order.created_at).toLocaleDateString('en-PH', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-bold text-sm text-gray-900">{peso(order.total_amount)}</span>
                    <div onClick={e => e.stopPropagation()}>
                      {updating === order.id ? <Loader2 size={14} className="animate-spin text-gray-400" /> : (
                        <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none ${c.bg} ${c.text}`}>
                          {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
                        </select>
                      )}
                    </div>
                    <span className={`text-gray-400 text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                  </div>
                </div>
                {isOpen && (
                  <div className="border-t border-gray-100 bg-gray-50 px-5 py-5">
                    <div className="grid md:grid-cols-3 gap-5 text-sm mb-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Customer</p>
                        <p className="font-medium text-gray-900">{order.customer_name}</p>
                        <a href={`mailto:${order.customer_email}`} className="text-blue-600 text-xs">{order.customer_email}</a>
                        <p className="text-gray-500 text-xs mt-0.5">{order.customer_mobile}</p>
                        {order.account_number && <p className="text-xs text-[#C9A84C] mt-1 font-medium">ACC: {order.account_number}</p>}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Delivery</p>
                        <p className="text-gray-700 text-xs">{order.delivery_address}</p>
                        <p className="text-gray-500 text-xs">{order.delivery_city}, {order.delivery_province}</p>
                        <p className="text-gray-500 text-xs mt-1 font-medium">{order.courier?.toUpperCase()} · Shipping: {peso(order.shipping_fee)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Payment</p>
                        <p className="text-gray-700 text-xs">Method: {order.payment_method?.toUpperCase()}</p>
                        <p className="text-gray-500 text-xs">Subtotal: {peso(order.subtotal)}</p>
                        {order.total_discount > 0 && <p className="text-green-600 text-xs">Discount: -{peso(order.total_discount)}</p>}
                        <p className="font-bold text-gray-900 text-sm mt-1">Total: {peso(order.total_amount)}</p>
                      </div>
                    </div>
                    {order.order_items?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Items</p>
                        <div className="space-y-1.5">
                          {order.order_items.map(item => (
                            <div key={item.id} className="flex justify-between text-xs text-gray-600 bg-white rounded-lg px-3 py-2">
                              <span>{item.product_name} — {item.variant_label} × {item.qty}</span>
                              <span className="font-medium">{peso(item.final_price * item.qty)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {order.notes && <p className="mt-3 text-xs text-gray-500 bg-amber-50 px-3 py-2 rounded-lg">Note: {order.notes}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
