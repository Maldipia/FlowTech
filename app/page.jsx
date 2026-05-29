import Link from 'next/link';

export const metadata = {
  title: 'Supero Dog Farm — Premium Raw Pet Food',
  description: 'Isang Magandang Araw Mga Boss Amo. 100% natural raw dog and cat food. No preservatives. Produced fresh in Amadeo, Cavite.',
};

const PRODUCTS = [
  { emoji:'🥩', type:'Best Seller', name:'Supero Mix', desc:'Raw beef meat, beef fats, beef liver, raw chicken soft bone. The complete everyday blend.', slug:'supero-mix', accent:'gold' },
  { emoji:'🐄', type:'Pure Protein', name:'Supero Pure Beef', desc:'Raw beef meat, beef fats, beef innards, beef liver, beef trachea, beef cartilage.', slug:'supero-pure-beef', accent:'gold' },
  { emoji:'🐷', type:'Pure Protein', name:'Supero Pure Pork', desc:'Raw pork meat, pork fats, pork soft cartilage, pork whole offal, pork red offals.', slug:'supero-pure-pork', accent:'gold' },
  { emoji:'🥩', type:'Specialized', name:'Supero RABEEF', desc:'Premium raw beef for performance dogs and active breeds requiring higher protein.', slug:'supero-rabeef', accent:'gold' },
  { emoji:'🛡️', type:'#BS — Bully Sensitive', name:'Supero BS', desc:'Veal, beef liver, green tripe, spleen, pancreas, kidney, lungs, trachea, soft cartilage.', slug:'supero-bs', accent:'red' },
  { emoji:'🐱', type:'For Cats', name:'Supero Cat Sensitive', desc:'Specially formulated for feline nutrition. Natural raw diet tailored to cat digestive needs.', slug:'supero-cat-sensitive', accent:'purple' },
];

const BENEFITS = [
  { icon:'🦷', title:'Cleaner Teeth', desc:'Natural raw diet reduces plaque and promotes fresher breath' },
  { icon:'⚖️', title:'Better Weight Control', desc:'Lean protein maintains ideal body composition for every breed' },
  { icon:'🫀', title:'Improved Digestion', desc:'Harder, smaller stools. Optimal gut microbiome. Less gas.' },
  { icon:'🌿', title:'Reduces Allergies', desc:'No fillers, no additives, no preservatives. Fewer skin issues.' },
  { icon:'⚡', title:'More Energy', desc:'Real food = real energy. Better stamina and agility.' },
  { icon:'❤️', title:'Reproductive Health', desc:'Nutrient-dense raw feeding supports breeding health.' },
];

const CHART = [
  ['1 kg','25g'],['2 kg','50g'],['5 kg','125g'],['8 kg','200g'],
  ['10 kg','250g'],['12 kg','300g'],['15 kg','375g'],['18 kg','450g'],
  ['20 kg','500g'],['25 kg','625g'],['30 kg','750g'],['35 kg','875g'],
  ['40 kg','1 kg'],['50 kg','1.25 kg'],['60 kg','1.5 kg'],['80 kg','2 kg'],
];

const STEPS = [
  { day:1, pct:10, label:'10% raw' },
  { day:2, pct:20, label:'20% raw' },
  { day:3, pct:40, label:'40% raw' },
  { day:4, pct:60, label:'60% raw' },
  { day:5, pct:75, label:'75% raw' },
  { day:6, pct:90, label:'90% raw' },
  { day:7, pct:100, label:'100% Supero!' },
];

export default function HomePage() {
  return (
    <div className="bg-[#080808] text-[#F5F0E8]">

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#1a1100,transparent)]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 border border-[#C9A84C]/25 text-[#C9A84C] text-xs font-bold tracking-[2px] uppercase px-5 py-2.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-pulse" />
            2.3M Boss Amos Nationwide
          </div>
          <p className="text-white/40 text-xs tracking-[4px] uppercase mb-4">Isang Magandang Araw Mga Boss Amo</p>
          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6 bg-gradient-to-br from-white via-[#E8C97A] to-white bg-clip-text text-transparent" style={{fontFamily:'Georgia,serif'}}>
            Premium Raw<br />Dog &amp; Cat Food
          </h1>
          <p className="text-lg text-white/50 max-w-lg mx-auto leading-relaxed mb-10">
            100% natural. Zero preservatives. Zero fillers.<br />Produced fresh daily in Amadeo, Cavite.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/shop" className="bg-[#C9A84C] hover:bg-[#E8C97A] text-black font-bold px-8 py-4 rounded-full text-sm transition-all hover:-translate-y-0.5">
              Shop Now →
            </Link>
            <a href="#feeding" className="border border-[#C9A84C]/35 hover:border-[#C9A84C] text-[#C9A84C] font-semibold px-8 py-4 rounded-full text-sm transition-all hover:bg-[#C9A84C]/8">
              Feeding Guide
            </a>
          </div>
          <div className="flex gap-10 flex-wrap justify-center mt-16 pt-16 border-t border-[#C9A84C]/10">
            {[['2.3M','Facebook Followers'],['100%','Natural Ingredients'],['0','Preservatives']].map(([n,l])=>(
              <div key={l}>
                <div className="text-[#C9A84C] font-black text-3xl mb-1" style={{fontFamily:'Georgia,serif'}}>{n}</div>
                <div className="text-white/30 text-xs tracking-widest uppercase">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-[#C9A84C] text-xs font-bold tracking-[3px] uppercase mb-4">Product Lineup</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight" style={{fontFamily:'Georgia,serif'}}>The Istorya ng Supero<br />Raw Food Collection</h2>
        <p className="text-white/40 text-base mb-3 max-w-lg">BARF-compliant. Safe for all breeds. For dogs AND cats.</p>
        <p className="text-[#C9A84C]/50 text-xs tracking-widest uppercase mb-12">Net Weight: 1kg per pack · Cold chain delivery</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRODUCTS.map(p => (
            <Link key={p.slug} href={`/product/${p.slug}`}
              className={`bg-[#111]/80 border rounded-2xl p-7 hover:-translate-y-1 transition-all group
                ${p.accent==='red' ? 'border-red-900/30 hover:border-red-700/40' :
                  p.accent==='purple' ? 'border-purple-900/30 hover:border-purple-700/40' :
                  'border-[#C9A84C]/10 hover:border-[#C9A84C]/35'}`}>
              <div className="text-4xl mb-4">{p.emoji}</div>
              <div className={`text-xs font-bold tracking-[2px] uppercase mb-2
                ${p.accent==='red' ? 'text-red-400' : p.accent==='purple' ? 'text-purple-400' : 'text-[#C9A84C]'}`}>
                {p.type}
              </div>
              <h3 className="text-white font-bold text-lg mb-3 leading-snug">{p.name}</h3>
              <p className="text-white/35 text-sm leading-relaxed mb-5">{p.desc}</p>
              <span className="inline-flex items-center gap-2 bg-[#C9A84C]/8 border border-[#C9A84C]/18 text-[#C9A84C] text-xs font-semibold px-3 py-1.5 rounded-full">
                1 kg pack
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-gradient-to-b from-[#080808] via-[#0d0a00] to-[#080808] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#C9A84C] text-xs font-bold tracking-[3px] uppercase mb-4">Why Raw Feeding</p>
            <h2 className="text-4xl font-black text-white" style={{fontFamily:'Georgia,serif'}}>The Supero Difference</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {BENEFITS.map(b => (
              <div key={b.title} className="text-center p-8">
                <div className="w-14 h-14 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">{b.icon}</div>
                <h3 className="text-white font-bold text-sm mb-2">{b.title}</h3>
                <p className="text-white/35 text-xs leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEEDING CHART */}
      <section id="feeding" className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-[#C9A84C] text-xs font-bold tracking-[3px] uppercase mb-4">Feeding Guide</p>
        <h2 className="text-4xl font-black text-white mb-3" style={{fontFamily:'Georgia,serif'}}>Raw Feeding Chart</h2>
        <p className="text-white/40 mb-12">Feed 2.5% of your pet's body weight per day, split across 2–3 meals.</p>
        <div className="bg-[#0A0800] border border-[#C9A84C]/18 rounded-3xl p-8 md:p-10">
          <h3 className="text-[#C9A84C] text-xl font-black text-center mb-2" style={{fontFamily:'Georgia,serif'}}>Daily Feeding Amount</h3>
          <p className="text-white/30 text-sm text-center mb-8">Based on 2.5% of body weight</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CHART.map(([w,a]) => (
              <div key={w} className="flex items-center justify-between bg-[#C9A84C]/4 border border-[#C9A84C]/8 rounded-xl px-4 py-3 hover:bg-[#C9A84C]/10 hover:border-[#C9A84C]/25 transition-all">
                <span className="text-xs text-white/40 font-medium">{w} dog</span>
                <span className="text-sm font-bold text-[#C9A84C]">{a}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-white/25 text-xs mt-6">🐱 Cats: Feed 2–3% of body weight · 2–3 meals per day</p>
        </div>
      </section>

      {/* 7-STEP TRANSITION */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <p className="text-[#C9A84C] text-xs font-bold tracking-[3px] uppercase mb-4">Transition Guide</p>
        <h2 className="text-4xl font-black text-white mb-3" style={{fontFamily:'Georgia,serif'}}>Switching from Kibble to Raw</h2>
        <p className="text-white/40 mb-12 max-w-lg">The safest method is a 7-day transition. Start at 10% Supero + 90% kibble.</p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          {STEPS.map(s => (
            <div key={s.day} className={`rounded-2xl p-4 text-center border transition-all
              ${s.pct===100 ? 'border-[#C9A84C]/50 bg-[#141400]' : 'border-[#C9A84C]/10 bg-[#0e0e0e]'}`}>
              <div className="text-[#C9A84C] font-black text-2xl mb-1" style={{fontFamily:'Georgia,serif'}}>{s.day}</div>
              <div className="text-white/30 text-[9px] uppercase tracking-widest mb-2">Day {s.day}</div>
              <div className={`text-xs font-semibold ${s.pct===100 ? 'text-[#C9A84C]' : 'text-white/30'}`}>{s.label}</div>
              <div className="h-1 bg-[#C9A84C]/10 rounded-full overflow-hidden mt-3">
                <div className="h-full bg-[#C9A84C] rounded-full" style={{width:`${s.pct}%`}} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-6 py-20 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,#1a1100,transparent)]">
        <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 border border-[#C9A84C]/25 text-[#C9A84C] text-xs font-bold tracking-[2px] uppercase px-5 py-2.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-pulse" />
          Fresh batch available now
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white mb-4" style={{fontFamily:'Georgia,serif'}}>
          Ready to feed them<br />the real thing?
        </h2>
        <p className="text-white/40 text-base mb-10">Order online. Delivered fresh from Amadeo, Cavite.<br />Same-day delivery Metro Manila &amp; Cavite via Lalamove.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/shop" className="bg-[#C9A84C] hover:bg-[#E8C97A] text-black font-bold px-8 py-4 rounded-full text-sm transition-all hover:-translate-y-0.5">
            Shop All Products →
          </Link>
          <a href="https://www.facebook.com/superodogfarm" target="_blank" rel="noopener noreferrer"
            className="border border-[#C9A84C]/35 hover:border-[#C9A84C] text-[#C9A84C] font-semibold px-8 py-4 rounded-full text-sm transition-all hover:bg-[#C9A84C]/8">
            Follow @superodogfarm
          </a>
        </div>
      </section>

    </div>
  );
}
