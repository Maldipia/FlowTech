import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10">
      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-[#C9A84C] rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xs">S</span>
              </div>
              <span className="text-white font-bold tracking-wider">SUPERO</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">Premium raw pet food, grooming, and supplements. Fresh from Amadeo, Cavite.</p>
          </div>
          <div>
            <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-4">Shop</p>
            {[['Raw Food','/shop/raw-food'],['Grooming','/shop/grooming'],['Supplements','/shop/supplements'],['All Products','/shop']].map(([l,h])=>(
              <Link key={l} href={h} className="block text-sm text-white/50 hover:text-white mb-2 transition-colors">{l}</Link>
            ))}
          </div>
          <div>
            <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-4">Marketplace</p>
            {[['Find a Puppy','/marketplace'],['Become a Breeder','/become-a-breeder']].map(([l,h])=>(
              <Link key={l} href={h} className="block text-sm text-white/50 hover:text-white mb-2 transition-colors">{l}</Link>
            ))}
          </div>
          <div>
            <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-4">Account</p>
            {[['My Account','/account/dashboard'],['My Orders','/account/dashboard'],['Login','/account/login'],['Register','/account/register']].map(([l,h])=>(
              <Link key={l} href={h} className="block text-sm text-white/50 hover:text-white mb-2 transition-colors">{l}</Link>
            ))}
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <span>© {new Date().getFullYear()} SUPERO. All rights reserved.</span>
          <span>Amadeo, Cavite, Philippines · Same-day delivery Metro Manila</span>
        </div>
      </div>
    </footer>
  );
}
