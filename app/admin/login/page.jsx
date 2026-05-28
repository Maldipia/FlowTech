'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';

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
      if (data.success) {
        router.push('/admin/discovery');
        router.refresh();
      } else {
        setError('Wrong password.');
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-900 rounded-2xl mx-auto mb-6">
          <Lock size={18} className="text-white" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 text-center mb-1">Admin access</h1>
        <p className="text-sm text-gray-400 text-center mb-8">flowtech.ph / discovery leads</p>

        <div className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Password"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
            autoFocus
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            onClick={login}
            disabled={!password || loading}
            className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors disabled:opacity-40">
            {loading ? <Loader2 size={15} className="animate-spin" /> : 'Enter'}
          </button>
        </div>
      </div>
    </div>
  );
}
