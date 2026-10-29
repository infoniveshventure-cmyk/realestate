'use client';

import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFBF7] pt-28 sm:pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="font-script text-4xl sm:text-5xl text-[#AA771C] mb-1">Our Heritage & Creed</p>
            <h1 className="font-royal text-3xl sm:text-5xl font-black uppercase text-gold-3d tracking-wider mb-4">
              About Nivesh Ventures
            </h1>
            <p className="text-sm sm:text-base text-[#555555] font-light">
              Pioneering high-trust architectural acquisitions and landmark real estate advisory.
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4" />
          </div>

          <section className="backdrop-blur-2xl bg-white/70 rounded-3xl border border-[#E6D5B8] p-8 sm:p-12 space-y-10 shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-dark mb-4">Our Mission</h2>
              <p className="text-text-grey text-base sm:text-lg leading-relaxed">
                At Nivesh Ventures, we believe in making premium real estate accessible to discerning investors. Our mission is to connect verified architectural properties with conscious investors who value transparency, institutional quality, and sustainable wealth compounding.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-dark mb-4">Our Vision</h2>
              <p className="text-text-grey text-base sm:text-lg leading-relaxed">
                To be India's premier high-trust real estate discovery and investment advisory platform by providing verified legal due diligence, transparent sovereign transactions, and bespoke relationship concierge services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-dark mb-4">Our Values</h2>
              <ul className="space-y-3 text-text-grey text-sm sm:text-base">
                <li className="flex gap-3">
                  <span className="text-accent font-bold">✓</span>
                  <span><strong>Transparency:</strong> 100% verified documentation and clear legal titles.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold">✓</span>
                  <span><strong>Integrity:</strong> Honest fiduciary guidance at every single milestone.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold">✓</span>
                  <span><strong>Excellence:</strong> Handpicked architectural icons and personalized advisory.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold">✓</span>
                  <span><strong>Growth:</strong> Together We Grow — aligning client prosperity with our legacy.</span>
                </li>
              </ul>
            </div>

            {/* Advisory Leadership & Team */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-dark mb-4">Advisory Board & Leadership</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#FFFBF7] border border-[#E6D5B8]">
                  <p className="font-royal text-base font-bold text-[#111111]">Advisory Directors</p>
                  <p className="text-xs text-[#AA771C] font-semibold uppercase tracking-wider mb-2">Prime Acquisitions</p>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    Over 20+ years of institutional real estate underwriting across Mumbai, NCR, and coastal luxury micro-markets.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FFFBF7] border border-[#E6D5B8]">
                  <p className="font-royal text-base font-bold text-[#111111]">Legal & Title Counsel</p>
                  <p className="text-xs text-[#AA771C] font-semibold uppercase tracking-wider mb-2">Due Diligence Team</p>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    Dedicated property advocates verifying municipal sanctions, land titles, and RERA compliance.
                  </p>
                </div>
              </div>
            </div>

            {/* Corporate Milestones */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-dark mb-4">Company Milestones</h2>
              <div className="space-y-3 border-l-2 border-[#D4AF37] pl-4 sm:pl-6">
                <div>
                  <span className="font-mono text-xs font-bold text-[#AA771C]">2018</span>
                  <p className="font-semibold text-sm text-[#111111]">Inception & Founding</p>
                  <p className="text-xs text-[#666666]">Established with the vision of institutionalizing high-trust real estate discovery.</p>
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-[#AA771C]">2022</span>
                  <p className="font-semibold text-sm text-[#111111]">Portfolio Milestone: ₹500+ Cr</p>
                  <p className="text-xs text-[#666666]">Facilitated landmark luxury acquisitions for family offices and discerning HNIs.</p>
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-[#AA771C]">2026</span>
                  <p className="font-semibold text-sm text-[#111111]">Digital 3D Interactive Platform</p>
                  <p className="text-xs text-[#666666]">Pioneered immersive cinematic walkthroughs and verified transparent discovery.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-dark mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-[#888888] font-bold uppercase tracking-wider mb-1">Email</p>
                  <a href="mailto:info@niveshventures.com" className="text-accent font-medium hover:underline">
                    info@niveshventures.com
                  </a>
                </div>
                <div>
                  <p className="text-xs text-[#888888] font-bold uppercase tracking-wider mb-1">Phone</p>
                  <a href="tel:+919876543210" className="text-accent font-medium hover:underline">
                    +91 98765 43210
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
