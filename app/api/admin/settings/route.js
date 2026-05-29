import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

function isAuthenticated() {
  return cookies().get('admin_session')?.value === 'authenticated';
}

export async function GET() {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data, error } = await supabaseAdmin
    .from('settings').select('*').order('key');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data || [] });
}

export async function PUT(request) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const updates = await request.json(); // array of {key, value}
  
  for (const { key, value } of updates) {
    await supabaseAdmin
      .from('settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key);
  }
  return NextResponse.json({ success: true });
}
