import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = cookies().get('customer_session')?.value;
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const user = JSON.parse(session);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}
