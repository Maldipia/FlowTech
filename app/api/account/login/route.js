import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { email, password } = await request.json();
  if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

  // Check if customer exists
  const { data: customer } = await supabaseAdmin
    .from('customers')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (!customer) return NextResponse.json({ error: 'No account found with this email.' }, { status: 401 });

  const valid = await bcrypt.compare(password, customer.password_hash);
  if (!valid) return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });

  const response = NextResponse.json({
    success: true,
    user: { id: customer.id, name: customer.name, email: customer.email, account_number: customer.account_number }
  });

  response.cookies.set('customer_session', JSON.stringify({
    id: customer.id, name: customer.name, email: customer.email, account_number: customer.account_number
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });

  return response;
}
