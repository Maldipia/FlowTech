import { DM_Sans } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' });

export const metadata = {
  title: { default: 'Supero Dog Farm — Raw Food for Dogs & Cats', template: '%s | Supero Dog Farm' },
  description: 'Premium BARF raw food for dogs and cats. 100% natural, zero preservatives. Delivered from Amadeo, Cavite. Shop Supero Mix, Pure Beef, RABEEF and more.',
  keywords: ['raw dog food', 'BARF Philippines', 'raw cat food', 'Supero', 'Amadeo Cavite', 'natural pet food', 'raw feeding'],
  authors: [{ name: 'Supero Dog Farm' }],
  creator: 'Supero Dog Farm',
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: 'https://www.flowtech.ph',
    siteName: 'Supero Dog Farm',
    title: 'Supero Dog Farm — Raw Food for Dogs & Cats',
    description: 'Premium BARF raw food for dogs and cats. 100% natural, zero preservatives. Delivered fresh from Amadeo, Cavite.',
    images: [{ url: 'https://guwwockqfnickulcgete.supabase.co/storage/v1/object/public/supero-assets/logo_url-1780019864431.png', width: 1200, height: 630, alt: 'Supero Dog Farm' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Supero Dog Farm — Raw Food for Dogs & Cats',
    description: 'Premium BARF raw food. 100% natural. Delivered fresh from Amadeo, Cavite.',
    images: ['https://guwwockqfnickulcgete.supabase.co/storage/v1/object/public/supero-assets/logo_url-1780019864431.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: { icon: '/favicon.ico' },
  metadataBase: new URL('https://www.flowtech.ph'),
};

export default async function RootLayout({ children }) {
  let settings = {};
  try {
    const res = await fetch('https://www.flowtech.ph/api/settings', { cache: 'no-store' });
    const d = await res.json();
    settings = d.data || {};
  } catch {}

  const fbPixelId = settings.fb_pixel_id || '';
  const ga4Id = settings.ga4_id || '';

  return (
    <html lang="en" className={dmSans.variable}>
      <head>
        {fbPixelId && (
          <script dangerouslySetInnerHTML={{ __html: `
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${fbPixelId}');fbq('track','PageView');
          `}} />
        )}
        {ga4Id && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} />
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');` }} />
          </>
        )}
      </head>
      <body className={`${dmSans.className} antialiased`} suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
