'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Upload, Image, Video, CheckCircle, Globe, CreditCard, Package, Truck } from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState({});
  const fileRefs = {
    logo_url: useRef(), gcash_qr_url: useRef(), maya_qr_url: useRef(), hero_video_url: useRef()
  };

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => { if (r.status === 401) { router.push('/admin/login'); return null; } return r.json(); })
      .then(d => {
        if (!d) return;
        const map = Object.fromEntries((d.data || []).map(s => [s.key, { value: s.value || '', label: s.label, type: s.type }]));
        setSettings(map);
        setLoading(false);
      });
  }, [router]);

  const set = (key, value) => setSettings(s => ({ ...s, [key]: { ...s[key], value } }));

  const saveAll = async () => {
    setSaving(true);
    const updates = Object.entries(settings).map(([key, s]) => ({ key, value: s.value }));
    await fetch('/api/admin/settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const uploadFile = async (key, file) => {
    if (!file) return;
    setUploading(u => ({ ...u, [key]: true }));
    const fd = new FormData();
    fd.append('file', file); fd.append('key', key);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.success) setSettings(s => ({ ...s, [key]: { ...s[key], value: data.url } }));
    setUploading(u => ({ ...u, [key]: false }));
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-gray-400 gap-3">
      <Loader2 size={18} className="animate-spin" />
    </div>
  );

  const TextInput = ({ k, placeholder = '' }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{settings[k]?.label}</label>
      <input value={settings[k]?.value || ''} onChange={e => set(k, e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gray-400 transition-colors" />
    </div>
  );

  const ImageUpload = ({ k, label }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label || settings[k]?.label}</label>
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 hover:border-gray-300 transition-colors">
        {settings[k]?.value ? (
          <div className="flex items-start gap-4">
            <img src={settings[k].value} alt={label} className="w-20 h-20 object-contain rounded-xl border border-gray-100 bg-gray-50 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-green-600 font-medium mb-1">✓ Uploaded</p>
              <p className="text-[10px] text-gray-400 break-all mb-2 leading-relaxed">{settings[k].value}</p>
              <button onClick={() => fileRefs[k]?.current?.click()} className="text-xs text-blue-600 hover:underline">Replace</button>
            </div>
          </div>
        ) : (
          <div className="text-center py-3">
            <Image size={24} className="text-gray-300 mx-auto mb-2" />
            <button onClick={() => fileRefs[k]?.current?.click()}
              className="bg-[#0A0A0A] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto">
              {uploading[k] ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
              {uploading[k] ? 'Uploading…' : 'Upload image'}
            </button>
          </div>
        )}
      </div>
      {settings[k]?.value && (
        <button onClick={() => fileRefs[k]?.current?.click()} disabled={uploading[k]}
          className="mt-1.5 w-full border border-gray-200 text-gray-500 text-xs py-2 rounded-xl hover:border-gray-400 transition-colors flex items-center justify-center gap-1.5">
          {uploading[k] ? <><Loader2 size={11} className="animate-spin" />Uploading…</> : <><Upload size={11} />Replace image</>}
        </button>
      )}
      <input ref={fileRefs[k]} type="file" accept="image/*" className="hidden" onChange={e => uploadFile(k, e.target.files?.[0])} />
    </div>
  );

  const VideoUpload = ({ k }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Hero Video (short clip, MP4 recommended)</label>
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition-colors">
        {settings[k]?.value ? (
          <div>
            <video src={settings[k].value} className="w-full max-h-40 rounded-xl mb-3 bg-black" controls muted />
            <div className="flex items-center justify-between">
              <p className="text-xs text-green-600 font-medium">✓ Video uploaded</p>
              <button onClick={() => fileRefs[k]?.current?.click()} className="text-xs text-blue-600 hover:underline">Replace</button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1 break-all">{settings[k].value}</p>
          </div>
        ) : (
          <div className="text-center py-4">
            <Video size={28} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-1">Upload a short video clip</p>
            <p className="text-xs text-gray-400 mb-4">MP4, MOV, WEBM · Max 50MB · Recommended: 10–30 seconds</p>
            <button onClick={() => fileRefs[k]?.current?.click()}
              className="bg-[#0A0A0A] text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto">
              {uploading[k] ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
              {uploading[k] ? 'Uploading…' : 'Upload video'}
            </button>
          </div>
        )}
      </div>
      <input ref={fileRefs[k]} type="file" accept="video/mp4,video/mov,video/webm,video/*" className="hidden"
        onChange={e => uploadFile(k, e.target.files?.[0])} />
    </div>
  );

  const Toggle = ({ k }) => {
    const on = settings[k]?.value === 'true';
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm text-gray-700">{settings[k]?.label}</span>
        <button onClick={() => set(k, on ? 'false' : 'true')}
          className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${on ? 'bg-[#0A0A0A]' : 'bg-gray-200'}`}>
          <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${on ? 'translate-x-5' : ''}`} />
        </button>
      </div>
    );
  };

  const Section = ({ icon: Icon, title, children }) => (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2.5 text-sm">
        <div className="w-7 h-7 bg-[#0A0A0A] rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon size={13} className="text-[#C9A84C]" />
        </div>
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400 text-sm">Changes are saved instantly to DB and reflected on the website.</p>
        <button onClick={saveAll} disabled={saving}
          className="flex items-center gap-2 bg-[#0A0A0A] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle size={14} /> : <Save size={14} />}
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save All'}
        </button>
      </div>

      <div className="space-y-5">
        {/* HOMEPAGE CONTENT */}
        <Section icon={Globe} title="Homepage Content">
          <TextInput k="announcement" placeholder="e.g. Free shipping on orders ₱1,500+" />
          <TextInput k="hero_greeting" placeholder="Isang Magandang Araw Mga Boss Amo" />
          <TextInput k="hero_title" placeholder="The Ancient Modern Natural Diet" />
          <TextInput k="hero_subtitle" placeholder="An ancient modern natural diet..." />
          <TextInput k="hero_cta_primary" placeholder="SHOP NOW" />
          <div className="grid grid-cols-3 gap-3">
            <TextInput k="stat_1_value" placeholder="2.3M" />
            <TextInput k="stat_2_value" placeholder="100%" />
            <TextInput k="stat_3_value" placeholder="0" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <TextInput k="stat_1_label" placeholder="Facebook Followers" />
            <TextInput k="stat_2_label" placeholder="All Natural" />
            <TextInput k="stat_3_label" placeholder="Preservatives" />
          </div>
          <TextInput k="open_hours" placeholder="Open Daily 9AM–11PM" />
          <TextInput k="fb_page_url" placeholder="https://www.facebook.com/superodogfarm" />
          <TextInput k="footer_text" placeholder="Manufactured by Supero Dog Farm..." />
        </Section>

        {/* BRANDING */}
        <Section icon={Package} title="Brand & Logo">
          <div className="grid sm:grid-cols-2 gap-4">
            <TextInput k="store_name" placeholder="Supero Dog Farm" />
            <TextInput k="store_tagline" placeholder="Istorya ng Supero" />
            <TextInput k="store_email" placeholder="community@superodogfarm.com" />
            <TextInput k="store_mobile" placeholder="09XX XXX XXXX" />
          </div>
          <TextInput k="store_address" placeholder="Purok 4, Brgy Bucal, Amadeo, Cavite 4119" />
          <ImageUpload k="logo_url" label="Store Logo (shown in navbar)" />
        </Section>

        {/* HERO VIDEO */}
        <Section icon={Video} title="Homepage Hero Video">
          <p className="text-xs text-gray-400 -mt-2">Upload a short 10–30 second video clip. It will play in the hero section of the homepage (muted, autoplay loop).</p>
          <VideoUpload k="hero_video_url" />
        </Section>

        {/* PAYMENT */}
        <Section icon={CreditCard} title="Payment Methods">
          <div className="border border-gray-100 rounded-xl p-4 space-y-0.5">
            <Toggle k="cod_enabled" />
            <Toggle k="gcash_enabled" />
            <Toggle k="maya_enabled" />
            <Toggle k="bank_enabled" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <TextInput k="gcash_name" placeholder="GCash account name" />
            <TextInput k="gcash_number" placeholder="09XX XXX XXXX" />
          </div>
          <ImageUpload k="gcash_qr_url" label="GCash QR Code" />
          <div className="grid sm:grid-cols-2 gap-4">
            <TextInput k="maya_name" placeholder="Maya account name" />
            <TextInput k="maya_number" placeholder="09XX XXX XXXX" />
          </div>
          <ImageUpload k="maya_qr_url" label="Maya QR Code" />
          <div className="grid sm:grid-cols-3 gap-3">
            <TextInput k="bank_name" placeholder="BDO / BPI" />
            <TextInput k="bank_account_name" placeholder="Account name" />
            <TextInput k="bank_account" placeholder="Account number" />
          </div>
        </Section>

        {/* SHIPPING */}
        <Section icon={Truck} title="Shipping">
          <TextInput k="free_shipping_min" placeholder="0 = disabled · 1500 = free over ₱1,500" />
        </Section>
      </div>

      {/* Sticky save */}
      <div className="sticky bottom-4 mt-6">
        <button onClick={saveAll} disabled={saving}
          className="w-full bg-[#0A0A0A] text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50 shadow-xl">
          {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <CheckCircle size={15} /> : <Save size={15} />}
          {saved ? '✓ All changes saved!' : saving ? 'Saving…' : 'Save All Settings'}
        </button>
      </div>
    </div>
  );
}
