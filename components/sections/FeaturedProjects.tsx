'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { IProject } from '@/lib/db/models/Project';
import SaveButton from '@/components/shared/SaveButton';
import CompareButton from '@/components/shared/CompareButton';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects?limit=5');
        const data = await res.json();
        if (data.success && data.data) {
          setProjects(data.data.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // One-by-One Fullscreen Slide Reveal Animation
  useEffect(() => {
    if (loading || projects.length === 0) return;

    const sections = gsap.utils.toArray<HTMLElement>('.fullscreen-property-slide');

    sections.forEach((slide) => {
      const content = slide.querySelector('.slide-content');
      const bgImg = slide.querySelector('.slide-image');

      gsap.fromTo(
        content,
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: slide,
            start: 'top 70%',
            end: 'top 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      if (bgImg) {
        gsap.fromTo(
          bgImg,
          { scale: 1.15 },
          {
            scale: 1.0,
            duration: 1.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: slide,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [loading, projects]);

  return (
    <section id="properties-showcase" ref={sectionRef} className="relative bg-[#FFFBF7] py-12">
      {/* Header Introduction */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-12 text-center">
        <p className="font-script text-4xl sm:text-5xl text-[#AA771C] mb-1">
          Handcrafted Portfolio
        </p>
        <h2 className="font-royal text-3xl sm:text-5xl font-black uppercase text-gold-3d tracking-wider mb-3">
          Curated Architectural Icons
        </h2>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
      </div>

      {/* 5 Stacking Cards: each sticks to top-20 and the next card slides up smoothly over it */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        {projects.map((project, idx) => (
          <div
            key={project.slug || idx}
            className="sticky top-20 sm:top-24 w-full h-[85vh] sm:h-[88vh] rounded-[2.5rem] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border border-[#E6D5B8] bg-white transition-all duration-500"
            style={{
              zIndex: idx + 10,
              top: `${5 + idx * 1.5}rem`, // Cascading stack offset so previous cards remain slightly visible at the top edge
            }}
          >
            {/* Fullscreen High-Resolution Architectural Photo (Natural Colors, No Heavy Blackish Mask) */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              {project.images?.[0]?.url ? (
                <Image
                  src={project.images[0].url}
                  alt={project.name}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-[#FAF6F0] flex items-center justify-center text-[#AA771C]">
                  Image Coming Soon
                </div>
              )}
            </div>

            {/* Clean, Gentle Bottom Gradient ONLY to make text 100% crisp without making photo dark */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            {/* Top Floating Glass Metadata & Quick Save/Compare */}
            <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-royal text-xl sm:text-2xl font-black text-gold-3d drop-shadow">
                  0{idx + 1}
                </span>
                <span className="text-white/60">/</span>
                <span className="backdrop-blur-xl bg-black/40 border border-[#D4AF37]/50 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest text-[#FFE79A] shadow-md">
                  {project.propertyType} • {project.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <SaveButton projectSlug={project.slug} size="md" showLabel={false} />
                <CompareButton
                  projectSlug={project.slug}
                  projectName={project.name}
                  size="md"
                  showLabel={false}
                />
              </div>
            </div>

            {/* Content directly over photo with 3D Embossed Metallic Royal Gold design */}
            <div className="relative z-20 w-full h-full flex flex-col justify-end p-6 sm:p-12 pointer-events-none">
              <div className="max-w-3xl pointer-events-auto">
                {/* Location Tag */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">📍</span>
                  <p className="font-royal text-xs sm:text-sm font-bold tracking-widest uppercase text-[#FFE79A] drop-shadow">
                    {project.location}
                  </p>
                </div>

                {/* Royal 3D Gold Heading */}
                <h3 className="font-royal text-3xl sm:text-5xl md:text-6xl font-black tracking-wider uppercase text-gold-3d leading-none mb-3 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                  {project.name}
                </h3>

                {/* Price Callout */}
                <p className="font-royal text-xl sm:text-2xl font-extrabold text-[#DFC06B] mb-3 drop-shadow">
                  {project.price
                    ? `₹${(project.price / 10000000).toFixed(2)} Crores`
                    : 'Pricing On Request'}
                </p>

                {/* Description directly over photo */}
                <p className="text-xs sm:text-sm md:text-base text-white/95 font-light leading-relaxed max-w-2xl mb-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] line-clamp-2 sm:line-clamp-3">
                  {project.description}
                </p>

                {/* Amenities & Dimensions Pills */}
                {project.amenities && (
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {project.size && (
                      <span className="backdrop-blur-md bg-black/50 border border-[#D4AF37]/50 px-3 py-1 rounded-xl text-xs font-semibold text-[#FFE79A]">
                        📐 {project.size} sq.ft
                      </span>
                    )}
                    {project.amenities.slice(0, 3).map((amenity, i) => (
                      <span
                        key={i}
                        className="backdrop-blur-md bg-black/40 border border-white/20 px-3 py-1 rounded-xl text-xs font-medium text-white/90"
                      >
                        ✦ {amenity}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs tracking-widest uppercase shadow-[0_4px_20px_rgba(212,175,55,0.45)] hover:scale-105 transition-all duration-300 border border-white/40"
                  >
                    View Project Specs →
                  </Link>

                  <Link
                    href="/contact"
                    className="px-5 py-2.5 rounded-xl backdrop-blur-md bg-black/50 hover:bg-black/75 text-white font-bold text-xs tracking-widest uppercase border border-white/30 transition-all duration-300"
                  >
                    Enquire Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Lateral Card Counter on Bottom Right */}
            <div className="absolute right-6 sm:right-10 bottom-6 sm:bottom-10 z-20 hidden md:block">
              <span className="font-mono text-xs text-[#DFC06B] font-bold tracking-widest backdrop-blur-md bg-black/40 px-3 py-1 rounded-full border border-[#D4AF37]/40">
                CARD 0{idx + 1} / 05
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
