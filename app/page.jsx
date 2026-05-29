'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '@/components/CartProvider';

const peso = n => `₱${n.toLocaleString()}`;

const PRODUCTS = [
  { emoji:'🥩', name:'Supero Mix', slug:'supero-mix', price:135, sub:'90% Beef · 10% Chicken', tag:'Best Seller', tagColor:'gold', desc:'Raw beef meat, beef fats, beef liver, raw chicken soft bone. The complete everyday BARF blend — ideal for all breeds as a daily staple.' },
  { emoji:'🐄', name:'Supero Pure Beef', slug:'supero-pure-beef', price:145, sub:'100% Beef', tag:'Pure Protein', tagColor:'gold', desc:'Raw beef meat, beef fats, beef innards, beef liver, beef trachea, beef cartilage. Single-protein for sensitivities.' },
  { emoji:'🐷', name:'Supero Pure Pork', slug:'supero-pure-pork', price:145, sub:'100% Pork', tag:'Pure Protein', tagColor:'gold', desc:'Raw pork meat, pork fats, pork soft cartilage, pork whole offal, pork red offals. High-protein single-source.' },
  { emoji:'🛡️', name:'Supero BS', slug:'supero-bs', price:175, sub:'100% Beef Lean + Veal', tag:'Bully Sensitive', tagColor:'red', desc:'100% Beef lean meat, veal choice cuts. Formulated for sensitive stomachs and bully breeds. Low-fat, easily digestible.' },
  { emoji:'🐰', name:'Supero RABEEF', slug:'supero-rabeef', price:180, sub:'80% Rabbit · 20% Beef', tag:'Premium', tagColor:'gold', desc:'80% Rabbit meat, 20% Beef. Ideal for dogs with allergies or needing an exotic, lean protein source.' },
  { emoji:'🐱', name:'Supero Cat Sensitive', slug:'supero-cat-sensitive', price:170, sub:'80% Rabbit · 20% Beef', tag:'Cats ✓', tagColor:'purple', desc:'80% Rabbit meat, 20% Beef. Specially formulated for feline nutritional needs. Safe for all cat breeds.' },
];

const TREATS = [
  { emoji:'🦴', name:'Supero Chew Bone', slug:'supero-chew-bone', price:220, sub:'Raw beef bone with marrow · 1 pc', desc:'Natural dental care — cleans teeth, strengthens jaw, provides mental stimulation.' },
  { emoji:'🍖', name:'Supero Beef Trachea Jerky', slug:'supero-beef-trachea-jerky', price:200, sub:'Dried beef trachea · 1 pack', desc:'Natural glucosamine & chondroitin for joint health. Perfect high-value training treat.' },
  { emoji:'🫀', name:'Supero Pork Liver Bites', slug:'supero-pork-liver-bites', price:85, sub:'Premium pork liver · 1 pack', desc:'Nutrient-dense, high in Vitamin A & B12. Irresistible flavor dogs and cats love.' },
];

const BENEFITS = [
  { icon:'🦷', t:'Cleaner Teeth', d:'Natural raw diet reduces plaque and promotes fresher breath without brushing' },
  { icon:'⚖️', t:'Better Weight Control', d:'Lean protein & natural fats maintain ideal body composition for every breed' },
  { icon:'🫀', t:'Improved Digestion', d:'Harder, smaller, less smelly stools. Optimal gut microbiome.' },
  { icon:'🌿', t:'Reduces Allergies', d:'Zero fillers, additives, preservatives. Fewer allergy symptoms and skin issues' },
  { icon:'⚡', t:'More Energy & Stamina', d:'Real food = real energy. Better agility, stamina, and overall vitality' },
  { icon:'❤️', t:'Better Reproductive Health', d:'Nutrient-dense raw feeding supports breeding health for males and females' },
];

const FAQS = [
  { q:'Is Supero safe for dogs AND cats?', a:'YES. Supero is 100% safe natural premium raw meal for both cats and dogs. It has NO preservatives or any chemical additives in its composition.' },
  { q:'What about bacteria and microorganisms?', a:'Dogs and cats have a different digestive system than humans. Their digestive functions are designed to have highly acidic levels that certainly eliminates microbes. Raw food is completely safe for them.' },
  { q:'Is it only for large breed dogs?', a:'NO. Supero is for ALL breeds — whether small or large. It works for both dogs and cats of any size or age.' },
  { q:'How much do I feed per day?', a:'For DOGS: 3–4% of current body weight per day. For CATS: 2–3% of current body weight per day. Puppies and kittens: feed 2–3x daily. Adult dogs and cats: feed 1–2x daily.' },
  { q:'How long does it last?', a:'Unopened pack in the FREEZER: 1 year. Opened pack in the FREEZER: 7 days. Opened pack in the CHILLER: 4 days. Always thaw in the refrigerator overnight before serving.' },
  { q:'How do I transition from kibble to raw?', a:'Use the 7-day gradual transition: Start at 10% Supero + 90% kibble on Day 1, and increase the raw portion each day until Day 7 when your pet is eating 100% Supero. This prevents digestive upset.' },
];

const STEPS = [
  { day:1, pct:10 }, { day:2, pct:20 }, { day:3, pct:40 },
  { day:4, pct:60 }, { day:5, pct:75 }, { day:6, pct:90 }, { day:7, pct:100 },
];

const CHART = [
  ['1 kg','25g'],['2 kg','50g'],['5 kg','125g'],['8 kg','200g'],
  ['10 kg','250g'],['12 kg','300g'],['15 kg','375g'],['20 kg','500g'],
  ['25 kg','625g'],['30 kg','750g'],['40 kg','1 kg'],['50 kg','1.25 kg'],
  ['60 kg','1.5 kg'],['80 kg','2 kg'],
];

function ProductCard({ p, isFirst }) {
  return (
    <div className={`group bg-[#111] border rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300
      ${p.tagColor==='red' ? 'border-red-900/30 hover:border-red-700/40' :
        p.tagColor==='purple' ? 'border-purple-900/30 hover:border-purple-700/40' :
        'border-[#C9A84C]/12 hover:border-[#C9A84C]/40'}
      ${isFirst ? 'ring-1 ring-[#C9A84C]/25' : ''}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className="text-4xl">{p.emoji}</span>
          <span className={`text-[10px] font-bold tracking-[1.5px] uppercase px-2.5 py-1 rounded-full
            ${p.tagColor==='red' ? 'bg-red-900/30 text-red-400' :
              p.tagColor==='purple' ? 'bg-purple-900/30 text-purple-400' :
              'bg-[#C9A84C]/12 text-[#C9A84C]'}`}>
            {p.tag}
          </span>
        </div>
        <h3 className="text-white font-bold text-lg mb-1 leading-snug">{p.name}</h3>
        <p className="text-[#C9A84C]/60 text-xs font-medium mb-3 tracking-wide">{p.sub}</p>
        <p className="text-white/35 text-sm leading-relaxed mb-5">{p.desc}</p>
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div>
            <div className="text-[#C9A84C] font-black text-2xl">{peso(p.price)}</div>
            <div className="text-white/25 text-xs mt-0.5">per 1 kg pack</div>
          </div>
          <Link href={`/product/${p.slug}`}
            className="bg-[#C9A84C] hover:bg-[#E8C97A] text-black font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5">
            <ShoppingCart size={12} /> Order
          </Link>
        </div>
      </div>
    </div>
  );
}

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${open ? 'border-[#C9A84C]/30' : 'border-white/5'}`}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 hover:bg-white/3 transition-colors">
        <span className={`font-semibold text-sm leading-snug ${open ? 'text-white' : 'text-white/70'}`}>{q}</span>
        <span className="flex-shrink-0 text-[#C9A84C]">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      {open && (
        <div className="px-6 pb-5 text-white/50 text-sm leading-relaxed border-t border-white/5 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="bg-[#080808] text-[#F5F0E8] overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,#1c1200,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,#0d0900,transparent)]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2.5 bg-[#C9A84C]/10 border border-[#C9A84C]/25 text-[#C9A84C] text-xs font-bold tracking-[2px] uppercase px-5 py-2.5 rounded-full mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
            2.3M Boss Amos · Open Daily 9AM–11PM
          </div>
          <p className="text-white/35 text-xs tracking-[5px] uppercase mb-5 font-medium">
            Isang Magandang Araw Mga Boss Amo
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black leading-[1.03] tracking-tight mb-6"
            style={{fontFamily:'Georgia,serif',background:'linear-gradient(135deg,#fff 0%,#E8C97A 45%,#C9A84C 55%,#fff 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
            Supero<br />Premium Raw<br />Pet Food
          </h1>
          <p className="text-base sm:text-lg text-white/45 max-w-lg mx-auto leading-relaxed mb-4">
            The Ancient Modern Natural Diet.<br />
            100% natural · Zero preservatives · Zero fillers.
          </p>
          <p className="text-xs text-white/25 tracking-widest uppercase mb-12">
            Produced fresh daily · Amadeo, Cavite, Philippines
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/shop"
              className="bg-[#C9A84C] hover:bg-[#E8C97A] text-black font-black px-10 py-4 rounded-full text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-[#C9A84C]/20">
              Shop Now →
            </Link>
            <a href="#products"
              className="border-2 border-[#C9A84C]/30 hover:border-[#C9A84C]/70 text-[#C9A84C] font-semibold px-10 py-4 rounded-full text-sm transition-all">
              View Products
            </a>
          </div>
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-16 mt-16 pt-12 border-t border-[#C9A84C]/10 flex-wrap">
            {[['2.3M','Community'],['100%','All Natural'],['0','Preservatives'],['All','Breeds & Cats']].map(([n,l])=>(
              <div key={l} className="text-center">
                <div className="text-[#C9A84C] font-black text-3xl sm:text-4xl mb-1.5" style={{fontFamily:'Georgia,serif'}}>{n}</div>
                <div className="text-white/25 text-[10px] tracking-[2px] uppercase">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section id="products" className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-[#C9A84C] text-xs font-bold tracking-[3px] uppercase mb-3">Protein Products</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight" style={{fontFamily:'Georgia,serif'}}>
              The Supero Lineup
            </h2>
            <p className="text-white/35 mt-3 text-sm">For dogs AND cats · All breeds · All sizes · 1 kg per pack</p>
          </div>
          <Link href="/shop" className="text-[#C9A84C] text-sm hover:underline font-semibold flex-shrink-0">
            View all products →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRODUCTS.map((p, i) => <ProductCard key={p.slug} p={p} isFirst={i===0} />)}
        </div>

        {/* TREATS */}
        <div className="mt-16">
          <p className="text-[#C9A84C] text-xs font-bold tracking-[3px] uppercase mb-3">Supero Treats</p>
          <h2 className="text-3xl font-black text-white mb-8" style={{fontFamily:'Georgia,serif'}}>Rewards & Chews</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TREATS.map(t => (
              <Link key={t.slug} href={`/product/${t.slug}`}
                className="bg-[#111] border border-white/8 hover:border-[#C9A84C]/30 rounded-2xl p-6 transition-all hover:-translate-y-1 group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{t.emoji}</span>
                  <span className="text-[#C9A84C] font-black text-xl" style={{fontFamily:'Georgia,serif'}}>{peso(t.price)}</span>
                </div>
                <h3 className="text-white font-bold text-sm mb-1">{t.name}</h3>
                <p className="text-white/30 text-xs mb-3 leading-relaxed">{t.sub}</p>
                <p className="text-white/30 text-xs leading-relaxed">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORAGE ── */}
      <section className="bg-gradient-to-r from-[#0A0800] via-[#111000] to-[#0A0800] border-y border-[#C9A84C]/10 py-10 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 text-center">
          <div>
            <div className="text-2xl mb-2">❄️</div>
            <div className="text-[#C9A84C] font-black text-xl mb-1">1 Year</div>
            <div className="text-white/40 text-xs tracking-wider uppercase">Freezer — Unopened</div>
          </div>
          <div className="w-px h-12 bg-[#C9A84C]/15 hidden sm:block" />
          <div>
            <div className="text-2xl mb-2">🧊</div>
            <div className="text-[#C9A84C] font-black text-xl mb-1">7 Days</div>
            <div className="text-white/40 text-xs tracking-wider uppercase">Freezer — Opened</div>
          </div>
          <div className="w-px h-12 bg-[#C9A84C]/15 hidden sm:block" />
          <div>
            <div className="text-2xl mb-2">🌡️</div>
            <div className="text-[#C9A84C] font-black text-xl mb-1">4 Days</div>
            <div className="text-white/40 text-xs tracking-wider uppercase">Chiller — Opened</div>
          </div>
          <div className="w-px h-12 bg-[#C9A84C]/15 hidden sm:block" />
          <div>
            <div className="text-2xl mb-2">🕘</div>
            <div className="text-[#C9A84C] font-black text-xl mb-1">9AM–11PM</div>
            <div className="text-white/40 text-xs tracking-wider uppercase">Open Daily</div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#080808] via-[#0c0900] to-[#080808]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#C9A84C] text-xs font-bold tracking-[3px] uppercase mb-3">Why Raw Feeding</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white" style={{fontFamily:'Georgia,serif'}}>
              The Supero Difference
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#C9A84C]/8 rounded-3xl overflow-hidden">
            {BENEFITS.map(b => (
              <div key={b.t} className="bg-[#080808] p-8 text-center hover:bg-[#0e0a00] transition-colors group">
                <div className="w-14 h-14 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/15 flex items-center justify-center mx-auto mb-4 text-2xl group-hover:bg-[#C9A84C]/18 transition-colors">
                  {b.icon}
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{b.t}</h3>
                <p className="text-white/30 text-xs leading-relaxed">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEEDING CHART ── */}
      <section id="feeding" className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-[#C9A84C] text-xs font-bold tracking-[3px] uppercase mb-3">Feeding Guide</p>
            <h2 className="text-4xl font-black text-white mb-4" style={{fontFamily:'Georgia,serif'}}>
              How Much<br />To Feed?
            </h2>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              Feed <strong className="text-white/70">3–4% of body weight</strong> per day for dogs. 
              Split across 1–2 meals for adults, 2–3 meals for puppies.<br /><br />
              For cats: <strong className="text-white/70">2–3% of body weight</strong> per day. 
              Kittens: 2–3 meals. Adult cats: 1–2 meals.
            </p>
            {/* 7-step */}
            <p className="text-[#C9A84C] text-xs font-bold tracking-[3px] uppercase mb-4">7-Day Transition from Kibble</p>
            <div className="grid grid-cols-7 gap-1.5">
              {STEPS.map(s => (
                <div key={s.day} className={`rounded-xl p-3 text-center border transition-all
                  ${s.pct===100 ? 'border-[#C9A84C]/50 bg-[#141400]' : 'border-white/6 bg-[#0e0e0e]'}`}>
                  <div className="text-[#C9A84C] font-black text-lg leading-none mb-1.5" style={{fontFamily:'Georgia,serif'}}>{s.day}</div>
                  <div className={`text-[9px] font-semibold leading-tight ${s.pct===100 ? 'text-[#C9A84C]' : 'text-white/25'}`}>
                    {s.pct===100 ? '100%' : `${s.pct}%`}
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-[#C9A84C] rounded-full" style={{width:`${s.pct}%`}} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Chart */}
          <div className="bg-[#0A0800] border border-[#C9A84C]/15 rounded-3xl p-6">
            <h3 className="text-[#C9A84C] font-black text-lg text-center mb-1" style={{fontFamily:'Georgia,serif'}}>Daily Feeding Chart</h3>
            <p className="text-white/25 text-xs text-center mb-6">2.5% of body weight reference</p>
            <div className="grid grid-cols-2 gap-1.5">
              {CHART.map(([w,a]) => (
                <div key={w} className="flex justify-between bg-[#C9A84C]/4 border border-[#C9A84C]/8 rounded-xl px-3.5 py-2.5 hover:bg-[#C9A84C]/10 transition-colors">
                  <span className="text-xs text-white/35">{w} dog</span>
                  <span className="text-sm font-bold text-[#C9A84C]">{a}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-white/20 text-[10px] mt-4">🐱 Cats: 2–3% · 1–2 meals per day</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-[#C9A84C] text-xs font-bold tracking-[3px] uppercase mb-3">Questions</p>
        <h2 className="text-4xl font-black text-white mb-10" style={{fontFamily:'Georgia,serif'}}>
          Frequently Asked
        </h2>
        <div className="space-y-2">
          {FAQS.map(f => <FAQ key={f.q} q={f.q} a={f.a} />)}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="text-center px-6 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,#1a1100,transparent)]" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 border border-[#C9A84C]/25 text-[#C9A84C] text-xs font-bold tracking-[2px] uppercase px-5 py-2.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-pulse" />
            Fresh batch available now · Open Daily 9AM–11PM
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white mb-4 leading-tight" style={{fontFamily:'Georgia,serif'}}>
            Feed them<br />the real thing.
          </h2>
          <p className="text-white/35 mb-10 leading-relaxed">
            Order online. Same-day delivery Metro Manila &amp; Cavite via Lalamove.<br />
            Nationwide via J&amp;T and LBC.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/shop"
              className="bg-[#C9A84C] hover:bg-[#E8C97A] text-black font-black px-10 py-4 rounded-full text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-[#C9A84C]/15">
              Shop All Products →
            </Link>
            <a href="https://www.facebook.com/superodogfarm" target="_blank" rel="noopener noreferrer"
              className="border border-[#C9A84C]/30 hover:border-[#C9A84C]/70 text-[#C9A84C] font-semibold px-10 py-4 rounded-full text-sm transition-all">
              📘 Follow @superodogfarm
            </a>
          </div>
          <p className="text-white/15 text-xs mt-10">
            Purok 4, Brgy Bucal, Amadeo, Cavite 4119 · community@superodogfarm.com
          </p>
        </div>
      </section>

    </div>
  );
}
