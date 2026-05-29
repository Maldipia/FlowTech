'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2, Save, Upload, CheckCircle,
  ImageIcon, Video, Globe, CreditCard, Truck, Store
} from 'lucide-react';

const TABS = [
  { id: 'logo',    label: 'Logo & Brand',    icon: Store },
  { id: 'landing', label: 'Landing Page',    icon: Globe },
  { id: 'video',   label: 'Hero Video',      icon: Video },
  { id: 'payment', label: 'Mode of Payment', icon: CreditCard },
  { id: 'shipping',label: 'Shipping',        icon: Truck },
];

export default function AdminSettingsPage() {
  const router = useRouter();
  const [tab, setTab] = useState('logo');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState({});
  const fileRefs = {
    logo_url: useRef(),
    gcash_qr_url: useRef(),
    maya_qr_url: useRef(),
    hero_video_url: useRef(),
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
    if (data.success) set(key, data.url);
    setUploading(u => ({ ...u, [key]: false }));
  };

  // ── Reusable field components ──
  const Field = ({ k, placeholder = '', type = 'text', rows }) => (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
        {settings[k]?.label || k}
      </label>
      {rows ? (
        <textarea value={settings[k]?.value || ''} onChange={e => set(k, e.target.value)}
          placeholder={placeholder} rows={rows}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 resize-none transition-colors" />
      ) : (
        <input type={type} value={settings[k]?.value || ''} onChange={e => set(k, e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 transition-colors" />
      )}
    </div>
  );

  const Toggle = ({ k }) => {
    const on = settings[k]?.value === 'true';
    return (
      <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
        <div>
          <p className="text-sm font-semibold text-gray-800">{settings[k]?.label}</p>
          <p className="text-xs text-gray-400">{on ? 'Enabled — shown at checkout' : 'Disabled — hidden from checkout'}</p>
        </div>
        <button onClick={() => set(k, on ? 'false' : 'true')}
          className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${on ? 'bg-green-500' : 'bg-gray-200'}`}>
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${on ? 'left-7' : 'left-1'}`} />
        </button>
      </div>
    );
  };

  const ImageUploadBox = ({ k, label, hint }) => (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-3">{hint}</p>}
      <div className={`border-2 border-dashed rounded-2xl p-5 transition-colors cursor-pointer
        ${settings[k]?.value ? 'border-gray-200 hover:border-gray-300' : 'border-gray-200 hover:border-[#C9A84C]/40 hover:bg-[#FBF7EE]/30'}`}
        onClick={() => !settings[k]?.value && fileRefs[k]?.current?.click()}>
        {settings[k]?.value ? (
          <div className="flex items-start gap-4">
            <img src={settings[k].value} alt={label}
              className="w-24 h-24 object-contain rounded-xl border border-gray-100 bg-gray-50 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">✓ Uploaded</span>
              </div>
              <p className="text-[10px] text-gray-400 break-all leading-relaxed mb-3">{settings[k].value}</p>
              <button onClick={e => { e.stopPropagation(); fileRefs[k]?.current?.click(); }}
                disabled={uploading[k]}
                className="flex items-center gap-1.5 bg-[#0A0A0A] hover:bg-gray-800 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors">
                {uploading[k] ? <Loader2 size={11} className="animate-spin" /> : <Upload size={11} />}
                {uploading[k] ? 'Uploading…' : 'Replace'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <ImageIcon size={28} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
            <p className="text-xs text-gray-400 mb-4">JPG, PNG, SVG · Max 5MB</p>
            <button onClick={e => { e.stopPropagation(); fileRefs[k]?.current?.click(); }}
              disabled={uploading[k]}
              className="flex items-center gap-2 bg-[#0A0A0A] hover:bg-gray-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors mx-auto">
              {uploading[k] ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
              {uploading[k] ? 'Uploading…' : 'Upload image'}
            </button>
          </div>
        )}
      </div>
      <input ref={fileRefs[k]} type="file" accept="image/*" className="hidden"
        onChange={e => uploadFile(k, e.target.files?.[0])} />
    </div>
  );

  const VideoUploadBox = ({ k }) => (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
        Hero Video
      </label>
      <p className="text-xs text-gray-400 mb-3">
        Plays as a muted autoplay background behind your hero text. Keep it 10–30 seconds.
      </p>
      <div className={`border-2 border-dashed rounded-2xl p-5 transition-colors
        ${settings[k]?.value ? 'border-gray-200' : 'border-gray-200 hover:border-[#C9A84C]/40'}`}>
        {settings[k]?.value ? (
          <div>
            <video src={settings[k].value} className="w-full max-h-48 rounded-xl mb-4 bg-black" controls muted />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">✓ Video uploaded</span>
              <button onClick={() => fileRefs[k]?.current?.click()} disabled={uploading[k]}
                className="flex items-center gap-1.5 bg-[#0A0A0A] text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                {uploading[k] ? <Loader2 size={11} className="animate-spin" /> : <Upload size={11} />}
                {uploading[k] ? 'Uploading…' : 'Replace video'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Video size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500 mb-1">Upload a short video clip</p>
            <p className="text-xs text-gray-400 mb-5">MP4, MOV, WEBM · Max 50MB · Recommended: 10–30 seconds</p>
            <button onClick={() => fileRefs[k]?.current?.click()} disabled={uploading[k]}
              className="flex items-center gap-2 bg-[#0A0A0A] hover:bg-gray-800 text-white text-xs font-bold px-5 py-3 rounded-xl transition-colors mx-auto">
              {uploading[k] ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
              {uploading[k] ? 'Uploading…' : 'Upload video'}
            </button>
          </div>
        )}
      </div>
      <input ref={fileRefs[k]} type="file" accept="video/*" className="hidden"
        onChange={e => uploadFile(k, e.target.files?.[0])} />
    </div>
  );

  // ── Tab content ──
  const TAB_CONTENT = {
    logo: (
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Store Logo</h3>
          <p className="text-sm text-gray-400 mb-5">Shown in the top navbar across all pages.</p>
          <ImageUploadBox k="logo_url" label="Logo Image" hint="PNG with transparent background recommended. Height ~40px." />
        </div>
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Store Identity</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field k="store_name" placeholder="Supero Dog Farm" />
            <Field k="store_tagline" placeholder="Istorya ng Supero" />
            <Field k="store_email" placeholder="community@superodogfarm.com" />
            <Field k="store_mobile" placeholder="09XX XXX XXXX" />
          </div>
          <div className="mt-4">
            <Field k="store_address" placeholder="Purok 4, Brgy Bucal, Amadeo, Cavite 4119" />
          </div>
        </div>
      </div>
    ),

    landing: (
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Announcement Bar</h3>
          <p className="text-sm text-gray-400 mb-4">Gold banner at the very top. Leave empty to hide.</p>
          <Field k="announcement" placeholder="Free shipping on orders ₱1,500+ · Same-day delivery Metro Manila" />
        </div>
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Hero Section</h3>
          <div className="space-y-4">
            <Field k="hero_greeting" placeholder="Isang Magandang Araw Mga Boss Amo" />
            <Field k="hero_title" placeholder="The Ancient Modern Natural Diet" />
            <Field k="hero_subtitle" placeholder="An ancient modern natural diet that will delight your furbabies." />
            <Field k="hero_cta_primary" placeholder="SHOP NOW" />
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Hero Stats (3 numbers under the CTA)</h3>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <Field k="stat_1_value" placeholder="2.3M" />
            <Field k="stat_2_value" placeholder="100%" />
            <Field k="stat_3_value" placeholder="0" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field k="stat_1_label" placeholder="Facebook Followers" />
            <Field k="stat_2_label" placeholder="All Natural" />
            <Field k="stat_3_label" placeholder="Preservatives" />
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Footer & Social</h3>
          <div className="space-y-4">
            <Field k="open_hours" placeholder="Open Daily 9AM–11PM" />
            <Field k="fb_page_url" placeholder="https://www.facebook.com/superodogfarm" />
            <Field k="footer_text" placeholder="Manufactured by Supero Dog Farm · Amadeo, Cavite 4119" />
          </div>
        </div>
      </div>
    ),

    video: (
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Hero Background Video</h3>
          <p className="text-sm text-gray-400 mb-6">
            When uploaded, this video plays as a dark muted background behind your hero text on the homepage. If no video is uploaded, a gradient background is shown instead.
          </p>
          <VideoUploadBox k="hero_video_url" />
        </div>
        {settings['hero_video_url']?.value && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
            <strong>Note:</strong> Video plays on loop, muted and autoplay. Keep it short (10–30 sec) and visually engaging — dogs, farm footage, food prep. Dark/moody tones work best.
          </div>
        )}
      </div>
    ),

    payment: (
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Payment Methods</h3>
          <p className="text-sm text-gray-400 mb-5">Enable or disable each payment method shown at checkout.</p>
          <div className="bg-gray-50 rounded-2xl px-5 py-2 divide-y divide-gray-100">
            <Toggle k="cod_enabled" />
            <Toggle k="gcash_enabled" />
            <Toggle k="maya_enabled" />
            <Toggle k="bank_enabled" />
          </div>
        </div>

        {/* GCash */}
        <div className="border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-black">G</span>
            </div>
            <h3 className="font-bold text-gray-900">GCash</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-auto ${settings['gcash_enabled']?.value === 'true' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
              {settings['gcash_enabled']?.value === 'true' ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <Field k="gcash_name" placeholder="Account name" />
            <Field k="gcash_number" placeholder="09XX XXX XXXX" />
          </div>
          <ImageUploadBox k="gcash_qr_url" label="GCash QR Code" hint="Customers will scan this QR to pay. PNG preferred." />
        </div>

        {/* Maya */}
        <div className="border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-black">M</span>
            </div>
            <h3 className="font-bold text-gray-900">Maya</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-auto ${settings['maya_enabled']?.value === 'true' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
              {settings['maya_enabled']?.value === 'true' ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <Field k="maya_name" placeholder="Account name" />
            <Field k="maya_number" placeholder="09XX XXX XXXX" />
          </div>
          <ImageUploadBox k="maya_qr_url" label="Maya QR Code" hint="Customers will scan this QR to pay." />
        </div>

        {/* Bank */}
        <div className="border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-black">B</span>
            </div>
            <h3 className="font-bold text-gray-900">Bank Transfer</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-auto ${settings['bank_enabled']?.value === 'true' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
              {settings['bank_enabled']?.value === 'true' ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field k="bank_name" placeholder="BDO / BPI / UnionBank" />
            <Field k="bank_account_name" placeholder="Account name" />
            <Field k="bank_account" placeholder="Account number" />
          </div>
        </div>
      </div>
    ),

    shipping: (
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Free Shipping</h3>
          <p className="text-sm text-gray-400 mb-5">Set a minimum order amount for free shipping. Set to 0 to disable.</p>
          <Field k="free_shipping_min" placeholder="0 = disabled · e.g. 1500 = free shipping over ₱1,500" />
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
          <strong>Courier rates</strong> are configured in the database (shipping_rates table). Currently seeded: Lalamove ₱80, J&T from ₱80, LBC from ₱90. Contact your developer to update these rates.
        </div>
      </div>
    ),
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
      <Loader2 size={20} className="animate-spin" />
    </div>
  );

  const ActiveTab = TABS.find(t => t.id === tab);

  return (
    <div className="flex h-full min-h-[calc(100vh-56px)]">
      {/* Left tab navigation */}
      <aside className="w-52 flex-shrink-0 bg-gray-50 border-r border-gray-100 p-3">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">Sections</p>
        <nav className="space-y-0.5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all
                ${tab === t.id
                  ? 'bg-[#0A0A0A] text-white'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}>
              <t.icon size={15} className={tab === t.id ? 'text-[#C9A84C]' : 'text-gray-400'} />
              {t.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl p-8">
          {/* Section header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#0A0A0A] rounded-xl flex items-center justify-center flex-shrink-0">
                {ActiveTab && <ActiveTab.icon size={16} className="text-[#C9A84C]" />}
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">{ActiveTab?.label}</h2>
                <p className="text-xs text-gray-400">Saved to DB · reflects on website immediately</p>
              </div>
            </div>
            <button onClick={saveAll} disabled={saving}
              className="flex items-center gap-2 bg-[#0A0A0A] hover:bg-gray-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50">
              {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle size={14} /> : <Save size={14} />}
              {saved ? 'Saved!' : saving ? 'Saving…' : 'Save'}
            </button>
          </div>

          {/* Tab content */}
          {TAB_CONTENT[tab]}

          {/* Bottom save */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <button onClick={saveAll} disabled={saving}
              className="w-full bg-[#0A0A0A] hover:bg-gray-800 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
              {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <CheckCircle size={15} /> : <Save size={15} />}
              {saved ? '✓ All settings saved!' : saving ? 'Saving…' : 'Save All Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
