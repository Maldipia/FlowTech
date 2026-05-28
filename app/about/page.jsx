import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export const metadata = { title: 'About — Flowtech.ph' };

const stack = [
  { cat: 'Frontend', items: ['Next.js 14', 'React', 'Tailwind CSS', 'Vercel'] },
  { cat: 'Backend & DB', items: ['Supabase', 'PostgreSQL', 'Node.js', 'Next.js API Routes'] },
  { cat: 'Automation', items: ['n8n', 'Google Apps Script', 'Facebook Graph API', 'Webhooks'] },
  { cat: 'Integrations', items: ['GCash / Maya', 'Lalamove / J&T', 'Resend', 'Cloudinary'] },
];

const brands = [
  { name: 'MHC', desc: 'Fresh food & rice wholesale delivery', since: '2019' },
  { name: 'TGB', desc: 'Gold jewelry with layaway since 2016', since: '2016' },
  { name: 'SoleBlessing', desc: 'Sneaker e-commerce, COD-first', since: '2022' },
  { name: 'YANI Garden Café', desc: 'Garden café in Amadeo, Cavite', since: '2023' },
  { name: 'Luntian Log Cabin', desc: 'Nature escape accommodation, Tagaytay', since: '2023' },
  { name: 'AST3R', desc: 'Gen Z fashion brand', since: '2024' },
];

export default function AboutPage() {
  return (
    <div>
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-16">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">About</p>
        <h1 className="text-4xl font-semibold text-gray-900 mb-6 max-w-2xl leading-tight">
          We build the systems we wish existed when we started our own businesses.
        </h1>
        <p className="text-gray-500 max-w-xl leading-relaxed text-lg">
          Flowtech.ph is a development and automation studio founded by Pia Legeryn — entrepreneur, builder, and operator of 6 active businesses under TYG Services in Amadeo, Cavite.
        </p>
      </section>

      {/* Story */}
      <section className="border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Built by an operator</h2>
              <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
                <p>
                  Before building systems for clients, we built them for ourselves. Running 6 businesses simultaneously — food wholesale, jewelry, sneakers, a café, a cabin, and fashion — forced a deep understanding of what automation and custom software actually needs to do.
                </p>
                <p>
                  The systems we build aren't theoretical. The same GAS auto-poster running TGB Jewelry's content, the same n8n pipeline managing MHC's orders, the same Supabase architecture behind Supero — these are all live and processing real transactions today.
                </p>
                <p>
                  That's the Flowtech.ph difference: every pattern we use has been stress-tested by a real business, not just a client project.
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Our stack philosophy</h2>
              <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
                <p>
                  We build on open-source tools with generous free tiers: Next.js on Vercel, Supabase for the database, n8n for automation, Google Workspace for operations. You own everything we build.
                </p>
                <p>
                  No proprietary CMS you'll pay for forever. No platform lock-in. When we hand over a project, you have the repo, the credentials, and the documentation to maintain it independently — or keep us on retainer if you'd rather not.
                </p>
                <p>
                  We work in Taglish because our clients are Filipino businesses. Our systems are built for Philippine workflows: GCash/Maya payments, Lalamove/J&T logistics, Facebook-first distribution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands we operate */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">TYG Services portfolio</p>
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Brands we operate</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {brands.map(b => (
              <div key={b.name} className="bg-white border border-gray-100 rounded-xl p-5 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-0.5">{b.name}</h3>
                  <p className="text-sm text-gray-500">{b.desc}</p>
                </div>
                <span className="text-xs text-gray-300">Since {b.since}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Technology</p>
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Our stack</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {stack.map(s => (
            <div key={s.cat}>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">{s.cat}</p>
              <div className="space-y-2">
                {s.items.map(item => (
                  <div key={item} className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">{item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Ready to work together?</h2>
            <p className="text-gray-400 text-sm">Based in Amadeo, Cavite. Working with clients across the Philippines.</p>
          </div>
          <Link href="/discovery" className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors">
            Start with discovery <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
