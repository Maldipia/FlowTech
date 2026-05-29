'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingBag, Settings,
  LogOut, Menu, X, ChevronRight, Store, Users,
  BarChart2, Tag
} from 'lucide-react';

const NAV = [
  {
    group: 'MAIN',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
      { href: '/admin/orders',    label: 'Orders',      icon: ShoppingBag },
    ]
  },
  {
    group: 'CATALOG',
    items: [
      { href: '/admin/products',  label: 'Products',    icon: Package },
      { href: '/admin/accounts',  label: 'Accounts',    icon: Users },
    ]
  },
  {
    group: 'STORE',
    items: [
      { href: '/admin/settings',  label: 'Settings',    icon: Settings },
    ]
  },
];

function Sidebar({ open, onClose }) {
  const path = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const isActive = (href) => path === href || path.startsWith(href + '/');

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div onClick={onClose} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-60 bg-[#0A0A0A] flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 flex-shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#C9A84C] rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xs">S</span>
            </div>
            <div>
              <div className="text-white font-bold text-sm tracking-wider">SUPERO</div>
              <div className="text-white/30 text-xs">Admin Panel</div>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {NAV.map(section => (
            <div key={section.group} className="mb-5">
              <p className="text-white/25 text-xs font-semibold px-3 mb-2 tracking-widest">
                {section.group}
              </p>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const active = isActive(item.href);
                  return (
                    <Link key={item.href} href={item.href} onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                        ${active
                          ? 'bg-[#C9A84C] text-black'
                          : 'text-white/60 hover:text-white hover:bg-white/8'
                        }`}>
                      <item.icon size={16} className={active ? 'text-black' : 'text-white/50 group-hover:text-white'} />
                      {item.label}
                      {active && <ChevronRight size={13} className="ml-auto text-black/50" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Store link + Logout */}
        <div className="border-t border-white/10 px-3 py-4 space-y-1 flex-shrink-0">
          <a href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/8 transition-all">
            <Store size={16} />
            View Store
          </a>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

function Header({ onMenuClick, title }) {
  const path = usePathname();

  const PAGE_TITLES = {
    '/admin/dashboard': 'Dashboard',
    '/admin/orders':    'Orders',
    '/admin/products':  'Products',
    '/admin/accounts':  'Accounts',
    '/admin/settings':  'Settings',
  };

  const pageTitle = PAGE_TITLES[path] || 'Admin';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 h-14 flex items-center px-5 gap-4 flex-shrink-0">
      <button onClick={onMenuClick}
        className="lg:hidden p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
        <Menu size={20} />
      </button>
      <h1 className="font-bold text-gray-900 text-base">{pageTitle}</h1>
      <div className="ml-auto flex items-center gap-3">
        <div className="text-xs text-gray-400 hidden sm:block">
          {new Date().toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
        <div className="w-7 h-7 bg-[#0A0A0A] rounded-full flex items-center justify-center">
          <span className="text-[#C9A84C] text-xs font-bold">M</span>
        </div>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const path = usePathname();

  // Login page has no sidebar
  if (path === '/admin/login') return <>{children}</>;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
