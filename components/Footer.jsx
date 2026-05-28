import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 font-medium text-gray-900 mb-3">
              <div className="w-6 h-6 bg-blue-50 rounded-md flex items-center justify-center">
                <Zap size={12} className="text-blue-600"/>
              </div>
              flowtech.ph
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">A TYG Services company.<br/>Amadeo, Cavite, PH.</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Services</p>
            {['Custom development','Automation','Systems integration','Retainer support'].map(s=>(
              <Link key={s} href="/services" className="block text-sm text-gray-500 hover:text-gray-900 mb-1.5">{s}</Link>
            ))}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Company</p>
            {[['About','/about'],['Work','/work'],['Blog','/blog'],['Contact','/contact']].map(([l,h])=>(
              <Link key={l} href={h} className="block text-sm text-gray-500 hover:text-gray-900 mb-1.5">{l}</Link>
            ))}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Start here</p>
            <Link href="/discovery" className="block text-sm text-blue-600 hover:underline mb-1.5">Discovery form</Link>
            <Link href="/contact" className="block text-sm text-gray-500 hover:text-gray-900 mb-1.5">Contact us</Link>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6 flex justify-between items-center text-xs text-gray-400">
          <span>© {new Date().getFullYear()} Flowtech.ph — TYG Services</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-600">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
