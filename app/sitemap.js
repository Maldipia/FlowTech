import { createClient } from '@supabase/supabase-js';
import { posts as staticPosts } from '@/lib/posts';
import { projects } from '@/lib/projects';

const BASE = 'https://www.flowtech.ph';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function sitemap() {
  // Static pages
  const staticPages = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/work`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE}/discovery`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
  ];

  // Work slug pages
  const workPages = projects.map(p => ({
    url: `${BASE}/work/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Static blog posts
  const staticBlogPages = staticPosts.map(p => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // DB blog posts
  let dbBlogPages = [];
  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('slug, published_at')
      .eq('published', true);
    if (data) {
      const staticSlugs = new Set(staticPosts.map(p => p.slug));
      dbBlogPages = data
        .filter(p => !staticSlugs.has(p.slug))
        .map(p => ({
          url: `${BASE}/blog/${p.slug}`,
          lastModified: new Date(p.published_at || new Date()),
          changeFrequency: 'monthly',
          priority: 0.7,
        }));
    }
  } catch (e) {}

  return [...staticPages, ...workPages, ...staticBlogPages, ...dbBlogPages];
}
