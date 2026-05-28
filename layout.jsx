import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Flowtech.ph — Web Development & Automation Studio',
  description: 'Custom websites, platforms, and business automation for Philippine businesses. Built by operators, for operators.',
  keywords: 'web development Philippines, automation n8n, Next.js developer Cavite, business system Philippines',
  openGraph: {
    title: 'Flowtech.ph — Build. Automate. Scale.',
    description: 'Custom dev and automation for Philippine businesses.',
    url: 'https://flowtech.ph',
    siteName: 'Flowtech.ph',
    locale: 'en_PH',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
