'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.email || !form.password) { setError('Name, email and password are required.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/account/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, mobile: form.mobile, password: form.password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/account/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create account</h1>
          <p className="text-gray-500 text-sm">Join SUPERO for faster checkout & order tracking</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 transition-colors"
                placeholder="Juan dela Cruz" autoFocus />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 transition-colors"
                placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Mobile</label>
              <input type="tel" value={form.mobile} onChange={e => set('mobile', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 transition-colors"
                placeholder="09XX XXX XXXX" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password *</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:border-gray-400 transition-colors"
                  placeholder="Min. 6 characters" />
                <button onClick={() => setShowPw(s => !s)} type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Confirm Password *</label>
              <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 transition-colors"
                placeholder="••••••••" />
            </div>
            {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <button onClick={submit} disabled={loading}
              className="w-full bg-[#0A0A0A] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50">
              {loading ? <Loader2 size={15} className="animate-spin" /> : 'Create Account'}
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-5">
            Already have an account?{' '}
            <Link href="/account/login" className="text-[#C9A84C] hover:underline font-medium">Sign in</Link>
          </p>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          <Link href="/shop" className="hover:text-gray-700 transition-colors">← Continue shopping</Link>
        </p>
      </div>
    </div>
  );
}
