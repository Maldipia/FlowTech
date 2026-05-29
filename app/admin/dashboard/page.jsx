'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShoppingBag, Package, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

const peso = n => `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

const STATUS_COLORS = {
  pending:          'bg-amber-100 text-amber-700',
  confirmed:        'bg-blue-100 text-blue-700',
  preparing:        'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-indigo-100 text-indigo-700',
  delivered:        'bg-green-100 text-green-700',
  cancelled:        'bg-gray-100 text-gray-500',
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/orders?status=all')
      .then(r => { if (r.status === 401) { router.push('/admin/login'); return null; } return r.json(); })
      .then(d => {
        if (!d) return;
        const orders = d.data || [];
        const today = new Date().toDateString();
        const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === today);
        setStats({
          totalOrders: orders.length,
          todayOrders: todayOrders.length,
          todayRevenue: todayOrders.reduce((s, o) => s + Number(o.total_amount), 0),
          pendingOrders: orders.filter(o => o.status === 'pending').length,
          totalRevenue: orders.reduce((s, o) => s + Number(o.total_amount), 0),
          recentOrders: orders.slice(0, 8),
        });
        setLoading(false);
      });
  }, [router]);

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
      <Loader2 size={20} className="animate-spin" />
    </div>
  );

  return (
    <div className="p-6 max-w-6xl">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Today's Orders",  value: stats.todayOrders,           icon: ShoppingBag, color: 'text-blue-600',   bg: 'bg-blue-50' },
          { label: "Today's Revenue", value: peso(stats.todayRevenue),     icon: TrendingUp,  color: 'text-green-600',  bg: 'bg-green-50' },
          { label: 'Pending',         value: stats.pendingOrders,          icon: Clock,       color: 'text-amber-600',  bg: 'bg-amber-50' },
          { label: 'Total Revenue',   value: peso(stats.totalRevenue),     icon: Package,     color: 'text-[#C9A84C]',  bg: 'bg-[#FBF7EE]' },
        ].map(k => (
          <div key={k.label} className={`${k.bg} rounded-2xl p-5`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500">{k.label}</p>
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <k.icon size={14} className={k.color} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link href="/admin/products"
          className="bg-[#0A0A0A] rounded-2xl p-5 hover:bg-gray-800 transition-colors group">
          <Package size={20} className="text-[#C9A84C] mb-3" />
          <p className="font-bold text-white text-sm mb-0.5">Manage Products</p>
          <p className="text-white/40 text-xs">Add, edit, or archive products</p>
        </Link>
        <Link href="/admin/orders"
          className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition-colors">
          <ShoppingBag size={20} className="text-gray-600 mb-3" />
          <p className="font-bold text-gray-900 text-sm mb-0.5">View Orders</p>
          <p className="text-gray-400 text-xs">Update status, view details</p>
        </Link>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-sm">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-[#C9A84C] hover:underline">View all →</Link>
        </div>
        {!stats.recentOrders?.length ? (
          <div className="text-center py-12 text-gray-400 text-sm">No orders yet</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {stats.recentOrders.map(o => (
              <div key={o.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-900">{o.order_number}</p>
                  <p className="text-xs text-gray-400 truncate">{o.customer_name} · {o.delivery_city}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[o.status] || STATUS_COLORS.pending}`}>
                    {o.status.replace(/_/g,' ')}
                  </span>
                  <span className="font-bold text-sm text-gray-900">{peso(o.total_amount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
