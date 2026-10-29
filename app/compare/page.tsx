'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function ComparePage() {
  const [compareProjects, setCompareProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComparisonProjects();
  }, []);

  async function loadComparisonProjects() {
    try {
      const compare = localStorage.getItem('compare_projects');
      if (!compare) {
        setLoading(false);
        return;
      }

      const projectIds = JSON.parse(compare) as string[];
      const projects = await Promise.all(
        projectIds.slice(0, 3).map(async (id) => {
          try {
            const res = await fetch(`/api/projects/${id}`);
            if (res.ok) {
              const data = await res.json();
              return data.data;
            }
          } catch (error) {
            console.error(`Failed to fetch project ${id}:`, error);
          }
          return null;
        })
      );

      setCompareProjects(projects.filter(Boolean));
    } catch (error) {
      console.error('Failed to load comparison:', error);
    } finally {
      setLoading(false);
    }
  }

  function removeProject(slug: string) {
    const compare = localStorage.getItem('compare_projects');
    if (compare) {
      const ids = JSON.parse(compare).filter((id: string) => id !== slug);
      localStorage.setItem('compare_projects', JSON.stringify(ids));
      setCompareProjects(compareProjects.filter((p) => p.slug !== slug));
      window.dispatchEvent(new Event('compare_projects_updated'));
    }
  }

  function clearAll() {
    localStorage.removeItem('compare_projects');
    setCompareProjects([]);
    window.dispatchEvent(new Event('compare_projects_updated'));
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#FFFBF7] flex items-center justify-center">
          <div className="text-center">
            <span className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin inline-block mb-3" />
            <p className="font-royal text-sm text-[#AA771C] font-semibold">Comparing Portfolios...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (compareProjects.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#FFFBF7] pt-28 sm:pt-32 pb-20">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="backdrop-blur-xl bg-white/70 rounded-3xl border border-[#E6D5B8] p-10 shadow-sm">
              <h1 className="font-royal text-2xl font-bold uppercase text-[#111111] mb-2">No Properties Selected</h1>
              <p className="text-xs sm:text-sm text-[#666666] mb-6">
                You can compare up to three properties side by side. Add properties directly from the portfolio or your saved collection.
              </p>
              <Link
                href="/projects"
                className="inline-block px-7 py-3 bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#AA771C] text-black rounded-2xl font-extrabold text-xs tracking-widest uppercase shadow-md hover:scale-105 transition-all"
              >
                Browse Projects →
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFBF7] pt-28 sm:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="font-script text-4xl sm:text-5xl text-[#AA771C] mb-1">Side-by-Side Analysis</p>
            <h1 className="font-royal text-3xl sm:text-5xl font-black uppercase text-gold-3d tracking-wider mb-3">
              Compare Estates
            </h1>
            <p className="text-sm sm:text-base text-[#555555]">
              Detailed architectural metrics, price evaluations, amenities, and specification comparisons (Maximum 3).
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4" />
          </div>

          {/* Comparison Table with Liquid Glass Card */}
          <div className="backdrop-blur-2xl bg-white/80 rounded-3xl border border-[#E6D5B8] shadow-[0_10px_35px_rgba(0,0,0,0.06)] overflow-x-auto p-4 sm:p-6 mb-8">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#E6D5B8]">
                  <th className="px-5 py-4 text-left font-royal uppercase tracking-wider text-[#111111] w-48">
                    Specifications
                  </th>
                  {compareProjects.map((project) => (
                    <th key={project.slug} className="px-5 py-4 text-left align-top min-w-[240px]">
                      {project.images?.[0]?.url && (
                        <div className="relative h-28 w-full rounded-xl overflow-hidden mb-3">
                          <Image src={project.images[0].url} alt={project.name} fill className="object-cover" />
                        </div>
                      )}
                      <div className="font-royal text-base font-bold uppercase text-[#111111]">{project.name}</div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <Link href={`/projects/${project.slug}`} className="text-[11px] font-bold text-[#AA771C] hover:underline">
                          View Specs →
                        </Link>
                        <button
                          onClick={() => removeProject(project.slug)}
                          className="text-[11px] font-bold text-red-500 hover:underline"
                        >
                          Remove ✕
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6D5B8]/40">
                {[
                  {
                    label: 'Property Type',
                    render: (p: any) => (
                      <span className="font-semibold text-[#111111]">{p.propertyType || '—'}</span>
                    ),
                  },
                  {
                    label: 'Status',
                    render: (p: any) => (
                      <span className="px-2.5 py-1 rounded-full bg-[#FAF6F0] border border-[#E6D5B8] text-[11px] font-bold text-[#AA771C]">
                        {p.status || '—'}
                      </span>
                    ),
                  },
                  {
                    label: 'Price Valuation',
                    render: (p: any) => (
                      <span className="font-royal font-black text-sm text-[#AA771C]">
                        {p.price
                          ? `₹${(p.price / 10000000).toFixed(2)} Cr`
                          : p.priceRange?.min
                          ? `₹${(p.priceRange.min / 10000000).toFixed(2)} - ₹${(
                              p.priceRange.max / 10000000
                            ).toFixed(2)} Cr`
                          : 'On Request'}
                      </span>
                    ),
                  },
                  {
                    label: 'Location',
                    render: (p: any) => <span className="text-[#333333]">📍 {p.location || '—'}</span>,
                  },
                  {
                    label: 'Area / Dimensions',
                    render: (p: any) => (
                      <span className="text-[#333333] font-medium">{p.size ? `${p.size} sq ft` : 'Custom Plot'}</span>
                    ),
                  },
                  {
                    label: 'Available Units',
                    render: (p: any) => (
                      <span className="text-[#333333]">{p.units ? `${p.units} Units` : 'Exclusive Release'}</span>
                    ),
                  },
                  {
                    label: 'Curated Amenities',
                    render: (p: any) =>
                      p.amenities && p.amenities.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {p.amenities.map((a: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-lg bg-[#FFFBF7] border border-[#E6D5B8] text-[11px] text-[#444444]"
                            >
                              ✦ {a}
                            </span>
                          ))}
                        </div>
                      ) : (
                        '—'
                      ),
                  },
                ].map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white/60' : 'bg-transparent'}>
                    <td className="px-5 py-3.5 font-bold text-[#111111]">{row.label}</td>
                    {compareProjects.map((project) => (
                      <td key={project.slug} className="px-5 py-3.5 text-xs text-[#555555]">
                        {row.render(project)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {compareProjects.length < 3 && (
              <Link
                href="/projects"
                className="px-6 py-2.5 bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#AA771C] text-black rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-sm hover:scale-105 transition-all"
              >
                + Add Another Property (Max 3)
              </Link>
            )}
            <button
              onClick={clearAll}
              className="px-6 py-2.5 bg-white border border-red-300 text-red-500 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-50 transition-colors"
            >
              Clear Comparison
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
