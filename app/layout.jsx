import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadataBase = new URL('https://www.flowtech.ph');

export const metadata = {
  title: {
    default: 'Flowtech.ph — Web Development & Automation Studio',
    template: '%s — Flowtech.ph',
  },
  description: 'Custom websites, platforms, and business automation for Philippine businesses. Built by operators, for operators. Based in Amadeo, Cavite.',
  keywords: [
    'web development Philippines',
    'automation Philippines',
    'n8n Philippines',
    'Next.js developer Cavite',
    'business system Philippines',
    'Google Apps Script Philippines',
    'Supabase developer Philippines',
    'TYG Services',
  ],
  authors: [{ name: 'Flowtech.ph', url: 'https://www.flowtech.ph' }],
  creator: 'Flowtech.ph',
  publisher: 'TYG Services',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: 'https://www.flowtech.ph',
    siteName: 'Flowtech.ph',
    title: 'Flowtech.ph — Build. Automate. Scale.',
    description: 'Custom dev and automation for Philippine businesses. Built by operators, for operators.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Flowtech.ph' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flowtech.ph — Build. Automate. Scale.',
    description: 'Custom dev and automation for Philippine businesses.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://www.flowtech.ph',
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
