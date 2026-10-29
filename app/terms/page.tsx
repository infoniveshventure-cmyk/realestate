import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-5xl font-serif font-bold text-text-dark mb-8">Terms & Conditions</h1>

          <div className="bg-white rounded-lg border border-ivory p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-3">Agreement to Terms</h2>
              <p className="text-text-grey leading-relaxed">
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-3">Use License</h2>
              <p className="text-text-grey leading-relaxed mb-3">
                Permission is granted to temporarily download one copy of the materials (information or software) on Nivesh Ventures' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="space-y-2 text-text-grey list-disc list-inside">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on the website</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-3">Disclaimer</h2>
              <p className="text-text-grey leading-relaxed">
                The materials on Nivesh Ventures' website are provided "as is". Nivesh Ventures makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-3">Limitations</h2>
              <p className="text-text-grey leading-relaxed">
                In no event shall Nivesh Ventures or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-3">Contact Us</h2>
              <p className="text-text-grey">
                If you have any questions about these Terms & Conditions, please contact us at{' '}
                <a href="mailto:info@niveshshventures.com" className="text-accent hover:underline">
                  info@niveshshventures.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
