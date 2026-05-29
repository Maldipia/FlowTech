'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/account/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Invalid email or password.');
      }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm">Sign in to your SUPERO account</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 transition-colors"
                placeholder="your@email.com" autoFocus />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:border-gray-400 transition-colors"
                  placeholder="••••••••" />
                <button onClick={() => setShowPw(s => !s)} type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <button onClick={submit} disabled={loading}
              className="w-full bg-[#0A0A0A] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50">
              {loading ? <Loader2 size={15} className="animate-spin" /> : 'Sign In'}
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-5">
            No account?{' '}
            <Link href="/account/register" className="text-[#C9A84C] hover:underline font-medium">Create one</Link>
          </p>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          <Link href="/shop" className="hover:text-gray-700 transition-colors">← Continue shopping</Link>
        </p>
      </div>
    </div>
  );
}
