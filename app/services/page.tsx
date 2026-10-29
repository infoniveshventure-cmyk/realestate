'use client';

import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      title: 'Property Search & Acquisition',
      description: 'Discover verified residential and landmark investments in prime locations with institutional title due diligence.',
      icon: '🏠',
      slug: 'Property Search',
    },
    {
      title: 'Investment Advisory & Wealth Structuring',
      description: 'Strategic allocation modeling, macro-economic yields, and capital appreciation forecasting for HNI portfolios.',
      icon: '📊',
      slug: 'Investment Advisory',
    },
    {
      title: 'Legal Documentation & Title Due Diligence',
      description: 'Complete documentation verification, conveyance deed drafting, and government registry compliance.',
      icon: '⚖️',
      slug: 'Legal Documentation',
    },
    {
      title: 'Financing Support & Private Banking',
      description: 'Bespoke mortgage arrangements, structured private banking facilities, and competitive interest rates.',
      icon: '💼',
      slug: 'Financing Support',
    },
    {
      title: 'Chauffeur-Driven Site Visits',
      description: 'Private escorted property inspections with masterplan blueprints and technical site engineering teams.',
      icon: '🚗',
      slug: 'Site Visits',
    },
    {
      title: 'Post-Purchase Support & Asset Management',
      description: 'Turnkey tenant placement, interior architecture concierge, and ongoing portfolio asset management.',
      icon: '🔑',
      slug: 'Post-Purchase Support',
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFBF7] pt-28 sm:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="font-script text-4xl sm:text-5xl text-[#AA771C] mb-1">Tailored Advisory</p>
            <h1 className="font-royal text-3xl sm:text-5xl font-black uppercase text-gold-3d tracking-wider mb-4">
              Bespoke Real Estate Services
            </h1>
            <p className="text-sm sm:text-base text-[#555555] font-light">
              Comprehensive acquisition, legal structuring, and wealth-acceleration real estate advisory.
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="backdrop-blur-2xl bg-white/70 rounded-3xl border border-[#E6D5B8] p-8 shadow-[0_10px_35px_rgba(0,0,0,0.06)] hover:border-[#D4AF37] hover:shadow-[0_15px_40px_rgba(212,175,55,0.2)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl mb-4 p-3 rounded-2xl bg-[#FFFBF7] inline-block border border-[#E6D5B8]">{service.icon}</div>
                  <h3 className="font-royal text-lg font-bold uppercase text-[#111111] mb-2">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-[#555555] leading-relaxed mb-6">{service.description}</p>
                </div>

                <div>
                  <Link
                    href={`/contact?service=${encodeURIComponent(service.slug)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#AA771C] hover:text-black transition-colors"
                  >
                    Enquire for {service.slug} →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* CTA - Luxury Liquid Glass Card with Black & Gold Stylish Text */}
          <div className="backdrop-blur-2xl bg-white/70 rounded-3xl border border-[#E6D5B8] p-10 sm:p-14 text-center max-w-4xl mx-auto shadow-[0_15px_45px_rgba(0,0,0,0.06)]">
            <p className="font-script text-3xl sm:text-4xl text-[#AA771C] mb-1">Begin Your Advisory</p>
            <h2 className="font-royal text-3xl sm:text-5xl font-black uppercase text-gold-3d tracking-wider mb-4">
              Ready to Begin?
            </h2>
            <p className="text-sm sm:text-base text-[#222222] font-medium max-w-xl mx-auto mb-8 leading-relaxed">
              Let our senior property portfolio directors connect you with off-market landmark estates and high-yield verified investments.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3.5 bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-[0_4px_20px_rgba(212,175,55,0.45)] hover:scale-105 transition-all duration-300 border border-white/50"
            >
              Schedule Private Consultation →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
