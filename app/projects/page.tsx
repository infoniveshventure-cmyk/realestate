'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import SaveButton from '@/components/shared/SaveButton';
import CompareButton from '@/components/shared/CompareButton';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, currentPage: 1 });
  const [filters, setFilters] = useState({
    propertyType: '',
    status: '',
    search: '',
    sort: 'newest',
    minPrice: '',
    maxPrice: '',
    page: 1,
  });

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  async function fetchProjects() {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.propertyType) params.append('propertyType', filters.propertyType);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      params.append('page', String(filters.page));
      params.append('limit', '9');

      const res = await fetch(`/api/projects?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProjects(data.data || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setFilters({
      propertyType: '',
      status: '',
      search: '',
      sort: 'newest',
      minPrice: '',
      maxPrice: '',
      page: 1,
    });
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFBF7] pt-28 sm:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Title Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="font-script text-4xl sm:text-5xl text-[#AA771C] mb-1">Exclusive Portfolio</p>
            <h1 className="font-royal text-3xl sm:text-5xl font-black uppercase text-gold-3d tracking-wider mb-4">
              Architectural Properties
            </h1>
            <p className="text-sm sm:text-base text-[#555555] font-light leading-relaxed">
              Explore meticulously curated luxury residences, penthouses, villas, and landmark commercial estates.
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4" />
          </div>

          {/* Liquid Glass Filter Bar */}
          <div className="mb-12 backdrop-blur-2xl bg-white/70 border border-white/80 p-5 rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 mb-3.5">
              <input
                type="text"
                placeholder="Search by name, location..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="px-4 py-2.5 bg-white/80 border border-[#E6D5B8] rounded-2xl text-xs sm:text-sm font-medium text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
              <select
                value={filters.propertyType}
                onChange={(e) => setFilters({ ...filters, propertyType: e.target.value, page: 1 })}
                className="px-4 py-2.5 bg-white/80 border border-[#E6D5B8] rounded-2xl text-xs sm:text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="">All Property Types</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Plot">Plot & Land</option>
                <option value="Villa">Villa</option>
                <option value="Apartment">Apartment</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                className="px-4 py-2.5 bg-white/80 border border-[#E6D5B8] rounded-2xl text-xs sm:text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="">All Statuses</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
                className="px-4 py-2.5 bg-white/80 border border-[#E6D5B8] rounded-2xl text-xs sm:text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E6D5B8]/40">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  placeholder="Min Price (₹)"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value, page: 1 })}
                  className="w-32 sm:w-36 px-3 py-1.5 bg-white/80 border border-[#E6D5B8] rounded-xl text-xs font-medium text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
                <span className="text-xs text-neutral-400">—</span>
                <input
                  type="number"
                  placeholder="Max Price (₹)"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value, page: 1 })}
                  className="w-32 sm:w-36 px-3 py-1.5 bg-white/80 border border-[#E6D5B8] rounded-xl text-xs font-medium text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#AA771C]">
                  {pagination.total} {pagination.total === 1 ? 'Property' : 'Properties'} Found
                </span>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:scale-[1.02] transition-transform"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="py-20 text-center">
              <span className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin inline-block mb-3" />
              <p className="font-royal text-sm text-[#AA771C] font-semibold tracking-wider">Curating Assets...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-16 text-center backdrop-blur-md bg-white/40 rounded-3xl border border-white/60">
              <p className="font-royal text-base text-[#666666]">No properties match your filter criteria.</p>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2 bg-[#AA771C] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {projects.map((project: any) => (
                  <div
                    key={project._id || project.slug}
                    className="group relative block rounded-3xl overflow-hidden bg-white border border-[#E6D5B8] shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_45px_rgba(212,175,55,0.2)] hover:border-[#D4AF37] transition-all duration-500 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-64 w-full overflow-hidden bg-neutral-100">
                        {project.images?.[0]?.url ? (
                          <Image
                            src={project.images[0].url}
                            alt={project.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            Asset Visual
                          </div>
                        )}
                        <div className="absolute top-4 left-4 backdrop-blur-xl bg-black/60 border border-[#D4AF37]/50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#FFE79A]">
                          {project.propertyType} • {project.status}
                        </div>

                        {/* Top Right Save & Compare Controls */}
                        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                          <SaveButton projectSlug={project.slug} size="sm" showLabel={false} />
                          <CompareButton
                            projectSlug={project.slug}
                            projectName={project.name}
                            size="sm"
                            showLabel={false}
                          />
                        </div>
                      </div>

                      <div className="p-6">
                        <p className="text-xs text-[#AA771C] font-semibold uppercase tracking-wider mb-1">
                          📍 {project.location}
                        </p>
                        <Link href={`/projects/${project.slug}`}>
                          <h3 className="font-royal text-xl font-bold uppercase text-[#111111] group-hover:text-[#AA771C] transition-colors mb-2">
                            {project.name}
                          </h3>
                        </Link>
                        <p className="font-royal text-lg font-extrabold text-[#AA771C] mb-3">
                          {project.price
                            ? `₹${(project.price / 10000000).toFixed(2)} Cr`
                            : project.priceRange?.min
                            ? `₹${(project.priceRange.min / 10000000).toFixed(2)} - ₹${(
                                project.priceRange.max / 10000000
                              ).toFixed(2)} Cr`
                            : 'Price On Request'}
                        </p>
                        <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed mb-4">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-0">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="block w-full py-2.5 text-center rounded-xl bg-[#FAF6F0] hover:bg-[#AA771C] hover:text-white text-[#AA771C] font-bold text-xs uppercase tracking-wider transition-colors border border-[#E6D5B8]"
                      >
                        Explore Project Specs →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <button
                    disabled={filters.page <= 1}
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    className="px-4 py-2 rounded-xl bg-white border border-[#E6D5B8] text-xs font-bold uppercase tracking-wider text-black disabled:opacity-40 hover:border-[#AA771C] transition-all"
                  >
                    ← Previous
                  </button>
                  {Array.from({ length: pagination.pages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setFilters({ ...filters, page: idx + 1 })}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        filters.page === idx + 1
                          ? 'bg-[#AA771C] text-white shadow-sm'
                          : 'bg-white border border-[#E6D5B8] text-black hover:border-[#AA771C]'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    disabled={filters.page >= pagination.pages}
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    className="px-4 py-2 rounded-xl bg-white border border-[#E6D5B8] text-xs font-bold uppercase tracking-wider text-black disabled:opacity-40 hover:border-[#AA771C] transition-all"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
