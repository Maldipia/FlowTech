import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
export const dynamic = 'force-dynamic';
const isAuth = () => cookies().get('admin_session')?.value === 'authenticated';
export async function GET() {
  if (!isAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data } = await supabaseAdmin.from('product_reviews')
    .select('*').order('created_at', { ascending: false });
  return NextResponse.json({ data: data || [] });
}
export async function PATCH(request) {
  if (!isAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, is_approved } = await request.json();
  const { data, error } = await supabaseAdmin.from('product_reviews')
    .update({ is_approved }).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
export async function DELETE(request) {
  if (!isAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await request.json();
  await supabaseAdmin.from('product_reviews').delete().eq('id', id);
  return NextResponse.json({ success: true });
}
