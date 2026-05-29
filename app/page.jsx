import Link from 'next/link';
import { ArrowRight, Zap, Shield, Truck, Award } from 'lucide-react';

export const metadata = { title: 'SUPERO — Premium Pet Food & Marketplace' };

const cats = [
  { label: 'Raw Food', slug: 'raw-food', emoji: '🥩', desc: 'BARF-compliant blends' },
  { label: 'Grooming', slug: 'grooming', emoji: '🧴', desc: 'pH-balanced formulas' },
  { label: 'Supplements', slug: 'supplements', emoji: '💊', desc: 'Vet-grade nutrition' },
];

const features = [
  { icon: Zap, title: 'Same-Day Delivery', desc: 'Metro Manila & Cavite via Lalamove. Order before 2PM.' },
  { icon: Shield, title: 'BARF-Compliant', desc: 'Zero fillers, zero preservatives. Lab-tested quality.' },
  { icon: Truck, title: 'Nationwide Shipping', desc: 'J&T & LBC for provincial orders. Cold-chain preserved.' },
  { icon: Award, title: 'Fresh from Amadeo', desc: 'Produced daily in Amadeo, Cavite. Never frozen.' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-5 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#C9A84C]/15 text-[#C9A84C] text-xs font-semibold px-3 py-1.5 rounded-full mb-8 tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
              Fresh Batch Available Now
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.07] tracking-tight mb-6">
              Feed them<br />
              <span className="text-[#C9A84C]">the real thing.</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl">
              Premium raw pet food, professional grooming, and vet-grade supplements. Made fresh in Amadeo, delivered to your door.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/shop"
                className="bg-[#C9A84C] hover:bg-[#E8C97A] text-black font-bold px-7 py-3.5 rounded-xl text-sm transition-colors flex items-center gap-2">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link href="/shop/raw-food"
                className="bg-white/10 hover:bg-white/15 text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition-colors border border-white/20">
                View Raw Food
              </Link>
            </div>
            <div className="flex items-center gap-8 mt-12">
              {[['2,400+','Happy Pet Owners'],['Same Day','Metro Manila Delivery'],['100%','BARF Compliant']].map(([v,l])=>(
                <div key={v}>
                  <div className="text-[#C9A84C] font-bold text-xl mb-0.5">{v}</div>
                  <div className="text-white/40 text-xs">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Categories</p>
            <h2 className="text-3xl font-bold text-gray-900">Shop by type</h2>
          </div>
          <Link href="/shop" className="text-sm text-[#C9A84C] hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cats.map(c => (
            <Link key={c.slug} href={`/shop/${c.slug}`}
              className="group bg-gray-900 hover:bg-[#0A0A0A] rounded-2xl p-7 transition-colors border border-gray-800 hover:border-[#C9A84C]/30">
              <div className="text-4xl mb-4">{c.emoji}</div>
              <h3 className="text-white font-bold text-lg mb-1">{c.label}</h3>
              <p className="text-white/40 text-sm mb-4">{c.desc}</p>
              <span className="text-[#C9A84C] text-sm font-semibold group-hover:translate-x-1 inline-block transition-transform">
                Shop {c.label} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-5 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title}>
                <div className="w-10 h-10 bg-[#0A0A0A] rounded-xl flex items-center justify-center mb-4">
                  <f.icon size={18} className="text-[#C9A84C]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5 text-sm">{f.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace teaser */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="bg-[#0A0A0A] rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-3">Marketplace</p>
            <h2 className="text-3xl font-bold text-white mb-3">Find your next best friend.</h2>
            <p className="text-white/50 max-w-md leading-relaxed">Browse verified breeders and find healthy puppies near you. All listings reviewed and approved.</p>
          </div>
          <Link href="/marketplace"
            className="flex-shrink-0 bg-[#C9A84C] hover:bg-[#E8C97A] text-black font-bold px-7 py-3.5 rounded-xl text-sm transition-colors flex items-center gap-2 whitespace-nowrap">
            Browse Puppies <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
