import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();

    // 1. Save to Supabase
    const { data, error } = await supabase
      .from('discovery_responses')
      .insert([{ ...body, status: 'New' }])
      .select('id').single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
    }

    // 2. Send email notification (Resend)
    await sendNotification(body, data.id);

    // 3. Fire n8n webhook — non-blocking, won't affect response time
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, supabase_id: data.id, submitted_at: new Date().toISOString() }),
      }).catch(err => console.error('n8n webhook error:', err));
    }

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
      subject: `New Discovery: ${data.business_name || 'Unknown'} — ${data.budget_range || 'Budget TBD'}`,
      html: `<p><strong>Business:</strong> ${data.business_name}</p>
             <p><strong>Contact:</strong> ${data.contact_person} — ${data.email} — ${data.mobile}</p>
             <p><strong>Budget:</strong> ${data.budget_range}</p>
             <p><strong>Timeline:</strong> ${data.timeline}</p>
             <p><strong>Objective:</strong> ${data.main_objective}</p>
             <p><strong>Details:</strong> ${data.project_details || '—'}</p>
             <p><strong>Found via:</strong> ${data.how_found || '—'}</p>
             <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/discovery">View in admin →</a></p>`
    })
  });
}
