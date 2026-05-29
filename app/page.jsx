import Link from 'next/link';

export const metadata = {
  title: 'Supero Dog Farm — Premium Raw Pet Food',
  description: 'Isang Magandang Araw Mga Boss Amo. 100% natural raw dog and cat food. Zero preservatives. Fresh from Amadeo, Cavite.',
};

const MAIN_PRODUCTS = [
  { emoji:'🥩', name:'Supero Mix', tag:'Best Seller', price:135, composition:'90% Beef · 10% Chicken', desc:'Raw beef meat, beef fats, beef liver, raw chicken soft bone. The complete everyday blend.', slug:'supero-mix', accent:'gold' },
  { emoji:'🐄', name:'Supero Pure Beef', tag:'Single Protein', price:145, composition:'100% Beef', desc:'Raw beef meat, beef fats, beef innards, liver, trachea, cartilage. For dogs with chicken sensitivity.', slug:'supero-pure-beef', accent:'gold' },
  { emoji:'🐷', name:'Supero Pure Pork', tag:'Single Protein', price:145, composition:'100% Pork', desc:'Raw pork meat, pork fats, pork soft cartilage, whole offal, pork red offals.', slug:'supero-pure-pork', accent:'gold' },
  { emoji:'🛡️', name:'Supero #BS', tag:'Bully Sensitive', price:175, composition:'100% Beef Lean + Veal', desc:'Veal, beef liver, green tripe, spleen, pancreas, kidney, lungs, trachea, soft cartilage.', slug:'supero-bs', accent:'amber' },
  { emoji:'🐇', name:'Supero RABEEF', tag:'Novel Protein', price:180, composition:'80% Rabbit · 20% Beef', desc:'Ultra-lean exotic protein blend. Perfect for allergy-prone dogs needing a novel protein source.', slug:'supero-rabeef', accent:'gold' },
  { emoji:'🐱', name:'Supero Cat Sensitive', tag:'For Cats', price:170, composition:'80% Rabbit · 20% Beef', desc:'Specially formulated for feline nutrition. Natural raw diet for cats of all breeds.', slug:'supero-cat-sensitive', accent:'purple' },
];

const TREATS = [
  { emoji:'🦴', name:'Chew Bone', price:220, unit:'/ pc', desc:'Raw beef bone with marrow. Natural dental chew.' },
  { emoji:'🍖', name:'Beef Trachea Jerky', price:200, unit:'/ pack', desc:'Natural glucosamine source. Supports joint health.' },
  { emoji:'🥓', name:'Pork Liver Bites', price:85, unit:'/ pack', desc:'High-protein training treats. Vitamin A-rich.' },
];

const BENEFITS = [
  { icon:'🦷', title:'Cleaner Teeth & Fresher Breath' },
  { icon:'⚖️', title:'Better Weight Control' },
  { icon:'🫀', title:'Improved Digestion' },
  { icon:'🌿', title:'Reduced Allergy Symptoms' },
  { icon:'⚡', title:'More Energy & Stamina' },
  { icon:'🐾', title:'Better Reproductive Health' },
  { icon:'💪', title:'Harder, Smaller Stools' },
  { icon:'❤️', title:'Overall Healthier Pet' },
];

const FAQS = [
  { q:'Is it safe for dogs and cats?', a:'YES. SUPERO is 100% safe natural premium raw meal for both cats & dogs. It has NO preservatives or any chemical additives.' },
  { q:'What about bacteria and microorganisms?', a:"Dogs & cats have highly acidic digestive systems designed to eliminate microbes. Their digestive functions are built for raw food — unlike humans." },
  { q:'Is it only for large breeds?', a:'NO. SUPERO is for ALL breeds — small and large. Safe for both dogs and cats of any size.' },
  { q:'How much do I feed per day?', a:'Dogs: 3–4% of current body weight per day. Cats: 2–3% of body weight per day. Split into 2–3 meals for puppies/kittens, 1–2 meals for adults.' },
  { q:'How long can I store Supero?', a:'Unopened pack in freezer: 1 year. Opened pack in freezer: 7 days. Opened pack in chiller: 4 days. Never leave raw food at room temperature.' },
];

const STEPS = [
  { day:1, pct:10, raw:'10%', kibble:'90%' },
  { day:2, pct:20, raw:'20%', kibble:'80%' },
  { day:3, pct:40, raw:'40%', kibble:'60%' },
  { day:4, pct:60, raw:'60%', kibble:'40%' },
  { day:5, pct:75, raw:'75%', kibble:'25%' },
  { day:6, pct:90, raw:'90%', kibble:'10%' },
  { day:7, pct:100, raw:'100%', kibble:'0%' },
];

const peso = n => `₱${n}`;

export default function HomePage() {
  return (
    <div className="bg-[#060606] text-[#F2EDE4] overflow-x-hidden">

      {/* ANNOUNCEMENT BAR */}
      <div className="bg-[#C9A84C] text-black text-xs font-bold text-center py-2.5 tracking-widest uppercase">
        Fresh batch available daily · Same-day delivery Metro Manila &amp; Cavite via Lalamove
      </div>

      {/* HERO */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_0%,#1C1000,transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{backgroundImage:`url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9A84C' fill-opacity='1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`}} />
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-[#C9A84C]/60 text-[10px] font-black tracking-[5px] uppercase mb-5">Isang Magandang Araw Mga Boss Amo</p>
          <h1 className="text-[clamp(40px,9vw,96px)] font-black leading-[1.0] tracking-tight mb-6"
            style={{fontFamily:"'Playfair Display',Georgia,serif",
              background:'linear-gradient(135deg,#fff 20%,#E8C97A 50%,#C9A84C 65%,#fff 85%)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
            The Ancient<br />Modern Natural<br />Diet
          </h1>
          <p className="text-white/40 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-3">
            An ancient modern natural diet that will delight your furbabies.
          </p>
          <p className="text-white/25 text-sm mb-10">100% natural · Zero preservatives · Zero fillers · Fresh from Amadeo, Cavite</p>
          <div className="flex gap-4 justify-center flex-wrap mb-16">
            <Link href="/shop"
              className="bg-[#C9A84C] hover:bg-[#E8C97A] active:scale-95 text-black font-black px-9 py-4 rounded-full text-sm tracking-wide transition-all hover:-translate-y-0.5 shadow-lg shadow-[#C9A84C]/20">
              SHOP NOW →
            </Link>
            <Link href="#products"
              className="border border-[#C9A84C]/30 hover:border-[#C9A84C]/70 text-[#C9A84C] font-bold px-9 py-4 rounded-full text-sm transition-all hover:bg-[#C9A84C]/8">
              See Products
            </Link>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#C9A84C]/10 rounded-2xl overflow-hidden border border-[#C9A84C]/10 max-w-2xl mx-auto">
            {[['2.3M','Facebook Followers'],['100%','All Natural'],['0','Preservatives'],['9AM–11PM','Open Daily']].map(([v,l])=>(
              <div key={l} className="bg-[#0A0800] px-6 py-5 text-center">
                <div className="text-[#C9A84C] font-black text-xl mb-0.5" style={{fontFamily:'Georgia,serif'}}>{v}</div>
                <div className="text-white/30 text-[10px] tracking-wider uppercase">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN PRODUCTS */}
      <section id="products" className="max-w-6xl mx-auto px-5 py-20">
        <div className="flex items-end justify-between mb-3 flex-wrap gap-4">
          <div>
            <p className="text-[#C9A84C] text-[10px] font-black tracking-[4px] uppercase mb-3">Protein Products</p>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight" style={{fontFamily:'Georgia,serif'}}>
              Supero Premium<br />Raw Food Lineup
            </h2>
          </div>
          <Link href="/shop" className="text-[#C9A84C] text-sm font-semibold hover:underline whitespace-nowrap">
            View all products →
          </Link>
        </div>
        <p className="text-white/35 mb-12 max-w-lg">BARF-compliant. Safe for all breeds, all ages. Dogs AND cats. NET WEIGHT: 1kg per pack.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MAIN_PRODUCTS.map(p => (
            <Link key={p.slug} href={`/product/${p.slug}`}
              className={`group relative bg-[#0D0D0D] rounded-2xl p-6 border transition-all hover:-translate-y-1 hover:shadow-xl
                ${p.accent==='amber' ? 'border-amber-900/20 hover:border-amber-600/40 hover:shadow-amber-900/10' :
                  p.accent==='purple' ? 'border-purple-900/20 hover:border-purple-600/40 hover:shadow-purple-900/10' :
                  'border-[#C9A84C]/10 hover:border-[#C9A84C]/40 hover:shadow-[#C9A84C]/5'}`}>
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{p.emoji}</span>
                <span className={`text-[10px] font-black tracking-[2px] uppercase px-3 py-1 rounded-full
                  ${p.accent==='amber' ? 'bg-amber-900/30 text-amber-400' :
                    p.accent==='purple' ? 'bg-purple-900/30 text-purple-400' :
                    'bg-[#C9A84C]/10 text-[#C9A84C]'}`}>
                  {p.tag}
                </span>
              </div>
              <h3 className="text-white font-black text-lg mb-1 leading-snug">{p.name}</h3>
              <p className={`text-xs font-bold mb-3 tracking-wide
                ${p.accent==='amber' ? 'text-amber-500' : p.accent==='purple' ? 'text-purple-400' : 'text-[#C9A84C]/70'}`}>
                {p.composition}
              </p>
              <p className="text-white/35 text-sm leading-relaxed mb-5">{p.desc}</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                  <div className="text-white font-black text-2xl" style={{fontFamily:'Georgia,serif'}}>{peso(p.price)}</div>
                  <div className="text-white/25 text-xs">per 1 kg pack</div>
                </div>
                <div className="bg-[#C9A84C] group-hover:bg-[#E8C97A] text-black text-xs font-black px-4 py-2 rounded-full transition-colors">
                  Add to Cart
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TREATS */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <p className="text-[#C9A84C] text-[10px] font-black tracking-[4px] uppercase mb-4">Supero Treats</p>
        <h2 className="text-3xl font-black text-white mb-8" style={{fontFamily:'Georgia,serif'}}>Natural Chews & Treats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TREATS.map(t => (
            <Link key={t.name} href="/shop/treats"
              className="flex items-center gap-5 bg-[#0D0D0D] border border-[#C9A84C]/8 hover:border-[#C9A84C]/30 rounded-2xl p-5 transition-all hover:-translate-y-0.5">
              <span className="text-3xl flex-shrink-0">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm mb-0.5">{t.name}</h3>
                <p className="text-white/30 text-xs">{t.desc}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[#C9A84C] font-black text-lg">{peso(t.price)}</div>
                <div className="text-white/25 text-[10px]">{t.unit}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20 px-5 bg-[radial-gradient(ellipse_120%_60%_at_50%_50%,#100C00,#060606)]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#C9A84C] text-[10px] font-black tracking-[4px] uppercase mb-4 text-center">Why Raw Feeding</p>
          <h2 className="text-4xl font-black text-white text-center mb-14" style={{fontFamily:'Georgia,serif'}}>
            Supero Raw Feeding Benefits
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {BENEFITS.map(b => (
              <div key={b.title} className="bg-[#0A0800]/80 border border-[#C9A84C]/8 rounded-2xl p-6 text-center hover:border-[#C9A84C]/25 transition-colors">
                <span className="text-3xl block mb-3">{b.icon}</span>
                <p className="text-white/70 text-sm font-semibold leading-snug">{b.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEEDING GUIDE */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <p className="text-[#C9A84C] text-[10px] font-black tracking-[4px] uppercase mb-4">How Much to Feed</p>
        <h2 className="text-4xl font-black text-white mb-3" style={{fontFamily:'Georgia,serif'}}>Daily Feeding Guide</h2>
        <p className="text-white/35 mb-10 max-w-lg">Feed 3–4% of your dog's body weight per day. For cats, feed 2–3% of body weight. Split into 2–3 meals for puppies and kittens, 1–2 meals for adults.</p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Dogs */}
          <div className="bg-[#0A0800] border border-[#C9A84C]/15 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-1 flex items-center gap-2">🐕 For Dogs</h3>
            <p className="text-[#C9A84C] text-xs mb-5">Feed 3–4% of body weight per day</p>
            <div className="grid grid-cols-2 gap-2">
              {[['2kg dog','60–80g'],['5kg dog','150–200g'],['10kg dog','300–400g'],['15kg dog','450–600g'],['20kg dog','600–800g'],['30kg dog','900g–1.2kg'],['40kg dog','1.2–1.6kg'],['50kg dog','1.5–2kg']].map(([d,a])=>(
                <div key={d} className="flex justify-between bg-[#C9A84C]/4 border border-[#C9A84C]/8 rounded-xl px-4 py-2.5 hover:bg-[#C9A84C]/10 transition-colors">
                  <span className="text-xs text-white/40">{d}</span>
                  <span className="text-xs font-bold text-[#C9A84C]">{a}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Cats */}
          <div className="bg-[#0A0800] border border-[#C9A84C]/15 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-1 flex items-center gap-2">🐱 For Cats</h3>
            <p className="text-[#C9A84C] text-xs mb-5">Feed 2–3% of body weight per day</p>
            <div className="grid grid-cols-2 gap-2">
              {[['1kg cat','20–30g'],['2kg cat','40–60g'],['3kg cat','60–90g'],['4kg cat','80–120g'],['5kg cat','100–150g'],['6kg cat','120–180g'],['7kg cat','140–210g'],['8kg cat','160–240g']].map(([c,a])=>(
                <div key={c} className="flex justify-between bg-[#C9A84C]/4 border border-[#C9A84C]/8 rounded-xl px-4 py-2.5 hover:bg-[#C9A84C]/10 transition-colors">
                  <span className="text-xs text-white/40">{c}</span>
                  <span className="text-xs font-bold text-[#C9A84C]">{a}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-[#C9A84C]/8 rounded-xl p-4 text-xs text-white/50 leading-relaxed">
              <strong className="text-white/70">Storage:</strong> Unopened (freezer) = 1 year · Opened (freezer) = 7 days · Opened (chiller) = 4 days
            </div>
          </div>
        </div>
      </section>

      {/* 7-STEP TRANSITION */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <p className="text-[#C9A84C] text-[10px] font-black tracking-[4px] uppercase mb-4">Switching Guide</p>
        <h2 className="text-4xl font-black text-white mb-3" style={{fontFamily:'Georgia,serif'}}>7-Step Kibble to Raw Transition</h2>
        <p className="text-white/35 mb-10 max-w-lg">Mix Supero into your pet's current kibble gradually. Start at 10% Supero and increase every day. Continue each ratio for 3–7 days for sensitive stomachs.</p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {STEPS.map(s => (
            <div key={s.day}
              className={`rounded-2xl p-4 text-center border transition-all
                ${s.pct===100 ? 'border-[#C9A84C]/50 bg-[#140F00]' : 'border-[#C9A84C]/8 bg-[#0D0D0D] hover:border-[#C9A84C]/25'}`}>
              <div className="text-[#C9A84C] font-black text-xl mb-1" style={{fontFamily:'Georgia,serif'}}>{s.day}</div>
              <div className="text-white/25 text-[9px] tracking-widest uppercase mb-3">Day {s.day}</div>
              <div className={`font-black text-sm ${s.pct===100 ? 'text-[#C9A84C]' : 'text-white/60'}`}>{s.raw}</div>
              <div className="text-white/20 text-[10px]">Supero</div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-3">
                <div className="h-full bg-[#C9A84C] rounded-full transition-all" style={{width:`${s.pct}%`}} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-5 bg-[#080600]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#C9A84C] text-[10px] font-black tracking-[4px] uppercase mb-4 text-center">Common Questions</p>
          <h2 className="text-4xl font-black text-white text-center mb-12" style={{fontFamily:'Georgia,serif'}}>FAQs</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="bg-[#0D0D0D] border border-[#C9A84C]/10 rounded-2xl p-6 hover:border-[#C9A84C]/25 transition-colors">
                <h3 className="text-white font-bold text-sm mb-2 flex items-start gap-3">
                  <span className="text-[#C9A84C] font-black flex-shrink-0">Q</span>
                  {f.q}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed pl-5">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-6 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_100%,#1C1400,transparent)]" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 border border-[#C9A84C]/25 text-[#C9A84C] text-[10px] font-black tracking-[2px] uppercase px-5 py-2.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-pulse" />
            Open daily 9AM–11PM
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight" style={{fontFamily:'Georgia,serif'}}>
            Feed them<br />the real thing.
          </h2>
          <p className="text-white/40 text-base mb-10">Delivered fresh from Purok 4, Brgy Bucal, Amadeo, Cavite.<br />Same-day Lalamove delivery available.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/shop"
              className="bg-[#C9A84C] hover:bg-[#E8C97A] active:scale-95 text-black font-black px-10 py-4 rounded-full text-sm tracking-wide transition-all hover:-translate-y-0.5 shadow-lg shadow-[#C9A84C]/20">
              ORDER NOW →
            </Link>
            <a href="https://www.facebook.com/superodogfarm" target="_blank" rel="noopener noreferrer"
              className="border border-[#C9A84C]/30 hover:border-[#C9A84C]/70 text-[#C9A84C] font-bold px-10 py-4 rounded-full text-sm transition-all">
              @superodogfarm ↗
            </a>
          </div>
          <div className="mt-12 text-white/20 text-xs tracking-widest uppercase">
            Manufactured by Supero Dog Farm · Amadeo, Cavite 4119
          </div>
        </div>
      </section>

    </div>
  );
}
