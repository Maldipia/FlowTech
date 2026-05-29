'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, XCircle, Trash2, Star } from 'lucide-react';

const STARS = (n) => Array.from({ length: 5 }, (_, i) => (
  <span key={i} style={{ color: i < n ? '#C9A84C' : '#E5E5E5', fontSize: 14 }}>&#9733;</span>
));

export default function AdminReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/reviews');
    if (r.status === 401) { router.push('/admin/login'); return; }
    const d = await r.json(); setReviews(d.data || []); setLoading(false);
  }, [router]);

  useEffect(() => { load(); }, [load]);

  const approve = async (id, val) => {
    await fetch('/api/admin/reviews', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, is_approved: val }) });
    setReviews(prev => prev.map(r => r.id===id ? { ...r, is_approved: val } : r));
  };

  const del = async (id) => {
    if (!confirm('Delete this review?')) return;
    await fetch('/api/admin/reviews', { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id }) });
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const filtered = filter === 'pending' ? reviews.filter(r => !r.is_approved)
    : filter === 'approved' ? reviews.filter(r => r.is_approved)
    : reviews;

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex gap-2 mb-6">
        {['pending','approved','all'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-bold border capitalize transition-all ${filter===f ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'}`}>
            {f} <span className="ml-1 opacity-60">{f==='pending' ? reviews.filter(r=>!r.is_approved).length : f==='approved' ? reviews.filter(r=>r.is_approved).length : reviews.length}</span>
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-16 text-gray-400"><Loader2 size={18} className="animate-spin" /></div>
      : filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl">
          <Star size={36} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">No {filter} reviews</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className={`border rounded-2xl p-5 bg-white ${r.is_approved ? 'border-green-100' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-bold text-sm text-gray-900">{r.customer_name}</span>
                    <div className="flex">{STARS(r.rating)}</div>
                    {r.is_verified && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">Verified</span>}
                    {r.is_approved && <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">Published</span>}
                  </div>
                  {r.title && <p className="font-semibold text-sm text-gray-800 mb-1">{r.title}</p>}
                  <p className="text-sm text-gray-600 mb-2">{r.body}</p>
                  <p className="text-xs text-gray-400">{r.customer_email} · {new Date(r.created_at).toLocaleDateString('en-PH')}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  {!r.is_approved && (
                    <button onClick={() => approve(r.id, true)} className="p-2 text-green-600 border border-green-200 hover:bg-green-50 rounded-lg transition-colors"><CheckCircle size={15}/></button>
                  )}
                  {r.is_approved && (
                    <button onClick={() => approve(r.id, false)} className="p-2 text-amber-600 border border-amber-200 hover:bg-amber-50 rounded-lg transition-colors"><XCircle size={15}/></button>
                  )}
                  <button onClick={() => del(r.id)} className="p-2 text-red-400 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
