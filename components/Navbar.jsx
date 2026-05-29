import SearchBar from './SearchBar';
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCart } from './CartProvider';
import CartSidebar from './CartSidebar';

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { cartCount, setCartOpen } = useCart();
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => { if (d.data?.logo_url) setLogoUrl(d.data.logo_url); })
      .catch(() => {});
  }, []);

  const links = [
    { href: '/shop', label: 'Shop' },
    { href: '/shop/raw-food', label: 'Raw Food' },
    { href: '/shop/treats', label: 'Treats' },
    { href: '/shop/accessories', label: 'Accessories' },
    { href: '/shop/hygiene', label: 'Hygiene' },
    { href: '/marketplace', label: 'Find a Puppy' },
  ];

  const isActive = (href) => path === href || path.startsWith(href + '/');

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#0A0A0A] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5 flex-shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt="SUPERO" className="h-10 w-auto object-contain" />
            ) : (
              <>
                <div className="w-8 h-8 bg-[#C9A84C] rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-xs">S</span>
                </div>
                <span className="text-white font-bold text-lg tracking-wider">SUPERO</span>
              </>
            )}
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive(l.href) ? 'text-[#C9A84C] bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <SearchBar className="hidden md:block" />
            <Link href="/account/dashboard"
              className="hidden md:flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
              <User size={16} />
              <span className="hidden lg:inline">Account</span>
            </Link>
            <button onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 bg-[#C9A84C] hover:bg-[#E8C97A] text-black px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setOpen(o => !o)}
              className="lg:hidden p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-white/10 bg-[#0A0A0A] px-5 py-4">
            <div className="space-y-1 mb-4">
              {links.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                    ${isActive(l.href) ? 'text-[#C9A84C] bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                  {l.label}
                </Link>
              ))}
              <SearchBar className="hidden md:block" />
            <Link href="/account/dashboard" onClick={() => setOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                My Account
              </Link>
            </div>
          </div>
        )}
      </nav>
      <CartSidebar />
    </>
  );
}
