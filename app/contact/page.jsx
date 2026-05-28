'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.email || !form.message) { setError('Please fill in all fields.'); return; }
    setStatus('loading'); setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) { setStatus('success'); setForm({ name: '', email: '', message: '' }); }
      else { setError(data.error || 'Something went wrong.'); setStatus('idle'); }
    } catch { setError('Network error. Please try again.'); setStatus('idle'); }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Get in touch</p>
      <h1 className="text-4xl font-semibold text-gray-900 mb-4">Let us talk about your project.</h1>
      <p className="text-gray-500 mb-12 max-w-lg leading-relaxed">The best way to start is through our discovery form. If you have a quick question, use the contact form below.</p>
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-900 text-white rounded-2xl p-8">
          <h2 className="font-semibold text-lg mb-2">Start a project</h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">Fill out our discovery questionnaire so we can map your requirements and prepare an accurate proposal.</p>
          <Link href="/discovery" className="inline-block bg-white text-gray-900 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors">Discovery form</Link>
        </div>
        <div className="border border-gray-100 rounded-2xl p-8">
          <h2 className="font-semibold text-gray-900 mb-4">Quick message</h2>
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle size={32} className="text-green-500 mb-3" />
              <p className="font-medium text-gray-900 mb-1">Message sent!</p>
              <p className="text-sm text-gray-500">We will reply within 1-2 business days.</p>
              <button onClick={() => setStatus('idle')} className="mt-4 text-xs text-gray-400 hover:text-gray-700">Send another</button>
            </div>
          ) : (
            <div className="space-y-3">
              <input type="text" placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors" />
              <input type="email" placeholder="Email address" value={form.email} onChange={e => set('email', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors" />
              <textarea placeholder="Your message" rows={4} value={form.message} onChange={e => set('message', e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-gray-400 transition-colors" />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button onClick={submit} disabled={status === 'loading'} className="w-full bg-gray-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {status === 'loading' ? <Loader2 size={14} className="animate-spin" /> : 'Send message'}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-gray-100 pt-8 grid md:grid-cols-3 gap-6 text-sm text-gray-500">
        <div><p className="font-medium text-gray-900 mb-1">Location</p><p>Amadeo, Cavite, Philippines</p></div>
        <div><p className="font-medium text-gray-900 mb-1">Response time</p><p>Within 1-2 business days</p></div>
        <div><p className="font-medium text-gray-900 mb-1">Project types</p><p>Web dev, systems, automation</p></div>
      </div>
    </div>
  );
}
