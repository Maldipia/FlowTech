import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

function generateAccountNumber() {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `ACC-${num}`;
}

export async function POST(request) {
  const { name, email, mobile, password } = await request.json();
  if (!name || !email || !password) return NextResponse.json({ error: 'Name, email and password required' }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });

  // Check if email already exists
  const { data: existing } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('email', email.toLowerCase())
    .single();

  if (existing) return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });

  // Hash password
  const password_hash = await bcrypt.hash(password, 10);

  // Generate unique account number
  let account_number;
  let attempts = 0;
  do {
    account_number = generateAccountNumber();
    const { data: exists } = await supabaseAdmin.from('customers').select('id').eq('account_number', account_number).single();
    if (!exists) break;
    attempts++;
  } while (attempts < 10);

  const { data: customer, error } = await supabaseAdmin
    .from('customers')
    .insert([{ name, email: email.toLowerCase(), mobile, password_hash, account_number, is_active: true }])
    .select('id, name, email, account_number')
    .single();

  if (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }

  const response = NextResponse.json({ success: true, user: customer });
  response.cookies.set('customer_session', JSON.stringify({
    id: customer.id, name: customer.name, email: customer.email, account_number: customer.account_number
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  return response;
}
