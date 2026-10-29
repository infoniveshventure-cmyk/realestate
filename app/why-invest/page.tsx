'use client';

import { useState } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';

export default function WhyInvestPage() {
  // Functional Investment Return Calculator
  const [initialAmount, setInitialAmount] = useState<number>(5000000); // 50 Lakhs
  const [annualReturn, setAnnualReturn] = useState<number>(12); // 12%
  const [durationYears, setDurationYears] = useState<number>(5);

  // Compound future value = P * (1 + r/100)^t
  const futureValue = initialAmount * Math.pow(1 + annualReturn / 100, durationYears);
  const estimatedAppreciation = futureValue - initialAmount;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFBF7] pt-28 sm:pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="font-script text-4xl sm:text-5xl text-[#AA771C] mb-1">Generational Wealth</p>
            <h1 className="font-royal text-3xl sm:text-5xl font-black uppercase text-gold-3d tracking-wider mb-4">
              Why Invest in Real Estate?
            </h1>
            <p className="text-sm sm:text-base text-[#555555] font-light">
              Real estate remains the world's most resilient wealth preservation and capital growth vehicle.
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4" />
          </div>

          {/* Investment Calculator Widget */}
          <div className="backdrop-blur-2xl bg-white/80 rounded-3xl border border-[#E6D5B8] p-8 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.06)] mb-12">
            <div className="text-center max-w-md mx-auto mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#AA771C]">Financial Modeling</span>
              <h2 className="font-royal text-xl sm:text-2xl font-black uppercase text-[#111111]">
                Compound Investment Calculator
              </h2>
              <p className="text-xs text-[#666666] mt-1">
                Estimate prospective asset appreciation based on historical micro-market yields.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-2">
                  Initial Allocation: ₹{(initialAmount / 100000).toFixed(0)} Lakhs
                </label>
                <input
                  type="range"
                  min={1000000}
                  max={50000000}
                  step={500000}
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(Number(e.target.value))}
                  className="w-full accent-[#AA771C]"
                />
                <span className="text-[10px] text-[#888888]">₹10 Lakhs to ₹5 Crores</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-2">
                  Expected Annual Return: {annualReturn}%
                </label>
                <input
                  type="range"
                  min={6}
                  max={24}
                  step={0.5}
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  className="w-full accent-[#AA771C]"
                />
                <span className="text-[10px] text-[#888888]">Historical 8% - 18%</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-2">
                  Holding Horizon: {durationYears} Years
                </label>
                <input
                  type="range"
                  min={1}
                  max={15}
                  step={1}
                  value={durationYears}
                  onChange={(e) => setDurationYears(Number(e.target.value))}
                  className="w-full accent-[#AA771C]"
                />
                <span className="text-[10px] text-[#888888]">1 to 15 Years</span>
              </div>
            </div>

            {/* Calculations Result */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-[#FFFBF7] border border-[#E6D5B8] text-center">
              <div>
                <p className="text-xs text-[#888888] font-bold uppercase tracking-wider mb-1">
                  Estimated Future Portfolio Value
                </p>
                <p className="font-royal text-2xl sm:text-3xl font-black text-[#AA771C]">
                  ₹{(futureValue / 10000000).toFixed(2)} Crores
                </p>
                <p className="text-[10px] text-[#666666]">
                  (₹{Math.round(futureValue).toLocaleString('en-IN')})
                </p>
              </div>

              <div>
                <p className="text-xs text-[#888888] font-bold uppercase tracking-wider mb-1">
                  Estimated Capital Gain (Growth)
                </p>
                <p className="font-royal text-2xl sm:text-3xl font-black text-emerald-700">
                  +₹{(estimatedAppreciation / 10000000).toFixed(2)} Crores
                </p>
                <p className="text-[10px] text-[#666666]">
                  (₹{Math.round(estimatedAppreciation).toLocaleString('en-IN')})
                </p>
              </div>
            </div>

            <p className="text-[11px] text-[#888888] text-center mt-4">
              * Note: Projections are mathematical compounding estimates for illustrative purposes only and do not constitute guaranteed returns or financial advice.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                title: 'Tangible Asset Protection',
                desc: 'Real estate is a physical, tangible asset providing sovereign title rights, security, and generational permanence.',
              },
              {
                title: 'Inflation-Hedging Performance',
                desc: 'Property valuations and prime commercial lease escalations naturally outpace inflation, safeguarding real purchasing power.',
              },
              {
                title: 'Structured Leverage Potential',
                desc: 'Acquire large-scale architectural landmarks with favorable sovereign mortgage ratios and structured institutional financing.',
              },
              {
                title: 'Predictable Annuity & Yields',
                desc: 'Earn quarterly rental distributions from verified Grade-A tenants while the underlying asset appreciates exponentially.',
              },
              {
                title: 'Tax Optimization',
                desc: 'Eligible deductions on investment interest, municipal property duties, capital reinvestment under sovereign tax statutes.',
              },
              {
                title: 'Asymmetric Portfolio Diversification',
                desc: 'Real estate maintains low correlation to volatile equities and digital assets, reducing overall portfolio drawdown risk.',
              },
            ].map((item, idx) => (
              <section key={idx} className="bg-white rounded-3xl border border-[#E6D5B8] p-8 shadow-sm">
                <h2 className="font-royal text-xl sm:text-2xl font-bold uppercase text-[#111111] mb-2">{item.title}</h2>
                <p className="text-[#555555] font-light leading-relaxed text-sm sm:text-base">{item.desc}</p>
              </section>
            ))}
          </div>

          {/* Why Nivesh Ventures - Luxury Liquid Glass Showcase */}
          <section className="mt-16 backdrop-blur-2xl bg-white/70 rounded-3xl border border-[#E6D5B8] p-10 sm:p-14 shadow-[0_15px_45px_rgba(0,0,0,0.06)]">
            <div className="text-center max-w-xl mx-auto mb-10">
              <p className="font-script text-3xl sm:text-4xl text-[#AA771C] mb-1">Distinctive Advantages</p>
              <h2 className="font-royal text-3xl sm:text-5xl font-black uppercase text-gold-3d tracking-wider">
                Why Nivesh Ventures?
              </h2>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              {[
                { title: 'Verified & Transparent Projects', desc: '100% legal title-clear documentation and institutional-grade due diligence.' },
                { title: 'Expert Investment Guidance', desc: 'Quantitative ROI models and micro-market capital appreciation forecasts.' },
                { title: 'Complete Legal Support', desc: 'End-to-end registration, conveyancing, and sovereign compliance oversight.' },
                { title: 'Proven Track Record', desc: 'Decade of landmark project deliveries and satisfied family office portfolios.' },
                { title: 'Dedicated Customer Care', desc: '24/7 dedicated relationship directors and private concierge services.' },
                { title: 'Multi-Property Portfolio', desc: 'Access to prime residential villas, penthouses, and pre-leased commercial assets.' },
              ].map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white/80 border border-[#E6D5B8] shadow-sm hover:border-[#D4AF37] hover:shadow-[0_8px_25px_rgba(212,175,55,0.18)] transition-all duration-300"
                >
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFE79A] to-[#D4AF37] text-black font-black flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                    ✓
                  </span>
                  <div>
                    <h3 className="font-royal text-sm sm:text-base font-bold text-[#111111] uppercase tracking-wide">
                      {point.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#555555] font-light mt-0.5">
                      {point.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/contact"
                className="inline-block px-8 py-3.5 bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-[0_4px_20px_rgba(212,175,55,0.45)] hover:scale-105 transition-all duration-300 border border-white/50"
              >
                Start Your Investment Journey →
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
