'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async () => {
    if (!password) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) { router.push('/admin/dashboard'); router.refresh(); }
      else { setError('Incorrect password.'); }
    } catch { setError('Something went wrong.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-10 h-10 bg-[#C9A84C] rounded-xl flex items-center justify-center">
            <span className="text-black font-bold">S</span>
          </div>
          <span className="text-white font-bold text-xl tracking-wider">SUPERO</span>
        </div>
        <div className="bg-white rounded-2xl p-8">
          <h1 className="text-lg font-bold text-gray-900 mb-1">Admin Access</h1>
          <p className="text-sm text-gray-400 mb-6">Enter your password to continue</p>
          <div className="space-y-4">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="Password" autoFocus
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 transition-colors" />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button onClick={login} disabled={!password || loading}
              className="w-full bg-[#0A0A0A] text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-40">
              {loading ? <Loader2 size={15} className="animate-spin" /> : 'Enter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
