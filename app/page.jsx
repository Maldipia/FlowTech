import Link from 'next/link';
import { Zap, ArrowRight, Code2, Bot, Puzzle, Headphones, CheckCircle } from 'lucide-react';

export const metadata = { title: 'Flowtech.ph — Build. Automate. Scale.' };

const services = [
  { icon: Code2, title: 'Custom Development', desc: 'Next.js storefronts, internal tools, and multi-tenant platforms built to your exact workflow — not a template.' },
  { icon: Bot, title: 'Business Automation', desc: 'n8n pipelines, Google Apps Script, and API integrations that eliminate repetitive work and recover lost revenue.' },
  { icon: Puzzle, title: 'Systems Integration', desc: 'Connect your CRM, inventory, POS, Facebook, and logistics into one unified operations layer.' },
  { icon: Headphones, title: 'Retainer Support', desc: 'Ongoing dev and automation support billed monthly. Your system keeps growing as your business does.' },
];

const stats = [
  { value: '6+', label: 'Brands built & operated' },
  { value: '40+', label: 'Automation workflows live' },
  { value: '₱0', label: 'Template sites shipped' },
  { value: '100%', label: 'Philippine-based operators' },
];

const work = [
  { name: 'Supero Digital Ecosystem', tag: 'E-commerce + Lead Recovery', desc: 'Phase 1 MVP: storefront, AI chatbot, social auth, and owner dashboard replacing a 20-inquiry/day Messenger leak.' },
  { name: 'TGB Jewelry', tag: 'Content Automation', desc: 'GAS auto-poster with layaway-specific captions, 40-seed Facebook group distribution engine, and Sheets-based KPI tracker.' },
  { name: 'MHC Wholesale', tag: 'Order Management', desc: 'Taglish multi-brand n8n pipeline with brand-isolated tokens, error handling, and auto-logging to Google Sheets.' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-24">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Now taking projects for Q3 2026
        </div>
        <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 leading-tight tracking-tight mb-6">
          Web dev & automation<br />
          <span className="text-blue-600">for Philippine businesses.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed">
          We build custom platforms, storefronts, and automation systems — not cookie-cutter templates. Built by operators who run actual businesses.
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <Link href="/discovery" className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2">
            Start a project <ArrowRight size={15} />
          </Link>
          <Link href="/work" className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1.5">
            See our work <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.value}>
              <div className="text-3xl font-semibold text-gray-900 mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">What we do</p>
        <h2 className="text-3xl font-semibold text-gray-900 mb-12">Services</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {services.map(s => (
            <div key={s.title} className="border border-gray-100 rounded-2xl p-6 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <s.icon size={16} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/services" className="text-sm text-blue-600 hover:underline">View all services & pricing →</Link>
        </div>
      </section>

      {/* Featured Work */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Recent work</p>
          <h2 className="text-3xl font-semibold text-gray-900 mb-12">Selected projects</h2>
          <div className="space-y-4">
            {work.map((w, i) => (
              <div key={w.name} className="bg-white rounded-2xl p-6 border border-gray-100 flex items-start justify-between gap-6">
                <div className="flex items-start gap-4">
                  <span className="text-sm text-gray-300 font-medium mt-0.5 w-5">0{i + 1}</span>
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="font-semibold text-gray-900">{w.name}</h3>
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{w.tag}</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{w.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/work" className="text-sm text-blue-600 hover:underline">View all projects →</Link>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-gray-900 rounded-3xl p-10 md:p-14">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">Why flowtech.ph</p>
          <h2 className="text-3xl font-semibold text-white mb-6 max-w-lg">Built by operators, for operators.</h2>
          <p className="text-gray-400 mb-10 max-w-xl leading-relaxed">
            We don't just build websites — we run 6 businesses ourselves using the exact same stack we build for clients. Every system we ship has been stress-tested in the real world.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {[
              'No offshore handoffs — you talk directly to the builder',
              'GAS + n8n + Next.js + Supabase — zero vendor lock-in',
              'Taglish-ready systems built for PH business workflows',
              'Post-launch support included in every engagement',
            ].map(item => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle size={15} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-300">{item}</span>
              </div>
            ))}
          </div>
          <Link href="/discovery" className="inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors">
            Start your project <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
