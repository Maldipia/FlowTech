import { DM_Sans } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

const dmSans = DM_Sans({ subsets: ['latin'] });

export const metadataBase = new URL('https://www.flowtech.ph');

export const metadata = {
  title: { default: 'SUPERO — Premium Pet Food & Marketplace', template: '%s — SUPERO' },
  description: 'Premium raw pet food, grooming, supplements, and puppy marketplace. Delivered fresh across the Philippines.',
  openGraph: {
    type: 'website', locale: 'en_PH',
    url: 'https://www.flowtech.ph',
    siteName: 'SUPERO',
    title: 'SUPERO — Premium Pet Food & Marketplace',
    description: 'Raw pet food, grooming, supplements, and puppy marketplace. Fresh. Delivered.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
