import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'All fields required.' }, { status: 400 });
    }

    const key = process.env.RESEND_API_KEY;
    if (key) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Flowtech.ph <noreply@flowtech.ph>',
          to: [process.env.NOTIFY_EMAIL || 'pia@flowtech.ph'],
          reply_to: email,
          subject: `Quick message from ${name} — flowtech.ph`,
          html: `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Message:</strong></p>
            <p style="background:#f5f5f5;padding:12px;border-radius:6px;">${message.replace(/\n/g, '<br/>')}</p>
          `,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 });
  }
}
