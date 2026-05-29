import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  if (!q || q.length < 2) return NextResponse.json({ data: [] });
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('id,name,slug,category,emoji,product_variants(*),product_images(*)')
    .eq('is_active', true)
    .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
    .limit(12);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data || [], query: q });
}
