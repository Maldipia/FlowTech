import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

function isAuthenticated() {
  return cookies().get('admin_session')?.value === 'authenticated';
}

export async function POST(request) {
  if (!isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const settingKey = formData.get('key');

    if (!file || !settingKey) {
      return NextResponse.json({ error: 'File and key required' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const ext = file.name.split('.').pop().toLowerCase();
    const fileName = `${settingKey}-${Date.now()}.${ext}`;
    const bucket = 'supero-assets';

    const { data: upload, error: uploadError } = await supabaseAdmin
      .storage.from(bucket)
      .upload(fileName, bytes, { contentType: file.type, upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabaseAdmin
      .storage.from(bucket).getPublicUrl(fileName);

    // Save to settings if it's a settings key
    if (settingKey && !settingKey.startsWith('product_img')) {
      await supabaseAdmin
        .from('settings')
        .update({ value: publicUrl, updated_at: new Date().toISOString() })
        .eq('key', settingKey);
    }

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error('Upload API error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
