import Link from 'next/link';
import { posts, getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return { title: `${post.title} — Flowtech.ph`, description: post.excerpt };
}

export default function BlogPostPage({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const paragraphs = post.content.split('\n\n');

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {/* Back */}
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-10">
        ← Back to blog
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">{post.tag}</span>
          <span className="text-xs text-gray-400">{post.readTime}</span>
          <span className="text-xs text-gray-400">
            {new Date(post.date).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 leading-tight mb-4">{post.title}</h1>
        <p className="text-gray-500 text-lg leading-relaxed">{post.excerpt}</p>
      </div>

      <hr className="border-gray-100 mb-10" />

      {/* Content */}
      <div className="prose-sm space-y-5">
        {paragraphs.map((block, i) => {
          if (!block.trim()) return null;

          // H2
          if (block.startsWith('**') && block.endsWith('**') && !block.slice(2).includes('**')) {
            return <h2 key={i} className="text-lg font-semibold text-gray-900 mt-8 mb-3">{block.slice(2, -2)}</h2>;
          }

          // Code block
          if (block.startsWith('```')) {
            const code = block.replace(/```[a-z]*\n?/, '').replace(/```$/, '');
            return <pre key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs text-gray-700 overflow-x-auto font-mono leading-relaxed">{code}</pre>;
          }

          // Table
          if (block.includes('|---')) {
            const rows = block.split('\n').filter(r => r.trim() && !r.includes('|---'));
            return (
              <div key={i} className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  {rows.map((row, ri) => {
                    const cells = row.split('|').filter(c => c.trim());
                    const Tag = ri === 0 ? 'th' : 'td';
                    return (
                      <tr key={ri} className={ri === 0 ? 'bg-gray-50' : ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                        {cells.map((cell, ci) => (
                          <Tag key={ci} className={`px-4 py-2.5 text-left ${ri === 0 ? 'text-xs font-semibold text-gray-500 uppercase tracking-wider' : 'text-gray-600'}`}>
                            {cell.trim()}
                          </Tag>
                        ))}
                      </tr>
                    );
                  })}
                </table>
              </div>
            );
          }

          // Bullet list
          if (block.split('\n').every(l => l.trim().startsWith('- '))) {
            return (
              <ul key={i} className="space-y-1.5 pl-4">
                {block.split('\n').map((line, li) => (
                  <li key={li} className="text-gray-600 text-sm leading-relaxed flex items-start gap-2">
                    <span className="text-blue-400 mt-1.5 flex-shrink-0">•</span>
                    <span>{line.replace(/^- /, '')}</span>
                  </li>
                ))}
              </ul>
            );
          }

          // Bold inline
          const renderInline = (text) => {
            const parts = text.split(/(\*\*[^*]+\*\*)/g);
            return parts.map((part, pi) =>
              part.startsWith('**') && part.endsWith('**')
                ? <strong key={pi} className="font-semibold text-gray-800">{part.slice(2, -2)}</strong>
                : part
            );
          };

          // Link detection
          const renderWithLinks = (text) => {
            const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
            const parts = [];
            let last = 0;
            let match;
            while ((match = linkRegex.exec(text)) !== null) {
              if (match.index > last) parts.push(text.slice(last, match.index));
              parts.push(<Link key={match.index} href={match[2]} className="text-blue-600 hover:underline">{match[1]}</Link>);
              last = match.index + match[0].length;
            }
            if (last < text.length) parts.push(text.slice(last));
            return parts.length > 0 ? parts : text;
          };

          return (
            <p key={i} className="text-gray-600 leading-relaxed text-sm">
              {renderWithLinks(block)}
            </p>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-14 border-t border-gray-100 pt-10">
        <div className="bg-gray-900 rounded-2xl p-8 text-center">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Work with us</p>
          <h3 className="text-xl font-semibold text-white mb-3">Want a system like this?</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">Fill out the discovery form — we'll send a scoped proposal within 48 hours.</p>
          <Link href="/discovery" className="inline-flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors">
            Start a project →
          </Link>
        </div>
      </div>
    </div>
  );
}
