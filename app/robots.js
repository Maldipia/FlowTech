export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: 'https://www.flowtech.ph/sitemap.xml',
    host: 'https://www.flowtech.ph',
  };
}
