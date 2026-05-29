import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
export const dynamic = 'force-dynamic';
const isAuth = () => cookies().get('admin_session')?.value === 'authenticated';

export async function GET(request) {
  if (!isAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'orders';
  const status = searchParams.get('status') || 'all';

  if (type === 'orders') {
    let q = supabaseAdmin.from('orders')
      .select('order_number,created_at,customer_name,customer_email,customer_mobile,delivery_address,delivery_city,delivery_province,courier,shipping_fee,subtotal,total_discount,promo_code,total_amount,payment_method,status')
      .order('created_at', { ascending: false }).limit(1000);
    if (status !== 'all') q = q.eq('status', status);
    const { data: rows } = await q;
    const headers = ['Order#','Date','Name','Email','Mobile','Address','City','Province','Courier','Shipping','Subtotal','Discount','Promo','Total','Payment','Status'];
    const keys = ['order_number','created_at','customer_name','customer_email','customer_mobile','delivery_address','delivery_city','delivery_province','courier','shipping_fee','subtotal','total_discount','promo_code','total_amount','payment_method','status'];
    const csv = [headers.join(','), ...(rows||[]).map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(','))].join('\n');
    return new NextResponse(csv, { headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="supero-orders-${new Date().toISOString().split('T')[0]}.csv"`
    }});
  }

  if (type === 'products') {
    const { data } = await supabaseAdmin.from('products')
      .select('name,slug,category,delivery_type,is_active,product_variants(label,retail_price,stock_qty)')
      .order('sort_order');
    const rows = [];
    (data||[]).forEach(p => (p.product_variants||[]).forEach(v =>
      rows.push([p.name, p.category, v.label, v.retail_price, v.stock_qty, p.is_active])
    ));
    const csv = ['Product,Category,Variant,Price,Stock,Active', ...rows.map(r => r.map(v => JSON.stringify(v??'')).join(','))].join('\n');
    return new NextResponse(csv, { headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="supero-products-${new Date().toISOString().split('T')[0]}.csv"`
    }});
  }
  return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
}
