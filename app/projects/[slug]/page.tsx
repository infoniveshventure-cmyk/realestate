'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import SaveButton from '@/components/shared/SaveButton';
import CompareButton from '@/components/shared/CompareButton';

export default function ProjectDetailPage() {
  const [slug, setSlug] = useState<string>('');
  const [project, setProject] = useState<any>(null);
  const [relatedProjects, setRelatedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const [enquiryForm, setEnquiryForm] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    budgetRange: '',
    message: '',
    visitDate: '',
    isSiteVisit: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const currentSlug = pathSegments[pathSegments.length - 1];
    setSlug(currentSlug);
  }, []);

  useEffect(() => {
    if (slug) {
      fetchProject();
      recordView();
    }
  }, [slug]);

  async function recordView() {
    try {
      await fetch(`/api/projects/${slug}/views`, { method: 'POST' });
    } catch (e) {
      // Non-blocking view tracker
    }
  }

  async function fetchProject() {
    try {
      const res = await fetch(`/api/projects/${slug}`);
      const data = await res.json();
      if (data.success && data.data) {
        setProject(data.data);
        fetchRelated(data.data.propertyType, data.data.slug);
      }
    } catch (error) {
      console.error('Failed to fetch project:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRelated(propertyType?: string, currentSlug?: string) {
    try {
      const res = await fetch(`/api/projects?limit=4${propertyType ? `&propertyType=${propertyType}` : ''}`);
      const data = await res.json();
      if (data.success && data.data) {
        const filtered = data.data.filter((p: any) => p.slug !== currentSlug).slice(0, 3);
        setRelatedProjects(filtered);
      }
    } catch (e) {
      console.error('Related projects error:', e);
    }
  }

  async function handleEnquirySubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    // Client validation
    if (!enquiryForm.fullName.trim() || !enquiryForm.mobileNumber.trim()) {
      setFeedback({ type: 'error', message: 'Full name and mobile number are required.' });
      setSubmitting(false);
      return;
    }

    try {
      const messageContent = enquiryForm.isSiteVisit
        ? `[Site Visit Request for ${enquiryForm.visitDate || 'Next Available'}] ${enquiryForm.message}`
        : enquiryForm.message;

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: enquiryForm.fullName.trim(),
          mobileNumber: enquiryForm.mobileNumber.trim(),
          email: enquiryForm.email.trim() || undefined,
          budgetRange: enquiryForm.budgetRange || undefined,
          message: messageContent,
          projectId: project?._id,
          projectName: project?.name,
          propertyType: project?.propertyType,
          source: enquiryForm.isSiteVisit ? 'CallbackRequest' : 'ProjectForm',
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setFeedback({
          type: 'success',
          message: enquiryForm.isSiteVisit
            ? 'Site visit appointment scheduled! Our concierge director will confirm shortly.'
            : 'Advisory enquiry submitted successfully! Our luxury director will reach out.',
        });
        setEnquiryForm({
          fullName: '',
          mobileNumber: '',
          email: '',
          budgetRange: '',
          message: '',
          visitDate: '',
          isSiteVisit: false,
        });
      } else {
        setFeedback({ type: 'error', message: result.error || 'Failed to submit enquiry. Please retry.' });
      }
    } catch (error) {
      console.error('Failed to submit:', error);
      setFeedback({ type: 'error', message: 'Network error. Please try again or WhatsApp us directly.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#FFFBF7] flex items-center justify-center">
          <div className="text-center">
            <span className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin inline-block mb-3" />
            <p className="font-royal text-sm text-[#AA771C] font-semibold">Loading Asset Dossier...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#FFFBF7] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8 backdrop-blur-xl bg-white/70 rounded-3xl border border-[#E6D5B8]">
            <h1 className="text-2xl font-royal font-bold text-[#111111] mb-2 uppercase">Property Not Found</h1>
            <p className="text-sm text-[#666666] mb-6">The requested estate may have been archived or is private off-market.</p>
            <Link
              href="/projects"
              className="inline-block px-6 py-2.5 bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm"
            >
              Browse Active Portfolio →
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const imagesList = project.images && project.images.length > 0 ? project.images : [];
  const activeImage = imagesList[activeImageIdx] || imagesList[0];
  const whatsappNum = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+919876543210').replace(/\D/g, '');

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFBF7] pt-28 sm:pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Back Navigation Breadcrumb */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#AA771C] hover:text-black mb-8 transition-colors"
          >
            ← Back to All Properties
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content (2 Cols) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery and Carousel */}
              <div className="backdrop-blur-2xl bg-white/80 rounded-3xl border border-[#E6D5B8] p-4 shadow-[0_10px_35px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="relative h-80 sm:h-[420px] w-full rounded-2xl overflow-hidden bg-neutral-100 mb-4">
                  {activeImage?.url ? (
                    <Image
                      src={activeImage.url}
                      alt={activeImage.alt || project.name}
                      fill
                      priority
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#AA771C] font-semibold">
                      Architectural Visual Coming Soon
                    </div>
                  )}

                  <div className="absolute top-4 left-4 backdrop-blur-xl bg-black/60 border border-[#D4AF37]/50 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#FFE79A]">
                    {project.propertyType} • {project.status}
                  </div>
                </div>

                {/* Thumbnails if multiple images */}
                {imagesList.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {imagesList.map((img: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                          activeImageIdx === idx ? 'border-[#AA771C] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <Image src={img.url} alt={img.alt || `Visual ${idx + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Core Project Info Dossier */}
              <div className="backdrop-blur-2xl bg-white/80 rounded-3xl border border-[#E6D5B8] p-8 shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#AA771C] mb-1">
                  📍 {project.location}
                </p>
                <h1 className="font-royal text-3xl sm:text-5xl font-black uppercase text-[#111111] tracking-wide mb-3">
                  {project.name}
                </h1>

                {/* Pricing Banner */}
                <div className="p-5 rounded-2xl bg-[#FFFBF7] border border-[#E6D5B8] mb-8 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#666666]">Valuation & Investment</p>
                    <p className="font-royal text-2xl sm:text-3xl font-black text-[#AA771C]">
                      {project.price
                        ? `₹${(project.price / 10000000).toFixed(2)} Crores`
                        : project.priceRange?.min
                        ? `₹${(project.priceRange.min / 10000000).toFixed(2)} - ₹${(
                            project.priceRange.max / 10000000
                          ).toFixed(2)} Crores`
                        : 'Pricing On Private Request'}
                    </p>
                  </div>
                  {project.brochureUrl && (
                    <a
                      href={project.brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-white border border-[#E6D5B8] hover:border-[#AA771C] text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <span>📄</span> Download PDF Brochure
                    </a>
                  )}
                </div>

                {/* Key Specifications Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 pb-8 border-b border-[#E6D5B8]">
                  <div>
                    <p className="text-xs text-[#888888] font-medium uppercase tracking-wider">Property Type</p>
                    <p className="font-royal text-sm font-bold text-[#111111]">{project.propertyType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#888888] font-medium uppercase tracking-wider">Stage</p>
                    <p className="font-royal text-sm font-bold text-[#AA771C]">{project.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#888888] font-medium uppercase tracking-wider">Area / Dimensions</p>
                    <p className="font-royal text-sm font-bold text-[#111111]">
                      {project.size ? `${project.size} sq ft` : 'Bespoke Plot'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#888888] font-medium uppercase tracking-wider">Available Units</p>
                    <p className="font-royal text-sm font-bold text-[#111111]">
                      {project.units ? `${project.units} Residences` : 'Limited Release'}
                    </p>
                  </div>
                </div>

                {/* Architectural Description */}
                <div className="mb-8">
                  <h2 className="font-royal text-xl font-bold uppercase text-[#111111] mb-3">Architectural Overview</h2>
                  <p className="text-sm sm:text-base text-[#555555] font-light leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Amenities & Curated Features */}
                {project.amenities && project.amenities.length > 0 && (
                  <div className="mb-8">
                    <h2 className="font-royal text-xl font-bold uppercase text-[#111111] mb-4">
                      Signature Amenities & Facilities
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {project.amenities.map((amenity: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFFBF7] border border-[#E6D5B8]"
                        >
                          <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#AA771C] flex items-center justify-center font-bold text-xs">
                            ✦
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-[#222222]">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Floor Plan / Unit Pricing Table */}
                <div className="mb-8">
                  <h2 className="font-royal text-xl font-bold uppercase text-[#111111] mb-3">Unit Configuration</h2>
                  <div className="rounded-2xl border border-[#E6D5B8] overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-[#FAF6F0] border-b border-[#E6D5B8] font-bold text-[#111111]">
                        <tr>
                          <th className="p-3.5 text-left">Typology</th>
                          <th className="p-3.5 text-left">Super Built-up</th>
                          <th className="p-3.5 text-left">Price Indicator</th>
                          <th className="p-3.5 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E6D5B8]/50">
                        <tr>
                          <td className="p-3.5 font-semibold text-[#111111]">Signature Penthouse / Villa</td>
                          <td className="p-3.5 text-[#555555]">{project.size ? `${project.size} sq ft` : 'Custom'}</td>
                          <td className="p-3.5 font-bold text-[#AA771C]">
                            {project.price ? `₹${(project.price / 10000000).toFixed(2)} Cr` : 'On Request'}
                          </td>
                          <td className="p-3.5 text-emerald-700 font-semibold">{project.status}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Google Maps / Location Coordinates */}
                {project.location_lat && project.location_lng && (
                  <div>
                    <h2 className="font-royal text-xl font-bold uppercase text-[#111111] mb-3">Location Coordinates</h2>
                    <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E6D5B8] flex items-center justify-between">
                      <div className="text-xs">
                        <span className="font-semibold text-black">Coordinates: </span>
                        {project.location_lat.toFixed(4)}° N, {project.location_lng.toFixed(4)}° E ({project.location})
                      </div>
                      <a
                        href={`https://maps.google.com/?q=${project.location_lat},${project.location_lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E6D5B8] text-xs font-bold text-[#AA771C] hover:bg-[#AA771C] hover:text-white transition-colors"
                      >
                        Open in Google Maps ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Sidebar: Quick Actions & Enquiry / Visit Form */}
            <div className="space-y-6">
              {/* Quick Advisory Actions */}
              <div className="backdrop-blur-2xl bg-white/80 rounded-3xl border border-[#E6D5B8] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.06)] sticky top-28">
                <h3 className="font-royal text-lg font-bold uppercase text-[#111111] mb-4">Private Advisory</h3>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1">
                    <SaveButton projectSlug={project.slug} size="md" showLabel={true} />
                  </div>
                  <div className="flex-1">
                    <CompareButton projectSlug={project.slug} projectName={project.name} size="md" showLabel={true} />
                  </div>
                </div>

                {/* WhatsApp Link */}
                <a
                  href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(
                    `Hello Nivesh Ventures, I would like private advisory information regarding ${project.name} (${project.location}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all mb-3"
                >
                  <span>💬</span> WhatsApp Direct Advisory
                </a>

                {/* Phone Call */}
                <a
                  href="tel:+919876543210"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white border-2 border-[#AA771C] text-[#AA771C] hover:bg-[#FFFBF7] rounded-2xl font-bold text-xs uppercase tracking-wider transition-all mb-5"
                >
                  <span>📞</span> Direct Concierge Call
                </a>

                <div className="border-t border-[#E6D5B8] pt-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-royal text-sm font-bold uppercase text-[#111111]">
                      {enquiryForm.isSiteVisit ? 'Schedule Site Visit' : 'Submit Enquiry'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setEnquiryForm({ ...enquiryForm, isSiteVisit: !enquiryForm.isSiteVisit })}
                      className="text-[11px] font-bold text-[#AA771C] hover:underline"
                    >
                      {enquiryForm.isSiteVisit ? 'Switch to Enquiry' : 'Book Site Visit →'}
                    </button>
                  </div>

                  {feedback && (
                    <div
                      className={`mb-4 p-3 rounded-2xl text-xs font-semibold text-center ${
                        feedback.type === 'success'
                          ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                          : 'bg-red-50 border border-red-300 text-red-800'
                      }`}
                    >
                      {feedback.message}
                    </div>
                  )}

                  <form onSubmit={handleEnquirySubmit} className="space-y-3.5">
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name *"
                        required
                        value={enquiryForm.fullName}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E6D5B8] rounded-2xl text-xs font-medium text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <input
                        type="tel"
                        placeholder="Mobile Number *"
                        required
                        value={enquiryForm.mobileNumber}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, mobileNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E6D5B8] rounded-2xl text-xs font-medium text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        placeholder="Email Address (optional)"
                        value={enquiryForm.email}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E6D5B8] rounded-2xl text-xs font-medium text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <select
                        value={enquiryForm.budgetRange}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, budgetRange: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E6D5B8] rounded-2xl text-xs font-medium text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      >
                        <option value="">Select Budget Range</option>
                        <option value="Under 1Cr">Under ₹1 Crore</option>
                        <option value="1Cr-3Cr">₹1 Crore - ₹3 Crores</option>
                        <option value="3Cr-7Cr">₹3 Crores - ₹7 Crores</option>
                        <option value="Above 7Cr">Above ₹7 Crores (Ultra-Luxury)</option>
                      </select>
                    </div>

                    {enquiryForm.isSiteVisit && (
                      <div>
                        <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1">
                          Preferred Visit Date
                        </label>
                        <input
                          type="date"
                          value={enquiryForm.visitDate}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, visitDate: e.target.value })}
                          className="w-full px-3.5 py-2 bg-white border border-[#E6D5B8] rounded-2xl text-xs font-medium text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        />
                      </div>
                    )}

                    <div>
                      <textarea
                        rows={3}
                        placeholder={
                          enquiryForm.isSiteVisit
                            ? 'Special requirements, attendees, or timing preference...'
                            : 'Specific unit preference, inquiry details...'
                        }
                        value={enquiryForm.message}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E6D5B8] rounded-2xl text-xs font-medium text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                    >
                      {submitting
                        ? 'Submitting...'
                        : enquiryForm.isSiteVisit
                        ? 'Confirm Site Visit Schedule →'
                        : 'Submit Project Enquiry →'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Related Recommendations */}
          {relatedProjects.length > 0 && (
            <section className="mt-20">
              <div className="text-center max-w-xl mx-auto mb-10">
                <p className="font-script text-3xl sm:text-4xl text-[#AA771C] mb-1">Curated Portfolio</p>
                <h2 className="font-royal text-2xl sm:text-3xl font-black uppercase text-[#111111] tracking-wider">
                  Similar Architectural Properties
                </h2>
                <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProjects.map((rel: any) => (
                  <Link
                    key={rel.slug}
                    href={`/projects/${rel.slug}`}
                    className="backdrop-blur-xl bg-white/80 rounded-3xl border border-[#E6D5B8] overflow-hidden hover:border-[#D4AF37] hover:shadow-[0_15px_35px_rgba(212,175,55,0.2)] transition-all group block"
                  >
                    <div className="relative h-44 w-full bg-neutral-100 overflow-hidden">
                      {rel.images?.[0]?.url && (
                        <Image
                          src={rel.images[0].url}
                          alt={rel.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute top-3 left-3 backdrop-blur-md bg-black/60 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#FFE79A]">
                        {rel.propertyType}
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-[11px] font-semibold text-[#AA771C] mb-1">📍 {rel.location}</p>
                      <h3 className="font-royal text-base font-bold uppercase text-[#111111] group-hover:text-[#AA771C] transition-colors mb-2">
                        {rel.name}
                      </h3>
                      <p className="font-royal text-sm font-extrabold text-[#AA771C]">
                        {rel.price ? `₹${(rel.price / 10000000).toFixed(2)} Cr` : 'Pricing On Request'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
