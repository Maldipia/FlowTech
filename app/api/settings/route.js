import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('settings')
    .select('key, value, type');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Return as key-value object for easy use
  const settings = Object.fromEntries((data || []).map(s => [s.key, s.value]));
  return NextResponse.json({ data: settings });
}
