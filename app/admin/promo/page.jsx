'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Pencil, Trash2, Tag } from 'lucide-react';

export default function AdminPromoPage() {
  const router = useRouter();
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ code:'', description:'', type:'percentage', value:'', min_order:'0', max_uses:'', valid_until:'', is_active:true });

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/promo');
    if (r.status === 401) { router.push('/admin/login'); return; }
    const d = await r.json(); setCodes(d.data || []); setLoading(false);
  }, [router]);

  useEffect(() => { load(); }, [load]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.code || !form.value) return;
    setSaving(true);
    const body = { ...form, code: form.code.toUpperCase(), value: Number(form.value), min_order: Number(form.min_order||0), max_uses: form.max_uses ? Number(form.max_uses) : null, valid_until: form.valid_until || null };
    if (editId) body.id = editId;
    await fetch('/api/admin/promo', { method: editId ? 'PATCH' : 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(body) });
    await load(); setSaving(false); setShowForm(false); setEditId(null);
    setForm({ code:'', description:'', type:'percentage', value:'', min_order:'0', max_uses:'', valid_until:'', is_active:true });
  };

  const toggle = async (c) => {
    await fetch('/api/admin/promo', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id:c.id, is_active:!c.is_active }) });
    setCodes(prev => prev.map(x => x.id===c.id ? { ...x, is_active:!c.is_active } : x));
  };

  const del = async (id) => {
    if (!confirm('Deactivate?')) return;
    await fetch('/api/admin/promo', { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id }) });
    await load();
  };

  const startEdit = (c) => {
    setEditId(c.id); setShowForm(true);
    setForm({ code:c.code, description:c.description||'', type:c.type, value:c.value, min_order:c.min_order||0, max_uses:c.max_uses||'', valid_until:c.valid_until?.split('T')[0]||'', is_active:c.is_active });
  };

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-400">{codes.filter(c=>c.is_active).length} active · {codes.filter(c=>!c.is_active).length} inactive</p>
        <button onClick={() => setShowForm(s => !s)} className="flex items-center gap-2 bg-[#0A0A0A] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
          <Plus size={15} /> New Code
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-sm text-gray-900 mb-4">{editId ? 'Edit Code' : 'New Promo Code'}</h3>
          <div className="grid sm:grid-cols-3 gap-3 mb-3">
            {[['code','CODE','BOSSAMO20','text'],['value','VALUE','20','number'],['min_order','MIN ORDER (P)','0','number'],['max_uses','MAX USES','','number'],['valid_until','VALID UNTIL','','date']].map(([k,lbl,ph,type]) => (
              <div key={k}>
                <label className="block text-xs font-bold text-gray-400 mb-1">{lbl}</label>
                <input type={type} value={form[k]} onChange={e => set(k, type==='text' ? e.target.value.toUpperCase() : e.target.value)} placeholder={ph}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-gray-400" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">TYPE</label>
              <select value={form.type} onChange={e => set('type', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:border-gray-400">
                <option value="percentage">% Percentage</option>
                <option value="fixed">Fixed amount</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-gray-400 mb-1">DESCRIPTION</label>
              <input value={form.description} onChange={e => set('description', e.target.value)} placeholder="e.g. Welcome discount for Boss Amos"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-gray-400" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:border-gray-400">Cancel</button>
            <button onClick={save} disabled={saving || !form.code || !form.value}
              className="flex items-center gap-2 px-5 py-2 bg-[#0A0A0A] text-white text-sm font-bold rounded-xl hover:bg-gray-800 disabled:opacity-40">
              {saving && <Loader2 size={13} className="animate-spin" />} {editId ? 'Save' : 'Create'}
            </button>
          </div>
        </div>
      )}

      {loading ? <div className="flex justify-center py-16 text-gray-400"><Loader2 size={18} className="animate-spin" /></div>
      : codes.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl">
          <Tag size={36} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No promo codes yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {codes.map(c => (
            <div key={c.id} className={`flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all ${c.is_active ? 'border-gray-100 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Tag size={16} className="text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-black text-sm font-mono">{c.code}</span>
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                    {c.type === 'percentage' ? c.value + '% OFF' : 'P' + c.value + ' OFF'}
                  </span>
                  {c.min_order > 0 && <span className="text-xs text-gray-400">min P{c.min_order}</span>}
                </div>
                <p className="text-xs text-gray-400">
                  {c.description || 'No description'} · {c.uses_count||0}{c.max_uses ? '/'+c.max_uses : ''} uses
                  {c.valid_until ? ' · expires ' + new Date(c.valid_until).toLocaleDateString('en-PH') : ''}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs font-semibold ${c.is_active ? 'text-green-600' : 'text-gray-400'}`}>{c.is_active ? 'Active' : 'Off'}</span>
                <button onClick={() => toggle(c)} className={`relative w-11 h-6 rounded-full transition-colors ${c.is_active ? 'bg-green-500' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${c.is_active ? 'left-6' : 'left-1'}`} />
                </button>
                <button onClick={() => startEdit(c)} className="p-2 text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg"><Pencil size={13}/></button>
                <button onClick={() => del(c.id)} className="p-2 text-gray-400 hover:text-red-500 border border-gray-200 rounded-lg"><Trash2 size={13}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
