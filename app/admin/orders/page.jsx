'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Download, RefreshCw } from 'lucide-react';

const STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled'];
const STATUS_COLORS = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  processing: 'bg-purple-50 text-purple-700',
  shipped: 'bg-indigo-50 text-indigo-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
};
const peso = n => 'P' + Number(n || 0).toLocaleString();

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch('/api/admin/orders');
    if (r.status === 401) { router.push('/admin/login'); return; }
    const d = await r.json(); setOrders(d.data || []); setLoading(false);
  }, [router]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    await fetch('/api/admin/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    setUpdating(null);
  };

  const exportCSV = (status = 'all') => {
    window.open(`/api/admin/export?type=orders&status=${status}`, '_blank');
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const counts = STATUSES.reduce((acc, s) => { acc[s] = orders.filter(o => o.status === s).length; return acc; }, {});

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-colors">
            <RefreshCw size={14} />
          </button>
          <span className="text-sm text-gray-400">{orders.length} total orders</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportCSV('all')}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2.5 rounded-xl hover:border-gray-400 transition-colors">
            <Download size={14} /> Export All CSV
          </button>
          {filter !== 'all' && (
            <button onClick={() => exportCSV(filter)}
              className="flex items-center gap-2 bg-[#0A0A0A] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
              <Download size={14} /> Export {filter}
            </button>
          )}
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button onClick={() => setFilter('all')}
          className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-all ${filter==='all' ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'}`}>
          All <span className="ml-1 opacity-60">{orders.length}</span>
        </button>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(filter===s ? 'all' : s)}
            className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-all capitalize ${filter===s ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'}`}>
            {s} {counts[s] > 0 && <span className="ml-1 opacity-60">{counts[s]}</span>}
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-16 text-gray-400"><Loader2 size={18} className="animate-spin" /></div>
      : filtered.length === 0 ? <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl"><p className="text-gray-400">No orders yet</p></div>
      : (
        <div className="space-y-2">
          {filtered.map(o => (
            <div key={o.id} className="border border-gray-100 rounded-2xl bg-white overflow-hidden">
              <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-black text-sm font-mono text-gray-900">{o.order_number}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-600'}`}>{o.status}</span>
                    {o.promo_code && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold">{o.promo_code}</span>}
                  </div>
                  <p className="text-xs text-gray-500">{o.customer_name} · {o.customer_email} · {o.courier} · {new Date(o.created_at).toLocaleDateString('en-PH')}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-black text-gray-900">{peso(o.total_amount)}</div>
                  <div className="text-xs text-gray-400">{o.payment_method?.toUpperCase()}</div>
                </div>
                <select value={o.status} onClick={e => e.stopPropagation()}
                  onChange={e => updateStatus(o.id, e.target.value)}
                  disabled={updating === o.id}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold bg-white focus:border-gray-400 capitalize flex-shrink-0">
                  {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
                {updating === o.id && <Loader2 size={14} className="animate-spin text-gray-400 flex-shrink-0" />}
              </div>
              {expanded === o.id && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 text-sm">
                  <div className="grid sm:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs font-bold text-gray-400 mb-1">DELIVERY</p>
                      <p className="text-gray-700">{o.delivery_address}</p>
                      <p className="text-gray-500 text-xs">{o.delivery_city}, {o.delivery_province}</p>
                      <p className="text-gray-500 text-xs">{o.customer_mobile}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 mb-1">ORDER SUMMARY</p>
                      <p className="text-xs text-gray-500">Subtotal: {peso(o.subtotal)}</p>
                      {o.total_discount > 0 && <p className="text-xs text-green-600">Discount: -{peso(o.total_discount)}</p>}
                      {o.promo_code && <p className="text-xs text-amber-600">Promo ({o.promo_code}): -{peso(o.promo_discount)}</p>}
                      <p className="text-xs text-gray-500">Shipping: {peso(o.shipping_fee)}</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">Total: {peso(o.total_amount)}</p>
                    </div>
                  </div>
                  {o.notes && <p className="text-xs text-gray-500 bg-white border border-gray-100 rounded-xl px-3 py-2"><strong>Notes:</strong> {o.notes}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
