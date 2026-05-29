'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, Users, Settings, LogOut, Eye, Menu, X, Tag, Star, ChevronRight } from 'lucide-react';

const NAV = [
  { section: 'MAIN',    items: [
    { href: '/admin/dashboard', label: 'Dashboard',   icon: LayoutDashboard },
    { href: '/admin/orders',    label: 'Orders',       icon: ShoppingBag },
  ]},
  { section: 'CATALOG', items: [
    { href: '/admin/products',  label: 'Products',     icon: Package },
    { href: '/admin/accounts',  label: 'Accounts',     icon: Users },
    { href: '/admin/promo',     label: 'Promo Codes',  icon: Tag },
    { href: '/admin/reviews',   label: 'Reviews',      icon: Star },
  ]},
  { section: 'STORE',   items: [
    { href: '/admin/settings',  label: 'Settings',     icon: Settings },
  ]},
];

export default function AdminLayout({ children }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const isActive = (href) => path === href || path.startsWith(href + '/');

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-[#0A0A0A] flex flex-col transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        {/* Logo */}
        <div className="p-5 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#C9A84C] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-black font-black text-sm">S</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">SUPERO</p>
              <p className="text-white/30 text-[10px]">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {NAV.map(group => (
            <div key={group.section} className="mb-4">
              <p className="text-white/25 text-[9px] font-black tracking-widest uppercase px-3 mb-2">{group.section}</p>
              <div className="space-y-0.5">
                {group.items.map(item => (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${isActive(item.href) ? 'bg-[#C9A84C] text-black' : 'text-white/60 hover:bg-white/8 hover:text-white'}`}>
                    <item.icon size={15} />
                    {item.label}
                    {isActive(item.href) && <ChevronRight size={13} className="ml-auto" />}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/8 space-y-0.5">
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:bg-white/8 hover:text-white transition-colors">
            <Eye size={15} /> View Store
          </Link>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-colors">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 h-14 flex items-center justify-between px-5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(o => !o)} className="lg:hidden p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h1 className="font-bold text-gray-900 capitalize">
              {path.split('/').pop() || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:block">{dateStr}</span>
            <div className="w-8 h-8 bg-[#0A0A0A] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
