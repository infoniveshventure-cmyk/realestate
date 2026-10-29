import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function OfflinePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/20 flex items-center justify-center text-accent text-2xl font-bold">
            ⚡
          </div>
          <h1 className="text-3xl font-serif font-bold text-text-dark mb-3">You are Offline</h1>
          <p className="text-text-grey text-sm mb-6 leading-relaxed">
            It looks like your device is disconnected from the internet. Saved properties and cached pages are still accessible.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/saved-projects"
              className="px-6 py-3 bg-accent text-white rounded-xl font-medium shadow-md hover:bg-accent/90 transition-all text-sm"
            >
              View Saved Properties
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-text-dark/10 text-text-dark rounded-xl font-medium hover:bg-text-dark/15 transition-all text-sm"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
