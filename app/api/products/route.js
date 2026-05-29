import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const slug = searchParams.get('slug');

  try {
    if (slug) {
      const { data: product, error } = await supabaseAdmin
        .from('products')
        .select('*, product_variants(*), product_images(*)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      if (error) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      return NextResponse.json({ data: product });
    }

    let query = supabaseAdmin
      .from('products')
      .select('*, product_variants(*), product_images(*)')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ data: data || [] });
  } catch (err) {
    console.error('Products API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
