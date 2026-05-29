'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShoppingBag, Package, Users, LogOut } from 'lucide-react';
import Link from 'next/link';

const peso = n => `₱${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

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
          recentOrders: orders.slice(0, 5),
        });
        setLoading(false);
      });
  }, [router]);

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Admin</p>
          <h1 className="text-2xl font-bold text-gray-900">SUPERO Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="bg-[#0A0A0A] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors">
            + Add Product
          </Link>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 px-3 py-2 rounded-xl hover:border-gray-400 transition-colors">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 gap-3">
          <Loader2 size={18} className="animate-spin" /> Loading…
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Today's Orders", value: stats.todayOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: "Today's Revenue", value: peso(stats.todayRevenue), icon: null, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Pending Orders', value: stats.pendingOrders, icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Total Revenue', value: peso(stats.totalRevenue), icon: null, color: 'text-[#C9A84C]', bg: 'bg-[#FBF7EE]' },
            ].map(k => (
              <div key={k.label} className={`${k.bg} rounded-2xl p-5 border border-transparent`}>
                <p className="text-xs font-medium text-gray-500 mb-2">{k.label}</p>
                <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
              </div>
            ))}
          </div>

          {/* Quick nav */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Link href="/admin/products" className="bg-[#0A0A0A] text-white rounded-2xl p-6 hover:bg-gray-800 transition-colors group">
              <Package size={24} className="text-[#C9A84C] mb-3" />
              <h3 className="font-bold mb-1">Manage Products</h3>
              <p className="text-white/40 text-sm">Add, edit, or archive products and variants</p>
            </Link>
            <Link href="/admin/orders" className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:border-gray-200 transition-colors">
              <ShoppingBag size={24} className="text-gray-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">View Orders</h3>
              <p className="text-gray-400 text-sm">Update order status, view delivery details</p>
            </Link>
          </div>

          {/* Recent orders */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs text-[#C9A84C] hover:underline">View all →</Link>
            </div>
            {stats.recentOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">No orders yet</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {stats.recentOrders.map(o => (
                  <div key={o.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{o.order_number}</p>
                      <p className="text-xs text-gray-400">{o.customer_name} · {o.courier?.toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-gray-900">{peso(o.total_amount)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                        ${o.status === 'delivered' ? 'bg-green-50 text-green-700' :
                          o.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                          'bg-gray-100 text-gray-500'}`}>
                        {o.status.replace(/_/g,' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
