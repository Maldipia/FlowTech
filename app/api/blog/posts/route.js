import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { posts as staticPosts } from '@/lib/posts';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (slug) {
    // Try Supabase first, fall back to static
    const { data } = await supabase
      .from('blog_posts').select('*').eq('slug', slug).eq('published', true).single();
    if (data) return NextResponse.json({ data, source: 'db' });
    const staticPost = staticPosts.find(p => p.slug === slug);
    if (staticPost) return NextResponse.json({ data: staticPost, source: 'static' });
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // List: merge Supabase published + static posts
  const { data: dbPosts } = await supabase
    .from('blog_posts').select('*').eq('published', true)
    .order('published_at', { ascending: false });

  const dbSlugs = new Set((dbPosts || []).map(p => p.slug));
  const filtered = staticPosts.filter(p => !dbSlugs.has(p.slug));
  const allPosts = [...(dbPosts || []), ...filtered]
    .sort((a, b) => new Date(b.published_at || b.date) - new Date(a.published_at || a.date));

  return NextResponse.json({ data: allPosts });
}
