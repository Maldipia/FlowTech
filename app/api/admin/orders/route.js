import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

function isAuthenticated() {
  return cookies().get('admin_session')?.value === 'authenticated';
}

export async function GET(request) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  let query = supabaseAdmin
    .from('orders')
    .select(`*, order_items(*)`)
    .order('created_at', { ascending: false })
    .limit(100);

  if (status && status !== 'all') query = query.eq('status', status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data || [] });
}

export async function PATCH(request) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, status } = await request.json();

  const { error } = await supabaseAdmin
    .from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabaseAdmin.from('order_events').insert([{
    order_id: id, event_type: `status_updated_to_${status}`,
    actor_type: 'admin', payload: { status }
  }]);

  return NextResponse.json({ success: true });
}
