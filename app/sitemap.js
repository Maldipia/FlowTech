export const dynamic = 'force-dynamic';
export default async function sitemap() {
  const BASE = 'https://www.flowtech.ph';
  try {
    const res = await fetch(`${BASE}/api/products`, { cache: 'no-store' });
    const { data: products } = await res.json();
    const cats = ['raw-food','treats','grooming','supplements','accessories','hygiene','apparel','others'];
    return [
      { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
      { url: `${BASE}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
      ...cats.map(cat => ({ url: `${BASE}/shop/${cat}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 })),
      { url: `${BASE}/marketplace`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
      ...(products || []).map(p => ({ url: `${BASE}/product/${p.slug}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 })),
    ];
  } catch {
    return [{ url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 }];
  }
}
