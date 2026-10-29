'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-[#111111] text-white border-t border-[#222222]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Company Info */}
          <div>
            <Image
              src="/logo.png"
              alt="Nivesh Ventures"
              width={120}
              height={50}
              className="h-10 w-auto mb-4 object-contain brightness-110"
            />
            <p className="text-xs font-semibold text-[#C5A572] uppercase tracking-widest mb-2">
              Together We Grow
            </p>
            <p className="text-xs text-white/60 leading-relaxed">
              Curating architectural landmarks and luxury investments across India's most coveted destinations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-bold text-[#C5A572] text-sm uppercase tracking-wider mb-4">
              Portfolio
            </h3>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <Link href="/projects" className="hover:text-[#C5A572] transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link href="/saved-projects" className="hover:text-[#C5A572] transition-colors">
                  Saved Shortlist
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-[#C5A572] transition-colors">
                  Property Comparison
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C5A572] transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-serif font-bold text-[#C5A572] text-sm uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <Link href="/services" className="hover:text-[#C5A572] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/why-invest" className="hover:text-[#C5A572] transition-colors">
                  Why Invest
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[#C5A572] transition-colors">
                  News & Insights
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#C5A572] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif font-bold text-[#C5A572] text-sm uppercase tracking-wider mb-4">
              Private Advisory
            </h3>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>Email: info@niveshventures.com</li>
              <li>Phone: +91 9876543210</li>
              <li>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C5A572] hover:underline flex items-center gap-1.5 mt-2"
                >
                  <span>💬</span> Direct WhatsApp Advisory
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>&copy; {year} Nivesh Ventures. All rights reserved. Together We Grow.</p>
          <p className="text-[#C5A572]">Architectural Excellence • Verified Real Estate</p>
        </div>
      </div>
    </footer>
  );
}
