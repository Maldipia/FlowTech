'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [s, setS] = useState(null); // settings
  const [products, setProducts] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/settings').then(r => r.json()),
      fetch('/api/products').then(r => r.json()),
    ]).then(([sData, pData]) => {
      setS(sData.data || {});
      setProducts(pData.data || []);
    });
  }, []);

  const get = (key, fallback = '') => s?.[key] || fallback;

  const MAIN_PRODUCTS = products.filter(p => p.category === 'raw-food');
  const TREATS = products.filter(p => p.category === 'treats');

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
    { q:'What about bacteria and microorganisms?', a:"Dogs & cats have highly acidic digestive systems designed to eliminate microbes. Their digestive functions are built for raw food." },
    { q:'Is it only for large breeds?', a:'NO. SUPERO is for ALL breeds — small and large. Safe for both dogs and cats of any size.' },
    { q:'How much do I feed per day?', a:'Dogs: 3–4% of current body weight per day. Cats: 2–3% of body weight per day. Split into 2–3 meals for puppies/kittens, 1–2 for adults.' },
    { q:'How long can I store Supero?', a:'Unopened pack in freezer: 1 year. Opened pack in freezer: 7 days. Opened pack in chiller: 4 days. Never leave raw food at room temperature.' },
  ];

  const STEPS = [
    {day:1,pct:10,raw:'10%'},{day:2,pct:20,raw:'20%'},{day:3,pct:40,raw:'40%'},
    {day:4,pct:60,raw:'60%'},{day:5,pct:75,raw:'75%'},{day:6,pct:90,raw:'90%'},
    {day:7,pct:100,raw:'100%'},
  ];

  const peso = n => `₱${Number(n).toLocaleString()}`;
  const heroVideo = get('hero_video_url');

  return (
    <div className="bg-[#060606] text-[#F2EDE4] overflow-x-hidden">
      {/* ANNOUNCEMENT BAR */}
      {get('announcement') && (
        <div className="bg-[#C9A84C] text-black text-xs font-bold text-center py-2.5 tracking-widest uppercase px-4">
          {get('announcement')}
        </div>
      )}

      {/* HERO */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden">
        {heroVideo ? (
          <>
            <video autoPlay muted loop playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-25"
              src={heroVideo} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#060606]/80 via-[#060606]/50 to-[#060606]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_0%,#1C1000,transparent_70%)]" />
            <div className="absolute inset-0 opacity-[0.04]"
              style={{backgroundImage:`url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9A84C' fill-opacity='1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`}} />
          </>
        )}
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-[#C9A84C]/60 text-[10px] font-black tracking-[5px] uppercase mb-5">
            {get('hero_greeting', 'Isang Magandang Araw Mga Boss Amo')}
          </p>
          <h1 className="text-[clamp(40px,9vw,96px)] font-black leading-[1.0] tracking-tight mb-6"
            style={{fontFamily:"'Playfair Display',Georgia,serif",
              background:'linear-gradient(135deg,#fff 20%,#E8C97A 50%,#C9A84C 65%,#fff 85%)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
            {get('hero_title', 'The Ancient Modern Natural Diet').split('\n').map((line, i) => (
              <span key={i}>{line}{i < get('hero_title','').split('\n').length - 1 && <br />}</span>
            ))}
          </h1>
          <p className="text-white/40 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10">
            {get('hero_subtitle', 'An ancient modern natural diet that will delight your furbabies.')}
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-16">
            <Link href="/shop"
              className="bg-[#C9A84C] hover:bg-[#E8C97A] active:scale-95 text-black font-black px-9 py-4 rounded-full text-sm tracking-wide transition-all hover:-translate-y-0.5 shadow-lg shadow-[#C9A84C]/20">
              {get('hero_cta_primary', 'SHOP NOW')} →
            </Link>
            <Link href="#products"
              className="border border-[#C9A84C]/30 hover:border-[#C9A84C]/70 text-[#C9A84C] font-bold px-9 py-4 rounded-full text-sm transition-all hover:bg-[#C9A84C]/8">
              See Products
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-px bg-[#C9A84C]/10 rounded-2xl overflow-hidden border border-[#C9A84C]/10 max-w-lg mx-auto">
            {[[get('stat_1_value','2.3M'), get('stat_1_label','Facebook Followers')],
              [get('stat_2_value','100%'), get('stat_2_label','All Natural')],
              [get('stat_3_value','0'), get('stat_3_label','Preservatives')]].map(([v,l]) => (
              <div key={l} className="bg-[#0A0800] px-4 py-5 text-center">
                <div className="text-[#C9A84C] font-black text-xl mb-0.5" style={{fontFamily:'Georgia,serif'}}>{v}</div>
                <div className="text-white/30 text-[9px] tracking-wider uppercase leading-tight">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="max-w-6xl mx-auto px-5 py-20">
        <p className="text-[#C9A84C] text-[10px] font-black tracking-[4px] uppercase mb-4">Protein Products</p>
        <div className="flex items-end justify-between mb-3 flex-wrap gap-4">
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight" style={{fontFamily:'Georgia,serif'}}>
            Supero Premium<br />Raw Food Lineup
          </h2>
          <Link href="/shop" className="text-[#C9A84C] text-sm font-semibold hover:underline">View all →</Link>
        </div>
        <p className="text-white/35 mb-4 max-w-lg">BARF-compliant. Safe for all breeds, all ages. Dogs AND cats. NET WEIGHT: 1kg per pack.</p>
        <p className="text-[#C9A84C]/40 text-[10px] font-bold tracking-widest uppercase mb-12">{get('open_hours','Open Daily 9AM–11PM')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MAIN_PRODUCTS.map(p => {
            const primaryImg = p.product_images?.find(i => i.is_primary)?.image_url;
            const price = p.product_variants?.[0]?.retail_price;
            const TAG_COLORS = { 'supero-bs':'amber', 'supero-cat-sensitive':'purple', 'supero-rabeef':'gold' };
            const accent = TAG_COLORS[p.slug] || 'gold';
            return (
              <Link key={p.id} href={`/product/${p.slug}`}
                className={`group bg-[#0D0D0D] rounded-2xl overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-xl
                  ${accent==='amber' ? 'border-amber-900/20 hover:border-amber-600/40' :
                    accent==='purple' ? 'border-purple-900/20 hover:border-purple-600/40' :
                    'border-[#C9A84C]/10 hover:border-[#C9A84C]/40'}`}>
                {/* Product image or emoji */}
                <div className="aspect-video bg-[#0A0A0A] overflow-hidden relative">
                  {primaryImg ? (
                    <img src={primaryImg} alt={p.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">{p.emoji || '🥩'}</span>
                    </div>
                  )}
                  <div className={`absolute top-3 right-3 text-[10px] font-black tracking-[2px] uppercase px-2.5 py-1 rounded-full
                    ${accent==='amber' ? 'bg-amber-900/60 text-amber-300' :
                      accent==='purple' ? 'bg-purple-900/60 text-purple-300' :
                      'bg-[#C9A84C]/20 text-[#C9A84C]'}`}>
                    {p.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-white font-black text-base mb-2">{p.name}</h3>
                  {p.description && <p className="text-white/30 text-xs leading-relaxed mb-4 line-clamp-2">{p.description}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-black text-xl" style={{fontFamily:'Georgia,serif'}}>{price ? peso(price) : '—'}</div>
                      <div className="text-white/25 text-[10px]">per 1 kg pack</div>
                    </div>
                    <div className="bg-[#C9A84C] group-hover:bg-[#E8C97A] text-black text-xs font-black px-4 py-2 rounded-full transition-colors">
                      Add to Cart
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* TREATS */}
      {TREATS.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 pb-20">
          <p className="text-[#C9A84C] text-[10px] font-black tracking-[4px] uppercase mb-4">Treats</p>
          <h2 className="text-3xl font-black text-white mb-8" style={{fontFamily:'Georgia,serif'}}>Natural Chews & Treats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TREATS.map(t => (
              <Link key={t.id} href={`/product/${t.slug}`}
                className="flex items-center gap-4 bg-[#0D0D0D] border border-[#C9A84C]/8 hover:border-[#C9A84C]/30 rounded-2xl p-5 transition-all hover:-translate-y-0.5">
                <span className="text-3xl flex-shrink-0">{t.emoji || '🦴'}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm mb-0.5">{t.name}</h3>
                  {t.description && <p className="text-white/30 text-xs line-clamp-1">{t.description}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[#C9A84C] font-black text-base">{t.product_variants?.[0] ? peso(t.product_variants[0].retail_price) : '—'}</div>
                  <div className="text-white/25 text-[10px]">/ pc</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* BENEFITS */}
      <section className="py-20 px-5 bg-[radial-gradient(ellipse_120%_60%_at_50%_50%,#100C00,#060606)]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#C9A84C] text-[10px] font-black tracking-[4px] uppercase mb-4 text-center">Why Raw Feeding</p>
          <h2 className="text-4xl font-black text-white text-center mb-14" style={{fontFamily:'Georgia,serif'}}>Supero Raw Feeding Benefits</h2>
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
        <p className="text-white/35 mb-10 max-w-lg">Feed 3–4% of your dog's body weight per day. For cats, 2–3%. Split into 2–3 meals for puppies, 1–2 for adults.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { label:'🐕 For Dogs', note:'Feed 3–4% of body weight per day', rows:[['2kg','60–80g'],['5kg','150–200g'],['10kg','300–400g'],['15kg','450–600g'],['20kg','600–800g'],['30kg','900g–1.2kg'],['40kg','1.2–1.6kg'],['50kg','1.5–2kg']] },
            { label:'🐱 For Cats', note:'Feed 2–3% of body weight per day', rows:[['1kg','20–30g'],['2kg','40–60g'],['3kg','60–90g'],['4kg','80–120g'],['5kg','100–150g'],['6kg','120–180g'],['7kg','140–210g'],['8kg','160–240g']], storage:true },
          ].map(col => (
            <div key={col.label} className="bg-[#0A0800] border border-[#C9A84C]/15 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-1">{col.label}</h3>
              <p className="text-[#C9A84C] text-xs mb-5">{col.note}</p>
              <div className="grid grid-cols-2 gap-2">
                {col.rows.map(([d,a]) => (
                  <div key={d} className="flex justify-between bg-[#C9A84C]/4 border border-[#C9A84C]/8 rounded-xl px-4 py-2.5 hover:bg-[#C9A84C]/10 transition-colors">
                    <span className="text-xs text-white/40">{d} {col.label.includes('Cat') ? 'cat' : 'dog'}</span>
                    <span className="text-xs font-bold text-[#C9A84C]">{a}</span>
                  </div>
                ))}
              </div>
              {col.storage && (
                <div className="mt-4 bg-[#C9A84C]/8 rounded-xl p-3 text-xs text-white/50 leading-relaxed">
                  <strong className="text-white/70">Storage:</strong> Freezer (unopened) = 1 year · Freezer (opened) = 7 days · Chiller (opened) = 4 days
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7-STEP TRANSITION */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <p className="text-[#C9A84C] text-[10px] font-black tracking-[4px] uppercase mb-4">Switching Guide</p>
        <h2 className="text-4xl font-black text-white mb-3" style={{fontFamily:'Georgia,serif'}}>7-Step Kibble to Raw Transition</h2>
        <p className="text-white/35 mb-10 max-w-lg">Start at 10% Supero + 90% kibble. Increase each day. Continue each ratio for 3–7 days for sensitive stomachs.</p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {STEPS.map(step => (
            <div key={step.day} className={`rounded-2xl p-4 text-center border transition-all
              ${step.pct===100 ? 'border-[#C9A84C]/50 bg-[#140F00]' : 'border-[#C9A84C]/8 bg-[#0D0D0D] hover:border-[#C9A84C]/25'}`}>
              <div className="text-[#C9A84C] font-black text-xl mb-1" style={{fontFamily:'Georgia,serif'}}>{step.day}</div>
              <div className="text-white/25 text-[9px] uppercase tracking-widest mb-3">Day {step.day}</div>
              <div className={`font-black text-sm ${step.pct===100 ? 'text-[#C9A84C]' : 'text-white/60'}`}>{step.raw}</div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-3">
                <div className="h-full bg-[#C9A84C] rounded-full" style={{width:`${step.pct}%`}} />
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
                  <span className="text-[#C9A84C] font-black flex-shrink-0">Q</span>{f.q}
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
            {get('open_hours', 'Open Daily 9AM–11PM')}
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight" style={{fontFamily:'Georgia,serif'}}>
            Feed them<br />the real thing.
          </h2>
          <p className="text-white/40 text-base mb-10">
            Delivered fresh from {get('store_address', 'Amadeo, Cavite')}.<br />
            Same-day Lalamove delivery available.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/shop"
              className="bg-[#C9A84C] hover:bg-[#E8C97A] active:scale-95 text-black font-black px-10 py-4 rounded-full text-sm tracking-wide transition-all hover:-translate-y-0.5 shadow-lg shadow-[#C9A84C]/20">
              ORDER NOW →
            </Link>
            <a href={get('fb_page_url','https://www.facebook.com/superodogfarm')} target="_blank" rel="noopener noreferrer"
              className="border border-[#C9A84C]/30 hover:border-[#C9A84C]/70 text-[#C9A84C] font-bold px-10 py-4 rounded-full text-sm transition-all">
              @superodogfarm ↗
            </a>
          </div>
          <div className="mt-12 text-white/20 text-xs tracking-widest uppercase">
            {get('footer_text', 'Manufactured by Supero Dog Farm · Amadeo, Cavite 4119')}
          </div>
        </div>
      </section>
    </div>
  );
}
