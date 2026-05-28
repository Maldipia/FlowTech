import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { projects } from '@/lib/projects';

export const metadata = {
  title: 'Work',
  description: 'Real systems built for real Philippine businesses — e-commerce, automation, and operations platforms that are live and running today.',
  alternates: { canonical: 'https://www.flowtech.ph/work' },
};

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
        <div className="space-y-4">
          {projects.map((p, i) => (
            <Link key={p.slug} href={`/work/${p.slug}`}
              className="block border border-gray-100 rounded-2xl p-8 hover:border-gray-300 hover:shadow-sm transition-all group">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-gray-300 font-medium">0{i + 1}</span>
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{p.name}</h2>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{p.type}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400">{p.year}</span>
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform text-sm">arrow</span>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap mb-4 pl-7">
                {p.tags.map(t => (
                  <span key={t} className="text-xs border border-gray-200 text-gray-500 px-2 py-0.5 rounded-md">{t}</span>
                ))}
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-5 pl-7">{p.summary}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-7">
                {p.results.map(r => (
                  <div key={r.metric} className="bg-gray-50 rounded-xl px-3 py-2.5">
                    <div className="text-base font-semibold text-gray-900">{r.metric}</div>
                    <p className="text-xs text-gray-500 leading-snug">{r.label}</p>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Want to be on this list?</h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">Start with the discovery form. We will map your requirements and send a proposal in 48 hours.</p>
          <Link href="/discovery" className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors">
            Start a project
          </Link>
        </div>
      </section>
    </div>
  );
}
