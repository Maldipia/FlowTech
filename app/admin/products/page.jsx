'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Pencil, Trash2, Package, ArrowLeft, Save, X, Upload, ImageIcon, Search } from 'lucide-react';

const CATS = [
  { id: 'raw-food',     label: 'Raw Food',     emoji: '🥩' },
  { id: 'treats',       label: 'Treats',        emoji: '🦴' },
  { id: 'grooming',     label: 'Grooming',      emoji: '🧴' },
  { id: 'supplements',  label: 'Supplements',   emoji: '💊' },
  { id: 'accessories',  label: 'Accessories',   emoji: '🎀' },
  { id: 'hygiene',      label: 'Hygiene',       emoji: '🧼' },
  { id: 'apparel',      label: 'Apparel',       emoji: '👕' },
  { id: 'others',       label: 'Others',        emoji: '📦' },
];

const DELIVERY_TYPES = [
  { id: 'cold_chain',    label: '❄️ Cold Chain',    sub: 'Raw food — Metro Manila & Cavite (70km)' },
  { id: 'standard',      label: '📦 Standard',      sub: 'Nationwide via J&T / LBC' },
  { id: 'international', label: '✈️ International', sub: 'International shipping' },
];

const peso = n => `₱${Number(n).toLocaleString()}`;
const EMPTY_VARIANT = { label: '', retail_price: '', weight_grams: '', stock_qty: '', is_active: true };
const EMPTY_FORM = { name: '', description: '', category: 'raw-food', delivery_type: 'cold_chain', emoji: '🥩', is_active: true };

const CAT_MAP = Object.fromEntries(CATS.map(c => [c.id, c]));

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [variants, setVariants] = useState([{ ...EMPTY_VARIANT }]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const fileRef = useRef();

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

  const openNew = (defaultCat = 'raw-food') => {
    setForm({ ...EMPTY_FORM, category: defaultCat });
    setVariants([{ ...EMPTY_VARIANT }]);
    setImageFile(null); setImagePreview(null); setExistingImages([]);
    setEditProduct(null); setError(''); setView('form');
  };

  const openEdit = (p) => {
    setForm({ name: p.name, description: p.description || '', category: p.category, delivery_type: p.delivery_type, emoji: p.emoji || '🥩', is_active: p.is_active });
    setVariants(p.product_variants?.length ? p.product_variants.map(v => ({ label: v.label, retail_price: v.retail_price, weight_grams: v.weight_grams || '', stock_qty: v.stock_qty || 0, is_active: v.is_active })) : [{ ...EMPTY_VARIANT }]);
    setExistingImages(p.product_images || []);
    setImageFile(null); setImagePreview(null);
    setEditProduct(p); setError(''); setView('form');
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const addVariant = () => setVariants(v => [...v, { ...EMPTY_VARIANT }]);
  const removeVariant = i => setVariants(v => v.filter((_, idx) => idx !== i));
  const setVariant = (i, k, val) => setVariants(v => v.map((vr, idx) => idx === i ? { ...vr, [k]: val } : vr));

  const save = async () => {
    if (!form.name || !form.category) { setError('Name and category required.'); return; }
    const valid = variants.filter(v => v.label && v.retail_price);
    if (!valid.length) { setError('Add at least one variant with label and price.'); return; }
    setSaving(true); setError('');

    let imageUrl = null;
    if (imageFile) {
      setUploading(true);
      const fd = new FormData();
      fd.append('file', imageFile);
      fd.append('key', `product_img_${Date.now()}`);
      const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const d = await r.json();
      if (d.success) imageUrl = d.url;
      setUploading(false);
    }

    const method = editProduct ? 'PUT' : 'POST';
    const body = {
      ...form,
      variants: valid.map(v => ({ ...v, retail_price: Number(v.retail_price), weight_grams: Number(v.weight_grams) || 0, stock_qty: Number(v.stock_qty) || 0 })),
      ...(imageUrl ? { images: [imageUrl] } : {}),
    };
    if (editProduct) body.id = editProduct.id;

    const res = await fetch('/api/admin/products', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (data.error) { setError(data.error); setSaving(false); return; }
    await fetchProducts();
    setView('list');
    setSaving(false);
  };

  const toggleAvailability = async (p) => {
    await fetch('/api/admin/products', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id, is_active: !p.is_active })
    });
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, is_active: !p.is_active } : x));
  };

  const deleteProduct = async (id) => {
    if (!confirm('Archive this product?')) return;
    setDeleting(id);
    await fetch('/api/admin/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    await fetchProducts();
    setDeleting(null);
  };

  // Filter logic
  const filtered = products.filter(p => {
    const matchCat = filterCat === 'all' || p.category === filterCat;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Group by category
  const grouped = CATS.map(cat => ({
    ...cat,
    items: filtered.filter(p => p.category === cat.id),
  })).filter(g => g.items.length > 0);

  const totalLive = products.filter(p => p.is_active).length;
  const totalHidden = products.filter(p => !p.is_active).length;

  // ── FORM VIEW ──
  if (view === 'form') return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => setView('list')} className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="font-bold text-gray-900">{editProduct ? 'Edit Product' : 'New Product'}</h2>
          {editProduct && <p className="text-xs text-gray-400">{editProduct.name}</p>}
        </div>
      </div>

      <div className="space-y-5">
        {/* Availability */}
        <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-5 py-4 border border-gray-100">
          <div>
            <p className="font-semibold text-sm text-gray-900">Availability</p>
            <p className="text-xs text-gray-400">{form.is_active ? '✓ Visible in store' : '✗ Hidden from store'}</p>
          </div>
          <button onClick={() => set('is_active', !form.is_active)}
            className={`relative w-12 h-6 rounded-full transition-colors ${form.is_active ? 'bg-green-500' : 'bg-gray-200'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${form.is_active ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        {/* Image */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Product Image</label>
          <div className="flex items-start gap-4">
            <div onClick={() => fileRef.current?.click()}
              className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#C9A84C]/50 flex items-center justify-center cursor-pointer transition-all bg-gray-50 hover:bg-[#FBF7EE] overflow-hidden flex-shrink-0">
              {imagePreview ? <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                : existingImages?.[0] ? <img src={existingImages[0].image_url} alt="" className="w-full h-full object-cover" />
                : <div className="text-center p-2"><ImageIcon size={20} className="text-gray-300 mx-auto mb-1" /><span className="text-[10px] text-gray-400">Click</span></div>}
            </div>
            <div className="flex-1">
              <button onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 bg-[#0A0A0A] hover:bg-gray-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors mb-2">
                <Upload size={13} />
                {imagePreview || existingImages?.[0] ? 'Replace Image' : 'Upload Image'}
              </button>
              <p className="text-xs text-gray-400 leading-relaxed">JPG, PNG, WEBP · Max 5MB<br />Recommended: 800×800 square</p>
              {imageFile && <p className="text-[11px] text-green-600 mt-1.5 font-medium">✓ {imageFile.name}</p>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
          </div>
        </div>

        {/* Name + category + emoji */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Product Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 transition-colors" placeholder="e.g. Supero Mix" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Category *</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 bg-white transition-colors">
              {CATS.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Emoji</label>
            <input value={form.emoji} onChange={e => set('emoji', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-gray-400 transition-colors" placeholder="🥩" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery Type *</label>
            <div className="space-y-2">
              {DELIVERY_TYPES.map(d => (
                <label key={d.id} className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all
                  ${form.delivery_type === d.id ? 'border-[#0A0A0A] bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                  <input type="radio" name="delivery_type" value={d.id} checked={form.delivery_type === d.id} onChange={e => set('delivery_type', e.target.value)} className="accent-black" />
                  <div><div className="text-sm font-semibold text-gray-900">{d.label}</div><div className="text-xs text-gray-400">{d.sub}</div></div>
                </label>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:border-gray-400 transition-colors"
              placeholder="Ingredients, benefits, feeding notes..." />
          </div>
        </div>

        {/* Variants */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Variants & Pricing *</label>
            <button onClick={addVariant} className="text-xs text-[#C9A84C] font-semibold hover:underline flex items-center gap-1">
              <Plus size={12} /> Add variant
            </button>
          </div>
          <div className="space-y-3">
            {variants.map((v, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {[['label','Size / Label','1 kg, 500g…','text'],['retail_price','Price (₱)','0','number'],['weight_grams','Weight (g)','1000','number'],['stock_qty','Stock','100','number']].map(([key,lbl,ph,type])=>(
                    <div key={key}>
                      <label className="block text-[10px] font-semibold text-gray-400 mb-1">{lbl}</label>
                      <input type={type} value={v[key]} onChange={e => setVariant(i, key, e.target.value)} placeholder={ph}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:border-gray-400 transition-colors" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => setVariant(i, 'is_active', !v.is_active)}>
                    <div className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${v.is_active ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${v.is_active ? 'translate-x-4' : ''}`} />
                    </div>
                    <span className="text-xs text-gray-500">{v.is_active ? 'Available' : 'Unavailable'}</span>
                  </div>
                  {variants.length > 1 && (
                    <button onClick={() => removeVariant(i)} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors">
                      <X size={11} /> Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

        <div className="flex gap-3">
          <button onClick={() => setView('list')} className="flex-1 border border-gray-200 text-gray-600 py-3.5 rounded-xl text-sm font-semibold hover:border-gray-400 transition-colors">Cancel</button>
          <button onClick={save} disabled={saving || uploading}
            className="flex-1 bg-[#0A0A0A] text-white py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-40 transition-colors">
            {(saving||uploading) ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {uploading ? 'Uploading…' : saving ? 'Saving…' : editProduct ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );

  // ── LIST VIEW ──
  return (
    <div className="p-6 max-w-5xl">
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-52">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-gray-400 transition-colors" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
              <X size={14} />
            </button>
          )}
        </div>
        {/* New product */}
        <button onClick={() => openNew(filterCat === 'all' ? 'raw-food' : filterCat)}
          className="flex items-center gap-2 bg-[#0A0A0A] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors flex-shrink-0">
          <Plus size={15} /> New Product
        </button>
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button onClick={() => setFilterCat('all')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border transition-all
            ${filterCat === 'all' ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'}`}>
          All
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filterCat === 'all' ? 'bg-white/20' : 'bg-gray-100'}`}>
            {products.length}
          </span>
        </button>
        {CATS.map(cat => {
          const count = products.filter(p => p.category === cat.id).length;
          if (count === 0 && filterCat !== cat.id) return null;
          return (
            <button key={cat.id} onClick={() => setFilterCat(filterCat === cat.id ? 'all' : cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border transition-all
                ${filterCat === cat.id ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'}`}>
              {cat.emoji} {cat.label}
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filterCat === cat.id ? 'bg-white/20' : 'bg-gray-100'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 mb-5 text-sm">
        <span className="text-green-600 font-semibold">{totalLive} live</span>
        <span className="text-gray-300">·</span>
        <span className="text-gray-400">{totalHidden} hidden</span>
        {search && <span className="text-gray-400">· {filtered.length} matching "{search}"</span>}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400 gap-3">
          <Loader2 size={18} className="animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-2xl">
          <Package size={40} className="text-gray-200 mx-auto mb-4" />
          {search ? (
            <>
              <p className="text-gray-500 font-medium mb-2">No products match "{search}"</p>
              <button onClick={() => setSearch('')} className="text-sm text-[#C9A84C] hover:underline">Clear search</button>
            </>
          ) : (
            <>
              <p className="text-gray-500 font-medium mb-2">No products yet</p>
              <button onClick={() => openNew()} className="text-sm text-[#C9A84C] hover:underline">Add first product →</button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(group => (
            <div key={group.id}>
              {/* Category header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{group.emoji}</span>
                  <h3 className="font-bold text-gray-900 text-sm">{group.label}</h3>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">{group.items.length}</span>
                </div>
                <button onClick={() => openNew(group.id)}
                  className="text-xs text-[#C9A84C] hover:underline flex items-center gap-1 font-semibold">
                  <Plus size={11} /> Add {group.label}
                </button>
              </div>

              {/* Products in this category */}
              <div className="space-y-1.5 pl-0">
                {group.items.map(p => {
                  const primaryImg = p.product_images?.find(i => i.is_primary)?.image_url || p.product_images?.[0]?.image_url;
                  const activeVariants = p.product_variants?.filter(v => v.is_active) || [];
                  const prices = activeVariants.map(v => v.retail_price);
                  const priceRange = prices.length ? (prices.length === 1 ? peso(prices[0]) : `${peso(Math.min(...prices))}–${peso(Math.max(...prices))}`) : 'No price';
                  return (
                    <div key={p.id} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all
                      ${p.is_active ? 'border-gray-100 bg-white hover:border-gray-200' : 'border-gray-100 bg-gray-50 opacity-55'}`}>
                      {/* Image */}
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-100">
                        {primaryImg ? <img src={primaryImg} alt="" className="w-full h-full object-cover" />
                          : <span className="text-xl">{p.emoji || '🐾'}</span>}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="font-bold text-sm text-gray-900 truncate">{p.name}</span>
                          {p.delivery_type === 'cold_chain' && <span className="text-[10px] bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full">❄️ Cold</span>}
                        </div>
                        <p className="text-xs text-gray-400">{activeVariants.length} variant{activeVariants.length !== 1 ? 's' : ''} · {priceRange}</p>
                      </div>
                      {/* Toggle */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-semibold ${p.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                          {p.is_active ? 'Live' : 'Off'}
                        </span>
                        <button onClick={() => toggleAvailability(p)}
                          className={`relative w-11 h-6 rounded-full transition-colors ${p.is_active ? 'bg-green-500' : 'bg-gray-200'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${p.is_active ? 'left-6' : 'left-1'}`} />
                        </button>
                      </div>
                      {/* Edit/Delete */}
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => deleteProduct(p.id)} disabled={deleting === p.id}
                          className="p-2 text-gray-400 hover:text-red-500 border border-gray-200 rounded-lg hover:border-red-200 transition-colors">
                          {deleting === p.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

