'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Upload, Image, CheckCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState({});
  const fileRefs = { logo_url: useRef(), gcash_qr_url: useRef(), maya_qr_url: useRef() };

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
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const uploadFile = async (key, file) => {
    if (!file) return;
    setUploading(u => ({ ...u, [key]: true }));
    const fd = new FormData();
    fd.append('file', file);
    fd.append('key', key);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.success) {
      setSettings(s => ({ ...s, [key]: { ...s[key], value: data.url } }));
    }
    setUploading(u => ({ ...u, [key]: false }));
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-gray-400 gap-3">
      <Loader2 size={18} className="animate-spin" /> Loading settings…
    </div>
  );

  const ImageUpload = ({ settingKey, label }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition-colors">
        {settings[settingKey]?.value ? (
          <div className="flex items-start gap-4">
            <img src={settings[settingKey].value} alt={label}
              className="w-24 h-24 object-contain rounded-xl border border-gray-100 bg-gray-50" />
            <div className="flex-1">
              <p className="text-xs text-green-600 font-medium mb-2">✓ Uploaded</p>
              <p className="text-xs text-gray-400 break-all mb-3">{settings[settingKey].value}</p>
              <button onClick={() => fileRefs[settingKey]?.current?.click()}
                className="text-xs text-blue-600 hover:underline">Replace image</button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Image size={28} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-3">{label}</p>
            <button onClick={() => fileRefs[settingKey]?.current?.click()}
              className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 mx-auto">
              {uploading[settingKey] ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
              {uploading[settingKey] ? 'Uploading…' : 'Upload image'}
            </button>
          </div>
        )}
        <input ref={fileRefs[settingKey]} type="file" accept="image/*" className="hidden"
          onChange={e => uploadFile(settingKey, e.target.files?.[0])} />
      </div>
      {settings[settingKey]?.value && (
        <button onClick={() => fileRefs[settingKey]?.current?.click()}
          disabled={uploading[settingKey]}
          className="mt-2 w-full border border-gray-200 text-gray-500 text-xs py-2 rounded-xl hover:border-gray-400 transition-colors flex items-center justify-center gap-2">
          {uploading[settingKey] ? <><Loader2 size={12} className="animate-spin" />Uploading…</> : <><Upload size={12} />Replace</>}
        </button>
      )}
    </div>
  );

  const TextInput = ({ settingKey, placeholder = '' }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {settings[settingKey]?.label}
      </label>
      <input
        value={settings[settingKey]?.value || ''}
        onChange={e => set(settingKey, e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gray-400 transition-colors"
      />
    </div>
  );

  const Toggle = ({ settingKey }) => {
    const on = settings[settingKey]?.value === 'true';
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm text-gray-700">{settings[settingKey]?.label}</span>
        <button onClick={() => set(settingKey, on ? 'false' : 'true')}
          className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${on ? 'bg-[#0A0A0A]' : 'bg-gray-200'}`}>
          <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : ''}`} />
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <a href="/admin/dashboard" className="text-xs text-gray-400 hover:text-gray-700">← Dashboard</a>
            <span className="text-xs text-gray-300">|</span>
            <a href="/admin/products" className="text-xs text-gray-400 hover:text-gray-700">Products</a>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
        </div>
        <button onClick={saveAll} disabled={saving}
          className="flex items-center gap-2 bg-[#0A0A0A] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle size={14} /> : <Save size={14} />}
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save All'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Branding */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C9A84C]" /> Store Identity
          </h2>
          <div className="space-y-4">
            <ImageUpload settingKey="logo_url" label="Store Logo (PNG/SVG recommended)" />
            <div className="grid sm:grid-cols-2 gap-4">
              <TextInput settingKey="store_name" placeholder="SUPERO" />
              <TextInput settingKey="store_tagline" placeholder="Premium Pet Food & Marketplace" />
              <TextInput settingKey="store_email" placeholder="hello@supero.ph" />
              <TextInput settingKey="store_mobile" placeholder="09XX XXX XXXX" />
            </div>
            <TextInput settingKey="store_address" placeholder="Amadeo, Cavite, PH" />
            <TextInput settingKey="announcement" placeholder="e.g. Free shipping on orders ₱1,500+" />
          </div>
        </div>

        {/* Payment methods */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C9A84C]" /> Payment Methods
          </h2>
          <div className="space-y-1 mb-6 border border-gray-100 rounded-xl p-4">
            <Toggle settingKey="cod_enabled" />
            <Toggle settingKey="gcash_enabled" />
            <Toggle settingKey="maya_enabled" />
            <Toggle settingKey="bank_enabled" />
          </div>

          {/* GCash */}
          <div className="border border-gray-100 rounded-xl p-5 mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">GCash</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <TextInput settingKey="gcash_name" placeholder="Account name" />
              <TextInput settingKey="gcash_number" placeholder="09XX XXX XXXX" />
            </div>
            <ImageUpload settingKey="gcash_qr_url" label="GCash QR Code" />
          </div>

          {/* Maya */}
          <div className="border border-gray-100 rounded-xl p-5 mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Maya</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <TextInput settingKey="maya_name" placeholder="Account name" />
              <TextInput settingKey="maya_number" placeholder="09XX XXX XXXX" />
            </div>
            <ImageUpload settingKey="maya_qr_url" label="Maya QR Code" />
          </div>

          {/* Bank */}
          <div className="border border-gray-100 rounded-xl p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Bank Transfer</p>
            <div className="grid sm:grid-cols-3 gap-4">
              <TextInput settingKey="bank_name" placeholder="BDO / BPI / UnionBank" />
              <TextInput settingKey="bank_account_name" placeholder="Account name" />
              <TextInput settingKey="bank_account" placeholder="Account number" />
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C9A84C]" /> Shipping
          </h2>
          <TextInput settingKey="free_shipping_min" placeholder="0 = disabled, 1500 = free shipping over ₱1,500" />
        </div>
      </div>

      {/* Save sticky */}
      <div className="sticky bottom-6 mt-6">
        <button onClick={saveAll} disabled={saving}
          className="w-full bg-[#0A0A0A] text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50 shadow-lg">
          {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <CheckCircle size={15} /> : <Save size={15} />}
          {saved ? '✓ All changes saved!' : saving ? 'Saving…' : 'Save All Settings'}
        </button>
      </div>
    </div>
  );
}
