import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-serif font-bold text-text-dark mb-4">404</h1>
          <p className="text-2xl text-text-grey mb-8">Page not found</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-opacity-90"
          >
            Go Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
