'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function PWARegister() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if user already dismissed it this session
    const isDismissed = sessionStorage.getItem('pwa_banner_dismissed');
    if (isDismissed) return;

    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('Service worker registration failed:', err);
        });
      });
    }

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
      sessionStorage.setItem('pwa_banner_dismissed', 'true');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-50 animate-in fade-in slide-in-from-bottom-4">
      {/* Liquid Glass Luxury PWA Capsule */}
      <div className="backdrop-blur-3xl bg-white/70 supports-[backdrop-filter]:bg-white/45 border border-white/70 shadow-[0_15px_40px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.8)] rounded-3xl p-3.5 sm:p-4 flex items-center gap-3.5 max-w-sm">
        
        {/* Real Logo in circular glass badge */}
        <div className="w-11 h-11 rounded-2xl backdrop-blur-md bg-white/90 border border-[#E6D5B8] flex items-center justify-center p-1.5 shadow-sm flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Nivesh Ventures"
            width={36}
            height={36}
            className="w-auto h-6 object-contain"
          />
        </div>

        {/* Text with Luxury Contrast */}
        <div className="flex-1 min-w-0 pr-1">
          <p className="font-royal text-xs font-bold uppercase tracking-wide text-[#111111] truncate">
            Install Nivesh App
          </p>
          <p className="text-[11px] text-[#555555] font-medium leading-tight">
            Fast browsing & offline properties
          </p>
        </div>

        {/* Liquid Gold Install Button */}
        <button
          onClick={handleInstallClick}
          className="px-3.5 py-1.5 bg-gradient-to-r from-[#FFE79A] via-[#D4AF37] to-[#AA771C] text-black text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-[0_2px_10px_rgba(212,175,55,0.35)] hover:scale-105 active:scale-95 transition-all border border-white/40 flex-shrink-0"
        >
          Install
        </button>

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="w-7 h-7 rounded-full backdrop-blur-md bg-black/5 hover:bg-black/15 text-[#555555] hover:text-black flex items-center justify-center text-xs transition-colors flex-shrink-0"
          aria-label="Dismiss install banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
