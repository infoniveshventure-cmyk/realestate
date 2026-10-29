'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Saved', href: '/saved-projects' },
    { label: 'Compare', href: '/compare' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Why Invest', href: '/why-invest' },
    { label: 'News & Insights', href: '/news' },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        
        {/* DESKTOP CAPSULE BAR */}
        <div className="hidden lg:flex pointer-events-auto backdrop-blur-3xl bg-white/35 supports-[backdrop-filter]:bg-white/20 border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.7)] rounded-full px-6 justify-between items-center h-16 transition-all duration-300">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center group">
            <div className="px-3 py-1.5 rounded-xl transition-all duration-300">
              <Image
                src="/logo.png"
                alt="Nivesh Ventures"
                width={120}
                height={46}
                className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="flex items-center space-x-1.5 xl:space-x-2">
            {navItems.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setCurrentPath(item.href)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#AA771C] text-black shadow-[0_4px_15px_rgba(212,175,55,0.45)] border border-white/60 scale-105'
                      : 'text-[#1A1A1A] hover:text-black hover:bg-gradient-to-r hover:from-[#FFE79A] hover:via-[#D4AF37] hover:to-[#AA771C] hover:border-white/50 hover:shadow-[0_4px_15px_rgba(212,175,55,0.35)] backdrop-blur-md bg-white/25 border border-white/40'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-[11px] tracking-wider uppercase shadow-[0_4px_16px_rgba(212,175,55,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 border border-white/60"
            >
              Enquire Now
            </Link>
          </div>
        </div>

        {/* MOBILE TOP BAR: SEPARATE CIRCULAR LOGO & CIRCULAR HAMBURGER */}
        <div className="lg:hidden flex items-center justify-between w-full pointer-events-auto">
          {/* Circular Liquid Glass Logo */}
          <Link
            href="/"
            className="w-13 h-13 rounded-full backdrop-blur-3xl bg-white/30 supports-[backdrop-filter]:bg-white/20 border border-white/60 shadow-[0_8px_25px_rgba(0,0,0,0.18),inset_0_1px_1px_rgba(255,255,255,0.8)] flex items-center justify-center p-2 transition-all active:scale-95"
          >
            <Image
              src="/logo.png"
              alt="Nivesh Ventures"
              width={42}
              height={42}
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>

          {/* Circular Liquid Glass Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-13 h-13 rounded-full backdrop-blur-3xl bg-white/30 supports-[backdrop-filter]:bg-white/20 border border-white/60 shadow-[0_8px_25px_rgba(0,0,0,0.18),inset_0_1px_1px_rgba(255,255,255,0.8)] flex items-center justify-center text-black active:scale-95 transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* MOBILE SLIDE-DOWN DRAWER: 1-COLUMN SINGLE-SIDE LIQUID GLASS MENU */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto lg:hidden mt-3 backdrop-blur-3xl bg-white/40 supports-[backdrop-filter]:bg-white/25 border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-3xl p-5 transition-all duration-300 animate-in fade-in slide-in-from-top-3 max-h-[80vh] overflow-y-auto">
            {/* Single-Column List of Nav Links (Ek Side Me Ek-Ek Karke) */}
            <div className="flex flex-col space-y-2 mb-4">
              {navItems.map((item) => {
                const isActive = currentPath === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setCurrentPath(item.href);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-5 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#AA771C] text-black shadow-md border border-white/60 scale-[1.02]'
                        : 'backdrop-blur-md bg-white/30 border border-white/40 text-[#111111] hover:bg-gradient-to-r hover:from-[#FFE79A] hover:via-[#D4AF37] hover:to-[#AA771C] hover:text-black'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-xs opacity-60">→</span>
                  </Link>
                );
              })}
            </div>

            {/* Enquire Now CTA inside Mobile Drawer */}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-3.5 rounded-2xl bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs tracking-widest uppercase shadow-[0_6px_25px_rgba(212,175,55,0.45)] border border-white/60"
            >
              Enquire Now →
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
