'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Pencil, Trash2, Package, ArrowLeft, Save, X } from 'lucide-react';

const CATS = ['raw-food', 'grooming', 'supplements'];
const DELIVERY_TYPES = [
  { id: 'cold_chain', label: '❄️ Cold Chain (Raw Food — 70km only)' },
  { id: 'standard', label: '📦 Standard (Nationwide J&T/LBC)' },
  { id: 'international', label: '✈️ International' },
];
const peso = n => `₱${Number(n).toLocaleString()}`;
const EMPTY_PRODUCT = { name: '', description: '', category: 'raw-food', delivery_type: 'cold_chain', emoji: '🐾', is_active: true };
const EMPTY_VARIANT = { label: '', retail_price: '', weight_grams: '', stock_qty: '', is_active: true };

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [variants, setVariants] = useState([{ ...EMPTY_VARIANT }]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/products');
    if (res.status === 401) { router.push('/admin/login'); return; }
    const { data } = await res.json();
    setProducts(data || []);
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openNew = () => {
    setForm(EMPTY_PRODUCT);
    setVariants([{ ...EMPTY_VARIANT }]);
    setEditProduct(null);
    setError('');
    setView('form');
  };

  const openEdit = (p) => {
    setForm({ name: p.name, description: p.description || '', category: p.category, delivery_type: p.delivery_type, emoji: p.emoji || '🐾', is_active: p.is_active });
    setVariants(p.product_variants?.length ? p.product_variants.map(v => ({ label: v.label, retail_price: v.retail_price, weight_grams: v.weight_grams || '', stock_qty: v.stock_qty || '', is_active: v.is_active })) : [{ ...EMPTY_VARIANT }]);
    setEditProduct(p);
    setError('');
    setView('form');
  };

  const addVariant = () => setVariants(v => [...v, { ...EMPTY_VARIANT }]);
  const removeVariant = (i) => setVariants(v => v.filter((_, idx) => idx !== i));
  const setVariant = (i, k, val) => setVariants(v => v.map((vr, idx) => idx === i ? { ...vr, [k]: val } : vr));

  const save = async () => {
    if (!form.name || !form.category) { setError('Name and category required.'); return; }
    const validVariants = variants.filter(v => v.label && v.retail_price);
    if (!validVariants.length) { setError('Add at least one variant with label and price.'); return; }

    setSaving(true); setError('');
    const method = editProduct ? 'PUT' : 'POST';
    const body = { ...form, variants: validVariants.map(v => ({ ...v, retail_price: Number(v.retail_price), weight_grams: Number(v.weight_grams) || 0, stock_qty: Number(v.stock_qty) || 0 })) };
    if (editProduct) body.id = editProduct.id;

    const res = await fetch('/api/admin/products', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (data.error) { setError(data.error); setSaving(false); return; }
    await fetchProducts();
    setView('list');
    setSaving(false);
  };

  const deleteProduct = async (id) => {
    if (!confirm('Archive this product?')) return;
    setDeleting(id);
    await fetch('/api/admin/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    await fetchProducts();
    setDeleting(null);
  };

  // ── Form view ──
  if (view === 'form') return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setView('list')} className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:border-gray-400 transition-colors"><ArrowLeft size={16} /></button>
        <h1 className="text-xl font-bold text-gray-900">{editProduct ? 'Edit Product' : 'New Product'}</h1>
      </div>
      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Product Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 transition-colors"
              placeholder="e.g. Raw Chicken Mix" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category *</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 bg-white transition-colors">
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Emoji</label>
            <input value={form.emoji} onChange={e => set('emoji', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 transition-colors"
              placeholder="🐾" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Delivery Type *</label>
            <div className="space-y-2">
              {DELIVERY_TYPES.map(d => (
                <label key={d.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-colors
                  ${form.delivery_type === d.id ? 'border-[#0A0A0A] bg-gray-50' : 'border-gray-100'}`}>
                  <input type="radio" name="delivery_type" value={d.id} checked={form.delivery_type === d.id} onChange={e => set('delivery_type', e.target.value)} className="accent-black" />
                  <span className="text-sm font-medium">{d.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:border-gray-400 transition-colors"
              placeholder="Product description..." />
          </div>
        </div>

        {/* Variants */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Variants & Pricing *</label>
            <button onClick={addVariant} className="text-xs text-[#C9A84C] hover:underline flex items-center gap-1"><Plus size={12} /> Add variant</button>
          </div>
          <div className="space-y-3">
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-4 gap-3 bg-gray-50 rounded-xl p-4 relative">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Size/Label</label>
                  <input value={v.label} onChange={e => setVariant(i, 'label', e.target.value)}
                    placeholder="500g, 1 kg…"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-gray-400 transition-colors bg-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Price (₱)</label>
                  <input type="number" value={v.retail_price} onChange={e => setVariant(i, 'retail_price', e.target.value)}
                    placeholder="0.00"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-gray-400 transition-colors bg-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Weight (g)</label>
                  <input type="number" value={v.weight_grams} onChange={e => setVariant(i, 'weight_grams', e.target.value)}
                    placeholder="500"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-gray-400 transition-colors bg-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Stock</label>
                  <input type="number" value={v.stock_qty} onChange={e => setVariant(i, 'stock_qty', e.target.value)}
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-gray-400 transition-colors bg-white" />
                </div>
                {variants.length > 1 && (
                  <button onClick={() => removeVariant(i)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X size={10} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button onClick={() => setView('list')} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-semibold hover:border-gray-400 transition-colors">Cancel</button>
          <button onClick={save} disabled={saving}
            className="flex-1 bg-[#0A0A0A] text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-40">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {editProduct ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );

  // ── List view ──
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <a href="/admin/dashboard" className="text-xs text-gray-400 hover:text-gray-700">← Dashboard</a>
            <span className="text-xs text-gray-300">|</span>
            <a href="/admin/orders" className="text-xs text-gray-400 hover:text-gray-700">Orders</a>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-[#0A0A0A] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
          <Plus size={15} /> New Product
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 gap-3">
          <Loader2 size={18} className="animate-spin" /> Loading…
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
          <Package size={40} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium mb-2">No products yet</p>
          <p className="text-sm text-gray-400 mb-6">Add your first product to start selling</p>
          <button onClick={openNew} className="text-sm text-[#C9A84C] hover:underline">Add Product →</button>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map(p => (
            <div key={p.id} className="border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-gray-200 transition-colors">
              <div className="text-2xl w-10 text-center flex-shrink-0">{p.emoji || '🐾'}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{p.name}</h3>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex-shrink-0">{p.category}</span>
                  {p.delivery_type === 'cold_chain' && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full flex-shrink-0">❄️</span>}
                  {!p.is_active && <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full flex-shrink-0">Archived</span>}
                </div>
                <p className="text-xs text-gray-400">
                  {p.product_variants?.length || 0} variants ·{' '}
                  {p.product_variants?.length ? `from ${peso(Math.min(...p.product_variants.map(v => v.retail_price)))}` : 'no pricing'}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors"><Pencil size={14} /></button>
                <button onClick={() => deleteProduct(p.id)} disabled={deleting === p.id}
                  className="p-2 text-gray-400 hover:text-red-500 border border-gray-200 rounded-lg transition-colors">
                  {deleting === p.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
