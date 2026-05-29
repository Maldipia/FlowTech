'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, RefreshCw, Search, Plus, ChevronDown, Tag } from 'lucide-react';

const peso = n => `₱${Number(n).toLocaleString()}`;

export default function AdminAccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newForm, setNewForm] = useState({ account_number: '', name: '', email: '', mobile: '', type: 'loyal_customer' });
  const [saving, setSaving] = useState(false);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/accounts');
    if (res.status === 401) { router.push('/admin/login'); return; }
    const { data } = await res.json();
    setAccounts(data || []);
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  const filtered = accounts.filter(a => {
    if (!search) return true;
    const q = search.toLowerCase();
    return a.name?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q) || a.account_number?.toLowerCase().includes(q);
  });

  const saveAccount = async () => {
    if (!newForm.account_number || !newForm.name) return;
    setSaving(true);
    await fetch('/api/admin/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newForm),
    });
    await fetchAccounts();
    setShowNew(false);
    setNewForm({ account_number: '', name: '', email: '', mobile: '', type: 'loyal_customer' });
    setSaving(false);
  };

  const TYPE_COLORS = {
    distributor:    { bg: 'bg-purple-50', text: 'text-purple-700' },
    loyal_customer: { bg: 'bg-blue-50',   text: 'text-blue-700' },
  };

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm text-gray-400 mb-0.5">Distributors & loyal customers with account numbers and discount tiers</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAccounts} className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:text-gray-700 transition-colors">
            <RefreshCw size={15} />
          </button>
          <button onClick={() => setShowNew(v => !v)}
            className="flex items-center gap-2 bg-[#0A0A0A] text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
            <Plus size={15} /> New Account
          </button>
        </div>
      </div>

      {/* New account form */}
      {showNew && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-gray-900 text-sm mb-4">Create Account</h3>
          <div className="grid sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Account Number *</label>
              <input value={newForm.account_number} onChange={e => setNewForm(f => ({...f, account_number: e.target.value}))}
                placeholder="ACC-0001" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-gray-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Name *</label>
              <input value={newForm.name} onChange={e => setNewForm(f => ({...f, name: e.target.value}))}
                placeholder="Full name / Business name" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-gray-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
              <select value={newForm.type} onChange={e => setNewForm(f => ({...f, type: e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-gray-400 bg-white transition-colors">
                <option value="loyal_customer">Loyal Customer</option>
                <option value="distributor">Distributor</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
              <input type="email" value={newForm.email} onChange={e => setNewForm(f => ({...f, email: e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-gray-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Mobile</label>
              <input value={newForm.mobile} onChange={e => setNewForm(f => ({...f, mobile: e.target.value}))}
                placeholder="09XX XXX XXXX" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-gray-400 transition-colors" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowNew(false)} className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:border-gray-400 transition-colors">Cancel</button>
            <button onClick={saveAccount} disabled={saving || !newForm.account_number || !newForm.name}
              className="flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40">
              {saving ? <Loader2 size={13} className="animate-spin" /> : null} Create
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, or account number…"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-gray-400 transition-colors" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400 gap-3">
          <Loader2 size={18} className="animate-spin" /> Loading…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400">
          <Tag size={32} className="mx-auto mb-3 text-gray-200" />
          <p className="font-medium mb-1">No accounts yet</p>
          <p className="text-sm">Create accounts to assign discount tiers to distributors and loyal customers</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(acc => {
            const tc = TYPE_COLORS[acc.type] || TYPE_COLORS.loyal_customer;
            const isOpen = expanded === acc.id;
            return (
              <div key={acc.id} className="border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors">
                <div className="flex items-center gap-4 px-5 py-4 cursor-pointer" onClick={() => setExpanded(isOpen ? null : acc.id)}>
                  <div className="w-9 h-9 bg-[#FBF7EE] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-[#C9A84C] font-bold text-xs">{acc.account_number?.slice(-4)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-sm text-gray-900">{acc.account_number}</span>
                      <span className="font-medium text-sm text-gray-700">{acc.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tc.bg} ${tc.text}`}>
                        {acc.type === 'distributor' ? 'Distributor' : 'Loyal Customer'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{acc.email || '—'} · {acc.mobile || '—'}</p>
                  </div>
                  <ChevronDown size={15} className={`text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
                {isOpen && (
                  <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Discount Tiers</p>
                      <p className="text-xs text-gray-400">Applied at checkout when account number is entered</p>
                    </div>
                    <DiscountTiers accountId={acc.id} accountNumber={acc.account_number} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DiscountTiers({ accountId, accountNumber }) {
  const [tiers, setTiers] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newTier, setNewTier] = useState({ min_qty: '', max_qty: '', discount_pct: '' });

  useEffect(() => {
    fetch(`/api/admin/accounts?tiers=1&id=${accountId}`)
      .then(r => r.json()).then(d => setTiers(d.tiers || []));
  }, [accountId]);

  const addTier = async () => {
    if (!newTier.min_qty || !newTier.discount_pct) return;
    setAdding(true);
    await fetch('/api/admin/accounts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_tier', account_id: accountId, ...newTier }),
    });
    const res = await fetch(`/api/admin/accounts?tiers=1&id=${accountId}`);
    const d = await res.json();
    setTiers(d.tiers || []);
    setNewTier({ min_qty: '', max_qty: '', discount_pct: '' });
    setAdding(false);
  };

  if (!tiers) return <div className="text-xs text-gray-400">Loading tiers…</div>;

  return (
    <div>
      {tiers.length === 0 ? (
        <p className="text-xs text-gray-400 mb-3">No tiers set. Add a tier to apply discounts at checkout.</p>
      ) : (
        <div className="space-y-2 mb-3">
          {tiers.map(t => (
            <div key={t.id} className="flex items-center gap-4 bg-white rounded-xl px-4 py-2.5 text-sm">
              <span className="text-gray-500 w-32">
                {t.min_qty}+ {t.max_qty ? `(up to ${t.max_qty})` : ''} pcs
              </span>
              <span className="font-bold text-green-600">{t.discount_pct}% discount</span>
              <span className="text-xs text-gray-400">applied at checkout</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input type="number" value={newTier.min_qty} onChange={e => setNewTier(f => ({...f, min_qty: e.target.value}))}
          placeholder="Min qty" className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-gray-400 transition-colors" />
        <input type="number" value={newTier.max_qty} onChange={e => setNewTier(f => ({...f, max_qty: e.target.value}))}
          placeholder="Max (opt)" className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-gray-400 transition-colors" />
        <input type="number" value={newTier.discount_pct} onChange={e => setNewTier(f => ({...f, discount_pct: e.target.value}))}
          placeholder="DC %" className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-gray-400 transition-colors" />
        <button onClick={addTier} disabled={adding || !newTier.min_qty || !newTier.discount_pct}
          className="px-3 py-2 bg-[#0A0A0A] text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40 flex items-center gap-1">
          {adding ? <Loader2 size={11} className="animate-spin" /> : <Plus size={11} />} Add Tier
        </button>
      </div>
    </div>
  );
}
