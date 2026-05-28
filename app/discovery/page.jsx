'use client';
import { useState } from 'react';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

const steps = [
  { id: 1, label: 'Your business' },
  { id: 2, label: 'The project' },
  { id: 3, label: 'Contact' },
];

const budgets = ['Under ₱20,000', '₱20,000 – ₱50,000', '₱50,000 – ₱100,000', '₱100,000 – ₱200,000', '₱200,000+', 'Not sure yet'];
const timelines = ['ASAP (within 2 weeks)', '1 month', '2–3 months', 'Flexible / no rush'];
const objectives = [
  'Build a new website or web app',
  'Automate a manual process',
  'Connect existing tools / systems',
  'Launch an e-commerce store',
  'Monthly retainer / ongoing support',
  'Something else',
];

export default function DiscoveryPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    business_name: '',
    industry: '',
    current_tools: '',
    main_objective: '',
    budget_range: '',
    timeline: '',
    project_details: '',
    contact_person: '',
    email: '',
    mobile: '',
    how_found: '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const next = () => setStep(s => Math.min(s + 1, 3));
  const back = () => setStep(s => Math.max(s - 1, 1));

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError('Something went wrong. Please try again or email us directly.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={24} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">We've got your brief!</h1>
        <p className="text-gray-500 mb-2">Thanks, {form.contact_person.split(' ')[0]}. We'll review your requirements and send a scoped proposal to <strong>{form.email}</strong> within 1–2 business days.</p>
        <p className="text-sm text-gray-400 mt-6">Questions in the meantime? Message us on Facebook or email <a href="mailto:pia@flowtech.ph" className="text-blue-600 hover:underline">pia@flowtech.ph</a></p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Discovery form</p>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Tell us about your project.</h1>
        <p className="text-gray-500 text-sm">Takes 5 minutes. We'll use this to prepare an accurate proposal — no vague estimates.</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-3 mb-10">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-3">
            <div className={`flex items-center gap-2 ${step === s.id ? 'text-gray-900' : step > s.id ? 'text-blue-600' : 'text-gray-300'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold border
                ${step === s.id ? 'border-gray-900 bg-gray-900 text-white' : step > s.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200'}`}>
                {step > s.id ? '✓' : s.id}
              </div>
              <span className="text-sm font-medium">{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className="w-8 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Business name *</label>
            <input value={form.business_name} onChange={e => set('business_name', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
              placeholder="e.g. Santos Hardware, Mama's Kitchen" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Industry / type of business *</label>
            <input value={form.industry} onChange={e => set('industry', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
              placeholder="e.g. Food delivery, Retail jewelry, Property rental" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">What tools are you using now? (optional)</label>
            <input value={form.current_tools} onChange={e => set('current_tools', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
              placeholder="e.g. Google Sheets, Messenger, Facebook Page, Shopee" />
          </div>
          <button onClick={next} disabled={!form.business_name || !form.industry}
            className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            Next <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">What's the main objective? *</label>
            <div className="grid grid-cols-2 gap-2">
              {objectives.map(o => (
                <button key={o} onClick={() => set('main_objective', o)}
                  className={`text-left text-sm px-4 py-3 rounded-xl border transition-all
                    ${form.main_objective === o ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                  {o}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Budget range *</label>
            <div className="grid grid-cols-2 gap-2">
              {budgets.map(b => (
                <button key={b} onClick={() => set('budget_range', b)}
                  className={`text-left text-sm px-4 py-3 rounded-xl border transition-all
                    ${form.budget_range === b ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">When do you need this?</label>
            <div className="grid grid-cols-2 gap-2">
              {timelines.map(t => (
                <button key={t} onClick={() => set('timeline', t)}
                  className={`text-left text-sm px-4 py-3 rounded-xl border transition-all
                    ${form.timeline === t ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Describe the project in your own words (optional)</label>
            <textarea value={form.project_details} onChange={e => set('project_details', e.target.value)}
              rows={4} placeholder="What problem are you solving? What does success look like?"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 resize-none transition-colors" />
          </div>
          <div className="flex gap-3">
            <button onClick={back} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium hover:border-gray-400 transition-colors">
              Back
            </button>
            <button onClick={next} disabled={!form.main_objective || !form.budget_range}
              className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              Next <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Your name *</label>
            <input value={form.contact_person} onChange={e => set('contact_person', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
              placeholder="Full name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address *</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
              placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile number *</label>
            <input type="tel" value={form.mobile} onChange={e => set('mobile', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
              placeholder="09XX XXX XXXX" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">How did you find us? (optional)</label>
            <input value={form.how_found} onChange={e => set('how_found', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
              placeholder="Facebook, referral, Google, etc." />
          </div>
          {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>}
          <div className="flex gap-3">
            <button onClick={back} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium hover:border-gray-400 transition-colors">
              Back
            </button>
            <button onClick={submit}
              disabled={!form.contact_person || !form.email || !form.mobile || loading}
              className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              {loading ? <Loader2 size={15} className="animate-spin" /> : <>Submit brief <ArrowRight size={14} /></>}
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center">We'll respond within 1–2 business days with a scoped proposal.</p>
        </div>
      )}
    </div>
  );
}
