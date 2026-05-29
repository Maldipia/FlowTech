import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

function isAuthenticated() {
  return cookies().get('admin_session')?.value === 'authenticated';
}

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function GET(request) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data, error } = await supabaseAdmin
    .from('products')
    .select(`*, product_variants(*), product_images(*)`)
    .order('sort_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data || [] });
}

export async function POST(request) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const { name, description, category, delivery_type, emoji, variants, images } = body;
  if (!name || !category) return NextResponse.json({ error: 'Name and category required' }, { status: 400 });

  const { data: product, error } = await supabaseAdmin
    .from('products')
    .insert([{ name, description, category, delivery_type: delivery_type || 'standard', slug: slugify(name), emoji }])
    .select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (variants?.length) {
    await supabaseAdmin.from('product_variants').insert(
      variants.map(v => ({ ...v, product_id: product.id }))
    );
  }
  if (images?.length) {
    await supabaseAdmin.from('product_images').insert(
      images.map((url, i) => ({ product_id: product.id, image_url: url, display_order: i, is_primary: i === 0 }))
    );
  }
  return NextResponse.json({ data: product });
}

export async function PUT(request) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, variants, images, ...body } = await request.json();
  if (body.name) body.slug = slugify(body.name);

  const { data, error } = await supabaseAdmin.from('products').update(body).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (variants) {
    await supabaseAdmin.from('product_variants').delete().eq('product_id', id);
    await supabaseAdmin.from('product_variants').insert(variants.map(v => ({ ...v, product_id: id })));
  }
  return NextResponse.json({ data });
}

export async function DELETE(request) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await request.json();
  const { error } = await supabaseAdmin.from('products').update({ is_active: false }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
