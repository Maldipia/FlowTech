'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap } from 'lucide-react';

export default function Navbar() {
  const path = usePathname();
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
        <Link href="/" className="flex items-center gap-2 font-medium text-gray-900">
          <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-blue-600"/>
          </div>
          flowtech.ph
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`text-sm transition-colors ${path===l.href?'text-gray-900 font-medium':'text-gray-500 hover:text-gray-900'}`}>
              {l.label}
            </Link>
          ))}
        </div>
        <Link href="/discovery" className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          Start a project
        </Link>
      </div>
    </nav>
  );
}
