'use client';

import { useState } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    subject: '',
    messageType: 'General',
    propertyType: '',
    budgetRange: '',
    message: '',
  });

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (!formData.fullName.trim() || !formData.mobileNumber.trim()) {
      setErrorMessage('Full name and mobile number are required.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          mobileNumber: formData.mobileNumber.trim(),
          email: formData.email.trim() || undefined,
          propertyType: formData.propertyType || undefined,
          budgetRange: formData.budgetRange || undefined,
          message: `[${formData.messageType}${formData.subject ? ` - ${formData.subject}` : ''}] ${formData.message}`,
          source: 'HomepageForm',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setFormData({
          fullName: '',
          mobileNumber: '',
          email: '',
          subject: '',
          messageType: 'General',
          propertyType: '',
          budgetRange: '',
          message: '',
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setErrorMessage(data.error || 'Failed to submit enquiry. Please retry.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setErrorMessage('Network error occurred. Please contact us via phone or WhatsApp.');
    } finally {
      setLoading(false);
    }
  }

  const faqs = [
    {
      q: 'How does Nivesh Ventures verify listed properties?',
      a: 'Every property undergoes institutional legal due diligence, title clearance checks, government land records cross-referencing, and on-ground architectural assessment by senior surveyors.',
    },
    {
      q: 'Can non-resident Indians (NRIs) and global family offices acquire properties through Nivesh?',
      a: 'Yes, we provide end-to-end FEMA-compliant acquisition structuring, repatriation advisory, power-of-attorney execution, and digital documentation for international investors.',
    },
    {
      q: 'Are site visits private and accompanied?',
      a: 'All site inspections are private, chauffeur-assisted upon request, and accompanied by senior portfolio directors who provide technical blueprints and master plan walkthroughs.',
    },
    {
      q: 'Do you charge upfront brokerage from buyers for primary landmark developments?',
      a: 'For our developer partner primary representations, zero brokerage is charged to the acquiring client. Bespoke secondary off-market advisory carries transparent, agreed-upon advisory retainers.',
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFBF7] pt-28 sm:pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="font-script text-4xl sm:text-5xl text-[#AA771C] mb-1">Private Consultations</p>
            <h1 className="font-royal text-3xl sm:text-5xl font-black uppercase text-gold-3d tracking-wider mb-3">
              Contact Advisory
            </h1>
            <p className="text-sm sm:text-base text-[#555555] font-light">
              Connect directly with our luxury portfolio directors and property specialists.
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4" />
          </div>

          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <a
              href="tel:+919876543210"
              className="p-5 rounded-3xl bg-white/80 border border-[#E6D5B8] text-center hover:border-[#AA771C] hover:shadow-md transition-all group"
            >
              <span className="text-2xl block mb-1">📞</span>
              <p className="text-xs text-[#888888] font-bold uppercase tracking-wider mb-1">Direct Calling</p>
              <p className="font-royal text-sm font-bold text-[#111111] group-hover:text-[#AA771C]">+91 98765 43210</p>
              <p className="text-[11px] text-[#666666] mt-1">Mon - Sat: 9:00 AM - 8:00 PM</p>
            </a>

            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-3xl bg-white/80 border border-[#E6D5B8] text-center hover:border-[#25D366] hover:shadow-md transition-all group"
            >
              <span className="text-2xl block mb-1">💬</span>
              <p className="text-xs text-[#888888] font-bold uppercase tracking-wider mb-1">WhatsApp Concierge</p>
              <p className="font-royal text-sm font-bold text-[#25D366]">+91 98765 43210</p>
              <p className="text-[11px] text-[#666666] mt-1">Instant Portfolio Dossiers</p>
            </a>

            <a
              href="mailto:info@niveshventures.com"
              className="p-5 rounded-3xl bg-white/80 border border-[#E6D5B8] text-center hover:border-[#AA771C] hover:shadow-md transition-all group"
            >
              <span className="text-2xl block mb-1">✉️</span>
              <p className="text-xs text-[#888888] font-bold uppercase tracking-wider mb-1">Email Advisory</p>
              <p className="font-royal text-xs font-bold text-[#111111] group-hover:text-[#AA771C]">info@niveshventures.com</p>
              <p className="text-[11px] text-[#666666] mt-1">Response within 2 hours</p>
            </a>
          </div>

          {success && (
            <div className="mb-6 p-4 backdrop-blur-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 rounded-2xl text-center font-semibold text-sm">
              Thank you! Your private advisory enquiry has been received. Our team will connect with you shortly.
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 backdrop-blur-md bg-red-500/10 border border-red-500/30 text-red-800 rounded-2xl text-center font-semibold text-sm">
              {errorMessage}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="backdrop-blur-2xl bg-white/75 p-8 sm:p-12 rounded-3xl border border-[#E6D5B8] shadow-[0_15px_45px_rgba(0,0,0,0.06)] space-y-6 mb-12"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                  Full Name <span className="text-[#AA771C]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/90 border border-[#E6D5B8] rounded-2xl text-sm font-medium text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                  Mobile Number <span className="text-[#AA771C]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-white/90 border border-[#E6D5B8] rounded-2xl text-sm font-medium text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="investor@familyoffice.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/90 border border-[#E6D5B8] rounded-2xl text-sm font-medium text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                  Message Type
                </label>
                <select
                  value={formData.messageType}
                  onChange={(e) => setFormData({ ...formData, messageType: e.target.value })}
                  className="w-full px-4 py-3 bg-white/90 border border-[#E6D5B8] rounded-2xl text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                >
                  <option value="General">General Inquiry</option>
                  <option value="Enquiry">Property Acquisition Enquiry</option>
                  <option value="Complaint">Client Support / Service</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                  Property Category
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="w-full px-4 py-3 bg-white/90 border border-[#E6D5B8] rounded-2xl text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                >
                  <option value="">Select Category</option>
                  <option value="Residential">Ultra-Luxury Residential</option>
                  <option value="Commercial">Pre-Leased Commercial</option>
                  <option value="Plot">Architectural Estate / Plot</option>
                  <option value="Villa">Private Boutique Villa</option>
                  <option value="Apartment">Sky Penthouse / Apartment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                  Investment Allocation
                </label>
                <select
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                  className="w-full px-4 py-3 bg-white/90 border border-[#E6D5B8] rounded-2xl text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                >
                  <option value="">Select Range</option>
                  <option value="Below 50L">Under ₹50 Lakhs</option>
                  <option value="50L-1Cr">₹50 Lakhs - ₹1 Crore</option>
                  <option value="1Cr-3Cr">₹1 Crore - ₹3 Crores</option>
                  <option value="Above 3Cr">Above ₹3 Crores (HNIs)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
                Advisory Notes & Requirements
              </label>
              <textarea
                rows={4}
                placeholder="Share your specific location preference, expected timelines, or bespoke asset requirements..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-white/90 border border-[#E6D5B8] rounded-2xl text-sm font-medium text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-[0_6px_25px_rgba(212,175,55,0.45)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 border border-white/60 disabled:opacity-50"
            >
              {loading ? 'Submitting Enquiry...' : 'Schedule Private Advisory Session →'}
            </button>
          </form>

          {/* Interactive FAQ Accordion */}
          <div className="backdrop-blur-2xl bg-white/75 p-8 sm:p-10 rounded-3xl border border-[#E6D5B8] shadow-sm mb-12">
            <h2 className="font-royal text-xl sm:text-2xl font-bold uppercase text-[#111111] mb-6 text-center">
              Frequently Addressed Inquiries
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-[#E6D5B8] rounded-2xl overflow-hidden bg-white/60">
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-[#111111] hover:text-[#AA771C] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-[#AA771C] font-mono text-base">{activeFaq === idx ? '−' : '+'}</span>
                  </button>
                  {activeFaq === idx && (
                    <div className="p-4 pt-0 text-xs sm:text-sm text-[#555555] font-light leading-relaxed border-t border-[#E6D5B8]/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Headquarters Location & Map */}
          <div className="p-6 rounded-3xl bg-[#FAF6F0] border border-[#E6D5B8] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#AA771C] mb-1">Corporate Headquarters</p>
              <p className="font-royal text-sm font-bold text-[#111111]">Two Horizon Center, DLF Phase 5, Gurugram, India</p>
              <p className="text-xs text-[#666666]">Valet parking available for invited private visits.</p>
            </div>
            <a
              href="https://maps.google.com/?q=Two+Horizon+Center+DLF+Phase+5+Gurugram"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-white border border-[#E6D5B8] text-xs font-bold text-[#AA771C] hover:bg-[#AA771C] hover:text-white transition-all shadow-sm"
            >
              Open Headquarters Map ↗
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
