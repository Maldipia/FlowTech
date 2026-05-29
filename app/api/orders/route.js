import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

function genOrderNum() {
  return 'ORD-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2,5).toUpperCase();
}

async function awardPoints(email, orderId, total) {
  try {
    const pts = Math.floor(total / 10);
    if (pts <= 0) return;
    const { data: c } = await supabaseAdmin.from('customers').select('id,loyalty_points').eq('email', email).single();
    if (!c) return;
    const newBal = (c.loyalty_points || 0) + pts;
    await supabaseAdmin.from('customers').update({ loyalty_points: newBal }).eq('id', c.id);
    await supabaseAdmin.from('loyalty_transactions').insert([{
      customer_id: c.id, customer_email: email, order_id: orderId,
      type: 'earn', points: pts, balance_after: newBal, description: 'Earned from order'
    }]);
  } catch {}
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer_name, customer_email, customer_mobile, delivery_address,
            delivery_city, delivery_province, courier, shipping_fee, items,
            account_number, notes, payment_method, promo_code } = body;

    if (!customer_name || !customer_email || !delivery_address || !courier || !items?.length)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    let account_id = null;
    if (account_number) {
      const { data: acc } = await supabaseAdmin.from('accounts').select('id')
        .eq('account_number', account_number).eq('is_active', true).single();
      if (acc) account_id = acc.id;
    }

    const variantIds = items.map(i => i.variant_id);
    const { data: variants } = await supabaseAdmin.from('product_variants')
      .select('id,retail_price,product_id,label').in('id', variantIds);
    const vMap = Object.fromEntries((variants || []).map(v => [v.id, v]));

    let orderItems = [], subtotal = 0, totalDiscount = 0;
    for (const item of items) {
      const v = vMap[item.variant_id];
      if (!v) continue;
      let discPct = 0;
      if (account_id) {
        const { data: tiers } = await supabaseAdmin.from('discount_tiers').select('discount_pct')
          .eq('account_id', account_id).eq('is_active', true)
          .lte('min_qty', item.qty).order('min_qty', { ascending: false }).limit(1);
        if (tiers?.length) discPct = tiers[0].discount_pct;
      }
      const finalPrice = v.retail_price * (1 - discPct / 100);
      subtotal += v.retail_price * item.qty;
      totalDiscount += (v.retail_price - finalPrice) * item.qty;
      orderItems.push({ product_id: v.product_id, variant_id: item.variant_id,
        product_name: item.product_name, variant_label: v.label, qty: item.qty,
        retail_price: v.retail_price, discount_pct: discPct, final_price: finalPrice });
    }

    let promoDiscount = 0, validPromoCode = null;
    if (promo_code) {
      const { data: promo } = await supabaseAdmin.from('promo_codes').select('*')
        .eq('code', promo_code.toUpperCase()).eq('is_active', true).single();
      if (promo && (!promo.valid_until || new Date(promo.valid_until) >= new Date())
          && (!promo.max_uses || promo.uses_count < promo.max_uses)
          && (subtotal - totalDiscount) >= (promo.min_order || 0)) {
        const base = subtotal - totalDiscount;
        promoDiscount = promo.type === 'percentage'
          ? Math.round(base * promo.value / 100 * 100) / 100
          : Math.min(Number(promo.value), base);
        validPromoCode = promo;
      }
    }

    const totalAmount = Math.max(0, subtotal - totalDiscount - promoDiscount) + Number(shipping_fee || 0);

    const { data: order, error: oErr } = await supabaseAdmin.from('orders').insert([{
      order_number: genOrderNum(), customer_name, customer_email, customer_mobile,
      delivery_address, delivery_city, delivery_province, courier, account_id, account_number,
      shipping_fee: Number(shipping_fee || 0), subtotal,
      total_discount: totalDiscount + promoDiscount,
      promo_code: validPromoCode?.code || null, promo_discount: promoDiscount,
      total_amount: totalAmount, payment_method: payment_method || 'cod',
      notes, status: 'pending', payment_status: 'pending',
    }]).select('id,order_number').single();
    if (oErr) throw oErr;

    await supabaseAdmin.from('order_items').insert(orderItems.map(i => ({ ...i, order_id: order.id })));
    await supabaseAdmin.from('order_events').insert([{
      order_id: order.id, event_type: 'order_created', actor_type: 'customer',
      payload: { courier, total: totalAmount }
    }]);

    if (validPromoCode) {
      await supabaseAdmin.from('promo_codes')
        .update({ uses_count: (validPromoCode.uses_count || 0) + 1 })
        .eq('id', validPromoCode.id);
    }

    await awardPoints(customer_email.toLowerCase(), order.id, totalAmount);

    if (process.env.N8N_WEBHOOK_URL) {
      fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'new_order', order_number: order.order_number,
          customer_name, customer_email, total_amount: totalAmount, courier })
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, order_number: order.order_number, id: order.id });
  } catch (err) {
    console.error('Order error:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
  const { data, error } = await supabaseAdmin.from('orders')
    .select('*,order_items(*)').eq('customer_email', email)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data || [] });
}
