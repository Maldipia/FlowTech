import Link from 'next/link';

export const metadata = { title: 'Find a Puppy — SUPERO Marketplace' };

export default function MarketplacePage() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-20 text-center">
      <div className="text-6xl mb-6">🐶</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Find a Puppy</h1>
      <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
        Our puppy marketplace is coming soon. Verified breeders, healthy puppies, and breed trend analytics — all in one place.
      </p>
      <div className="inline-flex items-center gap-2 bg-[#FBF7EE] text-[#C9A84C] text-xs font-semibold px-4 py-2 rounded-full mb-10">
        Coming Soon — Phase 3
      </div>
      <div className="flex items-center justify-center gap-4">
        <Link href="/shop" className="bg-[#0A0A0A] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
          Shop Pet Food
        </Link>
        <Link href="/become-a-breeder" className="border border-gray-200 text-gray-700 px-6 py-3 rounded-xl text-sm font-semibold hover:border-gray-400 transition-colors">
          Register as Breeder
        </Link>
      </div>
    </div>
  );
}
