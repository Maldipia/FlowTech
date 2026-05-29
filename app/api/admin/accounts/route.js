import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

function isAuthenticated() {
  return cookies().get('admin_session')?.value === 'authenticated';
}

export async function GET(request) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const tiersOnly = searchParams.get('tiers');

  if (tiersOnly && id) {
    const { data, error } = await supabaseAdmin
      .from('discount_tiers')
      .select('*')
      .eq('account_id', id)
      .eq('is_active', true)
      .order('min_qty', { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ tiers: data || [] });
  }

  const { data, error } = await supabaseAdmin
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data || [] });
}

export async function POST(request) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { account_number, name, email, mobile, type } = await request.json();
  if (!account_number || !name) return NextResponse.json({ error: 'Account number and name required' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('accounts')
    .insert([{ account_number, name, email, mobile, type: type || 'loyal_customer', is_active: true }])
    .select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PATCH(request) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();

  if (body.action === 'add_tier') {
    const { account_id, min_qty, max_qty, discount_pct } = body;
    const { data, error } = await supabaseAdmin
      .from('discount_tiers')
      .insert([{
        account_id,
        min_qty: Number(min_qty),
        max_qty: max_qty ? Number(max_qty) : null,
        discount_pct: Number(discount_pct),
        is_active: true
      }])
      .select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  const { id, ...updates } = body;
  const { data, error } = await supabaseAdmin
    .from('accounts').update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
