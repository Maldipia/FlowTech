import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
  const { data: cust } = await supabaseAdmin.from('customers')
    .select('id,loyalty_points').eq('email', email.toLowerCase()).single();
  if (!cust) return NextResponse.json({ points: 0, transactions: [] });
  const { data: txns } = await supabaseAdmin.from('loyalty_transactions')
    .select('*').eq('customer_id', cust.id)
    .order('created_at', { ascending: false }).limit(20);
  return NextResponse.json({ points: cust.loyalty_points || 0, transactions: txns || [] });
}
