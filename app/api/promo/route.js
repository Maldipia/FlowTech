import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function POST(request) {
  const { code, subtotal } = await request.json();
  if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 });
  const { data: promo } = await supabaseAdmin.from('promo_codes').select('*')
    .eq('code', code.toUpperCase().trim()).eq('is_active', true).single();
  if (!promo) return NextResponse.json({ error: 'Invalid or expired code' }, { status: 404 });
  if (promo.valid_until && new Date(promo.valid_until) < new Date())
    return NextResponse.json({ error: 'Code has expired' }, { status: 400 });
  if (promo.max_uses && promo.uses_count >= promo.max_uses)
    return NextResponse.json({ error: 'Usage limit reached' }, { status: 400 });
  if ((subtotal || 0) < (promo.min_order || 0))
    return NextResponse.json({ error: 'Min order of P' + promo.min_order + ' required' }, { status: 400 });
  const base = subtotal || 0;
  const discount = promo.type === 'percentage'
    ? Math.round(base * promo.value / 100 * 100) / 100
    : Math.min(Number(promo.value), base);
  return NextResponse.json({ valid: true, code: promo.code, description: promo.description,
    type: promo.type, value: promo.value, discount, final: base - discount });
}
