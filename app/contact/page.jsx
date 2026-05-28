import Link from 'next/link';

export const metadata = { title: 'Contact — Flowtech.ph' };

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Get in touch</p>
      <h1 className="text-4xl font-semibold text-gray-900 mb-4">Let's talk about your project.</h1>
      <p className="text-gray-500 mb-12 max-w-lg">The best way to start is through our discovery form. If you have a quick question, use the contact form below.</p>
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-900 text-white rounded-2xl p-8">
          <h2 className="font-semibold text-lg mb-2">Start a project</h2>
          <p className="text-gray-400 text-sm mb-6">Fill out our discovery questionnaire so we can map your requirements and prepare an accurate proposal.</p>
          <Link href="/discovery" className="inline-block bg-white text-gray-900 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors">Discovery form →</Link>
        </div>
        <div className="border border-gray-100 rounded-2xl p-8">
          <h2 className="font-semibold text-gray-900 mb-4">Quick message</h2>
          <div className="space-y-3">
            <input type="text" placeholder="Your name" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
            <input type="email" placeholder="Email address" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400" />
            <textarea placeholder="Your message" rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-gray-400" />
            <button className="w-full bg-gray-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-700 transition-colors">Send message</button>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-8 grid md:grid-cols-3 gap-6 text-sm text-gray-500">
        <div><p className="font-medium text-gray-900 mb-1">Location</p><p>Amadeo, Cavite, Philippines</p></div>
        <div><p className="font-medium text-gray-900 mb-1">Response time</p><p>Within 1–2 business days</p></div>
        <div><p className="font-medium text-gray-900 mb-1">Project types</p><p>Web dev, systems, automation</p></div>
      </div>
    </div>
  );
}
