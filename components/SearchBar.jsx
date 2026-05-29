'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SearchBar({ className = '' }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef();
  const inputRef = useRef();

  useEffect(() => {
    if (!q || q.length < 2) { setResults([]); return; }
    setLoading(true);
    const t = setTimeout(() => {
      fetch('/api/search?q=' + encodeURIComponent(q))
        .then(r => r.json())
        .then(d => { setResults(d.data || []); setLoading(false); })
        .catch(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const h = e => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className={'relative ' + className}>
      <button onClick={() => { setOpen(o => !o); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
        <Search size={18} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search Supero products..." autoFocus
              className="flex-1 text-sm text-gray-900 outline-none placeholder:text-gray-400" />
            {loading && <Loader2 size={13} className="animate-spin text-gray-400" />}
            {q && !loading && <button onClick={() => setQ('')}><X size={13} className="text-gray-400" /></button>}
          </div>
          {q.length >= 2 && (
            <div className="max-h-72 overflow-y-auto">
              {results.length === 0 && !loading && (
                <div className="px-4 py-6 text-center text-sm text-gray-400">No products found</div>
              )}
              {results.map(p => {
                const img = p.product_images?.find(i => i.is_primary)?.image_url;
                const price = p.product_variants?.[0]?.retail_price;
                return (
                  <Link key={p.id} href={'/product/' + p.slug} onClick={() => { setOpen(false); setQ(''); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <span className="text-lg">{p.emoji || ''}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{p.category}</p>
                    </div>
                    {price && <span className="text-sm font-bold text-gray-900 flex-shrink-0">P{Number(price).toLocaleString()}</span>}
                  </Link>
                );
              })}
              {results.length > 0 && (
                <Link href={'/shop?q=' + encodeURIComponent(q)} onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-center text-xs text-[#C9A84C] font-semibold hover:bg-gray-50 border-t border-gray-100">
                  View all results
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
