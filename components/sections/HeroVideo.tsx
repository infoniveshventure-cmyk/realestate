'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 615;

const FRAME_STORY = [
  {
    progress: 0.05,
    timestamp: '0:02',
    scriptPrefix: 'The Arrival',
    title: 'GRAND FACADE',
    detail: 'Bespoke Contemporary Estate',
    description:
      'Imposing symmetrical elevation sculpted from French limestone, expansive cobblestone motor court, and floor-to-ceiling thermal glass pavilions overlooking private grounds.',
    specs: ['1.2 Acre Gated Grounds', 'Triple Garage Pavilion', 'Architectural Water Wall'],
  },
  {
    progress: 0.28,
    timestamp: '0:12',
    scriptPrefix: 'The Oasis',
    title: 'AQUATIC REFLECTION',
    detail: 'Hydro-Harmonic Lap Pool',
    description:
      '50-foot infinity reflection pool engineered with synchronized arc fountains, Italian travertine sun decks, and panoramic water-facing outdoor lounge.',
    specs: ['50 FT Heated Lap Pool', 'Arc Fountain Jets', 'Travertine Sun Terraces'],
  },
  {
    progress: 0.55,
    timestamp: '0:24',
    scriptPrefix: 'The Living Salon',
    title: 'DOUBLE-HEIGHT GREAT ROOM',
    detail: 'Volumetric Architectural Mastery',
    description:
      '18-foot clear-span exposed white-oak timber beams, floating cantilevered steel staircase, herringbone masonry fireplace, and custom integrated artisan shelving.',
    specs: ['18 FT Vaulted Ceilings', 'Floating Steel Spine', 'Custom Oak Joinery'],
  },
  {
    progress: 0.78,
    timestamp: '0:35',
    scriptPrefix: 'The Sanctuary',
    title: 'SPA & WELLNESS RETREAT',
    detail: 'Nero Marquina Bookmatched Marble',
    description:
      'Freestanding solid-surface soaking tub nestled against floor-to-ceiling bookmatched marble slabs, brushed champagne gold fixtures, and concealed dual rainfall showers.',
    specs: ['Monolithic Soaking Tub', 'Concealed Rain Shower', 'Brushed Gold Fixtures'],
  },
  {
    progress: 0.95,
    timestamp: '0:40',
    scriptPrefix: 'The Gathering',
    title: 'CHEF & SOMMELIER SUITE',
    detail: 'Waterfall Marble Culinary Island',
    description:
      'Seamless continuous-vein marble breakfast island, integrated Sub-Zero refrigeration suite, bespoke cocktail bar with illuminated display, and sunlit morning salon.',
    specs: ['Waterfall Island', 'Sub-Zero & Wolf Suite', 'Sommelier Wine Lounge'],
  },
];

export default function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Cache to hold preloaded image objects
    const images: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES + 1).fill(null);
    let currentDrawnFrame = -1;
    let targetFrame = 1;

    const getFrameUrl = (idx: number) => {
      const padded = String(idx).padStart(4, '0');
      return `/frames/frame_${padded}.jpg`;
    };

    // Draw frame onto canvas with proper cover aspect ratio
    const drawImageCover = (img: HTMLImageElement) => {
      if (!img.naturalWidth || !img.naturalHeight) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      const scale = Math.max(cw / iw, ch / ih);
      const nw = iw * scale;
      const nh = ih * scale;
      const nx = (cw - nw) / 2;
      const ny = (ch - nh) / 2;

      ctx.drawImage(img, 0, 0, iw, ih, nx, ny, nw, nh);
    };

    const renderFrame = (index: number) => {
      const targetIdx = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(index)));
      if (targetIdx === currentDrawnFrame) return;

      const cached = images[targetIdx];
      if (cached && cached.complete && cached.naturalWidth > 0) {
        currentDrawnFrame = targetIdx;
        drawImageCover(cached);
        return;
      }

      // If requested frame isn't loaded yet and not already initiated, start loading it
      if (!cached) {
        const img = new Image();
        img.src = getFrameUrl(targetIdx);
        images[targetIdx] = img;
        img.onload = () => {
          if (targetIdx === targetFrame) {
            currentDrawnFrame = targetIdx;
            drawImageCover(img);
          }
        };
      }

      // Eagerly preload frames around the target frame immediately so upcoming frames are in RAM
      for (let lookahead = 1; lookahead <= 12; lookahead++) {
        const ahead = targetIdx + lookahead;
        if (ahead <= TOTAL_FRAMES && !images[ahead]) {
          const aheadImg = new Image();
          aheadImg.src = getFrameUrl(ahead);
          images[ahead] = aheadImg;
        }
        const behind = targetIdx - lookahead;
        if (behind >= 1 && !images[behind]) {
          const behindImg = new Image();
          behindImg.src = getFrameUrl(behind);
          images[behind] = behindImg;
        }
      }

      // Draw closest cached frame without searching large loops
      for (let offset = 1; offset < 20; offset++) {
        const prev = images[targetIdx - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          drawImageCover(prev);
          break;
        }
        const next = images[targetIdx + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          drawImageCover(next);
          break;
        }
      }
    };

    // Resize canvas to match display pixels with High-DPI / Retina devicePixelRatio support
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.imageSmoothingEnabled = true;

      if (currentDrawnFrame > 0 && images[currentDrawnFrame]) {
        drawImageCover(images[currentDrawnFrame]!);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Initial frame immediate preload & display
    const firstImg = new Image();
    firstImg.src = getFrameUrl(1);
    firstImg.onload = () => {
      images[1] = firstImg;
      currentDrawnFrame = 1;
      drawImageCover(firstImg);
    };

    // Preload next batch of 60 frames immediately
    for (let i = 2; i <= 60; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        images[i] = img;
      };
    }

    // Fast background preloader
    let currPreload = 61;
    const preloadInterval = setInterval(() => {
      if (currPreload > TOTAL_FRAMES) {
        clearInterval(preloadInterval);
        return;
      }
      for (let j = 0; j < 25 && currPreload <= TOTAL_FRAMES; j++, currPreload++) {
        const img = new Image();
        img.src = getFrameUrl(currPreload);
        images[currPreload] = img;
      }
    }, 25);

    // Butter-Smooth 60FPS Lerp Scroll Scrubbing Engine
    let targetProgress = 0;
    let currentProgress = 0;
    let animLoopId: number | null = null;

    const smoothScrollLoop = () => {
      // Lerp (Linear Interpolation) for silky smooth physics
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0001) {
        currentProgress += diff * 0.18; // 0.18 gives snappy yet fluid responsiveness
        const targetF = Math.round(1 + currentProgress * (TOTAL_FRAMES - 1));
        renderFrame(targetF);
      }
      animLoopId = requestAnimationFrame(smoothScrollLoop);
    };

    animLoopId = requestAnimationFrame(smoothScrollLoop);

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      targetProgress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
      targetFrame = Math.round(1 + targetProgress * (TOTAL_FRAMES - 1));
      setScrollProgress(Math.round(targetProgress * 100));

      // Calculate active frame story
      let bestIdx = 0;
      let minDiff = Infinity;
      FRAME_STORY.forEach((scene, idx) => {
        const d = Math.abs(targetProgress - scene.progress);
        if (d < minDiff) {
          minDiff = d;
          bestIdx = idx;
        }
      });
      setActiveIdx(bestIdx);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onScroll, { passive: true });
    window.addEventListener('touchmove', onScroll, { passive: true });

    // Initial run
    onScroll();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onScroll);
      window.removeEventListener('touchmove', onScroll);
      clearInterval(preloadInterval);
      if (animLoopId) cancelAnimationFrame(animLoopId);
    };
  }, []);

  const story = FRAME_STORY[activeIdx];

  return (
    <section ref={containerRef} className="relative h-[480vh] bg-transparent">
      {/* Pinned Fullscreen Canvas Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Hardware-Accelerated 60FPS Frame Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
        />

        {/* Subtle, soft bottom vignette only behind text to maintain crisp natural video colors */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Video Timecode Indicator */}
        <div className="absolute top-24 left-6 sm:left-12 z-20 flex items-center gap-3">
          <div className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/40 px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
            <span className="font-mono text-[11px] font-bold tracking-widest text-[#FFE79A] uppercase">
              NIVESH VENTURE REAL ESTATE
            </span>
          </div>
        </div>

        {/* Text Directly on Frame (NO CARD BOX) - Royal 3D Gold Typography */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-end pb-20 h-full pointer-events-none">
          <div className="max-w-3xl pointer-events-auto transition-all duration-700">
            {/* Elegant Script Cursive Prefix */}
            <p className="font-script text-4xl sm:text-5xl text-[#FFE79A] leading-none mb-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {story.scriptPrefix}
            </p>

            {/* 3D Embossed Metallic Royal Gold Heading */}
            <h1 className="font-royal text-3xl sm:text-5xl md:text-6xl font-black tracking-wider uppercase text-gold-3d leading-[1.1] mb-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              {story.title}
            </h1>

            {/* Sub-Headline with Gold Embellishment */}
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-12 bg-gradient-to-r from-[#D4AF37] to-transparent" />
              <p className="font-royal text-xs sm:text-sm font-bold tracking-widest uppercase text-[#DFC06B] drop-shadow-sm">
                {story.detail}
              </p>
            </div>

            {/* Frame Architectural Observation Description directly on image */}
            <p className="text-sm sm:text-base md:text-lg text-white/90 font-light leading-relaxed max-w-2xl mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              {story.description}
            </p>

            {/* Architectural Highlights Pills directly over video */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              {story.specs.map((spec, i) => (
                <span
                  key={i}
                  className="backdrop-blur-xl bg-black/60 border border-[#D4AF37]/50 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#FFE79A] tracking-wider uppercase shadow-lg"
                >
                  ✦ {spec}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link
                href="#properties-showcase"
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs tracking-widest uppercase shadow-[0_4px_20px_rgba(212,175,55,0.45)] hover:scale-105 transition-all duration-300 border border-white/40"
              >
                Explore Properties ↓
              </Link>

              <Link
                href="/contact"
                className="px-6 py-3 rounded-2xl backdrop-blur-xl bg-black/50 hover:bg-black/75 text-white font-bold text-xs tracking-widest uppercase border border-white/30 transition-all duration-300"
              >
                Schedule Private Tour
              </Link>
            </div>
          </div>
        </div>

        {/* Lateral Golden Progress Track */}
        <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-3">
          <span className="font-mono text-xs font-bold text-[#D4AF37]">{scrollProgress}%</span>
          <div className="w-1.5 h-44 bg-white/20 rounded-full relative overflow-hidden backdrop-blur-md">
            <div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#FFE79A] via-[#D4AF37] to-[#8B6508] transition-all duration-100"
              style={{ height: `${scrollProgress}%` }}
            />
          </div>
          <div className="flex flex-col gap-2">
            {FRAME_STORY.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeIdx === i
                  ? 'bg-[#FFE79A] shadow-[0_0_10px_#D4AF37] scale-150'
                  : 'bg-white/40'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Prompt at base */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-widest text-[#FFE79A] font-bold drop-shadow">
            Scroll to Walkthrough
          </span>
          <div className="w-4 h-6 border border-[#D4AF37] rounded-full flex justify-center pt-1">
            <div className="w-1 h-1.5 bg-[#D4AF37] rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
