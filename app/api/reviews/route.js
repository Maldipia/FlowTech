import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const product_id = searchParams.get('product_id');
  if (!product_id) return NextResponse.json({ error: 'product_id required' }, { status: 400 });
  const { data } = await supabaseAdmin.from('product_reviews')
    .select('id,customer_name,rating,title,body,is_verified,created_at')
    .eq('product_id', product_id).eq('is_approved', true)
    .order('created_at', { ascending: false });
  const reviews = data || [];
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  return NextResponse.json({ data: reviews, avg: Math.round(avg * 10) / 10, count: reviews.length });
}
export async function POST(request) {
  const { product_id, customer_name, customer_email, rating, title, body, order_id } = await request.json();
  if (!product_id || !customer_name || !customer_email || !rating)
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  if (rating < 1 || rating > 5)
    return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 });
  const { data, error } = await supabaseAdmin.from('product_reviews').insert([{
    product_id, customer_name, customer_email: customer_email.toLowerCase(),
    rating, title, body, order_id, is_approved: false, is_verified: !!order_id
  }]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}
