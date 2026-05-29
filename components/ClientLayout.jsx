'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import CartProvider from './CartProvider';

export default function ClientLayout({ children }) {
  const path = usePathname();
  const isAdmin = path?.startsWith('/admin');

  if (isAdmin) {
    // Admin pages: no main Navbar/Footer — AdminLayout handles its own UI
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </CartProvider>
  );
}
