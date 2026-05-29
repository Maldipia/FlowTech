import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
export const dynamic = 'force-dynamic';
const isAuth = () => cookies().get('admin_session')?.value === 'authenticated';

export async function GET() {
  if (!isAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data } = await supabaseAdmin.from('promo_codes').select('*').order('created_at', { ascending: false });
  return NextResponse.json({ data: data || [] });
}
export async function POST(request) {
  if (!isAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const { data, error } = await supabaseAdmin.from('promo_codes')
    .insert([{ ...body, code: body.code?.toUpperCase() }]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
export async function PATCH(request) {
  if (!isAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, ...body } = await request.json();
  const { data, error } = await supabaseAdmin.from('promo_codes').update(body).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
export async function DELETE(request) {
  if (!isAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await request.json();
  await supabaseAdmin.from('promo_codes').update({ is_active: false }).eq('id', id);
  return NextResponse.json({ success: true });
}
