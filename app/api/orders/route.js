import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `ORD-${ts}${rand}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer_name, customer_email, customer_mobile, delivery_address, delivery_city, delivery_province, courier, shipping_fee, items, account_number, notes, payment_method } = body;

    if (!customer_name || !customer_email || !delivery_address || !courier || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let account_id = null;
    if (account_number) {
      const { data: acc } = await supabaseAdmin.from('accounts').select('id').eq('account_number', account_number).eq('is_active', true).single();
      if (acc) account_id = acc.id;
    }

    const variantIds = items.map(i => i.variant_id);
    const { data: variants } = await supabaseAdmin.from('product_variants').select('id, retail_price, product_id, label').in('id', variantIds);
    const variantMap = Object.fromEntries((variants || []).map(v => [v.id, v]));

    let orderItems = [];
    let subtotal = 0;
    let totalDiscount = 0;

    for (const item of items) {
      const variant = variantMap[item.variant_id];
      if (!variant) continue;
      let discountPct = 0;
      let discountReason = null;

      if (account_id) {
        const { data: tiers } = await supabaseAdmin.from('discount_tiers').select('*').eq('account_id', account_id).eq('is_active', true).lte('min_qty', item.qty).order('min_qty', { ascending: false }).limit(1);
        if (tiers?.length) {
          const tier = tiers[0];
          if (!tier.max_qty || item.qty <= tier.max_qty) {
            discountPct = tier.discount_pct;
            discountReason = `${account_number} ${tier.discount_pct}% tier (${tier.min_qty}+ units)`;
          }
        }
      }

      const finalPrice = variant.retail_price * (1 - discountPct / 100);
      subtotal += variant.retail_price * item.qty;
      totalDiscount += (variant.retail_price - finalPrice) * item.qty;
      orderItems.push({ product_id: variant.product_id, variant_id: item.variant_id, product_name: item.product_name, variant_label: variant.label, qty: item.qty, retail_price: variant.retail_price, discount_pct: discountPct, discount_reason: discountReason, final_price: finalPrice });
    }

    const totalAmount = (subtotal - totalDiscount) + Number(shipping_fee || 0);

    const { data: order, error: orderError } = await supabaseAdmin.from('orders').insert([{ order_number: generateOrderNumber(), customer_name, customer_email, customer_mobile, delivery_address, delivery_city, delivery_province, courier, shipping_fee: Number(shipping_fee || 0), account_id, account_number, subtotal, total_discount: totalDiscount, total_amount: totalAmount, payment_method: payment_method || 'cod', notes, status: 'pending', payment_status: 'pending' }]).select('id, order_number').single();
    if (orderError) throw orderError;

    await supabaseAdmin.from('order_items').insert(orderItems.map(i => ({ ...i, order_id: order.id })));
    await supabaseAdmin.from('order_events').insert([{ order_id: order.id, event_type: 'order_created', actor_type: 'customer', payload: { courier, total: totalAmount } }]);

    if (process.env.N8N_WEBHOOK_URL) {
      fetch(process.env.N8N_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_number: order.order_number, customer_email, total_amount: totalAmount }) }).catch(() => {});
    }

    return NextResponse.json({ success: true, order_number: order.order_number, id: order.id });
  } catch (err) {
    console.error('Order creation error:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
  const { data, error } = await supabaseAdmin.from('orders').select('*, order_items(*)').eq('customer_email', email).order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data || [] });
}
