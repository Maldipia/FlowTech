import Link from 'next/link';
import { posts } from '@/lib/posts';

export const metadata = { title: 'Blog — Flowtech.ph' };

export default function BlogPage() {
  return (
    <div>
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Writing</p>
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">Blog</h1>
        <p className="text-gray-500 max-w-xl leading-relaxed">
          Case studies, technical guides, and automation playbooks from running 6 businesses and building systems for Philippine SMEs.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="space-y-4">
          {posts.map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="block border border-gray-100 rounded-2xl p-7 hover:border-gray-300 hover:shadow-sm transition-all group">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">
                      {post.tag}
                    </span>
                    <span className="text-xs text-gray-400">{post.readTime}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed">{post.excerpt}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-gray-400 mb-2">{new Date(post.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  <span className="text-blue-600 text-sm group-hover:translate-x-1 inline-block transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
