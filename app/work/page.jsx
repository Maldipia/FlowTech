import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = { title: 'Work — Flowtech.ph' };

const projects = [
  {
    number: '01',
    name: 'Supero Digital Ecosystem',
    client: 'Supero PH',
    tags: ['Next.js 14', 'Supabase', 'Claude AI', 'React'],
    type: 'E-commerce + Lead Recovery',
    year: '2026',
    desc: 'Full Phase 1 MVP for a premium Metro Manila pet food brand. Replaced a 20-inquiry/day Messenger leak with a structured platform: product catalog with variant pricing, Google/Facebook social auth for lead capture, cart & checkout, AI chatbot (Claude API in Taglish), and an owner dashboard tracking recovered leads vs. lost pipeline.',
    results: ['78% lead recovery rate (was 0%)', '₱148,000 recovered in 90 days', '11 orders/day through platform', 'AI handles 20+ inquiries daily'],
    phase: 'Phase 1 of 4 — Phases 2–4 scoped',
  },
  {
    number: '02',
    name: 'TGB Jewelry Automation Engine',
    client: 'The Gold Bar Jewelry',
    tags: ['GAS', 'Facebook Graph API', 'Google Sheets', 'n8n'],
    type: 'Content & Distribution Automation',
    year: '2025',
    desc: 'Complete content automation system for a layaway jewelry brand active since 2016. Auto-poster via Google Apps Script reads from a Google Sheet, generates aspirational Taglish captions with layaway hooks, and publishes to Facebook on a Mon/Wed/Fri/Sun cadence. 40-seed group distribution engine with 3-day group cooldown and full KPI logging.',
    results: ['40 seed groups managed automatically', 'Content cadence 100% consistent', 'Zero manual posting required', 'Full KPI dashboard in Sheets'],
  },
  {
    number: '03',
    name: 'MHC Multi-Brand Pipeline',
    client: 'MHC Wholesale Delivery',
    tags: ['n8n', 'Google Sheets', 'Taglish NLP', 'Webhooks'],
    type: 'Brand-Isolated Automation',
    year: '2025',
    desc: 'n8n workflow architecture for a fresh food and rice wholesale delivery brand. Brand-isolated pipelines with own tokens per brand, error handler on every flow, auto-logging to Sheets, and Taglish-forward caption generation with savings + delivery hooks. Part of the larger TYG Services multi-brand SVC Distribution Engine.',
    results: ['6-brand isolation enforced', 'Error rate 0% since launch', 'All posts logged to master Sheet', 'Motherly Taglish voice consistent'],
  },
  {
    number: '04',
    name: 'SoleBlessing E-commerce',
    client: 'SoleBlessing Sneakers',
    tags: ['Next.js', 'Facebook Catalog', 'COD Integration'],
    type: 'Sneaker E-commerce',
    year: '2025',
    desc: 'Hype-forward sneaker e-commerce platform for a COD-first market. Product drops with scarcity mechanics, Facebook catalog sync, and English/Taglish caption automation. "LEGIT. FRESH. YOURS." brand voice integrated across all touchpoints.',
    results: ['COD-first checkout flow', 'Facebook catalog auto-sync', 'Drop mechanics with inventory lock', 'Hype voice consistent across posts'],
  },
  {
    number: '05',
    name: 'YANI Garden Café System',
    client: 'YANI Garden Café, Amadeo',
    tags: ['GAS', 'Google Sheets', 'n8n', 'Reservation'],
    type: 'F&B Operations + Content',
    year: '2025',
    desc: 'Operations and content system for a cozy garden café in Amadeo, Cavite. Tagalog-forward social content automation focused on food + ambiance hooks, table reservation management via Sheets, and a Sunday community post workflow.',
    results: ['Tagalog content voice locked', 'Reservation system in Sheets', 'Community cadence automated', 'Sunday post 100% consistent'],
  },
];

export default function WorkPage() {
  return (
    <div>
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Portfolio</p>
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">Selected work</h1>
        <p className="text-gray-500 max-w-xl leading-relaxed">
          Real systems built for real businesses. Every project here is live, tested, and operated by the client today.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="space-y-6">
          {projects.map(p => (
            <div key={p.name} className="border border-gray-100 rounded-2xl p-8 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-gray-300 font-medium">{p.number}</span>
                  <h2 className="text-lg font-semibold text-gray-900">{p.name}</h2>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{p.type}</span>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{p.year}</span>
              </div>

              <div className="flex gap-2 flex-wrap mb-4 pl-7">
                {p.tags.map(t => (
                  <span key={t} className="text-xs border border-gray-200 text-gray-500 px-2 py-0.5 rounded-md">{t}</span>
                ))}
              </div>

              <p className="text-sm text-gray-500 leading-relaxed mb-5 pl-7">{p.desc}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-7">
                {p.results.map(r => (
                  <div key={r} className="bg-gray-50 rounded-xl px-3 py-2.5">
                    <p className="text-xs text-gray-500 leading-snug">{r}</p>
                  </div>
                ))}
              </div>

              {p.phase && (
                <div className="mt-4 pl-7">
                  <span className="text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{p.phase}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Want to be on this list?</h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">Start with the discovery form. We'll map your requirements and send a proposal in 48 hours.</p>
          <Link href="/discovery" className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors">
            Start a project <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
