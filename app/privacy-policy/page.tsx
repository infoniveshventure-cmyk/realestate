import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-5xl font-serif font-bold text-text-dark mb-8">Privacy Policy</h1>

          <div className="bg-white rounded-lg border border-ivory p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-3">Introduction</h2>
              <p className="text-text-grey leading-relaxed">
                Nivesh Ventures ("we," "us," or "our") operates the website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our website and the choices you have associated with that data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-3">Information Collection and Use</h2>
              <p className="text-text-grey leading-relaxed mb-3">
                We collect several different types of information for various purposes to provide and improve our service to you.
              </p>
              <ul className="space-y-2 text-text-grey list-disc list-inside">
                <li>Personal identification information (name, email address, phone number)</li>
                <li>Usage data (pages visited, time spent, clickstream data)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-3">Security of Data</h2>
              <p className="text-text-grey leading-relaxed">
                The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text-dark mb-3">Contact Us</h2>
              <p className="text-text-grey">
                If you have any questions about this Privacy Policy, please contact us at{' '}
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
