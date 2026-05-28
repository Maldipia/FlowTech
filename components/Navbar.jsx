'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const links = [
    { href: '/services', label: 'Services' },
    { href: '/work',     label: 'Work' },
    { href: '/about',    label: 'About' },
    { href: '/blog',     label: 'Blog' },
    { href: '/contact',  label: 'Contact' },
  ];

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" onClick={() => setOpen(false)}
          className="flex items-center gap-2 font-medium text-gray-900">
          <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-blue-600" />
          </div>
          flowtech.ph
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`text-sm transition-colors ${path === l.href ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA + Mobile toggle */}
        <div className="flex items-center gap-2">
          <Link href="/discovery"
            className="hidden md:block bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            Start a project
          </Link>
          <button onClick={() => setOpen(o => !o)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-5">
          <div className="space-y-1 mb-4">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                onClick={() => setOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${path === l.href ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                {l.label}
              </Link>
            ))}
          </div>
          <Link href="/discovery" onClick={() => setOpen(false)}
            className="flex items-center justify-center w-full bg-gray-900 text-white text-sm font-medium px-4 py-3 rounded-xl hover:bg-gray-700 transition-colors">
            Start a project →
          </Link>
        </div>
      )}
    </nav>
  );
}
