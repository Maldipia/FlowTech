'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, ArrowLeft, Save } from 'lucide-react';

const TAGS = ['Case Study', 'Technical', 'Automation', 'Guide', 'News'];
const EMPTY = { slug: '', title: '', excerpt: '', content: '', tag: 'Case Study', read_time: '5 min read', published: false };

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // list | new | edit
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/blog');
    if (res.ok) { const { data } = await res.json(); setPosts(data || []); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const openNew = () => { setForm(EMPTY); setError(''); setView('new'); };
  const openEdit = (post) => { setForm(post); setError(''); setView('edit'); };

  const save = async () => {
    if (!form.title || !form.slug || !form.content) { setError('Title, slug, and content are required.'); return; }
    setSaving(true); setError('');
    const method = view === 'new' ? 'POST' : 'PUT';
    const body = view === 'new' ? form : { id: form.id, ...form };
    const res = await fetch('/api/admin/blog', {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); setSaving(false); return; }
    await fetchPosts();
    setView('list');
    setSaving(false);
  };

  const togglePublish = async (post) => {
    await fetch('/api/admin/blog', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: post.id, published: !post.published }),
    });
    fetchPosts();
  };

  const deletePost = async (id) => {
    if (!confirm('Delete this post?')) return;
    setDeleting(id);
    await fetch('/api/admin/blog', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await fetchPosts();
    setDeleting(null);
  };

  // ── Form view ──
  if (view === 'new' || view === 'edit') {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setView('list')} className="p-2 text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg">
            <ArrowLeft size={15} />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">{view === 'new' ? 'New post' : 'Edit post'}</h1>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Title *</label>
            <input value={form.title} onChange={e => { set('title', e.target.value); if (view === 'new') set('slug', slugify(e.target.value)); }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
              placeholder="Post title" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Slug *</label>
              <input value={form.slug} onChange={e => set('slug', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-gray-400"
                placeholder="post-url-slug" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Tag</label>
              <select value={form.tag} onChange={e => set('tag', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 bg-white">
                {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Excerpt</label>
            <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-gray-400"
              placeholder="One-line description shown on the blog listing" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Content * <span className="normal-case text-gray-400">(markdown-style: **bold**, ## Heading, - bullet, [link](url))</span></label>
            <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={18}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-y focus:outline-none focus:border-gray-400 font-mono"
              placeholder="Write your post content here..." />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${form.published ? 'bg-gray-900' : 'bg-gray-200'}`}
                onClick={() => set('published', !form.published)}>
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${form.published ? 'translate-x-4' : ''}`} />
              </div>
              <span className="text-sm text-gray-600">{form.published ? 'Published' : 'Draft'}</span>
            </label>
            <div className="flex items-center gap-3">
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button onClick={() => setView('list')} className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:border-gray-400 transition-colors">
                Cancel
              </button>
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-40">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {view === 'new' ? 'Create post' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── List view ──
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/admin/discovery" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">← Leads</Link>
            <span className="text-xs text-gray-300">|</span>
            <span className="text-xs font-medium text-gray-700">Blog</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Blog posts</h1>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-700 transition-colors">
          <Plus size={15} /> New post
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 gap-3">
          <Loader2 size={18} className="animate-spin" /> Loading…
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
          <p className="text-4xl mb-3">✍️</p>
          <p className="text-sm text-gray-500 mb-4">No posts yet. Create your first one.</p>
          <button onClick={openNew} className="text-sm text-blue-600 hover:underline">New post →</button>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map(post => (
            <div key={post.id} className="border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-gray-200 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${post.published ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <h3 className="font-medium text-gray-900 text-sm truncate">{post.title}</h3>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full flex-shrink-0">{post.tag}</span>
                </div>
                <p className="text-xs text-gray-400 ml-3.5">/{post.slug} · {post.published ? 'Published' : 'Draft'}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {post.published && (
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                    className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors">
                    <Eye size={14} />
                  </a>
                )}
                <button onClick={() => togglePublish(post)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors" title={post.published ? 'Unpublish' : 'Publish'}>
                  {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={() => openEdit(post)} className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => deletePost(post.id)} disabled={deleting === post.id}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                  {deleting === post.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-6 text-center">Static posts in <code className="bg-gray-100 px-1 py-0.5 rounded">lib/posts.js</code> are always visible on the public blog. Posts created here are stored in Supabase.</p>
    </div>
  );
}
