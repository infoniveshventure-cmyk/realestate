'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import CompareButton from '@/components/shared/CompareButton';

export default function SavedProjectsPage() {
  const [savedProjects, setSavedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedProjects();
  }, []);

  async function loadSavedProjects() {
    try {
      const saved = localStorage.getItem('saved_projects');
      if (!saved) {
        setLoading(false);
        return;
      }

      const projectIds = JSON.parse(saved) as string[];
      const projects = await Promise.all(
        projectIds.map(async (id) => {
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

      // Safe handle deleted, unpublished, or null
      setSavedProjects(projects.filter(Boolean));
    } catch (error) {
      console.error('Failed to load saved projects:', error);
    } finally {
      setLoading(false);
    }
  }

  function removeSavedProject(slug: string) {
    const saved = localStorage.getItem('saved_projects');
    if (saved) {
      const ids = JSON.parse(saved).filter((id: string) => id !== slug);
      localStorage.setItem('saved_projects', JSON.stringify(ids));
      setSavedProjects(savedProjects.filter((p) => p.slug !== slug));
      window.dispatchEvent(new Event('saved_projects_updated'));
    }
  }

  function clearAll() {
    if (confirm('Clear all saved properties from your shortlist?')) {
      localStorage.removeItem('saved_projects');
      setSavedProjects([]);
      window.dispatchEvent(new Event('saved_projects_updated'));
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FFFBF7] pt-28 sm:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="font-script text-4xl sm:text-5xl text-[#AA771C] mb-1">Your Curated Collection</p>
            <h1 className="font-royal text-3xl sm:text-5xl font-black uppercase text-gold-3d tracking-wider mb-3">
              Saved Residences
            </h1>
            <p className="text-sm sm:text-base text-[#555555]">
              Privately bookmarked assets and estates saved for comparison & advisory review.
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4" />
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <span className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin inline-block mb-3" />
              <p className="font-royal text-sm text-[#AA771C] font-semibold">Loading Collection...</p>
            </div>
          ) : savedProjects.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/70 rounded-3xl border border-[#E6D5B8] p-12 text-center max-w-xl mx-auto shadow-sm">
              <p className="font-royal text-lg text-[#333333] mb-2 font-bold">No Saved Properties Yet</p>
              <p className="text-sm text-[#666666] mb-6">Explore our curated portfolio and bookmark residences to compare.</p>
              <Link
                href="/projects"
                className="inline-block px-7 py-3 bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#AA771C] text-black rounded-2xl font-extrabold text-xs tracking-widest uppercase shadow-md hover:scale-105 transition-all"
              >
                Explore Properties →
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs font-bold text-[#AA771C] uppercase tracking-wider">
                  {savedProjects.length} Bookmarked {savedProjects.length === 1 ? 'Estate' : 'Estates'}
                </span>
                <div className="flex items-center gap-3">
                  <Link
                    href="/compare"
                    className="px-4 py-2 bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#AA771C] text-black rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-sm hover:scale-105 transition-all"
                  >
                    Compare Bookmarked Properties ↗
                  </Link>
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-wider rounded-xl border border-red-200 bg-white"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedProjects.map((project) => (
                  <div
                    key={project.slug}
                    className="bg-white rounded-3xl border border-[#E6D5B8] overflow-hidden hover:border-[#D4AF37] hover:shadow-[0_15px_35px_rgba(212,175,55,0.2)] transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative h-56 bg-neutral-100">
                        {project.images?.[0]?.url ? (
                          <Image
                            src={project.images[0].url}
                            alt={project.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            Asset Visual
                          </div>
                        )}
                        <div className="absolute top-3 left-3 backdrop-blur-md bg-black/60 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#FFE79A]">
                          {project.propertyType} • {project.status}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <p className="text-xs text-[#AA771C] font-semibold uppercase tracking-wider mb-1">
                          📍 {project.location}
                        </p>
                        <h3 className="font-royal text-xl font-bold uppercase text-[#111111] mb-2">{project.name}</h3>
                        <p className="font-royal text-lg font-black text-[#AA771C] mb-3">
                          {project.price ? `₹${(project.price / 10000000).toFixed(2)} Cr` : 'Price On Request'}
                        </p>
                        <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed mb-4">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0 flex gap-2">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="flex-1 px-4 py-2.5 bg-[#FAF6F0] hover:bg-[#AA771C] hover:text-white text-[#AA771C] rounded-xl text-xs font-bold uppercase tracking-wider text-center border border-[#E6D5B8] transition-colors"
                      >
                        View Specs
                      </Link>
                      <div className="flex-1">
                        <CompareButton
                          projectSlug={project.slug}
                          projectName={project.name}
                          size="md"
                          showLabel={true}
                        />
                      </div>
                      <button
                        onClick={() => removeSavedProject(project.slug)}
                        className="px-3 py-2.5 border border-red-200 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors"
                        title="Remove from bookmarks"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
