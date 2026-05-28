import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('discovery_responses')
      .insert([{ ...body, status: 'New' }])
      .select('id').single();
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
    }
    await sendNotification(body, data.id);
    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

async function sendNotification(data, id) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Flowtech.ph <noreply@flowtech.ph>',
      to: [process.env.NOTIFY_EMAIL || 'pia@flowtech.ph'],
      subject: `🔔 New Discovery: ${data.business_name||'Unknown'} — ${data.budget_range||'Budget TBD'}`,
      html: `<p><strong>Business:</strong> ${data.business_name}</p><p><strong>Contact:</strong> ${data.contact_person} — ${data.email} — ${data.mobile}</p><p><strong>Budget:</strong> ${data.budget_range}</p><p><strong>Objective:</strong> ${data.main_objective}</p><p><strong>Details:</strong> ${data.project_details||'—'}</p><p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/discovery?id=${id}">View full response →</a></p>`
    })
  });
}
