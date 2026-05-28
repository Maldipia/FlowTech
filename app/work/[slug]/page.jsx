import Link from 'next/link';
import { projects, getProjectBySlug } from '@/lib/projects';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const p = getProjectBySlug(params.slug);
  if (!p) return {};
  return {
    title: `${p.name} — Flowtech.ph`,
    description: p.summary,
  };
}

export default function WorkSlugPage({ params }) {
  const p = getProjectBySlug(params.slug);
  if (!p) notFound();

  return (
    <div>
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-10">
        <Link href="/work" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8">
          <ArrowLeft size={14} /> Back to work
        </Link>
        <div className="flex items-start gap-3 flex-wrap mb-4">
          <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">{p.type}</span>
          <span className="text-xs text-gray-400 py-1">{p.year}</span>
        </div>
        <h1 className="text-4xl font-semibold text-gray-900 mb-4 leading-tight">{p.name}</h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">{p.summary}</p>
      </section>

      {/* Results */}
      <section className="border-t border-b border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {p.results.map(r => (
              <div key={r.metric}>
                <div className="text-3xl font-semibold text-gray-900 mb-1">{r.metric}</div>
                <div className="text-sm font-medium text-gray-700 mb-0.5">{r.label}</div>
                <div className="text-xs text-gray-400">{r.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem + Solution */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">The problem</p>
            <p className="text-gray-600 leading-relaxed text-sm">{p.problem}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">The solution</p>
            <p className="text-gray-600 leading-relaxed text-sm">{p.solution}</p>
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-5">Tech stack</p>
          <div className="flex flex-wrap gap-2">
            {p.stack.map(s => (
              <span key={s} className="text-sm bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Phases (if any) */}
      {p.phases?.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-14">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-6">Project phases</p>
          <div className="space-y-3">
            {p.phases.map(ph => (
              <div key={ph.phase} className="flex items-start gap-4 border border-gray-100 rounded-xl p-5">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5">{ph.phase}</span>
                <p className="text-sm text-gray-600">{ph.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      <section className="border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 flex-wrap">
            {p.tags.map(t => (
              <span key={t} className="text-xs border border-gray-200 text-gray-500 px-2.5 py-1 rounded-md">{t}</span>
            ))}
          </div>
          <Link href="/work" className="text-sm text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1.5">
            ← All projects
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-14 md:flex items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Want a similar system?</h2>
            <p className="text-gray-400 text-sm">Fill out the discovery form — we'll scope it and send a proposal in 48 hours.</p>
          </div>
          <Link href="/discovery"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors mt-6 md:mt-0">
            Start a project <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
