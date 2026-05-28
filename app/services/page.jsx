import Link from 'next/link';
import { Code2, Bot, Puzzle, Headphones, ArrowRight, CheckCircle } from 'lucide-react';

export const metadata = { title: 'Services — Flowtech.ph' };

const services = [
  {
    icon: Code2,
    title: 'Custom Development',
    price: 'From ₱35,000',
    desc: 'End-to-end web applications built on Next.js 14, React, and Supabase. Storefronts, internal dashboards, multi-tenant SaaS platforms, and customer-facing portals.',
    includes: [
      'Next.js 14 App Router + Tailwind CSS',
      'Supabase (PostgreSQL + Auth + Storage)',
      'Vercel deployment with CI/CD',
      'Mobile-responsive, SEO-optimized',
      'API-first architecture for easy scaling',
      '30-day post-launch support',
    ],
  },
  {
    icon: Bot,
    title: 'Business Automation',
    price: 'From ₱18,000',
    desc: 'n8n multi-brand workflows, Google Apps Script automations, and Facebook Graph API integrations that eliminate manual tasks and recover lost leads.',
    includes: [
      'n8n workflow design & deployment',
      'Google Apps Script (GAS) development',
      'Facebook Graph API integration',
      'Error handling & Sheets logging',
      'Brand-isolated pipelines',
      'Training & documentation included',
    ],
  },
  {
    icon: Puzzle,
    title: 'Systems Integration',
    price: 'From ₱25,000',
    desc: 'Connect your existing tools into one unified layer. POS to Sheets, Facebook to CRM, inventory to logistics — no more manual data transfer between systems.',
    includes: [
      'API mapping & integration design',
      'Webhook setup & management',
      'Google Workspace integrations',
      'Payment gateway connections (GCash, Maya)',
      'Logistics API (Lalamove, J&T)',
      'Real-time sync & error recovery',
    ],
  },
  {
    icon: Headphones,
    title: 'Retainer Support',
    price: 'From ₱8,000/mo',
    desc: 'Monthly dev and automation support. Your systems keep evolving as your business grows — new features, fixes, optimizations, and workflow improvements on demand.',
    includes: [
      '10–20 hours of dev work per month',
      'Priority response within 1 business day',
      'Monthly system health review',
      'New feature development',
      'Performance & cost optimization',
      'Slack/Messenger async communication',
    ],
  },
];

const process = [
  { step: '01', title: 'Discovery', desc: 'We map your current workflow, pain points, and goals through our structured questionnaire and a 30-minute call.' },
  { step: '02', title: 'Proposal', desc: 'You receive a scoped proposal within 48 hours — fixed price, defined deliverables, and a clear timeline.' },
  { step: '03', title: 'Build', desc: 'We build in focused 2-week sprints with regular check-ins. You see real progress, not just status updates.' },
  { step: '04', title: 'Launch & Support', desc: 'Go live on Vercel with full documentation. 30-day support included. Retainer available for ongoing work.' },
];

export default function ServicesPage() {
  return (
    <div>
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">What we offer</p>
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">Services</h1>
        <p className="text-gray-500 max-w-xl leading-relaxed">
          Everything is scoped, fixed-price, and built on an open-source stack you own forever. No subscriptions to our tools.
        </p>
      </section>

      {/* Service cards */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="space-y-6">
          {services.map(s => (
            <div key={s.title} className="border border-gray-100 rounded-2xl p-8 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <s.icon size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">{s.title}</h2>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-lg">{s.desc}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-sm font-semibold text-gray-900">{s.price}</span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-2 pl-14">
                {s.includes.map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle size={13} className="text-blue-500 flex-shrink-0" />
                    <span className="text-sm text-gray-500">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">How we work</p>
          <h2 className="text-3xl font-semibold text-gray-900 mb-12">Our process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {process.map(p => (
              <div key={p.step}>
                <div className="text-2xl font-semibold text-blue-200 mb-3">{p.step}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">Ready to start?</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Fill out our discovery form — takes 5 minutes and gets you a scoped proposal within 48 hours.</p>
        <Link href="/discovery" className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors">
          Start with discovery form <ArrowRight size={15} />
        </Link>
      </section>
    </div>
  );
}
