import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');

    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
    };

    if (slug) {
      const { data: product, error } = await supabaseAdmin
        .from('products')
        .select('id,name,slug,description,category,emoji,delivery_type,sort_order,product_variants(*),product_images(*)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      if (error) return NextResponse.json({ error: 'Not found' }, { status: 404, headers });
      return NextResponse.json({ data: product }, { headers });
    }

    let query = supabaseAdmin
      .from('products')
      .select('id,name,slug,description,category,emoji,delivery_type,sort_order,product_variants(*),product_images(*)')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .range(0, 99);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500, headers });
    }

    return NextResponse.json({ data: data || [] }, { headers });
  } catch (err) {
    console.error('Products API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
