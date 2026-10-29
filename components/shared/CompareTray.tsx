'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CompareTray() {
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      try {
        const saved = localStorage.getItem('compare_projects');
        setCompareSlugs(saved ? JSON.parse(saved) : []);
      } catch (e) {
        setCompareSlugs([]);
      }
    };
    update();
    window.addEventListener('storage', update);
    const interval = setInterval(update, 1000);
    return () => {
      window.removeEventListener('storage', update);
      clearInterval(interval);
    };
  }, []);

  if (!mounted || compareSlugs.length === 0) return null;

  return (
    <aside aria-label="Property comparison tray" className="fixed bottom-6 right-6 z-40 animate-fade-in">
      <div className="backdrop-blur-xl bg-white/85 border border-white/60 shadow-2xl rounded-2xl p-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center font-bold text-accent text-sm">
            {compareSlugs.length}
          </span>
          <div>
            <p className="text-xs font-semibold text-text-dark">Properties in Compare</p>
            <p className="text-[10px] text-text-grey">Up to 3 properties side by side</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/compare"
            className="px-4 py-2 bg-accent hover:bg-accent/90 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
          >
            Compare Now
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('compare_projects');
              setCompareSlugs([]);
            }}
            className="px-2 py-2 text-text-grey hover:text-red-500 text-xs transition-colors"
            title="Clear comparison"
          >
            ✕
          </button>
        </div>
      </div>
    </aside>
  );
}
