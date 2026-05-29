import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
export const dynamic = 'force-dynamic';
const isAuth = () => cookies().get('admin_session')?.value === 'authenticated';
export async function PUT(request) {
  if (!isAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const updates = await request.json();
  for (const { key, value } of updates) {
    await supabaseAdmin.from('settings').upsert({ key, value, label: key, type: 'text' }, { onConflict: 'key' });
  }
  return NextResponse.json({ success: true });
}
